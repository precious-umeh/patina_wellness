"use client";

import { useState } from "react";
import {
  ArrowsClockwiseIcon,
  ChatCircleTextIcon,
  CheckCircleIcon,
  EnvelopeSimpleOpenIcon,
  IdentificationCardIcon,
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

import { deleteInquiry, updateInquiry } from "@/app/lib/api/inquiries";
import { formatTime } from "@/app/lib/time";
import { formatDate } from "@/app/lib/date";
import { formatInquiryTopic } from "@/app/lib/inquiryTopic";
import { INQUIRY_STATUSES } from "../constants";

import ModalSectionHeading from "../layout/ModalSectionHeading";
import ModalInfoCard from "../layout/ModalInfoCard";
import ModalDetailRow from "../layout/ModalDetailRow";
import ModalTextDetail from "../layout/ModalTextDetail";

function InquiryModal({
  isOpen,
  onClose,
  inquiry,
  onUpdated,
  onInquiryDeleted,
}) {
  const [status, setStatus] = useState(inquiry?.status || "new");
  const [adminNotes, setAdminNotes] = useState(inquiry?.adminNotes || "");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  /**
   * ========================================
   * Update Inquiry
   * ========================================
   */
  const handleUpdate = async function () {
    if (!inquiry?._id) return;

    setSaving(true);
    setError("");

    try {
      const updatedInquiry = await updateInquiry(inquiry._id, {
        status,
        adminNotes,
      });

      onUpdated?.(updatedInquiry);
      onClose();
    } catch (error) {
      console.error("Update Inquiry Error:", error);

      setError(
        error.response?.data?.message || "Unable to update this inquiry.",
      );
    } finally {
      setSaving(false);
    }
  };

  /**
   * ========================================
   * Delete Inquiry
   * ========================================
   */
  const handleDelete = async function () {
    if (!inquiry._id) return;

    setDeleting(true);
    setError("");

    try {
      await deleteInquiry(inquiry._id);

      setIsDeleteModalOpen(false);

      onInquiryDeleted?.(inquiry._id);
      onClose();
    } catch (error) {
      console.error("Delete Inquiry Error:", error);

      setError(
        error.response?.data?.message || "Unable to delete this inquiry.",
      );
    } finally {
      setDeleting(false);
    }
  };

  if (!inquiry) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Inquiry from ${inquiry.fullName}`}
        position="right"
        panelClassName="max-w-lg rounded-l-none"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-border flex items-start justify-between gap-4 border-b px-6 py-5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-heading text-lg font-extrabold">
                  Inquiry Details
                </h2>

                <StatusBadge status={inquiry.status} type="inquiry" />
              </div>

              <p className="text-muted mt-1 text-xs">{inquiry.inquiryId}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={saving || deleting}
              aria-label="Close inquiry details"
              className="text-muted hover:text-heading shrink-0 transition-colors disabled:pointer-events-none disabled:opacity-50"
            >
              <XIcon size={20} weight="bold" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Contact Information */}
              <section>
                <ModalSectionHeading
                  icon={<UserIcon size={17} weight="duotone" />}
                  title="Client Information"
                />

                <div className="mt-4 grid grid-cols-1 gap-3">
                  <ModalInfoCard
                    icon={<IdentificationCardIcon size={17} weight="duotone" />}
                    label="Full Name"
                    value={inquiry.fullName}
                  />

                  <ModalInfoCard
                    icon={<EnvelopeSimpleOpenIcon size={17} weight="duotone" />}
                    label="Email Address"
                    value={inquiry.email}
                    href={`mailto:${inquiry.email}`}
                  />

                  {inquiry.phone && (
                    <ModalInfoCard
                      icon={<PhoneIcon size={17} weight="duotone" />}
                      label="Phone Number"
                      value={inquiry.phone}
                      href={`tel:${inquiry.phone}`}
                    />
                  )}
                </div>
              </section>

              {/* Inquiry */}
              <section>
                <ModalSectionHeading
                  icon={<ChatCircleTextIcon size={17} weight="duotone" />}
                  title="Inquiry"
                />

                <div className="border-border bg-surface mt-4 rounded-xl border p-4">
                  <div className="divide-border divide-y">
                    <ModalDetailRow
                      label="Topic"
                      value={formatInquiryTopic(inquiry.topic)}
                    />

                    <ModalDetailRow
                      label="Date"
                      value={formatDate(inquiry.createdAt)}
                    />

                    <ModalDetailRow
                      label="Time"
                      value={formatTime(inquiry.createdAt)}
                    />

                    <div className="mt-4">
                      <ModalTextDetail
                        label="Message"
                        value={inquiry.message}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Admin Management */}
              <section>
                <ModalSectionHeading
                  icon={<CheckCircleIcon size={17} weight="duotone" />}
                  title="Inquiry Management"
                />

                <div className="mt-4 space-y-5">
                  {/* Status */}
                  <div className="border-border bg-surface rounded-xl border p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-heading text-xs font-bold">
                          Current Status
                        </p>

                        <p className="text-muted mt-1 text-[11px]">
                          Update the progress of this inquiry.
                        </p>
                      </div>

                      <StatusBadge status={inquiry.status} type="inquiry" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="inquiry-status"
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
                        id="inquiry-status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        disabled={saving || deleting}
                        className="border-border bg-background text-heading focus:border-primary-dark focus:ring-primary-dark/20 h-10 w-full appearance-none rounded-lg border pr-8 pl-9 text-xs font-semibold outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {INQUIRY_STATUSES.filter(
                          (item) => item.value !== "all",
                        ).map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Admin notes */}
                  <div className="space-y-2">
                    <label
                      htmlFor="inquiry-admin-notes"
                      className="text-heading text-xs font-bold tracking-wide uppercase"
                    >
                      Admin Notes
                    </label>

                    <textarea
                      id="inquiry-admin-notes"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      disabled={saving || deleting}
                      rows={4}
                      placeholder="Add internal notes about this inquiry..."
                      className="border-border bg-background text-heading placeholder:text-muted focus:border-primary-dark focus:ring-primary-dark/20 w-full resize-none rounded-lg border px-3 py-2.5 text-xs leading-relaxed transition outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <p className="text-muted text-[10px]">
                      These notes are for internal adminstrative use.
                    </p>
                  </div>

                  {/* Error */}
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
              {inquiry.phone && (
                <WhatsAppButton
                  phone={inquiry.phone}
                  className="w-full"
                  message={`Hello ${inquiry.fullName}, following up on your inquiry with patina Wellness...`}
                >
                  Reply on WhatsApp
                </WhatsAppButton>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  leftIcon={<TrashIcon size={15} weight="bold" />}
                  onClick={() => setIsDeleteModalOpen(true)}
                  disabled={saving || deleting}
                >
                  Delete
                </Button>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onClose}
                    disabled={saving || deleting}
                  >
                    Close
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    onClick={handleUpdate}
                    loading={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!deleting) {
            setIsDeleteModalOpen(false);
          }
        }}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Inquiry"
        description="This will permanently remove this inquiry and its amdin notes. This action cannot be undone."
        itemName={inquiry.inquiryId}
      />
    </>
  );
}

export default InquiryModal;
