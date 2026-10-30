"use client";

import { useEffect, useState } from "react";

import { getPendingBookings } from "@/app/lib/api/consultationBookings";
import { getNewInquiries } from "@/app/lib/api/inquiries";
import { getNewPartnerships } from "@/app/lib/api/partnerships";
import { getProductsAdmin } from "@/app/lib/api/products";

export function useAdminDashboard() {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);

  const [newPartnerships, setNewPartnerships] = useState([]);
  const [newPartnershipsCount, setNewPartnershipsCount] = useState(0);

  const [newInquiries, setNewInquiries] = useState([]);
  const [newInquiriesCount, setNewInquiriesCount] = useState(0);

  const [activeProductsCount, setActiveproductsCount] = useState(0);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedPartnership, setSelectedPartnership] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);

  /**
   * ========================================
   * FETCH DATA FROM API
   * ========================================
   */
  const getDashboardData = async function () {
    const [bookingsData, partnershipsData, inquiriesData, productsData] =
      await Promise.all([
        getPendingBookings(10),
        getNewPartnerships(3),
        getNewInquiries(3),
        getProductsAdmin(1, 1, "", "", true),
      ]);

    return {
      bookings: bookingsData,
      partnerships: partnershipsData,
      inquiries: inquiriesData,
      activeProductsCount: productsData.pagination?.totalProducts ?? 0,
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

    setActiveproductsCount(data.activeProductsCount);
  };

  /**
   * ========================================
   * INITIAL LOAD
   * ========================================
   */
  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setError("");

      try {
        const data = await getDashboardData();

        if (cancelled) return;

        updateDashboardState(data);
        setHasLoaded(true);
      } catch {
        if (!cancelled) {
          setError("Failed to load dashboard data. Please try again.");
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
    setError("");

    try {
      const data = await getDashboardData();

      updateDashboardState(data);
      setHasLoaded(true);
    } catch {
      setError("Failed to refresh dashboard data. Please try again.");
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

    activeProductsCount,

    selectedBooking,
    selectedPartnership,
    selectedInquiry,

    loading,
    error,
    hasLoaded,

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
