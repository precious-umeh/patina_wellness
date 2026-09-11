"use client";

import {
  ArrowClockwiseIcon,
  CalendarCheckIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  FunnelSimpleIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  UsersIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";

import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import AdminStatsCard from "@/app/components/admin/AdminStatsCard";
import StatusBadge from "@/app/components/admin/StatusBadge";
import Button from "@/app/components/shared/Button";
import ConsultationBookingModal from "@/app/components/admin/modals/ConsultationBookingModal";

import { getBookings } from "@/app/lib/api/consultationBookings";
import { BOOKING_STATUSES } from "@/app/components/admin/constants";

import Stagger from "@/app/components/animations/Stagger";
import StaggerItem from "@/app/components/animations/StaggerItem";
import PresenceTable from "@/app/components/animations/PresenceTable";
import PresenceTableRow from "@/app/components/animations/PresenceTableRow";
import Reveal from "@/app/components/animations/Reveal";

function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);

  const [bookingStats, setBookingStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
  });

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [refreshKey, setRefreshKey] = useState(0);

  const BOOKINGS_PER_PAGE = 20;

  /**
   * ========================================
   * DEBOUNCE
   * ========================================
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  /**
   * ========================================
   * Fetch Bookings
   * ========================================
   */
  useEffect(() => {
    let cancelled = false;

    async function loadBookings() {
      setLoading(true);
      setError("");

      try {
        const data = await getBookings(
          currentPage,
          BOOKINGS_PER_PAGE,
          debouncedSearchQuery,
          statusFilter,
        );

        if (cancelled) return;

        const requestedPage = currentPage;
        const actualTotalPages = data.pagination.totalPages;

        if (requestedPage > actualTotalPages && actualTotalPages > 0) {
          setCurrentPage(actualTotalPages);
          return;
        }

        setBookings(data.bookings);
        setTotalPages(data.pagination.totalPages);
        setTotalBookings(data.pagination.totalBookings);
        setBookingStats(data.stats);
      } catch (error) {
        if (cancelled) return;

        console.error("Fetch Bookings Error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to retrieve consultation bookings.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBookings();

    return () => {
      cancelled = true;
    };
  }, [currentPage, debouncedSearchQuery, statusFilter, refreshKey]);

  /**
   * ========================================
   * Pagination Handlers
   * ========================================
   */
  const handleNextPage = function () {
    if (currentPage >= totalPages || loading) return;

    setCurrentPage((currentPage) => currentPage + 1);
  };

  const handlePreviousPage = function () {
    if (currentPage <= 1 || loading) return;

    setCurrentPage((currentPage) => currentPage - 1);
  };

  /**
   * ========================================
   * Search & Filter Handlers
   * ========================================
   */
  const handleStatusChange = function (e) {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = function (e) {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  /**
   * ========================================
   * Refresh Handler
   * ========================================
   */
  const handleRefresh = function () {
    setRefreshKey((key) => key + 1);
  };

  /**
   * ========================================
   * Modal Handlers
   * ========================================
   */
  const handleViewBooking = function (booking) {
    setSelectedBooking(booking);
    setIsBookingModalOpen(true);
  };

  const handleCloseBookingModal = function () {
    setIsBookingModalOpen(false);
    setSelectedBooking(null);
  };

  const handleBookingUpdated = (updatedBooking) => {
    setSelectedBooking(updatedBooking);
    setRefreshKey((key) => key + 1);
  };

  const handleBookingDeleted = () => {
    setIsBookingModalOpen(false);
    setSelectedBooking(null);
    setRefreshKey((key) => key + 1);
  };

  /**
   * ========================================
   * Format Date
   * ========================================
   */
  const formatDate = function (date) {
    if (!date) return "-";

    const parsedDate = new Date(`${date}T00:00:00`);

    return parsedDate.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  /**
   * ========================================
   * Format Appointment Type
   * ========================================
   */
  const formatAppointmentType = function (type) {
    if (type === "virtual") return "Virtual";
    if (type === "physical") return "Physical";

    return "-";
  };

  /**
   * ========================================
   * Clear Filters
   * ========================================
   */
  const handleClearFilters = function () {
    setSearchQuery("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery.trim() || statusFilter !== "all";

  const isInitialLoading = loading && bookings.length === 0;
  const isPaginating = loading && bookings.length > 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <AdminPageHeader
        eyebrow="Management Workspace"
        title="Consultation Bookings"
        description="Review consultation requests, manage appointment statuses, and follow up with clients."
        action={{
          label: loading ? "Refreshing..." : "Refresh Data",
          icon: <ArrowClockwiseIcon size={16} weight="bold" />,
          onClick: handleRefresh,
          loading,
          disabled: loading,
        }}
      />

      {/* Booking Stats */}
      <Stagger
        delay={0.12}
        staggerDelay={0.08}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StaggerItem>
          <AdminStatsCard
            label="Total Bookings"
            value={bookingStats.total}
            subtext="All consultation requests"
            subtextClassName="text-muted font-bold"
            icon={<UsersIcon size={20} weight="duotone" />}
            iconClassName="bg-primary-light text-primary-dark"
          />
        </StaggerItem>

        <StaggerItem>
          <AdminStatsCard
            label="Pending"
            value={bookingStats.pending}
            subtext="Needs attention"
            subtextClassName="text-amber-700 font-bold"
            icon={<ClockIcon size={20} weight="duotone" />}
            iconClassName="bg-amber-100 text-amber-700"
          />
        </StaggerItem>

        <StaggerItem>
          <AdminStatsCard
            label="Confirmed"
            value={bookingStats.confirmed}
            subtext="Appointments confirmed"
            subtextClassName="text-blue-700 font-bold"
            icon={<CalendarCheckIcon size={20} weight="duotone" />}
            iconClassName="bg-blue-100 text-blue-700"
          />
        </StaggerItem>

        <StaggerItem>
          <AdminStatsCard
            label="Completed"
            value={bookingStats.completed}
            subtext="Consultations completed"
            subtextClassName="text-emerald-700 font-bold"
            icon={<CheckCircleIcon size={20} weight="duotone" />}
            iconClassName="bg-emerald-100 text-emerald-700"
          />
        </StaggerItem>
      </Stagger>

      {/* Main Bookings Card */}
      <Reveal delay={0.2}>
        <div className="border-border bg-surface overflow-hidden rounded-xl border shadow-2xs">
          {/* Toolbar */}
          <div className="border-border border-b p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Search */}
              <div className="relative w-full lg:max-w-md">
                <MagnifyingGlassIcon
                  size={17}
                  weight="bold"
                  className="text-muted absolute top-1/2 left-3 -translate-y-1/2"
                />

                <input
                  type="search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search name, ID, email, phone or service..."
                  className="border-border bg-background text-heading placeholder:text-muted focus:border-primary-dark focus:ring-primary-dark/20 h-10 w-full appearance-none rounded-lg border pr-3 pl-10 text-xs font-medium outline-none focus:ring-2"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="text-muted hover:text-heading absolute top-1/2 right-3 -translate-y-1/2"
                  >
                    <XIcon size={17} weight="bold" />
                  </button>
                )}
              </div>

              {/* Filter */}
              <div className="flex w-full items-center gap-2 lg:w-auto">
                <div className="relative flex-1 lg:w-48 lg:flex-none">
                  <FunnelSimpleIcon
                    size={15}
                    weight="bold"
                    className="text-muted absolute top-1/2 left-3 -translate-y-1/2"
                  />

                  <select
                    value={statusFilter}
                    onChange={handleStatusChange}
                    className="border-border bg-background text-heading focus:border-primary-dark focus:ring-primary-dark/20 h-10 w-full appearance-none rounded-lg border pr-8 pl-9 text-xs font-semibold outline-none focus:ring-2"
                  >
                    {BOOKING_STATUSES.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                {hasActiveFilters && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Results */}
            <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-muted text-xs">
                Showing {totalBookings}{" "}
                {totalBookings === 1 ? "booking" : "bookings"}
              </p>

              {hasActiveFilters && (
                <p className="text-muted text-[11px]">Filtered results</p>
              )}
            </div>
          </div>

          {/* Error State */}
          {error && !loading && (
            <div className="p-6">
              <div className="border-danger/30 bg-danger/10 m-6 rounded-lg border p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-danger text-sm font-semibold">{error}</p>

                  <Button
                    type="button"
                    size="sm"
                    variant="danger"
                    onClick={handleRefresh}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isInitialLoading && (
            <div className="divide-border divide-y">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="animate-pulse px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="bg-border h-10 w-10 rounded-full" />

                    <div className="flex-1 space-y-2">
                      <div className="bg-border h-3 w-40 rounded" />
                      <div className="bg-border h-2.5 w-64 rounded" />
                    </div>

                    <div className="bg-border h-6 w-20 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && bookings.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="bg-background text-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  {hasActiveFilters ? (
                    <MagnifyingGlassIcon size={24} weight="duotone" />
                  ) : (
                    <CalendarCheckIcon size={24} weight="duotone" />
                  )}
                </div>

                <h3 className="text-heading text-sm font-extrabold">
                  {hasActiveFilters
                    ? "No consultation bookings found"
                    : "No consultation bookings yet"}
                </h3>

                <p className="text-muted mt-1 max-w-sm text-xs leading-relaxed">
                  {hasActiveFilters
                    ? "Try chnaging your search term or status filter to find the consultation booking you're looking for."
                    : "New consultation requests submitted through the website will appear here."}
                </p>

                {hasActiveFilters && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Bookings Table */}
          {!error && bookings.length > 0 && (
            <div
              className={`scrollbar-hide overflow-x-auto transition-opacity duration-200 ${
                isPaginating ? "opacity-60" : "opacity-100"
              }`}
            >
              <table className="w-full min-w-212.5 text-left text-xs">
                <thead className="bg-background text-muted border-border border-b font-bold tracking-wider uppercase">
                  <tr>
                    <th className="px-6 py-3">Client</th>
                    <th className="px-6 py-3">Service</th>
                    <th className="px-6 py-3">Appointment</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>

                <PresenceTable mode="sync" className="divide-border divide-y">
                  {bookings.map((booking) => (
                    <PresenceTableRow
                      key={booking._id}
                      onClick={() => handleViewBooking(booking)}
                      className="hover:bg-background/50 cursor-pointer transition-colors"
                    >
                      {/* Client */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary-light text-primary-dark flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                            <UserCircleIcon size={20} weight="duotone" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-heading truncate font-bold">
                              {booking.fullName}
                            </p>

                            <p className="text-muted mt-0.5 max-w-47.5 truncate text-[11px]">
                              {booking.email}
                            </p>

                            <p className="text-muted mt-0.5 text-[10px]">
                              {booking.bookingId}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Service */}
                      <td className="px-5 py-4">
                        <p className="text-heading max-w-52 truncate font-semibold">
                          {booking.selectedService?.name || "-"}
                        </p>

                        <p className="text-muted mt-0.5 text-[11px]">
                          {booking.selectedService?.type || "-"}
                        </p>
                      </td>

                      {/* Appointment */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <p className="text-heading font-semibold">
                          {formatDate(booking.appointmentDate)}
                        </p>

                        <p className="text-muted mt-0.5 text-[11px]">
                          {booking.appointmentTime || "-"}
                        </p>
                      </td>

                      {/* Appointment Type */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {formatAppointmentType(booking.appointmentType)}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge
                          status={booking.status}
                          type="consultation"
                        />
                      </td>

                      {/* Action */}
                      <td
                        className="px-5 py-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          leftIcon={<EyeIcon size={14} weight="bold" />}
                          onClick={() => handleViewBooking(booking)}
                        >
                          View
                        </Button>
                      </td>
                    </PresenceTableRow>
                  ))}
                </PresenceTable>
              </table>
            </div>
          )}

          {/* Footer */}
          {!loading && !error && bookings.length > 0 && (
            <div className="border-border bg-background/50 flex flex-col items-center justify-between gap-4 border-t px-5 py-3 sm:flex-row">
              <p className="text-muted text-[11px]">
                Showing{" "}
                <span className="text-heading font-bold">
                  {(currentPage - 1) * BOOKINGS_PER_PAGE + 1}
                </span>
                {" - "}
                <span className="text-heading font-bold">
                  {Math.min(currentPage * BOOKINGS_PER_PAGE, totalBookings)}
                </span>{" "}
                of{" "}
                <span className="text-heading font-bold">{totalBookings}</span>{" "}
                bookings
              </p>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="xxs"
                  disabled={currentPage === 1 || loading}
                  onClick={handlePreviousPage}
                >
                  Previous
                </Button>

                <span className="text-muted text-[11px]">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  type="button"
                  variant="outline"
                  size="xxs"
                  disabled={currentPage === totalPages || loading}
                  onClick={handleNextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </Reveal>

      {/* Consultation Booking modal */}
      {selectedBooking && (
        <ConsultationBookingModal
          key={selectedBooking._id || "booking-modal"}
          isOpen={isBookingModalOpen}
          onClose={handleCloseBookingModal}
          booking={selectedBooking}
          onUpdated={handleBookingUpdated}
          onBookingDeleted={handleBookingDeleted}
        />
      )}
    </div>
  );
}

export default AdminBookingsPage;
