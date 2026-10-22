"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRightIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  TrashIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

import Button from "../shared/Button";
import Container from "../shared/Container";
import Section from "../shared/Section";

import useCart from "@/app/hooks/useCart";

import { getPublicProductById } from "@/app/lib/api/products";
import { getPublicSiteSettings } from "@/app/lib/api/generalSettings";
import { formatNaira } from "@/app/lib/formatCurrency";
import { formatWhatsAppNumber } from "@/app/lib/formatPhoneNumber";

function hasProductDetailsChanged(cartItem, product) {
  const currentImage = product.images?.find((image) => image?.url)?.url || "";

  return (
    cartItem.name !== (product.name || "Product") ||
    cartItem.slug !== product.slug ||
    Number(cartItem.price) !== Number(product.price) ||
    Number(cartItem.stock) !== Number(product.stock) ||
    cartItem.imageUrl !== currentImage
  );
}

function areVerificationResultsEqual(previous, next) {
  const previousIds = Object.keys(previous);
  const nextIds = Object.keys(next);

  if (previousIds.length !== nextIds.length) return false;

  return nextIds.every((id) => {
    const oldResult = previous[id];
    const newResult = next[id];

    if (!oldResult) return false;

    if (
      oldResult.verified !== newResult.verified ||
      oldResult.unavailable !== newResult.unavailable ||
      oldResult.message !== newResult.message
    ) {
      return false;
    }

    const oldProduct = oldResult.product;
    const newProduct = newResult.product;

    if (!oldProduct || !newProduct) {
      return oldProduct === newProduct;
    }

    return (
      oldProduct._id === newProduct._id &&
      oldProduct.name === newProduct.name &&
      oldProduct.slug === newProduct.slug &&
      Number(oldProduct.price) === Number(newProduct.price) &&
      Number(oldProduct.stock) === Number(newProduct.stock) &&
      (oldProduct.images?.find((image) => image?.url)?.url || "") ===
        (newProduct.images?.find((image) => image?.url)?.url || "")
    );
  });
}

