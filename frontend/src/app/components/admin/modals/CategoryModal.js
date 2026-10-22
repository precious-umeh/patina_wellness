"use client";

import { useRef } from "react";

import { FolderOpenIcon, XIcon } from "@phosphor-icons/react/dist/ssr";

import Modal from "../../shared/Modal";
import Button from "../../shared/Button";

import CategoryParentPicker from "../categories/CategoryParentPicker";

import useCategoryForm from "@/app/hooks/admin/useCategoryForm";

function CategoryModal({
  isOpen,
  onClose,
  onSaved,
  category = null,
  categories = [],
}) {
  const nameInputRef = useRef(null);

  const {
    isEditing,
    name,
    parentId,
    isActive,
    submitting,
    error,
    availableParents,
    setError,
    handleNameChange,
    handleParentChange,
    handleActiveChange,
    handleSubmit,
  } = useCategoryForm({ category, categories, onSaved, onClose });

  function handleModalClose() {
    if (submitting) return;

    setError("");
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={isEditing ? "Edit Category" : "Create Category"}
      position="center"
      panelClassName="max-h-[90vh] max-w-xl overflow-y-auto bg-surface scrollbar-hide"
      initialFocusRef={nameInputRef}
    >
      {/* Modal Header */}
      <div className="border-border bg-surface sticky top-0 z-10 flex items-start justify-between gap-4 border-b px-5 py-4 sm:px-6">
        <div>
          <p className="text-primary-dark text-[10px] font-bold tracking-[0.18em] uppercase">
            Catalogue Management
          </p>

          <h2 className="text-heading mt-1 text-lg font-extrabold">
            {isEditing ? "Edit Category" : "Create Category"}
          </h2>

          <p className="text-muted mt-1 text-xs">
            {isEditing
              ? "Update the category details and hierarchy."
              : "Create a top-level category or a subcategory."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleModalClose}
          disabled={submitting}
          aria-label="Close category modal"
          className="text-muted hover:bg-background hover:text-heading rounded-lg p-2 transition-colors disabled:pointer-events-none disabled:opacity-50"
        >
          <XIcon size={19} weight="bold" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-5 p-5 sm:p-6">
          {/* Category name */}
          <div className="space-y-1.5">
            <label
              htmlFor="category-name"
              className="text-heading text-xs font-semibold"
            >
              Category Name <span className="text-secondary-dark">*</span>
            </label>

            <input
              ref={nameInputRef}
              id="category-name"
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. Wellness"
              required
              maxLength={100}
              disabled={submitting}
              className="border-border bg-background text-heading placeholder:text-muted focus:border-primary-dark focus:ring-primary-dark/20 h-10 w-full rounded-lg border px-3 text-sm outline-none focus:ring-2 disabled:opacity-60"
            />

            <p className="text-muted text-[10px]">
              Use a clear name that describes this category.
            </p>
          </div>

          {/* Parent Category */}
          <CategoryParentPicker
            categories={categories}
            availableParents={availableParents}
            parentId={parentId}
            onChange={handleParentChange}
            disabled={submitting}
          />

          {/* Active Status - editing only */}
          {isEditing && (
            <div className="border-border bg-background flex items-start gap-3 rounded-lg border p-3">
              <input
                id="category-active"
                type="checkbox"
                checked={isActive}
                onChange={handleActiveChange}
                disabled={submitting}
                className="accent-primary-dark mt-0.5 h-4 w-4 shrink-0"
              />

              <div>
                <label
                  htmlFor="category-active"
                  className="text-heading block cursor-pointer text-xs font-semibold"
                >
                  Active category
                </label>

                <p className="text-muted mt-1 text-[10px] leading-relaxed">
                  Active categories can be assigned to products. Deactivation
                  may be prevented if active subcategories still depend on this
                  category.
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="border-danger/30 bg-danger/10 text-danger rounded-lg border p-3 text-xs font-medium"
            >
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-border bg-background/50 flex flex-col-reverse gap-3 border-t px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleModalClose}
            disabled={submitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            loading={submitting}
            disabled={submitting}
            leftIcon={
              !submitting ? (
                <FolderOpenIcon size={16} weight="bold" />
              ) : undefined
            }
          >
            {submitting
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Create Category"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CategoryModal;
