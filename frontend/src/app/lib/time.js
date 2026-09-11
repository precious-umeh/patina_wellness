/**
 * Convert 24-hour time to 12-hour time.
 */
export function formatTime12Hour(time) {
  if (!time) return "";

  const [hours, minutes] = time.split(":").map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return "";
  }

  const period = hours >= 12 ? "PM" : "AM";

  const hour12 = hours % 12 || 12;

  return `${String(hour12).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )} ${period}`;
}

/**
 * Convert 12-hour time to 24-hour time.
 */
export function formatTime24Hour(time) {
  if (!time) return "";

  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match) return "";

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();

  if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
    return "";
  }

  if (period === "AM") {
    if (hours === 12) hours = 0;
  } else {
    if (hours !== 12) hours += 12;
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )}`;
}

/**
 * Format time.
 */
export const formatTime = function (date) {
  if (!date) return "";

  const formattedDate = new Date(date);

  if (Number.isNaN(formattedDate.getTime())) return "";

  const hours = String(formattedDate.getHours()).padStart(2, "0");
  const minutes = String(formattedDate.getMinutes()).padStart(2, "0");

  return formatTime12Hour(`${hours}:${minutes}`);
};
