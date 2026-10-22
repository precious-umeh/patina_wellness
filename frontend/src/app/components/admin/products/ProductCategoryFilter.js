"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  CaretDownIcon,
  CaretRightIcon,
  CheckCircleIcon,
  FunnelSimpleIcon,
  MagnifyingGlassIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";

import { buildCategoryTree, getParentId } from "@/app/lib/categoryUtils";

function ProductCategoryFilter({
  categories = [],
  categoriesLoading = false,
  selectedCategoryId = "",
  onChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategoryIds, setExpandedCategoryIds] = useState(
    () => new Set(),
  );

  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  const categoryTree = useMemo(
    () => buildCategoryTree(categories),
    [categories],
  );

  const categoryById = useMemo(
    () =>
      new Map(categories.map((category) => [String(category._id), category])),
    [categories],
  );

  // Find matches, their descendants, and their ancestors.
  const matchingCategoryIds = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return null;

    const visibleIds = new Set();
    const childrenByParent = new Map();

    const matchingCategories = categories.filter(
      (category) =>
        category.name?.toLowerCase().includes(query) ||
        category.slug?.toLowerCase().includes(query),
    );

    for (const category of categories) {
      const parentId = getParentId(category.parent);

      if (!parentId) continue;

      const siblings = childrenByParent.get(parentId) || [];
      siblings.push(category);
      childrenByParent.set(parentId, siblings);
    }

    for (const match of matchingCategories) {
      // Include the matching category and all its descendants.
      const stack = [match];
      const visitedDescendants = new Set();

      while (stack.length > 0) {
        const current = stack.pop();
        const currentId = String(current._id);

        if (visitedDescendants.has(currentId)) continue;

        visitedDescendants.add(currentId);
        visibleIds.add(currentId);

        stack.push(...(childrenByParent.get(currentId) || []));
      }

      // Include ancestors so the matching category has context.
      let current = match;
      const visitedAncestors = new Set();

      while (current && !visitedAncestors.has(String(current._id))) {
        const currentId = String(current._id);

        visitedAncestors.add(currentId);
        visibleIds.add(currentId);

        const parentId = getParentId(current.parent);
        current = parentId ? categoryById.get(parentId) : null;
      }
    }

    return visibleIds;
  }, [categories, categoryById, searchQuery]);

  // Close the dropdown when clicking outside or pressing Escape.
  useEffect(() => {
    if (!isOpen) return undefined;

    function handleOutsidePointerDown(e) {
      if (!dropdownRef.current?.contains(e.target)) {
        setIsOpen(false);
      }
    }

    function handleDropdowKeyDown(e) {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handleOutsidePointerDown);
    document.addEventListener("keydown", handleDropdowKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
      document.removeEventListener("keydown", handleDropdowKeyDown);
    };
  }, [isOpen]);

  function handleSelectCategory(categoryId) {
    onChange(categoryId);
    setIsOpen(false);
    setSearchQuery("");
  }

  function handleToggleCategory(categoryId) {
    setExpandedCategoryIds((previousIds) => {
      const nextIds = new Set(previousIds);
      const id = String(categoryId);

      if (nextIds.has(id)) nextIds.delete(id);
      else nextIds.add(id);

      return nextIds;
    });
  }

  function renderCategoryTree(items, depth = 0) {
    return items.map((category) => {
      const categoryId = String(category._id);
      const hasChildren = category.children.length > 0;
      const isVisible =
        !matchingCategoryIds || matchingCategoryIds.has(categoryId);

      if (!isVisible) return null;

      const hasMatchingChild =
        Boolean(matchingCategoryIds) &&
        category.children.some((child) =>
          matchingCategoryIds.has(String(child._id)),
        );

      const isExpanded =
        expandedCategoryIds.has(categoryId) || hasMatchingChild;

      const isSelected = String(selectedCategoryId) === categoryId;

      return (
        <div key={categoryId}>
          <div
            className={`flex items-center gap-1 px-2 py-1 ${
              isSelected ? "bg-primary-light/60" : ""
            }`}
            style={{ paddingLeft: `${8 + depth * 16}px` }}
          >
            <button
              type="button"
              onClick={() => handleToggleCategory(categoryId)}
              disabled={!hasChildren}
              aria-label={
                hasChildren
                  ? `${isExpanded ? "Collapse" : "Expand"} ${category.name}`
                  : `${category.name} has no subcategories`
              }
              aria-expanded={hasChildren ? isExpanded : undefined}
              tabIndex={hasChildren ? 0 : -1}
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors ${
                hasChildren
                  ? "text-muted hover:bg-background hover:text-heading"
                  : "cursor-default text-transparent"
              }`}
            >
              {hasChildren ? (
                isExpanded ? (
                  <CaretDownIcon size={14} weight="bold" />
                ) : (
                  <CaretRightIcon size={14} weight="bold" />
                )
              ) : (
                <span className="bg-border h-1 w-1 rounded-full" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSelectCategory(categoryId)}
              aria-pressed={isSelected}
              className={`flex min-w-0 flex-1 items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors ${
                isSelected
                  ? "text-primary-dark font-bold"
                  : "hover:text-heading hover:bg-background"
              }`}
            >
              <span className="truncate">{category.name}</span>

              {isSelected && (
                <CheckCircleIcon
                  size={15}
                  weight="fill"
                  className="text-primary-dark shrink-0"
                />
              )}
            </button>
          </div>

          {hasChildren && isExpanded && (
            <div>{renderCategoryTree(category.children, depth + 1)}</div>
          )}
        </div>
      );
    });
  }

  const selectedCategory = categories.find(
    (category) => String(category._id) === String(selectedCategoryId),
  );

  return (
    <div
      ref={dropdownRef}
      className="relative flex-1 sm:min-w-44 lg:w-48 lg:flex-none"
    >
      <FunnelSimpleIcon
        size={15}
        weight="bold"
        className="text-muted pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2"
      />

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        disabled={categoriesLoading}
        aria-label="Filter products by category"
        aria-expanded={isOpen}
        aria-controls="product-category-filter-dropdown"
        className="border-border bg-background text-heading focus:border-primary-dark focus:ring-primary-dark/20 flex h-10 w-full items-center justify-between gap-2 rounded-lg border pr-3 pl-9 text-left text-xs font-semibold outline-none focus:ring-2 disabled:cursor-wait disabled:opacity-60"
      >
        <span className="truncate">
          {categoriesLoading
            ? "Loading categories..."
            : selectedCategory?.name || "All categories"}
        </span>

        <CaretDownIcon
          size={14}
          weight="bold"
          className={`text-muted shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          id="product-category-filter-dropdown"
          className="border-border bg-surface absolute top-full left-0 z-30 mt-2 w-full min-w-64 overflow-hidden rounded-xl border shadow-lg sm:min-w-72"
        >
          <div className="border-border border-b p-3">
            <div className="relative">
              <MagnifyingGlassIcon
                size={15}
                weight="bold"
                className="text-muted absolute top-1/2 left-3 -translate-y-1/2"
              />

              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search categories..."
                aria-label="Search product categories"
                className="border-border bg-background text-heading placeholder:text-muted focus:border-primary-dark focus:ring-primary-dark/20 h-9 w-full rounded-lg border pr-3 pl-9 text-xs outline-none focus:ring-2"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear category search"
                  className="text-muted hover:text-heading absolute top-1/2 right-2 -translate-y-1/2 rounded p-1"
                >
                  <XIcon size={13} weight="bold" />
                </button>
              )}
            </div>

            <p className="text-muted mt-2 px-1 text-[10px] leading-relaxed">
              Selecting a parent category also includes products assigned to its
              subcategories.
            </p>
          </div>

          <div className="scrollbar-hide max-h-72 overflow-y-auto py-1">
            <button
              type="button"
              onClick={() => handleSelectCategory("")}
              aria-pressed={!selectedCategoryId}
              className={`hover:bg-background flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-xs transition-colors ${
                !selectedCategoryId
                  ? "text-primary-dark bg-primary-light/50 font-bold"
                  : ""
              }`}
            >
              <span>All categories</span>

              {!selectedCategoryId && (
                <CheckCircleIcon
                  size={15}
                  weight="fill"
                  className="text-primary-dark shrink-0"
                />
              )}
            </button>

            {categories.length === 0 ? (
              <p className="text-muted px-4 py-5 text-center text-xs">
                No active categories available.
              </p>
            ) : matchingCategoryIds && matchingCategoryIds.size === 0 ? (
              <p className="text-muted px-4 py-5 text-center text-xs">
                No categories match your search.
              </p>
            ) : (
              renderCategoryTree(categoryTree)
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductCategoryFilter;
