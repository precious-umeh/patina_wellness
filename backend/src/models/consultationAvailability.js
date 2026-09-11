import mongoose from "mongoose";

const consultationAvailabilitySchema = new mongoose.Schema(
  {
    workingDays: [
      {
        type: String,
        enum: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
      },
    ],

    timeSlots: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const ConsultationAvailability =
  mongoose.models.ConsultationAvailability ||
  mongoose.model("ConsultationAvailability", consultationAvailabilitySchema);

export default ConsultationAvailability;
