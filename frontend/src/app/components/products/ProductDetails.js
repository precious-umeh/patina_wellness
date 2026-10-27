"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowLeftIcon,
  CheckCircleIcon,
  MinusIcon,
  PackageIcon,
  PlusIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
} from "@phosphor-icons/react/dist/ssr";

import useCart from "@/app/hooks/useCart";

import Container from "../shared/Container";
import Section from "../shared/Section";
import Button from "../shared/Button";

import { getProduct, getPublicProductById } from "@/app/lib/api/products";
import { getPublicSiteSettings } from "@/app/lib/api/generalSettings";
import { formatWhatsAppNumber } from "@/app/lib/formatPhoneNumber";
import { formatNaira } from "@/app/lib/formatCurrency";

function getPrimaryImageUrl(product) {
  return product?.images?.find((image) => image?.url)?.url || "";
}

function getCategoryIdsKey(product) {
  return (product?.categories || [])
    .map((category) =>
      typeof category === "object" ? category._id : category,
    )
    .filter(Boolean)
    .sort()
    .join(",");
}

function hasPublicProductChanged(previous, current) {
  if (!previous || !current) {
    return Boolean(current);
  }

  return (
    previous._id !== current._id ||
    previous.name !== current.name ||
    previous.slug !== current.slug ||
    previous.description !== current.description ||
    Number(previous.price) !== Number(current.price) ||
    Number(previous.stock) !== Number(current.stock) ||
    Boolean(previous.isFeatured) !== Boolean(current.isFeatured) ||
    getPrimaryImageUrl(previous) !== getPrimaryImageUrl(current) ||
    getCategoryIdsKey(previous) !== getCategoryIdsKey(current)
  );
}

