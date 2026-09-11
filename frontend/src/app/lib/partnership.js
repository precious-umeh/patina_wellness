export const formatPartnershipType = function (type) {
  const types = {
    corporate: "Corporate Partnership",
    practitioner: "Practitioner Partnership",
    ambassador: "Brand Ambassador",
  };

  return types[type] || "-";
};
