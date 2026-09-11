"use client";

import Image from "next/image";
import Container from "../shared/Container";
import Section from "../shared/Section";
import Button from "../shared/Button";
import FadeUp from "../animations/FadeUp";

function Hero() {
  return (
    <Section
      size="none"
      className="relative flex min-h-[calc(100dvh-76px)] flex-col justify-center overflow-hidden"
    >
      <Image
        src="/Patina_Hero_Mob.png"
        alt="Wellness Consultation"
        fill
        priority
        loading="eager"
        sizes="(max-width: 599px) 100vw"
        className="hero-desktop:hidden -z-20 object-cover object-center"
      />

      <Image
        src="/Patina_Hero_Des.png"
        alt="Wellness Consultation"
        fill
        priority
        loading="eager"
        sizes="(min-width: 600px) 100vw"
        className="hero-desktop:block -z-20 hidden object-cover object-[center_30%]"
      />

      <div
        aria-hidden="true"
        className="from-background/90 via-background/60 absolute inset-0 bg-linear-to-r to-transparent"
      />

      <Container className="relative z-10 flex py-12">
        <div className="hero-desktop:items-start hero-desktop:text-left flex max-w-2xl flex-col items-center gap-6 text-center">
          <FadeUp>
            <span className="bg-primary-light text-primary-dark inline-flex rounded-full px-4 py-2 text-sm font-semibold tracking-wide uppercase">
              Your Journey to Lasting Wellness
            </span>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h1 className="text-heading nav-desktop:text-6xl text-4xl leading-tight font-black sm:text-5xl">
              Precision Health and Wellness Starts at the Cellular Level
            </h1>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="text-body max-w-xl text-lg leading-8">
              We integrate Functional and Conventional Medicine to evaluate,
              prevent and reverse chronic metabolic dysfunction, systemic
              inflammation, and oxidative stress.
            </p>
          </FadeUp>

          <FadeUp delay={0.3}>
            <div className="mt-2 flex flex-col gap-4 sm:flex-row">
              <Button
                href="/consultation"
                size="lg"
                className="hover:-translate-y-0.5 hover:shadow-lg"
              >
                Book Consultation
              </Button>

              <Button href="/products" variant="secondary" size="lg">
                Explore Shop
              </Button>
            </div>
          </FadeUp>
        </div>
      </Container>
    </Section>
  );
}

export default Hero;
