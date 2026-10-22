import server from "../axiosClient";

/**
 * GET PRODUCTS - PUBLIC
 */
export async function getProducts({
  page = 1,
  limit = 20,
  search = "",
  category = "",
  sort = "newest",
  minPrice,
  maxPrice,
  isFeatured,
} = {}) {
  const params = { page, limit, sort };

  if (search.trim()) {
    params.search = search.trim();
  }

  if (category) {
    params.category = category;
  }

  if (minPrice !== undefined && minPrice !== "") {
    params.minPrice = minPrice;
  }

  if (maxPrice !== undefined && maxPrice !== "") {
    params.maxPrice = maxPrice;
  }

  if (isFeatured !== undefined) {
    params.isFeatured = String(isFeatured);
  }

  const response = await server.get("/api/get-products", { params });

  return response.data;
}

/**
 * GET ONE PRODUCT - PUBLIC
 */
export async function getProduct(slug) {
  const response = await server.get(
    `/api/get-product/${encodeURIComponent(slug)}`,
  );

  return response.data;
}

/**
 * GET ONE PRODUCT BY ID - PUBLIC
 */
export async function getPublicProductById(id) {
  const response = await server.get(
    `/api/get-product-by-id/${encodeURIComponent(id)}`,
  );

  return response.data;
}

/**
 * GET PRODUCTS - ADMIN
 */
export async function getProductsAdmin(
  page = 1,
  limit = 20,
  search = "",
  category = "",
  isActive = "all",
) {
  const params = { page, limit, search };

  if (category) {
    params.category = category;
  }

  if (isActive === true || isActive === "true") {
    params.isActive = "true";
  } else if (isActive === false || isActive === "false") {
    params.isActive = "false";
  }

  const response = await server.get("/api/get-products-admin", { params });

  return response.data;
}

/**
 * GET ONE PRODUCT - ADMIN
 */
export async function getProductAdmin(id) {
  const response = await server.get(
    `/api/get-product-admin/${encodeURIComponent(id)}`,
  );

  return response.data;
}

/**
 * CREATE PRODUCT
 */
export async function createProduct(formData) {
  const response = await server.post("/api/create-product", formData);

  return response.data;
}

/**
 * UPDATE PRODUCT
 */
export async function updateProduct(id, productData) {
  const response = await server.patch(
    `/api/update-product/${encodeURIComponent(id)}`,
    productData,
  );

  return response.data;
}

/**
 * ADD PRODUCT IMAGES
 */
export async function addProductImages(id, formData) {
  const response = await server.post(
    `/api/add-product-images/${encodeURIComponent(id)}`,
    formData,
  );

  return response.data;
}

/**
 * REPLACE PRODUCT IMAGES
 * FormData must include "images" and "imageIds".
 * imageIds should be a JSON string array of image subdocument IDs.
 */
export async function replaceProductImages(id, formData) {
  const response = await server.patch(
    `/api/replace-product-images/${encodeURIComponent(id)}`,
    formData,
  );

  return response.data;
}

/**
 * DELETE ONE PRODUCT IMAGE
 */
export async function deleteProductImage(productId, imageId) {
  const response = await server.delete(
    `/api/delete-product-image/${encodeURIComponent(productId)}/${encodeURIComponent(imageId)}`,
  );

  return response.data;
}

/**
 * DELETE PRODUCT
 */
export async function deleteProduct(id) {
  const response = await server.delete(
    `/api/delete-product/${encodeURIComponent(id)}`,
  );

  return response.data;
}
