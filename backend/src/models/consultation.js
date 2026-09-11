import mongoose from "mongoose";

const consultationBookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
    },

    /**
     * Service / Appointment
     */
    selectedService: {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ["Care Plan", "Testing Panel"],
        required: true,
      },
      price: {
        type: String,
        required: true,
      },
    },

    appointmentType: {
      type: String,
      enum: ["virtual", "physical"],
      required: true,
    },

    appointmentDate: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },

    appointmentTime: {
      type: String,
      required: true,
    },

    /**
     * Patient Information
     */
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
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

    ageBracket: {
      type: String,
      enum: ["under-18", "18-24", "25-34", "35-44", "45-54", "55-64", "65+"],
      required: true,
    },

    gender: {
      type: String,
      enum: ["female", "male", "prefer-not-to-say"],
      required: true,
    },

    /**
     * Clinical Information
     */
    primaryConcern: {
      type: String,
      required: true,
      trim: true,
    },

    currentMedications: {
      type: String,
      default: "",
      trim: true,
    },

    existingConditions: {
      type: String,
      default: "",
      trim: true,
    },

    /**
     * Referral
     */
    referralSource: {
      type: String,
      enum: [
        "Social Media (Instagram/Snapchat)",
        "Friend or Family Referral",
        "Doctor or Healthcare Professional",
        "Google Search",
        "Other",
      ],
      default: "Other",
    },

    referralCode: {
      type: String,
      default: "",
      trim: true,
    },

    /**
     * Consent
     */
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
      enum: ["pending", "contacted", "confirmed", "completed", "cancelled"],
      default: "pending",
    },

    isSlotActive: {
      type: Boolean,
      default: true,
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

consultationBookingSchema.index(
  {
    appointmentDate: 1,
    appointmentTime: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      isSlotActive: true,
    },
  },
);

const ConsultationBooking =
  mongoose.models.ConsultationBooking ||
  mongoose.model("ConsultationBooking", consultationBookingSchema);

export default ConsultationBooking;