function ProductDetails({ slug }) {
  const router = useRouter();

  const productIdRef = useRef(null);
  const productRef = useRef(null);
  const requestIdRef = useRef(0);
  const lastRefreshAt = useRef(0);

  const { addToCart } = useCart();

  const [cartMessage, setCartMessage] = useState("");

  const [product, setProduct] = useState(null);
  const [loadedSlug, setLoadedSlug] = useState("");
  const [failedSlug, setFailedSlug] = useState("");
  const [error, setError] = useState("");
  const [requestVersion, setRequestVersion] = useState(0);

  const [imageState, setImageState] = useState({
    slug,
    index: 0,
  });

  const [quantityState, setQuantityState] = useState({
    slug,
    quantity: 1,
  });

  const selectedImageIndex = imageState.slug === slug ? imageState.index : 0;
  const quantity = quantityState.slug === slug ? quantityState.quantity : 1;

  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappLoading, setWhatsappLoading] = useState(true);

  /**
   * Load the requested product
   */
  useEffect(() => {
    let cancelled = false;
    const requestId = ++requestIdRef.current;

    async function loadProduct() {
      const productId = productIdRef.current;
      const refreshById = Boolean(
        productId && productRef.current?.slug === slug,
      );

      try {
        const response = refreshById
          ? await getPublicProductById(productId)
          : await getProduct(slug);

        const currentProduct = response?.product;

        if (!currentProduct?._id) {
          throw new Error("Product details were not returned by the server.");
        }

        // Ignore cancelled or superseded requests
        if (cancelled || requestId !== requestIdRef.current) return;

        productIdRef.current = currentProduct._id;
        const previousProduct = productRef.current;

        productRef.current = currentProduct;

        if (hasPublicProductChanged(previousProduct, currentProduct)) {
          setProduct(currentProduct);
        }

        setLoadedSlug(slug);
        setFailedSlug("");
        setError("");

        // Keep the browser URL in sync with the latest slug
        if (currentProduct.slug && currentProduct.slug !== slug) {
          router.replace(
            `/products/${encodeURIComponent(currentProduct.slug)}`,
            { scroll: false },
          );
        }
      } catch (loadError) {
        if (cancelled || requestId !== requestIdRef.current) return;

        console.error("Load Public Product Error:", loadError);

        if (loadError.response?.status === 404) {
          productRef.current = null;
          productIdRef.current = null;

          setProduct(null);
          setFailedSlug(slug);
          setError("This product is no longer available.");

          return;
        }

        if (!productRef.current) {
          setFailedSlug(slug);
          setError(
            loadError.response?.data?.message ||
              loadError.message ||
              "Unable to load this product. Please try again.",
          );
        } else {
          setError(
            "We couldn't refresh the latest product details. Please try again before purchasing.",
          );
        }
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [slug, requestVersion, router]);

  useEffect(() => {
    function requestRefresh() {
      if (document.visibilityState !== "visible") return;

      const now = Date.now();

      if (now - lastRefreshAt.current < 5000) return;

      lastRefreshAt.current = now;
      setRequestVersion((current) => current + 1);
    }

    const intervalId = window.setInterval(requestRefresh, 30_000);

    document.addEventListener("visibilitychange", requestRefresh);
    window.addEventListener("focus", requestRefresh);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", requestRefresh);
      window.removeEventListener("focus", requestRefresh);
    };
  }, []);

  /**
   * Load the WhatsApp contact Number from the public site settings
   */
  useEffect(() => {
    let cancelled = false;

    async function loadWhatsAppNumber() {
      try {
        const response = await getPublicSiteSettings();
        const rawNumber = response?.data?.contact?.whatsapp;

        const number = rawNumber ? formatWhatsAppNumber(rawNumber) : "";

        if (cancelled) return;

        setWhatsappNumber(number);
      } catch (error) {
        if (!cancelled) {
          console.error("load WhatsApp Contact Error:", error);
          setWhatsappNumber("");
        }
      } finally {
        if (!cancelled) {
          setWhatsappLoading(false);
        }
      }
    }

    loadWhatsAppNumber();

    return () => {
      cancelled = true;
    };
  }, []);

  const isLoading = loadedSlug !== slug && failedSlug !== slug;

  const handleRetry = () => {
    setError("");
    setFailedSlug("");
    setRequestVersion((current) => current + 1);
  };

  if (failedSlug === slug && error && !product) {
    return (
      <Section>
        <Container>
          <div
            role="alert"
            className="border-border bg-surface mx-auto max-w-xl rounded-xl border px-6 py-12 text-center"
          >
            <PackageIcon
              size={36}
              weight="duotone"
              className="text-muted mx-auto"
            />

            <h1 className="text-heading mt-4 text-xl font-bold">
              We couldn&apos;t load this product
            </h1>

            <p className="text-muted mt-2 text-sm leading-relaxed">{error}</p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleRetry}
              >
                Try Again
              </Button>

              <Button href="/products" variant="outline" size="sm">
                Back to Products
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  if (isLoading || loadedSlug !== slug || !product) {
    return (
      <Section>
        <Container>
          <div className="grid animate-pulse grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="bg-surface aspect-square rounded-xl" />

            <div className="space-y-5 py-4">
              <div className="bg-surface h-4 w-1/3 rounded" />
              <div className="bg-surface h-9 w-4/5 rounded" />
              <div className="bg-surface h-7 w-1/3 rounded" />
              <div className="bg-surface h-4 w-full rounded" />
              <div className="bg-surface h-4 w-5/6 rounded" />
              <div className="bg-surface h-12 w-full rounded-full" />
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  const images = (product.images || []).filter((image) => image?.url);

  const selectedImage = images[Math.min(selectedImageIndex, images.length - 1)];

  const categoryNames = (product.categories || []).filter(
    (category) => category && typeof category === "object" && category.name,
  );

  const stockCount = Math.max(0, Number(product.stock) || 0);
  const inStock = stockCount > 0;
  const quantityExceedsStock = quantity > stockCount;

  function handleAddToCart() {
    if (!inStock || quantityExceedsStock || error) return;

    const result = addToCart(product, quantity);
    setCartMessage(result.message);
  }

  const canBuy =
    inStock &&
    quantity >= 1 &&
    quantity <= stockCount &&
    !whatsappLoading &&
    Boolean(whatsappNumber) &&
    !error;

  function handleBuyNow() {
    if (!canBuy) return;

    const productUrl = `${window.location.origin}/products/${encodeURIComponent(product.slug)}`;
    const subtotal = Number(product.price) * quantity;

    const message = [
      "Hello Patina Wellness Solutions, I'm interested in purchasing this product.",
      "",
      `Product: ${product.name}`,
      `Quantity: ${quantity}`,
      `Unit price: ${formatNaira(product.price)}`,
      `Estimated subtotal: ${formatNaira(subtotal)}`,
      `Product link: ${productUrl}`,
      "",
      "Please confirm availability and payment instructions.",
    ].join("\n");

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <Section>
      <Container className="space-y-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="text-muted flex flex-wrap items-center gap-2 text-xs"
        >
          <Link
            href="/products"
            className="hover:text-primary-dark inline-flex items-center gap-1 font-semibold"
          >
            <ArrowLeftIcon size={14} weight="bold" />
            Products
          </Link>

          <span aria-hidden="true">/</span>

          <span className="text-heading font-medium">{product.name}</span>
        </nav>

        {error && loadedSlug === slug && (
          <p role="status" className="text-warning text-sm">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Product images */}
          <div className="space-y-4">
            <div className="border-border bg-surface relative aspect-square overflow-hidden rounded-xl border">
              {selectedImage ? (
                <Image
                  src={selectedImage.url}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  unoptimized
                  className="object-contain p-4"
                />
              ) : (
                <div className="text-muted flex h-full items-center justify-center">
                  <PackageIcon size={64} weight="duotone" />
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div
                aria-label="product-images"
                className="grid grid-cols-4 gap-3 sm:grid-cols-5"
              >
                {images.map((image, index) => (
                  <button
                    key={image._id || image.publicId || image.url}
                    type="button"
                    onClick={() => setImageState({ slug, index })}
                    aria-label={`View product image ${index + 1}`}
                    aria-pressed={selectedImageIndex === index}
                    className={`border-border bg-surface relative aspect-square overflow-hidden rounded-lg border transition-colors ${
                      selectedImageIndex === index
                        ? "border-primary-dark ring-primary-dark/20 ring-2"
                        : "hover:border-primary/50"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`${product.name}, image ${index + 1}`}
                      fill
                      sizes="100px"
                      unoptimized
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="flex flex-col">
            <p className="text-primary-dark text-xs font-bold tracking-wider uppercase">
              Patina Wellness Solutions
            </p>

            <h1 className="text-heading mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {product.name}
            </h1>

            <p className="text-heading mt-5 text-2xl font-black">
              {formatNaira(product.price)}
            </p>

            <div className="mt-4">
              {inStock ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  <CheckCircleIcon size={15} weight="fill" />
                  In Stock
                </span>
              ) : (
                <span className="bg-surface text-muted inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold">
                  Out of Stock
                </span>
              )}
            </div>

            <div className="border-border mt-6 border-t pt-6">
              <h2 className="text-heading text-sm font-bold">
                Product Description
              </h2>

              <p className="text-body mt-3 text-sm leading-7 wrap-anywhere whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {categoryNames.length > 0 && (
              <div className="mt-6">
                <h2 className="text-heading text-sm font-bold">Categories</h2>

                <div className="mt-3 flex flex-wrap gap-2">
                  {categoryNames.map((category) => (
                    <span
                      key={category._id || category.slug}
                      className="bg-primary-light text-primary-dark rounded-full px-3 py-1.5 text-xs font-semibold"
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            {inStock && (
              <div className="mt-6">
                <p className="text-heading text-xs font-bold">Quantity</p>

                <div
                  role="group"
                  aria-label="Product quantity"
                  className="border-border overflow mt-2 inline-flex h-11 items-center rounded-lg border"
                >
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    onClick={() =>
                      setQuantityState({
                        slug,
                        quantity: Math.max(1, quantity - 1),
                      })
                    }
                    className="text-muted hover:bg-surface flex h-full w-10 items-center justify-center disabled:opacity-40"
                  >
                    <MinusIcon size={15} weight="bold" />
                  </button>

                  <span
                    id="product-quantity"
                    aria-live="polite"
                    className="text-heading min-w-10 text-center text-sm font-bold"
                  >
                    {quantity}
                  </span>

                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={quantity >= stockCount}
                    onClick={() =>
                      setQuantityState({
                        slug,
                        quantity: Math.min(stockCount, quantity + 1),
                      })
                    }
                    className="text-muted hover:bg-surface flex h-full w-10 items-center justify-center disabled:opacity-40"
                  >
                    <PlusIcon size={15} weight="bold" />
                  </button>
                </div>

                {quantityExceedsStock && (
                  <p role="status" className="text-warning mt-2 text-xs">
                    Only {stockCount} currently available. Reduce the quantity
                    before purchasing.
                  </p>
                )}
              </div>
            )}

            {/* Purchase action */}
            <div className="mt-6 space-y-3">
              <Button
                type="button"
                variant="primary"
                size="md"
                fullWidth
                leftIcon={<ShoppingBagIcon size={18} weight="bold" />}
                disabled={!canBuy}
                onClick={handleBuyNow}
              >
                {!inStock
                  ? "Currently Out of Stock"
                  : whatsappLoading
                    ? "Loading Contact"
                    : whatsappNumber
                      ? "Buy Now via WhatsApp"
                      : "WhatsApp Ordering Unavailable"}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="md"
                fullWidth
                leftIcon={<ShoppingCartIcon size={18} weight="bold" />}
                disabled={
                  !inStock || quantityExceedsStock || Boolean(error)
                }
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>

              {cartMessage && (
                <p role="status" className="text-muted text-center text-xs">
                  {cartMessage}
                </p>
              )}

              {!whatsappLoading && !whatsappNumber && inStock && (
                <p className="text-muted text-xs leading-relaxed" role="status">
                  We couldn&apos;t load the WhatsApp contact details. Please
                  visit out Contact page to reach the team.
                </p>
              )}

              <p className="text-muted text-color text-xs leading-relaxed">
                The Patina team will confirm availability and payment
                instructions diretly with you.
              </p>
            </div>

            <Link
              href="/products"
              className="text-primary-dark mt-6 inline-flex items-center gap-2 text-xs font-bold underline-offset-4 hover:underline"
            >
              <ArrowLeftIcon size={14} weight="bold" />
              Continue browsing products
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default ProductDetails;
