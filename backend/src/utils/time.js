export function isSlotInThePast(date, timeSlot) {
  const now = new Date();

  const nigeriaDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lagos",
  }).format(now);

  // If the selected date is not today, the time doesn't need checking.
  if (date !== nigeriaDate) {
    return false;
  }

  const nigeriaTime = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Lagos",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);

  const [hours, minutes] = nigeriaTime.split(":").map(Number);

  const [time, period] = timeSlot.split(" ");
  const [slotHours, slotMinutes] = time.split(":").map(Number);

  let slotHour = slotHours;

  if (period === "PM" && slotHour !== 12) {
    slotHour += 12;
  }

  if (period === "AM" && slotHour === 12) {
    slotHour = 0;
  }

  const currentMinutes = hours * 60 + minutes;
  const slotMinutesTotal = slotHour * 60 + slotMinutes;

  return slotMinutesTotal <= currentMinutes;
}
