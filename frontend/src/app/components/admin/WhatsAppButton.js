"use client";

import { cn } from "@/app/lib/utils";
import { WhatsappLogoIcon } from "@phosphor-icons/react/dist/ssr";

const baseStyles =
  "inline-flex items-center justify-center gap-1.5 rounded-md font-bold transition-colors focus-visible:outline-none focus-visible:ring-emerald-500 focus-visible:ring-offset-2";

const variants = {
  primary: "bg-emerald-600 text-white hover:bg-emerald-700",
  secondary: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
  ghost:
    "bg-transparent text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800",
};

const sizes = {
  sm: "px-2.5 py-1.5 text-[10px]",
  md: "px-3 py-1.5 text-[11px]",
  lg: "px-4 py-2 text-xs",
};

function WhatsAppButton({
  phone,
  message,
  children = "WhatsApp",
  variant = "primary",
  size = "md",
  icon = true,
  iconSize,
  className,
  ...props
}) {
  const classes = cn(
    baseStyles,
    variants[variant] ?? variants.primary,
    sizes[size] ?? sizes.md,
    className,
  );

  function handleClick() {
    if (!phone) {
      console.error("WhatsApp phone number is missing.");
      return;
    }

    const formattedPhone = phone.replace(/[^0-9]/g, "");
    const encodedMessage = encodeURIComponent(message || "");

    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <button type="button" onClick={handleClick} className={classes} {...props}>
      {icon && (
        <WhatsappLogoIcon
          size={iconSize ?? (size === "lg" ? 16 : 14)}
          weight="fill"
        />
      )}

      <span>{children}</span>
    </button>
  );
}

export default WhatsAppButton;
