import mongoose from "mongoose";
import Product from "../models/product.js";
import Category from "../models/category.js";
import throwError from "../utils/throwError.js";
import { deleteFromCloudinary } from "../middlewares/fileUpload.js";
import {
  buildProductImages,
  cleanupProductImages,
  cleanupUploadedImages,
} from "../utils/productImages.js";
import { getCategoryTreeIds } from "../utils/categoryUtils.js";
import { escapeRegex } from "../utils/regexUtils.js";
import {
  buildPaginationMeta,
  getPaginationParams,
} from "../utils/paginationUtils.js";

/**
 * ============================================
 * CREATE PRODUCT
 * ============================================
 */
export async function createProduct(req, res) {
  const uploadedFiles = req.files || [];

  try {
    const { name, description, price, stock, categories } = req.body;

    // build product image objects from cloudinary uploads
    const images = buildProductImages(uploadedFiles);

    // Validate required fields
    if (!name || !description) {
      throwError("Name and description are required", 400);
    }

    if (images.length === 0) {
      throwError("At least one product image is required", 400);
    }

    // Parse categories
    let parsedCategories;

    try {
      parsedCategories =
        typeof categories === "string" ? JSON.parse(categories) : categories;
    } catch {
      throwError("Invalid categories format", 400);
    }

    // make sure categories is a non-empty array
    if (!Array.isArray(parsedCategories) || parsedCategories.length === 0) {
      throwError("At least one category is required", 400);
    }

    parsedCategories = [...new Set(parsedCategories)];

    // validate category IDs
    const invalidCategory = parsedCategories.some(
      (categoryId) => !mongoose.isValidObjectId(categoryId),
    );

    if (invalidCategory) {
      throwError("One or more category IDs are invalid", 400);
    }

    // make sure categories actually exist
    const existingCategories = await Category.find({
      _id: { $in: parsedCategories },
    });

    if (existingCategories.length !== parsedCategories.length) {
      throwError("One or more categories are invalid", 400);
    }

    // validate and convert numeric fields
    if (price === undefined || price === "") {
      throwError("Price is required", 400);
    }

    if (stock === undefined || stock === "") {
      throwError("Stock is required", 400);
    }

    const productPrice = Number(price);
    const productStock = Number(stock);

    if (!Number.isFinite(productPrice) || productPrice < 0) {
      throwError("Price must be a valid number", 400);
    }

    if (
      !Number.isFinite(productStock) ||
      !Number.isInteger(productStock) ||
      productStock < 0
    ) {
      throwError("Stock must be a valid non-negative number", 400);
    }

    const product = await Product.create({
      name,
      description,
      price: productPrice,
      stock: productStock,
      categories: parsedCategories,
      images,
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);

    await cleanupUploadedImages(uploadedFiles);

    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Failed to create product",
    });
  }
}

/**
 * ============================================
 * GET PRODUCTS - PUBLIC
 * ============================================
 */
