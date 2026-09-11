"use client";

import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";

import Image from "next/image";
import Container from "../shared/Container";
import Section from "../shared/Section";
import SectionTitle from "../shared/SectionTitle";
import Button from "../shared/Button";
import Reveal from "../animations/Reveal";

function AboutPreview() {
  return (
    <Section>
      <Container className="space-y-15">
        <SectionTitle eyebrow="Who we Are">
          Precision Health Starts by Understanding You
        </SectionTitle>

        <div className="nav-desktop:grid-cols-2 nav-desktop:gap-12 grid grid-cols-1 items-center gap-8">
          <Reveal>
            <div className="border-border nav-desktop:aspect-4/3 relative aspect-4/3 w-full overflow-hidden rounded-lg border shadow-md sm:aspect-16/10">
              <Image
                src="/Patina_About_Preview.png"
                alt=""
                fill
                sizes="(max-width: 1109px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-500 hover:scale-105"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="item-start hero-desktop:text-left flex flex-col gap-6 text-center">
              <p className="text-lg leading-relaxed">
                Patina Wellness Solutions is a Lagos-based precision health and
                wellness consultancy dedicated to identifying health concerns
                before symptoms appear and delivering personalized wellness
                solutions tailored to each individual.
              </p>

              <p className="text-muted leading-relaxed">
                By integrating Functional and Conventional Medicine, we help
                evaluate and address chronic metabolic dysfunction, systemic
                inflammation, and oxidative stress supporting long-term health,
                prevention, and overall wellbeing.
              </p>

              <div className="hero-desktop:self-end self-center pt-2">
                <Button
                  href="/about"
                  size="sm"
                  variant="outline"
                  rightIcon={<ArrowRightIcon size={16} />}
                  className="shadow-sm hover:translate-y-0.5"
                >
                  Read our Story
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

export default AboutPreview;
