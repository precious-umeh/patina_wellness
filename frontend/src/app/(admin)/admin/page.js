"use client";

import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  EnvelopeSimpleIcon,
  HandshakeIcon,
  PackageIcon,
  PlusIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import AdminStatsCard from "@/app/components/admin/AdminStatsCard";
import StatusBadge from "@/app/components/admin/StatusBadge";
import WhatsAppButton from "@/app/components/admin/WhatsAppButton";

import { formatTime } from "@/app/lib/time";
import { formatInquiryTopic } from "@/app/lib/inquiryTopic";
import { formatPartnershipType } from "@/app/lib/partnership";
import { formatDate } from "@/app/lib/date";
import { useAdminDashboard } from "@/app/hooks/admin/useAdminDashboard";

import ConsultationBookingModal from "@/app/components/admin/modals/ConsultationBookingModal";
import PartnershipModal from "@/app/components/admin/modals/PartnershipModal";
import InquiryModal from "@/app/components/admin/modals/InquiryModal";
import AdminDashboardSkeleton from "@/app/components/admin/AdminDashboardSkeleton";

import Reveal from "@/app/components/animations/Reveal";
import Stagger from "@/app/components/animations/Stagger";
import StaggerItem from "@/app/components/animations/StaggerItem";

// Mock Initial data representing lead tracking & catalog stats
const INITIAL_STATS = {
  activeProducts: 12,
};

