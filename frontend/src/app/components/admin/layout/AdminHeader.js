"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import {
  ArrowSquareOutIcon,
  ListIcon,
  UserCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

function AdminHeader({ onOpenSidebar }) {
  const { user } = useAuth();

  return (
    <header className="border-border bg-surface sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b px-4 sm:px-8">
      {/* Mobile Toggle & Brand Indicator */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="text-heading hover:bg-background rounded-lg border border-transparent p-2 transition-colors lg:hidden"
        >
          <ListIcon size={22} weight="bold" />
        </button>

        <span className="text-heading text-xs font-bold tracking-wider uppercase sm:text-sm">
          Management Portal
        </span>
      </div>

      {/* Public Site Link & User identity */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="text-primary-dark border-border bg-background hover:border-primary/40 hidden items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all sm:inline-flex"
        >
          <span>View Site</span>
          <ArrowSquareOutIcon size={14} weight="bold" />
        </Link>

        <Link
          href="/admin/profile"
          className="border-border inline-flex items-center gap-2.5 border-l pl-4"
        >
          <div className="bg-primary-light text-primary-dark flex h-8 w-8 items-center justify-center rounded-full font-bold">
            {user?.name ? (
              user.name.charAt(0).toUpperCase()
            ) : (
              <UserCircleIcon size={22} weight="duotone" />
            )}
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-heading text-xs leading-tight font-bold">
              {user?.name || "Admin Manager"}
            </p>

            <p className="text-muted text-[11px] font-medium">
              {user?.email || "admin@patinawellness.com"}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}

export default AdminHeader;
