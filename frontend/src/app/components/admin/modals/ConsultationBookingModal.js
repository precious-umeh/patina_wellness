"use client";

import { useState } from "react";
import {
  ArrowsClockwiseIcon,
  CalendarCheckIcon,
  CheckCircleIcon,
  ClockIcon,
  EnvelopeSimpleOpenIcon,
  IdentificationCardIcon,
  MapPinIcon,
  NoteIcon,
  PhoneIcon,
  TrashIcon,
  UserIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";

import Modal from "../../shared/Modal";
import StatusBadge from "../StatusBadge";
import WhatsAppButton from "../WhatsAppButton";
import Button from "../../shared/Button";
import DeleteConfirmationModal from "../../shared/DeleteConfirmationModal";

import {
  deleteBooking,
  updateBooking,
} from "@/app/lib/api/consultationBookings";

import { BOOKING_STATUSES } from "../constants";

import ModalSectionHeading from "../layout/ModalSectionHeading";
import ModalInfoCard from "../layout/ModalInfoCard";
import ModalDetailRow from "../layout/ModalDetailRow";
import ModalTextDetail from "../layout/ModalTextDetail";

function ConsultationBookingModal({
  isOpen,
  onClose,
  booking,
  onUpdated,
  onBookingDeleted,
}) {
  const [status, setStatus] = useState(booking?.status || "pending");
  const [adminNotes, setAdminNotes] = useState(booking?.adminNotes || "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /**
   * ========================================
   * Handle Update
   * ========================================
   */
  const handleUpdate = async function () {
    if (!booking?._id) return;

    setSaving(true);
    setError("");

    try {
      const updatedBooking = await updateBooking(booking._id, {
        status,
        adminNotes,
      });

      onUpdated?.(updatedBooking);
      onClose();
    } catch (error) {
      console.error("Update Booking Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to update consultation booking.",
      );
    } finally {
      setSaving(false);
    }
  };

  /**
   * ========================================
   * Handle Delete
   * ========================================
   */
  const handleDeleteBooking = async function () {
    if (!booking?._id) return;

    setDeleting(true);
    setError("");

    try {
      await deleteBooking(booking._id);

      setIsDeleteModalOpen(false);

      onBookingDeleted?.(booking._id);
      onClose();
    } catch (error) {
      console.error("Delete Booking Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to delete this consultation booking.",
      );
    } finally {
      setDeleting(false);
    }
  };

  /**
   * =======================================
   * Format Date
   * =======================================
   */
  const formatDate = function (date) {
    if (!date) return "-";

    const parsedDate = new Date(`${date}T00:00:00`);

    return parsedDate.toLocaleDateString("en-NG", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  /**
   * =======================================
   * Format Appointment Type
   * =======================================
   */
  const formatAppointmentType = function (type) {
    if (type === "virtual") return "Virtual Consultation";
    if (type === "physical") return "Physical / In-Person";

    return "-";
  };

  /**
   * =======================================
   * Format Gender
   * =======================================
   */
  function formatGender(gender) {
    if (gender === "female") return "Female";
    if (gender === "male") return "Male";
    if (gender === "prefer-not-to-say") return "Prefer not to say";

    return "-";
  }

  if (!booking) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Consultation booking ${booking.bookingId}`}
        position="right"
        panelClassName="max-w-lg rounded-l-none"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-border flex items-start justify-between gap-4 border-b px-6 py-5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-heading text-lg font-extrabold">
                  Consultation Details
                </h2>

                <StatusBadge status={booking.status} type="consultation" />
              </div>

              <p className="text-muted mt-1 text-xs">{booking.bookingId}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={saving || deleting}
              aria-label="Close booking details"
              className="text-muted hover:text-heading shrink-0 transition-colors disabled:pointer-events-none disabled:opacity-50"
            >
              <XIcon size={20} weight="bold" />
            </button>
          </div>

          {/*  Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-7">
              {/* Appointment Summary */}
              <section>
                <ModalSectionHeading
                  icon={<CalendarCheckIcon size={17} weight="duotone" />}
                  title="Appointment"
                />

                <div className="border-border bg-surface mt-4 rounded-xl border">
                  <div className="divide-border divide-y">
                    <ModalDetailRow
                      label="Service"
                      value={booking.selectedService?.name}
                    />

                    <ModalDetailRow
                      label="Service Type"
                      value={booking.selectedService?.type}
                    />

                    <ModalDetailRow
                      label="Price"
                      value={booking.selectedService?.price}
                    />

                    <ModalDetailRow
                      label="Appointment Type"
                      value={formatAppointmentType(booking.appointmentType)}
                    />

                    <ModalDetailRow
                      label="Date"
                      value={formatDate(booking.appointmentDate)}
                    />

                    <ModalDetailRow
                      label="Time"
                      value={booking.appointmentTime}
                    />
                  </div>
                </div>
              </section>

              {/* Client Information */}
              <section>
                <ModalSectionHeading
                  icon={<UserIcon size={17} weight="duotone" />}
                  title="Client Information"
                />

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <ModalInfoCard
                    icon={<IdentificationCardIcon size={17} weight="duotone" />}
                    label="Full Name"
                    value={booking.fullName}
                  />

                  <ModalInfoCard
                    icon={<ClockIcon size={17} weight="duotone" />}
                    label="Age Bracket"
                    value={booking.ageBracket}
                  />

                  <ModalInfoCard
                    icon={<PhoneIcon size={17} weight="duotone" />}
                    label="Phone Number"
                    value={booking.phoneNumber}
                    href={`tel:${booking.phoneNumber}`}
                  />

                  <ModalInfoCard
                    icon={<EnvelopeSimpleOpenIcon size={17} weight="duotone" />}
                    label="Email Address"
                    value={booking.email}
                    href={`mailto:${booking.email}`}
                  />

                  <ModalInfoCard
                    icon={<UserIcon size={17} weight="duotone" />}
                    label="Gender"
                    value={formatGender(booking.gender)}
                  />
                </div>
              </section>

              {/* Clinical Information */}
              <section>
                <ModalSectionHeading
                  icon={<NoteIcon size={17} weight="duotone" />}
                  title="Clinical Information"
                />

                <div className="mt-4 space-y-4">
                  <ModalTextDetail
                    label="Primary Health Concern"
                    value={booking.primaryConcern}
                  />

                  <ModalTextDetail
                    label="Current Medications & Supplements"
                    value={booking.currentMedications}
                    emptyText="No medications or supplements provided."
                  />

                  <ModalTextDetail
                    label="Existing Conditions"
                    value={booking.existingConditions}
                    emptyText="No existing condidtions provided."
                  />
                </div>
              </section>

              {/* Referral Information */}
              <section>
                <ModalSectionHeading
                  icon={<MapPinIcon size={17} weight="duotone" />}
                  title="Referral"
                />

                <div className="border-border bg-surface mt-4 rounded-xl border">
                  <div className="divide-border divide-y">
                    <ModalDetailRow
                      label="Referral Source"
                      value={booking.referralSource}
                    />

                    <ModalDetailRow
                      label="Referral Code"
                      value={booking.referralCode || "No referral code"}
                    />
                  </div>
                </div>
              </section>

              {/* Admin Management */}
              <section>
                <ModalSectionHeading
                  icon={<CheckCircleIcon size={17} weight="duotone" />}
                  title="Booking Management"
                />

                <div className="mt-4 space-y-5">
                  {/* Current Status */}
                  <div className="border-border bg-surface rounded-xl border p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-heading text-xs font-bold">
                          Current Status
                        </p>

                        <p className="text-muted mt-1 text-[11px]">
                          Update the progress of this consultation request.
                        </p>
                      </div>

                      <StatusBadge
                        status={booking.status}
                        type="consultation"
                      />
                    </div>
                  </div>

                  {/* Status Select */}
                  <div className="space-y-2">
                    <label
                      htmlFor="booking-status"
                      className="text-heading text-xs font-bold tracking-wide uppercase"
                    >
                      Change Status
                    </label>

                    <div className="relative">
                      <ArrowsClockwiseIcon
                        size={17}
                        weight="bold"
                        className="text-muted absolute top-1/2 left-3 -translate-y-1/2"
                      />

                      <select
                        id="booking-status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        disabled={saving || deleting}
                        className="border-border bg-background text-heading focus:border-primary-dark focus:ring-primary-dark/20 h-10 w-full appearance-none rounded-lg border pr-8 pl-9 text-xs font-semibold outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {BOOKING_STATUSES.filter(
                          (item) => item.value !== "all",
                        ).map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Admin Notes */}
                  <div className="space-y-2">
                    <label
                      htmlFor="booking-admin-notes"
                      className="text-heading text-xs font-bold tracking-wide uppercase"
                    >
                      Admin Notes
                    </label>

                    <textarea
                      id="booking-admin-notes"
                      rows={4}
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      disabled={saving || deleting}
                      placeholder="Add internal notes about this booking..."
                      className="border-border bg-background text-heading placeholder:text-muted focus:border-primary-dark focus:ring-primary-dark/20 w-full resize-none rounded-lg border px-3 py-2.5 text-xs leading-relaxed transition outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <p className="text-muted text-[10px]">
                      These notes are for internal administrative use.
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="border-danger/30 bg-danger/10 rounded-lg border p-3">
                      <p className="text-danger text-xs font-semibold">
                        {error}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="border-border bg-background border-t px-6 py-4">
            <div className="flex flex-col gap-3">
              {/* WhatsApp */}
              <WhatsAppButton
                phone={booking.phoneNumber}
                className="w-full"
                message={`Hello ${booking.fullName}, regarding your booking for ${booking.selectedService.name}...`}
              >
                Contact Client
              </WhatsAppButton>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                {/* Delete Action  */}
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  leftIcon={<TrashIcon size={16} weight="bold" />}
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={saving || deleting}
                >
                  Delete
                </Button>

                {/*  Actions  */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onClose}
                    disabled={saving}
                  >
                    Close
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    loading={saving}
                    disabled={saving}
                    onClick={handleUpdate}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!deleting) {
            setIsDeleteModalOpen(false);
          }
        }}
        onConfirm={handleDeleteBooking}
        loading={deleting}
        title="Delete this booking?"
        description="This will permanently remove this consultation booking. This action cannot be undone."
        itemName={booking?.fullName}
      />
    </>
  );
}

export default ConsultationBookingModal;
