"use client";

import {
  ArrowLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  LockKeyIcon,
  ShieldCheckIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { useAuth } from "@/app/providers/AuthProvider";

import Button from "../shared/Button";
import Link from "next/link";

import Reveal from "../animations/Reveal";
import Stagger from "../animations/Stagger";
import StaggerItem from "../animations/StaggerItem";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { resetPassword, loading } = useAuth();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const handleSubmit = async function (e) {
    e.preventDefault();
    setStatusMessage({ type: "", text: "" });

    if (!token) {
      setStatusMessage({
        type: "error",
        text: "Invalid or missing reset token. Please request a new link.",
      });

      return;
    }

    if (newPassword.length < 8) {
      setStatusMessage({
        type: "error",
        text: "Password must be at least 8 characters long.",
      });

      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage({
        type: "error",
        text: "Passwords do not match.",
      });

      return;
    }

    const result = await resetPassword(token, newPassword);

    if (result.success) {
      setStatusMessage({
        type: "success",
        text: result.message || "Password updated! Redirecting to login...",
      });

      setTimeout(() => {
        router.push("/admin/login");
      }, 2000);
    } else {
      setStatusMessage({ type: "error", text: result.message });
    }
  };

  return (
    <Reveal distance={16} duration={0.5}>
      <div className="border-border bg-surface rounded-xl border p-8 shadow-md sm:p-10">
        {/* Header */}
        <Stagger delay={0.12} staggerDelay={0.08} className="space-y-8">
          <StaggerItem className="space-y-3 text-center">
            <div className="bg-primary-light text-primary-dark mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full">
              <LockKeyIcon size={32} weight="duotone" />
            </div>

            <div>
              <span className="text-primary-dark text-xs font-bold tracking-wider uppercase">
                Security Update
              </span>

              <h1 className="text-heading mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Set New Password
              </h1>
            </div>

            <p className="text-xs leading-relaxed">
              Please enter and confirm your new secure password below.
            </p>
          </StaggerItem>

          <StaggerItem>
            {/* Missing Token Alert */}
            {!token && (
              <div className="border-warning/30 bg-warning/10 text-warning-dark flex items-start gap-2.5 rounded-lg border p-4 text-xs font-medium">
                <WarningCircleIcon
                  size={18}
                  weight="bold"
                  className="mt-0.5 shrink-0"
                />

                <span>
                  No valid reset token found in URL. Please use the link
                  provided in your email or request a new password reset.
                </span>
              </div>
            )}

            {/* Status Feedback Banner */}
            {statusMessage.text && (
              <div
                className={`rounded-lg border p-4 text-xs font-semibold ${
                  statusMessage.type === "success"
                    ? "border-primary-dark/30 bg-primary-light text-primary-dark"
                    : "border-danger/30 bg-danger/10 text-danger"
                }`}
              >
                {statusMessage.text}
              </div>
            )}
          </StaggerItem>

          <StaggerItem>
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="newPassword"
                  className="text-heading text-xs font-bold tracking-wide uppercase"
                >
                  New Password <span className="text-secondary-dark">*</span>
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    required
                    disabled={!token}
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border-border bg-background text-heading placeholder:text-light focus:border-primary-dark focus:ring-primary-dark w-full rounded-md border py-3 pr-10 pl-10 text-sm focus:ring-1 focus:outline-hidden disabled:opacity-50"
                  />

                  <div className="text-muted pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <LockKeyIcon size={18} weight="duotone" />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-muted hover:text-heading absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <EyeSlashIcon size={18} weight="bold" />
                    ) : (
                      <EyeIcon size={18} weight="bold" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-heading text-xs font-bold tracking-wide uppercase"
                >
                  Confirm New Password{" "}
                  <span className="text-secondary-dark">*</span>
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    disabled={!token}
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-border bg-background text-heading placeholder:text-light focus:border-primary-dark focus:ring-primary-dark w-full rounded-md border py-3 pr-10 pl-10 text-sm focus:ring-1 focus:outline-hidden disabled:opacity-50"
                  />

                  <div className="text-muted pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <LockKeyIcon size={18} weight="duotone" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                loading={loading}
                disabled={loading || !token}
                className="w-full justify-center py-3.5"
                rightIcon={<ShieldCheckIcon size={20} weight="bold" />}
              >
                {loading ? "Updating Password..." : "Reset Password"}
              </Button>
            </form>
          </StaggerItem>

          {/* Back to Login */}
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
  );
}

export default ResetPasswordContent;
