"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { XIcon } from "@phosphor-icons/react/dist/ssr";

import { getProductAdmin } from "@/app/lib/api/products";

import Modal from "../../shared/Modal";
import Button from "../../shared/Button";
import useProductImages from "@/app/hooks/admin/useProductImages";
import ProductImageSection from "../products/ProductImageSection";
import ProductInformationSection from "../products/ProductInformationSection";
import ProductCategoriesSection from "../products/ProductCategoriesSection";
import useProductSubmission from "@/app/hooks/admin/useProductSubmission";
import useProductCategories from "@/app/hooks/admin/useProductCategories";

function AddProductModal({
  isOpen,
  onClose,
  onCreated,
  onUpdated,
  onPartialUpdate,
  product = null,
}) {
  const productId = product?._id ? String(product._id) : "";
  const isEditing = Boolean(productId);

  const {
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
  } = useProductCategories(isOpen);

  const nameInputRef = useRef(null);

  const {
    fileInputRef,
    selectedImages,
    existingImages,
    removedImageIds,
    isDragging,
    imageError,

    clearSelectedImages,
    resetImageState,
    replaceExistingImages,
    toggleExistingImageRemoval,
    clearRemovedImageId,

    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemoveImage,
    handleRemoveAllImages,
  } = useProductImages();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [loadedProductId, setLoadedProductId] = useState("");
  const [failedProductId, setFailedProductId] = useState("");

  const [formError, setFormError] = useState("");

  const productLoading =
    isEditing && loadedProductId !== productId && failedProductId !== productId;

  const productLoadFailed = isEditing && failedProductId === productId;

  /**
   * Load product and, in edit mode, fetch the latest product details.
   */
  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    async function loadProduct() {
      if (!productId) return;

      try {
        const data = await getProductAdmin(productId);
        if (cancelled) return;

        const currentProduct = data.product;
        if (!currentProduct) {
          throw new Error(
            "The product details were not returned by the server.",
          );
        }

        setName(currentProduct.name || "");
        setDescription(currentProduct.description || "");
        setPrice(String(currentProduct.price ?? ""));
        setStock(String(currentProduct.stock ?? ""));
        setIsFeatured(currentProduct.isFeatured ?? false);
        setIsActive(currentProduct.isActive ?? true);
        replaceExistingImages(currentProduct.images || []);
        setSelectedCategories(
          (currentProduct.categories || [])
            .map((category) =>
              typeof category === "string"
                ? category
                : category?._id || category?.id || "",
            )
            .filter(Boolean),
        );
        setLoadedProductId(productId);
        setFailedProductId("");
      } catch (error) {
        if (cancelled) return;

        setFailedProductId(productId);
        setFormError(
          error.response?.data?.message ||
            error.message ||
            "Unable to load product details. Close the modal and try again.",
        );
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [isOpen, productId, replaceExistingImages, setSelectedCategories]);

  /**
   * Reset the form when the admin closes the modal.
   */
  const resetForm = useCallback(() => {
    resetImageState();

    setName("");
    setDescription("");
    setPrice("");
    setStock("");

    resetCategorySelection();

    setIsFeatured(false);
    setIsActive(true);
    setLoadedProductId("");
    setFailedProductId("");

    setFormError("");
  }, [resetImageState, resetCategorySelection]);

  /**
   * Validate and submit product data as multipart FormData
   */
  const { submitting, submittingRef, handleSubmit } = useProductSubmission({
    productId,
    isEditing,
    name,
    description,
    price,
    stock,
    selectedCategoryIds,
    isFeatured,
    isActive,
    existingImages,
    removedImageIds,
    selectedImages,
    productLoading,
    productLoadFailed,
    resetForm,
    onCreated,
    onUpdated,
    onClose,
    onPartialUpdate,
    setFormError,
    replaceExistingImages,
    clearSelectedImages,
    clearRemovedImageId,
  });

  /**
   * Prevent closing while the product is being submitted.
   */
  const handleModalClose = useCallback(() => {
    if (submittingRef.current) return;

    resetForm();
    onClose();
  }, [onClose, resetForm, submittingRef]);

  /**
   * Handler for marking exisiting images for removal
   */
  const handleToggleExistingImageRemoval = useCallback(
    (imageId) => {
      toggleExistingImageRemoval(imageId);
      setFormError("");
    },
    [toggleExistingImageRemoval],
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={isEditing ? "Edit Product" : "Add New Product"}
      position="center"
      panelClassName="max-w-3xl max-h-[92vh] overflow-y-auto bg-surface scrollbar-hide"
      initialFocusRef={nameInputRef}
    >
      {/* Modal Header */}
      <div className="border-border bg-surface sticky top-0 z-10 flex items-start justify-between gap-4 border-b px-5 py-4 sm:px-6">
        <div>
          <p className="text-muted text-[10px] font-bold tracking-[0.18em] uppercase">
            Inventory Management
          </p>

          <h2 className="text-heading mt-1 text-lg font-extrabold">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h2>

          <p className="text-muted mt-1 text-xs">
            {isEditing
              ? "Update product details, category assignments, and images."
              : "Add product details, categories and images."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleModalClose}
          disabled={submitting}
          aria-label="Close modal"
          className="text-muted hover:bg-background hover:text-heading rounded-lg p-2 transition-colors disabled:pointer-events-none disabled:opacity-50"
        >
          <XIcon size={19} weight="bold" />
        </button>
      </div>

      {productLoading ? (
        <div className="p-8 text-center" role="status" aria-live="polite">
          <div className="border-border border-t-primary-dark mx-auto h-8 w-8 animate-spin rounded-full border-2" />
          <p className="text-muted mt-3 text-sm">Loading product details...</p>
        </div>
      ) : productLoadFailed ? (
        <div className="space-y-4 p-5 sm:p-6">
          <div
            role="alert"
            className="border-danger/30 bg-danger/10 text-danger rounded-lg border p-3 text-xs font-medium"
          >
            {formError ||
              "Unable to load product details. Close the modal and try again."}
          </div>

          <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={handleModalClose}>
              Close
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 p-5 sm:p-6">
            {/* Product Information */}
            <ProductInformationSection
              nameInputRef={nameInputRef}
              isEditing={isEditing}
              name={name}
              description={description}
              price={price}
              stock={stock}
              isFeatured={isFeatured}
              onFeaturedChange={(e) => setIsFeatured(e.target.checked)}
              isActive={isActive}
              submitting={submitting}
              onNameChange={(e) => setName(e.target.value)}
              onDescriptionChange={(e) => setDescription(e.target.value)}
              onPriceChange={(e) => setPrice(e.target.value)}
              onStockChange={(e) => setStock(e.target.value)}
              onActiveChange={(e) => setIsActive(e.target.checked)}
            />

            {/* Categories */}
            <ProductCategoriesSection
              categoriesLoading={categoriesLoading}
              categoriesError={categoriesError}
              onRetryCategories={handleRetryCategories}
              selectableCategories={selectableCategories}
              categorySearchQuery={categorySearchQuery}
              onCategorySearchChange={handleCategorySearchChange}
              onClearCategorySearch={clearCategorySearch}
              visibleCategoryTree={visibleCategoryTree}
              selectedCategoryIds={selectedCategoryIds}
              inheritedCategoryIds={inheritedCategoryIds}
              expandedCategoryIds={expandedCategoryIds}
              onCategoryChange={handleCategoryChange}
              onToggleCategoryExpanded={handleToggleCategoryExpanded}
              submitting={submitting}
            />

            {/* Image uploader */}
            <ProductImageSection
              isEditing={isEditing}
              name={name}
              existingImages={existingImages}
              removedImageIds={removedImageIds}
              selectedImages={selectedImages}
              fileInputRef={fileInputRef}
              isDragging={isDragging}
              imageError={imageError}
              submitting={submitting}
              onToggleExistingImageRemoval={handleToggleExistingImageRemoval}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onFileChange={handleFileChange}
              onRemoveImage={handleRemoveImage}
              onRemoveAllImages={handleRemoveAllImages}
            />

            {/* Form Error */}
            {formError && (
              <div
                role="alert"
                className="border-danger/30 bg-danger/10 text-danger rounded-lg border p-3 text-xs font-medium"
              >
                {formError}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-border bg-background/50 flex flex-col-reverse gap-3 border-t px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleModalClose}
              disabled={submitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={submitting}
              disabled={
                submitting ||
                categoriesLoading ||
                Boolean(categoriesError) ||
                selectableCategories.length === 0
              }
            >
              {submitting
                ? isEditing
                  ? "Saving Changes..."
                  : "Creating Product..."
                : isEditing
                  ? "Save Changes"
                  : "Create Product"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

export default AddProductModal;
