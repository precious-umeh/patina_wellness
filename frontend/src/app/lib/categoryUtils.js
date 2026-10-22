export function flattenCategoryTree(categories = [], depth = 0) {
  return categories.flatMap((category) => [
    {
      ...category,
      depth,
    },
    ...flattenCategoryTree(category.children || [], depth + 1),
  ]);
}

export function getParentId(parent) {
  if (!parent) return "";

  if (typeof parent === "object") {
    return String(parent._id || parent.id || "");
  }

  return String(parent);
}

export function buildCategoryTree(categories = []) {
  const categoryMap = new Map(
    categories.map((category) => [
      String(category._id),
      { ...category, children: [] },
    ]),
  );

  const roots = [];

  for (const category of categoryMap.values()) {
    const parentId = getParentId(category.parent);
    const parent = categoryMap.get(parentId);

    if (parent && String(parent._id) !== String(category._id)) {
      parent.children.push(category);
    } else {
      roots.push(category);
    }
  }

  return roots;
}
