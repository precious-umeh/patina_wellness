import mongoose from "mongoose";

const consultationBlockedDateSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      unique: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },

    reason: {
      type: String,
      default: "",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const ConsultationBlockedDate =
  mongoose.models.ConsultationBlockedDate ||
  mongoose.model("ConsultationBlockedDate", consultationBlockedDateSchema);

export default ConsultationBlockedDate;
