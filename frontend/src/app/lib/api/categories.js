import server from "../axiosClient";

/**
 * GET CATEGORIES - PUBLIC
 */
export async function getCategories() {
  const response = await server.get("/api/get-categories");

  return response.data;
}

/**
 * GET CATEGORIES - ADMIN
 */
export async function getCategoriesAdmin() {
  const response = await server.get("/api/get-categories-admin");

  return response.data;
}

/**
 * GET ONE CATEGORY - ADMIN
 */
export async function getCategoryAdmin(id) {
  const response = await server.get(
    `/api/get-category-admin/${encodeURIComponent(id)}`,
  );

  return response.data;
}

/**
 * CREATE CATEGORY
 */
export async function createCategory(categoryData) {
  const response = await server.post("/api/create-category", categoryData);

  return response.data;
}

/**
 * UPDATE CATEGORY
 */
export async function updateCategory(id, categoryData) {
  const response = await server.patch(
    `/api/update-category/${encodeURIComponent(id)}`,
    categoryData,
  );

  return response.data;
}

/**
 * DELETE CATEGORY
 */
export async function deleteCategory(id) {
  const response = await server.delete(
    `/api/delete-category/${encodeURIComponent(id)}`,
  );

  return response.data;
}
