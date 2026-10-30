"use client";

import { useCallback, useRef, useState } from "react";

import {
  createProduct,
  addProductImages,
  deleteProductImage,
  updateProduct,
} from "@/app/lib/api/products";

function useProductSubmission({
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
}) {
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (submittingRef.current || productLoading || productLoadFailed) {
        return;
      }

      setFormError("");

      // Validate required text fields
      if (!name.trim() || !description.trim()) {
        setFormError("Name and description are required.");
        return;
      }

      if (price === "" || stock === "") {
        setFormError("Price and stock are required.");
        return;
      }

      const productPrice = Number(price);
      const productStock = Number(stock);

      if (!Number.isFinite(productPrice) || productPrice < 0) {
        setFormError("Enter a valid, non-negative price.");
        return;
      }

      if (
        !Number.isFinite(productStock) ||
        !Number.isInteger(productStock) ||
        productStock < 0
      ) {
        setFormError("Stock must be a non-negative whole number.");
        return;
      }

      if (selectedCategoryIds.length === 0) {
        setFormError("Select at least one product category.");
        return;
      }

      // A product must retain at least one image after the update
      const removedIds = new Set(removedImageIds.map(String));

      const remainExistingImageCount = existingImages.filter(
        (image) => !removedIds.has(String(image._id)),
      ).length;

      const finalImageCount = remainExistingImageCount + selectedImages.length;

      if (!isEditing && selectedImages.length === 0) {
        setFormError("Upload at least one product image.");
        return;
      }

      if (isEditing && finalImageCount === 0) {
        setFormError(
          "A product must have at least one image. Keep an existing image or upload a new one.",
        );
        return;
      }

      // Build the product fields
      const productPayload = {
        name: name.trim(),
        description: description.trim(),
        price: productPrice,
        stock: productStock,
        categories: selectedCategoryIds,
        isFeatured,
      };

      if (isEditing) {
        productPayload.isActive = isActive;
      }

      // New products are created using multipart FormData.
      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("price", String(productPrice));
      formData.append("stock", String(productStock));
      formData.append("isFeatured", String(isFeatured));
      formData.append("categories", JSON.stringify(selectedCategoryIds));

      selectedImages.forEach(({ file }) => {
        formData.append("images", file);
      });

      submittingRef.current = true;
      setSubmitting(true);

      let productWasMutated = false;

      try {
        if (!isEditing) {
          const data = await createProduct(formData);

          /**
           * The request suceeded. Release the submission guard before resetting and closing the modal.
           */
          submittingRef.current = false;

          resetForm();
          onCreated?.(data.product);
          onClose();

          return;
        }

        // Update the product's fields first
        const updatedData = await updateProduct(productId, productPayload);

        productWasMutated = true;

        let savedProduct = updatedData.product;

        // Upload new images before deleting existing images.
        if (selectedImages.length > 0) {
          const imageFormData = new FormData();

          selectedImages.forEach(({ file }) =>
            imageFormData.append("images", file),
          );

          const imageData = await addProductImages(productId, imageFormData);

          productWasMutated = true;
          savedProduct = imageData.product || savedProduct;

          replaceExistingImages(imageData.product?.images || []);
          clearSelectedImages();
        }

        // Delete images that the admin marked for removal.
        // Process sequentially so each successful deletion can update the UI.
        for (const imageId of removedImageIds) {
          const imageData = await deleteProductImage(productId, imageId);

          productWasMutated = true;
          savedProduct = imageData.product || savedProduct;

          replaceExistingImages(imageData.product?.images || []);
          clearRemovedImageId(imageId);
        }

        submittingRef.current = false;

        resetForm();
        onUpdated?.(savedProduct);
        onClose();
      } catch (error) {
        // If some update operations succeeded before another failed,
        // refresh the product list while keeping the editor open.
        if (isEditing && productWasMutated) {
          onPartialUpdate?.();
        }

        const serverMessage = error.response?.data?.message;

        setFormError(
          isEditing && productWasMutated
            ? `${serverMessage || "One step of the update failed."} Some changes may already have been saved. Review the images and try saving again, or close and reopen the product to verify its current state.`
            : serverMessage ||
                (isEditing
                  ? "Unable to update product. Please try again."
                  : "Unable to create product. Please try again."),
        );
      } finally {
        submittingRef.current = false;
        setSubmitting(false);
      }
    },
    [
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
    ],
  );

  return {
    submitting,
    submittingRef,
    handleSubmit,
  };
}

export default useProductSubmission;
