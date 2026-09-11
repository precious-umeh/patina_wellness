import { env } from "../config/env.js";
import { sendEmail } from "../config/mail.js";

import ConsultationBooking from "../models/consultation.js";
import ConsultationAvailability from "../models/consultationAvailability.js";
import ConsultationBlockedDate from "../models/consultationBlockedDate.js";

import {
  getDayOfWeek,
  getNigeriaDateOnly,
  isValidDateOnly,
} from "../utils/dateUtils.js";
import { bookingNotificationTemplate } from "../utils/emailTemplates.js";

const generateBookingId = function () {
  const date = getNigeriaDateOnly().replace(/-/g, "");

  const randomNumber = Math.floor(1000 + Math.random() * 9000);

  return `BK-${date}-${randomNumber}`;
};

/**
 * ============================================
 * CREATE CONSULTATION BOOKING
 * ============================================
 */
export async function createBooking(req, res) {
  try {
    const {
      selectedService,
      appointmentType,
      appointmentDate,
      appointmentTime,
      fullName,
      phoneNumber,
      email,
      ageBracket,
      gender,
      primaryConcern,
      currentMedications,
      existingConditions,
      referralSource,
      referralCode,
      consent,
    } = req.body;

    if (
      !selectedService ||
      !appointmentType ||
      !appointmentDate ||
      !appointmentTime ||
      !fullName ||
      !email ||
      !phoneNumber ||
      !ageBracket ||
      !gender ||
      !primaryConcern
    ) {
      return res.status(400).json({
        message: "Please provide all required booking information.",
      });
    }

    if (consent !== true) {
      return res.status(400).json({
        message: "Consent is required before submitting a booking.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address.",
      });
    }

    if (!["virtual", "physical"].includes(appointmentType)) {
      return res.status(400).json({
        message: "Invalid appointment type.",
      });
    }

    if (!isValidDateOnly(appointmentDate)) {
      return res.status(400).json({
        message: "Invalid appointment date. Use YYYY-MM-DD.",
      });
    }

    const today = getNigeriaDateOnly();

    if (appointmentDate < today) {
      return res.status(400).json({
        message: "Consultation dates cannot be in the past.",
      });
    }

    const availability = await ConsultationAvailability.findOne();

    if (!availability || !availability.isActive) {
      return res.status(409).json({
        message: "Consultation bookings are currently unavailable.",
      });
    }

    const dayOfWeek = getDayOfWeek(appointmentDate);

    if (!availability.workingDays.includes(dayOfWeek)) {
      return res.status(409).json({
        message: "Consultations are not available on this day.",
      });
    }

    const blockedDate = await ConsultationBlockedDate.findOne({
      date: appointmentDate,
      isActive: true,
    });

    if (blockedDate) {
      return res.status(409).json({
        message:
          blockedDate.reason || "Consultations are not available on this date.",
      });
    }

    if (!availability.timeSlots.includes(appointmentTime)) {
      return res.status(409).json({
        message: "The selected appointment time is not available.",
      });
    }

    const existingBooking = await ConsultationBooking.findOne({
      appointmentDate,
      appointmentTime,
      isSlotActive: true,
    });

    if (existingBooking) {
      return res.status(409).json({
        message: "This appointment slot is no longer available.",
      });
    }

    const booking = await ConsultationBooking.create({
      bookingId: generateBookingId(),

      selectedService: {
        id: selectedService.id,
        name: selectedService.name,
        type: selectedService.type,
        price: selectedService.price,
      },

      appointmentType,
      appointmentDate,
      appointmentTime,

      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: normalizedEmail,

      ageBracket,
      gender,

      primaryConcern: primaryConcern.trim(),
      currentMedications: currentMedications?.trim() || "",
      existingConditions: existingConditions?.trim() || "",

      referralSource: referralSource || "Other",
      referralCode: referralCode?.trim() || "",

      consent: true,

      status: "pending",
      isSlotActive: true,
    });

    try {
      await sendEmail({
        to: env.adminEmail,
        subject: "New Consultation Booking",
        html: bookingNotificationTemplate(booking),
      });
    } catch (error) {
      console.error("AAdmin Booking Notification Error:", error);
    }

    return res.status(201).json({
      message: "Consultation booking submitted successfully.",
      booking: {
        id: booking._id,
        bookingId: booking.bookingId,
        status: booking.status,
        fullName: booking.fullName,
        email: booking.email,
        appointmentDate: booking.appointmentDate,
        appointmentTime: booking.appointmentTime,
        appointmentType: booking.appointmentType,
        selectedService: booking.selectedService,
      },
    });
  } catch (error) {
    console.error("Create Booking Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "This appointment slot is no longer available.",
      });
    }

    return res.status(500).json({
      message: "Error creating consultation booking.",
    });
  }
}

