"use client";

import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react/dist/ssr";

import Button from "../../shared/Button";
import ProductCategoryTree from "./ProductCategoryTree";

function ProductCategoriesSection({
  categoriesLoading,
  categoriesError,
  onRetryCategories,
  selectableCategories = [],
  categorySearchQuery,
  onCategorySearchChange,
  onClearCategorySearch,
  visibleCategoryTree = [],
  selectedCategoryIds = [],
  inheritedCategoryIds = new Set(),
  expandedCategoryIds = new Set(),
  onCategoryChange,
  onToggleCategoryExpanded,
  submitting = false,
}) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-heading text-sm font-bold">
          Categories <span className="text-secondary-dark">*</span>
        </h3>

        <p className="text-muted mt-1 text-xs">
          Select the most specific categories that apply. Parent categories are
          covered automatically for browsing; only checked categories are saved
          on the product.
        </p>
      </div>

      {categoriesLoading ? (
        <p className="text-muted text-xs">Loading categories...</p>
      ) : categoriesError ? (
        <div className="space-y-2">
          <p className="text-danger text-xs">{categoriesError}</p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRetryCategories}
            disabled={submitting}
          >
            Retry
          </Button>
        </div>
      ) : selectableCategories.length === 0 ? (
        <p className="text-muted text-xs">
          No active categories found. Create a category first.
        </p>
      ) : (
        <div className="space-y-2">
          <div className="relative">
            <MagnifyingGlassIcon
              size={16}
              weight="bold"
              className="text-muted absolute top-1/2 left-4 -translate-1/2"
            />

            <input
              type="search"
              value={categorySearchQuery}
              onChange={(e) => onCategorySearchChange(e.target.value)}
              placeholder="Search categories..."
              aria-label="Search product categories"
              disabled={submitting}
              className="border-border bg-background text-heading placeholder:text-muted focus:border-primary-dark focus:ring-primary-dark/20 h-9 w-full rounded-lg border pr-9 pl-9 text-xs outline-none focus:ring-2 disabled:opacity-60"
            />

            {categorySearchQuery && (
              <button
                type="button"
                onClick={onClearCategorySearch}
                aria-label="Clear category search"
                disabled={submitting}
                className="text-muted hover:text-heading absolute top-1/2 right-3 -translate-y-1/2 disabled:opacity-50"
              >
                <XIcon size={14} weight="bold" />
              </button>
            )}
          </div>

          {visibleCategoryTree.length === 0 ? (
            <p className="text-muted border-border rounded-lg border border-dashed px-3 py-4 text-center text-xs">
              No categories match your search.
            </p>
          ) : (
            <fieldset
              disabled={submitting}
              className="border-border bg-background max-h-64 overflow-y-auto rounded-lg border p-2"
            >
              <legend className="sr-only">Product categories</legend>

              <ProductCategoryTree
                categories={visibleCategoryTree}
                selectedCategoryIds={selectedCategoryIds}
                inheritedCategoryIds={inheritedCategoryIds}
                expandedCategoryIds={expandedCategoryIds}
                onCategoryChange={onCategoryChange}
                onToggleExpand={onToggleCategoryExpanded}
                disabled={submitting}
                isSearching={Boolean(categorySearchQuery.trim())}
              />
            </fieldset>
          )}
        </div>
      )}

      <p className="text-muted text-[11px]">
        {selectedCategoryIds.length}{" "}
        {selectedCategoryIds.length === 1 ? "category" : "categories"} selected
        · {selectableCategories.length} available
        {inheritedCategoryIds.size > 0 && (
          <>
            {" "}
            · {inheritedCategoryIds.size} parent{" "}
            {inheritedCategoryIds.size === 1 ? "category" : "categories"}{" "}
            covered automatically{" "}
          </>
        )}
      </p>
    </section>
  );
}

export default ProductCategoriesSection;