export async function getProducts(req, res) {
  try {
    const { search, category, sort = "newest", minPrice, maxPrice } = req.query;

    const { page, limit, skip } = getPaginationParams(req.query, {
      defaultLimit: 20,
      maxLimit: 20,
    });

    const query = {
      isActive: true,
    };

    // Search
    if (search !== undefined) {
      const searchTerm = search.trim();

      if (searchTerm) {
        const searchRegex = new RegExp(escapeRegex(searchTerm), "i");

        query.$or = [{ name: searchRegex }, { description: searchRegex }];
      }
    }

    // Category filter
    if (category !== undefined) {
      const categorySlugs = category
        .split(",")
        .map((slug) => slug.trim().toLowerCase())
        .filter(Boolean);

      if (categorySlugs.length === 0) {
        throwError("Invalid category filter", 400);
      }

      const categoryTrees = await Promise.all(
        categorySlugs.map((slug) => getCategoryTreeIds(slug)),
      );

      const categoryNotFound = categoryTrees.some((tree) => tree === null);

      if (categoryNotFound) {
        throwError("One or more categories not found", 404);
      }

      const uniqueCategoryIds = new Map();

      for (const categoryTree of categoryTrees) {
        for (const categoryId of categoryTree) {
          uniqueCategoryIds.set(categoryId.toString(), categoryId);
        }
      }

      query.categories = {
        $in: [...uniqueCategoryIds.values()],
      };
    }

    // Price Filter
    let parsedMinPrice;
    let parsedMaxPrice;

    if (minPrice !== undefined) {
      parsedMinPrice = Number(minPrice);

      if (!Number.isFinite(parsedMinPrice) || parsedMinPrice < 0) {
        throwError("minPrice must be a valid non-negative number", 400);
      }
    }

    if (maxPrice !== undefined) {
      parsedMaxPrice = Number(maxPrice);

      if (!Number.isFinite(parsedMaxPrice) || parsedMaxPrice < 0) {
        throwError("maxPrice must be a valid non-negative number", 400);
      }
    }

    if (
      parsedMinPrice !== undefined &&
      parsedMaxPrice !== undefined &&
      parsedMinPrice > parsedMaxPrice
    ) {
      throwError("minPrice cannot be greater than maxPrice", 400);
    }

    if (parsedMinPrice !== undefined || parsedMaxPrice !== undefined) {
      query.price = {};

      if (parsedMinPrice !== undefined) {
        query.price.$gte = parsedMinPrice;
      }

      if (parsedMaxPrice !== undefined) {
        query.price.$lte = parsedMaxPrice;
      }
    }

    // Sorting
    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      name_asc: { name: 1 },
      name_desc: { name: -1 },
    };

    if (!sortOptions[sort]) {
      throwError("Invalid sort option", 400);
    }

    const [products, totalProducts] = await Promise.all([
      Product.find(query)
        .sort(sortOptions[sort])
        .skip(skip)
        .limit(limit)
        .select("name slug description price stock images categories")
        .populate("categories", "name slug parent"),

      Product.countDocuments(query),
    ]);

    return res.status(200).json({
      message: "Products retrieved successfully",
      products,
      pagination: buildPaginationMeta(
        page,
        limit,
        totalProducts,
        "totalProducts",
      ),
      filters: {
        search: search?.trim() || null,
        category: category || null,
        sort,
        minPrice: parsedMinPrice ?? null,
        maxPrice: parsedMaxPrice ?? null,
      },
    });
  } catch (error) {
    console.error("Get Public Products Error:", error);

    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Failed to retrieve products",
    });
  }
}

/**
 * ============================================
 * GET PRODUCT - PUBLIC
 * ============================================
 */
export async function getProduct(req, res) {
  try {
    const { slug } = req.params;

    if (!slug || !slug.trim()) {
      throwError("Product slug is required", 400);
    }

    const product = await Product.findOne({
      slug: slug.trim().toLowerCase(),
      isActive: true,
    })
      .select("name slug description price stock images categories")
      .populate("categories", "name slug parent");

    if (!product) {
      throwError("Product not found", 404);
    }

    return res.status(200).json({
      message: "Product retrieved successfully",
      product,
    });
  } catch (error) {
    console.error("Get Public Product Error:", error);

    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Failed to retrieve product",
    });
  }
}

/**
 * ============================================
 * GET PRODUCTS - ADMIN
 * ============================================
 */
export async function getProductsAdmin(req, res) {
  try {
    const { category, isActive: active, search } = req.query;

    const { page, limit, skip } = getPaginationParams(req.query, {
      defaultLimit: 20,
      maxLimit: 20,
    });

    const query = {};

    // Active status filter
    if (active === "true") {
      query.isActive = true;
    } else if (active === "false") {
      query.isActive = false;
    } else if (
      active !== undefined &&
      active !== "true" &&
      active !== "false"
    ) {
      throwError("isActive must be either true or false", 400);
    }

    // Category filter
    if (category !== undefined) {
      if (!mongoose.isValidObjectId(category)) {
        throwError("Invalid category ID", 400);
      }

      query.categories = category;
    }

    // Search
    if (search !== undefined) {
      const searchTerm = search.trim();

      if (searchTerm) {
        const searchRegex = new RegExp(escapeRegex(searchTerm), "i");

        query.$or = [
          { name: searchRegex },
          { description: searchRegex },
          { slug: searchRegex },
        ];
      }
    }

    const [products, totalProducts] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("categories", "name slug parent"),

      Product.countDocuments(query),
    ]);

    return res.status(200).json({
      message: "Products retrieved successfully",
      products,
      pagination: buildPaginationMeta(
        page,
        limit,
        totalProducts,
        "totalProducts",
      ),
      filters: {
        search: search?.trim() || null,
        category: category || null,
        isActive: active === "true" ? true : active === "false" ? false : null,
      },
    });
  } catch (error) {
    console.error("Get Products Error:", error);

    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Failed to retrieve products",
    });
  }
}

