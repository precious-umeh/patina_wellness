import {
  EnvelopeSimpleIcon,
  MapPinIcon,
  PhoneCallIcon,
} from "@phosphor-icons/react/dist/ssr";

export const contactInfo = [
  {
    icon: <PhoneCallIcon size={24} weight="duotone" />,
    title: "Phone & WhatsApp",
    details: "+234 916 826 0622",
    href: "tel:+2349168260622",
    actionText: "Call or Chat",
  },
  {
    icon: <EnvelopeSimpleIcon size={24} weight="duotone" />,
    title: "Email Address",
    details: "Patinawellnesssolutions@gmail.com",
    href: "mailto:Patinawellnesssolutions@gmail.com",
    actionText: "Send an Email",
  },
  {
    icon: <MapPinIcon size={24} weight="duotone" />,
    title: "Location",
    details: "Lagos, Nigeria",
    href: "#",
    actionText: "Virtual & In-Home Services",
  },
];
