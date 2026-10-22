"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { getCategoriesAdmin } from "@/app/lib/api/categories";
import { flattenCategoryTree, getParentId } from "@/app/lib/categoryUtils";

// Preserve the hierarchy while excluding inactive categories.
function getActiveCategoryTree(categories = []) {
  return categories
    .filter((category) => category.isActive)
    .map((category) => ({
      ...category,
      children: getActiveCategoryTree(category.children || []),
    }));
}

// A matching parent keeps its subtree; a matching child keeps its ancestors.
function filterCategoryTree(categories = [], query = "") {
  if (!query) return categories;

  return categories
    .map((category) => {
      const matchesSelf = [category.name, category.slug].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query),
      );

      if (matchesSelf) return category;

      const children = filterCategoryTree(category.children || [], query);

      if (children.length === 0) return null;

      return { ...category, children };
    })
    .filter(Boolean);
}

function getErrorMessage(error) {
  return error?.response?.data?.message || "Unable to load product categories.";
}

function useProductCategories(isOpen) {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [expandedCategoryIds, setExpandedCategoryIds] = useState(
    () => new Set(),
  );

  // Fetch categories whenever the modal opens.
  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    async function loadCategories() {
      try {
        const data = await getCategoriesAdmin();

        if (cancelled) return;

        setCategories(getActiveCategoryTree(data.categories || []));

        setCategoriesError("");
      } catch (error) {
        if (cancelled) return;

        console.error("Load Product Categories Error:", error);
        setCategories([]);

        setCategoriesError(getErrorMessage(error));
      } finally {
        if (!cancelled) {
          setCategoriesLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const selectableCategories = useMemo(
    () => flattenCategoryTree(categories),
    [categories],
  );

  // Parent are inferred from selected descendants, not saved as extra IDs.
  const inheritedCategoryIds = useMemo(() => {
    const categoryById = new Map(
      selectableCategories.map((category) => [String(category._id), category]),
    );

    const inheritedIds = new Set();

    for (const selectedId of selectedCategoryIds) {
      let current = categoryById.get(String(selectedId));
      const visited = new Set([String(selectedId)]);

      while (current) {
        const parentId = getParentId(current.parent);

        if (!parentId || visited.has(parentId)) break;

        visited.add(parentId);
        inheritedIds.add(parentId);
        current = categoryById.get(parentId);
      }
    }

    return inheritedIds;
  }, [selectableCategories, selectedCategoryIds]);

  const visibleCategoryTree = useMemo(
    () =>
      filterCategoryTree(categories, categorySearchQuery.trim().toLowerCase()),
    [categories, categorySearchQuery],
  );

  const handleCategoryChange = useCallback((categoryId, checked) => {
    const id = String(categoryId);

    setSelectedCategoryIds((currentIds) => {
      if (checked) {
        return currentIds.includes(id) ? currentIds : [...currentIds, id];
      }

      return currentIds.filter((selectedId) => selectedId !== id);
    });
  }, []);

  const handleToggleCategoryExpanded = useCallback((categoryId) => {
    const id = String(categoryId);

    setExpandedCategoryIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(id)) nextIds.delete(id);
      else nextIds.add(id);

      return nextIds;
    });
  }, []);

  const setSelectedCategories = useCallback((categoryIds = []) => {
    setSelectedCategoryIds(categoryIds.map(String).filter(Boolean));
  }, []);

  const handleCategorySearchChange = useCallback((value) => {
    setCategorySearchQuery(value);
  }, []);

  const clearCategorySearch = useCallback(() => {
    setCategorySearchQuery("");
  }, []);

  const resetCategorySelection = useCallback(() => {
    setSelectedCategoryIds([]);
    setCategorySearchQuery("");
    setExpandedCategoryIds(new Set());
  }, []);

  const handleRetryCategories = useCallback(async () => {
    setCategoriesLoading(true);
    setCategoriesError("");

    try {
      const data = await getCategoriesAdmin();

      setCategories(getActiveCategoryTree(data.categories || []));
    } catch (error) {
      console.error("Retry Load Categories Error:", error);

      setCategoriesError(getErrorMessage(error));
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  return {
    categories,
    selectedCategoryIds,
    selectableCategories,
    inheritedCategoryIds,
    visibleCategoryTree,

    categorySearchQuery,
    expandedCategoryIds,

    categoriesLoading,
    categoriesError,

    handleCategoryChange,
    handleToggleCategoryExpanded,
    setSelectedCategories,
    handleCategorySearchChange,
    clearCategorySearch,
    resetCategorySelection,
    handleRetryCategories,
  };
}

export default useProductCategories;
