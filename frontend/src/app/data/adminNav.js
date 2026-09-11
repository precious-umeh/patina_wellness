import {
  CalendarCheckIcon,
  EnvelopeSimpleIcon,
  GearIcon,
  HandshakeIcon,
  HouseIcon,
  PackageIcon,
  UserIcon,
} from "@phosphor-icons/react/dist/ssr";

export const adminNavLinks = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: HouseIcon,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: PackageIcon,
  },
  {
    label: "Bookings",
    href: "/admin/bookings",
    icon: CalendarCheckIcon,
  },
  {
    label: "Partnerships",
    href: "/admin/partnerships",
    icon: HandshakeIcon,
  },
  {
    label: "Inquiries",
    href: "/admin/inquiries",
    icon: EnvelopeSimpleIcon,
  },
  {
    label: "Profile",
    href: "/admin/profile",
    icon: UserIcon,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: GearIcon,
  },
];
