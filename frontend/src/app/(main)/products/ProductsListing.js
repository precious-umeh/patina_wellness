"use client";

import { useEffect, useState } from "react";
import {
  CaretLeftIcon,
  CaretRightIcon,
  MagnifyingGlassIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";

import Container from "@/app/components/shared/Container";
import Section from "@/app/components/shared/Section";
import SectionTitle from "@/app/components/shared/SectionTitle";

import Button from "@/app/components/shared/Button";
import ProductCategoryFilter from "@/app/components/products/ProductCategoryFilter";
import ProductCard from "@/app/components/products/ProductCard";

import { getProducts } from "@/app/lib/api/products";
import { getCategories } from "@/app/lib/api/categories";

import Stagger from "@/app/components/animations/Stagger";
import StaggerItem from "@/app/components/animations/StaggerItem";

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A to Z" },
  { value: "name_desc", label: "Name: Z to A" },
];

function ProductCardSkeleton() {
  return (
    <div className="border-border overflow-hidden rounded-xl border">
      <div className="bg-surface aspect-4/3 animate-pulse" />

      <div className="space-y-4 p-5">
        <div className="bg-surface h-3 w-1/3 animate-pulse rounded" />
        <div className="bg-surface h-5 w-4/5 animate-pulse rounded" />
        <div className="bg-surface h-5 w-2/5 animate-pulse rounded" />
        <div className="border-border border-t pt-4">
          <div className="bg-surface h-4 w-1/2 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}

function ProductsListing() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [categorySlug, setCategorySlug] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");

  const [requestVersion, setRequestVersion] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));

  /**
   * Fetch active categories for the category filter.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const data = await getCategories();

        if (cancelled) return;

        setCategories(Array.isArray(data?.categories) ? data.categories : []);
        setCategoriesError("");
      } catch (error) {
        if (cancelled) return;

        console.error("Load Public Categories Error:", error);

        setCategoriesError(
          error.response?.data?.message || "Categories could not be loaded.",
        );
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
  }, []);

  /**
   * Fetch products whenever the committed search, category,
   * sorting option, or page changes.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const data = await getProducts({
          page,
          limit: PAGE_SIZE,
          search: searchQuery,
          category: categorySlug,
          sort,
        });

        if (cancelled) return;

        const nextProducts = Array.isArray(data?.products) ? data.products : [];

        const reportedTotal = Number(data?.pagination?.totalProducts);

        setProducts(nextProducts);

        setTotalProducts(
          Number.isFinite(reportedTotal) && reportedTotal >= 0
            ? reportedTotal
            : nextProducts.length,
        );

        setError("");
      } catch (error) {
        if (cancelled) return;

        console.error("Load Public Products Error:", error);

        setProducts([]);
        setTotalProducts(0);

        setError(
          error.response?.data?.message ||
            "Unable to load products. Please try again.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [page, searchQuery, categorySlug, sort, requestVersion]);

  function handleSearchSubmit(event) {
    event.preventDefault();

    const nextSearch = searchInput.trim();

    if (nextSearch === searchQuery && page === 1) return;

    setLoading(true);
    setPage(1);
    setSearchQuery(nextSearch);
  }

  function handleCategoryChange(nextCategorySlug) {
    if (nextCategorySlug === categorySlug) return;

    setLoading(true);
    setPage(1);
    setCategorySlug(nextCategorySlug);
  }

  function handleSortChange(event) {
    const nextSort = event.target.value;

    if (nextSort === sort) return;

    setLoading(true);
    setPage(1);
    setSort(nextSort);
  }

  function handleClearFilters() {
    setLoading(true);

    setSearchInput("");
    setSearchQuery("");
    setCategorySlug("");
    setSort("newest");
    setPage(1);

    setRequestVersion((current) => current + 1);
  }

  function handleRetry() {
    setLoading(true);
    setRequestVersion((current) => current + 1);
  }

  function handlePageChange(nextPage) {
    if (nextPage < 1 || nextPage > totalPages || nextPage === page) {
      return;
    }

    setLoading(true);
    setPage(nextPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const hasActiveFilters = Boolean(
    searchQuery || categorySlug || sort !== "newest",
  );

  const firstResult = totalProducts === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;

  const lastResult = Math.min(page * PAGE_SIZE, totalProducts);

  return (
    <Section>
      <Container className="space-y-8">
        <SectionTitle eyebrow="Browse the Catalogue">
          Find Products for Your Wellness Routine
        </SectionTitle>

        <form
          onSubmit={handleSearchSubmit}
          className="border-border bg-surface grid grid-cols-1 gap-4 rounded-xl border p-4 sm:p-5 md:grid-cols-[minmax(0,1fr)_220px_190px]"
        >
          <div className="relative">
            <label htmlFor="product-search" className="sr-only">
              Search products
            </label>

            <MagnifyingGlassIcon
              size={19}
              className="text-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
            />

            <input
              id="product-search"
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="border-border bg-background text-heading placeholder:text-muted focus:border-primary-dark focus:ring-primary-dark/15 h-11 w-full rounded-lg border pr-3 pl-10 text-sm outline-none focus:ring-2"
            />
          </div>

          <div>
            <label htmlFor="product-category" className="sr-only">
              Filter by category
            </label>

            <ProductCategoryFilter
              categories={categories}
              categoriesLoading={categoriesLoading}
              selectedCategorySlug={categorySlug}
              onChange={handleCategoryChange}
            />
          </div>

          <div>
            <label htmlFor="product-sort" className="sr-only">
              Sort products
            </label>

            <select
              id="product-sort"
              value={sort}
              onChange={handleSortChange}
              className="border-border bg-background text-heading focus:border-primary-dark h-11 w-full rounded-lg border px-3 text-sm outline-none"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 md:col-span-3">
            <button
              type="submit"
              className="bg-primary text-heading hover:bg-primary-hover inline-flex h-10 items-center justify-center gap-2 rounded-lg px-5 text-xs font-bold transition-colors"
            >
              <MagnifyingGlassIcon size={16} weight="bold" />
              Search
            </button>

            {hasActiveFilters || searchInput ? (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-muted hover:text-heading inline-flex h-10 items-center gap-1.5 px-2 text-xs font-semibold"
              >
                <XIcon size={14} />
                Clear filters
              </button>
            ) : null}
          </div>
        </form>

        {categoriesError && (
          <p className="text-muted text-xs" role="status">
            Category filters are temporarily unavailbale. You can still search
            and browse all products.
          </p>
        )}

        <div className="flex items-center justify-between gap-3">
          <p className="text-muted text-xs" aria-live="polite">
            {loading
              ? "Loading products..."
              : totalProducts === 0
                ? "No products to display"
                : `Showing ${firstResult}-${lastResult} of ${totalProducts} ${totalProducts === 1 ? "product" : "products"}`}
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-primary-dark text-xs font-bold hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>

        {error && !loading ? (
          <div
            role="alert"
            className="border-border bg-surface rounded-xl border p-8 text-center"
          >
            <h3 className="text-heading font-bold">
              We couldn&apos;t load the products
            </h3>

            <p className="text-muted mt-2 text-sm">{error}</p>

            <button
              type="button"
              onClick={handleRetry}
              className="bg-primary text-heading mt-5 rounded-lg px-5 py-2.5 text-xs font-bold"
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <StaggerItem key={product._id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <div className="border-border bg-surface rounded-xl border px-6 py-16 text-center">
            <h3 className="text-heading text-lg font-bold">
              No products found
            </h3>

            <p className="text-muted mx-auto mt-2 max-w-md text-sm leading-relaxed">
              {hasActiveFilters
                ? "Try a different search term or adjust your filters."
                : "There are no products available to display right now."}
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-primary-dark mt-4 text-xs font-bold hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {!error && !loading && products.length > 0 && totalPages > 1 && (
          <div className="border-border flex items-center justify-end gap-2 border-t pt-2.5">
            <Button
              type="button"
              variant="outline"
              size="xxs"
              leftIcon={<CaretLeftIcon size={13} />}
              disabled={page === 1 || loading}
              onClick={() => handlePageChange(page - 1)}
            >
              Previous
            </Button>

            <span className="text-muted text-[11px] whitespace-nowrap">
              Page {page} of {totalPages}
            </span>

            <Button
              type="button"
              variant="outline"
              size="xxs"
              rightIcon={<CaretRightIcon size={13} />}
              disabled={page === totalPages || loading}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </Container>
    </Section>
  );
}

export default ProductsListing;
