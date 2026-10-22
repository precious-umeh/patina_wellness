"use client";

import { useCallback, useMemo, useState } from "react";

import { createCategory, updateCategory } from "@/app/lib/api/categories";

import { getParentId } from "@/app/lib/categoryUtils";

function getExcludedParentIds(category, categories) {
  if (!category) return new Set();

  const excludedIds = new Set([String(category._id)]);
  let foundDescendant = true;

  while (foundDescendant) {
    foundDescendant = false;

    for (const item of categories) {
      const itemId = String(item._id);
      const itemParentId = getParentId(item.parent);

      if (
        itemParentId &&
        excludedIds.has(itemParentId) &&
        !excludedIds.has(itemId)
      ) {
        excludedIds.add(itemId);
        foundDescendant = true;
      }
    }
  }

  return excludedIds;
}

function useCategoryForm({
  category = null,
  categories = [],
  onSaved,
  onClose,
}) {
  const isEditing = Boolean(category);

  const [name, setName] = useState(category?.name || "");
  const [parentId, setParentId] = useState(getParentId(category?.parent));
  const [isActive, setIsActive] = useState(category?.isActive ?? true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const excludedParentIds = useMemo(
    () => getExcludedParentIds(category, categories),
    [category, categories],
  );

  // Only active categories that won't create a hierarchy cycle are valid
  const availableParents = useMemo(
    () =>
      categories.filter(
        (item) => item.isActive && !excludedParentIds.has(String(item._id)),
      ),
    [categories, excludedParentIds],
  );

  const handleNameChange = useCallback(
    (event) => setName(event.target.value),
    [],
  );

  const handleParentChange = useCallback((nextParentId) => {
    setParentId(nextParentId ? String(nextParentId) : "");
    setError("");
  }, []);

  const handleActiveChange = useCallback(
    (event) => setIsActive(event.target.checked),
    [],
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (submitting) return;

      const trimmedName = name.trim();

      if (!trimmedName) {
        setError("Category name is required.");
        return;
      }

      // Validate the parent again before sending the request.
      if (
        parentId &&
        !availableParents.some((item) => String(item._id) === parentId)
      ) {
        setError(
          "Choose an active parent category or select None for a top-level category.",
        );
        return;
      }

      setSubmitting(true);
      setError("");

      try {
        const categoryData = {
          name: trimmedName,
          parent: parentId || null,
        };

        if (isEditing) {
          categoryData.isActive = isActive;
        }

        const response = isEditing
          ? await updateCategory(category._id, categoryData)
          : await createCategory(categoryData);

        onSaved?.(response.category, isEditing);
        onClose?.();
      } catch (error) {
        console.error("Save Category Error:", error);

        setError(
          error?.response?.data?.message ||
            "Unable to save this category. Please try again.",
        );
      } finally {
        setSubmitting(false);
      }
    },
    [
      submitting,
      name,
      parentId,
      availableParents,
      isEditing,
      isActive,
      category,
      onSaved,
      onClose,
    ],
  );

  return {
    isEditing,

    name,
    parentId,
    isActive,
    submitting,
    error,
    availableParents,

    setError,
    handleNameChange,
    handleParentChange,
    handleActiveChange,
    handleSubmit,
  };
}

export default useCategoryForm;
