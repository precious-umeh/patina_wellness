"use client";

import {
  TrashIcon,
  WarningCircleIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import Modal from "./Modal";
import Button from "./Button";

function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title = "Delete item?",
  description = "This action cannot be undone.",
  itemName = "",
  error = "",
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      position="center"
      panelClassName="max-w-md"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="bg-danger/10 text-danger flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
            <WarningCircleIcon size={24} weight="duotone" />
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
            className="text-muted hover:text-heading transition-colors disabled:pointer-events-none disabled:opacity-50"
          >
            <XIcon size={20} weight="bold" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5">
          <h2 className="text-heading text-lg font-extrabold">{title}</h2>

          <p className="text-muted mt-2 text-sm leading-relaxed">
            {description}
          </p>

          {itemName && (
            <div className="bg-background border-border mt-4 rounded-lg border px-4 py-3">
              <p className="text-heading truncate text-sm font-bold">
                {itemName}
              </p>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="border-danger/30 bg-danger/10 text-danger mt-4 rounded-lg border p-3 text-xs font-medium"
            >
              {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            loading={loading}
            leftIcon={<TrashIcon size={16} weight="bold" />}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteConfirmationModal;
