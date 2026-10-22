"use client";

import Image from "next/image";

import { CloudArrowUpIcon, TrashIcon } from "@phosphor-icons/react/dist/ssr";

function ProductImageSection({
  isEditing,
  name,
  existingImages = [],
  removedImageIds = [],
  selectedImages = [],
  fileInputRef,
  isDragging,
  imageError,
  submitting,
  onToggleExistingImageRemoval,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileChange,
  onRemoveImage,
  onRemoveAllImages,
}) {
  return (
    <section className="space-y-3">
      {/* Exisiting product images */}
      {isEditing && existingImages.length > 0 && (
        <div className="space-y-3">
          <div>
            <h3 className="text-heading text-sm font-bold">
              Current Images ({existingImages.length})
            </h3>

            <p className="text-muted mt-1 text-xs">
              Mark images for reoval, then save your changes. You must keep at
              least one image.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {existingImages.map((image) => {
              const imageId = String(image._id || "");
              const markedForRemoval = removedImageIds.includes(imageId);

              return (
                <div
                  key={imageId || image.url}
                  className={`border-border bg-background overflow-hidden rounded-lg border ${
                    markedForRemoval ? "border-danger/50" : ""
                  }`}
                >
                  <div
                    className={`bg-surface relative aspect-square ${
                      markedForRemoval ? "opacity-45" : ""
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`${name || "Product"} image`}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      className="object-cover"
                    />

                    {markedForRemoval && (
                      <div className="bg-danger/90 absolute inset-x-0 bottom-0 px-2 py-1.5 text-center text-[10px] font-bold text-white">
                        Marked for removal
                      </div>
                    )}
                  </div>

                  <div className="p-2">
                    <button
                      type="button"
                      onClick={() => onToggleExistingImageRemoval(imageId)}
                      disabled={submitting || !imageId}
                      className={`w-full rounded-md px-2 py-1.5 text-[10px] font-bold transition-colors disabled:opacity-50 ${
                        markedForRemoval
                          ? "bg-primary-light text-primary-dark hover:bg-primary-light/70"
                          : "bg-danger/10 text-danger hover:bg-danger/15"
                      }`}
                    >
                      {markedForRemoval ? "Keep image" : "Mark for removal"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upload Additional Images */}
      <div>
        <h3 className="text-heading text-sm font-bold">
          {isEditing ? "Add more Images" : "Product Images"}{" "}
          {!isEditing && <span className="text-secondary-dark">*</span>}
        </h3>

        <p className="text-muted mt-1 text-xs">
          {isEditing
            ? "Add more images if needed. JPG, PNG, GIF, AVIF and WebP are supported, up to 5 MB per image."
            : "Upload one or more images. JPG, PNG, GIF, AVIF and WebP are supported, up to 5 MB per image."}
        </p>
      </div>

      <label
        htmlFor="product-images"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 py-8 text-center transition-colors ${
          isDragging
            ? "border-primary-dark bg-primary-light/30"
            : "border-border bg-backgorund hover:border-primary-dark/60 hover:bg-primary-light/10"
        } ${submitting ? "pointer-events-none opacity-60" : ""}`}
      >
        <div className="bg-primary-light text-primary-dark mb-3 flex h-12 w-12 items-center justify-center rounded-full">
          <CloudArrowUpIcon size={25} weight="duotone" />
        </div>

        <p className="text-heading text-sm font-bold">
          Drag and drop your images here
        </p>

        <p className="text-muted mt-1 text-xs">
          or{" "}
          <span className="text-primary-dark font-bold underline underline-offset-2">
            browse files
          </span>
        </p>

        <input
          ref={fileInputRef}
          id="product-images"
          type="file"
          accept=".jpg,.jpeg,.png,.avif,.gif,.webp,image/jpeg,image/png,image/avif,image/gif,image/webp"
          multiple
          disabled={submitting}
          onChange={onFileChange}
          className="sr-only"
        />
      </label>

      {imageError && (
        <p role="alert" className="text-xs text-amber-700">
          {imageError}
        </p>
      )}

      {/* Newly Selected Images */}
      {selectedImages.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-heading text-xs font-bold">
              Selected Images ({selectedImages.length})
            </p>

            <button
              type="button"
              onClick={onRemoveAllImages}
              disabled={submitting}
              className="text-danger text-[11px] font-semibold hover:underline disabled:opacity-50"
            >
              Remove all
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {selectedImages.map((image) => (
              <div
                key={image.previewUrl}
                className="border-border bg-background overflow-hidden rounded-lg border"
              >
                <div className="bg-surface relative aspect-square">
                  <Image
                    src={image.previewUrl}
                    alt={image.file.name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    className="object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => onRemoveImage(image.previewUrl)}
                    disabled={submitting}
                    aria-label={`Remove ${image.file.name}`}
                    className="absolute top-2 right-2 rounded-md bg-black/70 p-1.5 text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                  >
                    <TrashIcon size={14} weight="bold" />
                  </button>
                </div>

                <div className="p-2">
                  <p
                    title={image.file.name}
                    className="text-heading truncate text-[10px] font-semibold"
                  >
                    {image.file.name}
                  </p>

                  <p className="text-muted mt-0.5 text-[9px]">
                    {(image.file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default ProductImageSection;
