"use client";

import { useState } from "react";
import Modal from "../../shared/Modal";
import { CalendarCheckIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import Button from "../../shared/Button";

function AddEditBlockedDateModal({
  isOpen,
  onClose,
  blockedDate = null,
  onSave,
  saving = false,
}) {
  const isEditing = Boolean(blockedDate);

  const [date, setDate] = useState(blockedDate?.date || "");
  const [reason, setReason] = useState(blockedDate?.reason || "");
  const [error, setError] = useState("");

  const handleClose = function () {
    if (saving) return;

    setError("");
    onClose();
  };

  const handleSubmit = async function (e) {
    e.preventDefault();

    setError("");

    if (!date) {
      setError("Please select a date.");
      return;
    }

    const success = await onSave({
      date,
      reason: reason.trim(),
    });

    if (success) {
      setError("");
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Blocked Date" : "Block a Date"}
      panelClassName="max-w-lg"
    >
      <div className="flex max-h-[90vh] flex-col">
        {/* Header */}
        <div className="border-border flex items-start justify-between border-b px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="bg-primary-light text-primary-dark flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <CalendarCheckIcon size={20} weight="duotone" />
            </div>

            <div>
              <h2 className="text-heading font-extrabold">
                {isEditing ? "Edit Blocked Date" : "Block a Date"}
              </h2>

              <p className="text-muted mt-1 text-xs leading-relaxed">
                {isEditing
                  ? "Update the date or reason for this blocked date."
                  : "Prevent clients from booking consultations on a specific date."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            aria-label="Close modal"
            className="text-muted hover:bg-background hover:text-heading -mr-2 flex h-8 w-8 items-center justify-center rounded-full transition-colors disabled:pointer-events-none disabled:opacity-50"
          >
            <XIcon size={18} weight="bold" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 px-6 py-6">
            {/* Error */}
            {error && (
              <div className="border-danger/30 bg-danger/10 rounded-lg border p-3">
                <p className="text-danger text-xs font-semibold">{error}</p>
              </div>
            )}

            {/* Date */}
            <div>
              <label
                htmlFor="blocked-consultation-date"
                className="text-heading mb-2 block text-xs font-bold"
              >
                Blocked Date
              </label>

              <input
                id="blocked-consultation-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={saving}
                className="border-border bg-background text-heading focus:border-primary-dark focus:ring-primary-dark/20 h-11 w-full rounded-lg border px-3 text-sm transition outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
              />

              <p className="text-muted mt-2 text-[11px] leading-relaxed">
                Clients will not be able to book consultations on this date.
              </p>
            </div>

            {/* Reason */}
            <div>
              <label
                htmlFor="blocked-date-reason"
                className="text-heading mb-2 block text-xs font-bold"
              >
                Reason{" "}
                <span className="text-muted font-normal">(Optional)</span>
              </label>

              <textarea
                id="blocked-date-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={saving}
                rows={3}
                placeholder="e.g. Public holiday, pharmacist unavailable..."
                className="border-border bg-background text-heading placeholder:text-muted focus:border-primary-dark focus:ring-primary-dark/20 w-full resize-none rounded-lg border px-3 py-3 text-sm transition outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="border-border flex items-center justify-end gap-3 border-t px-6 py-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button type="submit" size="sm" loading={saving} disabled={saving}>
              {isEditing ? "Save Changes" : "Block a Date"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default AddEditBlockedDateModal;