/**
 * ============================================
 * GET PRODUCT ADMIN
 * ============================================
 */
export async function getProductAdmin(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throwError("Invalid product ID", 400);
    }

    const product = await Product.findById(id).populate(
      "categories",
      "name slug parent",
    );

    if (!product) {
      throwError("Product not found", 404);
    }

    return res.status(200).json({
      message: "Product retrieved successfully",
      product,
    });
  } catch (error) {
    console.error("Get Product Error:", error);

    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Failed to retrieve product",
    });
  }
}

/**
 * ============================================
 * UPDATE PRODUCT
 * ============================================
 */
export async function updateProduct(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throwError("Invalid product ID", 400);
    }

    const product = await Product.findById(id);

    if (!product) {
      throwError("Product not found", 404);
    }

    const { name, description, price, stock, categories, isActive } = req.body;

    // update name
    if (name !== undefined) {
      if (!name.trim()) {
        throwError("Product name cannot be empty", 400);
      }

      product.name = name.trim();
    }

    // update description
    if (description !== undefined) {
      if (!description.trim()) {
        throwError("Product description cannot be empty", 400);
      }

      product.description = description.trim();
    }

    // update price
    if (price !== undefined) {
      if (price === "") {
        throwError("Price cannot be empty", 400);
      }

      const productPrice = Number(price);

      if (!Number.isFinite(productPrice) || productPrice < 0) {
        throwError("Price must be a valid number", 400);
      }

      product.price = productPrice;
    }

    // update stock
    if (stock !== undefined) {
      if (stock === "") {
        throwError("Stock cannot be empty", 400);
      }

      const productStock = Number(stock);

      if (
        !Number.isFinite(productStock) ||
        !Number.isInteger(productStock) ||
        productStock < 0
      ) {
        throwError("Stock must be a valid non-negative integer", 400);
      }

      product.stock = productStock;
    }

    // update categories
    if (categories !== undefined) {
      let parsedCategories;

      try {
        parsedCategories =
          typeof categories === "string" ? JSON.parse(categories) : categories;
      } catch {
        throwError("Invalid categories format", 400);
      }

      if (!Array.isArray(parsedCategories) || parsedCategories.length === 0) {
        throwError("At least one category is required", 400);
      }

      parsedCategories = [...new Set(parsedCategories)];

      const invalidCategory = parsedCategories.some(
        (categoryId) => !mongoose.isValidObjectId(categoryId),
      );

      if (invalidCategory) {
        throwError("One or more category IDs are invalid", 400);
      }

      const existingCategories = await Category.find({
        _id: { $in: parsedCategories },
      });

      if (existingCategories.length !== parsedCategories.length) {
        throwError("One or more categories are invalid", 400);
      }

      product.categories = parsedCategories;
    }

    // update active status
    if (isActive !== undefined) {
      if (
        isActive !== true &&
        isActive !== false &&
        isActive !== "true" &&
        isActive !== "false"
      ) {
        throwError("isActive must be either true or false", 400);
      }

      product.isActive = isActive === true || isActive === "true";
    }

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);

    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Failed to update product",
    });
  }
}

/**
 * ============================================
 * ADD PRODUCT IMAGES
 * ============================================
 */
