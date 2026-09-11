import server from "../axiosClient";

/**
 * ============================================
 * CREATE INQUIRY
 * ============================================
 */
export async function createInquiry(data) {
  const response = await server.post("/api/create-inquiry", data);

  return response.data;
}

/**
 * ============================================
 * GET ALL INQUIRIES
 * ============================================
 */
export async function getInquiries(
  page = 1,
  limit = 20,
  search = "",
  status = "all",
) {
  const response = await server.get("/api/get-inquiries", {
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
 * GET NEW INQUIRIES
 * ============================================
 */
export async function getNewInquiries(limit = 10) {
  const response = await server.get("/api/get-new-inquiries", {
    params: { limit },
  });

  return response.data;
}

/**
 * ============================================
 * GET SINGLE INQUIRY
 * ============================================
 */
export async function getInquiry(inquiryId) {
  const response = await server.get(`/api/get-inquiry/${inquiryId}`);

  return response.data.inquiry;
}

/**
 * ============================================
 * UPDATE INQUIRY
 * ============================================
 */
export async function updateInquiry(inquiryId, data) {
  const response = await server.patch(`/api/update-inquiry/${inquiryId}`, data);

  return response.data.inquiry;
}

/**
 * ============================================
 * DELETE INQUIRY
 * ============================================
 */
export async function deleteInquiry(inquiryId) {
  const response = await server.delete(`/api/delete-inquiry/${inquiryId}`);

  return response.data;
}
