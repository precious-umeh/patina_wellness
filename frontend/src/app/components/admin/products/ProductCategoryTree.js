"use client";

import { CaretDownIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";

function ProductCategoryTree({
  categories = [],
  selectedCategoryIds = [],
  inheritedCategoryIds = new Set(),
  expandedCategoryIds = new Set(),
  onCategoryChange,
  onToggleExpand,
  disabled = false,
  isSearching = false,
}) {
  function renderCategoryNodes(nodes, depth = 0) {
    return nodes.map((category) => {
      const categoryId = String(category._id);
      const children = category.children || [];
      const hasChildren = children.length > 0;

      const isExpanded = isSearching || expandedCategoryIds.has(categoryId);
      const isSelected = selectedCategoryIds.includes(categoryId);
      const isInherited = inheritedCategoryIds.has(categoryId) && !isSelected;

      return (
        <div key={categoryId}>
          <div
            className="hover:bg-surface flex items-center gap-1 rounded-md px-1 transition-colors"
            style={{ paddingLeft: `${depth * 14}px` }}
          >
            {hasChildren ? (
              isSearching ? (
                <span
                  aria-hidden="true"
                  className="text-muted flex h-7 w-7 shrink-0 items-center justify-center"
                >
                  <CaretDownIcon size={14} weight="bold" />
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onToggleExpand(categoryId)}
                  aria-label={`${isExpanded ? "Collapse" : "Expand"} ${category.name}`}
                  aria-expanded={isExpanded}
                  disabled={disabled}
                  className="text-muted hover:bg-background hover:text-heading disabled-opacity-50 flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors"
                >
                  {isExpanded ? (
                    <CaretDownIcon size={14} weight="bold" />
                  ) : (
                    <CaretRightIcon size={14} weight="bold" />
                  )}
                </button>
              )
            ) : (
              <span aria-hidden="true" className="h-7 w-7 shrink-0" />
            )}

            <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-md py-2">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onCategoryChange(categoryId, e.target.checked)}
                disabled={disabled}
                className="accent-primary-dark h-4 w-4 shrink-0"
              />

              <span className="text-heading min-w-0 flex-1 truncate text-xs font-medium">
                {category.name}
              </span>

              {depth === 0 && (
                <span className="text-muted shrink-0 text-[9px]">
                  Main category
                </span>
              )}

              {isSelected && (
                <span className="text-primary-dark shrink-0 text-[9px] font-bold">
                  Directly selected
                </span>
              )}

              {isInherited && (
                <span
                  title="Products in this subcategory are also discoverable when browsing this parent category."
                  className="bg-primary-light text-primary-dark shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold"
                >
                  Inherited
                </span>
              )}
            </label>
          </div>

          {hasChildren && isExpanded && (
            <div>{renderCategoryNodes(children, depth + 1)}</div>
          )}
        </div>
      );
    });
  }

  return <div className="space-y-1">{renderCategoryNodes(categories)}</div>;
}

export default ProductCategoryTree;
