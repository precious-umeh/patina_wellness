"use client";

import {
  ArrowClockwiseIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  FunnelSimpleIcon,
  HandshakeIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";

import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import AdminStatsCard from "@/app/components/admin/AdminStatsCard";
import PartnershipModal from "@/app/components/admin/modals/PartnershipModal";
import StatusBadge from "@/app/components/admin/StatusBadge";
import Button from "@/app/components/shared/Button";

import { PARTNERSHIP_STATUSES } from "@/app/components/admin/constants";
import { getPartnerships } from "@/app/lib/api/partnerships";
import { formatDate } from "@/app/lib/date";
import { formatPartnershipType } from "@/app/lib/partnership";

import Stagger from "@/app/components/animations/Stagger";
import StaggerItem from "@/app/components/animations/StaggerItem";
import Reveal from "@/app/components/animations/Reveal";
import PresenceTable from "@/app/components/animations/PresenceTable";
import PresenceTableRow from "@/app/components/animations/PresenceTableRow";

function AdminPartnershipsPage() {
  const [partnerships, setPartnerships] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApplications, setTotalApplications] = useState(0);

  const [partnershipStats, setPartnershipStats] = useState({
    total: 0,
    new: 0,
    inReview: 0,
    approved: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [refreshKey, setRefreshKey] = useState(0);

  const [selectedPartnership, setSelectedPartnership] = useState(null);
  const [isPartnershipModalOpen, setIsPartnershipModalOpen] = useState(false);

  const APPLICATIONS_PER_PAGE = 20;

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
   * Fetch Partnerships
   * ========================================
   */
  useEffect(() => {
    let cancelled = false;

    async function loadApplications() {
      setLoading(true);
      setError("");

      try {
        const data = await getPartnerships(
          currentPage,
          APPLICATIONS_PER_PAGE,
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

        setPartnerships(data.applications);
        setTotalPages(data.pagination.totalPages);
        setTotalApplications(data.pagination.totalApplications);
        setPartnershipStats(data.stats);
      } catch (error) {
        if (cancelled) return;

        console.error("Fetch Partnerships Error:", error);

        setError(
          error.response?.data?.message ||
            "Unable to retrieve partnership applications.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadApplications();

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
  const handleOpenPartnership = function (partnership) {
    setSelectedPartnership(partnership);
    setIsPartnershipModalOpen(true);
  };

  const handleClosePartnership = function () {
    setIsPartnershipModalOpen(false);
    setSelectedPartnership(null);
  };

  const handlePartnershipUpdated = function (updatedPartnership) {
    setSelectedPartnership(updatedPartnership);
    setRefreshKey((key) => key + 1);
  };

  const handlePartnershipDeleted = function () {
    setIsPartnershipModalOpen(false);
    setSelectedPartnership(null);
    setRefreshKey((key) => key + 1);
  };

  /**
   * ========================================
   * Format Secondary Information
   * ========================================
   */
  const getSecondaryInformation = function (partnership) {
    if (partnership.partnershipType === "corporate") {
      return partnership.organisationName || "-";
    }

    if (partnership.partnershipType === "practitioner") {
      return partnership.areaOfSpecialty || "-";
    }

    if (partnership.partnershipType === "ambassador") {
      return partnership.websiteOrSocial || "-";
    }

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

  const isInitialLoading = loading && partnerships.length === 0;
  const isPaginating = loading && partnerships.length > 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <AdminPageHeader
        eyebrow="Management Workspace"
        title="Partnerships"
        description="Review partnership applications, manage their progress, and follow up with potential partners."
        action={{
          label: loading ? "Refreshing..." : "Refresh Data",
          icon: <ArrowClockwiseIcon size={15} weight="bold" />,
          onClick: handleRefresh,
          loading,
          disabled: loading,
        }}
      />

      {/* Partnership Stats */}
      <Stagger
        delay={0.12}
        staggerDelay={0.08}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StaggerItem>
          <AdminStatsCard
            label="Total Partnerships"
            value={partnershipStats.total}
            subtext="All submitted applications"
            subtextClassName="text-muted font-bold"
            icon={<HandshakeIcon size={19} weight="duotone" />}
            iconClassName="bg-primary-light text-primary-dark"
          />
        </StaggerItem>

        <StaggerItem>
          <AdminStatsCard
            label="New"
            value={partnershipStats.new}
            subtext="Needs attention"
            subtextClassName="text-amber-700 font-bold"
            icon={<ClockIcon size={19} weight="duotone" />}
            iconClassName="bg-amber-100 text-amber-700"
          />
        </StaggerItem>

        <StaggerItem>
          <AdminStatsCard
            label="In Review"
            value={partnershipStats.inReview}
            subtext="Currently being reviewed"
            subtextClassName="text-purple-700 font-bold"
            icon={<MagnifyingGlassIcon size={19} weight="duotone" />}
            iconClassName="bg-purple-100 text-purple-700"
          />
        </StaggerItem>

        <StaggerItem>
          <AdminStatsCard
            label="Approved"
            value={partnershipStats.approved}
            subtext="Approved partnerships"
            subtextClassName="text-emerald-700 font-bold"
            icon={<CheckCircleIcon size={19} weight="duotone" />}
            iconClassName="bg-emerald-100 text-emerald-700"
          />
        </StaggerItem>
      </Stagger>

      {/* Main Partnerships Card */}
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
                  placeholder="Search name, email, phone, ID or organisation..."
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
                    {PARTNERSHIP_STATUSES.map((status) => (
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
                Showing {totalApplications}{" "}
                {totalApplications === 1 ? "application" : "applications"}
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
          {!loading && !error && partnerships.length === 0 && (
            <div className="px-6 py-16">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="bg-background text-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  {hasActiveFilters ? (
                    <MagnifyingGlassIcon size={24} weight="duotone" />
                  ) : (
                    <HandshakeIcon size={24} weight="duotone" />
                  )}
                </div>

                <h3 className="text-heading text-sm font-extrabold">
                  {hasActiveFilters
                    ? "No partnership applications found"
                    : "No partnership applications yet"}
                </h3>

                <p className="text-muted mt-1 max-w-sm text-xs leading-relaxed">
                  {hasActiveFilters
                    ? "Try changing your search term or status filter to find the partnership application you're looking for."
                    : "New partnership applications submitted through the website will appear here."}
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

          {/* Partnership Table */}
          {!error && partnerships.length > 0 && (
            <div
              className={`scrollbar-hide overflow-x-auto transition-opacity duration-200 ${
                isPaginating ? "opacity-60" : "opacity-100"
              }`}
            >
              <table className="w-full min-w-212.5 text-left text-xs">
                <thead className="bg-background text-muted border-border border-b font-bold tracking-wider uppercase">
                  <tr>
                    <th className="px-6 py-3">Applicant</th>
                    <th className="px-6 py-3">Partnership Type</th>
                    <th className="px-6 py-3">Organisation / Specialty</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Submitted</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>

                <PresenceTable mode="sync" className="divide-border divide-y">
                  {partnerships.map((partnership) => (
                    <PresenceTableRow
                      key={partnership._id}
                      onClick={() => handleOpenPartnership(partnership)}
                      className="hover:bg-background/50 cursor-pointer transition-colors"
                    >
                      {/* Applicant */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary-light text-primary-dark flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                            <UserCircleIcon size={20} weight="duotone" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-heading truncate font-bold">
                              {partnership.fullName}
                            </p>

                            <p className="text-muted mt-0.5 max-w-47.5 truncate text-[11px]">
                              {partnership.email}
                            </p>

                            <p className="text-muted mt-0.5 text-[10px]">
                              {partnership.applicationId}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Partnership Type */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="bg-primary-light text-primary-dark rounded-full px-2.5 py-1 text-[10px] font-bold">
                          {formatPartnershipType(partnership.partnershipType)}
                        </span>
                      </td>

                      {/* Organisation / Specialty */}
                      <td className="px-5 py-4">
                        <p className="text-heading max-w-52 truncate font-semibold">
                          {getSecondaryInformation(partnership)}
                        </p>

                        {partnership.partnershipType === "corporate" &&
                          partnership.industry && (
                            <p className="text-muted mt-0.5 max-w-52 truncate text-[11px]">
                              {partnership.industry}
                            </p>
                          )}

                        {partnership.partnershipType !== "corporate" &&
                          partnership.websiteOrSocial && (
                            <p className="text-muted mt-0.5 max-w-52 truncate text-[11px]">
                              {partnership.websiteOrSocial}
                            </p>
                          )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge
                          status={partnership.status}
                          type="partnership"
                        />
                      </td>

                      {/* Submitted */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <p className="text-heading font-semibold">
                          {formatDate(partnership.createdAt)}
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
                          leftIcon={<EyeIcon size={14} weight="bold" />}
                          onClick={() => handleOpenPartnership(partnership)}
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
          {!loading && !error && partnerships.length > 0 && (
            <div className="border-border bg-background/50 flex flex-col items-center justify-between gap-4 border-t px-5 py-3 sm:flex-row">
              <p className="text-muted text-[11px]">
                Showing{" "}
                <span className="text-heading font-bold">
                  {(currentPage - 1) * APPLICATIONS_PER_PAGE + 1}
                </span>
                {" - "}
                <span className="text-heading font-bold">
                  {Math.min(
                    currentPage * APPLICATIONS_PER_PAGE,
                    totalApplications,
                  )}
                </span>{" "}
                of{" "}
                <span className="text-heading font-bold">
                  {totalApplications}
                </span>{" "}
                applications
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

      {/* Partnership Modal */}
      {selectedPartnership && (
        <PartnershipModal
          key={selectedPartnership._id}
          isOpen={isPartnershipModalOpen}
          onClose={handleClosePartnership}
          partnership={selectedPartnership}
          onUpdated={handlePartnershipUpdated}
          onPartnershipDeleted={handlePartnershipDeleted}
        />
      )}
    </div>
  );
}

export default AdminPartnershipsPage;
