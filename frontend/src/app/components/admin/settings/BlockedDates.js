import {
  CalendarCheckIcon,
  PencilSimpleIcon,
  PlusIcon,
  TrashIcon,
} from "@phosphor-icons/react/dist/ssr";

import { formatBlockedDate } from "@/app/lib/date";

import Button from "../../shared/Button";

function BlockedDates({
  blockedDates,
  loading,
  error,
  successMessage,
  onAdd,
  onEdit,
  onDelete,
}) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-heading text-lg font-extrabold">Blocked Dates</h2>

          <p className="text-muted mt-1 text-xs">
            Prevent consultations from being booked on specific dates.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          leftIcon={<PlusIcon size={14} weight="bold" />}
          onClick={onAdd}
        >
          Block a Date
        </Button>
      </div>

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

      <div className="border-border bg-surface overflow-hidden rounded-xl border p-6 shadow-2xs">
        {/* Loading */}
        {loading && (
          <div className="divide-border divide-y">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex animate-pulse items-center justify-between px-6 py-5"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-border h-10 w-10 rounded-lg" />

                  <div className="space-y-2">
                    <div className="bg-border h-3 w-32 rounded" />
                    <div className="bg-border h-2.5 w-48 rounded" />
                  </div>
                </div>

                <div className="bg-border h-8 w-16 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && blockedDates.length === 0 && (
          <div className="px-6 py-12 text-center">
            <div className="bg-background text-muted mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full">
              <CalendarCheckIcon size={22} weight="duotone" />
            </div>

            <h3 className="text-heading text-sm font-extrabold">
              No blocked dates
            </h3>

            <p className="text-muted mx-auto mt-1 max-w-sm text-xs leading-relaxed">
              Block dates when consultations should not be available for
              booking.
            </p>
          </div>
        )}

        {/* Blocked Dates List */}
        {!loading && blockedDates.length > 0 && (
          <div className="divide-border divide-y">
            {blockedDates.map((blockedDate) => (
              <div
                key={blockedDate._id}
                className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Date + Reason */}
                <div className="flex items-start gap-3">
                  <div className="bg-primary-light text-primary-dark flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                    <CalendarCheckIcon size={19} weight="duotone" />
                  </div>

                  <div>
                    <p className="text-heading text-sm font-extrabold">
                      {formatBlockedDate(blockedDate.date)}
                    </p>

                    <p className="text-muted mt-0.5 text-[11px]">
                      {blockedDate.reason || "No reason provided"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => onEdit(blockedDate)}
                    aria-label={`Edit ${blockedDate.date}`}
                    className="text-muted hover:text-heading flex h-8 w-8 items-center justify-center rounded-md transition-colors"
                  >
                    <PencilSimpleIcon size={16} weight="bold" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(blockedDate)}
                    aria-label={`Delete ${blockedDate.date}`}
                    className="text-muted hover:text-danger flex h-8 w-8 items-center justify-center rounded-md transition-colors"
                  >
                    <TrashIcon size={17} weight="bold" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default BlockedDates;
