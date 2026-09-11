"use client";

import { reasons } from "@/app/data/whyChooseUsReasons";
import Container from "../shared/Container";
import Section from "../shared/Section";
import SectionTitle from "../shared/SectionTitle";

import Stagger from "../animations/Stagger";
import StaggerItem from "../animations/StaggerItem";

function WhyChooseUs() {
  return (
    <Section className="bg-surface">
      <Container className="space-y-12">
        <SectionTitle eyebrow="The Patina Difference">
          Why Choose Patina
        </SectionTitle>

        <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {reasons.map((reason) => {
            const Icon = reason.icon;

            return (
              <StaggerItem
                key={reason.id}
                className="group border-border bg-background hover:border-primary-dark/30 relative flex flex-col items-start rounded-lg border p-8 shadow-xs transition-all duration-300 hover:translate-y-1 hover:shadow-md"
              >
                <div className="bg-primary-light text-primary-dark group-hover:bg-primary group-hover:text-heading mb-6 inline-flex rounded-md p-3.5 transition-colors duration-300">
                  <Icon size={32} aria-hidden="true" />
                </div>

                <h3 className="text-heading mb-3 text-xl font-bold tracking-tight">
                  {reason.title}
                </h3>

                <p className="text-base leading-relaxed">
                  {reason.description}
                </p>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </Section>
  );
}

export default WhyChooseUs;
