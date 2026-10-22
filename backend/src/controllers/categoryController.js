import mongoose from "mongoose";
import Category from "../models/category.js";
import Product from "../models/product.js";

import throwError from "../utils/throwError.js";

import { buildCategoryTree } from "../utils/categoryUtils.js";

/**
 * ============================================
 * VALIDATE CATEGORY PARENT
 * ============================================
 */
async function validateCategoryParent(parentId, currentCategoryId = null) {
  // No parent means this is a top-level category.
  if (parentId === undefined || parentId === null || parentId === "") {
    return null;
  }

  if (!mongoose.isValidObjectId(parentId)) {
    throwError("Invalid parent category ID", 400);
  }

  const parentCategory = await Category.findById(parentId).select(
    "_id parent isActive",
  );

  if (!parentCategory) {
    throwError("Parent category not found", 404);
  }

  if (!parentCategory.isActive) {
    throwError("An inactive category cannot be used as a parent", 400);
  }

  // A category cannot be it own parent
  if (currentCategoryId && parentCategory._id.equals(currentCategoryId)) {
    throwError("A category cannot be its own parent", 400);
  }

  // Check whether the proposed parent is one of the current category's descendants.
  if (currentCategoryId) {
    const visited = new Set();
    let ancestorId = parentCategory.parent;

    while (ancestorId) {
      const ancestorIdString = ancestorId.toString();

      if (visited.has(ancestorIdString)) {
        break;
      }

      visited.add(ancestorIdString);

      if (ancestorId.equals(currentCategoryId)) {
        throwError(
          "A category cannot be moved under one of its descendants",
          400,
        );
      }

      const ancestor = await Category.findById(ancestorId).select("parent");

      if (!ancestor) {
        break;
      }

      ancestorId = ancestor.parent;
    }
  }

  return parentCategory._id;
}

/**
 * ============================================
 * CREATE CATEGORY
 * ============================================
 */
export async function createCategory(req, res) {
  try {
    const { name, parent } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      throwError("Category name is required", 400);
    }

    const parentId = await validateCategoryParent(parent);

    const category = await Category.create({
      name: name.trim(),
      parent: parentId,
    });

    return res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create Category Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "A category with this slug already exists",
      });
    }

    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "failed to create category",
    });
  }
}

/**
 * ============================================
 * GET CATEGORIES - PUBLIC
 * ============================================
 */
export async function getCategories(req, res) {
  try {
    const categories = await Category.find({
      isActive: true,
    })
      .select("name slug parent")
      .sort({ name: 1 })
      .lean();

    const categoryTree = buildCategoryTree(categories);

    return res.status(200).json({
      message: "Categories retrieved successfully",
      categories: categoryTree,
    });
  } catch (error) {
    console.error("Get Categories Error:", error);

    return res.status(500).json({
      message: "Failed to retrieve categories",
    });
  }
}

/**
 * ============================================
 * GET CATEGORIES - ADMIN
 * ============================================
 */
export async function getCategoriesAdmin(req, res) {
  try {
    const categories = await Category.find()
      .select("name slug parent isActive createdAt updatedAt")
      .sort({ name: 1 })
      .lean();

    const categoryTree = buildCategoryTree(categories);

    return res.status(200).json({
      message: "Categories retrieved successfully",
      categories: categoryTree,
    });
  } catch (error) {
    console.error("Get Categories Admin Error:", error);

    return res.status(500).json({
      message: "Failed to retrieve categories",
    });
  }
}

/**
 * ============================================
 * GET CATEGORY - ADMIN
 * ============================================
 */
export async function getCategoryAdmin(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throwError("Invalid category ID", 400);
    }

    const category = await Category.findById(id)
      .populate("parent", "name slug")
      .select("name slug parent isActive createdAt updatedAt");

    if (!category) {
      throwError("Category not found", 404);
    }

    return res.status(200).json({
      message: "Category retrieved successfully",
      category,
    });
  } catch (error) {
    console.error("Get Category Error:", error);

    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Failed to retrieve category",
    });
  }
}

/**
 * ============================================
 * UPDATE CATEGORY
 * ============================================
 */
export async function updateCategory(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throwError("Invalid category ID", 400);
    }

    const category = await Category.findById(id);

    if (!category) {
      throwError("Category not found", 404);
    }

    const { name, parent, isActive } = req.body;

    // Update name
    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        throwError("Category name cannot be empty", 400);
      }

      category.name = name.trim();
    }

    // Update parent
    if (parent !== undefined) {
      const parentId = await validateCategoryParent(parent, category._id);

      category.parent = parentId;
    }

    // Update active status
    if (isActive !== undefined) {
      if (
        isActive !== true &&
        isActive !== false &&
        isActive !== "true" &&
        isActive !== "false"
      ) {
        throwError("isActive must be either true or false", 400);
      }

      const newActiveStatus = isActive === true || isActive === "true";

      // Prevent active children from being left under an inactive parent
      // Dont deactivate a parent while it has active children
      if (!newActiveStatus && category.isActive) {
        const activeChild = await Category.exists({
          parent: category._id,
          isActive: true,
        });

        if (activeChild) {
          throwError(
            "Deactivate the subcategories before deactivating this category",
            409,
          );
        }
      }

      category.isActive = newActiveStatus;
    }

    await category.save();

    return res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update Category Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "A category with this slug already exists",
      });
    }

    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Failed to update category",
    });
  }
}

/**
 * ============================================
 * DELETE CATEGORY
 * ============================================
 */
export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throwError("Invalid category ID", 400);
    }

    const category = await Category.findById(id);

    if (!category) {
      throwError("Category not found", 404);
    }

    // Do not delete a category that still has children
    const hasChildren = await Category.exists({
      parent: category._id,
    });

    if (hasChildren) {
      throwError("Cannot delete a category with subcategories", 409);
    }

    // Do not a category currently used by products
    const hasProducts = await Product.exists({
      categories: category._id,
    });

    if (hasProducts) {
      throwError("Cannot delete a category assigned to products", 409);
    }

    await category.deleteOne();

    return res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete Category Error:", error);

    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Failed to delete category",
    });
  }
}
