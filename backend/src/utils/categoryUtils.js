import Category from "../models/category.js";

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
