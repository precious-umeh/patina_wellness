import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoriesAdmin,
  getCategoryAdmin,
  updateCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

/**
 * ============================================
 * PUBLIC
 * ============================================
 */

// Get active categories as a nested tree
router.get("/get-categories", getCategories);

/**
 * ============================================
 * ADMIN
 * ============================================
 */

// Create a category or subcategory
router.post("/create-category", authMiddleware, createCategory);

// Get all categories, including inactive categories
router.get("/get-categories-admin", authMiddleware, getCategoriesAdmin);

// Get one category
router.get("/get-category-admin/:id", authMiddleware, getCategoryAdmin);

// Update category name, parent, or active status
router.patch("/update-category/:id", authMiddleware, updateCategory);

// delete a category
router.delete("/delete-category/:id", authMiddleware, deleteCategory);

export default router;
