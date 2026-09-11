"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getGeneralSettings,
  updateGeneralSettings,
} from "@/app/lib/api/generalSettings";

export function useGeneralSettings() {
  const [settings, setSettings] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /**
   * ========================================
   * Clear Feedback
   * ========================================
   */
  const clearFeedback = function () {
    setError("");
    setSuccessMessage("");
  };

  /**
   * ========================================
   * Load General Settings
   * ========================================
   */
  const loadSettings = useCallback(async function () {
    try {
      const data = await getGeneralSettings();

      return data;
    } catch (error) {
      console.error("Fetch General Settings Error:", error);

      throw new Error(
        error.response?.data?.message || "Unable to retrieve general settings.",
      );
    }
  }, []);

  /**
   * ========================================
   * Initial Fetch
   * ========================================
   */
  useEffect(() => {
    let cancelled = false;

    async function initializeGeneralSettings() {
      try {
        const response = await loadSettings();

        if (cancelled) return;

        const data = response?.data;

        setSettings({
          supportEmail: data?.supportEmail ?? "",

          socialLinks: {
            instagram: data?.socialLinks?.instagram ?? "",
            youtube: data?.socialLinks?.youtube ?? "",
            snapchat: data?.socialLinks?.snapchat ?? "",
          },

          founder: {
            instagram: data?.founder?.instagram ?? "",
          },

          contact: {
            phone: data?.contact?.phone ?? "",
            whatsapp: data?.contact?.whatsapp ?? "",
          },

          location: data?.location ?? "",
        });
      } catch (error) {
        if (cancelled) return;

        setError(error.message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    initializeGeneralSettings();

    return () => {
      cancelled = true;
    };
  }, [loadSettings]);

  /**
   * ========================================
   * Update Settings Field
   * ========================================
   */
  const handleChange = function (section, field, value) {
    clearFeedback();

    setSettings((current) => {
      if (!current) return current;

      if (section) {
        return {
          ...current,
          [section]: {
            ...current[section],
            [field]: value,
          },
        };
      }

      return {
        ...current,
        [field]: value,
      };
    });
  };

  /**
   * ========================================
   * Save General Settings
   * ========================================
   */
  const handleSaveSettings = async function () {
    if (!settings) return;

    clearFeedback();

    setSaving(true);

    try {
      const response = await updateGeneralSettings({
        supportEmail: settings.supportEmail,

        socialLinks: {
          instagram: settings.socialLinks.instagram,
          youtube: settings.socialLinks.youtube,
          snapchat: settings.socialLinks.snapchat,
        },

        founder: {
          instagram: settings.founder.instagram,
        },

        contact: {
          phone: settings.contact.phone,
          whatsapp: settings.contact.whatsapp,
        },

        location: settings.location,
      });

      const updatedSettings = response?.data;

      setSettings({
        supportEmail: updatedSettings?.supportEmail ?? settings.supportEmail,

        socialLinks: {
          instagram:
            updatedSettings?.socialLinks?.instagram ??
            settings.socialLinks.instagram,

          youtube:
            updatedSettings?.socialLinks?.youtube ??
            settings.socialLinks.youtube,

          snapchat:
            updatedSettings?.socialLinks?.snapchat ??
            settings.socialLinks.snapchat,
        },

        founder: {
          instagram:
            updatedSettings?.founder?.instagram ?? settings.founder.instagram,
        },

        contact: {
          phone: updatedSettings?.contact?.phone ?? settings.contact.phone,

          whatsapp:
            updatedSettings?.contact?.whatsapp ?? settings.contact.whatsapp,
        },

        location: updatedSettings?.location ?? settings.location,
      });

      setSuccessMessage("General settings updated successfully.");
    } catch (error) {
      console.error("Update General Settings Error:", error);

      setError(
        error.response?.data?.message || "Unable to update general settings.",
      );
    } finally {
      setSaving(false);
    }
  };

  return {
    // State
    settings,
    loading,
    saving,
    error,
    successMessage,

    // Handlers
    handleChange,
    handleSaveSettings,
  };
}
