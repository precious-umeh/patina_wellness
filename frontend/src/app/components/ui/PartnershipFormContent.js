"use client";

import {
  BuildingsIcon,
  CheckCircleIcon,
  HandshakeIcon,
  PaperPlaneRightIcon,
  SparkleIcon,
  UserCheckIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import Button from "../shared/Button";

import { createPartnership } from "@/app/lib/api/partnerships";

import Reveal from "../animations/Reveal";
import Stagger from "../animations/Stagger";
import StaggerItem from "../animations/StaggerItem";

const COMPANY_SIZE_OPTIONS = [
  "1 - 15 employees",
  "16 - 50 employees",
  "51 - 200 employees",
  "201 - 500 employees",
  "500+ employees",
];

const CONTACT_METHODS = ["Email", "WhatsApp", "Phone Call"];

function PartnershipFormContent() {
  const searchParams = useSearchParams();

  /**
   * URL Parameter parsing for pre-selecting type (?type=corporate | practitioner | ambassador)
   */
  const initialType = useMemo(() => {
    const typeParam = searchParams.get("type")?.toLowerCase();
    if (["corporate", "practitioner", "ambassador"].includes(typeParam)) {
      return typeParam;
    }

    return "corporate";
  }, [searchParams]);

  /**
   * Active tab state for copy switcher & form default
   */
  const [activeTab, setActiveTab] = useState(
    initialType === "corporate" ? "corporate" : "individual",
  );

  /**
   * Initial Form State
   */
  const initialState = {
    partnershipType: initialType,
    fullName: "",
    email: "",
    phoneNumber: "",

    // Corporate Specific Fields
    organisationName: "",
    industry: "",
    companySize: COMPANY_SIZE_OPTIONS[0],

    // Practitioner Specific Field
    areaOfSpecialty: "",

    // Practitioner & Ambassador Specific Field
    websiteOrSocial: "",

    // Shared Fields
    partnershipGoals: "",
    preferredContactMethod: CONTACT_METHODS[0],
    consent: false,
  };

  // Form State
  const [formData, setFormData] = useState(initialState);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  /**
   * Sync tab switching with form dropdown selection
   */
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);

    setFormData((prev) => ({
      ...prev,
      partnershipType: tab === "corporate" ? "corporate" : "practitioner",
    }));
  };

  /**
   * Handle Form input change
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error) {
      setError("");
    }
  };

  /**
   * Auto-scroll to top upon successful submission
   */
  useEffect(() => {
    if (isSubmitted) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isSubmitted]);

  /**
   * Handle Form Submission
   */
  const handleSubmit = async function (e) {
    e.preventDefault();

    if (!formData.consent) {
      setError("Please consent to the Terms & Privacy Policy to proceed.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await createPartnership({
        partnershipType: formData.partnershipType,
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,

        organisationName: formData.organisationName,
        industry: formData.industry,
        companySize: formData.companySize,

        areaOfSpecialty: formData.areaOfSpecialty,
        websiteOrSocial: formData.websiteOrSocial,

        partnershipGoals: formData.partnershipGoals,
        preferredContactMethod: formData.preferredContactMethod,
        consent: formData.consent,
      });

      console.log("Partnership submitted:", response);

      setIsSubmitted(true);
    } catch (error) {
      console.error("Submit Partnership Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to submit your partnership application. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle Submit Another Application
   */
  const handleSubmitAnother = function () {
    setFormData(initialState);
    setError("");
    setIsSubmitted(false);
    setActiveTab(initialType === "corporate" ? "corporate" : "individual");
  };

  /**
   * =============================
   * Success Confrimation View
   * =============================
   */

  if (isSubmitted) {
    return (
      <Reveal direction="up">
        <div className="border-border bg-surface mx-auto max-w-2xl rounded-xl border p-8 text-center shadow-md sm:p-10">
          <div className="bg-primary-light text-primary-dark mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <CheckCircleIcon size={36} weight="fill" />
          </div>

          <h2 className="text-heading sm:-text-3xl text-2xl font-bold tracking-tight">
            Partnership Application Received
          </h2>

          <p className="text-body mt-3 text-sm">
            Thank you,{" "}
            <strong className="text-heading font-semibold">
              {formData.fullName}
            </strong>
            . We&apos;ve logged your request for a{" "}
            <strong className="text-heading font-semibold capitalize">
              {formData.partnershipType}
            </strong>{" "}
            partnership with Patina Wellness.
          </p>

          {/* Lead Summary Box */}
          <div className="border-border bg-background my-6 space-y-2 rounded-lg border p-6 text-left text-sm">
            <h4 className="text-heading pb-1 text-base font-bold">
              Submission Summary:
            </h4>

            <p>
              <strong className="text-heading font-semibold">
                Partnership Type:
              </strong>{" "}
              <span className="capitalize">{formData.partnershipType}</span>
            </p>

            {formData.organisationName && (
              <p>
                <strong className="text-heading font-semibold">
                  Organisation:
                </strong>{" "}
                {formData.organisationName} ({formData.companySize})
              </p>
            )}

            {formData.areaOfSpecialty && (
              <p>
                <strong className="text-heading font-semibold">
                  Specialty:
                </strong>{" "}
                {formData.areaOfSpecialty}
              </p>
            )}

            {formData.websiteOrSocial && (
              <p>
                <strong className="text-heading font-semibold">
                  Handle/Website:
                </strong>{" "}
                {formData.websiteOrSocial}
              </p>
            )}

            <p>
              <strong className="text-heading font-semibold">
                Contact Person:
              </strong>{" "}
              {formData.email} | {formData.phoneNumber}
            </p>

            <p>
              <strong className="text-heading font-semibold">
                Preferred Contact:
              </strong>{" "}
              {formData.preferredContactMethod}
            </p>
          </div>

          <p className="text-muted text-xs">
            Our Business Development will review your proposal and respond via
            your preferred contact method within 24-48 business hours.
          </p>

          <div className="mt-8">
            <Button onClick={handleSubmitAnother}>
              Submit Another Application
            </Button>
          </div>
        </div>
      </Reveal>
    );
  }

  return (
    <div className="space-y-12">
      {/* Dynamic Program Copy Tabs */}
      <div className="space-y-6">
        <Reveal direction="up">
          <div className="flex w-full justify-center">
            <div className="bg-surface border-border grid w-full grid-cols-2 gap-1 rounded-2xl border p-1.5 shadow-2xs sm:flex sm:w-auto sm:rounded-full">
              <button
                type="button"
                onClick={() => handleTabSwitch("corporate")}
                className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-center text-xs font-semibold transition-all sm:rounded-full sm:px-5 sm:py-2.5 sm:text-sm ${
                  activeTab === "corporate"
                    ? "bg-primary text-heading shadow-xs"
                    : "text-muted hover:text-heading"
                }`}
              >
                <BuildingsIcon size={18} weight="bold" className="shrink-0" />
                <span className="truncate sm:whitespace-normal">Corporate</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabSwitch("individual")}
                className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-center text-xs font-semibold transition-all sm:rounded-full sm:px-5 sm:py-2.5 sm:text-sm ${
                  activeTab === "individual"
                    ? "bg-primary text-heading shadow-xs"
                    : "text-muted hover:text-heading"
                }`}
              >
                <UserCheckIcon size={18} weight="bold" className="shrink-0" />
                <span className="truncate sm:whitespace-normal">
                  Practitioners
                </span>
              </button>
            </div>
          </div>
        </Reveal>

        {/* Tab 1 Copy: Corporate */}
        {activeTab === "corporate" && (
          <Reveal direction="up">
            <div className="border-border bg-surface space-y-4 rounded-xl border p-6 sm:p-8">
              <div className="text-primary-dark bg-primary-light inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase">
                <HandshakeIcon size={16} weight="bold" /> For Companies & HR
                Leaders
              </div>

              <h3 className="text-heading text-xl font-bold sm:text-2xl">
                Wellness Built Into How Your Company Works
              </h3>

              <p className="text-sm leading-relaxed">
                Most corporate wellness programmes stop at a chronic care
                refill, gym subsidy, or an annual health talk. We go further:
                Patina Wellness designs root-cause wellness programmes that plug
                directly into your HR and HSE calendar, using biomarker testing
                and functional medicine protocols built for teams.
              </p>

              <p className="text-sm leading-relaxed">
                If your organsation tracks the cost of an unwell workforce -
                missed work days, low energy, declining productivity, or risiong
                medical claims - this is where we start the conversation.
              </p>
            </div>
          </Reveal>
        )}

        {/* Tab 2 Copy: Practitioner & Ambassador */}
        {activeTab === "individual" && (
          <Reveal direction="up">
            <div className="border-border bg-surface space-y-6 rounded-xl border p-6 sm:p-8">
              <div className="text-primary-dark bg-primary-light inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase">
                <SparkleIcon size={16} weight="bold" /> For Practitioners,
                Studios & Voices
              </div>

              <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <StaggerItem className="border-border bg-background space-y-2 rounded-lg border p-5">
                  <h4 className="text-heading text-base font-bold">
                    Practitioner & Referral Partnership
                  </h4>

                  <p className="text-xs leading-relaxed">
                    For nutritionists, Gps, pharmacists, physiotherapists, gym
                    owners, spa operators, and aestheticians. Refer clients for
                    Quantum Resonance testing or consultations and receive
                    referral fees, service credits, and co-branded educational
                    material.
                  </p>
                </StaggerItem>

                <StaggerItem className="border-border bg-background space-y-2 rounded-lg border p-5">
                  <h4 className="text-heading text-base font-bold">
                    Patina Wellness Ambassador program
                  </h4>

                  <p className="text-xs leading-relaxed">
                    For creators, coaches, and wellness voices with an engaged
                    audience. Earn affiliate commission on supplement and
                    testing sales through your link, plus complimentary personal
                    testing, in exchange for honest content.
                  </p>
                </StaggerItem>
              </Stagger>
            </div>
          </Reveal>
        )}
      </div>

      {/* PARTNERSHIP ENQUIRY FORM */}
      <Reveal direction="up">
        <form
          onSubmit={handleSubmit}
          className="border-border bg-surface space-y-6 rounded-xl border p-6 shadow-2xs sm:p-8"
        >
          <div className="border-border border-b pb-4">
            <h3 className="text-heading text-xs font-bold tracking-tight sm:text-2xl">
              Partnership Enquiry Form
            </h3>

            <p className="text-muted mt-1 text-xs">
              Fill out the details below and our partnership team will reach out
              with a tailored proposal.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Partnership Type Dropdown (Branching Trigger) */}
            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="partnershipType"
                className="text-heading text-xs font-bold tracking-wide uppercase"
              >
                Partnership Type <span className="text-secondary-dark">*</span>
              </label>

              <select
                id="partnershipType"
                name="partnershipType"
                value={formData.partnershipType}
                onChange={handleChange}
                className="border-border bg-background text-heading focus-visible:border-primary-dark w-full cursor-pointer rounded-lg border px-4 py-3 text-sm"
              >
                <option value="corporate">Corporate Partnership</option>
                <option value="practitioner">
                  Practitioner & Referral Partnership
                </option>
                <option value="ambassador">Patina Ambassador Program</option>
              </select>
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="text-heading text-xs font-bold tracking-wide uppercase"
              >
                Full Name / Primary Contact{" "}
                <span className="text-secondary-dark">*</span>
              </label>

              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="e.g. Dr. Alex Morgan"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="border-border bg-background text-heading placeholder:text-light focus-visible:border-primary-dark w-full rounded-lg border px-4 py-3 text-sm"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-heading text-xs font-bold tracking-wide uppercase"
              >
                Email Address <span className="text-secondary-dark">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="alex@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="border-border bg-background text-heading placeholder:text-light focus-visible:border-primary-dark w-full rounded-lg border px-4 py-3 text-sm"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label
                htmlFor="phoneNumber"
                className="text-heading text-xs font-bold tracking-wide uppercase"
              >
                Phone Number <span className="text-secondary-dark">*</span>
              </label>

              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="+234..."
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="border-border bg-background text-heading placeholder:text-light focus-visible:border-primary-dark w-full rounded-lg border px-4 py-3 text-sm"
              />
            </div>

            {/* DYNAMIC FIELDS: CORPORATE */}
            {formData.partnershipType === "corporate" && (
              <>
                <div className="space-y-2">
                  <label
                    htmlFor="organisationName"
                    className="text-heading text-xs font-bold tracking-wide uppercase"
                  >
                    Organisation Name{" "}
                    <span className="text-secondary-dark">*</span>
                  </label>

                  <input
                    type="text"
                    id="organisationName"
                    name="organisationName"
                    placeholder="e.g. Acme Health Corp"
                    value={formData.organisationName}
                    onChange={handleChange}
                    required
                    className="border-border bg-background text-heading placeholder:text-light focus-visible:border-primary-dark w-full rounded-lg border px-4 py-3 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="industry"
                    className="text-heading text-xs font-bold tracking-wide uppercase"
                  >
                    Industry <span className="text-secondary-dark">*</span>
                  </label>
                  <input
                    type="text"
                    id="industry"
                    name="industry"
                    placeholder="e.g. Banking, Technology, Energy"
                    value={formData.industry}
                    onChange={handleChange}
                    required
                    className="border-border bg-background text-heading placeholder:text-light focus-visible:border-primary-dark w-full rounded-lg border px-4 py-3 text-sm"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <label
                    htmlFor="companySize"
                    className="text-heading text-xs font-bold tracking-wide uppercase"
                  >
                    Company Size / Staff Count{" "}
                    <span className="text-secondary-dark">*</span>
                  </label>
                  <select
                    id="companySize"
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    className="border-border bg-background text-heading focus-visible:border-primary-dark w-full cursor-pointer rounded-lg border px-4 py-3 text-sm"
                  >
                    {COMPANY_SIZE_OPTIONS.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* DYNAMIC FIELDS: PRACTITIONER */}
            {formData.partnershipType === "practitioner" && (
              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="areaOfSpecialty"
                  className="text-heading text-xs font-bold tracking-wide uppercase"
                >
                  Area of Practice / Specialty{" "}
                  <span className="text-secondary-dark">*</span>
                </label>
                <input
                  type="text"
                  id="areaOfSpecialty"
                  name="areaOfSpecialty"
                  placeholder="e.g. Clinical Nutrition, Physiotherapy, General Practice, Aesthetics"
                  value={formData.areaOfSpecialty}
                  onChange={handleChange}
                  required
                  className="border-border bg-background text-heading placeholder:text-light focus-visible:border-primary-dark w-full rounded-lg border px-4 py-3 text-sm"
                />
              </div>
            )}

            {/* DYNAMIC FIELDS: PRACTITIONER & AMBASSADOR */}
            {(formData.partnershipType === "practitioner" ||
              formData.partnershipType === "ambassador") && (
              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="websiteOrSocial"
                  className="text-heading text-xs font-bold tracking-wide uppercase"
                >
                  Website or Social Media Handle{" "}
                  <span className="text-secondary-dark">*</span>
                </label>
                <input
                  type="text"
                  id="websiteOrSocial"
                  name="websiteOrSocial"
                  placeholder="e.g. @wellnesscoach or www.yourclinic.com"
                  value={formData.websiteOrSocial}
                  onChange={handleChange}
                  required
                  className="border-border bg-background text-heading placeholder:text-light focus-visible:border-primary-dark w-full rounded-lg border px-4 py-3 text-sm"
                />
              </div>
            )}

            {/* Shared Free Text Area */}
            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="partnershipGoals"
                className="text-heading text-xs font-bold tracking-wide uppercase"
              >
                What are you hoping to achieve through this partnership?{" "}
                <span className="text-secondary-dark">*</span>
              </label>

              <textarea
                id="partnershipGoals"
                name="partnershipGoals"
                rows={3}
                placeholder="Tell us about your team goals, audience, or how you envision collaborating..."
                value={formData.partnershipGoals}
                onChange={handleChange}
                required
                className="scrollbar-hide border-border bg-background text-heading placeholder:text-light focus-visible:border-primary-dark w-full resize-none rounded-lg border px-4 py-3 text-sm"
              />
            </div>

            {/* Preferred Contact Method */}
            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="preferredContactMethod"
                className="text-heading text-xs font-bold tracking-wide uppercase"
              >
                Preferred Contact Method{" "}
                <span className="text-secondary-dark">*</span>
              </label>
              <select
                id="preferredContactMethod"
                name="preferredContactMethod"
                value={formData.preferredContactMethod}
                onChange={handleChange}
                className="border-border bg-background text-heading focus-visible:border-primary-dark w-full cursor-pointer rounded-lg border px-4 py-3 text-sm"
              >
                {CONTACT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            {/* Consent Checkbox */}
            <div className="pt-2 sm:col-span-2">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  required
                  className="border-border accent-primary-dark focus-visible:ring-primary-dark mt-0.5 h-4 w-4 rounded-sm focus-visible:ring-2 focus-visible:ring-offset-1"
                />
                <span className="text-body text-xs leading-relaxed">
                  I consent to Patina Wellness Solutions collecting and
                  processing my details for partnership evaluation and agree to
                  the{" "}
                  <a
                    href="#"
                    className="text-primary-dark font-semibold underline"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-primary-dark font-semibold underline"
                  >
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
            </div>
          </div>

          {error && (
            <div className="border-danger/30 bg-danger/10 rounded-lg border p-3">
              <p className="text-danger text-sm font-semibold">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting || isSubmitted}
              className="w-full justify-center px-5 py-3.5 text-sm sm:w-auto sm:px-8"
              rightIcon={
                <PaperPlaneRightIcon
                  size={18}
                  weight="bold"
                  className="shrink-0"
                />
              }
            >
              <span className="text-center whitespace-normal">
                {isSubmitting
                  ? "Submitting Application..."
                  : "Submit Partnership Application"}
              </span>
            </Button>
          </div>
        </form>
      </Reveal>
    </div>
  );
}

export default PartnershipFormContent;
