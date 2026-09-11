"use client";

import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  LockKeyIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react/dist/ssr";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Button from "../shared/Button";
import { useAuth } from "@/app/providers/AuthProvider";

export default function LoginForm() {
  const router = useRouter();

  const { login, isLoggingIn } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = function (e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async function (e) {
    e.preventDefault();
    setErrorMsg("");

    const result = await login(formData);

    if (!result.success) {
      setErrorMsg(result.message);
      return;
    }

    setFormData({
      email: "",
      password: "",
    });

    router.replace("/admin");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errorMsg && (
        <div className="border-danger/30 bg-danger/10 text-danger rounded-lg border p-4 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Email Input */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-heading text-xs font-bold tracking-wide uppercase"
        >
          Admin Email Address <span className="text-secondary-dark">*</span>
        </label>

        <div className="relative">
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="e.g. johndoe@example.com"
            value={formData.email}
            onChange={handleChange}
            className="border-border bg-background text-heading placeholder:text-light focus:border-primary-dark focus:ring-primary-dark w-full rounded-md border py-3 pr-4 pl-10 text-sm focus:ring-1 focus:outline-hidden"
          />

          <div className="text-muted pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <EnvelopeIcon size={18} weight="duotone" />
          </div>
        </div>
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="text-heading text-xs font-bold tracking-wide uppercase"
          >
            Password <span className="text-secondary-dark">*</span>
          </label>

          <Link
            href="/forgot-password"
            className="text-primary-dark inline-block text-xs font-bold underline-offset-3 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            required
            placeholder="••••••••••••••••"
            value={formData.password}
            onChange={handleChange}
            className="border-border bg-background text-heading placeholder:text-light focus:border-primary-dark focus:ring-primary-dark w-full rounded-md border py-3 pr-10 pl-10 text-sm focus:ring-1 focus:outline-hidden"
          />

          <div className="text-muted pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <LockKeyIcon size={18} weight="duotone" />
          </div>

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-muted hover:text-heading absolute inset-y-0 right-0 flex items-center pr-3"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeSlashIcon size={18} weight="bold" />
            ) : (
              <EyeIcon size={18} weight="bold" />
            )}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        loading={isLoggingIn}
        disabled={isLoggingIn}
        className="w-full justify-center py-3.5"
        rightIcon={<ShieldCheckIcon size={20} weight="bold" />}
      >
        {isLoggingIn ? "Authenticating..." : "Sign In"}
      </Button>
    </form>
  );
}
