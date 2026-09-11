import mongoose from "mongoose";

const generalSettingsSchema = new mongoose.Schema(
  {
    supportEmail: {
      type: String,
      default: "",
      trim: true,
    },

    socialLinks: {
      instagram: {
        type: String,
        default: "",
        trim: true,
      },

      youtube: {
        type: String,
        default: "",
        trim: true,
      },

      snapchat: {
        type: String,
        default: "",
        trim: true,
      },
    },

    founder: {
      instagram: {
        type: String,
        default: "",
        trim: true,
      },
    },

    contact: {
      phone: {
        type: String,
        default: "",
        trim: true,
      },

      whatsapp: {
        type: String,
        default: "",
        trim: true,
      },
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const GeneralSettings =
  mongoose.models.GeneralSettings ||
  mongoose.model("GeneralSettings", generalSettingsSchema);

export default GeneralSettings;
