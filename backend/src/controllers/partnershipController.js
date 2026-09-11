import { env } from "../config/env.js";
import { sendEmail } from "../config/mail.js";

import PartnershipApplication from "../models/partnership.js";

import { getNigeriaDateOnly } from "../utils/dateUtils.js";
import { partnershipNotificationTemplate } from "../utils/emailTemplates.js";

/**
 * ========================================
 * GENERATE PARTNETSHIP APPLICATION ID
 * ========================================
 */
const generateApplicationId = function () {
  const date = getNigeriaDateOnly().replace(/-/g, "");
  const randomNumber = Math.floor(1000 + Math.random() * 9000);

  return `PA-${date}-${randomNumber}`;
};

/**
 * ========================================
 * CREATE PARTNETSHIP APPLICATION
 * ========================================
 */
export async function createPartnership(req, res) {
  try {
    const {
      partnershipType,
      fullName,
      email,
      phoneNumber,
      organisationName,
      industry,
      companySize,
      areaOfSpecialty,
      websiteOrSocial,
      partnershipGoals,
      preferredContactMethod,
      consent,
    } = req.body;

    // Basic Required Fields
    if (
      !partnershipType ||
      !fullName ||
      !email ||
      !phoneNumber ||
      !partnershipGoals ||
      !preferredContactMethod
    ) {
      return res.status(400).json({
        message: "Please provide all required partnership information.",
      });
    }

    // Validate Partnership Type
    const allowedPartnershipTypes = ["corporate", "practitioner", "ambassador"];

    if (!allowedPartnershipTypes.includes(partnershipType)) {
      return res.status(400).json({
        message: "Invalid partnership type.",
      });
    }

    // Validate Contact Method
    const allowedContactMethods = ["Email", "WhatsApp", "Phone Call"];

    if (!allowedContactMethods.includes(preferredContactMethod)) {
      return res.status(400).json({
        message: "Invalid preferred contact method.",
      });
    }

    // Validate Consent
    if (consent !== true) {
      return res.status(400).json({
        message:
          "Consent is required before submitting a partnership application.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
      });
    }

    /**
     * Partnership Specific Validation
     */
    // Corporate
    if (partnershipType === "corporate") {
      if (!organisationName?.trim() || !industry?.trim() || !companySize) {
        return res.status(400).json({
          message:
            "Please provide all required corporate partnership information.",
        });
      }

      const allowedCompanySizes = [
        "1 - 15 employees",
        "16 - 50 employees",
        "51 - 200 employees",
        "201 - 500 employees",
        "500+ employees",
      ];

      if (!allowedCompanySizes.includes(companySize)) {
        return res.status(400).json({
          message: "Invalid company size.",
        });
      }
    }

    // Practitioner
    if (partnershipType === "practitioner") {
      if (!areaOfSpecialty?.trim()) {
        return res.status(400).json({
          message: "Please provide your area of practice or specialty.",
        });
      }

      if (!websiteOrSocial?.trim()) {
        return res.status(400).json({
          message: "Please provide your website or social media handle.",
        });
      }
    }

    // Ambassador
    if (partnershipType === "ambassador") {
      if (!websiteOrSocial?.trim()) {
        return res.status(400).json({
          message: "Please provide your website or social media handle.",
        });
      }
    }

    /**
     * Create Application
     */
    const application = await PartnershipApplication.create({
      applicationId: generateApplicationId(),

      partnershipType,

      fullName: fullName.trim(),
      email: normalizedEmail,
      phoneNumber: phoneNumber.trim(),

      // Corporate
      organisationName:
        partnershipType === "corporate" ? organisationName.trim() : "",

      industry: partnershipType === "corporate" ? industry.trim() : "",

      companySize: partnershipType === "corporate" ? companySize : undefined,

      // Practitioner
      areaOfSpecialty:
        partnershipType === "practitioner" ? areaOfSpecialty.trim() : "",

      // Practitioner / Ambassador
      websiteOrSocial:
        partnershipType === "practitioner" || partnershipType === "ambassador"
          ? websiteOrSocial.trim()
          : "",

      // Shared
      partnershipGoals: partnershipGoals.trim(),
      preferredContactMethod,
      consent: true,

      // Admin
      status: "new",
    });

    try {
      await sendEmail({
        to: env.adminEmail,
        subject: "New Partnership Application",
        html: partnershipNotificationTemplate(application),
      });
    } catch (error) {
      console.error("Admin Partnership Notification Error:", error);
    }

    return res.status(201).json({
      message: "Partnership application submitted successfully.",
      application: {
        id: application._id,
        applicationId: application.applicationId,
        status: application.status,
        partnershipType: application.partnershipType,
        fullName: application.fullName,
        email: application.email,
      },
    });
  } catch (error) {
    console.error("Create Partnership Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Unable to create partnership application. Please try again.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid partnership application information.",
      });
    }

    return res.status(500).json({
      message: "Error submitting partnership application.",
    });
  }
}

