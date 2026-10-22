"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  CaretDownIcon,
  CaretRightIcon,
  CheckCircleIcon,
  FolderOpenIcon,
  MagnifyingGlassIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";

import { buildCategoryTree, getParentId } from "@/app/lib/categoryUtils";

function CategoryParentPicker({
  categories = [],
  availableParents = [],
  parentId = "",
  onChange,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState(() => new Set());

  const pickerRef = useRef(null);
  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);

  const parentTree = useMemo(
    () => buildCategoryTree(availableParents),
    [availableParents],
  );

  const parentById = useMemo(
    () => new Map(availableParents.map((item) => [String(item._id), item])),
    [availableParents],
  );

  const currentParent = categories.find(
    (item) => String(item._id) === parentId,
  );

  const selectedParentLabel = !parentId
    ? "None — top-level category"
    : currentParent
      ? currentParent.isActive
        ? currentParent.name
        : `${currentParent.name} (inactive — choose another)`
      : "Selected parent unavailable — choose another";

  // Find matches and their available ancestors.
  const matchingIds = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return null;

    const visibleIds = new Set();

    const matches = availableParents.filter(
      (item) =>
        item.name?.toLowerCase().includes(query) ||
        item.slug?.toLowerCase().includes(query),
    );

    for (const match of matches) {
      let current = match;
      const visited = new Set();

      while (current && !visited.has(String(current._id))) {
        const currentId = String(current._id);

        visited.add(currentId);
        visibleIds.add(currentId);

        const ancestorId = getParentId(current.parent);
        current = ancestorId ? parentById.get(ancestorId) : null;
      }
    }

    return visibleIds;
  }, [availableParents, parentById, searchQuery]);

  // Register event listeners while the picker is open.
  useEffect(() => {
    if (!isOpen) return undefined;

    function handleOutsidePointerDown(event) {
      if (!pickerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.stopImmediatePropagation?.();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handleOutsidePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Focus the search field when the picker opens.
  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus();
    }
  }, [isOpen]);

  function handleToggleExpanded(categoryId) {
    setExpandedIds((previousIds) => {
      const nextIds = new Set(previousIds);
      const id = String(categoryId);

      if (nextIds.has(id)) {
        nextIds.delete(id);
      } else {
        nextIds.add(id);
      }

      return nextIds;
    });
  }

  function handleChooseParent(nextParentId) {
    onChange(nextParentId ? String(nextParentId) : "");
    setIsOpen(false);
    setSearchQuery("");
  }

  function renderParentTree(items, depth = 0) {
    return items.map((item) => {
      const itemId = String(item._id);
      const children = item.children || [];
      const hasChildren = children.length > 0;

      if (matchingIds && !matchingIds.has(itemId)) {
        return null;
      }

      const hasMatchingChild =
        Boolean(matchingIds) &&
        children.some((child) => matchingIds.has(String(child._id)));

      const isExpanded = expandedIds.has(itemId) || hasMatchingChild;

      const isSelected = parentId === itemId;

      return (
        <div key={itemId}>
          <div
            className={`flex items-center gap-1 rounded-md px-1 py-0.5 ${
              isSelected ? "bg-primary-light/60" : ""
            }`}
            style={{ paddingLeft: `${4 + depth * 16}px` }}
          >
            <button
              type="button"
              onClick={() => handleToggleExpanded(itemId)}
              disabled={!hasChildren || disabled}
              aria-label={
                hasChildren
                  ? `${isExpanded ? "Collapse" : "Expand"} ${item.name}`
                  : `${item.name} has no subcategories`
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
              onClick={() => handleChooseParent(itemId)}
              disabled={disabled}
              aria-pressed={isSelected}
              className={`flex min-w-0 flex-1 items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-xs transition-colors ${
                isSelected
                  ? "text-primary-dark font-bold"
                  : "text-heading hover:bg-background"
              }`}
            >
              <span className="flex min-w-0 items-center gap-2">
                <FolderOpenIcon
                  size={15}
                  weight="duotone"
                  className="shrink-0"
                />

                <span className="truncate">{item.name}</span>
              </span>

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
            <div>{renderParentTree(children, depth + 1)}</div>
          )}
        </div>
      );
    });
  }

  return (
    <div className="space-y-1.5" ref={pickerRef}>
      <label
        htmlFor="category-parent"
        className="text-heading text-xs font-semibold"
      >
        Parent Category
      </label>

      <button
        id="category-parent"
        ref={triggerRef}
        type="button"
        onClick={() => {
          setIsOpen((previous) => !previous);
          setSearchQuery("");
        }}
        disabled={disabled}
        aria-label="Choose parent category"
        aria-expanded={isOpen}
        aria-controls="category-parent-picker"
        className="border-border bg-background text-heading focus:border-primary-dark focus:ring-primary-dark/20 flex h-10 w-full items-center justify-between gap-3 rounded-lg border px-3 text-left text-sm outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="truncate">{selectedParentLabel}</span>

        <CaretDownIcon
          size={15}
          weight="bold"
          className={`text-muted shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          id="category-parent-picker"
          className="border-border bg-surface overflow-hidden rounded-xl border shadow-sm"
        >
          <div className="border-border border-b p-3">
            <div className="relative">
              <MagnifyingGlassIcon
                size={15}
                weight="bold"
                className="text-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
              />

              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search parent categories..."
                aria-label="Search parent categories"
                className="border-border bg-background text-heading placeholder:text-muted focus:border-primary-dark focus:ring-primary-dark/20 h-9 w-full rounded-lg border pr-8 pl-9 text-xs outline-none focus:ring-2"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear parent category search"
                  className="text-muted hover:text-heading absolute top-1/2 right-2 -translate-y-1/2 rounded p-1"
                >
                  <XIcon size={13} weight="bold" />
                </button>
              )}
            </div>
          </div>

          <div className="scrollbar-hide max-h-56 overflow-y-auto p-2">
            <button
              type="button"
              onClick={() => handleChooseParent("")}
              disabled={disabled}
              aria-pressed={!parentId}
              className={`hover:bg-background flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left text-xs transition-colors ${
                !parentId
                  ? "text-primary-dark bg-primary-light/50 font-bold"
                  : "text-heading"
              }`}
            >
              <span>None — top-level category</span>

              {!parentId && (
                <CheckCircleIcon
                  size={15}
                  weight="fill"
                  className="text-primary-dark shrink-0"
                />
              )}
            </button>

            {availableParents.length === 0 ? (
              <p className="text-muted px-3 py-5 text-center text-xs">
                No active parent categories available.
              </p>
            ) : matchingIds && matchingIds.size === 0 ? (
              <p className="text-muted px-3 py-5 text-center text-xs">
                No parent categories match your search.
              </p>
            ) : (
              renderParentTree(parentTree)
            )}
          </div>
        </div>
      )}

      <p className="text-muted text-[10px] leading-relaxed">
        Leave this empty for a main category. Choose a parent to create a
        subcategory. Only active categories that won&apos;t create a hierarchy
        loop can be selected.
      </p>
    </div>
  );
}

export default CategoryParentPicker;
