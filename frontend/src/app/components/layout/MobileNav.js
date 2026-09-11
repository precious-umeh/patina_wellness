"use client";

import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActive } from "@/app/lib/navigation";
import Modal from "../shared/Modal";
import Button from "../shared/Button";

function MobileNav({ isOpen, onClose, onOpenSearch, navLinks = [] }) {
  const pathname = usePathname();

  // Handle Search Trigger
  const handleSearchclick = (e) => {
    e.preventDefault();
    onClose();
    if (onOpenSearch) {
      onOpenSearch();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Navigation Menu"
      position="right"
      panelClassName="nav-desktop:hidden max-w-sm h-full flex flex-col rounded-l-none"
    >
      {/* Top Header Row */}
      <div className="border-border flex items-center justify-end border-b px-6 py-4">
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="hover:bg-primary-light text-primary-dark flex h-10 w-10 items-center justify-center rounded-full transition-colors"
        >
          <XIcon size={24} weight="bold" />
        </button>
      </div>

      {/* Scrollable NavLinks */}
      <nav className="flex-1 overflow-y-auto px-6 py-6">
        <ul className="flex flex-col gap-2">
          {navLinks.map((link) => {
            const linkActive = isActive(link, pathname);

            return (
              <li
                key={link.id}
                className={`text-heading block w-full rounded-lg px-3 py-2.5 text-lg font-medium transition-colors duration-200 ${
                  linkActive
                    ? "bg-primary-light text-primary-dark font-semibold"
                    : "hover:text-primary-dark hover:bg-primary-light/50"
                }`}
              >
                <Link href={link.href} onClick={onClose} className="block">
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Actions */}
      <div className="border-border bg-primary-light/30 flex flex-col gap-4 border-t px-6 py-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSearchclick}
            aria-label="Search"
            className="bg-primary-light hover:bg-primary/20 flex h-11 w-11 items-center justify-center rounded-full transition-colors"
          >
            <MagnifyingGlassIcon
              size={22}
              weight="bold"
              className="text-primary-dark"
            />
          </button>
          <button
            aria-label="Cart"
            className="bg-primary-light hover:bg-primary/20 flex h-11 w-11 items-center justify-center rounded-full transition-colors"
          >
            <ShoppingCartIcon
              size={22}
              weight="bold"
              className="text-primary-dark"
            />
          </button>
        </div>

        <Button
          href="/consultation"
          onClick={onClose}
          size="md"
          className="shadow-xs"
        >
          Book Consultation
        </Button>
      </div>
    </Modal>
  );
}

export default MobileNav;
