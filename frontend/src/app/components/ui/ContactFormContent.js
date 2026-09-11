"use client";

import { useState } from "react";
import { PaperPlaneRightIcon } from "@phosphor-icons/react/dist/ssr";
import Button from "../shared/Button";
import { createInquiry } from "@/app/lib/api/inquiries";

function ContactFormContent() {
  const initialState = {
    fullName: "",
    email: "",
    phone: "",
    topic: "general",
    message: "",
  };

  const [formData, setFormData] = useState(initialState);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = function (e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (success) {
      setSuccess(false);
    }

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async function (e) {
    e.preventDefault();

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const response = await createInquiry({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        topic: formData.topic,
        message: formData.message,
      });

      console.log("Inquiry submitted:", response);

      // Reset Form
      setFormData(initialState);

      setSuccess(true);
    } catch (error) {
      console.error("Submit Inquiry Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to submit your inquiry. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid-cols1 grid gap-6 sm:grid-cols-2">
        {/* Full Name */}
        <div className="space-y-2">
          <label
            htmlFor="fullName"
            className="text-heading text-xs font-bold tracking-wide uppercase"
          >
            Full Name <span className="text-secondary">*</span>
          </label>

          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            placeholder="e.g. Dr. Jane Doe"
            className="border-border bg-background text-heading placeholder:text-light focus:border-primary-dark focus:ring-primary-dark w-full rounded-md border px-4 py-3 text-sm focus:ring-1 focus:outline-hidden"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-heading text-xs font-bold tracking-wide uppercase"
          >
            Email Address <span className="text-secondary">*</span>
          </label>

          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="e.g. jane@example.com"
            className="border-border bg-background text-heading placeholder:text-light focus:border-primary-dark focus:ring-primary-dark w-full rounded-md border px-4 py-3 text-sm focus:ring-1 focus:outline-hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Phone */}
        <div className="space-y-2">
          <label
            htmlFor="phone"
            className="text-heading text-xs font-bold tracking-wide uppercase"
          >
            Phone Number
          </label>

          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+234..."
            className="border-border bg-background text-heading placeholder:text-light focus:border-primary-dark focus:ring-primary-dark w-full rounded-md border px-4 py-3 text-sm focus:ring-1 focus:outline-hidden"
          />
        </div>

        {/* Topic Dropdown */}
        <div className="space-y-2">
          <label
            htmlFor="topic"
            className="text-heading text-xs font-bold tracking-wide uppercase"
          >
            Inquiry Topic
          </label>

          <select
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className="border-border bg-background text-heading focus:border-primary-dark focus:ring-primary-dark w-full rounded-md border px-4 py-3 text-sm focus:ring-1 focus:outline-hidden"
          >
            <option value="general">General Inquiry</option>
            <option value="consultation">Consultation Booking</option>
            <option value="testing">Testing Panels & Bio-Analysis</option>
            <option value="membership">
              The Patina&apos;s Circle Membership
            </option>
          </select>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label
          htmlFor="message"
          className="text-heading text-xs font-bold tracking-wide uppercase"
        >
          Your Message <span className="text-secondary">*</span>
        </label>

        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          required
          placeholder="Tell us how we can help you..."
          className="scrollbar-hide border-border bg-background text-heading placeholder:text-light focus:border-primary-dark focus:ring-primary-dark w-full resize-none rounded-md border px-4 py-3 focus:ring-1 focus:outline-hidden"
        />
      </div>

      {error && (
        <div className="border-danger/30 bg-danger/10 rounded-lg border p-3">
          <p className="text-danger text-sm font-semibold">{error}</p>
        </div>
      )}

      {success && (
        <div className="border-primary-dark/30 bg-primary-light rounded-lg border p-3">
          <p className="text-primary-dark text-sm font-semibold">
            Your Inquiry has been submitted successfully. We&apos;ll get back to
            you soon.
          </p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full justify-center py-3.5"
        rightIcon={<PaperPlaneRightIcon size={18} weight="bold" />}
        loading={submitting}
        disabled={submitting}
      >
        {submitting ? "Sending..." : "Send Inquiry"}
      </Button>
    </form>
  );
}

export default ContactFormContent;
