import mongoose from "mongoose";
import { env } from "../config/env.js";
import { sendEmail } from "../config/mail.js";

import ConsultationBooking from "../models/consultation.js";
import ConsultationAvailability from "../models/consultationAvailability.js";
import ConsultationBlockedDate from "../models/consultationBlockedDate.js";
import throwError from "../utils/throwError.js";

import {
  getDayOfWeek,
  getNigeriaDateOnly,
  isValidDateOnly,
} from "../utils/dateUtils.js";
import { bookingNotificationTemplate } from "../utils/emailTemplates.js";
import {
  buildPaginationMeta,
  getPaginationParams,
} from "../utils/paginationUtils.js";
import { escapeRegex } from "../utils/regexUtils.js";

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
      throwError("Please provide all required booking information.", 400);
    }

    if (consent !== true) {
      throwError("Consent is required before submitting a booking.", 400);
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      throwError("Please provide a valid email address.", 400);
    }

    if (!["virtual", "physical"].includes(appointmentType)) {
      throwError("Invalid appointment type.", 400);
    }

    if (!isValidDateOnly(appointmentDate)) {
      throwError("Invalid appointment date. Use YYYY-MM-DD", 400);
    }

    const today = getNigeriaDateOnly();

    if (appointmentDate < today) {
      throwError("Consultation dates cannot be in the past.", 400);
    }

    const availability = await ConsultationAvailability.findOne();

    if (!availability || !availability.isActive) {
      throwError("Consultation bookings are currently unavailable.", 409);
    }

    const dayOfWeek = getDayOfWeek(appointmentDate);

    if (!availability.workingDays.includes(dayOfWeek)) {
      throwError("Consultations are not available on this day.", 409);
    }

    const blockedDate = await ConsultationBlockedDate.findOne({
      date: appointmentDate,
      isActive: true,
    });

    if (blockedDate) {
      throwError(
        blockedDate.reason || "Consultations are not available on this date.",
        409,
      );
    }

    if (!availability.timeSlots.includes(appointmentTime)) {
      throwError("The selected appointment time is not available", 409);
    }

    const existingBooking = await ConsultationBooking.findOne({
      appointmentDate,
      appointmentTime,
      isSlotActive: true,
    });

    if (existingBooking) {
      throwError("This appointment slot is no longer available", 409);
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

    return res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : "Error creating consultation booking.",
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
    const { page, limit, skip } = getPaginationParams(req.query, {
      defaultLimit: 20,
      maxLimit: 100,
    });

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
      throwError("Invalid booking status filter", 400);
    }

    // Build MongoDB filter
    const filter = {};

    // Status filter
    if (status !== "all") {
      filter.status = status;
    }

    // Search across relevant fields
    if (search) {
      const searchRegex = new RegExp(escapeRegex(search), "i");

      filter.$or = [
        { fullName: searchRegex },
        { bookingId: searchRegex },
        { email: searchRegex },
        { phoneNumber: searchRegex },
        { "selectedService.name": searchRegex },
      ];
    }

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

    return res.status(200).json({
      message: "Bookings retrieved successfully.",

      bookings,

      pagination: buildPaginationMeta(
        page,
        limit,
        totalMatchingBookings,
        "totalBookings",
      ),

      stats: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
        completed: completedBookings,
      },
    });
  } catch (error) {
    console.error("Get Bookings Error:", error);

    return res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : "Error retrieving consultation bookings.",
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

    if (!mongoose.isValidObjectId(id)) {
      throwError("Invalid booking ID", 400);
    }

    const booking = await ConsultationBooking.findById(id).select("-__v");

    if (!booking) {
      throwError("Booking not found", 404);
    }

    return res.status(200).json({
      message: "Booking retrieved successfully.",
      booking,
    });
  } catch (error) {
    console.error("Get Booking Error:", error);

    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Error retrieving booking.",
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

    if (!mongoose.isValidObjectId(id)) {
      throwError("Invalid booking ID", 400);
    }

    const allowedStatuses = [
      "pending",
      "contacted",
      "confirmed",
      "completed",
      "cancelled",
    ];

    if (!status) {
      throwError("Booking status is required", 400);
    }

    if (!allowedStatuses.includes(status)) {
      throwError("Invalid booking status.", 400);
    }

    const booking = await ConsultationBooking.findById(id);

    if (!booking) {
      throwError("Booking not found", 404);
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
      if (typeof adminNotes !== "string") {
        throwError("Admin notes must be a string", 400);
      }

      booking.adminNotes = adminNotes.trim();
    }

    await booking.save();

    return res.status(200).json({
      message: "Booking updated successfully.",
      booking,
    });
  } catch (error) {
    console.error("Update Booking Error:", error);

    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Error updating booking.",
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

    if (!mongoose.isValidObjectId(id)) {
      throwError("Invalid booking ID", 400);
    }

    const booking = await ConsultationBooking.findById(id);

    if (!booking) {
      throwError("Booking not found", 404);
    }

    await booking.deleteOne();

    return res.status(200).json({
      message: "Consultation booking deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Booking Error:", error);

    return res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : "Error deleting consultation booking.",
    });
  }
}
