"use client";

import {
  createBlockedDate,
  deleteBlockedDate,
  getBlockedDates,
  updateBlockedDate,
} from "@/app/lib/api/consultationBlockedDates";
import { useCallback, useEffect, useState } from "react";

export function useBlockedDates() {
  const [blockedDates, setBlockedDates] = useState([]);
  const [blockedDatesLoading, setBlockedDatesLoading] = useState(true);

  const [isBlockedDateModalOpen, setIsBlockedDateModalOpen] = useState(false);
  const [selectedBlockedDate, setSelectedBlockedDate] = useState(null);
  const [blockedDateModalKey, setBlockedDateModalKey] = useState(0);

  const [savingBlockedDate, setSavingBlockedDate] = useState(false);

  const [isDeleteBlockedDateModalOpen, setIsDeleteBlockedDateModalOpen] =
    useState(false);

  const [blockedDateToDelete, setBlockedDateToDelete] = useState(null);
  const [deletingBlockedDate, setDeletingBlockedDate] = useState(false);

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
   * Load Blocked Dates
   * ========================================
   */
  const loadBlockedDates = useCallback(async function () {
    try {
      const data = await getBlockedDates();

      return data;
    } catch (error) {
      console.error("Fetch Blocked Dates Error:", error);

      throw new Error(
        error.response?.data?.message ||
          "Unable to retrieve blocked consultation dates.",
      );
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initializeBlockedDates() {
      try {
        const data = await loadBlockedDates();

        if (cancelled) return;

        setBlockedDates(Array.isArray(data) ? data : []);
      } catch (error) {
        if (cancelled) return;

        setError(error.message);
      } finally {
        if (!cancelled) {
          setBlockedDatesLoading(false);
        }
      }
    }

    initializeBlockedDates();

    return () => {
      cancelled = true;
    };
  }, [loadBlockedDates]);

  /**
   * ========================================
   * Open Add Blocked Date
   * ========================================
   */
  const handleOpenAddBlockedDate = function () {
    clearFeedback();

    setSelectedBlockedDate(null);
    setBlockedDateModalKey((current) => current + 1);
    setIsBlockedDateModalOpen(true);
  };

  /**
   * ========================================
   * Open Edit Blocked Date
   * ========================================
   */
  const handleOpenEditBlockedDate = function (blockedDate) {
    clearFeedback();

    setSelectedBlockedDate(blockedDate);
    setBlockedDateModalKey((current) => current + 1);
    setIsBlockedDateModalOpen(true);
  };

  /**
   * ========================================
   * Save Blocked Date
   * ========================================
   */
  const handleSaveBlockedDate = async function (data) {
    clearFeedback();

    setSavingBlockedDate(true);

    try {
      if (selectedBlockedDate) {
        const updatedBlockedDate = await updateBlockedDate(
          selectedBlockedDate._id,
          data,
        );

        setBlockedDates((current) =>
          current.map((item) =>
            item._id === updatedBlockedDate._id ? updatedBlockedDate : item,
          ),
        );

        setSuccessMessage("Blocked date updated successfully.");
      } else {
        const createdBlockedDate = await createBlockedDate(data);

        setBlockedDates((current) =>
          [...current, createdBlockedDate].sort((a, b) =>
            a.date.localeCompare(b.date),
          ),
        );

        setSuccessMessage("Date blocked successfully.");
      }

      setSelectedBlockedDate(null);

      return true;
    } catch (error) {
      console.error("Save Blocked Date Error:", error);

      setError(error.response?.data?.message || "Unable to save blocked date.");

      return false;
    } finally {
      setSavingBlockedDate(false);
    }
  };

  /**
   * ========================================
   * Close Blocked Date modal
   * ========================================
   */
  const handleCloseBlockedDateModal = function () {
    if (savingBlockedDate) return;

    setIsBlockedDateModalOpen(false);
    setSelectedBlockedDate(null);
  };

  /**
   * ========================================
   * Open Blocked Date Delete Confirmation modal
   * ========================================
   */
  const handleOpenDeleteBlockedDate = function (blockedDate) {
    clearFeedback();

    setBlockedDateToDelete(blockedDate);
    setIsDeleteBlockedDateModalOpen(true);
  };

  /**
   * ========================================
   * Close Blocked Date Delete Confirmation modal
   * ========================================
   */
  const handleCloseDeleteBlockedDate = function () {
    if (deletingBlockedDate) return;

    setIsDeleteBlockedDateModalOpen(false);
    setBlockedDateToDelete(null);
  };

  /**
   * ========================================
   * Delete Blocked Date
   * ========================================
   */
  const handleDeleteBlockedDate = async function () {
    if (!blockedDateToDelete) return;

    setDeletingBlockedDate(true);
    clearFeedback();

    try {
      await deleteBlockedDate(blockedDateToDelete._id);

      setBlockedDates((current) =>
        current.filter((item) => item._id !== blockedDateToDelete._id),
      );

      setSuccessMessage("Blocked date removed successfully.");

      setIsDeleteBlockedDateModalOpen(false);
      setBlockedDateToDelete(null);
    } catch (error) {
      console.error("Delete Blocked Date Error:", error);

      setError(
        error.response?.data?.message || "Unable to remove the blocked date.",
      );
    } finally {
      setDeletingBlockedDate(false);
    }
  };

  return {
    //state
    blockedDates,
    blockedDatesLoading,

    isBlockedDateModalOpen,
    selectedBlockedDate,
    blockedDateModalKey,

    savingBlockedDate,

    isDeleteBlockedDateModalOpen,
    blockedDateToDelete,
    deletingBlockedDate,

    error,
    successMessage,

    // handlers
    handleOpenAddBlockedDate,
    handleOpenEditBlockedDate,
    handleSaveBlockedDate,
    handleCloseBlockedDateModal,

    handleOpenDeleteBlockedDate,
    handleCloseDeleteBlockedDate,
    handleDeleteBlockedDate,
  };
}
