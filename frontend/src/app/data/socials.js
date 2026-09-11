import {
  InstagramLogoIcon,
  SnapchatLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react/dist/ssr";

export const socialLinks = [
  {
    label: "Instagram",
    handle: "@patina_wellness.ng",
    href: "https://instagram.com/patina_wellness.ng",
    icon: InstagramLogoIcon,
    colorClass: "hover:border-pink-500/50 hover:text-pink-600",
  },
  {
    label: "Snapchat",
    handle: "@patina_wellness",
    href: "https://snapchat.com/add/patina_wellness",
    icon: SnapchatLogoIcon,
    colorClass: "hover:border-yellow-500/50 hover:text-yellow-600",
  },
  {
    label: "YouTube",
    handle: "youtube.com/@PatinaWellness",
    href: "https://youtube.com/@PatinaWellness",
    icon: YoutubeLogoIcon,
    colorClass: "hover:border-red-500/50 hover:text-red-600",
  },
];

export const SOCIAL_CONFIG = [
  {
    key: "instagram",
    label: "Instagram",
    handle: "@patina_wellness.ng",
    icon: InstagramLogoIcon,
    colorClass: "hover:border-pink-500/50 hover:text-pink-600",
    actionText: "Follow us",
  },
  {
    key: "snapchat",
    label: "Snapchat",
    handle: "@patina_wellness",
    icon: SnapchatLogoIcon,
    colorClass: "hover:border-yellow-500/50 hover:text-yellow-600",
    actionText: "Add us",
  },
  {
    key: "youtube",
    label: "YouTube",
    handle: "youtube.com/@PatinaWellness",
    icon: YoutubeLogoIcon,
    colorClass: "hover:border-red-500/50 hover:text-red-600",
    actionText: "Subscribe to our Channel",
  },
];
