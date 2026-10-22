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

function matchesCategory(category, query) {
  return [category.name, category.slug].some((value) =>
    String(value || "")
      .toLowerCase()
      .includes(query),
  );
}

function filterCategoryTree(categories, query) {
  if (!query) return categories;

  return categories
    .map((category) => {
      // Keep the whole subtree when the category itself matches.
      if (matchesCategory(category, query)) return category;

      // Otherwise, keep matching descendants and their ancestors.
      const children = filterCategoryTree(category.children || [], query);

      if (children.length === 0) return null;

      return { ...category, children };
    })
    .filter(Boolean);
}

function findCategoryBySlug(categories, slug) {
  for (const category of categories) {
    if (category.slug === slug) return category;

    const found = findCategoryBySlug(category.children || [], slug);

    if (found) return found;
  }

  return null;
}

function hasMatchingDescendant(category, query) {
  if (!query) return false;

  return (category.children || []).some(
    (child) =>
      matchesCategory(child, query) || hasMatchingDescendant(child, query),
  );
}

function ProductCategoryFilter({
  categories = [],
  categoriesLoading = false,
  selectedCategorySlug = "",
  onChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategoryIds, setExpandedCategoryIds] = useState(
    () => new Set(),
  );

  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredCategories = useMemo(
    () => filterCategoryTree(categories, normalizedQuery),
    [categories, normalizedQuery],
  );

  const selectedCategory = useMemo(
    () => findCategoryBySlug(categories, selectedCategorySlug),
    [categories, selectedCategorySlug],
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    function handleOutsidePointerDown(event) {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleDropdownKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handleOutsidePointerDown);
    document.addEventListener("keydown", handleDropdownKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
      document.removeEventListener("keydown", handleDropdownKeyDown);
    };
  }, [isOpen]);

  function handleSelectCategory(slug) {
    onChange(slug);
    setIsOpen(false);
    setSearchQuery("");
  }

  function handleToggleCategory(categoryId) {
    setExpandedCategoryIds((previousIds) => {
      const nextIds = new Set(previousIds);

      if (nextIds.has(categoryId)) nextIds.delete(categoryId);
      else nextIds.add(categoryId);

      return nextIds;
    });
  }

  function renderCategoryTree(items, depth = 0, expandAll = false) {
    return items.map((category) => {
      const categoryId = String(category._id || category.slug);
      const children = category.children || [];
      const hasChildren = children.length > 0;

      const matchesSelf =
        Boolean(normalizedQuery) && matchesCategory(category, normalizedQuery);

      const isExpanded =
        expandedCategoryIds.has(categoryId) ||
        hasMatchingDescendant(category, normalizedQuery) ||
        (hasChildren && (expandAll || matchesSelf));

      const isSelected = selectedCategorySlug === category.slug;

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
              onClick={() => handleSelectCategory(category.slug)}
              aria-pressed={isSelected}
              className={`flex min-w-0 flex-1 items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors ${
                isSelected
                  ? "text-primary-dark font-bold"
                  : "hover:bg-background hover:text-heading"
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
            <div>
              {renderCategoryTree(
                children,
                depth + 1,
                expandAll || matchesSelf,
              )}
            </div>
          )}
        </div>
      );
    });
  }

  return (
    <div ref={dropdownRef} className="relative w-full">
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
        aria-controls="public-product-category-dropdown"
        className="border-border bg-background text-heading focus:border-primary-dark focus:ring-primary-dark/20 flex h-11 w-full items-center justify-between gap-2 rounded-lg border pr-3 pl-9 text-left text-xs font-semibold outline-none focus:ring-2 disabled:cursor-wait disabled:opacity-60"
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
          id="public-product-category-dropdown"
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
                className="border-border bg-background text-heading placeholder:text-muted focus:border-primary-dark focus:ring-primary-dark/20 h-9 w-full rounded-lg pr-9 pl-9 text-xs outline-none focus:ring-2"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear category search"
                  className="text-muted hover:text-heading absolute top-1/2 right-2 -translate-1/2 rounded p-1"
                >
                  <XIcon size={13} weight="bold" />
                </button>
              )}
            </div>

            <p className="text-muted mt-2 px-1 text-[10px] leading-relaxed">
              Selecting a parent category also includes its subcategories.
            </p>
          </div>

          <div className="scrollbar-hide max-h-72 overflow-y-auto py-1">
            <button
              type="button"
              onClick={() => handleSelectCategory("")}
              aria-pressed={!selectedCategorySlug}
              className={`hover:bg-background flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-xs transition-colors ${
                !selectedCategorySlug
                  ? "text-primary-dark bg-primary-light/50 font-bold"
                  : ""
              }`}
            >
              <span>All categories</span>

              {!selectedCategorySlug && (
                <CheckCircleIcon
                  size={15}
                  weight="fill"
                  className="text-primary-dark shrink-0"
                />
              )}
            </button>

            {categories.length === 0 ? (
              <p className="text-muted px-4 py-5 text-center text-xs">
                No active categories available
              </p>
            ) : filteredCategories.length === 0 ? (
              <p className="text-muted px-4 py-5 text-center text-xs">
                No categories match your search.
              </p>
            ) : (
              renderCategoryTree(filteredCategories)
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductCategoryFilter;
