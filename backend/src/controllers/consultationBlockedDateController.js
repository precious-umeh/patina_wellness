import ConsultationBlockedDate from "../models/consultationBlockedDate.js";
import { isValidDateOnly } from "../utils/dateUtils.js";

/**
 * ============================================
 * CREATE / BLOCK A DATE
 * ============================================
 */
export async function createBlockedDate(req, res) {
  try {
    const { date, reason } = req.body;

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

    // Check if this date has already been blocked
    const existingBlockedDate = await ConsultationBlockedDate.findOne({
      date,
    });

    if (existingBlockedDate) {
      return res.status(409).json({
        message: "This date has already been blocked.",
      });
    }

    const blockedDate = await ConsultationBlockedDate.create({
      date,
      reason: reason?.trim() || "",
      isActive: true,
    });

    return res.status(201).json({
      message: "Date blocked successfully.",
      blockedDate,
    });
  } catch (error) {
    console.error("Create Blocked Date Error:", error);

    return res.status(500).json({
      message: "Error blocking date.",
    });
  }
}

/**
 * ============================================
 * GET ALL BLOCKED DATES
 * ============================================
 */
export async function getBlockedDates(req, res) {
  try {
    const blockedDates = await ConsultationBlockedDate.find().sort({
      date: 1,
    });

    return res.status(200).json({
      message: "Blocked dates retrieved successfully.",
      blockedDates,
    });
  } catch (error) {
    console.error("Get Blocked Dates Error:", error);

    return res.status(500).json({
      message: "Error retrieving blocked dates.",
    });
  }
}

/**
 * ============================================
 * GET ONE BLOCKED DATE
 * ============================================
 */
export async function getBlockedDate(req, res) {
  try {
    const { id } = req.params;

    const blockedDate = await ConsultationBlockedDate.findById(id);

    if (!blockedDate) {
      return res.status(404).json({
        message: "Blocked date not found.",
      });
    }

    return res.status(200).json({
      message: "Blocked date retrieved successfully.",
      blockedDate,
    });
  } catch (error) {
    console.error("Get Blocked Date Error:", error);

    return res.status(500).json({
      message: "Error retrieving blocked date.",
    });
  }
}

/**
 * ============================================
 * UPDATE BLOCKED DATE
 * ============================================
 */
export async function updateBlockedDate(req, res) {
  try {
    const { id } = req.params;
    const { date, reason, isActive } = req.body;

    if (date === undefined && reason === undefined && isActive === undefined) {
      return res.status(400).json({
        message: "No changes were provided.",
      });
    }

    const blockedDate = await ConsultationBlockedDate.findById(id);

    if (!blockedDate) {
      return res.status(404).json({
        message: "Blocked date not found.",
      });
    }

    // Update date
    if (date !== undefined) {
      if (!isValidDateOnly(date)) {
        return res.status(400).json({
          message: "Invalid date. Use YYYY-MM-DD.",
        });
      }

      // Check whether another blocked-date document
      // already uses the new date
      const existingBlockedDate = await ConsultationBlockedDate.findOne({
        date,
        _id: { $ne: id },
      });

      if (existingBlockedDate) {
        return res.status(409).json({
          message: "This date has already been blocked.",
        });
      }

      blockedDate.date = date;
    }

    // Update reason
    if (reason !== undefined) {
      blockedDate.reason = reason.trim();
    }

    // Update active state
    if (isActive !== undefined) {
      if (typeof isActive !== "boolean") {
        return res.status(400).json({
          message: "isActive must be a boolean.",
        });
      }

      blockedDate.isActive = isActive;
    }

    await blockedDate.save();

    return res.status(200).json({
      message: "Blocked date updated successfully.",
      blockedDate,
    });
  } catch (error) {
    console.error("Update Blocked Date Error:", error);

    return res.status(500).json({
      message: "Error updating blocked date.",
    });
  }
}

/**
 * ============================================
 * DELETE / UNBLOCK A DATE
 * ============================================
 */
export async function deleteBlockedDate(req, res) {
  try {
    const { id } = req.params;

    const blockedDate = await ConsultationBlockedDate.findById(id);

    if (!blockedDate) {
      return res.status(404).json({
        message: "Blocked date not found.",
      });
    }

    await ConsultationBlockedDate.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Blocked date removed successfully.",
    });
  } catch (error) {
    console.error("Delete Blocked Date Error:", error);

    return res.status(500).json({
      message: "Error removing blocked date.",
    });
  }
}
