"use client";

import {
  ArrowLeftIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  KeyIcon,
  PaperPlaneRightIcon,
} from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useState } from "react";

import Button from "@/app/components/shared/Button";
import Container from "@/app/components/shared/Container";
import Section from "@/app/components/shared/Section";
import { useAuth } from "@/app/providers/AuthProvider";

import Reveal from "@/app/components/animations/Reveal";
import Stagger from "@/app/components/animations/Stagger";
import StaggerItem from "@/app/components/animations/StaggerItem";
import Presence from "@/app/components/animations/Presence";
import PresenceItem from "@/app/components/animations/PresenceItem";

function ForgotPasswordPage() {
  const { forgotPassword, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const handleSubmit = async function (e) {
    e.preventDefault();
    setStatusMessage({ type: "", text: "" });

    const result = await forgotPassword(email);

    if (result.success) {
      setIsSubmitted(true);
      setStatusMessage({ type: "success", text: result.message });
    } else {
      setStatusMessage({ type: "error", text: result.message });
    }
  };

  return (
    <main className="bg-background flex min-h-screen flex-col justify-center">
      <Section className="py-12 sm:py-16">
        <Container className="max-w-md">
          <Reveal distance={16} duration={0.5}>
            <div className="border-border bg-surface rounded-xl border p-8 shadow-md sm:p-10">
              <Stagger delay={0.12} staggerDelay={0.08} className="space-y-8">
                {/* Header Badge & Title */}
                {/* <StaggerItem className="space-y-3 text-center">
                  <div className="bg-primary-light text-primary-dark mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full">
                    {isSubmitted ? (
                      <CheckCircleIcon size={32} weight="duotone" />
                    ) : (
                      <KeyIcon size={32} weight="duotone" />
                    )}
                  </div>

                  <div>
                    <span className="text-primary-dark text-xs font-bold tracking-wider uppercase">
                      Account Recovery
                    </span>
                    <h1 className="text-heading mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                      {isSubmitted ? "Check Your Email" : "Forgot Password"}
                    </h1>
                  </div>

                  <p className="text-xs leading-relaxed">
                    {isSubmitted
                      ? `We sent a password reset link to ${email}. Please check your inbox and follow the instructions.`
                      : "Enter your registered email address below and we'll send you a link to reset your password."}
                  </p>
                </StaggerItem> */}
                <StaggerItem className="text-center">
                  <Presence mode="wait">
                    {isSubmitted ? (
                      <PresenceItem key="success-header" distance={10}>
                        <div className="space-y-3">
                          <div className="bg-primary-light text-primary-dark mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full">
                            <CheckCircleIcon size={32} weight="duotone" />
                          </div>

                          <div>
                            <span className="text-primary-dark text-xs font-bold tracking-wider uppercase">
                              Account Recovery
                            </span>

                            <h1 className="text-heading mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                              Check Your Email
                            </h1>
                          </div>

                          <p className="text-xs leading-relaxed">
                            {`We sent a password reset link to ${email}. Please check your inbox and follow the instructions.`}
                          </p>
                        </div>
                      </PresenceItem>
                    ) : (
                      <PresenceItem key="request-header" distance={10}>
                        <div className="space-y-3">
                          <div className="bg-primary-light text-primary-dark mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full">
                            <KeyIcon size={32} weight="duotone" />
                          </div>

                          <div>
                            <span className="text-primary-dark text-xs font-bold tracking-wider uppercase">
                              Account Recovery
                            </span>

                            <h1 className="text-heading mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                              Forgot Password
                            </h1>
                          </div>

                          <p className="text-xs leading-relaxed">
                            Enter your registered email address below and
                            we&apos;ll send you a link to reset your password.
                          </p>
                        </div>
                      </PresenceItem>
                    )}
                  </Presence>
                </StaggerItem>

                {/* Error Message Display */}
                {statusMessage.text && statusMessage.type === "error" && (
                  <StaggerItem className="border-danger/30 bg-danger/10 text-danger rounded-lg border p-4 text-xs font-semibold">
                    {statusMessage.text}
                  </StaggerItem>
                )}

                <StaggerItem>
                  <Presence mode="wait">
                    {!isSubmitted ? (
                      // Request Form
                      <PresenceItem key="request">
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="space-y-2">
                            <label
                              htmlFor="email"
                              className="text-heading text-xs font-bold tracking-wide uppercase"
                            >
                              Email Address{" "}
                              <span className="text-secondary-dark">*</span>
                            </label>

                            <div className="relative">
                              <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                placeholder="e.g. johndoe@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border-border bg-background text-heading placeholder:text-light focus:border-primary-dark focus:ring-primary-dark w-full rounded-md border py-3 pr-4 pl-10 text-sm focus:ring-1 focus:outline-hidden"
                              />

                              <div className="text-muted pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <EnvelopeIcon size={18} weight="duotone" />
                              </div>
                            </div>
                          </div>

                          <Button
                            type="submit"
                            loading={loading}
                            disabled={loading}
                            className="w-full justify-center py-3.5"
                            rightIcon={
                              <PaperPlaneRightIcon size={18} weight="bold" />
                            }
                          >
                            {loading ? "Sending link..." : "Send Reset Link"}
                          </Button>
                        </form>
                      </PresenceItem>
                    ) : (
                      // Resend/Try Again Control
                      <PresenceItem key="success">
                        <div className="space-y-4 pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-center py-3"
                            onClick={() => setIsSubmitted(false)}
                          >
                            Resend Request
                          </Button>
                        </div>
                      </PresenceItem>
                    )}
                  </Presence>
                </StaggerItem>

                {/* Back too Login */}
                <StaggerItem className="border-border border-t pt-6 text-center">
                  <Link
                    href="/admin/login"
                    className="text-primary-dark inline-flex items-center gap-1.5 text-xs font-bold underline-offset-3 hover:underline"
                  >
                    <ArrowLeftIcon size={14} weight="bold" />
                    Back to Login
                  </Link>
                </StaggerItem>
              </Stagger>
            </div>
          </Reveal>
        </Container>
      </Section>
    </main>
  );
}

export default ForgotPasswordPage;
