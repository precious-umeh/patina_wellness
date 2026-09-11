"use client";

import {
  ArrowsClockwiseIcon,
  BuildingsIcon,
  CheckCircleIcon,
  EnvelopeSimpleOpenIcon,
  GlobeIcon,
  IdentificationCardIcon,
  PhoneIcon,
  TargetIcon,
  TrashIcon,
  UserIcon,
  UsersThreeIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

import Modal from "../../shared/Modal";
import StatusBadge from "../StatusBadge";

import ModalSectionHeading from "../layout/ModalSectionHeading";
import ModalDetailRow from "../layout/ModalDetailRow";
import ModalInfoCard from "../layout/ModalInfoCard";
import ModalTextDetail from "../layout/ModalTextDetail";
import WhatsAppButton from "../WhatsAppButton";
import Button from "../../shared/Button";
import DeleteConfirmationModal from "../../shared/DeleteConfirmationModal";

import { PARTNERSHIP_STATUSES } from "../constants";
import {
  deletePartnership,
  updatePartnership,
} from "@/app/lib/api/partnerships";
import { formatPartnershipType } from "@/app/lib/partnership";

function PartnershipModal({
  isOpen,
  onClose,
  partnership,
  onUpdated,
  onPartnershipDeleted,
}) {
  const [status, setStatus] = useState(partnership?.status || "new");
  const [adminNotes, setAdminNotes] = useState(partnership?.adminNotes || "");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  /**
   * ========================================
   * Update Partnership
   * ========================================
   */
  const handleUpdate = async function () {
    if (!partnership?._id) return;

    setSaving(true);
    setError("");

    try {
      const updatedPartnership = await updatePartnership(partnership._id, {
        status,
        adminNotes,
      });

      onUpdated?.(updatedPartnership);
      onClose();
    } catch (error) {
      console.error("Update Partnership Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to update this partnership application.",
      );
    } finally {
      setSaving(false);
    }
  };

  /**
   * =======================================
   * Delete Partnership
   * =======================================
   */
  const handleDelete = async function () {
    if (!partnership?._id) return;

    setDeleting(true);
    setError("");

    try {
      await deletePartnership(partnership._id);

      setIsDeleteModalOpen(false);

      onPartnershipDeleted?.(partnership._id);
      onClose();
    } catch (error) {
      console.error("Delete Partnership Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to delete this partnership application.",
      );
    } finally {
      setDeleting(false);
    }
  };

  if (!partnership) return null;

  const isCorporate = partnership.partnershipType === "corporate";

  const isPractitioner = partnership.partnershipType === "practitioner";

  const isAmbassador = partnership.partnershipType === "ambassador";

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Partnership application ${partnership.applicationId}`}
        position="right"
        panelClassName="max-w-lg rounded-l-none"
      >
        <div className="flex h-full flex-col">
          {/* Header */}

          <div className="border-border flex items-start justify-between gap-4 border-b px-6 py-5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-heading text-lg font-extrabold">
                  Partnership Details
                </h2>

                <StatusBadge status={partnership.status} type="partnership" />
              </div>

              <p className="text-muted mt-1 text-xs">
                {partnership.applicationId}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={saving || deleting}
              aria-label="Close partnership details"
              className="text-muted hover:text-heading shrink-0 transition-colors disabled:pointer-events-none disabled:opacity-50"
            >
              <XIcon size={20} weight="bold" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Partnership Summary */}
              <section>
                <ModalSectionHeading
                  icon={<UsersThreeIcon size={17} weight="duotone" />}
                  title="Partnership"
                />

                <div className="border-border bg-surface mt-4 rounded-xl border">
                  <div className="divide-border divide-y">
                    <ModalDetailRow
                      label="Partnership type"
                      value={formatPartnershipType(partnership.partnershipType)}
                    />

                    <ModalDetailRow
                      label="Preferred Contact"
                      value={partnership.preferredContactMethod || "-"}
                    />
                  </div>
                </div>
              </section>

              {/* Applicant Information */}
              <section>
                <ModalSectionHeading
                  icon={<UserIcon size={17} weight="duotone" />}
                  title="Applicant Information"
                />

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <ModalInfoCard
                    icon={<IdentificationCardIcon size={17} weight="duotone" />}
                    label="Full Name"
                    value={partnership.fullName}
                  />

                  <ModalInfoCard
                    icon={<PhoneIcon size={17} weight="duotone" />}
                    label="Phone Number"
                    value={partnership.phoneNumber}
                    href={`tel:${partnership.phoneNumber}`}
                  />

                  <ModalInfoCard
                    icon={<EnvelopeSimpleOpenIcon size={17} weight="duotone" />}
                    label="Email Address"
                    value={partnership.email}
                    href={`mailto:${partnership.email}`}
                  />
                </div>
              </section>

              {/* Partnership Goals */}
              <section>
                <ModalSectionHeading
                  icon={<TargetIcon size={17} weight="duotone" />}
                  title="Partnership Goals"
                />

                <div className="mt-4">
                  <ModalTextDetail
                    label="What are you hoping to achieve?"
                    value={partnership.partnershipGoals}
                  />
                </div>
              </section>

              {/* Additional Information */}

              {(isCorporate || isPractitioner || isAmbassador) && (
                <section>
                  <ModalSectionHeading
                    icon={
                      isCorporate ? (
                        <BuildingsIcon size={17} weight="duotone" />
                      ) : isPractitioner ? (
                        <IdentificationCardIcon size={17} weight="duotone" />
                      ) : (
                        <GlobeIcon size={17} weight="duotone" />
                      )
                    }
                    title={
                      isCorporate
                        ? "Organisation Information"
                        : isPractitioner
                          ? "Professional Information"
                          : "Ambassador Information"
                    }
                  />

                  <div className="border-border bg-surface mt-4 rounded-xl border">
                    <div className="divide-border divide-y">
                      {isCorporate && (
                        <>
                          <ModalDetailRow
                            label="Organisation"
                            value={partnership.organisationName}
                          />

                          <ModalDetailRow
                            label="Industry"
                            value={partnership.industry}
                          />

                          <ModalDetailRow
                            label="Company Size"
                            value={partnership.companySize || "-"}
                          />
                        </>
                      )}

                      {isPractitioner && (
                        <>
                          <ModalDetailRow
                            label="Area of Specialty"
                            value={partnership.areaOfSpecialty}
                          />

                          <ModalDetailRow
                            label="Website / Social"
                            value={partnership.websiteOrSocial}
                          />
                        </>
                      )}

                      {isAmbassador && (
                        <ModalDetailRow
                          label="Website / Social"
                          value={partnership.websiteOrSocial}
                        />
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* Admin Management */}
              <section>
                <ModalSectionHeading
                  icon={<CheckCircleIcon size={17} weight="duotone" />}
                  title="Partnership Management"
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
                          Update the progress of this partnership application.
                        </p>
                      </div>

                      <StatusBadge
                        status={partnership.status}
                        type="partnership"
                      />
                    </div>
                  </div>

                  {/* Status Select */}

                  <div className="space-y-2">
                    <label
                      htmlFor="partnership-status"
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
                        id="partnership-status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        disabled={saving || deleting}
                        className="border-border bg-background text-heading focus:border-primary-dark focus:ring-primary-dark/20 h-10 w-full appearance-none rounded-lg border pr-8 pl-9 text-xs font-semibold outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {PARTNERSHIP_STATUSES.filter(
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
                      htmlFor="partnership-admin-notes"
                      className="text-heading text-xs font-bold tracking-wide uppercase"
                    >
                      Admin Notes
                    </label>

                    <textarea
                      id="partnership-admin-notes"
                      rows={4}
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      disabled={saving || deleting}
                      placeholder="Add internal notes about this partnership application..."
                      className="border-border bg-background text-heading placeholder:text-muted focus:border-primary-dark focus:ring-primary-dark/20 w-full resize-none rounded-lg border px-3 py-2.5 text-xs leading-relaxed transition outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <p className="text-muted text-[10px]">
                      These notes are for internal administrative use.
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

              <WhatsAppButton
                phone={partnership.phoneNumber}
                className="w-full"
                message={`Hello ${partnership.fullName}, following up regarding your partnership application with Patina Wellness...`}
              >
                Contact Applicant
              </WhatsAppButton>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                {/* Delete */}

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

                {/* Actions */}

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
                    disabled={saving || deleting}
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
        title="Delete Partnership Application?"
        description="This will permanently remove this partnership application and its admin notes. This action cannot be undone."
        itemName={partnership.applicationId}
      />
    </>
  );
}

export default PartnershipModal;
