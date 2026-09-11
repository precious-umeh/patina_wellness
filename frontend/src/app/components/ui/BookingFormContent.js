"use client";

import {
  CheckCircleIcon,
  InfoIcon,
  PaperPlaneRightIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { services } from "@/app/data/services";
import { testingPanels } from "@/app/data/testingPanels";

import server from "@/app/lib/axiosClient";

import Button from "../shared/Button";

import Reveal from "../animations/Reveal";
import FadeUp from "../animations/FadeUp";

const REFERRAL_SOURCES = [
  "Social Media (Instagram/Snapchat)",
  "Friend or Family Referral",
  "Doctor or Healthcare Professional",
  "Google Search",
  "Other",
];

// Helper: Formats ISO date string (YYYY-MM-DD) to Display format (DD-MM-YYYY)
function formatDateToDisplay(isoDateString) {
  if (!isoDateString) return "";
  const [year, month, day] = isoDateString.split("-");
  return `${day}-${month}-${year}`;
}

function BookingFormContent() {
  const searchParams = useSearchParams();

  /**
   * Combined options list for fast lookup by ID
   */
  const allBookingOptions = useMemo(() => {
    const serviceItems = services.map((s) => ({
      id: s.id,
      name: s.title,
      price: s.price,
      type: "Care Plan",
    }));

    const panelItems = testingPanels.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      type: "Testing Panel",
    }));

    return [...serviceItems, ...panelItems];
  }, []);

  /**
   * Derive the selected service ID directly during render
   */
  const initialServiceId = useMemo(() => {
    const param = searchParams.get("service") || searchParams.get("panel");

    if (param) {
      const matched = allBookingOptions.find(
        (item) => item.id.toLowerCase() === param.toLowerCase(),
      );

      if (matched) return matched.id;
    }

    // Default to first service if no match or parameter is present
    return services.length > 0 ? services[0].id : "";
  }, [searchParams, allBookingOptions]);

  /**
   * Initial State
   */
  const initialState = {
    selectedService: initialServiceId,
    appointmentType: "virtual",
    appointmentDate: "",
    appointmentTime: "",

    fullName: "",
    phoneNumber: "",
    email: "",
    ageBracket: "25-34",
    gender: "female",

    primaryConcern: "",
    currentMedications: "",
    existingConditions: "",
    referralSource: REFERRAL_SOURCES[0],
    referralCode: "",
    consent: false,
  };

  // Form State
  const [formData, setFormData] = useState(initialState);

  const [dateError, setDateError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");
  const [submitError, setSubmitError] = useState("");

  /**
   * Fetch Available Slots
   */
  const fetchAvailableSlots = async function (date) {
    if (!date) return;

    setIsLoadingSlots(true);
    setAvailabilityError("");
    setAvailableSlots([]);

    try {
      const response = await server.get(
        "/api/get-consultation-available-slots",
        { params: { date } },
      );

      const data = response.data;

      if (!data.available) {
        setAvailabilityError(
          data.reason || "Consultation bookings are unavailable for this date.",
        );

        setAvailableSlots([]);
        return;
      }

      setAvailableSlots(data.timeSlots);
    } catch (error) {
      console.error("Fetch Available Slots Error:", error);

      setAvailableSlots([]);

      setAvailabilityError(
        error.response?.data?.message ||
          "Unable to retrieve available time slots.",
      );
    } finally {
      setIsLoadingSlots(false);
    }
  };

  /**
   * Calculate Today's Date in YYYY-MM-DD format for native HTML5 input `min` attribute
   */
  const todayISO = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  /**
   * Smooth Scroll to top when user submits the form successfully
   */
  useEffect(() => {
    if (isSubmitted) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isSubmitted]);

  /**
   * Date Selection Validation
   */
  const handleDateChange = function (e) {
    const selectedDate = e.target.value; // Format: YYYY-MM-DD

    setDateError("");
    setAvailabilityError("");
    setAvailableSlots([]);

    if (!selectedDate) {
      setFormData((prev) => ({
        ...prev,
        appointmentDate: "",
        appointmentTime: "",
      }));

      return;
    }

    if (selectedDate < todayISO) {
      setDateError("Past dates are not available for selection.");
      setFormData((prev) => ({
        ...prev,
        appointmentDate: "",
        appointmentTime: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      appointmentDate: selectedDate,
      appointmentTime: "",
    }));

    fetchAvailableSlots(selectedDate);
  };

  /**
   * Handle Form Value Change
   */
  const handleChange = function (e) {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /**
   * Handle Form Submission
   */
  const handleSubmit = async function (e) {
    e.preventDefault();

    setSubmitError("");

    if (!formData.appointmentDate) {
      setDateError("Please select a valid appointment date.");
      return;
    }

    if (!formData.appointmentTime) {
      setSubmitError("Please select an available appointment time.");
      return;
    }

    if (!formData.consent) {
      setSubmitError(
        "Please consent to the Terms & Privacy Policy to proceed.",
      );
      return;
    }

    setIsSubmitting(true);

    // Find complete service ogbject from allBookingOptions Using ID string
    const fullServiceObject = allBookingOptions.find(
      (service) => service.id === formData.selectedService,
    );

    // Prepare Payload with full object
    const payload = {
      ...formData,
      selectedService: fullServiceObject,
    };

    try {
      const response = await server.post("/api/create-booking", payload);

      console.log("Booking created:", response.data);

      setIsSubmitted(true);
    } catch (error) {
      console.error("Create Booking Error:", error);

      setSubmitError(
        error.response?.data?.message ||
          "Unable to submit your consultation booking. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentSelection = allBookingOptions.find(
    (item) => item.id === formData.selectedService,
  );

  /**
   * Handle Submit Another Session
   */
  const handleSubmitAnother = function () {
    setFormData(initialState);
    setDateError("");
    setAvailabilityError("");
    setSubmitError("");
    setAvailableSlots([]);
    setIsSubmitted(false);
  };

  /**
   * ==============================
   * Success Confirmation Screen
   * ==============================
   */
  if (isSubmitted) {
    return (
      <Reveal direction="up">
        <div className="border-border bg-surface mx-auto max-w-2xl rounded-xl border p-8 text-center shadow-md sm:p-10">
          <div className="bg-primary-light text-primary-dark mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <CheckCircleIcon size={36} weight="fill" />
          </div>

          <h2 className="text-heading text-2xl font-bold tracking-tight sm:text-3xl">
            Consultation Request Submitted
          </h2>

          <p className="mt-3 text-sm">
            Thank you,{" "}
            <strong className="text-heading font-semibold">
              {formData.fullName}
            </strong>
            . We have received your clinical intake for{" "}
            <strong className="text-heading font-semibold">
              {currentSelection?.name}
            </strong>
            .
          </p>

          {/* Appointment Summary Box */}
          <div className="border-border bg-background my-6 space-y-2 rounded-lg border p-6 text-left text-sm">
            <h4 className="text-heading pb-1 text-base font-bold">
              Appointment Details:
            </h4>

            <p>
              <strong className="text-heading font-semibold">
                Selected Service:
              </strong>{" "}
              {currentSelection?.name} ({currentSelection?.price})
            </p>

            <p>
              <strong className="text-heading font-semibold">
                Consultation Type:
              </strong>{" "}
              {formData.appointmentType === "virtual"
                ? "Virtual (Online)"
                : "Physical (In-Person / Home)"}
            </p>

            <p>
              <strong className="text-heading font-semibold">
                Date (DD-MM-YYYY):
              </strong>{" "}
              {formatDateToDisplay(formData.appointmentDate)}
            </p>

            <p>
              <strong className="text-heading font-semibold">Time Slot:</strong>{" "}
              {formData.appointmentTime}
            </p>

            <p>
              <strong className="text-heading font-semibold">
                WhatsApp Phone:
              </strong>{" "}
              {formData.phoneNumber}
            </p>
          </div>

          <p className="text-muted text-xs">
            Our team will review your health profile and confirm your
            appointment time slot via WhatsApp or Email within 2 business hours.
          </p>

          <div className="mt-8">
            <Button onClick={handleSubmitAnother}>Book Another Session</Button>
          </div>
        </div>
      </Reveal>
    );
  }

  return (
    <FadeUp>
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* STEP 1: Service & Schedule */}
        <div className="border-border bg-surface space-y-6 rounded-xl border p-6 shadow-2xs sm:p-8">
          <div className="border-border flex items-center gap-3 border-b pb-4">
            <span className="bg-primary-light text-primary-dark flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
              1
            </span>

            <h2 className="text-heading text-xl font-bold tracking-tight sm:text-2xl">
              Select Package & Appointment Schedule
            </h2>
          </div>

          <div className="space-y-6">
            {/* Grouped Service Dropdown */}
            <div className="space-y-2">
              <label
                htmlFor="selectedService"
                className="text-heading text-xs font-bold tracking-wide uppercase"
              >
                Package or Testing Panel{" "}
                <span className="text-secondary-dark">*</span>
              </label>

              <select
                id="selectedService"
                name="selectedService"
                value={formData.selectedService}
                onChange={handleChange}
                className="border-border bg-background text-heading focus-visible:border-primary-dark w-full rounded-lg border px-4 py-3 text-sm"
              >
                <optgroup label="Consultation & Care plans">
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} - {s.price}
                    </option>
                  ))}
                </optgroup>

                <optgroup label="Functional testing Panels">
                  {testingPanels.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - {p.price}
                    </option>
                  ))}
                </optgroup>
              </select>

              {currentSelection && (
                <p className="text-primary-dark pt-1 text-xs font-bold">
                  Selected: {currentSelection.name} ({currentSelection.price})
                </p>
              )}
            </div>

            {/* Appointment Type */}
            <div className="space-y-2">
              <label className="text-heading text-xs font-bold tracking-wide uppercase">
                Preferred Appointment Format{" "}
                <span className="text-secondary-dark">*</span>
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      appointmentType: "virtual",
                    }))
                  }
                  className={`flex items-center justify-center gap-2 rounded-lg border py-3 text-sm font-semibold transition-all ${
                    formData.appointmentType === "virtual"
                      ? "border-primary-dark bg-primary-light text-primary-dark shadow-2xs"
                      : "border-border bg-background hover:border-primary-dark/40"
                  }`}
                >
                  Virtual Consultation
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      appointmentType: "physical",
                    }))
                  }
                  className={`flex items-center justify-center gap-2 rounded-lg border py-3 text-sm font-semibold transition-all ${
                    formData.appointmentType === "physical"
                      ? "border-primary-dark bg-primary-light text-primary-dark shadow-2xs"
                      : "border-border bg-background hover:border-primary-dark/40"
                  }`}
                >
                  Physical (In-Person / Home)
                </button>
              </div>
            </div>

            {/* Date & Time Picker */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="appointmentDate"
                  className="text-heading text-xs font-bold tracking-wide uppercase"
                >
                  Preferred date <span className="text-secondary-dark">*</span>
                </label>

                <input
                  type="date"
                  id="appointmentDate"
                  name="appointmentDate"
                  min={todayISO}
                  value={formData.appointmentDate}
                  onChange={handleDateChange}
                  required
                  className="border-border bg-background text-heading focus-visible:border-primary-dark w-full rounded-lg border px-4 py-3 text-sm"
                />

                {dateError && (
                  <div className="text-danger flex items-center gap-1.5 rounded-lg pt-1 text-xs font-medium">
                    <InfoIcon size={16} weight="bold" />
                    <span>{dateError}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="appointmentTime"
                  className="text-heading text-xs font-bold tracking-wide uppercase"
                >
                  Preferred Time Slot{" "}
                  <span className="text-secondary-dark">*</span>
                </label>

                <select
                  id="appointmentTime"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleChange}
                  required
                  disabled={!formData.appointmentDate || isLoadingSlots}
                  className="border-border bg-background text-heading focus-visible:border-primary-dark w-full rounded-lg border px-4 py-3 text-sm disabled:opacity-50"
                >
                  <option value="">
                    {isLoadingSlots
                      ? "Checking availability"
                      : !formData.appointmentDate
                        ? "Select a date first..."
                        : availableSlots.length === 0
                          ? "No available time slots"
                          : "Select a time slot..."}
                  </option>

                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>

                {availabilityError && (
                  <div className="text-secondary-dark flex items-center gap-1.5 rounded-lg pt-1 text-xs font-medium">
                    <InfoIcon size={16} weight="bold" />
                    <span>{availabilityError}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* STEP 2: Patient Contact */}
        <div className="border-border bg-surface space-y-6 rounded-xl border p-6 shadow-2xs sm:px-8">
          <div className="border-border flex items-center gap-3 border-b pb-4">
            <span className="bg-primary-light text-primary-dark flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
              2
            </span>

            <h2 className="text-heading tarcking-tight text-xs font-bold sm:text-2xl">
              Patient Information
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="fullName"
                className="text-heading text-xs font-bold tracking-wide uppercase"
              >
                Full Name <span className="text-secondary-dark">*</span>
              </label>

              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="e.g. Jane Doe"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="border-border bg-background text-heading placeholder:text-light focus-visible:border-primary-dark w-full rounded-lg border px-4 py-3 text-sm"
              />
            </div>

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
                className="border-border bg-background text-heading placeholder:text-light focus-visible:border-primary-dark w-full rounded-lg px-4 py-3 text-sm"
              />
              <p className="text-primary-dark pt-0.5 text-xs font-medium">
                WhatsApp-enabled preferred
              </p>
            </div>

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
                placeholder="jane@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="border-border bg-background text-heading placeholder:text-light focus-visible:border-primary-dark w-full rounded-lg border px-4 py-3 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="ageBracket"
                className="text-heading text-xs font-bold tracking-wide uppercase"
              >
                Age Bracket <span className="text-secondary-dark">*</span>
              </label>

              <select
                id="ageBracket"
                name="ageBracket"
                value={formData.ageBracket}
                onChange={handleChange}
                className="border-border bg-background text-heading focus-visible:border-primary-dark w-full rounded-lg border px-4 py-3 text-sm"
              >
                <option value="under-18">Under 18</option>
                <option value="18-24">18 - 24 years</option>
                <option value="25-34">25 - 34 years</option>
                <option value="35-44">35 - 44 years</option>
                <option value="45-54">45 - 54 years</option>
                <option value="55-64">55 - 64 years</option>
                <option value="65+">65+ years</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="gender"
                className="text-heading text-xs font-bold tracking-wide uppercase"
              >
                Gender <span className="text-secondary-dark">*</span>
              </label>

              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="border-border text-heading bg-background focus-visible:border-primary-dark w-full rounded-lg border px-4 py-3 text-sm"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>

        {/* STEP 3: Clinical Health Intake */}
        <div className="border-border bg-surface space-y-6 rounded-xl border p-6 shadow-2xs sm:p-8">
          <div className="border-border flex items-center gap-3 border-b pb-4">
            <span className="bg-primary-light text-primary-dark flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
              3
            </span>

            <h2 className="text-heading text-xs font-bold tracking-tight sm:text-2xl">
              Clinical Health Profile
            </h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="primaryConcern"
                className="text-heading text-xs font-bold tracking-wide uppercase"
              >
                Primary Health Concern / Reason for Consultation{" "}
                <span className="text-secondary-dark">*</span>
              </label>

              <textarea
                id="primaryConcern"
                name="primaryConcern"
                rows={3}
                placeholder="Describe symptoms, health goals, or specific concerns you want to discuss..."
                value={formData.primaryConcern}
                onChange={handleChange}
                className="scrollbar-hide border-border bg-background text-heading placeholder:text-light focus-visible:border-primary-dark w-full resize-none rounded-lg border px-4 py-3 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="currentMedications"
                className="text-heading text-xs font-bold tracking-wide uppercase"
              >
                Current Medications & Supplements
              </label>

              <textarea
                id="currentMedications"
                name="currentMedications"
                rows={2}
                placeholder="List any prescriptions, vitamins, or herbal supplements..."
                value={formData.currentMedications}
                onChange={handleChange}
                className="scrollbar-hide border-border bg-background text-heading placeholder:text-light focus-visible:border-primary-dark w-full resize-none rounded-lg border px-4 py-3 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="existingConditions"
                className="text-heading text-xs font-bold tracking-wide uppercase"
              >
                Existing Diagnosed Conditions{" "}
                <span className="text-muted font-normal">(Optional)</span>
              </label>
              <textarea
                id="existingConditions"
                name="existingConditions"
                rows={2}
                placeholder="e.g. Hypertension, Thyroid dysfunction, PCOS, Type 2 Diabetes..."
                value={formData.existingConditions}
                onChange={handleChange}
                className="scrollbar-hide border-border bg-background text-heading placeholder:text-light focus-visible:border-primary-dark w-full resize-none rounded-lg border px-4 py-3 text-sm"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="referralSource"
                className="text-heading text-xs font-bold tracking-wide uppercase"
              >
                How did you hear about Patina Wellness Solutions?
              </label>
              <select
                id="referralSource"
                name="referralSource"
                value={formData.referralSource}
                onChange={handleChange}
                className="border-border bg-background text-heading focus-visible:border-primary-dark w-full rounded-lg border px-4 py-3 text-sm"
              >
                {REFERRAL_SOURCES.map((source) => (
                  <option
                    key={source}
                    value={source}
                    className="bg-background text-heading py-2"
                  >
                    {source}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="referralCode"
                className="text-heading text-xs font-bold tracking-wide uppercase"
              >
                Referral or Promo Code{" "}
                <span className="text-muted font-normal">(Optional)</span>
              </label>

              <input
                type="text"
                id="referralCode"
                name="referralCode"
                placeholder="e.g. AMB-ALEX or DR-NNEKA"
                value={formData.referralCode}
                onChange={handleChange}
                className="border-border bg-background text-heading placeholder:text-light focus-visible:border-primary-dark w-full rounded-lg border px-4 py-3 text-sm uppercase placeholder:text-xs"
              />
            </div>

            <div className="pt-2">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  required
                  className="border-border accent-primary-dark focus-visible:ring-primary-hover mt-0.5 h-4 w-4 cursor-pointer rounded-sm focus-visible:ring-2 focus-visible:ring-offset-1"
                />

                <span className="text-xs leading-relaxed">
                  I consent to Patina Wellness Solutions processing my clinical
                  details for intake purposes and agree to the{" "}
                  <a
                    href="#"
                    className="text-primary-dark font-semibold underline underline-offset-3"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-primary-dark font-semibold underline underline-offset-3"
                  >
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {submitError && (
            <div className="text-danger flex items-center gap-1.5 rounded-lg pt-1 text-xs font-medium">
              <InfoIcon size={16} weight="bold" />
              <span>{submitError}</span>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting || isSubmitted}
              className="w-full justify-center px-8 py-3.5 sm:w-auto"
              rightIcon={<PaperPlaneRightIcon size={18} weight="bold" />}
            >
              {isSubmitting
                ? "Processing Request..."
                : "Request Consultation Appointment"}
            </Button>
          </div>
        </div>
      </form>
    </FadeUp>
  );
}

export default BookingFormContent;
