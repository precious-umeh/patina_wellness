import {
  CalendarCheckIcon,
  CheckIcon,
  FloppyDiskIcon,
} from "@phosphor-icons/react/dist/ssr";
import Button from "../../shared/Button";
import TimeSlots from "./TimeSlots";
import { WEEK_DAYS } from "../constants";

function ConsultationSettings({
  availability,
  loading,
  saving,
  error,
  successMessage,
  onToggleAvailability,
  onToggleWorkingDay,
  onAddTimeSlot,
  onEditTimeSlot,
  onRemoveTimeSlot,
  onSave,
}) {
  if (loading) {
    return (
      <section className="space-y-4">
        {/* Section Header */}
        <div>
          <h2 className="text-heading text-lg font-extrabold">
            Consultation Settings
          </h2>

          <p className="text-muted mt-1 text-xs">
            Control when clients can request consultations and which appointment
            slots are available.
          </p>
        </div>

        {/* Loading Skeleton */}
        <div className="border-border bg-surface animate-pulse overflow-hidden rounded-xl border shadow-2xs">
          <div className="space-y-8 p-6">
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="bg-border h-4 w-48 rounded" />
                <div className="bg-border h-3 w-80 rounded" />
              </div>

              <div className="bg-border h-6 w-20 rounded-full" />
            </div>

            {/* Working Days */}
            <div className="space-y-3">
              <div className="bg-border h-4 w-32 rounded" />
              <div className="bg-border h-3 w-72 rounded" />

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div key={index} className="bg-border h-11 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="space-y-3">
              <div className="bg-border h-4 w-24 rounded" />

              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-border h-11 w-full rounded-lg" />
              ))}
            </div>

            {/* Save */}
            <div className="border-border flex items-center justify-between border-t pt-5">
              <div className="bg-border h-3 w-64 rounded" />
              <div className="bg-border h-10 w-32 rounded-lg" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-heading text-lg font-extrabold">
          Consultation Settings
        </h2>

        <p className="text-muted mt-1 text-xs">
          Control when clients can request consultations and which appointment
          slots are available.
        </p>
      </div>

      {/* Availability Card */}
      <div className="border-border bg-surface overflow-hidden rounded-xl border shadow-2xs">
        {/* Card Header */}
        <div className="border-border flex flex-col gap-4 border-b px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="bg-primary-light text-primary-dark flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
              <CalendarCheckIcon size={21} weight="duotone" />
            </div>

            <div>
              <h3 className="text-heading text-sm font-extrabold">
                Consultation Availability
              </h3>

              <p className="text-muted mt-1 text-xs">
                Configure the days and times when consultations can be booked.
              </p>
            </div>
          </div>

          {/* Active Toggle */}
          <button
            type="button"
            onClick={onToggleAvailability}
            aria-pressed={availability?.isActive}
            className="flex items-center gap-3 self-start"
          >
            <span
              className={`text-xs font-bold ${
                availability?.isActive ? "text-emerald-700" : "text-muted"
              }`}
            >
              {availability?.isActive ? "Active" : "Inactive"}
            </span>

            <span
              className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${
                availability?.isActive ? "bg-primary-dark" : "bg-border"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                  availability?.isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </span>
          </button>
        </div>

        {/* Card Content */}
        <div className="space-y-8 p-6">
          {/* Inactive Notice */}
          {!availability?.isActive && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
              <p className="text-xs font-semibold text-amber-800">
                Consultation booking is currently disabled. Customers will not
                be able to request new consultation appointments.
              </p>
            </div>
          )}

          {/* Working Days */}
          <div>
            <div className="mb-3">
              <h4 className="text-heading text-sm font-extrabold">
                Working Days
              </h4>

              <p className="text-muted mt-1 text-xs">
                Select the days on which consultation appointments can be
                scheduled.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
              {WEEK_DAYS.map((day) => {
                const selected = availability?.workingDays.includes(day.value);

                return (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => onToggleWorkingDay(day.value)}
                    className={`flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 text-xs font-bold transition-all ${
                      selected
                        ? "border-primary-dark bg-primary-light text-primary-dark"
                        : "border-border bg-background text-muted hover:bg-primary-dark/40 hover:text-heading"
                    }`}
                  >
                    {selected && <CheckIcon size={14} weight="bold" />}

                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots */}
          <TimeSlots
            availability={availability}
            onAddTimeSlot={onAddTimeSlot}
            onEditTimeSlot={onEditTimeSlot}
            onRemoveTimeSlot={onRemoveTimeSlot}
          />

          {/* Feedback */}
          {error && (
            <div className="border-danger/30 bg-danger/10 rounded-lg border p-4">
              <p className="text-danger text-xs font-semibold">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4">
              <p className="text-xs font-semibold text-emerald-800">
                {successMessage}
              </p>
            </div>
          )}

          {/* Save */}
          <div className="border-border flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted text-[11px]">
              Changes will affect future consultation availability.
            </p>

            <Button
              onClick={onSave}
              loading={saving}
              disabled={saving}
              leftIcon={<FloppyDiskIcon size={15} weight="bold" />}
            >
              {saving ? "Saving Changes" : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ConsultationSettings;