export async function addProductImages(req, res) {
  const uploadedFiles = req.files || [];

  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throwError("Invalid product ID", 400);
    }

    if (uploadedFiles.length === 0) {
      throwError("At least one image is required", 400);
    }

    const product = await Product.findById(id);

    if (!product) {
      throwError("Product not found", 404);
    }

    const newImages = buildProductImages(uploadedFiles);

    product.images.push(...newImages);

    await product.save();

    return res.status(200).json({
      message: "Product images added successfully",
      product,
    });
  } catch (error) {
    console.error("Add Product Images Error:", error);

    await cleanupUploadedImages(uploadedFiles);

    return res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : "Failed to add product images",
    });
  }
}

/**
 * ============================================
 * REPLACE PRODUCT IMAGES
 * ============================================
 */
export async function replaceProductImages(req, res) {
  const uploadedFiles = req.files || [];

  try {
    const { id } = req.params;
    const { imageIds } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      throwError("Invalid product ID", 400);
    }

    if (uploadedFiles.length === 0) {
      throwError("At least one replacement image is required", 400);
    }

    let parsedImageIds;

    try {
      parsedImageIds =
        typeof imageIds === "string" ? JSON.parse(imageIds) : imageIds;
    } catch {
      throwError("Invalid image IDs format", 400);
    }

    if (!Array.isArray(parsedImageIds) || parsedImageIds.length === 0) {
      throwError("imageIds must be a non-empty array", 400);
    }

    const uniqueImageIds = new Set(parsedImageIds);

    if (uniqueImageIds.size !== parsedImageIds.length) {
      throwError("Duplicate image IDs are not allowed", 400);
    }

    if (parsedImageIds.length !== uploadedFiles.length) {
      throwError(
        "The number of image IDs must match the number of uploaded images",
        400,
      );
    }

    const invalidImageId = parsedImageIds.some(
      (imageId) => !mongoose.isValidObjectId(imageId),
    );

    if (invalidImageId) {
      throwError("One or more image IDs are invalid", 400);
    }

    const product = await Product.findById(id);

    if (!product) {
      throwError("Product not found", 404);
    }

    const oldPublicIds = [];

    parsedImageIds.forEach((imageId, index) => {
      const image = product.images.id(imageId);

      if (!image) {
        throwError(`Image not found: ${imageId}`, 404);
      }

      oldPublicIds.push(image.publicId);

      image.url = uploadedFiles[index].cloudinaryUrl;
      image.publicId = uploadedFiles[index].cloudinaryPublicId;
    });

    await product.save();

    await Promise.all(
      oldPublicIds.map((publicId) => deleteFromCloudinary(publicId)),
    );

    return res.status(200).json({
      message: "Product images replaced successfully",
      product,
    });
  } catch (error) {
    console.error("Replace Product Images Error:", error);

    await cleanupUploadedImages(uploadedFiles);

    return res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : "Failed to replace product images",
    });
  }
}

/**
 * ============================================
 * DELETE PRODUCT IMAGES
 * ============================================
 */
export async function deleteProductImage(req, res) {
  try {
    const { id, imageId } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throwError("Invalid product ID", 400);
    }

    if (!mongoose.isValidObjectId(imageId)) {
      throwError("Invalid image ID", 400);
    }

    const product = await Product.findById(id);

    if (!product) {
      throwError("Product not found", 404);
    }

    const image = product.images.id(imageId);

    if (!image) {
      throwError("Image not found", 404);
    }

    if (product.images.length === 1) {
      throwError("A product must have at least one image", 400);
    }

    const publicId = image.publicId;

    image.deleteOne();

    await product.save();

    await deleteFromCloudinary(publicId);

    return res.status(200).json({
      message: "Product image deleted successfully",
      product,
    });
  } catch (error) {
    console.error("Delete Product Image Error:", error);

    return res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : "Failed to delete product image",
    });
  }
}

/**
 * ============================================
 * DELETE PRODUCT
 * ============================================
 */
export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      throwError("Invalid product ID", 400);
    }

    const product = await Product.findById(id);

    if (!product) {
      throwError("Product not found", 404);
    }

    // Keep the Cloudinary public IDs before deleting the product
    const productImages = product.images;

    await product.deleteOne();

    await cleanupProductImages(productImages);

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);

    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Failed to delete product",
    });
  }
}
