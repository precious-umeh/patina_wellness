import server from "../axiosClient";

/**
 * Get all blocked consultation dates
 */
export async function getBlockedDates() {
  const response = await server.get("/api/get-consultation-blocked-dates");

  return response.data.blockedDates || [];
}

/**
 * Get a single blocked consultation date
 */
export async function getBlockedDate(id) {
  const response = await server.get(`/api/get-consultation-blocked-date/${id}`);

  return response.data.blockedDate;
}

/**
 * Create a blocked consultation date
 */
export async function createBlockedDate(data) {
  const response = await server.post(
    "/api/create-consultation-blocked-date",
    data,
  );

  return response.data.blockedDate;
}

/**
 * Update a blocked consultation date
 */
export async function updateBlockedDate(id, data) {
  const response = await server.patch(
    `/api/update-consultation-blocked-date/${id}`,
    data,
  );

  return response.data.blockedDate;
}

/**
 * Delete a blocked consultation date
 */
export async function deleteBlockedDate(id) {
  const response = await server.delete(
    `/api/delete-consultation-blocked-date/${id}`,
  );

  return response.data;
}
