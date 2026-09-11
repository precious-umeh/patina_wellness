"use client";

import { CalendarCheckIcon } from "@phosphor-icons/react/dist/ssr";
import Container from "../shared/Container";
import Section from "../shared/Section";
import Button from "../shared/Button";

import Reveal from "../animations/Reveal";

function CtaBanner() {
  return (
    <Section>
      <Container>
        <Reveal>
          <div className="border-primary/20 bg-primary-light relative overflow-hidden rounded-xl border p-8 shadow-xl sm:p-12 lg:p-16">
            {/* Background Gradient Overlay */}
            <div
              aria-hidden="true"
              className="from-primary/10 pointer-events-none absolute inset-0 bg-linear-to-r via-transparent to-transparent"
            />

            <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center space-y-6 text-center">
              <span className="bg-background text-primary-dark border-border inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold tracking-wide uppercase shadow-xs">
                <CalendarCheckIcon size={16} weight="bold" />
                Take The First Step Today
              </span>

              <h2 className="text-heading text-3xl leading-tight font-black tracking-tight sm:text-4xl lg:text-5xl">
                Ready to Transform Your Health at the Cellular Level?
              </h2>

              <p className="max-w-2xl text-base leading-relaxed sm:text-lg">
                Book 1-on-1 consultation with our Holistic Health Consultants to
                pinpoint the root cause of your symptoms and build your
                personalized precision protocol.
              </p>

              <div className="flex w-full flex-col justify-center gap-4 pt-4 sm:w-auto sm:flex-row">
                <Button
                  href="/consultation"
                  className="shadow-md hover:-translate-0.5 hover:shadow-lg"
                >
                  Book Your Consultation
                </Button>

                <Button
                  href="/about"
                  variant="outline"
                  className="hover:bg-background hover:border-background hover:shadow-md"
                >
                  Learn More About Patina
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}

export default CtaBanner;
