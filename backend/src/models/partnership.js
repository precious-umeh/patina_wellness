import mongoose from "mongoose";

const partnershipApplicationSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: true,
      unique: true,
    },

    partnershipType: {
      type: String,
      enum: ["corporate", "practitioner", "ambassador"],
      required: true,
    },

    /**
     * Contact Info
     */
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    /**
     * Corporate Partnership
     */
    organisationName: {
      type: String,
      default: "",
      trim: true,
    },

    industry: {
      type: String,
      default: "",
      trim: true,
    },

    companySize: {
      type: String,
      enum: [
        "1 - 15 employees",
        "16 - 50 employees",
        "51 - 200 employees",
        "201 - 500 employees",
        "500+ employees",
      ],
      default: undefined,
    },

    /**
     * Practitioner Partnership
     */
    areaOfSpecialty: {
      type: String,
      default: "",
      trim: true,
    },

    /**
     * Practitioner / Ambassador
     */
    websiteOrSocial: {
      type: String,
      default: "",
      trim: true,
    },

    /**
     * Shared
     */
    partnershipGoals: {
      type: String,
      required: true,
      trim: true,
    },

    preferredContactMethod: {
      type: String,
      enum: ["Email", "WhatsApp", "Phone Call"],
      required: true,
    },

    consent: {
      type: Boolean,
      required: true,
      validate: {
        validator: (value) => value === true,
        message: "Consent is required",
      },
    },

    /**
     * Admin Management
     */
    status: {
      type: String,
      enum: ["new", "contacted", "in-review", "approved", "rejected", "closed"],
      default: "new",
    },

    adminNotes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const PartnershipApplication =
  mongoose.models.PartnershipApplication ||
  mongoose.model("PartnershipApplication", partnershipApplicationSchema);

export default PartnershipApplication;
