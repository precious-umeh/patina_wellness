"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getAvailability,
  updateAvailability,
} from "@/app/lib/api/consultationAvailability";

import {
  WEEK_DAYS,
  DEFAULT_TIME_SLOTS,
} from "@/app/components/admin/constants";

export function useConsultationAvailability() {
  const [availability, setAvailability] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isTimeSlotModalOpen, setIsTimeSlotModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const [timeSlotModalKey, setTimeSlotModalKey] = useState(0);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /**
   * ========================================
   * Clear Feedback
   * ========================================
   */
  const clearFeedback = function () {
    setError("");
    setSuccessMessage("");
  };

  /**
   * ========================================
   * Fetch Consultation Availability
   * ========================================
   */
  const loadAvailability = useCallback(async function () {
    try {
      const data = await getAvailability();

      return data;
    } catch (error) {
      console.error("Fetch Availability Error:", error);

      throw new Error(
        error.response?.data?.message ||
          "Unable to retrieve consultation availability.",
      );
    }
  }, []);

  /**
   * ========================================
   * Initial Fetch
   * ========================================
   */
  useEffect(() => {
    let cancelled = false;

    async function initializeConsultationAvailability() {
      try {
        const data = await loadAvailability();

        if (cancelled) return;

        setAvailability({
          isActive: data?.isActive ?? true,

          workingDays:
            Array.isArray(data?.workingDays) && data.workingDays.length > 0
              ? data.workingDays
              : WEEK_DAYS.slice(0, 5),

          timeSlots:
            Array.isArray(data?.timeSlots) && data.timeSlots.length > 0
              ? data.timeSlots
              : DEFAULT_TIME_SLOTS,
        });
      } catch (error) {
        if (cancelled) return;

        setError(error.message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    initializeConsultationAvailability();

    return () => {
      cancelled = true;
    };
  }, [loadAvailability]);

  /**
   * ========================================
   * Toggle Working Day
   * ========================================
   */
  const handleToggleWorkingDay = function (day) {
    clearFeedback();

    setAvailability((current) => {
      if (!current) return current;

      const isSelected = current.workingDays.includes(day);

      return {
        ...current,
        workingDays: isSelected
          ? current.workingDays.filter((item) => item !== day)
          : [...current.workingDays, day],
      };
    });
  };

  /**
   * ========================================
   * Toggle Consultation Availability
   * ========================================
   */
  const handleToggleAvailability = function () {
    clearFeedback();

    setAvailability((current) => {
      if (!current) return current;

      return {
        ...current,
        isActive: !current.isActive,
      };
    });
  };

  /**
   * ========================================
   * Open Add Time Slot Modal
   * ========================================
   */
  const handleOpenAddTimeSlot = function () {
    clearFeedback();

    setSelectedTimeSlot(null);
    setTimeSlotModalKey((current) => current + 1);
    setIsTimeSlotModalOpen(true);
  };

  /**
   * ========================================
   * Open Edit Time Slot Modal
   * ========================================
   */
  const handleOpenEditTimeSlot = function (slot) {
    clearFeedback();

    setSelectedTimeSlot(slot);
    setTimeSlotModalKey((current) => current + 1);
    setIsTimeSlotModalOpen(true);
  };

  /**
   * ========================================
   * Close Time Slot Modal
   * ========================================
   */
  const handleCloseTimeSlotModal = function () {
    if (saving) return;

    setIsTimeSlotModalOpen(false);
    setSelectedTimeSlot(null);
  };

  /**
   * ========================================
   * Remove Time Slot
   * ========================================
   */
  const handleRemoveTimeSlot = function (slot) {
    clearFeedback();

    setAvailability((current) => {
      if (!current) return current;

      return {
        ...current,
        timeSlots: current.timeSlots.filter((item) => item !== slot),
      };
    });
  };

  /**
   * ========================================
   * Save Time Slot
   * ========================================
   */
  const handleSaveTimeSlot = async function (formattedTime) {
    if (!availability) {
      return {
        success: false,
        error: "Consultation availability is not loaded.",
      };
    }

    const isEditing = Boolean(selectedTimeSlot);

    // Prevent duplicates when adding
    if (
      !isEditing &&
      availability.timeSlots.some(
        (slot) => slot.toLowerCase() === formattedTime.toLowerCase(),
      )
    ) {
      return {
        success: false,
        error: "This consultation time already exists.",
      };
    }

    // Prevent duplicate slots when editing
    if (
      isEditing &&
      formattedTime !== selectedTimeSlot &&
      availability.timeSlots.some(
        (slot) => slot.toLowerCase() === formattedTime.toLowerCase(),
      )
    ) {
      return {
        success: false,
        error: "this consultation time already exists.",
      };
    }

    setAvailability((current) => {
      if (!current) return current;

      if (isEditing) {
        return {
          ...current,
          timeSlots: current.timeSlots.map((slot) =>
            slot === selectedTimeSlot ? formattedTime : slot,
          ),
        };
      }

      return {
        ...current,
        timeSlots: [...current.timeSlots, formattedTime],
      };
    });

    setSelectedTimeSlot(null);

    return {
      success: true,
    };
  };

  /**
   * ========================================
   * Save Availability
   * ========================================
   */
  const handleSaveAvailability = async function () {
    if (!availability) return;

    clearFeedback();

    if (availability.workingDays.length === 0) {
      setError("Select at least one working day.");
      return;
    }

    if (availability.timeSlots.length === 0) {
      setError("Add at least one consultation time slot.");
      return;
    }

    setSaving(true);

    try {
      const updatedAvailability = await updateAvailability({
        isActive: availability.isActive,
        workingDays: availability.workingDays,
        timeSlots: availability.timeSlots,
      });

      setAvailability({
        isActive: updatedAvailability?.isActive ?? availability.isActive,

        workingDays:
          Array.isArray(updatedAvailability?.workingDays) &&
          updatedAvailability.workingDays.length > 0
            ? updatedAvailability.workingDays
            : availability.workingDays,

        timeSlots:
          Array.isArray(updatedAvailability?.timeSlots) &&
          updatedAvailability.timeSlots.length > 0
            ? updatedAvailability.timeSlots
            : availability.timeSlots,
      });

      setSuccessMessage("Consultation availability updated successfully.");
    } catch (error) {
      console.error("Update Availability Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to update consultation availability.",
      );
    } finally {
      setSaving(false);
    }
  };

  return {
    // state
    availability,
    loading,
    saving,
    isTimeSlotModalOpen,
    selectedTimeSlot,
    error,
    successMessage,
    timeSlotModalKey,

    // handlers
    handleToggleWorkingDay,
    handleToggleAvailability,

    handleOpenAddTimeSlot,
    handleOpenEditTimeSlot,
    handleRemoveTimeSlot,
    handleSaveTimeSlot,

    handleCloseTimeSlotModal,

    handleSaveAvailability,
  };
}
