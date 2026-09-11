import {
  ClockIcon,
  PencilSimpleIcon,
  PlusIcon,
  TrashIcon,
} from "@phosphor-icons/react/dist/ssr";
import Button from "../../shared/Button";

function TimeSlots({
  availability,
  onAddTimeSlot,
  onEditTimeSlot,
  onRemoveTimeSlot,
}) {
  return (
    <div>
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h4 className="text-heading text-sm font-extrabold">
            Available Time Slots
          </h4>

          <p className="text-muted mt-1 text-xs">
            These time slots will be available for clients to select when
            booking.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          leftIcon={<PlusIcon size={14} weight="bold" />}
          onClick={onAddTimeSlot}
        >
          Add Time Slot
        </Button>
      </div>

      <div className="space-y-2">
        {availability?.timeSlots.map((slot) => (
          <div
            key={slot}
            className="border-border bg-background flex items-center justify-between rounded-lg border px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="bg-surface text-primary-dark flex h-8 w-8 items-center justify-center rounded-md">
                <ClockIcon size={17} weight="duotone" />
              </div>

              <span className="text-heading text-xs font-bold">{slot}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Edit */}
              <button
                type="button"
                onClick={() => onEditTimeSlot(slot)}
                aria-label={`Edit ${slot}`}
                className="text-muted hover:text-heading flex h-8 w-8 items-center justify-center rounded-md transition-colors"
              >
                <PencilSimpleIcon size={16} weight="bold" />
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => onRemoveTimeSlot(slot)}
                disabled={availability.timeSlots.length <= 1}
                aria-label={`Remove ${slot}`}
                className="text-muted hover:text-danger flex h-8 w-8 items-center justify-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-50"
              >
                <TrashIcon size={17} weight="bold" />
              </button>
            </div>
          </div>
        ))}

        {availability.timeSlots.length === 0 && (
          <div className="border-border bg-background rounded-lg border border-dashed px-6 py-8 text-center">
            <ClockIcon
              size={24}
              weight="duotone"
              className="text-muted mx-auto"
            />

            <p className="text-heading mt-2 text-xs font-bold">
              No time slots configured
            </p>

            <p className="text-muted mt-1 text-[11px]">
              Add at least one time slot before saving.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TimeSlots;
