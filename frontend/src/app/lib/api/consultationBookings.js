import server from "../axiosClient";

/**
 * Get all consultation bookings
 */
export async function getBookings(
  page = 1,
  limit = 20,
  search = "",
  status = "all",
) {
  const response = await server.get("/api/get-bookings", {
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
 * Get all pending consultation bookings
 */
export async function getPendingBookings(limit = 10) {
  const response = await server.get("/api/get-pending-bookings", {
    params: { limit },
  });

  return response.data;
}

/**
 * Update a consultation booking
 */
export async function updateBooking(bookingId, data) {
  const response = await server.patch(`/api/update-booking/${bookingId}`, data);

  return response.data.booking;
}

/**
 * Delete a consultation booking
 */
export async function deleteBooking(bookingId) {
  const response = await server.delete(`/api/delete-booking/${bookingId}`);

  return response.data;
}
