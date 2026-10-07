import express from "express";
import {
  addProductImages,
  createProduct,
  deleteProduct,
  deleteProductImage,
  getProduct,
  getProductAdmin,
  getProducts,
  getProductsAdmin,
  replaceProductImages,
  updateProduct,
} from "../controllers/productController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import upload, { uploadToCloudinary } from "../middlewares/fileUpload.js";

const router = express.Router();
/**
 * ============================================
 * PUBLIC
 * ============================================
 */

router.get("/get-products", getProducts);
router.get("/get-product/:slug", getProduct);

/**
 * ============================================
 * ADMIN
 * ============================================
 */

router.post(
  "/create-product",
  authMiddleware,
  upload.array("images"),
  uploadToCloudinary("products"),
  createProduct,
);

router.get("/get-products-admin", authMiddleware, getProductsAdmin);

router.get("/get-product-admin/:id", authMiddleware, getProductAdmin);

router.patch("update-product/:id", authMiddleware, updateProduct);

// Add one or multiple product images
router.post(
  "/add-product-images/:id",
  authMiddleware,
  upload.array("images"),
  uploadToCloudinary("products"),
  addProductImages,
);

// Replace one or multiple existing product images
router.patch(
  "/replace-product-images/:id",
  authMiddleware,
  upload.array("images"),
  uploadToCloudinary("products"),
  replaceProductImages,
);

// Delete one product image
router.delete(
  "/delete-product-image/:id/:imageId",
  authMiddleware,
  deleteProductImage,
);

// Delete Product
router.delete("/delete-product/:id", authMiddleware, deleteProduct);

export default router;
