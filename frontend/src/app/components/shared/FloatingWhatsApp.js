"use client";

import { useEffect, useState } from "react";
import { WhatsappLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { usePublicSiteSettings } from "@/app/hooks/usePublicSiteSettings";
import { formatWhatsAppNumber } from "@/app/lib/formatPhoneNumber";

function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);
  const { settings, loading } = usePublicSiteSettings();

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 200);
    }

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const whatsapp = settings?.contact?.whatsapp ?? "";

  if (loading || !whatsapp) {
    return null;
  }

  const phoneNumber = formatWhatsAppNumber(whatsapp);

  const message = encodeURIComponent(
    "Hello Patina Wellness Solutions, I found you on your website and would like to make an inquiry about your services.",
  );

  const whatsappHref = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Patina Wellness Solutions on WhatsApp"
      className={`fixed bottom-6 left-2 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:outline-none ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <WhatsappLogoIcon size={25} weight="duotone" />
    </a>
  );
}

export default FloatingWhatsApp;