function CartPage() {
  const {
    cart,
    itemCount,
    updateQuantity,
    refreshCartItem,
    removeFromCart,
    clearCart,
  } = useCart();

  const [currentProductsById, setCurrentProductsById] = useState({});
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [hasVerifiedCart, setHasVerifiedCart] = useState(false);

  const [reviewRequired, setReviewRequired] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");

  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappLoading, setWhatsappLoading] = useState(true);

  const cartRef = useRef(cart);

  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  /**
   * The product-reference key changes when products are added or removed,
   * but not when their quantities change.
   *
   * Changing a quantity won't necessarily refetch every product.
   */
  const productIdsKey = JSON.stringify(cart.map(({ productId }) => productId));

  const cartProductIds = useMemo(
    () => JSON.parse(productIdsKey),
    [productIdsKey],
  );

  const lastRefreshAt = useRef(0);

  /**
   * Verify current product details theorugh the public product API.
   */
  useEffect(() => {
    let cancelled = false;

    async function refreshCartProducts() {
      if (cartProductIds.length === 0) {
        setCurrentProductsById({});
        setHasVerifiedCart(true);
        return;
      }

      const results = await Promise.all(
        cartProductIds.map(async (productId) => {
          try {
            const response = await getPublicProductById(productId);
            const product = response?.product;

            if (!product) {
              return {
                productId,
                product: null,
                verified: true,
                unavailable: true,
              };
            }

            return {
              productId,
              product,
              verified: true,
              unavailable: false,
            };
          } catch (error) {
            if (error?.response?.status === 404) {
              return {
                productId,
                product: null,
                verified: true,
                unavailable: true,
              };
            }

            console.error(`Verify Cart product Error (${productId}):`, error);

            return {
              productId,
              product: null,
              verified: false,
              unavailable: false,
              message: "Current price and availability could not be verified.",
            };
          }
        }),
      );

      if (cancelled) return;

      const nextProductsById = Object.fromEntries(
        results.map((result) => [result.productId, result]),
      );

      let detailsChanged = false;

      for (const result of results) {
        if (!result.verified || !result.product) continue;

        const cartItem = cartRef.current.find(
          (item) => item.productId === result.productId,
        );

        if (!cartItem) continue;

        if (hasProductDetailsChanged(cartItem, result.product)) {
          detailsChanged = true;
          refreshCartItem(result.product);
        }
      }

      setCurrentProductsById((previous) =>
        areVerificationResultsEqual(previous, nextProductsById)
          ? previous
          : nextProductsById,
      );
      setHasVerifiedCart(true);

      if (detailsChanged) {
        setReviewRequired(true);
        setCheckoutMessage(
          "Some product details have changed. Review the updated cart before continuing.",
        );
      }
    }

    refreshCartProducts();

    return () => {
      cancelled = true;
    };
  }, [cartProductIds, refreshVersion, refreshCartItem]);

  useEffect(() => {
    function requestRefresh() {
      if (document.visibilityState !== "visible") return;

      const now = Date.now();

      // Avoid duplicate refreshes when focus and visibility events fire close together.
      if (now - lastRefreshAt.current < 5000) return;

      lastRefreshAt.current = now;
      setRefreshVersion((current) => current + 1);
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
   * Read the admin's WhatsApp number from the public site settings.
   */
  useEffect(() => {
    let cancelled = false;

    async function loadWhatsAppNumber() {
      try {
        const response = await getPublicSiteSettings();
        const number = response?.data?.contact?.whatsapp;

        if (cancelled) return;

        setWhatsappNumber(number ? formatWhatsAppNumber(number) : "");
      } catch (error) {
        if (!cancelled) {
          console.error("Load Cart WhatsApp Setings Error:", error);
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

  const subtotal = cart.reduce((total, item) => {
    const currentProduct = currentProductsById[item.productId]?.product;

    const price = Number(currentProduct ? currentProduct.price : item.price);

    return total + (Number.isFinite(price) ? price : 0) * item.quantity;
  }, 0);

  const canContinueToWhatsApp =
    cart.length > 0 &&
    !whatsappLoading &&
    Boolean(whatsappNumber) &&
    !reviewRequired &&
    !isCheckingOut &&
    cart.every((item) => {
      const check = currentProductsById[item.productId];
      const product = check?.product;

      return (
        check?.verified &&
        !check.unavailable &&
        product &&
        Number(product.stock) > 0 &&
        item.quantity <= Number(product.stock)
      );
    });

  function handleRetryVerification() {
    setRefreshVersion((current) => current + 1);
  }

  async function handleContinueToWhatsApp() {
    if (!canContinueToWhatsApp) return;

    setIsCheckingOut(true);
    setCheckoutMessage("");

    try {
      const results = await Promise.all(
        cart.map(async (item) => {
          try {
            const response = await getPublicProductById(item.productId);
            const product = response?.product;

            if (!product) {
              return {
                productId: item.productId,
                product: null,
                verified: true,
                unavailable: true,
              };
            }

            return {
              productId: item.productId,
              product,
              verified: true,
              unavailable: false,
            };
          } catch (error) {
            return {
              productId: item.productId,
              product: null,
              verified: error?.response?.status === 404,
              unavailable: error?.response?.status === 404,
            };
          }
        }),
      );

      const freshProductsById = Object.fromEntries(
        results.map((result) => [result.productId, result]),
      );

      let detailsChanged = false;

      for (const item of cart) {
        const result = freshProductsById[item.productId];

        if (!result?.verified || result.unavailable || !result.product) {
          continue;
        }

        if (hasProductDetailsChanged(item, result.product)) {
          detailsChanged = true;
        }

        refreshCartItem(result.product);
      }

      setCurrentProductsById(freshProductsById);

      const allProductsAvailable = cart.every((item) => {
        const result = freshProductsById[item.productId];
        const product = result?.product;

        return (
          result?.verified &&
          !result.unavailable &&
          product &&
          Number(product.stock) > 0 &&
          item.quantity <= Number(product.stock)
        );
      });

      if (!allProductsAvailable) {
        setReviewRequired(true);
        setCheckoutMessage(
          "One or more products are unavailable or have insufficient stock. Review your cart before continuing.",
        );
        return;
      }

      if (detailsChanged) {
        setReviewRequired(true);
        setCheckoutMessage(
          "Product details have changed. Review the updated prices and availability, then continue again.",
        );
        return;
      }

      const lines = [
        "Hello Patina Wellness Solutions, I would like to enquire about purchasing these products.",
        "",
        ...cart.flatMap((item, index) => {
          const product = freshProductsById[item.productId]?.product;
          if (!product) return [];

          const productUrl = `${window.location.origin}/products/${encodeURIComponent(product.slug)}`;

          return [
            `${index + 1}. ${product.name}`,
            `   Quantity: ${item.quantity}`,
            `   Unit price: ${formatNaira(product.price)}`,
            `   Subtotal: ${formatNaira(Number(product.price) * item.quantity)}`,
            `   Product link: ${productUrl}`,
            "",
          ];
        }),
        `Estimated cart subtotal: ${formatNaira(
          cart.reduce((total, item) => {
            const product = freshProductsById[item.productId]?.product;

            return total + Number(product.price) * item.quantity;
          }, 0),
        )}`,
        "",
        "Please confirm product availability, the final amount, delivery arrangements, and payment instructions.",
      ];

      const message = lines.join("\n");

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Final Cart Verification Error:", error);

      setCheckoutMessage(
        "We couldn't verify your cart just now. Please try again.",
      );
    } finally {
      setIsCheckingOut(false);
    }
  }

  if (cart.length === 0) {
    return (
      <Section>
        <Container>
          <div className="border-border bg-surface mx-auto max-w-xl rounded-xl border px-6 py-16 text-center">
            <ShoppingCartIcon
              size={42}
              weight="duotone"
              className="text-muted mx-auto"
            />

            <h1 className="text-heading mt-4 text-2xl font-extrabold">
              Your cart is empty
            </h1>

            <p className="text-muted mx-auto mt-2 max-w-sm text-sm leading-relaxed">
              Explore Patina&apos;s product collection and add the items you
              would like to purchase.
            </p>

            <Button
              href="/products"
              variant="primary"
              size="sm"
              rightIcon={<ArrowRightIcon size={15} weight="bold" />}
              className="mt-6"
            >
              Browse Products
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  if (!hasVerifiedCart) {
    return (
      <Section>
        <Container className="space-y-8">
          <div className="space-y-2">
            <p className="text-primary-dark text-xs font-bold tracking-wider uppercase">
              Your Selections
            </p>

            <h1 className="text-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
              Your Cart
            </h1>
          </div>

          <div
            role="status"
            className="border-border bg-surface rounded-xl border p-8 text-center"
          >
            <div className="border-border border-t-primary-dark mx-auto h-7 w-7 animate-spin rounded-full border-2" />
            <p className="text-muted mt-3 text-sm">
              Checking current product prices and availbility...
            </p>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container className="space-y-8">
        <div className="space-y-2">
          <p className="text-primary-dark text-xs font-bold tracking-wider uppercase">
            Your Selections
          </p>

          <h1 className="text-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
            Your Cart
          </h1>

          <p className="text-muted text-sm">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your cart.
            Review the quantities and confirm availability before contacting
            Patina.
          </p>
        </div>

        {checkoutMessage && (
          <div
            role="status"
            className="border-border bg-surface space-y-3 rounded-lg border p-4"
          >
            <p className="text-heading text-sm font-semibold">
              {checkoutMessage}
            </p>

            {reviewRequired && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setReviewRequired(false);
                  setCheckoutMessage("");
                }}
              >
                I&apos;ve reviewed the updated cart
              </Button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Cart Items */}
          <div className="border-border overflow-hidden rounded-xl border">
            <div className="border-border bg-surface flex items-center justify-between gap-3 border-b px-5 py-4">
              <h2 className="text-heading text-sm font-bold">Cart Items</h2>

              <button
                type="button"
                onClick={clearCart}
                className="text-muted hover:text-danger text-xs font-semibold"
              >
                Clear Cart
              </button>
            </div>

            <div className="divide-border divide-y">
              {cart.map((item) => {
                const check = currentProductsById[item.productId];
                const product = check?.product;

                const name = product?.name || item.name;
                const currentSlug = product?.slug || item.slug;
                const images = product?.images || [];
                const image =
                  images.find((entry) => entry?.url)?.url || item.imageUrl;

                const price = Number(product ? product.price : item.price);

                const stock = product
                  ? Math.max(0, Number(product.stock) || 0)
                  : 0;

                const outOfStock =
                  check?.verified && Boolean(product) && stock === 0;

                const unavailable = check?.unavailable;

                const quantityExceedsStock =
                  Boolean(product) && item.quantity > stock;

                const canChangeQuantity =
                  check?.verified &&
                  Boolean(product) &&
                  !unavailable &&
                  stock > 0;

                return (
                  <article
                    key={item.productId}
                    className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 p-4 sm:grid-cols-[112px_minmax(0,1fr)] sm:p-5"
                  >
                    <Link
                      href={`/products/${encodeURIComponent(currentSlug)}`}
                      aria-label={`View ${name}`}
                      className="border-border bg-surface relative aspect-square overflow-hidden rounded-lg border"
                    >
                      {image ? (
                        <Image
                          src={image}
                          alt={name}
                          fill
                          sizes="112px"
                          unoptimized
                          className="object-contain p-2"
                        />
                      ) : (
                        <div className="text-muted flex h-full items-center justify-center">
                          <ShoppingCartIcon size={26} />
                        </div>
                      )}
                    </Link>

                    <div className="flex min-w-0 flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            href={`/products/${encodeURIComponent(currentSlug)}`}
                            className="text-heading hover:text-primary-dark line-clamp-2 text-sm font-bold"
                          >
                            {name}
                          </Link>

                          <p className="text-heading mt-1.5 text-sm font-extrabold">
                            {formatNaira(price)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId)}
                          aria-label={`Remove ${name} from cart`}
                          className="text-muted hover:bg-danger/10 hover:text-danger shrink-0 rounded-md p-2 transition-colors"
                        >
                          <TrashIcon size={16} />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div
                          role="group"
                          aria-label={`Quantity for ${name}`}
                          className="border-border inline-flex h-9 items-center overflow-hidden rounded-lg border"
                        >
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${name}`}
                            disabled={!canChangeQuantity || item.quantity <= 1}
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity - 1,
                                stock,
                              )
                            }
                            className="text-muted hover:bg-surface flex h-full w-9 items-center justify-center disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <MinusIcon size={13} weight="bold" />
                          </button>

                          <span className="text-heading min-w-8 text-center text-xs font-bold">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            aria-label={`Increase quantity of ${name}`}
                            disabled={
                              !canChangeQuantity || item.quantity >= stock
                            }
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity + 1,
                                stock,
                              )
                            }
                            className="text-muted hover:bg-surface flex h-full w-9 items-center justify-center disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <PlusIcon size={13} weight="bold" />
                          </button>
                        </div>

                        <p className="text-heading text-xs font-bold">
                          {formatNaira(
                            (Number.isFinite(price) ? price : 0) *
                              item.quantity,
                          )}
                        </p>
                      </div>

                      {unavailable ? (
                        <p className="text-danger text-xs" role="status">
                          This product is no longer available. Remove it to
                          continue.
                        </p>
                      ) : check?.verified === false ? (
                        <p className="text-warning text-xs" role="status">
                          Current price and availability could not be verified.
                        </p>
                      ) : outOfStock ? (
                        <p className="text-danger text-xs" role="status">
                          Currently out of stock. Remove this item to continue.
                        </p>
                      ) : quantityExceedsStock ? (
                        <p className="text-warning text-xs" role="status">
                          Only {stock} {stock === 1 ? "unit is" : "units are"}{" "}
                          currently available. Reduce the quantity to continue.
                        </p>
                      ) : (
                        <p className="text-xs text-emerald-700">In Stock</p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <aside className="border-border bg-surface space-y-5 rounded-xl border p-5 sm:p-6">
            <h2 className="text-heading font-extrabold">Order Summary</h2>

            <div className="border-border flex items-center justify-between gap-4 border-b pb-4 text-sm">
              <span className="text-muted">Items</span>
              <span className="text-heading font-semibold">{itemCount}</span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <span className="text-muted text-sm">Estimated subtotal</span>
              <span className="text-heading text-lg font-extrabold">
                {formatNaira(subtotal)}
              </span>
            </div>

            <p className="text-muted text-xs leading-relaxed">
              Delivery fees, final availability, and payment details will be
              confirmed by Patina. This subtotal is not a completed order or a
              payment request.
            </p>

            {!canContinueToWhatsApp && (
              <div className="border-border bg-background flex items-start gap-2 rounded-lg border p-3">
                <WarningCircleIcon
                  size={18}
                  className="text-muted mt-0.5 shrink-0"
                />

                <p className="text-muted text-xs leading-relaxed">
                  {whatsappLoading
                    ? "Loading WhatsApp contact details..."
                    : !whatsappNumber
                      ? "WhatsApp ordering is currently unavailable. Please contact Patina directly."
                      : "One or more products need attention, or their current availability could not be verified."}
                </p>
              </div>
            )}

            <Button
              type="button"
              variant="primary"
              size="sm"
              fullWidth
              disabled={!canContinueToWhatsApp}
              rightIcon={<ArrowRightIcon size={15} weight="bold" />}
              onClick={handleContinueToWhatsApp}
            >
              {isCheckingOut
                ? "Verifying Cart..."
                : whatsappLoading
                  ? "Loading Contact ..."
                  : whatsappNumber
                    ? "Continue on WhatsApp"
                    : "WhatsApp Unavailable"}
            </Button>

            {cart.some((item) => {
              const check = currentProductsById[item.productId];
              const product = check?.product;

              return (
                !check?.verified ||
                check?.unavailable ||
                !product ||
                Number(product.stock) < item.quantity
              );
            }) && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                fullWidth
                onClick={handleRetryVerification}
              >
                Recheck Availability
              </Button>
            )}

            <Link
              href="/products"
              className="text-primary-dark inline-flex w-full items-center justify-center gap-1 text-xs font-bold underline-offset-4 hover:underline"
            >
              Continue Shopping
              <ArrowRightIcon size={13} weight="bold" />
            </Link>
          </aside>
        </div>
      </Container>
    </Section>
  );
}

export default CartPage;
