"use client";

import {
  ArrowRightIcon,
  ShoppingBagIcon,
} from "@phosphor-icons/react/dist/ssr";

import { FEATURED_PRODUCTS } from "@/app/data/dummyProducts";

import Container from "../shared/Container";
import Section from "../shared/Section";
import SectionTitle from "../shared/SectionTitle";
import Image from "next/image";
import Button from "../shared/Button";

import Reveal from "../animations/Reveal";
import Stagger from "../animations/Stagger";
import StaggerItem from "../animations/StaggerItem";

function FeaturedProducts() {
  return (
    <Section className="bg-surface">
      <Container className="space-y-12">
        <SectionTitle>Featured Products</SectionTitle>

        <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {FEATURED_PRODUCTS.map((product) => (
            <StaggerItem
              key={product.id}
              className="group border-border bg-background relative flex h-full flex-col overflow-hidden rounded-lg border shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              {/* Product Badge */}
              {product.badge && (
                <span className="bg-primary-light text-primary-dark absolute top-3 left-3 z-10 rounded-full px-3 py-1 text-xs font-semibold shadow-xs">
                  {product.badge}
                </span>
              )}

              {/* Image Wrapper */}
              <div className="relative aspect-square w-full overflow-hidden bg-neutral-50 dark:bg-neutral-900">
                <Image
                  src={product.image}
                  alt={product.alt}
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1109px) 50vw, 25vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Content Block */}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div className="space-y-2">
                  <span className="text-muted text-xs font-semibold tracking-wider uppercase">
                    {product.category}
                  </span>

                  <h3 className="text-heading group-hover:text-primary-dark text-lg leading-snug font-bold tracking-tight transition-colors duration-200">
                    {product.name}
                  </h3>
                </div>

                {/* Price & Action Row */}
                <div className="border-border/60 mt-6 space-y-4 border-t pt-4">
                  <span className="text-heading text-xl font-bold">
                    {product.price}
                  </span>

                  <Button
                    href={`/products/${product.id}`}
                    variant={product.hasVariants ? "outline" : "primary"}
                    rightIcon={<ShoppingBagIcon size={18} weight="bold" />}
                    className="w-full text-sm"
                  >
                    {product.hasVariants ? "Select Option" : "Buy Now"}
                  </Button>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

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
