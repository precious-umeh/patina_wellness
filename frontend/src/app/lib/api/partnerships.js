import server from "../axiosClient";

/**
 * ============================================
 * CREATE PARTNERSHIP
 * ============================================
 */
export async function createPartnership(data) {
  const response = await server.post("/api/create-partnership", data);

  return response.data;
}

/**
 * ============================================
 * GET ALL PARTNERSHIPS
 * ============================================
 */
export async function getPartnerships(
  page = 1,
  limit = 20,
  search = "",
  status = "all",
) {
  const response = await server.get("/api/get-partnerships", {
    params: {
      page,
      limit,
      search,
      status,
    },
  });

  return response.data;
}

/**
 * ============================================
 * GET NEW PARTNERSHIPS
 * ============================================
 */
export async function getNewPartnerships(limit = 10) {
  const response = await server.get("/api/get-new-partnerships", {
    params: { limit },
  });

  return response.data;
}

/**
 * ============================================
 * GET SINGLE PARTNERSHIP
 * ============================================
 */
export async function getPartnership(partnershipId) {
  const response = await server.get(`/api/get-partnership/${partnershipId}`);

  return response.data.application;
}

/**
 * ============================================
 * UPDATE PARTNERSHIP
 * ============================================
 */
export async function updatePartnership(partnershipId, data) {
  const response = await server.patch(
    `/api/update-partnership/${partnershipId}`,
    data,
  );

  return response.data.application;
}

/**
 * ============================================
 * DELETE PARTNERSHIP
 * ============================================
 */
export async function deletePartnership(partnershipId) {
  const response = await server.delete(
    `/api/delete-partnership/${partnershipId}`,
  );

  return response.data;
}
