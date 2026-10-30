"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getProductsAdmin } from "@/app/lib/api/products";

const PRODUCTS_PER_PAGE = 20;

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

function useAdminProducts() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const searchTimeoutRef = useRef(null);

  // Cancel any pending debounced search.
  const cancelPendingSearch = useCallback(() => {
    if (searchTimeoutRef.current !== null) {
      window.clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
  }, []);

  // Only clean up the pending timer on unmount.
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current !== null) {
        window.clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Load products whenever the query, filters, page or refresh key changes.
  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const data = await getProductsAdmin(
          currentPage,
          PRODUCTS_PER_PAGE,
          debouncedSearch,
          categoryFilter,
          activeFilter,
        );

        if (cancelled) return;

        setProducts(data.products || []);

        const pagination = data.pagination || {};

        setTotalPages(Math.max(1, Number(pagination.totalPages ?? 1)));

        setTotalProducts(
          Number(pagination.totalProducts ?? data.totalProducts ?? 0),
        );

        setError("");
      } catch (error) {
        if (cancelled) return;

        setError(getErrorMessage(error));
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [currentPage, debouncedSearch, categoryFilter, activeFilter, refreshKey]);

  // Debounce from the input event instead of using an effect for this
  const handleSearchChange = useCallback(
    (event) => {
      const value = event.target.value;

      setSearchQuery(value);
      setCurrentPage(1);

      cancelPendingSearch();

      // Only show loading when the settled search needs to change
      setIsLoading(value.trim() !== debouncedSearch);

      searchTimeoutRef.current = window.setTimeout(() => {
        setDebouncedSearch(value.trim());
        searchTimeoutRef.current = null;
      }, 350);
    },
    [debouncedSearch, cancelPendingSearch],
  );

  const clearSearch = useCallback(() => {
    const shouldFetch = Boolean(debouncedSearch) || currentPage !== 1;

    cancelPendingSearch();

    setSearchQuery("");
    setDebouncedSearch("");
    setCurrentPage(1);
    setIsLoading(shouldFetch);
  }, [debouncedSearch, currentPage, cancelPendingSearch]);

  const handleCategoryChange = useCallback(
    (categoryId) => {
      const nextCategoryId = categoryId ? String(categoryId) : "";

      const shouldRefetch =
        nextCategoryId !== categoryFilter || currentPage !== 1;

      setCategoryFilter(nextCategoryId);
      setCurrentPage(1);

      if (shouldRefetch) {
        setIsLoading(true);
      }
    },
    [categoryFilter, currentPage],
  );

  const handleStatusChange = useCallback(
    (event) => {
      const nextStatus = event.target.value;

      const shouldFetch = nextStatus !== activeFilter || currentPage !== 1;

      setActiveFilter(nextStatus);
      setCurrentPage(1);

      if (shouldFetch) {
        setIsLoading(true);
      }
    },
    [activeFilter, currentPage],
  );

  // Shared reset logic for search and product filters.
  const resetProductFilters = useCallback(() => {
    cancelPendingSearch();

    setSearchQuery("");
    setDebouncedSearch("");
    setCategoryFilter("");
    setActiveFilter("all");
    setCurrentPage(1);
  }, [cancelPendingSearch]);

  const clearFilters = useCallback(() => {
    resetProductFilters();

    setIsLoading(true);
    setRefreshKey((previousKey) => previousKey + 1);
  }, [resetProductFilters]);

  const refreshProducts = useCallback(() => {
    setIsLoading(true);
    setRefreshKey((previousKey) => previousKey + 1);
  }, []);

  // After creating a product, reset filters so it is easier to find.
  const handleProductCreated = useCallback(() => {
    resetProductFilters();

    setIsLoading(true);
    setRefreshKey((previousKey) => previousKey + 1);
  }, [resetProductFilters]);

  // Refresh after a successful delete. If the last row on a later page
  // was deleted, go back one page instead of displaying an empty page.
  const handleProductDeleted = useCallback(() => {
    setIsLoading(true);

    if (products.length === 1 && currentPage > 1) {
      setCurrentPage((page) => page - 1);
    } else {
      setRefreshKey((previousKey) => previousKey + 1);
    }
  }, [products.length, currentPage]);

  const handlePreviousPage = useCallback(() => {
    if (currentPage <= 1 || isLoading) return;

    setCurrentPage((page) => page - 1);
    setIsLoading(true);
  }, [currentPage, isLoading]);

  const handleNextPage = useCallback(() => {
    if (currentPage >= totalPages || isLoading) return;

    setCurrentPage((page) => page + 1);
    setIsLoading(true);
  }, [currentPage, totalPages, isLoading]);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    Boolean(categoryFilter) ||
    activeFilter !== "all";

  const showingFrom =
    totalProducts === 0 ? 0 : (currentPage - 1) * PRODUCTS_PER_PAGE + 1;

  const showingTo = Math.min(currentPage * PRODUCTS_PER_PAGE, totalProducts);

  return {
    products,
    searchQuery,
    categoryFilter,
    activeFilter,

    currentPage,
    totalPages,
    totalProducts,

    isLoading,
    error,
    hasActiveFilters,
    showingFrom,
    showingTo,

    handleSearchChange,
    clearSearch,
    handleCategoryChange,
    handleStatusChange,
    clearFilters,
    refreshProducts,
    handleProductCreated,
    handleProductDeleted,
    handlePreviousPage,
    handleNextPage,
  };
}

export default useAdminProducts;
