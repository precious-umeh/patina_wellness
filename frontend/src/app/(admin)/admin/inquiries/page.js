"use client";

import {
  ArrowClockwiseIcon,
  ChatCircleTextIcon,
  CheckCircleIcon,
  ClockIcon,
  EnvelopeSimpleIcon,
  EyeIcon,
  FunnelSimpleIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";

import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import AdminStatsCard from "@/app/components/admin/AdminStatsCard";
import InquiryModal from "@/app/components/admin/modals/InquiryModal";
import StatusBadge from "@/app/components/admin/StatusBadge";
import Button from "@/app/components/shared/Button";

import { getInquiries } from "@/app/lib/api/inquiries";
import { formatTime } from "@/app/lib/time";
import { formatDate } from "@/app/lib/date";
import { formatInquiryTopic } from "@/app/lib/inquiryTopic";
import { INQUIRY_STATUSES } from "@/app/components/admin/constants";

import Stagger from "@/app/components/animations/Stagger";
import StaggerItem from "@/app/components/animations/StaggerItem";
import PresenceTable from "@/app/components/animations/PresenceTable";
import PresenceTableRow from "@/app/components/animations/PresenceTableRow";
import Reveal from "@/app/components/animations/Reveal";

function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalInquiries, setTotalInquiries] = useState(0);

  const [inquiryStats, setInquiryStats] = useState({
    total: 0,
    new: 0,
    replied: 0,
    resolved: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [refreshKey, setRefreshKey] = useState(0);

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isInquiryModalOpen, setIsInquiryModalopen] = useState(false);

  const INQUIRIES_PER_PAGE = 20;

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
   * Fetch Inquiries
   * ========================================
   */

  useEffect(() => {
    let cancelled = false;

    async function loadInquiries() {
      setLoading(true);
      setError("");

      try {
        const data = await getInquiries(
          currentPage,
          INQUIRIES_PER_PAGE,
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

        setInquiries(data.inquiries);
        setTotalPages(data.pagination.totalPages);
        setTotalInquiries(data.pagination.totalInquiries);
        setInquiryStats(data.stats);
      } catch (error) {
        if (cancelled) return;

        console.error("Fetch Inquiries Error:", error);

        setError(
          error.response?.data?.message || "Unable to retrieve inquiries.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadInquiries();

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
   * Search & Filter handlers
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
  const handleOpenInquiry = function (inquiry) {
    setSelectedInquiry(inquiry);
    setIsInquiryModalopen(true);
  };

  const handleCloseInquiry = function () {
    setIsInquiryModalopen(false);
    setSelectedInquiry(null);
  };

  const handleInquiryUpdated = function (updatedInquiry) {
    setSelectedInquiry(updatedInquiry);
    setRefreshKey((key) => key + 1);
  };

  const handleInquiryDeleted = function () {
    setIsInquiryModalopen(false);
    setSelectedInquiry(null);
    setRefreshKey((key) => key + 1);
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

  const isInitialLoading = loading && inquiries.length === 0;
  const isPaginating = loading && inquiries.length > 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <AdminPageHeader
        eyebrow="Communication"
        title="Inquiries"
        description="Review, manage, and respond to messages submitted through the website."
        action={{
          label: loading ? "Refreshing..." : "Refresh Data",
          icon: <ArrowClockwiseIcon size={15} weight="bold" />,
          onClick: handleRefresh,
          loading,
          disabled: loading,
        }}
      />

      {/* Inquiry Stats */}
      <Stagger
        delay={0.12}
        staggerDelay={0.08}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StaggerItem>
          <AdminStatsCard
            label="Total Inquiries"
            value={inquiryStats.total}
            subtext="All submitted messages"
            subtextClassName="text-muted font-bold"
            icon={<EnvelopeSimpleIcon size={19} weight="duotone" />}
            iconClassName="bg-primary-light text-primary-dark"
          />
        </StaggerItem>

        <StaggerItem>
          <AdminStatsCard
            label="New"
            value={inquiryStats.new}
            subtext="Needs attention"
            subtextClassName="text-amber-700 font-bold"
            icon={<ClockIcon size={19} weight="duotone" />}
            iconClassName="bg-amber-100 text-amber-700"
          />
        </StaggerItem>

        <StaggerItem>
          <AdminStatsCard
            label="Replied"
            value={inquiryStats.replied}
            subtext="Awaiting resolution"
            subtextClassName="text-emerald-700 font-bold"
            icon={<ChatCircleTextIcon size={19} weight="duotone" />}
            iconClassName="bg-emerald-100 text-emerald-700"
          />
        </StaggerItem>

        <StaggerItem>
          <AdminStatsCard
            label="Resolved"
            value={inquiryStats.resolved}
            subtext="Completed inquiries"
            subtextClassName="text-purple-700 font-bold"
            icon={<CheckCircleIcon size={19} weight="duotone" />}
            iconClassName="bg-purple-100 text-purple-700"
          />
        </StaggerItem>
      </Stagger>

      {/* Main Inquiries Card */}
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
                  placeholder="Search name, email, phone, ID..."
                  className="border-border bg-background text-heading placeholder:text-muted focus:border-primary-dark focus:ring-primary-dark/20 h-10 w-full rounded-lg border pr-3 pl-10 text-xs font-medium outline-none focus:ring-2"
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
                    {INQUIRY_STATUSES.map((status) => (
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
                Showing {totalInquiries}{" "}
                {totalInquiries === 1 ? "inquiry" : "inquiries"}
              </p>

              {hasActiveFilters && (
                <p className="text-muted text-[11px]">Filtered results</p>
              )}
            </div>
          </div>

          {/* Error State */}
          {error && !loading && (
            <div className="p-6">
              <div className="border-danger/30 bg-danger/10 rounded-lg border p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-danger text-xs font-semibold">{error}</p>

                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
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
              {[1, 2, 3, 4, 5].map((item) => (
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
          {!loading && !error && inquiries.length === 0 && (
            <div className="px-6 py-16">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="bg-background text-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  {hasActiveFilters ? (
                    <MagnifyingGlassIcon size={24} weight="duotone" />
                  ) : (
                    <EnvelopeSimpleIcon size={24} weight="duotone" />
                  )}
                </div>

                <h3 className="text-heading text-sm font-extrabold">
                  {hasActiveFilters ? "No inquiries found" : "No inquiries yet"}
                </h3>

                <p className="text-muted mt-1 max-w-sm text-xs leading-relaxed">
                  {hasActiveFilters
                    ? "Try changing your search term or status filter to find the inquiry you're looking for."
                    : "New messages submitted through the website will appear here."}
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

          {/* Inquiries Table */}
          {!error && inquiries.length > 0 && (
            <div
              className={`scrollbar-hide overflow-x-auto transition-opacity duration-200 ${
                isPaginating ? "opacity-60" : "opacity-100"
              }`}
            >
              <table className="w-full min-w-212.5 text-left text-xs">
                <thead className="bg-background text-muted border-border border-b font-bold tracking-wider uppercase">
                  <tr>
                    <th className="px-6 py-3">Contact</th>
                    <th className="px-6 py-3">Topic</th>
                    <th className="px-6 py-3">Message</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Submitted</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>

                <PresenceTable mode="sync" className="divide-border divide-y">
                  {inquiries.map((inquiry) => (
                    <PresenceTableRow
                      key={inquiry._id}
                      onClick={() => handleOpenInquiry(inquiry)}
                      className="hover:bg-background/50 cursor-pointer transition-colors"
                    >
                      {/* Contact */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary-light text-primary-dark flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                            <UserCircleIcon size={20} weight="duotone" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-heading truncate font-bold">
                              {inquiry.fullName}
                            </p>

                            <p className="text-muted mt-0.5 max-w-47.5 truncate text-[11px]">
                              {inquiry.email}
                            </p>

                            <p className="text-muted mt-0.5 text-[10px]">
                              {inquiry.inquiryId}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Topic */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="bg-primary-light text-primary-dark rounded-full px-2.5 py-1 text-[10px] font-bold">
                          {formatInquiryTopic(inquiry.topic)}
                        </span>
                      </td>

                      {/* Message */}
                      <td className="max-w-70 px-5 py-4">
                        <p className="text-muted line-clamp-2 text-[11px] leading-relaxed">
                          {inquiry.message}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={inquiry.status} type="inquiry" />
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <p className="text-heading font-semibold">
                          {formatDate(inquiry.createdAt)}
                        </p>

                        <p className="text-muted mt-0.5 text-[10px]">
                          {formatTime(inquiry.createdAt)}
                        </p>
                      </td>

                      {/* Action */}
                      <td
                        className="px-5 py-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenInquiry(inquiry)}
                          leftIcon={<EyeIcon size={14} weight="bold" />}
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
          {!loading && !error && inquiries.length > 0 && (
            <div className="border-border bg-background/50 flex flex-col items-center justify-between gap-4 border-t px-5 py-3 sm:flex-row">
              <p className="text-muted text-[11px]">
                Showing{" "}
                <span className="text-heading font-bold">
                  {(currentPage - 1) * INQUIRIES_PER_PAGE + 1}
                </span>
                {" - "}
                <span className="text-heading font-bold">
                  {Math.min(currentPage * INQUIRIES_PER_PAGE, totalInquiries)}
                </span>{" "}
                of{" "}
                <span className="text-heading font-bold">{totalInquiries}</span>{" "}
                inquiries
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

      {/* Inquiry Modal */}
      {selectedInquiry && (
        <InquiryModal
          key={selectedInquiry._id}
          isOpen={isInquiryModalOpen}
          onClose={handleCloseInquiry}
          inquiry={selectedInquiry}
          onUpdated={handleInquiryUpdated}
          onInquiryDeleted={handleInquiryDeleted}
        />
      )}
    </div>
  );
}

export default AdminInquiriesPage;
