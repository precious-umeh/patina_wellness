import { env } from "../config/env.js";
import { sendEmail } from "../config/mail.js";

import Inquiry from "../models/inquiry.js";

import { getNigeriaDateOnly } from "../utils/dateUtils.js";
import { inquiryNotificationTemplate } from "../utils/emailTemplates.js";

/**
 * ============================================
 * GENERATE INQUIRY ID
 * ============================================
 */
const generateInquiryId = function () {
  const date = getNigeriaDateOnly().replace(/-/g, "");
  const randomNumber = Math.floor(1000 + Math.random() * 9000);

  return `INQ-${date}-${randomNumber}`;
};

/**
 * ============================================
 * CREATE INQUIRY
 * ============================================
 */
export async function createInquiry(req, res) {
  try {
    const { fullName, email, phone, topic, message } = req.body;

    if (!fullName || !email || !topic || !message) {
      return res.status(400).json({
        message: "Please provide all required inquiry information.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
      });
    }

    const inquiry = await Inquiry.create({
      inquiryId: generateInquiryId(),
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: phone?.trim() || "",
      topic,
      message: message.trim(),
      status: "new",
    });

    try {
      await sendEmail({
        to: env.adminEmail,
        subject: "New Inquiry Message",
        html: inquiryNotificationTemplate(inquiry),
      });
    } catch (error) {
      console.error("Admin Inquiry Notification Error:", error);
    }

    return res.status(201).json({
      message: "Your inquiry has been submitted successfully.",
      inquiry: {
        id: inquiry._id,
        inquiryId: inquiry.inquiryId,
        status: inquiry.status,
      },
    });
  } catch (error) {
    console.error("Create Inquiry Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Unable to create inquiry. Please try again.",
      });
    }

    return res.status(500).json({
      message: "Error submitting inquiry.",
    });
  }
}

/**
 * ============================================
 * GET ALL INQUIRIES
 * ============================================
 */
export async function getInquiries(req, res) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);

    const search = req.query.search?.trim() || "";
    const status = req.query.status?.trim() || "all";

    const allowedStatuses = ["new", "read", "replied", "resolved"];

    // Validate Status
    if (status !== "all" && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid inquiries status filter.",
      });
    }

    // Build MongoDB filter
    const filter = {};

    if (status !== "all") {
      filter.status = status;
    }

    // Search across relevant fields
    if (search) {
      const searchRegex = new RegExp(
        search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i",
      );

      filter.$or = [
        { inquiryId: searchRegex },
        { fullName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { message: searchRegex },
        { topic: searchRegex },
      ];
    }

    const skip = (page - 1) * limit;

    const [
      inquiries,
      totalMatchingInquiries,
      totalInquiries,
      newInquiries,
      repliedInquiries,
      resolvedInquiries,
    ] = await Promise.all([
      // Paginated inquiries
      Inquiry.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-__v"),

      //Total inquiries matching current search/filter
      Inquiry.countDocuments(filter),

      // Global Statistics
      Inquiry.countDocuments(),

      Inquiry.countDocuments({
        status: "new",
      }),

      Inquiry.countDocuments({
        status: "replied",
      }),

      Inquiry.countDocuments({
        status: "resolved",
      }),
    ]);

    const totalPages = Math.max(Math.ceil(totalMatchingInquiries / limit), 1);

    return res.status(200).json({
      message: "Inquiries retrieved successfully.",

      inquiries,

      pagination: {
        currentPage: page,
        pageSize: limit,
        totalInquiries: totalMatchingInquiries,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },

      stats: {
        total: totalInquiries,
        new: newInquiries,
        replied: repliedInquiries,
        resolved: resolvedInquiries,
      },
    });
  } catch (error) {
    console.error("Get Inquiries Error:", error);

    return res.status(500).json({
      message: "Error retrieving inquiries.",
    });
  }
}

/**
 * ============================================
 * GET NEW INQUIRIES
 * ============================================
 */
export async function getNewInquiries(req, res) {
  try {
    const limit = Number(req.query.limit) || 10;

    const [inquiries, newCount] = await Promise.all([
      Inquiry.find({
        status: "new",
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select("-__v"),

      Inquiry.countDocuments({
        status: "new",
      }),
    ]);

    return res.status(200).json({
      message: "New inquiries retrieved successfully.",
      count: inquiries.length,
      totalNew: newCount,
      inquiries,
    });
  } catch (error) {
    console.error("Get New Inquiries Error:", error);

    return res.status(500).json({
      message: "Error retrieving new inquiries.",
    });
  }
}

/**
 * ============================================
 * GET SINGLE INQUIRY
 * ============================================
 */
export async function getInquiry(req, res) {
  try {
    const { id } = req.params;

    const inquiry = await Inquiry.findById(id).select("-__v");

    if (!inquiry) {
      return res.status(404).json({
        message: "Inquiry not found.",
      });
    }

    return res.status(200).json({
      message: "Inquiry retrieved successfully.",
      inquiry,
    });
  } catch (error) {
    console.error("Get Inquiry Error:", error);

    return res.status(500).json({
      message: "Error retrieving inquiry.",
    });
  }
}

/**
 * ============================================
 * UPDATE INQUIRY
 * ============================================
 */
export async function updateInquiry(req, res) {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const allowedStatuses = ["new", "read", "replied", "resolved"];

    if (!status) {
      return res.status(400).json({
        message: "Inquiry status is required.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid inquiry status",
      });
    }

    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
      return res.status(404).json({
        message: "Inquiry not found.",
      });
    }

    // Update inquiry status
    inquiry.status = status;

    // Update admin notes if provided
    if (adminNotes !== undefined) {
      inquiry.adminNotes = adminNotes.trim();
    }

    await inquiry.save();

    return res.status(200).json({
      message: "Inquiry updated successfully.",
      inquiry,
    });
  } catch (error) {
    console.error("Update Inquiry Error:", error);

    return res.status(500).json({
      message: "Error updating inquiry.",
    });
  }
}

/**
 * ============================================
 * DELETE INQUIRY
 * ============================================
 */
export async function deleteInquiry(req, res) {
  try {
    const { id } = req.params;

    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
      return res.status(404).json({
        message: "Inquiry not found.",
      });
    }

    await Inquiry.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Inquiry deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Inquiry Error:", error);

    return res.status(500).json({
      message: "Error deleting inquiry.",
    });
  }
}
