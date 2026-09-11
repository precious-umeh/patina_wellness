import {
  ArrowRightIcon,
  CheckIcon,
  FlaskIcon,
  SparkleIcon,
} from "@phosphor-icons/react/dist/ssr";

import Link from "next/link";

import { services } from "../../data/services";
import { testingPanels } from "../../data/testingPanels";

import Container from "../../components/shared/Container";
import PageHero from "../../components/shared/PageHero";
import Section from "../../components/shared/Section";
import SectionTitle from "../../components/shared/SectionTitle";
import Button from "../../components/shared/Button";
import CtaBanner from "../../components/shared/CtaBanner";

import Reveal from "@/app/components/animations/Reveal";
import Stagger from "@/app/components/animations/Stagger";
import StaggerItem from "@/app/components/animations/StaggerItem";

export const metadata = {
  title: "Clinical Services & Diagnostics",
  description:
    "Explore Patina's precision health consultation plans, memebership tiers, and individual functional testing panels.",
};

function Services() {
  return (
    <main>
      <PageHero
        eyebrow="Precision Clinical Offerings"
        title="Consultation Plans & Diagnostic Panels"
        description="Targeting root-cause dysfunction with tailored clinical guidance, continuous metabolic tracking, and advanced cellular bio-analysis."
      />

      {/* Consultation Plans Grids & Cards */}
      <Section id="plans">
        <Container className="space-y-15">
          <SectionTitle eyebrow="Targeted Care">
            Consultation Plans & Membership
          </SectionTitle>

          {/* Cards Grid */}
          <Stagger className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((plan) => {
              const isFeatured = plan.id === "patinas-circle";

              return (
                <StaggerItem
                  key={plan.id}
                  id={plan.id}
                  className={`relative flex scroll-mt-28 flex-col justify-between rounded-xl border p-8 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    isFeatured
                      ? "border-secondary/50 bg-secondary-light/20 ring-secondary/30 ring-2"
                      : "border-border bg-background hover:border-primary/30"
                  }`}
                >
                  {/* Featured Membership Badge */}
                  {isFeatured && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="bg-heading text-background inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wide shadow-md">
                        <SparkleIcon
                          size={14}
                          weight="fill"
                          className="text-secondary"
                        />
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="space-y-6">
                    {/* Header Details */}
                    <div>
                      <span className="text-primary-dark text-xs font-bold tracking-wider uppercase">
                        {plan.tagline}
                      </span>

                      <h3 className="text-heading mt-1 text-xl font-extrabold tracking-tight">
                        {plan.title}
                      </h3>

                      <p className="mt-2 text-xs leading-relaxed">
                        {plan.fullDescription}
                      </p>
                    </div>

                    {/* Price Block */}
                    <div className="border-border/60 border-y py-4">
                      <span className="text-heading text-2xl font-black">
                        {plan.price}
                      </span>

                      <p className="text-muted font-memdium pt-0.5 text-xs">
                        {plan.priceBilling}
                      </p>
                    </div>

                    {/* Feature List */}
                    <ul className="text-body space-y-3 text-xs">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <div className="bg-primary-light text-primaary-dark mt-0.5 shrink-0 rounded-full p-0.5">
                            <CheckIcon size={12} weight="bold" />
                          </div>

                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Booking Action */}
                  <div className="pt-8">
                    <Button
                      href={`/consultation?service=${plan.id}`}
                      variant={isFeatured ? "primary" : "outline"}
                      className="w-full justify-center py-3 text-xs"
                      rightIcon={<ArrowRightIcon size={16} weight="bold" />}
                    >
                      Book Plan
                    </Button>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Container>
      </Section>

      {/* Detailed Plans Comparison Table */}
      <Section className="bg-surface border-border nav-desktop:block hidden border-y">
        <Container className="space-y-15">
          <SectionTitle eyebrow="Side-by-Side Overview">
            Plan Comparison
          </SectionTitle>

          {/* Desktop Responsive Table */}
          <Reveal>
            <div className="border-border bg-background overflow-x-auto rounded-xl border shadow-xs">
              <table className="w-full text-left text-sm">
                <thead className="border-border bg-surface text-heading border-b">
                  <tr>
                    <th scope="col" className="p-5 font-bold">
                      Plan
                    </th>
                    <th scope="col" className="p-5 font-bold">
                      What&apos;s Included
                    </th>
                    <th scope="col" className="p-5 text-right font-bold">
                      Investment
                    </th>
                    <th scope="col" className="p-5 text-center font-bold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-border divide-y">
                  {services.map((plan) => (
                    <tr
                      key={plan.id}
                      className="hover:bg-surface/50 transition-colors"
                    >
                      <td className="text-heading p-5 align-top font-bold whitespace-nowrap">
                        {plan.title}
                        <span className="text-primary-dark mt-1 block text-xs font-normal">
                          {plan.tagline}
                        </span>
                      </td>

                      <td className="max-w-md p-5 align-top">
                        <ul className="space-y-1.5 text-xs leading-relaxed">
                          {plan.features.map((feat, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-primary-dark font-bold">
                                •
                              </span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </td>

                      <td className="text-heading p-5 text-right align-top font-bold whitespace-nowrap">
                        <div>{plan.price}</div>
                        <div className="text-muted text-xs font-normal">
                          {plan.priceBilling}
                        </div>
                      </td>

                      <td className="p-5 text-center align-top whitespace-nowrap">
                        <Link
                          href={`/consultation?service=${plan.id}`}
                          className="text-primary-dark inline-flex items-center gap-1 text-xs font-bold hover:underline"
                        >
                          Select Plan <ArrowRightIcon size={14} weight="bold" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Individual Functional Testing Panels Sections */}
      <Section
        id="panels"
        className="bg-surface border-border nav-desktop:bg-background nav-desktop:border-y-0 border-y"
      >
        <Container className="space-y-15">
          <SectionTitle eyebrow="Targeted Bio-Analysis">
            Individual Functional Testing Panels
          </SectionTitle>

          <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testingPanels.map((panel) => (
              <StaggerItem
                key={panel.id}
                className="group border-border bg-background shadow-cs hover:border-primary/40 flex flex-col justify-between rounded-lg border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-primary-light text-primary-dark rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase">
                      {panel.category}
                    </span>

                    <span className="text-heading text-lg font-bold">
                      {panel.price}
                    </span>
                  </div>

                  <h4 className="text-heading group-hover:text-primary-dark text-base font-bold tracking-tight transition-colors">
                    {panel.name}
                  </h4>

                  <p className="text-xs leading-relaxed">{panel.description}</p>
                </div>

                <div className="border-border/60 mt-6 flex items-center justify-between border-t pt-6">
                  <span className="text-muted inline-flex items-center gap-1.5 text-xs">
                    <FlaskIcon size={14} weight="bold" />
                    Targeted Panel
                  </span>

                  <Link
                    href={`/consultation?panel=${panel.id}`}
                    className="text-primary-dark inline-flex items-center gap-1 text-xs font-bold transition-transform hover:translate-x-0.5"
                  >
                    Request Panel <ArrowRightIcon size={14} weight="bold" />
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* Cta Booking Banner */}
      <CtaBanner />
    </main>
  );
}

export default Services;
