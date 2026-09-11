import { Suspense } from "react";
import Container from "../../components/shared/Container";
import PageHero from "../../components/shared/PageHero";
import Section from "../../components/shared/Section";
import BrandLoader from "../../components/shared/BrandLoader";
import BookingFormContent from "../../components/ui/BookingFormContent";

export const metadata = {
  title: "Book a Consultation",
  description:
    "Schedule your clinical intake and functional health consultation with Patina Wellness. Tailored root-cause plans for long-term health.",
};

function Consultation() {
  return (
    <main>
      <PageHero
        eyebrow="Clinical Intake"
        title="Book Your Medical Consultation"
        description="Provide your health background so our functional wellness team can tailor a root-cause for your session."
      />

      <Section>
        <Container className="max-w-4xl">
          <Suspense fallback={<BrandLoader />}>
            <BookingFormContent />
          </Suspense>
        </Container>
      </Section>
    </main>
  );
}

export default Consultation;
