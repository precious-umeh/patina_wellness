import ConsultationBooking from "../models/consultation.js";
import ConsultationAvailability from "../models/consultationAvailability.js";
import ConsultationBlockedDate from "../models/consultationBlockedDate.js";
import {
  getDayOfWeek,
  getNigeriaDateOnly,
  isValidDateOnly,
} from "../utils/dateUtils.js";
import { isSlotInThePast } from "../utils/time.js";

const DEFAULT_WORKING_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
];

const ALLOWED_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

/**
 * ============================================
 * GET AVAILABLE CONSULTATION SLOTS
 * ============================================
 */
export async function getAvailableSlots(req, res) {
  try {
    const { date } = req.query;

    //----------------------------------------
    // Validate date
    //----------------------------------------
    if (!date) {
      return res.status(400).json({
        message: "Date is required.",
      });
    }

    if (!isValidDateOnly(date)) {
      return res.status(400).json({
        message: "Invalid date. Use YYYY-MM-DD.",
      });
    }

    const today = getNigeriaDateOnly();

    if (date < today) {
      return res.status(400).json({
        message: "Consultation dates cannot be in the past.",
      });
    }

    //----------------------------------------
    // Get consultation availability
    //----------------------------------------
    const availability = await ConsultationAvailability.findOne();

    if (!availability || !availability.isActive) {
      return res.status(200).json({
        date,
        available: false,
        timeSlots: [],
        reason: "Consultation bookings are currently unavailable.",
      });
    }

    //----------------------------------------
    // Check working day
    //----------------------------------------
    const dayOfWeek = getDayOfWeek(date);

    if (!availability.workingDays.includes(dayOfWeek)) {
      return res.status(200).json({
        date,
        available: false,
        timeSlots: [],
        reason: "Consultations are not available on this day.",
      });
    }

    //----------------------------------------
    // Check blocked date
    //----------------------------------------
    const blockedDate = await ConsultationBlockedDate.findOne({
      date,
      isActive: true,
    });

    if (blockedDate) {
      return res.status(200).json({
        date,
        available: false,
        timeSlots: [],
        reason:
          blockedDate.reason || "Consultations are not available on this date.",
      });
    }

    //----------------------------------------
    // Get already booked active slots
    //----------------------------------------
    const existingBookings = await ConsultationBooking.find({
      appointmentDate: date,
      isSlotActive: true,
    }).select("appointmentTime");

    const bookedSlots = new Set(
      existingBookings.map((booking) => booking.appointmentTime),
    );

    //----------------------------------------
    // Remove booked and past slots
    //----------------------------------------
    const availableSlots = availability.timeSlots.filter((slot) => {
      const isBooked = bookedSlots.has(slot);
      const isPast = isSlotInThePast(date, slot);

      return !isBooked && !isPast;
    });

    //----------------------------------------
    // Determine availability reason
    //----------------------------------------
    if (availableSlots.length === 0) {
      const allSlotsBooked = availability.timeSlots.every((slot) =>
        bookedSlots.has(slot),
      );

      if (allSlotsBooked) {
        return res.status(200).json({
          date,
          available: false,
          timeSlots: [],
          reason: "This date is fully booked.",
        });
      }

      return res.status(200).json({
        date,
        available: false,
        timeSlots: [],
        reason:
          date === today
            ? "No more consultation slots are available today."
            : "No consultation time slots are available on this date.",
      });
    }

    //----------------------------------------
    // Return available slots
    //----------------------------------------
    return res.status(200).json({
      date,
      available: true,
      timeSlots: availableSlots,
    });
  } catch (error) {
    console.error("Get Available Slots Error:", error);

    return res.status(500).json({
      message: "Error retrieving available consultation slots.",
    });
  }
}

/**
 * ============================================
 * GET CONSULTATION AVAILABILITY
 * ============================================
 */
export async function getAvailability(req, res) {
  try {
    let availability = await ConsultationAvailability.findOne();

    // Create the default availability configuration
    // if one doesn't exist yet.
    if (!availability) {
      availability = await ConsultationAvailability.create({
        workingDays: DEFAULT_WORKING_DAYS,
        timeSlots: [
          "09:00 AM",
          "10:30 AM",
          "12:00 PM",
          "02:00 PM",
          "03:30 PM",
          "05:00 PM",
        ],
        isActive: true,
      });
    }

    return res.status(200).json({
      message: "Consultation availability retrieved successfully.",
      availability,
    });
  } catch (error) {
    console.error("Get Availability Error:", error);

    return res.status(500).json({
      message: "Error retrieving consultation availability.",
    });
  }
}

/**
 * ============================================
 * UPDATE CONSULTATION AVAILABILITY
 * ============================================
 */
export async function updateAvailability(req, res) {
  try {
    const { workingDays, timeSlots, isActive } = req.body;

    if (
      workingDays === undefined &&
      timeSlots === undefined &&
      isActive === undefined
    ) {
      return res.status(400).json({
        message: "No availability changes were provided.",
      });
    }

    // -----------------------------------------
    // Validate working days
    // -----------------------------------------
    if (workingDays !== undefined) {
      if (!Array.isArray(workingDays)) {
        return res.status(400).json({
          message: "Working days must be an array.",
        });
      }

      if (workingDays.length === 0) {
        return res.status(400).json({
          message: "At least one working day is required.",
        });
      }

      const invalidDays = workingDays.filter(
        (day) => !ALLOWED_DAYS.includes(day),
      );

      if (invalidDays.length > 0) {
        return res.status(400).json({
          message: `Invalid working day(s): ${invalidDays.join(", ")}`,
        });
      }
    }

    // -----------------------------------------
    // Validate time slots
    // -----------------------------------------
    if (timeSlots !== undefined) {
      if (!Array.isArray(timeSlots)) {
        return res.status(400).json({
          message: "Time slots must be an array.",
        });
      }

      if (timeSlots.length === 0) {
        return res.status(400).json({
          message: "At least one time slot is required.",
        });
      }

      const cleanedTimeSlots = timeSlots.map((slot) =>
        typeof slot === "string" ? slot.trim() : slot,
      );

      if (cleanedTimeSlots.some((slot) => !slot)) {
        return res.status(400).json({
          message: "Time slots cannot contain empty values.",
        });
      }

      // Remove duplicate time slots
      if (new Set(cleanedTimeSlots).size !== cleanedTimeSlots.length) {
        return res.status(400).json({
          message: "Time slots cannot contain duplicates.",
        });
      }
    }

    // -----------------------------------------
    // Validate isActive
    // -----------------------------------------
    if (isActive !== undefined && typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "isActive must be a boolean.",
      });
    }

    // -----------------------------------------
    // Find current configuration
    // -----------------------------------------
    let availability = await ConsultationAvailability.findOne();

    if (!availability) {
      availability = new ConsultationAvailability();
    }

    // -----------------------------------------
    // Apply updates
    // -----------------------------------------
    if (workingDays !== undefined) {
      availability.workingDays = workingDays;
    }

    if (timeSlots !== undefined) {
      availability.timeSlots = timeSlots.map((slot) => slot.trim());
    }

    if (isActive !== undefined) {
      availability.isActive = isActive;
    }

    await availability.save();

    return res.status(200).json({
      message: "Consultation availability updated successfully.",
      availability,
    });
  } catch (error) {
    console.error("Update Availability Error:", error);

    return res.status(500).json({
      message: "Error updating consultation availability.",
    });
  }
}
