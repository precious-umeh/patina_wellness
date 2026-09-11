const TOPIC_LABELS = {
  general: "General Inquiry",
  consultation: "Consultation",
  testing: "Testing Panels",
  membership: "Membership",
};

/**
 * Format Inquiry Topic
 */
export const formatInquiryTopic = function (topic) {
  return TOPIC_LABELS[topic] || topic || "-";
};
