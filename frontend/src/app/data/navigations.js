export const siteLinks = [
  {
    id: "home",
    label: "Home",
    href: "/",
    showInNav: true,
    showInFooter: true,
  },
  {
    id: "about",
    label: "About",
    href: "/about",
    showInNav: true,
    showInFooter: true,
  },
  {
    id: "services",
    label: "Services",
    href: "/services",
    showInNav: true,
    showInFooter: true,
  },
  {
    id: "products",
    label: "Products",
    href: "/products",
    showInNav: true,
    showInFooter: true,
  },
  {
    id: "consultation",
    label: "Book Consultation",
    href: "/consultation",
    showInNav: false, // Navigation bar uses the CTA button instead
    showInFooter: true,
  },
  {
    id: "partnership",
    label: "Partnership",
    href: "/partnership",
    showInNav: true,
    showInFooter: true,
  },
  {
    id: "faq",
    label: "FAQ",
    href: "/faq",
    showInNav: false, // Appears in Footer quick links only
    showInFooter: true,
  },
  {
    id: "contact",
    label: "Contact",
    href: "/contact",
    showInNav: true,
    showInFooter: true,
  },
];

export const navLinks = siteLinks.filter((link) => link.showInNav);
export const footerQuickLinks = siteLinks.filter((link) => link.showInFooter);
