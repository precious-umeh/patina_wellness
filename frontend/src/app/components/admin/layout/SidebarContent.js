"use client";

import { adminNavLinks } from "@/app/data/adminNav";
import { isActive } from "@/app/lib/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import {
  ShieldCheckIcon,
  SignOutIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { usePathname } from "next/navigation";

function SidebarContent({ onClose }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="flex h-full w-full flex-col">
      {/* Header */}
      <div className="border-border flex h-16 shrink-0 items-center justify-between border-b px-6">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="bg-primary-light text-primary-dark flex h-9 w-9 items-center justify-center rounded-lg">
            <ShieldCheckIcon size={22} weight="duotone" />
          </div>

          <div>
            <span className="text-heading block text-sm font-extrabold tracking-tight">
              Patina
            </span>
            <span className="text-muted -mt-1 block text-[10px] font-bold tracking-wider uppercase">
              Admin Console
            </span>
          </div>
        </Link>

        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="text-muted hover:text-heading lg:hidden"
        >
          <XIcon size={20} weight="bold" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
        {adminNavLinks.map((item) => {
          const Icon = item.icon;
          const linkActive = isActive(item, pathname);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-all ${
                linkActive
                  ? "bg-primary text-heading shadow-2xs"
                  : "text-muted hover:bg-background hover:text-heading"
              }`}
            >
              <Icon
                size={20}
                weight={linkActive ? "bold" : "duotone"}
                className={linkActive ? "text-heading" : "text-primary-dark"}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Logout Section */}
      <div className="border-border shrink-0 border-t p-4">
        <button
          type="button"
          onClick={logout}
          className="text-danger hover:bg-danger/10 item-center flex w-full gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-colors"
        >
          <SignOutIcon size={20} weight="duotone" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

export default SidebarContent;
