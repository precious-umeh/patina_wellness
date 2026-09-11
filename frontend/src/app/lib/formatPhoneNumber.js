export function formatPhoneNumber(phoneNumber) {
  if (!phoneNumber) return "";

  const digits = phoneNumber.replace(/\D/g, "");

  // Nigeria: +2349168260622 → +234 (0) 916 826 0622
  if (digits.startsWith("234") && digits.length === 13) {
    const localNumber = digits.slice(3);

    return `+234 (0) ${localNumber.slice(0, 3)} ${localNumber.slice(
      3,
      6,
    )} ${localNumber.slice(6)}`;
  }

  // Return the original value if it doesn't match the expected format.
  return phoneNumber;
}

export function formatWhatsAppNumber(phoneNumber) {
  return phoneNumber.replace(/\D/g, "");
}
