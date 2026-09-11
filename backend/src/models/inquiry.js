import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    inquiryId: {
      type: String,
      required: true,
      unique: true,
    },

    /**
     * Contact Information
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

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    /**
     * Inquiry
     */
    topic: {
      type: String,
      enum: ["general", "consultation", "testing", "membership"],
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    /**
     * Admin Management
     */
    status: {
      type: String,
      enum: ["new", "read", "replied", "resolved"],
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

const Inquiry =
  mongoose.models.Inquiry || mongoose.model("Inquiry", inquirySchema);

export default Inquiry;
