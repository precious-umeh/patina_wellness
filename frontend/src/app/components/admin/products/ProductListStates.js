import {
  MagnifyingGlassIcon,
  PackageIcon,
  PlusIcon,
} from "@phosphor-icons/react/dist/ssr";

import Button from "../../shared/Button";

export function ProductLoadingState() {
  return (
    <div className="divide-border divide-y">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="animate-pulse px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-border h-10 w-10 shrink-0 rounded-lg" />

            <div className="flex-1 space-y-2">
              <div className="bg-border h-3 w-40 max-w-full rounded" />
              <div className="bg-border h-2.5 w-56 max-w-full rounded" />
            </div>

            <div className="bg-border hidden h-6 w-20 rounded-full sm:block" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyProducts({ hasFilters, onAddProduct, onClearFilters }) {
  return (
    <div className="px-6 py-16">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="bg-background text-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full">
          {hasFilters ? (
            <MagnifyingGlassIcon size={24} weight="duotone" />
          ) : (
            <PackageIcon size={24} weight="duotone" />
          )}
        </div>

        <h3 className="text-heading text-sm font-extrabold">
          {hasFilters ? "No matching products found" : "No products yet"}
        </h3>

        <p className="text-muted mt-1 max-w-sm text-xs leading-relaxed">
          {hasFilters
            ? "Try adjusting your search term or filters to find the product you're looking for."
            : "Products added to your catalogue will appear here."}
        </p>

        {hasFilters ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={onClearFilters}
          >
            Clear filters
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            className="mt-4"
            leftIcon={<PlusIcon size={18} weight="bold" />}
            onClick={onAddProduct}
          >
            Add Product
          </Button>
        )}
      </div>
    </div>
  );
}