function AdminDashboard() {
  const {
    pendingBookings,
    pendingBookingsCount,

    newPartnerships,
    newPartnershipsCount,

    newInquiries,
    newInquiriesCount,

    selectedBooking,
    selectedInquiry,
    selectedPartnership,

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
  } = useAdminDashboard();

  if (loading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}

      <AdminPageHeader
        eyebrow="Overview"
        title="Lead & Management Portal"
        description="Track incoming consultation bookings, partnership applications, and client inquiries from one place."
        action={{
          href: "/admin/products",
          label: "Add Product",
          icon: <PlusIcon size={16} weight="bold" />,
        }}
      />

      {/* Metric Summary Cards Grid */}
      <Stagger
        delay={0.12}
        staggerDelay={0.08}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {/* Active Products */}
        <StaggerItem>
          <AdminStatsCard
            label="Active Products"
            value={INITIAL_STATS.activeProducts}
            subtext="WhatsApp CTA Enabled"
            subtextClassName="text-muted font-bold"
            icon={<PackageIcon size={20} weight="duotone" />}
            iconClassName="bg-primary-light text-primary-dark"
          />
        </StaggerItem>

        {/* Pending Bookings */}
        <StaggerItem>
          <AdminStatsCard
            label="Pending Bookings"
            value={pendingBookingsCount}
            subtext="Needs Actions"
            subtextClassName="text-amber-700 font-bold"
            icon={<ClockIcon size={20} weight="duotone" />}
            iconClassName="bg-amber-100 text-amber-700"
          />
        </StaggerItem>

        {/* Patnership Apps */}
        <StaggerItem>
          <AdminStatsCard
            label="Partnership Apps"
            value={newPartnershipsCount}
            subtext="New Submissions"
            subtextClassName="text-blue-700 font-bold"
            icon={<HandshakeIcon size={20} weight="duotone" />}
            iconClassName="bg-blue-100 text-blue-700"
          />
        </StaggerItem>

        {/* Contact Messages */}
        <StaggerItem>
          <AdminStatsCard
            label="Unread Inquiries"
            value={newInquiriesCount}
            subtext="In Messages"
            subtextClassName="text-emerald-700 font-bold"
            icon={<EnvelopeSimpleIcon size={20} weight="duotone" />}
            iconClassName="bg-emerald-100 text-emerald-700"
          />
        </StaggerItem>
      </Stagger>

      {/* Main Content Grid: Bookings + Sidebar Tooling */}
      <Reveal delay={0.25} duration={0.6}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left 2 Columns: Recent Consultation Bookings */}
          <div className="border-border bg-surface flex flex-col justify-between overflow-hidden rounded-xl border shadow-2xs lg:col-span-2">
            <div>
              <div className="border-border flex items-center justify-between border-b px-6 py-4">
                <div>
                  <h2 className="text-heading font-extrabold">
                    Pending Booking Submissions
                  </h2>

                  <p className="text-muted text-xs">
                    Client requesting consultation panels and health reviews.
                  </p>
                </div>

                <Link
                  href="/admin/bookings"
                  className="text-primary-dark flex items-center gap-1 text-xs font-bold underline-offset-3 hover:underline"
                >
                  <span>View All</span>
                  <ArrowRightIcon size={12} weight="bold" />
                </Link>
              </div>

              <div className="divide-border divide-y overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-background text-muted font-bold tracking-wider uppercase">
                    <tr>
                      <th className="px-6 py-3">Client & Panel</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3 text-right">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-border divide-y">
                    {pendingBookings.length > 0 ? (
                      pendingBookings.map((booking) => (
                        <tr
                          key={booking._id}
                          onClick={() => handleSelectBooking(booking)}
                          className="hover:bg-background/50 cursor-pointer transition-colors"
                        >
                          <td className="px-6 py-4">
                            <p className="text-heading font-bold">
                              {booking.fullName}
                            </p>
                            <p className="text-muted text-[11px]">
                              {booking.selectedService.name}
                            </p>
                          </td>

                          <td className="px-6 py-4 font-medium whitespace-nowrap">
                            <p>{booking.appointmentDate}</p>
                          </td>

                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <StatusBadge
                              status={booking.status}
                              type="consultation"
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-12">
                          <div className="flex flex-col items-center justify-center text-center">
                            <div className="bg-background text-muted mb-3 flex h-11 w-11 items-center justify-center rounded-full">
                              <CheckCircleIcon size={22} weight="duotone" />
                            </div>

                            <p className="text-heading text-sm font-bold">
                              No pending bookings
                            </p>

                            <p className="text-muted mt-1 max-w-xs text-xs">
                              You&apos;re all caught up. New consultation
                              requests will appear here when they are submitted.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-border bg-background/50 border-t p-4 text-center">
              <p className="text-muted text-xs">
                Showing {Math.min(pendingBookings.length, 10)} of{" "}
                {pendingBookingsCount} pending{" "}
                {pendingBookings.length === 1 ? "booking" : "bookings"}.
              </p>
            </div>
          </div>

          {/* Right Column: Recent Partnership Applications & Recent Inquiries */}
          <div className="space-y-6">
            {/* Partnership Applications Card */}
            <div className="border-border bg-surface space-y-4 rounded-xl border p-6 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-heading text-sm font-extrabold">
                    New Partnerships
                  </h3>

                  <p className="text-muted text-[11px]">
                    Recent partnership applications.
                  </p>
                </div>

                <Link
                  href="/admin/partnerships"
                  className="text-primary-dark flex items-center gap-1 text-xs font-bold underline-offset-3 hover:underline"
                >
                  <span>View All</span>
                  <ArrowRightIcon size={12} weight="bold" />
                </Link>
              </div>

              <div className="space-y-3">
                {newPartnerships.length > 0 ? (
                  newPartnerships.map((partnership) => (
                    <div
                      key={partnership._id}
                      onClick={() => handleSelectPartnership(partnership)}
                      className="border-border bg-background cursor-pointer rounded-lg border p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-heading min-w-0 truncate text-xs font-bold">
                          {partnership.fullName}
                        </span>

                        <StatusBadge
                          status={partnership.status}
                          type="partnership"
                        />
                      </div>

                      <div className="mt-1.5 flex items-center justify-between gap-2">
                        <span className="text-muted min-w-0 truncate text-[11px]">
                          {formatPartnershipType(partnership.partnershipType)}
                        </span>

                        <span className="text-muted shrink-0 text-[10px]">
                          {formatDate(partnership.createdAt)} •{" "}
                          {formatTime(partnership.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="border-border bg-background rounded-lg border p-6 text-center">
                    <HandshakeIcon
                      size={22}
                      weight="duotone"
                      className="text-muted mx-auto mb-2"
                    />

                    <p className="text-heading text-xs font-bold">
                      No new partnerships
                    </p>

                    <p className="text-muted mt-1 text-[11px]">
                      New partnership applications will appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Inquiries Review */}
            <div className="border-border bg-surface space-y-4 rounded-xl border p-6 shadow-2xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-heading text-sm font-extrabold">
                    Recent Inquiries
                  </h3>

                  <p className="text-muted text-[11px]">
                    Recent client inquiries.
                  </p>
                </div>

                <Link
                  href="/admin/inquiries"
                  className="text-primary-dark flex items-center gap-1 text-xs font-bold underline-offset-3 hover:underline"
                >
                  <span>View All</span>
                  <ArrowRightIcon size={12} weight="bold" />
                </Link>
              </div>

              <div className="space-y-3">
                {newInquiries.length > 0 ? (
                  newInquiries.map((inquiry) => (
                    <div
                      key={inquiry._id}
                      onClick={() => handleSelectInquiry(inquiry)}
                      className="border-border bg-background cursor-pointer space-y-1.5 rounded-lg border p-3 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-heading min-w-0 truncate font-bold">
                          {inquiry.fullName}
                        </span>

                        <span className="bg-primary-light text-primary-dark shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold">
                          {formatInquiryTopic(inquiry.topic)}
                        </span>
                      </div>

                      <p className="line-clamp-2 text-[11px] leading-relaxed">
                        {inquiry.message}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-muted text-[10px]">
                          {formatDate(inquiry.createdAt)} •{" "}
                          {formatTime(inquiry.createdAt)}
                        </span>

                        {inquiry.phone && (
                          <WhatsAppButton
                            variant="ghost"
                            iconSize={12}
                            phone={inquiry.phone}
                            message={`Hello ${inquiry.fullName}, following up on your inquiry with Patina Wellness...`}
                          >
                            Reply
                          </WhatsAppButton>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="border-border bg-background rounded-lg border p-6 text-center">
                    <p className="text-heading text-xs font-bold">
                      No new inquiries
                    </p>

                    <p className="text-muted mt-1 text-[11px]">
                      New messages submitted through the website will appear
                      here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {selectedBooking && (
        <ConsultationBookingModal
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
          booking={selectedBooking}
          onUpdated={handleBookingUpdated}
        />
      )}

      {selectedPartnership && (
        <PartnershipModal
          isOpen={!!selectedPartnership}
          onClose={() => setSelectedPartnership(null)}
          partnership={selectedPartnership}
          onUpdated={handlePartnershipUpdated}
        />
      )}

      {selectedInquiry && (
        <InquiryModal
          isOpen={!!selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          inquiry={selectedInquiry}
          onUpdated={handleInquiryUpdated}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