/**
 * ========================================
 * GET ALL PARTNETSHIP APPLICATIONS
 * ========================================
 */
export async function getPartnerships(req, res) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);

    const search = req.query.search?.trim() || "";
    const status = req.query.status?.trim() || "all";

    const allowedStatuses = [
      "new",
      "contacted",
      "in-review",
      "approved",
      "rejected",
      "closed",
    ];

    // Validate Status
    if (status !== "all" && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid partnership application status filter.",
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
        { applicationId: searchRegex },
        { fullName: searchRegex },
        { email: searchRegex },
        { phoneNumber: searchRegex },
        { organisationName: searchRegex },
        { industry: searchRegex },
        { areaOfSpecialty: searchRegex },
        { websiteOrSocial: searchRegex },
        { partnershipType: searchRegex },
      ];
    }

    const skip = (page - 1) * limit;

    const [
      applications,
      totalMatchingApplications,
      totalApplications,
      newApplications,
      inReviewApplications,
      approvedApplications,
    ] = await Promise.all([
      // Paginated applications
      PartnershipApplication.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-__v"),

      // Total applications matching current search/filter
      PartnershipApplication.countDocuments(filter),

      // Global Statistics
      PartnershipApplication.countDocuments(),

      PartnershipApplication.countDocuments({
        status: "new",
      }),

      PartnershipApplication.countDocuments({
        status: "in-review",
      }),

      PartnershipApplication.countDocuments({
        status: "approved",
      }),
    ]);

    const totalPages = Math.max(
      Math.ceil(totalMatchingApplications / limit),
      1,
    );

    return res.status(200).json({
      message: "Partnership applications retrieved successfully.",

      applications,

      pagination: {
        currentPage: page,
        pageSize: limit,
        totalApplications: totalMatchingApplications,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },

      stats: {
        total: totalApplications,
        new: newApplications,
        inReview: inReviewApplications,
        approved: approvedApplications,
      },
    });
  } catch (error) {
    console.error("Get Partnerships Error:", error);

    return res.status(500).json({
      message: "Error retrieving partnership applications.",
    });
  }
}

/**
 * ========================================
 * GET NEW PARTNETSHIP APPLICATIONS
 * ========================================
 */
export async function getNewPartnerships(req, res) {
  try {
    const limit = Number(req.query.limit) || 10;

    const [applications, newCount] = await Promise.all([
      PartnershipApplication.find({
        status: "new",
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select("-__v"),

      PartnershipApplication.countDocuments({
        status: "new",
      }),
    ]);

    return res.status(200).json({
      message: "New partnership applications retrieved successfully.",
      count: applications.length,
      totalNew: newCount,
      applications,
    });
  } catch (error) {
    console.error("Get New Partnerships Error:", error);

    return res.status(500).json({
      message: "Error retrieving new partnership applications.",
    });
  }
}

/**
 * ========================================
 * GET SINGLE PARTNETSHIP APPLICATION
 * ========================================
 */
export async function getPartnership(req, res) {
  try {
    const { id } = req.params;

    const application =
      await PartnershipApplication.findById(id).select("-__v");

    if (!application) {
      return res.status(404).json({
        message: "Partnership application not found.",
      });
    }

    return res.status(200).json({
      message: "Partnership application retrieved successfully.",
      application,
    });
  } catch (error) {
    console.error("Get Partnership Error:", error);

    return res.status(500).json({
      message: "Error retrieving partnership application.",
    });
  }
}

/**
 * ========================================
 * UPDATE PARTNETSHIP APPLICATION
 * ========================================
 */
export async function updatePartnership(req, res) {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const allowedStatuses = [
      "new",
      "contacted",
      "in-review",
      "approved",
      "rejected",
      "closed",
    ];

    if (!status) {
      return res.status(400).json({
        message: "Partnership application status is required.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid partnership application status.",
      });
    }

    const application = await PartnershipApplication.findById(id);

    if (!application) {
      return res.status(404).json({
        message: "Partnership application not found.",
      });
    }

    application.status = status;

    if (adminNotes !== undefined) {
      application.adminNotes = adminNotes.trim();
    }

    await application.save();

    return res.status(200).json({
      message: "Partnership application updated successfully.",
      application,
    });
  } catch (error) {
    console.error("Update Partnership Error:", error);

    return res.status(500).json({
      message: "Error updating partnership application.",
    });
  }
}

/**
 * ========================================
 * DELETE PARTNETSHIP APPLICATION
 * ========================================
 */
export async function deletePartnership(req, res) {
  try {
    const { id } = req.params;

    const application = await PartnershipApplication.findById(id);

    if (!application) {
      return res.status(404).json({
        message: "Partnership application not found.",
      });
    }

    await PartnershipApplication.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Partnership application deleted successfully.",
    });
  } catch (error) {
    console.error("Deleting Partnership Error:", error);

    return res.status(500).json({
      message: "Error deleting partnership application.",
    });
  }
}
