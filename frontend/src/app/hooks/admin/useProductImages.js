"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/avif",
  "image/webp",
];

const ACCEPTED_EXTENSIONS = /\.(jpe?g|png|gif|avif|webp)$/i;

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB per image
const MAX_IMAGES = 5; // Only 5 images can be uploaded at once

function useProductImages() {
  const fileInputRef = useRef(null);
  const selectedImagesRef = useRef([]);

  const [selectedImages, setSelectedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState("");

  // Keep the latest previews available for cleanup.
  useEffect(() => {
    selectedImagesRef.current = selectedImages;
  }, [selectedImages]);

  // Revoke temporary preview URLs when the hook unmounts.
  useEffect(() => {
    return () => {
      selectedImagesRef.current.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });
    };
  }, []);

  const clearSelectedImages = useCallback(() => {
    selectedImagesRef.current.forEach((image) => {
      URL.revokeObjectURL(image.previewUrl);
    });

    selectedImagesRef.current = [];
    setSelectedImages([]);
  }, []);

  const resetImageState = useCallback(() => {
    clearSelectedImages();
    setExistingImages([]);
    setRemovedImageIds([]);
    setIsDragging(false);
    setImageError("");
  }, [clearSelectedImages]);

  const replaceExistingImages = useCallback((images = []) => {
    setExistingImages(images);
  }, []);

  const toggleExistingImageRemoval = useCallback((imageId) => {
    const id = String(imageId);

    if (!id) return;

    setRemovedImageIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((currentId) => currentId !== id)
        : [...currentIds, id],
    );
  }, []);

  const clearRemovedImageId = useCallback((imageId) => {
    const id = String(imageId);

    setRemovedImageIds((currentIds) =>
      currentIds.filter((currentId) => currentId !== id),
    );
  }, []);

  const handleFiles = useCallback((fileList) => {
    const incomingFiles = Array.from(fileList || []);

    if (incomingFiles.length === 0) return;

    const remainingSlots = MAX_IMAGES - selectedImagesRef.current.length;

    if (remainingSlots <= 0) {
      setImageError("You can upload a maximum of 5 images.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const validFiles = [];
    const errors = [];

    for (const file of incomingFiles) {
      const validType = ACCEPTED_TYPES.includes(file.type);
      const validExtension = ACCEPTED_EXTENSIONS.test(file.name);

      if (!validType || !validExtension) {
        errors.push(`${file.name}: unsupported file type.`);
        continue;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        errors.push(`${file.name}: image must be 5 MB or smaller.`);
        continue;
      }

      validFiles.push(file);
    }

    const acceptedFiles = validFiles.slice(0, remainingSlots);

    const newImages = acceptedFiles.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    if (validFiles.length > remainingSlots) {
      errors.push(
        `You can select a maximum of ${MAX_IMAGES} images. Only the first ${remainingSlots} valid image(s) were added.`,
      );
    }

    if (newImages.length > 0) {
      setSelectedImages((currentImages) => [...currentImages, ...newImages]);
    }

    setImageError(errors.join(" "));

    // Allow the same file to be selected again later.
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleFileChange = useCallback(
    (event) => {
      handleFiles(event.target.files);
    },
    [handleFiles],
  );

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      setIsDragging(false);
      handleFiles(event.dataTransfer.files);
    },
    [handleFiles],
  );

  const handleRemoveImage = useCallback((previewUrl) => {
    URL.revokeObjectURL(previewUrl);

    setSelectedImages((currentImages) =>
      currentImages.filter((image) => image.previewUrl !== previewUrl),
    );

    setImageError("");
  }, []);

  const handleRemoveAllImages = useCallback(() => {
    clearSelectedImages();
    setImageError("");
  }, [clearSelectedImages]);

  return {
    fileInputRef,

    selectedImages,
    existingImages,
    removedImageIds,
    isDragging,
    imageError,

    setImageError,
    clearSelectedImages,
    resetImageState,
    replaceExistingImages,
    toggleExistingImageRemoval,
    clearRemovedImageId,

    handleFiles,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemoveImage,
    handleRemoveAllImages,
  };
}

export default useProductImages;
