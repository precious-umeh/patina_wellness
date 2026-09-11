"use client";

import { useCallback, useEffect, useState } from "react";

import { getPublicSiteSettings } from "../lib/api/generalSettings";

export function usePublicSiteSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /**
   * ========================================
   * Fetch Public Site Settings
   * ========================================
   */
  const loadSettings = useCallback(async function () {
    try {
      const response = await getPublicSiteSettings();

      return response;
    } catch (error) {
      console.error("Fetch Public Site Settings Error:", error);

      throw new Error(
        error.response?.data?.message || "Unable to retrieve site settings.",
      );
    }
  }, []);

  /**
   * ========================================
   * Initialize Public Site Settings
   * ========================================
   */
  useEffect(() => {
    let cancelled = false;

    async function initializePublicSiteSettings() {
      try {
        const response = await loadSettings();

        if (cancelled) return;

        const data = response?.data;

        setSettings({
          supportEmail: data?.supportEmail ?? "",

          socialLinks: {
            instagram: data?.socialLinks?.instagram ?? "",
            snapchat: data?.socialLinks?.snapchat ?? "",
            youtube: data?.socialLinks?.youtube ?? "",
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
        console.error("Initialize Public Site Settings Error:", error);

        setError(error.message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    initializePublicSiteSettings();

    return () => {
      cancelled = true;
    };
  }, [loadSettings]);

  return {
    settings,
    loading,
    error,
  };
}
