"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { getCategoriesAdmin } from "@/app/lib/api/categories";
import { flattenCategoryTree, getParentId } from "@/app/lib/categoryUtils";

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

function useAdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedCategoryIds, setExpandedCategoryIds] = useState(
    () => new Set(),
  );

  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch categories
  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const data = await getCategoriesAdmin();

        if (cancelled) return;

        setCategories(data.categories || []);
        setError("");
      } catch (error) {
        if (cancelled) return;

        console.error("Load Admin Categories Error:", error);
        setError(getErrorMessage(error));
        setCategories([]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  // Convert the nested tree into rows for the table and parent selector
  const flatCategories = useMemo(
    () => flattenCategoryTree(categories),
    [categories],
  );

  const categoryById = useMemo(
    () =>
      new Map(
        flatCategories.map((category) => [String(category._id), category]),
      ),
    [flatCategories],
  );

  const activeCount = flatCategories.filter(
    (category) => category.isActive,
  ).length;

  const inactiveCount = flatCategories.length - activeCount;

  const parentCount = flatCategories.filter(
    (category) => !getParentId(category.parent),
  ).length;

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return flatCategories.filter((category) => {
      const parentId = getParentId(category.parent);
      const parentName = categoryById.get(parentId)?.name || "";

      const matchesSearch =
        !query ||
        category.name?.toLowerCase().includes(query) ||
        category.slug?.toLowerCase().includes(query) ||
        parentName.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || String(category.isActive) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [flatCategories, categoryById, searchQuery, statusFilter]);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) || statusFilter !== "all";

  // Keep ancestors visible so filtered results retain their hierarchy
  const filteredCategoryContext = useMemo(() => {
    const visibleIds = new Set();
    const ancestorIds = new Set();

    if (hasActiveFilters) {
      filteredCategories.forEach((category) => {
        visibleIds.add(String(category._id));

        let parentId = getParentId(category.parent);

        while (parentId) {
          visibleIds.add(parentId);
          ancestorIds.add(parentId);

          parentId = getParentId(categoryById.get(parentId)?.parent);
        }
      });
    }

    return { visibleIds, ancestorIds };
  }, [hasActiveFilters, filteredCategories, categoryById]);

  const visibleCategories = useMemo(() => {
    if (hasActiveFilters) {
      return flatCategories.filter((category) =>
        filteredCategoryContext.visibleIds.has(String(category._id)),
      );
    }

    return flatCategories.filter((category) => {
      let parentId = getParentId(category.parent);

      while (parentId) {
        if (!expandedCategoryIds.has(parentId)) return false;
        parentId = getParentId(categoryById.get(parentId)?.parent);
      }

      return true;
    });
  }, [
    flatCategories,
    hasActiveFilters,
    filteredCategoryContext,
    expandedCategoryIds,
    categoryById,
  ]);

  const toggleCategoryExpanded = useCallback((categoryId) => {
    const id = String(categoryId);

    setExpandedCategoryIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (nextIds.has(id)) nextIds.delete(id);
      else nextIds.add(id);

      return nextIds;
    });
  }, []);

  const categoryHasVisibleChildren = useCallback(
    (category) => {
      if (!category.children?.length) return false;
      if (!hasActiveFilters) return true;

      return filteredCategories.some((candidate) => {
        let parentId = getParentId(candidate.parent);

        while (parentId) {
          if (parentId === String(category._id)) return true;
          parentId = getParentId(categoryById.get(parentId)?.parent);
        }

        return false;
      });
    },
    [hasActiveFilters, filteredCategories, categoryById],
  );

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleStatusChange = useCallback((event) => {
    setStatusFilter(event.target.value);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("all");
  }, []);

  const refreshCategories = useCallback(() => {
    setLoading(true);
    setRefreshKey((previousKey) => previousKey + 1);
  }, []);

  return {
    categories,
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
  };
}

export default useAdminCategories;
