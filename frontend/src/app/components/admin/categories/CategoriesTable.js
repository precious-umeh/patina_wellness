"use client";

import {
  CaretDownIcon,
  CaretRightIcon,
  CheckCircleIcon,
  FolderOpenIcon,
  PencilSimpleIcon,
  TrashIcon,
  XCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

import Button from "../../shared/Button";
import PresenceTable from "../../animations/PresenceTable";
import PresenceTableRow from "../../animations/PresenceTableRow";

import { getParentId } from "@/app/lib/categoryUtils";
import { formatDate } from "@/app/lib/date";

function CategoryStatus({ isActive }) {
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
    </span>
  );
}

function CategoriesTable({
  categories = [],
  categoryById,
  hasActiveFilters,
  expandedCategoryIds,
  categoryHasVisibleChildren,
  onToggleExpanded,
  onEdit,
  onDelete,
}) {
  return (
    <div className="scrollbar-hide overflow-x-auto">
      <table className="w-full min-w-225 text-left text-xs">
        <thead className="bg-background text-muted border-border border-b font-bold tracking-wider uppercase">
          <tr>
            <th scope="col" className="px-5 py-3">
              Category
            </th>

            <th scope="col" className="px-5 py-3">
              Slug
            </th>

            <th scope="col" className="px-5 py-3">
              Parent
            </th>

            <th scope="col" className="px-5 py-3">
              Status
            </th>

            <th scope="col" className="px-5 py-3">
              Last Updated
            </th>

            <th scope="col" className="px-5 py-3 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <PresenceTable mode="sync" className="divide-border divide-y">
          {categories.map((category) => {
            const categoryId = String(category._id);
            const parentId = getParentId(category.parent);
            const parentName = categoryById.get(parentId)?.name || "";
            const isExpanded = expandedCategoryIds.has(categoryId);
            const hasVisibleChildren = categoryHasVisibleChildren(category);

            return (
              <PresenceTableRow
                key={category._id}
                className="hover:bg-background/50 transition-colors"
              >
                {/* Category Hierarchy */}
                <td className="px-5 py-4">
                  <div
                    className="flex items-center gap-2.5"
                    style={{
                      paddingLeft: `${(category.depth || 0) * 20}px`,
                    }}
                  >
                    {hasVisibleChildren ? (
                      hasActiveFilters ? (
                        <span
                          aria-hidden="true"
                          className="text-muted flex h-7 w-7 shrink-0 items-center justify-center"
                        >
                          <CaretDownIcon size={15} weight="bold" />
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onToggleExpanded(category._id)}
                          aria-label={`${isExpanded ? "Collapse" : "Expand"} ${category.name}`}
                          aria-expanded={isExpanded}
                          className="text-muted hover:bg-background hover:text-heading flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors"
                        >
                          {isExpanded ? (
                            <CaretDownIcon size={15} weight="bold" />
                          ) : (
                            <CaretRightIcon size={15} weight="bold" />
                          )}
                        </button>
                      )
                    ) : (
                      <span aria-hidden="true" className="h-7 w-7 shrink-0" />
                    )}

                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        category.depth === 0
                          ? "bg-primary-light text-primary-dark"
                          : "bg-background text-muted"
                      }`}
                    >
                      <FolderOpenIcon size={18} weight="duotone" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-heading font-bold">{category.name}</p>

                      <p className="text-muted mt-0.5 text-[10px]">
                        {category.depth === 0
                          ? "Top-level category"
                          : `Subcategory · Level ${category.depth + 1}`}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Slug */}
                <td className="px-5 py-4">
                  <span className="inline-block max-w-48 truncate">
                    {category.slug || "-"}
                  </span>
                </td>

                {/* Parent */}
                <td className="px-5 py-4">
                  {parentName || <span className="text-muted">-</span>}
                </td>

                {/* Status */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <CategoryStatus isActive={category.isActive} />
                </td>

                {/* Updated date */}
                <td className="px-5 py-4 whitespace-nowrap">
                  {formatDate(category.updatedAt)}
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="xxs"
                      leftIcon={<PencilSimpleIcon size={13} weight="bold" />}
                      onClick={() => onEdit(category)}
                    >
                      Edit
                    </Button>

                    <Button
                      type="button"
                      variant="danger"
                      size="xxs"
                      leftIcon={<TrashIcon size={13} weight="bold" />}
                      onClick={() => onDelete(category)}
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

export default CategoriesTable;
