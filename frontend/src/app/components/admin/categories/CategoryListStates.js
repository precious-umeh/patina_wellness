import {
  FolderOpenIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@phosphor-icons/react/dist/ssr";

import Button from "../../shared/Button";

export function CategoryLoadingState() {
  return (
    <div className="divide-border divide-y">
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="animate-pulse px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-border h-9 w-9 rounded-lg" />

            <div className="flex-1 space-y-2">
              <div className="bg-border h-3 w-40 max-w-full rounded" />
              <div className="bg-border h-2.5 w-24 max-w-full rounded" />
            </div>

            <div className="bg-border h-6 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyCategories({
  hasFilters,
  onCreateCategory,
  onClearFilters,
}) {
  return (
    <div className="px-6 py-16">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="bg-background text-muted mb-4 flex h-12 w-12 items-center justify-center rounded-full">
          {hasFilters ? (
            <MagnifyingGlassIcon size={24} weight="duotone" />
          ) : (
            <FolderOpenIcon size={24} weight="duotone" />
          )}
        </div>

        <h3 className="text-heading text-sm font-extrabold">
          {hasFilters ? "No matching categories" : "No categories yet"}
        </h3>

        <p className="text-muted mt-1 max-w-sm text-xs leading-relaxed">
          {hasFilters
            ? "Try changing your search or status filter."
            : "Create your first category to organise the product catalogue."}
        </p>

        {hasFilters ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-5"
            onClick={onClearFilters}
          >
            Clear Filters
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            className="mt-4"
            leftIcon={<PlusIcon size={15} weight="bold" />}
            onClick={onCreateCategory}
          >
            Create Category
          </Button>
        )}
      </div>
    </div>
  );
}
