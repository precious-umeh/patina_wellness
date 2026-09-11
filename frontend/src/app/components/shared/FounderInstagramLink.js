"use client";

import { usePublicSiteSettings } from "@/app/hooks/usePublicSiteSettings";
import { InstagramLogoIcon } from "@phosphor-icons/react/dist/ssr";

function FounderInstagramLink() {
  const { settings } = usePublicSiteSettings();

  if (!settings?.founder?.instagram) {
    return null;
  }
  return (
    <a
      href={settings.founder.instagram}
      target="_blank"
      rel="noopener noreferrer"
      className="border-border bg-surface text-heading hover:bg-primary-light hover:text-primary-dark inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
      aria-label="Instagram Profile"
    >
      <InstagramLogoIcon size={18} weight="bold" />
    </a>
  );
}

export default FounderInstagramLink;
