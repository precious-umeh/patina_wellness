"use client";

import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { services } from "@/app/data/services";
import Container from "../shared/Container";
import Section from "../shared/Section";
import SectionTitle from "../shared/SectionTitle";
import Image from "next/image";
import Button from "../shared/Button";
import Reveal from "../animations/Reveal";

function FeaturedServices() {
  const featuredServices = services.filter(
    (service) => service.id !== "patinas-circle",
  );

  return (
    <Section>
      <Container className="nav-desktop:space-y-24 space-y-15">
        <SectionTitle>Our Services</SectionTitle>

        <div className="nav-desktop:space-y-20 space-y-15">
          {featuredServices.map((service, index) => {
            const isEven = index % 2 === 1;

            return (
              <div
                key={service.id}
                className={`nav-desktop:grid-cols-2 nav-desktop:gap-16 grid grid-cols-1 items-center gap-8 ${
                  isEven ? "nav-desktop:grid-flow-dense" : ""
                }`}
              >
                {/* Image Column */}
                <Reveal direction={isEven ? "right" : "left"}>
                  <div
                    className={`border-border nav-desktop:aspect-4/3 relative aspect-4/3 w-full overflow-hidden rounded-lg border shadow-md sm:aspect-video ${
                      isEven ? "nav-desktop:col-start-2" : ""
                    }`}
                  >
                    <Image
                      src={service.image}
                      alt={service.alt}
                      fill
                      sizes="(max-width: 1109px) 100vw, 50vw"
                      className="object-cover object-center transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </Reveal>

                {/* Text Content Column */}
                <Reveal direction={isEven ? "left" : "right"} delay={0.1}>
                  <div
                    className={`flex flex-col items-center gap-4 text-center sm:items-start sm:text-left ${
                      isEven
                        ? "nav-desktop:col-start-1 nav-desktop:row-start-1 nav-desktop:border-r nav-desktop:border-border nav-desktop:pr-12"
                        : "nav-desktop:border-l nav-desktop:border-border nav-desktop:pl-12"
                    }`}
                  >
                    <span className="bg-primary-light text-primary-dark rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide uppercase">
                      {service.tagline}
                    </span>

                    <h3 className="text-heading text-2xl font-bold tracking-tight sm:text-3xl">
                      {service.title}
                    </h3>

                    <p className="text-base leading-relaxed sm:text-lg">
                      {service.shortDescription}
                    </p>

                    {/* Price Tag Display */}
                    <span className="text-heading text-xl font-bold">
                      {service.price}{" "}
                      <span className="text-muted text-xs font-normal">
                        ({service.priceBilling})
                      </span>
                    </span>

                    {/* Direct Link to Consultation Page with URL Param */}
                    <div className="pt-2">
                      <Button
                        href={`/consultation?service=${service.id}`}
                        variant="outline"
                        rightIcon={<ArrowRightIcon size={18} weight="bold" />}
                        className="border-0 p-0 hover:-translate-y-0.5 hover:bg-transparent"
                      >
                        Book This Service
                      </Button>
                    </div>
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <div className="flex justify-center pt-6">
            <Button
              href="/services"
              variant="outline"
              rightIcon={<ArrowRightIcon size={20} weight="bold" />}
              className="hover:-translate-y-0.5 hover:shadow-lg"
            >
              View All Services & Membership
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

export default FeaturedServices;
