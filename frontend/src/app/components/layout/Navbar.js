"use client";

import {
  ListIcon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MobileNav from "./MobileNav";
import { usePathname } from "next/navigation";
import { isActive } from "@/app/lib/navigation";
import SearchModal from "../ui/SearchModal";
import Button from "../shared/Button";
import { navLinks } from "@/app/data/navigations";

function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleOpenSearch = () => {
    // Remove focus outline from clicked button
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    // Open Modal
    setIsSearchOpen(true);
  };

  // Global Cmd+k / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="border-border text-heading bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-md">
        <div className="nav-desktop:grid-cols-3 nav-desktop:px-8 mx-auto grid max-w-7xl grid-cols-2 items-center px-6 py-1">
          <div className="nav-desktop:w-32 relative flex h-17 w-20 justify-start">
            <Link href="/" className="relative flex h-full w-full items-center">
              <Image
                src="/Patina_Logo.png"
                alt="Patina Logo"
                fill
                sizes="(max-width: 1110px) 80px, 128px"
                className="object-contain object-left"
                priority
              />
            </Link>
          </div>

          <nav className="nav-desktop:flex z-10 hidden justify-center">
            <ul className="flex items-center gap-8 text-sm font-medium">
              {navLinks.map((link) => {
                const linkActive = isActive(link, pathname);

                return (
                  <li
                    key={link.id}
                    className={`text-heading hover:text-primary-dark transition-colors duration-200 ${
                      linkActive ? "text-primary-dark font-semibold" : ""
                    }`}
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="nav-desktop:col-span-1 flex items-center justify-end gap-3">
            <button
              type="button"
              // onClick={() => setIsSearchOpen(true)}
              onClick={handleOpenSearch}
              aria-label="Open Search"
              className="bg-primary-light hover:bg-primary/20 hidden h-10 w-10 items-center justify-center rounded-full transition-colors sm:flex"
            >
              <MagnifyingGlassIcon
                weight="bold"
                className="text-primary-dark size-5"
              />
            </button>

            <button
              type="button"
              aria-label="Cart"
              className="bg-primary-light hover:bg-primary/20 hidden h-10 w-10 items-center justify-center rounded-full transition-colors sm:flex"
            >
              <ShoppingCartIcon
                weight="bold"
                className="text-primary-dark size-5"
              />
            </button>

            <Button
              href="/consultation"
              size="sm"
              className="nav-desktop:inline-flex hidden"
            >
              Book Consultation
            </Button>

            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-expanded={isMenuOpen}
              aria-label="Open Menu"
              aria-controls="mobile-menu"
              className="text-primary-dark nav-desktop:hidden flex items-center justify-center p-1"
            >
              <ListIcon size={36} weight="bold" />
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <MobileNav
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onOpenSearch={() => setIsSearchOpen(true)}
          navLinks={navLinks}
        />
      </header>

      {/* Global Search modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}

export default Navbar;