/**
 * ============================================
 * GET ALL CONSULTATION BOOKINGS
 * ============================================
 */
export async function getBookings(req, res) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);

    const search = req.query.search?.trim() || "";
    const status = req.query.status?.trim() || "all";

    const allowedStatuses = [
      "pending",
      "contacted",
      "confirmed",
      "completed",
      "cancelled",
    ];

    // Validate Status
    if (status !== "all" && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid booking status filter.",
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
        { fullName: searchRegex },
        { bookingId: searchRegex },
        { email: searchRegex },
        { phoneNumber: searchRegex },
        { "selectedService.name": searchRegex },
      ];
    }

    const skip = (page - 1) * limit;

    const [
      bookings,
      totalMatchingBookings,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
    ] = await Promise.all([
      // Paginated bookings
      ConsultationBooking.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-__v"),

      // Total bookings matching current search/filter
      ConsultationBooking.countDocuments(filter),

      // Global Statistics
      ConsultationBooking.countDocuments(),

      ConsultationBooking.countDocuments({
        status: "pending",
      }),

      ConsultationBooking.countDocuments({
        status: "confirmed",
      }),

      ConsultationBooking.countDocuments({
        status: "completed",
      }),
    ]);

    const totalPages = Math.max(Math.ceil(totalMatchingBookings / limit), 1);

    return res.status(200).json({
      message: "Bookings retrieved successfully.",

      bookings,

      pagination: {
        currentPage: page,
        pageSize: limit,
        totalBookings: totalMatchingBookings,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },

      stats: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
        completed: completedBookings,
      },
    });
  } catch (error) {
    console.error("Get Bookings Error:", error);

    return res.status(500).json({
      message: "Error retrieving consultation bookings.",
    });
  }
}

/**
 * ============================================
 * GET PENDING CONSULTATION BOOKINGS
 * ============================================
 */
export async function getPendingBookings(req, res) {
  try {
    const limit = Number(req.query.limit) || 10;

    const [bookings, pendingCount] = await Promise.all([
      ConsultationBooking.find({
        status: "pending",
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select("-__v"),

      ConsultationBooking.countDocuments({
        status: "pending",
      }),
    ]);

    return res.status(200).json({
      message: "Pending bookings retrieved successfully.",
      count: bookings.length,
      totalPending: pendingCount,
      bookings,
    });
  } catch (error) {
    console.error("Get Pending Bookings Error:", error);

    return res.status(500).json({
      message: "Error retrieving pending consultation bookings.",
    });
  }
}

/**
 * ============================================
 * GET SINGLE CONSULTATION BOOKING
 * ============================================
 */
export async function getBooking(req, res) {
  try {
    const { id } = req.params;

    const booking = await ConsultationBooking.findById(id).select("-__v");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    return res.status(200).json({
      message: "Booking retrieved successfully.",
      booking,
    });
  } catch (error) {
    console.error("Get Booking Error:", error);

    return res.status(500).json({
      message: "Error retrieving booking.",
    });
  }
}

/**
 * ============================================
 * UPDATE BOOKING STATUS
 * ============================================
 */
export async function updateBooking(req, res) {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const allowedStatuses = [
      "pending",
      "contacted",
      "confirmed",
      "completed",
      "cancelled",
    ];

    if (!status) {
      return res.status(400).json({
        message: "Booking status is required.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid booking status.",
      });
    }

    const booking = await ConsultationBooking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    // Update booking status
    booking.status = status;

    // Update whether the appointment slot is still occupied
    if (status === "completed" || status === "cancelled") {
      booking.isSlotActive = false;
    } else {
      booking.isSlotActive = true;
    }

    // Update admin notes if provided
    if (adminNotes !== undefined) {
      booking.adminNotes = adminNotes.trim();
    }

    await booking.save();

    return res.status(200).json({
      message: "Booking updated successfully.",
      booking,
    });
  } catch (error) {
    console.error("Update Booking Error:", error);

    return res.status(500).json({
      message: "Error updating booking.",
    });
  }
}

/**
 * ============================================
 * DELETE CONSULTATION BOOKING
 * ============================================
 */
export async function deleteBooking(req, res) {
  try {
    const { id } = req.params;

    const booking = await ConsultationBooking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found.",
      });
    }

    await ConsultationBooking.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Consultation booking deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Booking Error:", error);

    return res.status(500).json({
      message: "Error deleting consultation booking.",
    });
  }
}
