import server from "../axiosClient";

/**
 * Get consultation availability configuration
 */
export async function getAvailability() {
  const response = await server.get("/api/get-consultation-availability");

  return response.data.availability;
}

/**
 * Update consultation availability configuration
 */
export async function updateAvailability(data) {
  const response = await server.patch(
    "/api/update-consultation-availability",
    data,
  );

  return response.data.availability;
}

/**
 * Get available slots for a specific date
 *
 * This endpoint is public and is used by
 * the customer booking form.
 */
export async function getAvailableSlots(date) {
  const response = await server.get("/api/get-consultation-available-slots", {
    params: { date },
  });

  return response.data;
}
