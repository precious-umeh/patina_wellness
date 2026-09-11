"use client";

import { useEffect, useState } from "react";

import { getPendingBookings } from "@/app/lib/api/consultationBookings";
import { getNewInquiries } from "@/app/lib/api/inquiries";
import { getNewPartnerships } from "@/app/lib/api/partnerships";

export function useAdminDashboard() {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);

  const [newPartnerships, setNewPartnerships] = useState([]);
  const [newPartnershipsCount, setNewPartnershipsCount] = useState(0);

  const [newInquiries, setNewInquiries] = useState([]);
  const [newInquiriesCount, setNewInquiriesCount] = useState(0);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedPartnership, setSelectedPartnership] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const [loading, setLoading] = useState(true);

  /**
   * ========================================
   * FETCH DATA FROM API
   * ========================================
   */
  const getDashboardData = async function () {
    const [bookingsData, partnershipsData, inquiriesData] = await Promise.all([
      getPendingBookings(10),
      getNewPartnerships(3),
      getNewInquiries(3),
    ]);

    return {
      bookings: bookingsData,
      partnerships: partnershipsData,
      inquiries: inquiriesData,
    };
  };

  /**
   * ========================================
   * APPLY DATA TO STATE
   * ========================================
   */
  const updateDashboardState = function (data) {
    setPendingBookings(data.bookings.bookings);
    setPendingBookingsCount(data.bookings.totalPending);

    setNewPartnerships(data.partnerships.applications);
    setNewPartnershipsCount(data.partnerships.totalNew);

    setNewInquiries(data.inquiries.inquiries);
    setNewInquiriesCount(data.inquiries.totalNew);
  };

  /**
   * ========================================
   * INITIAL LOAD
   * ========================================
   */
  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const data = await getDashboardData();

        if (cancelled) return;

        updateDashboardState(data);
      } catch (error) {
        if (!cancelled) {
          console.error("Fetch Dashboard Data Error:", error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * ========================================
   * REFRESH DASHBOARD
   * ========================================
   */
  const refreshDashboard = async function () {
    try {
      const data = await getDashboardData();

      updateDashboardState(data);
    } catch (error) {
      console.error("Refresh Dashboard Data Error:", error);
    }
  };

  /**
   * ========================================
   * MODAL SELECTION
   * ========================================
   */
  const handleSelectBooking = function (booking) {
    setSelectedBooking(booking);
  };

  const handleSelectPartnership = function (partnership) {
    setSelectedPartnership(partnership);
  };

  const handleSelectInquiry = function (inquiry) {
    setSelectedInquiry(inquiry);
  };

  /**
   * ========================================
   * UPDATE HANDLERS
   * ========================================
   */
  const handleBookingUpdated = async function () {
    setSelectedBooking(null);

    await refreshDashboard();
  };

  const handlePartnershipUpdated = async function () {
    setSelectedPartnership(null);

    await refreshDashboard();
  };

  const handleInquiryUpdated = async function () {
    setSelectedInquiry(null);

    await refreshDashboard();
  };

  return {
    pendingBookings,
    pendingBookingsCount,

    newPartnerships,
    newPartnershipsCount,

    newInquiries,
    newInquiriesCount,

    selectedBooking,
    selectedPartnership,
    selectedInquiry,

    loading,

    handleSelectBooking,
    handleSelectPartnership,
    handleSelectInquiry,

    handleBookingUpdated,
    handlePartnershipUpdated,
    handleInquiryUpdated,

    setSelectedBooking,
    setSelectedPartnership,
    setSelectedInquiry,

    refreshDashboard,
  };
}
