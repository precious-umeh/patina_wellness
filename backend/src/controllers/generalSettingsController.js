import GeneralSettings from "../models/generalSettings.js";

const DEFAULT_GENERAL_SETTINGS = {
  supportEmail: "Patinawellnesssolutions@gmail.com",

  socialLinks: {
    instagram: "https://instagram.com/patina_wellness.ng",
    snapchat: "https://snapchat.com/add/patina_wellness",
    youtube: "https://youtube.com/@PatinaWellness",
  },

  founder: {
    instagram: "https://instagram.com/nwoke_nazo_onweya",
  },

  contact: {
    phone: "+2349168260622",
    whatsapp: "+2349168260622",
  },

  location: "Lagos, Nigeria.",
};

/**
 * ============================================
 * FETCH GENERAL SETTINGS
 * ============================================
 */
export async function getGeneralSettings(req, res) {
  try {
    let settings = await GeneralSettings.findOne();

    if (!settings) {
      settings = await GeneralSettings.create(DEFAULT_GENERAL_SETTINGS);
    }

    return res.status(200).json({
      success: true,
      message: "General Settings retrieved successfully.",
      data: {
        supportEmail: settings.supportEmail,
        socialLinks: settings.socialLinks,
        founder: settings.founder,
        contact: settings.contact,
        location: settings.location,
      },
    });
  } catch (error) {
    console.error("Get General Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve general settings.",
    });
  }
}

/**
 * ============================================
 * FETCH PUBLIC SITE SETTINGS
 * ============================================
 */
export async function getPublicSiteSettings(req, res) {
  try {
    const settings = await GeneralSettings.findOne();

    if (!settings) {
      return res.status(200).json({
        success: true,
        message: "Public site settings retrieved successfully.",
        data: DEFAULT_GENERAL_SETTINGS,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Public site settings retrieved successfully.",
      data: {
        supportEmail: settings.supportEmail,
        socialLinks: settings.socialLinks,
        founder: settings.founder,
        contact: settings.contact,
        location: settings.location,
      },
    });
  } catch (error) {
    console.error("Get Public Site Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve public site settings.",
    });
  }
}

/**
 * ============================================
 * UPDATE GENERAL SETTINGS
 * ============================================
 */
export async function updateGeneralSettings(req, res) {
  try {
    const { supportEmail, socialLinks, founder, contact, location } = req.body;

    if (
      typeof supportEmail !== "string" ||
      typeof location !== "string" ||
      !socialLinks ||
      typeof socialLinks !== "object" ||
      !founder ||
      typeof founder !== "object" ||
      !contact ||
      typeof contact !== "object"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid general settings data.",
      });
    }

    const settings = await GeneralSettings.findOne();

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "General settings have not been initialized.",
      });
    }

    const updatedSettings = await GeneralSettings.findOneAndUpdate(
      { _id: settings._id },
      {
        $set: {
          supportEmail,
          socialLinks,
          founder,
          contact,
          location,
        },
      },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      success: true,
      message: "General settings updated successfully.",
      data: {
        supportEmail: updatedSettings.supportEmail,
        socialLinks: updatedSettings.socialLinks,
        founder: updatedSettings.founder,
        contact: updatedSettings.contact,
        location: updatedSettings.location,
      },
    });
  } catch (error) {
    console.error("Update General Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update general settings.",
    });
  }
}
