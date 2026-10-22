"use client";

import Link from "next/link";
import { ShoppingCartIcon } from "@phosphor-icons/react/dist/ssr";

import useCart from "@/app/hooks/useCart";
import { cn } from "@/app/lib/utils";

function CartLink({ className, iconClassName, iconSize = 20, onClick }) {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      onClick={onClick}
      aria-label={`Shopping cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
      className={cn(
        "bg-primary-light hover:bg-primary/20 relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors",
        className,
      )}
    >
      <ShoppingCartIcon
        size={iconSize}
        weight="bold"
        className={cn("text-primary-dark", iconClassName)}
      />

      {itemCount > 0 && (
        <span className="bg-primary text-heading absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-extrabold">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}

export default CartLink;
