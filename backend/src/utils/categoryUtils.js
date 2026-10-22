import Category from "../models/category.js";
import throwError from "./throwError.js";

export async function getCategoryTreeIds(slug) {
  const normalizedSlug = slug.trim().toLowerCase();

  const category = await Category.findOne({
    slug: normalizedSlug,
    isActive: true,
  }).select("_id");

  if (!category) {
    return null;
  }

  const categoryIds = [category._id];

  // Categories whose children we need to find
  let parentIds = [category._id];

  // Prevent duplicates
  const includedIds = new Set([category._id.toString()]);

  while (parentIds.length > 0) {
    const children = await Category.find({
      parent: { $in: parentIds },
      isActive: true,
    }).select("_id");

    if (children.length === 0) {
      break;
    }

    const nextParentIds = [];

    for (const child of children) {
      const childId = child._id.toString();

      if (includedIds.has(childId)) {
        continue;
      }

      includedIds.add(childId);
      categoryIds.push(child._id);
      nextParentIds.push(child._id);
    }

    parentIds = nextParentIds;
  }

  return categoryIds;
}

export function buildCategoryTree(categories = []) {
  const categoryMap = new Map();
  const roots = [];

  // Create all nodes first
  for (const category of categories) {
    categoryMap.set(category._id.toString(), {
      _id: category._id,
      name: category.name,
      slug: category.slug,
      parent: category.parent,
      ...(category.isActive !== undefined && {
        isActive: category.isActive,
      }),
      ...(category.createdAt && {
        createdAt: category.createdAt,
      }),
      ...(category.updatedAt && {
        updatedAt: category.updatedAt,
      }),
      children: [],
    });
  }

  // Then connect children to their parents.
  for (const category of categoryMap.values()) {
    if (!category.parent) {
      roots.push(category);
      continue;
    }

    const parent = categoryMap.get(category.parent.toString());

    if (parent) {
      parent.children.push(category);
    }
  }

  return roots;
}

/**
 * Return a category and all of its descendants for category-based admin filtering.
 * Includes inactive descendants as well so admin results can still find products
 * assigned to a category that has since been deactivated.
 */
export async function getCategoryBranchIds(categoryId) {
  const rootCategory = await Category.findById(categoryId).select("_id").lean();

  if (!rootCategory) {
    throwError("Category not found", 404);
  }

  const categoryIds = [rootCategory._id];
  const visited = new Set([String(rootCategory._id)]);
  let currentLevel = [rootCategory._id];

  while (currentLevel.length > 0) {
    const children = await Category.find({
      parent: { $in: currentLevel },
    })
      .select("_id")
      .lean();

    const nextLevel = [];

    for (const child of children) {
      const childId = String(child._id);
      if (visited.has(childId)) continue;

      visited.add(childId);
      categoryIds.push(child._id);
      nextLevel.push(child._id);
    }

    currentLevel = nextLevel;
  }

  return categoryIds;
}
