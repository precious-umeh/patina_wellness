import Container from "@/app/components/shared/Container";
import LegalSection from "@/app/components/shared/LegalSection";
import PageHero from "@/app/components/shared/PageHero";
import Section from "@/app/components/shared/Section";

export const metadata = {
  title: "Terms of Service",
  description:
    "Read the Terms of Service governing the use of Patina Wellness Solutions' website, products, consultations, testing, memberships, and partnership programmes.",
};

function TermsOfService() {
  return (
    <main>
      <PageHero
        title="Terms of Service"
        description="Please read these terms carefully before using Patina Wellness Solutions' website, or Services."
      />

      <Section>
        <Container>
          <article className="mx-auto max-w-4xl space-y-12">
            <LegalSection title="1.1 Who We Are">
              <p>
                Patina Wellness Solutions is a Lagos-based precision health and
                wellness consultancy, providing holistic health consultations,
                functional and metabolic testing, wellness products, membership
                and partnership programmes described on this website. These
                Terms of Service govern your access to and use of the Services.
              </p>

              <p>Patina Wellness Pharmacy ltd, RC number; 8250617</p>
            </LegalSection>

            <LegalSection title="1.2 Acceptance of These Terms">
              <p>
                By booking a consultation, purchasing a product, subscribing to
                the Patina Circle, or otherwise using the Services, you agree to
                be bound by these Terms and by our Privacy Policy. If you
                don&apos;t agree, please don&apos;t use the Services.
              </p>
            </LegalSection>

            <LegalSection title="1.3 Who Can Use Patina Wellness Services">
              <p>
                You must be 18 or older to book a consultation, buy products, or
                register for Patina Circle Membership on your own behalf.
                Services for a minor must be booked and consented to by a parent
                or legal guardian. In line with our testing protocol, functional
                nutitional testing is not performed on patients under 12 years
                old.
              </p>
            </LegalSection>

            <LegalSection title="1.4 Our Services">
              <p>Patina Provides:</p>

              <ul className="list-disc space-y-2 pl-6">
                <li>Holistic health consultations - virtual and physical</li>

                <li>
                  Functional and metabolic testing, including Quantum Resonance
                  Bio-analysis
                </li>

                <li>
                  OTC-drugs, Wellness products, supplements and food-grade items
                </li>

                <li>The Patina Circle memebership</li>

                <li>Corporate and individual partnership programmes</li>
              </ul>

              <p>
                Availability of any specific service isn&apos;t guaranteed at
                all times.
              </p>
            </LegalSection>

            <LegalSection title="1.5 Bookings, Appointments & Cancellations">
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Appointements are booked through the consultation form on our
                  website.
                </li>

                <li>
                  Please give at least 24hours notice to reschedule or cancel a
                  booked appointment.
                </li>

                <li>
                  We&apos;ll try to accomadate rescheduling request, but
                  can&apos;t guarantee a specific replacement slot.
                </li>
              </ul>
            </LegalSection>

            <LegalSection title="1.6 Orders, Payment & Pricing">
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  All prices are shown in Nigerian Naira (₦) tax inclusive.
                </li>

                <li>
                  Prices for services, testing panels, products and membership
                  may change without notice; the price shown to you at the time
                  of booking or purchase is the price that applies to that
                  transaction.
                </li>

                <li>
                  Payment is due at the time of booking or purchase, unless
                  otherwise agreed with you in writing.
                </li>

                <li>
                  Once a functional test or consultation has been delivered,
                  fees for that service are non-refundable. Physical Product
                  returns are handled in line with our Return Policy.
                </li>

                <li>
                  For Physical products: any product purchased in good condition
                  cannot be returned. No refund only exchange for products that
                  have been damaged in transit. Product condition must be
                  assessed and evidence of damage sent via any of our contact
                  details within 24 hours of product reception.
                </li>
              </ul>
            </LegalSection>

            <LegalSection title="1.7 Products & Supplements">
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Our supplements and wellness products are food supplements,
                  not medicines, and are not intended to diagnose, treat, cure
                  or prevent any disease.
                </li>

                <li>
                  Always read product labelling and speak to a qualified
                  healthcare provider before starting a new supplement —
                  particularly if you&apos;re pregnant, breastfeeding, on
                  medication, or managing a medical condition.
                </li>

                <li>
                  We source products from what we consider reliable, third-party
                  tested suppliers. For third-party branded products (for
                  example Revive Active, Garden of Life, LAC), the
                  manufacturer&apos;s own guidance, warnings and allergen
                  information apply in addition to ours.
                </li>
              </ul>
            </LegalSection>

            <LegalSection title="1.8 Medical Disclaimer">
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Patina&apos;s Services are designed for preventive, root-cause
                  and wellness support. They are not a substitute for emergency
                  medical care. If you&apos;re experiencing a medical emergency,
                  contact emergency services or go to the nearest hospital
                  immediately.
                </li>

                <li>
                  We will never advise you to discontinue a medically necessary
                  medication or treatment prescribed by another healthcare
                  provider without that provider&apos;s involvement — in line
                  with the approach already set out for the Comprehensive
                  Functional Nutritional Assessment.
                </li>
              </ul>
            </LegalSection>

            <LegalSection title="1.9 Test Results & Recommendations">
              <p>
                Functional testing results, dynamic reports and supplement or
                lifestyle recommendations are provided for informational and
                wellness purposes. They are not a clinical diagnosis. Where a
                result suggests something needing medical attention, we&apos;ll
                recommend you see a licensed physician or the relevant
                specialist.
              </p>
            </LegalSection>

            <LegalSection title="1.10 Patina Circle Membership">
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  The Patina Circle is a paid membership, described on our
                  Services page, billed annually or quarterly.
                </li>

                <li>
                  Membership renews automatically at the end of each billing
                  cycle unless cancelled before renewal.
                </li>

                <li>Cancellation at least 7 days before renewal</li>

                <li>
                  Fees already paid are non-refundable, except where required by
                  law.
                </li>

                <li>
                  Benefits, discounts and pricing may be updated from time to
                  time; existing members will get reasonable notice of any
                  material change.
                </li>
              </ul>
            </LegalSection>

            <LegalSection title="1.11 Corporate & Indivual Partnerships">
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Corporate Partnership and Individual Partnership
                  (Practitioner/Referral and Ambassador) arrangements are
                  governed by a separate written agreement between Patina and
                  the partner, in addition to these Terms.
                </li>

                <li>
                  Submitting a partnership enquiry form doesn&apos;t, by itself,
                  create a partnership relationship or any entitlement to fees,
                  discounts or commission.
                </li>
              </ul>
            </LegalSection>

            <LegalSection title="1.12 Intecllectual Property">
              <p>
                All content on our website — including text, logos, graphics,
                protocols and reports — belongs to Patina Wellness Solutions or
                its licensors unless stated otherwise, and may not be copied or
                reused without our written permission.
              </p>
            </LegalSection>

            <LegalSection title="1.13 Acceptable Use">
              <p>
                You agree not to misuse the Services — including attempting to
                access another user&apos;s account or data, submitting false
                health information intended to mislead a consultation, or using
                our booking system to place fraudulent orders.
              </p>
            </LegalSection>

            <LegalSection title="1.14 Limitation of Liability">
              <p>
                To the fullest extent permitted by law, Patina is not liable for
                indirect, incidental or consequential loss arising from your use
                of the Services. Nothing in these Terms limits any liability
                that can&apos;t lawfully be limited, including for death or
                personal injury caused by negligence, or for fraud.
              </p>
            </LegalSection>

            <LegalSection title="1.15 Indemnification">
              <p>
                You agree to indemnify Patina against claims arising from your
                misuse of the Services or branch of these Terms.
              </p>
            </LegalSection>

            <LegalSection title="1.16 Termination">
              <p>
                We may suspend or end your access to the Services, including
                membership, if you materially breach these Terms.
              </p>
            </LegalSection>

            <LegalSection title="1.17 Governing Laws & Disputes">
              <p>
                These Terms are governed by the laws of the Federal Republic of
                Nigeria. Any dispute is subject to the exclusive jurisdiction of
                the courts of Lagos State, unless otherwise required by law.
              </p>
            </LegalSection>

            <LegalSection title="1.18 Changes to These Terms">
              <p>
                We may update these Terms from time to time, We&apos;ll post the
                updated version here with a new effective date; continued use of
                the Services after changes take effect means you accept the
                update.
              </p>
            </LegalSection>
          </article>
        </Container>
      </Section>
    </main>
  );
}

export default TermsOfService;
