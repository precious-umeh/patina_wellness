import server from "../axiosClient";

/**
 * Get general settings
 */
export async function getGeneralSettings() {
  const response = await server.get("/api/get-general-settings");

  return response.data;
}

/**
 * Get public site settings
 */
export async function getPublicSiteSettings() {
  const response = await server.get("/api/get-public-site-settings");

  return response.data;
}

/**
 * Update general settings
 */
export async function updateGeneralSettings(data) {
  const response = await server.patch("/api/update-general-settings", data);

  return response.data;
}
