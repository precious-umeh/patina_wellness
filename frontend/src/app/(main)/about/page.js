import {
  CheckCircleIcon,
  EyeIcon,
  SparkleIcon,
  TargetIcon,
} from "@phosphor-icons/react/dist/ssr";

import Image from "next/image";

import Container from "../../components/shared/Container";
import PageHero from "../../components/shared/PageHero";
import Section from "../../components/shared/Section";
import SectionTitle from "../../components/shared/SectionTitle";
import CtaBanner from "../../components/shared/CtaBanner";
import FounderInstagramLink from "@/app/components/shared/FounderInstagramLink";

import Reveal from "@/app/components/animations/Reveal";
import Stagger from "@/app/components/animations/Stagger";
import StaggerItem from "@/app/components/animations/StaggerItem";

export const metadata = {
  title: "About Us",
  description:
    "Learn about Patina Wellness Solutions, our holistic approach to metabolic health, and our founder, Ifeanyi Anthony Okey-Umeh.",
};

const PILLARS = [
  "Intentional & individualized clinical care",
  "Clear, measurable cellular health data",
  "Targeted protocols for root-cause resolution",
  "Simplified, daily-usable preventive wellness",
];

function AboutUs() {
  return (
    <main>
      <PageHero
        eyebrow="Redefining Preventive Care"
        title="Cellular-Level Care for Sustainable Longevity"
        description="We integrate functional and conventional medicine to identify, address, and reverse metabolic dysfunction before symptoms take hold."
      />

      {/* Brand Story Section */}
      <Section>
        <Container>
          <div className="nav-desktop:grid-cols-2 nav-desktop:gap-16 grid grid-cols-1 items-center gap-12">
            {/* Story Text */}
            <Reveal direction="left">
              <div className="space-y-6">
                <span className="bg-primary-light text-primary-dark inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide uppercase">
                  <SparkleIcon size={16} weight="bold" />
                  Our Foundation
                </span>

                <h2 className="text-heading text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl">
                  Evaluating What&apos;s Happening Inside Before Symptoms
                  Surface
                </h2>

                <p className="text-base leading-relaxed sm:text-lg">
                  <strong className="text-heading font-semibold">
                    Patina Wellness Solutions
                  </strong>{" "}
                  is a Lagos-based precision health and wellness consultancy
                  built around one guiding truth: the most effective approach to
                  health starts at the cellular level.
                </p>

                <p className="text-base leading-relaxed">
                  We integrate functional and conventional medicine to evaluate
                  and reverse chronic and acute metabolic dysfunction, systemic
                  inflammation, and oxidative stress. Rather than treating
                  isolated symptoms after the fact, we look after the
                  physiological function and total well-being of the whole
                  person.
                </p>

                {/* Pillars Bullet Grid */}
                <div className="pt-2">
                  <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {PILLARS.map((pillar) => (
                      <li
                        key={pillar}
                        className="item-start text-heading flex gap-2.5 text-sm font-medium"
                      >
                        <CheckCircleIcon
                          size={18}
                          weight="fill"
                          className="text-primary-dark mt-0.5 shrink-0"
                        />
                        <span>{pillar}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>

            <Reveal direction="right">
              <div className="border-border relative aspect-4/3 w-full overflow-hidden rounded-xl border shadow-lg sm:aspect-video lg:aspect-4/3">
                <Image
                  src="/Patina_About_Story.png"
                  alt="Health Consultation Laboratory"
                  fill
                  loading="eager"
                  sizes="(max-width: 1109px) 100vw, 50vw"
                  className="priority object-cover object-center"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Founder Spotlight Section */}
      <Section className="bg-surface border-border border-y">
        <Container className="space-y-15">
          <SectionTitle eyebrow="Leadership & Expertise">
            Meet Our Founder
          </SectionTitle>

          <div className="border-border bg-background mx-auto max-w-5xl rounded-xl border p-8 shadow-md sm:p-12 lg:p-16">
            <div className="nav-desktop:grid-cols-12 nav-desktop:gap-12 grid grid-cols-1 items-start gap-10">
              {/* Founder Image & Qucik Bio Column */}
              <Reveal
                direction="left"
                className="nav-desktop:col-span-5 nav-desktop:items-start nav-desktop:text-left flex flex-col items-center space-y-4 text-center"
              >
                <div className="w-full">
                  <div className="border-border relative mx-auto aspect-3/4 w-full max-w-xs overflow-hidden rounded-lg border shadow-md">
                    <Image
                      src="/Founder.jpeg"
                      alt="Ifeanyi Anthony Okey-Umeh - Founder of Patina Wellness Solutions"
                      fill
                      sizes="(max-width: 1109px) 100vw, 50vw"
                      className="object-cover object-top"
                    />
                  </div>

                  <div>
                    <h3 className="text-heading text-2xl font-bold tracking-tight">
                      Ifeanyi Anthony Okey-Umeh
                    </h3>
                    <p className="text-primary-dark pt-1 text-sm font-medium">
                      Business Development Specialist | Holistic Health
                      Consultant | Pharmacist
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Founder Detailed Bio Column */}
              <Reveal
                direction="right"
                className="nav-desktop:col-span-7 space-y-4 text-base leading-relaxed"
              >
                <div>
                  <p>
                    As a licensed pharmacist and certified functional medicine
                    and wellness professional, I evaluate a person&apos;s entire
                    lifestyle including physical, mental, emotional, and
                    spiritual factors rather than focusing solely on isolated
                    symptoms.
                  </p>

                  <p>
                    Instead of diagnosing diseases or prescribing medication, I
                    guide clients to uncover root causes of imbalances and build
                    sustainable wellness plans tailored specifically to their
                    biological makeup.
                  </p>

                  <p>
                    With over 10 years&apos; experience in patient care, process
                    improvement, flow optimization, and lifestyle program
                    design, I have learned that every individual is unique. I
                    consider the complex interactions among genetics,
                    environment, and lifestyle to target the underlying
                    dysfunction causing symptoms and restore lasting balance.
                  </p>

                  <div className="border-border flex items-center gap-4 border-t pt-4">
                    <span className="text-muted text-xs font-bold tracking-wider uppercase">
                      Connect with Ifeanyi:
                    </span>

                    <FounderInstagramLink />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* Mission & Vision Section */}
      <Section>
        <Container className="space-y-15">
          <SectionTitle eyebrow="Our driving Purpose">
            Mission & Vision
          </SectionTitle>

          <Stagger className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {/* Mission Card */}
            <StaggerItem className="group border-border bg-background hover:border-primary/40 relative flex h-full flex-col justify-between rounded-xl border p-8 shadow-xs transition-all duration-300 hover:shadow-md sm:p-10">
              <div className="space-y-4">
                <div className="bg-primary-light text-primary-dark inline-flex h-12 w-12 items-center justify-center rounded-full">
                  <TargetIcon size={28} weight="duotone" />
                </div>

                <h3 className="text-heading text-2xl font-bold tracking-tight">
                  Our Mission
                </h3>

                <p className="text-base leading-relaxed">
                  To provide seamless, on-demand precision diagnostics and
                  actionable wellness guidance directly to individuals wherever
                  they are most comfortable.
                </p>
              </div>
            </StaggerItem>

            {/* Vision Card */}
            <StaggerItem className="group border-secondary/20 bg-secondary-light/30 hover:border-secondary/50 relative flex h-full flex-col justify-between rounded-xl border p-8 shadow-xs transition-all duration-300 hover:shadow-md sm:p-10">
              <div className="space-y-4">
                <div className="bg-secondary-light text-heading inline-flex h-12 w-12 items-center justify-center rounded-full">
                  <EyeIcon size={28} weight="duotone" />
                </div>

                <h3 className="text-heading text-2xl font-bold tracking-tight">
                  Our Vision
                </h3>

                <p className="text-base leading-relaxed">
                  A world where the highest and purest level of health,
                  wellness, and lifestyle is easily accessible to everyone and
                  is accurate, relevant, and timely.
                </p>
              </div>
            </StaggerItem>
          </Stagger>
        </Container>
      </Section>

      {/* Cta Booking Banner */}
      <CtaBanner />
    </main>
  );
}

export default AboutUs;
