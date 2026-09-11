"use client";

import { useState } from "react";
import { ClockIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import Modal from "../../shared/Modal";
import Button from "../../shared/Button";
import { formatTime12Hour, formatTime24Hour } from "@/app/lib/time";

function AddEditTimeSlotModal({
  isOpen,
  onClose,
  slot = null,
  onSave,
  saving = false,
}) {
  const isEditing = Boolean(slot);

  const [timeSlot, setTimeSlot] = useState(slot ? formatTime24Hour(slot) : "");
  const [error, setError] = useState("");

  const handleClose = function () {
    if (saving) return;

    setError("");
    onClose();
  };

  const handleSubmit = async function (e) {
    e.preventDefault();

    setError("");

    if (!timeSlot) {
      setError("Please select a consultation time.");
      return;
    }

    const formattedTime = formatTime12Hour(timeSlot);

    if (!formattedTime) {
      setError("Please select a valid consultation time.");
      return;
    }

    const result = await onSave(formattedTime);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? "Edit Time Slot" : "Add Time Slot"}
      panelClassName="max-w-lg"
    >
      <div className="flex max-h-[90vh] flex-col">
        {/* Header */}
        <div className="border-border flex items-start justify-between border-b px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="bg-primary-light text-primary-dark flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
              <ClockIcon size={20} weight="duotone" />
            </div>

            <div>
              <h2 className="text-heading font-extrabold">
                {isEditing ? "Edit Time Slot" : "Add Time Slot"}
              </h2>

              <p className="text-muted mt-1 text-xs leading-relaxed">
                {isEditing
                  ? "Update the consultation time available for bookings."
                  : "Add a consultation time that clients can select when booking."}
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

            {/* Time Slot */}
            <div>
              <label
                htmlFor="consultation-time-slot"
                className="text-heading mb-2 block text-xs font-bold"
              >
                Consultation Time
              </label>

              <input
                id="consultation-time-slot"
                type="time"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                disabled={saving}
                className="border-border bg-background text-heading focus:border-primary-dark focus:ring-primary-dark/20 h-11 w-full rounded-lg border px-3 text-sm transition outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
              />

              <p className="text-muted mt-2 text-[11px] leading-relaxed">
                Select the time clients should be able to book.
              </p>
            </div>

            {/* Preview */}
            {timeSlot && (
              <div className="bg-background rounded-lg p-4">
                <p className="text-muted text-[11px] font-semibold">
                  Booking time
                </p>

                <p className="text-heading mt-1 text-sm font-extrabold">
                  {formatTime12Hour(timeSlot)}
                </p>
              </div>
            )}
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
              {isEditing ? "Save Changes" : "Add Time Slot"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default AddEditTimeSlotModal;
