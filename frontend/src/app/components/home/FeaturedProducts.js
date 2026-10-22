"use client";

import { useEffect, useState } from "react";
import {
  ArrowRightIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

import Container from "../shared/Container";
import Section from "../shared/Section";
import SectionTitle from "../shared/SectionTitle";
import Button from "../shared/Button";

import ProductCard from "../products/ProductCard";

import { getProducts } from "@/app/lib/api/products";

import Reveal from "../animations/Reveal";
import Stagger from "../animations/Stagger";
import StaggerItem from "../animations/StaggerItem";

const FEATURED_PRODUCTS_LIMIT = 4;

function FeaturedProductSkeleton() {
  return (
    <div className="border-border overflow-hidden rounded-xl border">
      <div className="bg-surface aspect-[4/3] animate-pulse" />

      <div className="space-y-4 p-5">
        <div className="bg-surface h-3 w-1/3 animate-pulse rounded" />
        <div className="bg-surface h-5 w-4/5 animate-pulse rounded" />
        <div className="bg-surface h-5 w-2/5 animate-pulse rounded" />
        <div className="bg-surface h-10 w-full animate-pulse rounded-full" />
      </div>
    </div>
  );
}

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadFeaturedProducts() {
      try {
        const data = await getProducts({
          page: 1,
          limit: FEATURED_PRODUCTS_LIMIT,
          sort: "newest",
          isFeatured: true,
        });

        if (cancelled) return;

        setProducts(Array.isArray(data?.products) ? data.products : []);
        setError("");
      } catch (error) {
        if (cancelled) return;

        console.error("Load Featured Products Error:", error);

        setProducts([]);
        setError(
          error?.response?.data?.message ||
            "Unable to load products right now.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadFeaturedProducts();

    return () => {
      cancelled = true;
    };
  }, [requestVersion]);

  function handleRetry() {
    setLoading(true);
    setRequestVersion((current) => current + 1);
  }

  if (!loading && !error && products.length === 0) {
    return null;
  }

  return (
    <Section className="bg-surface">
      <Container className="space-y-12">
        <div className="space-y-3">
          <SectionTitle>Featured Products</SectionTitle>

          <p className="hero-desktop:text-left max-w-xl text-center text-sm leading-relaxed">
            Explore products selected to complement your wellness journey.
            Discover the collection and find options that suit your needs.
          </p>
        </div>

        {error ? (
          <div
            role="alert"
            className="border-border bg-background mx-auto max-w-lg rounded-xl border p-6 text-center"
          >
            <WarningCircleIcon
              size={28}
              weight="duotone"
              className="text-muted mx-auto"
            />

            <p className="text-heading mt-3 text-sm font-bold">
              Products couldn&apos;t be loaded
            </p>

            <p className="text-muted mt-1 text-xs">{error}</p>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: FEATURED_PRODUCTS_LIMIT }, (_, index) => (
              <FeaturedProductSkeleton key={index} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <StaggerItem key={product._id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <p className="text-muted py-8 text-center text-sm">
            Products will appear here as they become available.
          </p>
        )}

        {/* Bottom CTA to Shop */}
        <Reveal delay={0.1}>
          <div className="flex justify-center pt-4">
            <Button
              href="/products"
              variant="outline"
              rightIcon={<ArrowRightIcon size={20} weight="bold" />}
              className="hover:-translate-y-0.5 hover:shadow-lg"
            >
              Explore All Products
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

export default FeaturedProducts;
