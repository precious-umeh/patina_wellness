import { Suspense } from "react";
import Container from "../../components/shared/Container";
import PageHero from "../../components/shared/PageHero";
import Section from "../../components/shared/Section";
import BrandLoader from "../../components/shared/BrandLoader";
import PartnershipFormContent from "../../components/ui/PartnershipFormContent";

export const metadata = {
  title: "Partner With Us",
  description:
    "Explore corporate wellness programs, practitioner referral networks, and ambassador opportunities built around functional medicine protocols.",
};

function Partnership() {
  return (
    <main>
      <PageHero
        eyebrow="Collaboration & Alliances"
        title="Partner With Patina Wellness"
        description="Whether you are optimizing employee health or expanding your clinical practice, we build root-cause wellness solutions tailored for teams and community leaders."
      />

      <Section>
        <Container className="max-w-4xl">
          <Suspense fallback={<BrandLoader />}>
            <PartnershipFormContent />
          </Suspense>
        </Container>
      </Section>
    </main>
  );
}

export default Partnership;
