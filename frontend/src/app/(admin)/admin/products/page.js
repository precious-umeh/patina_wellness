"use client";

import { useCallback, useEffect, useState } from "react";

import {
  ArrowClockwiseIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  WarningCircleIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";

import AdminPageHeader from "@/app/components/admin/AdminPageHeader";
import Button from "@/app/components/shared/Button";
import AddProductModal from "@/app/components/admin/modals/AddProductModal";
import DeleteConfirmationModal from "@/app/components/shared/DeleteConfirmationModal";
import ProductCategoryFilter from "@/app/components/admin/products/ProductCategoryFilter";
import ProductsTable from "@/app/components/admin/products/ProductsTable";
import useAdminProducts from "@/app/hooks/admin/useAdminProducts";

import Reveal from "@/app/components/animations/Reveal";

import {
  EmptyProducts,
  ProductLoadingState,
} from "@/app/components/admin/products/ProductListStates";
import { deleteProduct } from "@/app/lib/api/products";
import { getCategoriesAdmin } from "@/app/lib/api/categories";
import { flattenCategoryTree } from "@/app/lib/categoryUtils";

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

function AdminProductPage() {
  const {
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
    handleProductCreated: refreshAfterProductCreated,
    handleProductDeleted: refreshAfterProductDeleted,
    handlePreviousPage,
    handleNextPage,
  } = useAdminProducts();

  const [categories, setCategories] = useState([]);

  const [categoryFilterResetKey, setCategoryFilterResetKey] = useState(0);

  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [categoriesError, setCategoriesError] = useState("");
  const [notice, setNotice] = useState("");

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [productToDelete, setProductToDelete] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(false);
  const [deleteProductError, setDeleteProductError] = useState("");

  // Load categories for the filter dropdown
  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const data = await getCategoriesAdmin();

        if (cancelled) return;

        const flattenedCategories = flattenCategoryTree(data.categories || []);

        setCategories(
          flattenedCategories.filter((category) => category.isActive),
        );

        setCategoriesError("");
      } catch (error) {
        if (cancelled) return;

        console.error("Load Product Categories Error:", error);
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
  }, []);

  const handleClearFilters = useCallback(() => {
    clearFilters();
    setCategoryFilterResetKey((previousKey) => previousKey + 1);
    setNotice("");
  }, [clearFilters]);

  const handleRefresh = useCallback(() => {
    refreshProducts();
    setNotice("");
  }, [refreshProducts]);

  const handleCloseAddProduct = useCallback(() => {
    setIsAddProductOpen(false);
  }, []);

  const handleOpenCreateProduct = useCallback(() => {
    setEditingProduct(null);
    setIsAddProductOpen(true);
  }, []);

  const handleOpenEditProduct = useCallback((product) => {
    setEditingProduct(product);
    setIsAddProductOpen(true);
  }, []);

  const handleProductCreated = useCallback(
    (product) => {
      setIsAddProductOpen(false);

      setNotice(
        product?.name
          ? `"${product.name}" was added successfully.`
          : "Product created successfully",
      );

      // Reset filters so the new product is easier to find
      refreshAfterProductCreated();
      setCategoryFilterResetKey((previousKey) => previousKey + 1);
    },
    [refreshAfterProductCreated],
  );

  const handleProductUpdated = useCallback(
    (product) => {
      setIsAddProductOpen(false);
      setNotice(
        product?.name
          ? `"${product.name}" was updated successfully.`
          : "Product updated successfully.",
      );
      refreshProducts();
    },
    [refreshProducts],
  );

  const handlePartialProductUpdate = useCallback(() => {
    // Some requests may succeed before another image operation fails.
    // Refresh the table without closing the editor so the admin can retry.
    refreshProducts();
  }, [refreshProducts]);

  const handleOpenDeleteProduct = useCallback((product) => {
    setProductToDelete(product);
    setDeleteProductError("");
  }, []);

  const handleCloseDeleteProduct = useCallback(() => {
    if (deletingProduct) return;
    setProductToDelete(null);
    setDeleteProductError("");
  }, [deletingProduct]);

  const handleConfirmDeleteProduct = async () => {
    if (!productToDelete || deletingProduct) return;

    setDeletingProduct(true);
    setDeleteProductError("");

    try {
      await deleteProduct(productToDelete._id);

      const deletedName = productToDelete.name;
      setProductToDelete(null);
      setNotice(`"${deletedName}" was deleted successfully.`);
      refreshAfterProductDeleted();
    } catch (error) {
      console.error("Delete Product Error:", error);
      setDeleteProductError(getErrorMessage(error));
    } finally {
      setDeletingProduct(false);
    }
  };

  return (
    <main className="space-y-8">
      {/* Page Heading */}
      <AdminPageHeader
        eyebrow="Catalogue management"
        title="Products"
        description="Manage your wellness products, prices, inventory, and visibility."
        secondaryAction={{
          label: isLoading ? "Refreshing..." : "Refresh Data",
          icon: <ArrowClockwiseIcon size={16} />,
          onClick: handleRefresh,
          loading: isLoading,
          disabled: isLoading,
          variant: "outline",
          size: "xxs",
        }}
        action={{
          label: "Add Product",
          icon: <PlusIcon size={16} weight="bold" />,
          onClick: handleOpenCreateProduct,
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

            <p className="text-heading text-sm font-semibold">{notice}</p>
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

      {/* Category-loading Error */}
      {categoriesError && (
        <div className="border-warning/30 bg-warning/10 flex items-start gap-2.5 rounded-xl border p-4">
          <WarningCircleIcon
            size={20}
            className="text-warning mt-0.5 shrink-0"
          />

          <div>
            <p className="text-heading text-sm font-bold">
              Categories could not be loaded.
            </p>

            <p className="mt-1 text-xs">{categoriesError}</p>
          </div>
        </div>
      )}

      {/* Main Products Card */}
      <Reveal delay={0.2}>
        <div className="border-border bg-surface overflow-visible rounded-xl border shadow-2xs">
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
                  placeholder="Search name, description, slug or category..."
                  aria-label="Search products"
                  className="border-border bg-background text-heading placeholder:text-muted focus:border-primary-dark focus:ring-primary-dark/20 h-10 w-full rounded-lg border pr-9 pl-10 text-xs font-medium outline-none focus:ring-2"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      clearSearch();
                      setNotice("");
                    }}
                    aria-label="Clear search"
                    className="text-muted hover:text-heading absolute top-1/2 right-3 -translate-y-1/2"
                  >
                    <XIcon size={16} weight="bold" />
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                <ProductCategoryFilter
                  key={categoryFilterResetKey}
                  categories={categories}
                  categoriesLoading={categoriesLoading}
                  selectedCategoryId={categoryFilter}
                  onChange={handleCategoryChange}
                />

                <select
                  value={activeFilter}
                  onChange={handleStatusChange}
                  aria-label="Filter products by status"
                  className="border-border bg-background text-heading focus:border-primary-dark focus:ring-primary-dark/20 h-10 w-full rounded-lg border px-3 text-xs font-semibold outline-none focus:ring-2 sm:w-auto sm:min-w-36"
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

            {/* Results count */}
            <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-muted text-xs">
                {isLoading ? (
                  "Loading products..."
                ) : (
                  <>
                    Showing{" "}
                    <span className="text-heading font-bold">
                      {showingFrom} - {showingTo}
                    </span>{" "}
                    of{" "}
                    <span className="text-heading font-bold">
                      {totalProducts}
                    </span>{" "}
                    {totalProducts === 1 ? "product" : "products"}
                  </>
                )}
              </p>

              {hasActiveFilters && (
                <p className="text-muted text-[11px]">Filtered results</p>
              )}
            </div>
          </div>

          {/* Error State */}
          {error && !isLoading && (
            <div className="p-6">
              <div className="border-danger/30 bg-danger/10 rounded-lg border p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-danger text-xs font-semibold">{error}</p>

                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={handleRefresh}
                  >
                    Try again
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Initial Loading State */}
          {isLoading && products.length === 0 && !error && (
            <ProductLoadingState />
          )}

          {/* Empty State */}
          {!isLoading && !error && products.length === 0 && (
            <EmptyProducts
              hasFilters={hasActiveFilters}
              onAddProduct={handleOpenCreateProduct}
              onClearFilters={handleClearFilters}
            />
          )}

          {/* Products Table */}
          {!error && products.length > 0 && (
            <ProductsTable
              products={products}
              isLoading={isLoading}
              deletingProduct={deletingProduct}
              onEditProduct={handleOpenEditProduct}
              onDeleteProduct={handleOpenDeleteProduct}
            />
          )}

          {/* Pagination Footer */}
          {!error && products.length > 0 && (
            <div className="border-border bg-background/50 flex flex-col items-center justify-between gap-4 border-t px-5 py-4 sm:flex-row">
              <p className="text-muted text-[11px]">
                Showing{" "}
                <span className="text-heading font-bold">{showingFrom}</span>
                {" - "}
                <span className="text-heading font-bold">
                  {showingTo}
                </span> of{" "}
                <span className="text-heading font-semibold">
                  {totalProducts}
                </span>{" "}
                products
              </p>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="xxs"
                  leftIcon={<CaretLeftIcon size={13} />}
                  disabled={currentPage === 1 || isLoading}
                  onClick={handlePreviousPage}
                >
                  Previous
                </Button>

                <span className="text-muted text-[11px]">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  type="button"
                  variant="outline"
                  size="xxs"
                  rightIcon={<CaretRightIcon size={13} />}
                  disabled={currentPage >= totalPages || isLoading}
                  onClick={handleNextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </Reveal>

      {/* Keep mounted so the shared modal can animate its close transition */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={handleCloseAddProduct}
        onCreated={handleProductCreated}
        onUpdated={handleProductUpdated}
        onPartialUpdate={handlePartialProductUpdate}
        product={editingProduct}
      />

      <DeleteConfirmationModal
        isOpen={Boolean(productToDelete)}
        onClose={handleCloseDeleteProduct}
        onConfirm={handleConfirmDeleteProduct}
        loading={deletingProduct}
        title="Delete product?"
        description="This permanently deletes the product and its stored images. This action cannot be undone."
        itemName={productToDelete?.name || ""}
        error={deleteProductError}
      />
    </main>
  );
}

export default AdminProductPage;
