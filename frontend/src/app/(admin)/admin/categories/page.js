"use client";

import { useCallback, useState } from "react";

import {
  ArrowClockwiseIcon,
  CheckCircleIcon,
  FolderOpenIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  WarningCircleIcon,
  XCircleIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";

import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import AdminStatsCard from "@/app/components/admin/AdminStatsCard";
import Button from "@/app/components/shared/Button";
import DeleteConfirmationModal from "@/app/components/shared/DeleteConfirmationModal";
import CategoryModal from "@/app/components/admin/modals/CategoryModal";
import CategoriesTable from "@/app/components/admin/categories/CategoriesTable";
import useAdminCategories from "@/app/hooks/admin/useAdminCategories";

import Stagger from "@/app/components/animations/Stagger";
import StaggerItem from "@/app/components/animations/StaggerItem";
import Reveal from "@/app/components/animations/Reveal";

import {
  CategoryLoadingState,
  EmptyCategories,
} from "@/app/components/admin/categories/CategoryListStates";
import { deleteCategory } from "@/app/lib/api/categories";

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

function AdminCategoriesPage() {
  const {
    flatCategories,
    categoryById,

    loading,
    error,

    searchQuery,
    statusFilter,
    expandedCategoryIds,

    activeCount,
    inactiveCount,
    parentCount,

    filteredCategories,
    visibleCategories,
    hasActiveFilters,

    handleSearchChange,
    clearSearch,
    handleStatusChange,
    clearFilters,

    toggleCategoryExpanded,
    categoryHasVisibleChildren,
    refreshCategories,
  } = useAdminCategories();

  const [notice, setNotice] = useState("");

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryModalSession, setCategoryModalSession] = useState(0);

  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleRefresh = useCallback(() => {
    refreshCategories();
    setNotice("");
  }, [refreshCategories]);

  const handleOpenCreate = useCallback(() => {
    setEditingCategory(null);
    setCategoryModalSession((previousSession) => previousSession + 1);
    setIsCategoryModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((category) => {
    setEditingCategory(category);
    setCategoryModalSession((previousSession) => previousSession + 1);
    setIsCategoryModalOpen(true);
  }, []);

  const handleCloseCategoryModal = useCallback(() => {
    setIsCategoryModalOpen(false);
  }, []);

  const handleCategorySaved = useCallback(
    (category, wasEditing) => {
      setIsCategoryModalOpen(false);

      setNotice(
        wasEditing
          ? `"${category?.name || "Category"}" was updated successfully.`
          : `"${category?.name || "Category"}" was created successfully.`,
      );

      refreshCategories();
    },
    [refreshCategories],
  );

  const handleClearFilters = useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  const handleOpenDelete = useCallback((category) => {
    setCategoryToDelete(category);
    setDeleteError("");
  }, []);

  const handleCloseDelete = useCallback(() => {
    if (deleting) return;

    setCategoryToDelete(null);
    setDeleteError("");
  }, [deleting]);

  async function handleConfirmDelete() {
    if (!categoryToDelete || deleting) return;

    setDeleting(true);
    setDeleteError("");

    try {
      await deleteCategory(categoryToDelete._id);

      const deletedName = categoryToDelete.name;

      setCategoryToDelete(null);
      setNotice(`"${deletedName}" was deleted successfully.`);

      refreshCategories();
    } catch (error) {
      setDeleteError(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="space-y-8">
      {/* Page Header */}
      <AdminPageHeader
        eyebrow="Catalogue management"
        title="Categories"
        description="Organise products into clear categories and subcategories."
        secondaryAction={{
          label: loading ? "Refreshing..." : "Refresh Data",
          icon: <ArrowClockwiseIcon size={16} />,
          onClick: handleRefresh,
          loading,
          disabled: loading,
          variant: "outline",
          size: "xxs",
        }}
        action={{
          label: "Add Category",
          icon: <PlusIcon size={16} weight="bold" />,
          onClick: handleOpenCreate,
        }}
      />

      {/* Success Notice */}
      {notice && (
        <div
          role="status"
          className="border-primary/50 bg-primary-light/50 flex items-start justify-between gap-4 rounded-xl border px-4 py-3"
        >
          <div className="flex items-start gap-2.5">
            <CheckCircleIcon
              size={20}
              weight="fill"
              className="text-primary-dark mt-0.5 shrink-0"
            />

            <p className="text-heading text-xs font-semibold">{notice}</p>
          </div>

          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss notification"
            className="text-muted hover:bg-surface rounded-md p-1 transition-colors"
          >
            <XIcon size={16} />
          </button>
        </div>
      )}

      {/* Category Statistics */}
      <Stagger
        delay={0.12}
        staggerDelay={0.08}
        className="grid-cols grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StaggerItem>
          <AdminStatsCard
            label="Total Categories"
            value={flatCategories.length}
            subtext="Across the catalogue"
            subtextClassName="text-muted font-bold"
            icon={<FolderOpenIcon size={20} weight="duotone" />}
            iconClassName="bg-primary-light text-primary-dark"
          />
        </StaggerItem>

        <StaggerItem>
          <AdminStatsCard
            label="Active"
            value={activeCount}
            subtext="Available for products"
            subtextClassName="text-muted font-bold"
            icon={<CheckCircleIcon size={20} weight="duotone" />}
            iconClassName="bg-primary-light text-primary-dark"
          />
        </StaggerItem>

        <StaggerItem>
          <AdminStatsCard
            label="Inactive"
            value={inactiveCount}
            subtext="Not available for assignment"
            subtextClassName="text-muted font-bold"
            icon={<XCircleIcon size={20} weight="duotone" />}
            iconClassName="bg-surface text-muted"
          />
        </StaggerItem>

        <StaggerItem>
          <AdminStatsCard
            label="Top-level"
            value={parentCount}
            subtext="Main category groups"
            subtextClassName="text-muted font-bold"
            icon={<FolderOpenIcon size={20} weight="duotone" />}
            iconClassName="bg-secondary-light text-secondary-dark"
          />
        </StaggerItem>
      </Stagger>

      {/* Main Categories Card */}
      <Reveal delay={0.2}>
        <div className="border-border bg-surface overflow-hidden rounded-xl border shadow-2xs">
          {/* Toolbar */}
          <div className="border-border border-b p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Search */}
              <div className="relative w-full lg:max-w-md">
                <MagnifyingGlassIcon
                  size={17}
                  weight="bold"
                  className="text-muted absolute top-1/2 left-3 -translate-y-1/2"
                />

                <input
                  type="search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search category name or slug..."
                  aria-label="Search categories"
                  className="border-border bg-background text-heading placeholder:text-muted focus:border-primary-dark focus:ring-primary-dark/20 h-10 w-full rounded-lg border pr-9 pl-10 text-xs font-medium outline-none focus:ring-2"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className="text-muted hover:text-heading absolute top-1/2 right-3 -translate-y-1/2"
                  >
                    <XIcon size={16} weight="bold" />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="flex w-full items-center gap-2 lg:w-auto">
                <select
                  value={statusFilter}
                  onChange={handleStatusChange}
                  aria-label="Filter categories by status"
                  className="border-border bg-background text-heading focus:border-primary-dark focus:ring-primary-dark/20 h-10 w-full rounded-lg border px-3 text-xs font-semibold outline-none focus:ring-2 sm:w-auto sm:min-w-40"
                >
                  <option value="all">All statuses</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>

                {hasActiveFilters && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Results */}
            <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-muted text-xs">
                {hasActiveFilters
                  ? "Mathing categories: "
                  : "Visible categories: "}
                <span className="text-heading font-bold">
                  {loading
                    ? "..."
                    : hasActiveFilters
                      ? filteredCategories.length
                      : visibleCategories.length}
                </span>{" "}
                of{" "}
                <span className="text-heading font-bold">
                  {flatCategories.length}
                </span>{" "}
                total
              </p>

              <p className="text-muted text-[11px]">
                {hasActiveFilters
                  ? "Matching categories are shown with their parent path."
                  : "Expand a category to view its subcategories."}
              </p>
            </div>
          </div>

          {/* Error State */}
          {error && !loading && (
            <div className="p-6">
              <div className="border-danger/30 bg-danger/10 rounded-lg border p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-2">
                    <WarningCircleIcon
                      size={18}
                      className="text-danger mt-0.5 shrink-0"
                    />

                    <p className="text-danger text-xs font-semibold">{error}</p>
                  </div>

                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={handleRefresh}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && <CategoryLoadingState />}

          {/* Empty State */}
          {!loading && !error && filteredCategories.length === 0 && (
            <EmptyCategories
              hasFilters={hasActiveFilters}
              onCreateCategory={handleOpenCreate}
              onClearFilters={handleClearFilters}
            />
          )}

          {/* Categories Table */}
          {!loading && !error && filteredCategories.length > 0 && (
            <CategoriesTable
              categories={visibleCategories}
              categoryById={categoryById}
              hasActiveFilters={hasActiveFilters}
              expandedCategoryIds={expandedCategoryIds}
              categoryHasVisibleChildren={categoryHasVisibleChildren}
              onToggleExpanded={toggleCategoryExpanded}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />
          )}
        </div>
      </Reveal>

      {/* Keep mounted for the shared Modal close animation. The key gives
          the form fresh state whenever Create or Edit is opened. */}
      <CategoryModal
        key={categoryModalSession}
        isOpen={isCategoryModalOpen}
        onClose={handleCloseCategoryModal}
        onSaved={handleCategorySaved}
        category={editingCategory}
        categories={flatCategories}
      />

      {/* Reusable delete confirmation modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(categoryToDelete)}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Delete category?"
        description="This action cannot be undone. Categories with subcategories or assigned products cannot be deleted."
        itemName={categoryToDelete?.name || ""}
        error={deleteError}
      />
    </main>
  );
}

export default AdminCategoriesPage;
