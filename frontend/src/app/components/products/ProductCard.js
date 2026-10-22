"use client";

import { useState } from "react";
import {
  ArrowRightIcon,
  PackageIcon,
  ShoppingCartIcon,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";

import Button from "../shared/Button";
import useCart from "@/app/hooks/useCart";

import { formatNaira } from "@/app/lib/formatCurrency";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const [cartMessage, setCartMessage] = useState("");

  const productHref = `/products/${encodeURIComponent(product.slug)}`;

  const image = product.images?.find((item) => item?.url)?.url;

  const inStock = Number(product.stock) > 0;

  const handleAddToCart = () => {
    const result = addToCart(product);

    setCartMessage(result.message);
  };

  return (
    <article className="group border-border bg-background hover:border-primary/30 flex h-full flex-col overflow-hidden rounded-xl border shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <Link
        href={productHref}
        className="bg-surface relative block aspect-4/3 overflow-hidden"
        aria-label={`View ${product.name}`}
      >
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="text-muted flex h-full w-full items-center justify-center">
            <PackageIcon size={48} weight="duotone" />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2">
          <div className="flex items-center justify-end">
            <span
              className={`text-[10px] font-bold ${
                inStock ? "text-emerald-700" : "text-muted"
              }`}
            >
              {inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <Link href={productHref} className="block">
            <h3 className="text-heading group-hover:text-primary-dark line-clamp-2 font-bold tracking-tight transition-colors">
              {product.name}
            </h3>
          </Link>

          <p className="text-heading text-lg font-extrabold">
            {formatNaira(product.price)}
          </p>
        </div>

        <div className="border-border mt-auto space-y-3 border-t pt-4">
          <Button href={productHref} variant="outline" size="xs" fullWidth>
            View Product
          </Button>

          <Button
            type="button"
            variant="primary"
            size="xs"
            fullWidth
            leftIcon={<ShoppingCartIcon size={15} weight="bold" />}
            disabled={!inStock}
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>

          {cartMessage && (
            <p role="status" className="text-muted text-xs leading-relaxed">
              {cartMessage}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
