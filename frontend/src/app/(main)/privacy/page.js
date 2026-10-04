import Container from "@/app/components/shared/Container";
import LegalSection from "@/app/components/shared/LegalSection";
import PageHero from "@/app/components/shared/PageHero";
import Section from "@/app/components/shared/Section";

export const metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Patina Wellness Solutions collects, uses, shares and protects personal data in line with the Nigeria Data Protection Act, 2023.",
};

function PrivacyPolicy() {
  return (
    <main>
      <PageHero
        title="Privacy Policy"
        description="Learn how Patina Wellness Solutions collects, uses, shares and protects our personal data."
      />

      <Section>
        <Container>
          <article className="mx-auto max-w-4xl space-y-12">
            <LegalSection title="1.1 Introduction & Scope">
              <p>
                This Privacy Policy explains how Patina Wellness Solutions
                collects, uses, shares and protects personal data when you our
                website, or Services, in line with the Nigeria Data Protection
                Act, 2023 (NDPA).
              </p>
            </LegalSection>

            <LegalSection title="1.2 Information We Collect">
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Contact & identity data</strong> — full name, phone
                  number, email address, date of birth or age bracket, gender
                </li>

                <li>
                  <strong>Booking & service data</strong> — appointment
                  preferences, reason for consultation, how you heard about us
                </li>

                <li>
                  <strong>Health data (sensitive personal data)</strong> —
                  current medications and supplements, existing diagnosed
                  conditions, functional testing results, consultation notes and
                  recommendations
                </li>

                <li>
                  <strong>Membership & partnership data</strong> — Patina Circle
                  membership status; for partners, organisation name, industry,
                  area of practice, and social media handles
                </li>
              </ul>
            </LegalSection>

            <LegalSection title="1.3 How We Use Your Information">
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  To deliver the Services you&apos;ve booked or purchased —
                  consultations, testing, product orders, membership benefits
                </li>

                <li>
                  To generate and share your test results and personalised
                  recommendations
                </li>

                <li>To process payments and manage billing</li>

                <li>
                  To communicate with you about appointments and orders, and —
                  with your consent — marketing updates
                </li>

                <li>
                  To manage the Patina Circle membership and
                  corporate/individual partnerships
                </li>

                <li>
                  To improve our Services and meet legal and regulatory
                  obligations
                </li>
              </ul>
            </LegalSection>

            <LegalSection title="1.4 Legal Basis for Processing">
              <p>
                Under the NDPA, we rely on one or more of the following: your
                consent (particularly for health data and marketing),
                performance of a contract with you (delivering a service
                you&apos;ve booked), compliance with a legal obligation, and our
                legitimate interests, balanced against your rights.
              </p>

              <p>
                Because health information is sensitive personal data under the
                NDPA, we only process it with your explicit, informed consent —
                collected through our consultation and testing forms.
              </p>
            </LegalSection>

            <LegalSection title="1.5 How We Share Your Information">
              <p>
                We don&apos;t sell your personal data. We share it only where
                necessary to deliver the Services:
              </p>

              <ul className="list-disc space-y-2 pl-6">
                <li>
                  With testing/laboratory partners, to process functional and
                  Quantum Resonance testing
                </li>

                <li>
                  With payment processors, to handle transactions securely
                </li>

                <li>
                  With delivery/logistics partners, to fulfil product orders
                </li>

                <li>
                  With corporate partners, only as aggregated and anonymised
                  wellness-trend data — never individual health results — as set
                  out in the Growth Partner tier
                </li>

                <li>
                  Where required by law, regulation, or a valid legal process
                </li>
              </ul>
            </LegalSection>

            <LegalSection title="1.6 Data Security">
              <p>
                We use reasonable technical and organizational measures to
                protect your data — particularly sensitive health information —
                against unauthorized access, loss or misuse. No system is
                completely secure, and we can&apos;t guarantee absolute
                security.
              </p>
            </LegalSection>

            <LegalSection title="1.7 Data Retention">
              <p>
                We keep personal data only as long as necessary to provide the
                Services, meet legal or regulatory requirements, and resolve
                disputes.
              </p>
            </LegalSection>

            <LegalSection title="1.8 Your Rights">
              <p>Under the NDPA, you have the right to:</p>

              <ul className="list-disc space-y-2 pl-6">
                <li>Access the personal data we hold about you</li>

                <li>Correct inaccurate or incomplete data</li>

                <li>
                  Request erasure of your data, subject to legal or regulatory
                  retention requirements
                </li>

                <li>
                  Restrict or object to certain processing, including direct
                  marketing
                </li>

                <li>
                  Data portability — receive your data in a structured, commonly
                  used format
                </li>

                <li>
                  Withdraw consent at any time, without affecting processing
                  already carried out
                </li>

                <li>
                  Lodge a complaint with the Nigeria Data Protection Commission
                  (NDPC) if you believe your rights have been breached
                </li>
              </ul>

              <p>To exercise any of these rights, you can contact us.</p>
            </LegalSection>

            <LegalSection title="1.9 Cookies & Tracking">
              <p>
                If our website uses cookies or similar tracking tools,
                we&apos;ll ask for your opt-in consent before setting any
                non-essential cookie, in line with NDPC guidance, and
                you&apos;ll be able to change your preferences at any time via
                cookie settings on the site.
              </p>
            </LegalSection>

            <LegalSection title="1.10 Children's Data">
              <p>
                Our Services aren&apos;t directed at children under 18, except
                where a parent or guardian books on a minor&apos;s behalf.
                Functional nutritional testing is not performed on anyone under
                12.
              </p>
            </LegalSection>

            <LegalSection title="1.11 International Data Transfers">
              <p>
                Where any of your data is processed or stored outside Nigeria —
                for example, via cloud hosting providers — we ensure appropriate
                safeguards are in place in line with the NDPA&apos;s
                cross-border transfer requirements.
              </p>
            </LegalSection>

            <LegalSection title="1.12 Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. We&apos;ll
                post the updated version here with a new effective date.
              </p>
            </LegalSection>

            <LegalSection title="1.13 Clinical & Prescription Items">
              <p>
                Regulatory note: drugs, injections and infusions sit under
                pharmacist oversight rather than an ordinary add-to-cart flow.
                We will be requiring a prescription upload before ANY
                prescription items become purchasable, and by booking
                injectable/infusion services rather than shipping them.
              </p>

              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Prescription Medication</strong> — visible only after
                  a valid prescription is uploaded and reviewed, matching
                  Pharmacy dispensing standards
                </li>

                <li>
                  <strong>Injectable Therapies & IV Infusions</strong> — booked
                  as an in-clinic appointment rather than added to a delivery
                  cart
                </li>
              </ul>
            </LegalSection>
          </article>
        </Container>
      </Section>
    </main>
  );
}

export default PrivacyPolicy;
