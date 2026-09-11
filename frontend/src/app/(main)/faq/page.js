import {
  CheckCircleIcon,
  FirstAidIcon,
  HeartbeatIcon,
  LightningIcon,
  QuotesIcon,
  SparkleIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import PageHero from "@/app/components/shared/PageHero";
import Section from "@/app/components/shared/Section";
import Container from "@/app/components/shared/Container";
import SectionTitle from "@/app/components/shared/SectionTitle";
import Accordion from "@/app/components/ui/Accordion";
import CtaBanner from "@/app/components/shared/CtaBanner";

import FadeUp from "@/app/components/animations/FadeUp";

export const metadata = {
  title: "Frequently Asked Questions",
  description:
    "Learn who benefits from functional nutritional testing, common clinical indications, and essential preparation guidelines.",
};

const INDICATIONS = [
  "Mood disorders",
  "Cardiovascular disease",
  "Obesity",
  "Insulin resistance",
  "Type 2 diabetes",
  "Fatigue",
  "Weight management",
  "Dietary guidance",
  "Malnutrition",
  "Maldigestion",
  "Malabsorption",
  "Athletic performance",
  "Physical trauma and healing",
];

function FaqPage() {
  const faqItems = [
    {
      question:
        "Which Patients Might Benefit from Functional Nutritional Testing?",
      icon: <HeartbeatIcon size={22} weight="duotone" />,
      answer: (
        <div className="space-y-6">
          <blockquote className="border-secondary bg-secondary-light/20 text-heading relative rounded-lg border-l-4 p-4 text-sm italic">
            <QuotesIcon
              size={24}
              weight="fill"
              className="text-secondary/40 absolute -top-2 right-2"
            />
            According to the World Health Organization, every country in the
            world is affected by one or more forms of malnutrition.
          </blockquote>

          <p className="text-body text-sm leading-relaxed sm:text-base">
            Nutritional imbalances are often the underlying root causes of
            chronic dysfunction and disease. Correcting these micronutrient and
            metabolic deficiences can result in optimized cellular health,
            sustained energy, and overall well-being.
          </p>

          <div className="space-y-3 pt-2">
            <span className="text-heading flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
              <SparkleIcon
                size={14}
                weight="fill"
                className="text-primary-dark"
              />
              Common Clinical Indications
            </span>

            {/* Indications Tag Grid */}
            <div className="flex flex-wrap gap-2">
              {INDICATIONS.map((indication) => (
                <span
                  key={indication}
                  className="border-border bg-surface text-heading inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-2xs"
                >
                  <CheckCircleIcon
                    size={14}
                    weight="fill"
                    className="text-primary-dark"
                  />
                  {indication}
                </span>
              ))}
            </div>
          </div>

          {/* Age Restriction Callout */}
          <div className="bg-surface text-muted border-border/80 flex items-start gap-2.5 rounded-md border p-3.5 text-xs">
            <WarningCircleIcon
              size={18}
              weight="fill"
              className="text-secondary mt-0.5 shrink-0"
            />
            <span>
              <strong className="text-heading font-semibold">Note:</strong>{" "}
              Testing is available exclusively for individuals aged 12 years and
              above.
            </span>
          </div>
        </div>
      ),
    },
    {
      question: "How Should I Prepare for My Functional Test?",
      icon: <FirstAidIcon size={22} weight="duotone" />,
      answer: (
        <div className="text-body space-y-4 text-sm leading-relaxed sm:text-base">
          <p>
            Certain medications, dietary supplements, and specific foods may
            influence diagnostic test results. To establish an accurate
            biological baseline, proper test preparation is key.
          </p>

          <ul className="text-heading space-y-2.5 pt-1 text-xs font-medium sm:text-sm">
            <li className="flex items-start gap-2.5">
              <LightningIcon
                size={16}
                weight="fill"
                className="text-primary-dark mt-0.5 shrink-0"
              />
              <span>
                <strong>Overnight Fasting:</strong> Patients should ideally be
                tested after an overnight fast to establish an accurate
                baseline.
              </span>
            </li>

            <li className="flex items-start gap-2.5">
              <LightningIcon
                size={16}
                weight="fill"
                className="text-primary-dark mt-0.5 shrink-0"
              />
              <span>
                <strong>Medication Guidance:</strong> Patina Wellness does{" "}
                <em>not</em> recommend discontinuing medically necessary
                medications or prescribed supplements solely for testing
                purposes.
              </span>
            </li>

            <li className="flex items-start gap-2.5">
              <LightningIcon
                size={16}
                weight="fill"
                className="text-primary-dark mt-0.5 shrink-0"
              />
              <span>
                <strong>Evaluating Current Regimens:</strong> Where appropriate,
                testing may be performed while continuing your medication or
                supplements to evaluate their ongoing effectiveness.
              </span>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <main>
      <PageHero
        eyebrow="Help & Guidance"
        title="Frequently Asked Questions"
        description="Clear, evidence-backed insights regarding our clinical testing process, indications, and preparation protocols."
      />

      <Section>
        <Container className="max-w-4xl space-y-15">
          <SectionTitle eyebrow="Functional Diagnostics">
            Testing & Clinical Guidance
          </SectionTitle>

          <FadeUp>
            <Accordion items={faqItems} />
          </FadeUp>
        </Container>
      </Section>

      <CtaBanner />
    </main>
  );
}

export default FaqPage;
