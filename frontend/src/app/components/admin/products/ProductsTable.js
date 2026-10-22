"use client";

import Image from "next/image";

import {
  CheckCircleIcon,
  ImageIcon,
  PencilSimpleIcon,
  StarIcon,
  TrashIcon,
  WarningCircleIcon,
  XCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

import Button from "../../shared/Button";
import PresenceTable from "../../animations/PresenceTable";
import PresenceTableRow from "../../animations/PresenceTableRow";
import { formatDate } from "@/app/lib/date";

const LOW_STOCK_THRESHOLD = 5;

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
});

function formatPrice(price) {
  const value = Number(price);

  return Number.isFinite(value) ? currencyFormatter.format(value) : "-";
}

function getProductCategoryNames(categories = []) {
  return categories
    .map((category) =>
      typeof category === "string" ? category : category?.name,
    )
    .filter(Boolean);
}

function ProductStatusBadge({ isActive }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
        isActive
          ? "bg-primary-light text-primary-dark"
          : "bg-surface text-muted"
      }`}
    >
      {isActive ? (
        <CheckCircleIcon size={13} weight="fill" />
      ) : (
        <XCircleIcon size={13} weight="fill" />
      )}

      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function ProductStockBadge({ stock }) {
  const quantity = Number(stock);

  if (!Number.isFinite(quantity)) {
    return <span className="text-muted text-sm">-</span>;
  }

  if (quantity === 0) {
    return (
      <span className="bg-danger/10 text-danger inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold">
        Out of stock
      </span>
    );
  }

  if (quantity <= LOW_STOCK_THRESHOLD) {
    return (
      <span className="bg-warning/10 text-warning inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold">
        <WarningCircleIcon size={14} weight="fill" />
        Low stock · {quantity}
      </span>
    );
  }

  return (
    <span className="text-body text-sm font-medium">
      {quantity.toLocaleString("en-NG")}
    </span>
  );
}

function ProductImage({ product }) {
  const imageUrl = product.images?.[0]?.url;

  return (
    <div className="bg-background border-border relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={product.name || "Product image"}
          width={40}
          height={40}
          unoptimized
          className="h-full w-full object-cover"
        />
      ) : (
        <ImageIcon size={20} weight="duotone" className="text-muted" />
      )}
    </div>
  );
}

function ProductsTable({
  products = [],
  isLoading = false,
  deletingProduct = false,
  onEditProduct,
  onDeleteProduct,
}) {
  return (
    <div
      className={`scrollbar-hide overflow-x-auto transition-opacity duration-200 ${
        isLoading ? "opacity-60" : "opacity-100"
      }`}
    >
      <table className="w-full min-w-262.5 text-left text-xs">
        <thead className="bg-background text-muted border-border border-b font-bold tracking-wider uppercase">
          <tr>
            <th scope="col" className="px-5 py-3">
              Product
            </th>
            <th scope="col" className="px-5 py-3">
              Categories
            </th>
            <th scope="col" className="px-5 py-3">
              Price
            </th>
            <th scope="col" className="px-5 py-3">
              Stock
            </th>
            <th scope="col" className="px-5 py-3">
              Status
            </th>
            <th scope="col" className="px-5 py-3">
              Date Added
            </th>
            <th scope="col" className="px-5 py-3 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <PresenceTable mode="sync" className="divide-border divide-y">
          {products.map((product) => {
            const categoryNames = getProductCategoryNames(product.categories);

            return (
              <PresenceTableRow
                key={product._id}
                className="hover:bg-background/50 transition-colors"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <ProductImage product={product} />

                    <div className="max-w-60 min-w-0">
                      <div className="flex min-w-0 items-center gap-2">
                        <p
                          title={product.name}
                          className="text-heading truncate font-bold"
                        >
                          {product.name}
                        </p>

                        {product.isFeatured && (
                          <span className="border-secondary/40 bg-secondary/10 text-heading inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold">
                            <StarIcon
                              size={12}
                              weight="fill"
                              className="text-secondary-dark"
                            />
                            Featured
                          </span>
                        )}
                      </div>

                      <p
                        title={product.slug}
                        className="text-muted mt-0.5 truncate text-[10px]"
                      >
                        {product.slug || "-"}
                      </p>

                      {product.description && (
                        <p className="text-muted mt-0.5 line-clamp-2 text-[10px] leading-relaxed">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="flex max-w-52 flex-wrap gap-1.5">
                    {categoryNames.length > 0 ? (
                      categoryNames.slice(0, 3).map((name, index) => (
                        <span
                          key={`${name}-${index}`}
                          className="bg-background rounded-md px-2 py-1 text-[10px]"
                        >
                          {name}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted">-</span>
                    )}

                    {categoryNames.length > 3 && (
                      <span className="bg-background text-muted rounded-md px-2 py-1 text-[10px]">
                        +{categoryNames.length - 3}
                      </span>
                    )}
                  </div>
                </td>

                <td className="text-heading px-5 py-4 font-bold whitespace-nowrap">
                  {formatPrice(product.price)}
                </td>

                <td className="px-5 py-4 whitespace-nowrap">
                  <ProductStockBadge stock={product.stock} />
                </td>

                <td className="px-5 py-4 whitespace-nowrap">
                  <ProductStatusBadge isActive={product.isActive} />
                </td>

                <td className="px-5 py-4 whitespace-nowrap">
                  {formatDate(product.createdAt)}
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="xxs"
                      leftIcon={<PencilSimpleIcon size={13} weight="bold" />}
                      onClick={() => onEditProduct(product)}
                      disabled={isLoading || deletingProduct}
                    >
                      Edit
                    </Button>

                    <Button
                      type="button"
                      variant="danger"
                      size="xxs"
                      leftIcon={<TrashIcon size={13} weight="bold" />}
                      onClick={() => onDeleteProduct(product)}
                      disabled={isLoading || deletingProduct}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </PresenceTableRow>
            );
          })}
        </PresenceTable>
      </table>
    </div>
  );
}

export default ProductsTable;
