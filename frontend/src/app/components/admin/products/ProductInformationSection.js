"use client";

function ProductInformationSection({
  nameInputRef,
  isEditing,
  name,
  description,
  price,
  stock,
  isFeatured,
  onFeaturedChange,
  isActive,
  submitting,
  onNameChange,
  onDescriptionChange,
  onPriceChange,
  onStockChange,
  onActiveChange,
}) {
  return (
    <>
      {/* Product Information */}
      <section className="space-y-4">
        <h3 className="text-heading text-sm font-bold">Product Information</h3>

        <div className="space-y-1.5">
          <label
            htmlFor="product-name"
            className="text-heading text-xs font-semibold"
          >
            Product Name <span className="text-secondary-dark">*</span>
          </label>

          <input
            ref={nameInputRef}
            id="product-name"
            type="text"
            value={name}
            onChange={onNameChange}
            placeholder="e.g. Vitamin C + Zinc Supplement"
            required
            disabled={submitting}
            className="border-border bg-background text-heading placeholder:text-muted focus:border-primary-dark focus:ring-primary-dark/20 h-10 w-full rounded-lg border px-3 text-sm outline-none focus:ring-2 disabled:opacity-60"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="product-description"
            className="text-heading text-xs font-semibold"
          >
            Description <span className="text-secondary-dark">*</span>
          </label>

          <textarea
            id="product-description"
            value={description}
            onChange={onDescriptionChange}
            placeholder="Describe the product..."
            rows={4}
            required
            disabled={submitting}
            className="border-border bg-background text-heading placeholder:text-muted focus:border-primary-dark focus:ring-primary-dark/20 w-full resize-y rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 disabled:opacity-60"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor="product-price"
              className="text-heading text-xs font-semibold"
            >
              Price (₦) <span className="text-secondary-dark">*</span>
            </label>

            <input
              id="product-price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={onPriceChange}
              placeholder="0.00"
              required
              disabled={submitting}
              className="border-border bg-background text-heading focus:border-primary-dark focus:ring-primary-dark/20 h-10 w-full rounded-lg border px-3 text-sm outline-none focus:ring-2 disabled:opacity-60"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="product-stock"
              className="text-heading text-xs font-semibold"
            >
              Stock Quantity <span className="text-secondary-dark">*</span>
            </label>

            <input
              id="product-stock"
              type="number"
              min="0"
              step="1"
              value={stock}
              onChange={onStockChange}
              placeholder="0"
              required
              disabled={submitting}
              className="border-border bg-background text-heading focus:border-primary-dark focus:ring-primary-dark/20 h-10 w-full rounded-lg border px-3 text-sm outline-none focus:ring-2 disabled:opacity-60"
            />
          </div>
        </div>
      </section>

      <section className="border-border bg-background flex items-start gap-3 rounded-lg border p-3">
        <input
          id="product-featured"
          type="checkbox"
          checked={isFeatured}
          onChange={onFeaturedChange}
          disabled={submitting}
          className="accent-primary-dark mt-0.5 h-4 w-4 shrink-0"
        />

        <div>
          <label
            htmlFor="product-featured"
            className="text-heading block cursor-pointer text-xs font-semibold"
          >
            Feature on homepage
          </label>

          <p className="text-muted mt-1 text-[10px] leading-relaxed">
            Display this profuct in the Featured Products section on the public
            homepage. Only active products are shown.
          </p>
        </div>
      </section>

      {/* Product visibility - editing only */}
      {isEditing && (
        <section className="border-border bg-background flex items-start gap-3 rounded-lg border p-3">
          <input
            id="product-active"
            type="checkbox"
            checked={isActive}
            onChange={onActiveChange}
            disabled={submitting}
            className="accent-primary-dark mt-0.5 h-4 w-4 shrink-0"
          />

          <div>
            <label
              htmlFor="product-active"
              className="text-heading block cursor-pointer text-xs font-semibold"
            >
              Active product
            </label>

            <p className="text-muted mt-1 text-[10px] leading-relaxed">
              Active products can be displayed in the public catalogue.
            </p>
          </div>
        </section>
      )}
    </>
  );
}

export default ProductInformationSection;
