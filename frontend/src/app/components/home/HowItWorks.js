import { steps } from "@/app/data/howItWorksSteps";
import Container from "../shared/Container";
import Section from "../shared/Section";
import SectionTitle from "../shared/SectionTitle";

import Stagger from "../animations/Stagger";
import StaggerItem from "../animations/StaggerItem";

function HowItWorks() {
  return (
    <Section>
      <Container className="space-y-15">
        <SectionTitle eyebrow="Simple 4-Step Process">
          How It Works
        </SectionTitle>

        <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <StaggerItem
                key={step.step}
                className="group border-border bg-background hover:border-primary-dark/30 relative flex h-full flex-col items-start rounded-lg border p-8 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-6 flex w-full items-center justify-between">
                  <div className="bg-primary-light text-primary-dark group-hover:bg-primary group-hover:text-heading inline-flex rounded-md p-3 transition-colors duration-300">
                    <Icon size={28} weight="bold" aria-hidden="true" />
                  </div>

                  <span className="text-heading/30 group-hover:text-primary-dark font-mono text-2xl font-black transition-colors duration-300">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-heading mb-3 text-xl font-bold tracking-tight">
                  {step.title}
                </h3>

                <p className="text-body text-base leading-relaxed">
                  {step.description}
                </p>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </Section>
  );
}

export default HowItWorks;
