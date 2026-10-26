"use client";

import { useRef, useState } from "react";
import {
  CameraIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  ImageIcon,
  LockKeyIcon,
  PaperPlaneTiltIcon,
  ShieldCheckIcon,
  TrashIcon,
  XIcon,
  UserCircleIcon,
  UserIcon,
} from "@phosphor-icons/react/dist/ssr";

import Button from "@/app/components/shared/Button";
import Container from "@/app/components/shared/Container";
import AdminPageHeader from "@/app/components/admin/AdminPageHeader";

import { useAuth } from "@/app/providers/AuthProvider";

import Reveal from "@/app/components/animations/Reveal";
import Stagger from "@/app/components/animations/Stagger";
import StaggerItem from "@/app/components/animations/StaggerItem";
import Image from "next/image";
import DeleteConfirmationModal from "@/app/components/shared/DeleteConfirmationModal";

function AdminProfilePage() {
  const {
    user,
    updateProfile,
    requestEmailChange,
    changePassword,
    isUpdatingProfile,
    isRequestingEmailChange,
    isChangingPassword,
  } = useAuth();

  // Personal Info Form State
  const [name, setName] = useState(user?.name || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [profileStatus, setProfileStatus] = useState({ type: "", text: "" });

  const fileInputRef = useRef(null);

  // Change Email Form State
  const [newEmail, setNewEmail] = useState("");
  const [emailCurrentPassword, setEmailCurrentPassword] = useState("");
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [emailStatus, setEmailStatus] = useState({ type: "", text: "" });

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState({ type: "", text: "" });

  const [showRemoveAvatarModal, setShowRemoveAvatarModal] = useState(false);
  const [shouldRemoveAvatar, setShouldRemoveAvatar] = useState(false);

  // Handle Name & Avatar Update
  const handleProfileSubmit = async function (e) {
    e.preventDefault();
    setProfileStatus({ type: "", text: "" });

    const formData = new FormData();
    formData.append("name", name);

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    if (shouldRemoveAvatar) {
      formData.append("removeAvatar", "true");
    }

    const result = await updateProfile(formData);

    if (result?.success) {
      setAvatarFile(null);
      setShouldRemoveAvatar(false);
      setAvatarPreview(result.user?.avatar ?? "");
      setProfileStatus({
        type: "success",
        text: result.message || "Profile updated successfully!",
      });
    } else {
      setProfileStatus({
        type: "error",
        text: result?.message || "Failed to update profile.",
      });
    }
  };

  // Handle Avatar File Selection
  const handleAvatarChange = function (e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // Handle Remove Avatar
  const handleConfirmRemoveAvatar = function () {
    setShouldRemoveAvatar(true);
    setAvatarFile(null);
    setAvatarPreview("");
    setShowRemoveAvatarModal(false);
  };

  // Handle Request Email Change
  const handleEmailSubmit = async function (e) {
    e.preventDefault();
    setEmailStatus({ type: "", text: "" });

    if (newEmail.toLowerCase() === user?.email?.toLowerCase()) {
      setEmailStatus({
        type: "error",
        text: "New email is identical to your current email.",
      });

      return;
    }

    const result = await requestEmailChange(newEmail, emailCurrentPassword);

    if (result?.success) {
      setEmailStatus({
        type: "success",
        text: result.message,
      });

      setNewEmail("");
      setEmailCurrentPassword("");
    } else {
      setEmailStatus({
        type: "error",
        text: result?.message || "Failed to request email change.",
      });
    }
  };

  // Handle Password Update
  const handlePasswordSubmit = async function (e) {
    e.preventDefault();
    setPasswordStatus({ type: "", text: "" });

    if (newPassword.length < 8) {
      setPasswordStatus({
        type: "error",
        text: "New password must be at least 8 characters long.",
      });

      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordStatus({
        type: "error",
        text: "New Passwords do not match.",
      });

      return;
    }

    const result = await changePassword(currentPassword, newPassword);

    if (result?.success) {
      setPasswordStatus({
        type: "success",
        text: result?.message || "Password updated successfully!",
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setPasswordStatus({
        type: "error",
        text: result?.message || "Failed to update password.",
      });
    }
  };

  return (
    <Container className="w-full max-w-5xl space-y-8">
      {/* Header */}
      <AdminPageHeader
        eyebrow="Account Settings"
        title="Admin Profile"
        description="Manage your personal details, primary email address, and account
          credentials."
      />

      {/* User Badge Overview Card */}
      <Reveal delay={0.12}>
        <div className="border-border bg-surface flex flex-col items-center gap-6 rounded-xl border p-6 shadow-2xs sm:flex-row">
          <div className="border-border relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                fill
                unoptimized
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <div className="bg-primary-light text-primary-dark flex h-full w-full items-center justify-center text-2xl font-extrabold">
                {user?.name ? (
                  user.name.charAt(0).toUpperCase()
                ) : (
                  <UserCircleIcon size={48} weight="duotone" />
                )}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h2 className="text-heading truncate text-lg font-extrabold">
                {user?.name || "Admin Manager"}
              </h2>

              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                <ShieldCheckIcon size={12} weight="bold" />
                Super Admin
              </span>
            </div>

            <p className="text-muted text-xs font-medium break-all">
              {user?.email || "admin@patinawellness.com"}
            </p>

            <p className="text-body pt-1 text-[11px] wrap-break-word">
              Access Level: Full Portal & Catalog Adminstration
            </p>
          </div>
        </div>
      </Reveal>

      <Stagger
        delay={0.2}
        staggerDelay={0.08}
        className="grid grid-cols-1 gap-8 lg:grid-cols-3"
      >
        {/* Section 1: Update Name */}
        <StaggerItem className="border-border bg-surface flex flex-col justify-between space-y-6 rounded-xl border p-6 shadow-2xs">
          <div className="space-y-4">
            <div className="border-border border-b pb-4">
              <h3 className="text-heading flex items-center gap-2 font-extrabold">
                <UserIcon
                  size={20}
                  weight="duotone"
                  className="text-primary-dark"
                />
                <span>Personal Info</span>
              </h3>

              <p className="text-muted text-xs">
                Update your portal display name.
              </p>
            </div>

            {profileStatus.text && (
              <div
                className={`flex items-start justify-between gap-2 rounded-lg border p-3 text-xs font-semibold ${
                  profileStatus.type === "success"
                    ? "border-primary-dark/30 bg-primary-light text-primary-dark"
                    : "border-danger/30 bg-danger/10 text-danger"
                }`}
              >
                <span>{profileStatus.text}</span>
                <button
                  type="button"
                  onClick={() => setProfileStatus({ type: "", text: "" })}
                  className="shrink-0 opacity-60 transition-opacity hover:opacity-100"
                  aria-label="Dismiss"
                >
                  <XIcon size={13} weight="bold" />
                </button>
              </div>
            )}

            <form
              id="profile-form"
              onSubmit={handleProfileSubmit}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-heading text-xs font-bold tracking-wide uppercase">
                  Profile Photo
                </label>

                <div className="flex items-center gap-3">
                  {/* Avatar Preview with absolute remove badge */}
                  <div className="relative h-14 w-14 shrink-0">
                    <div className="border-border relative h-full w-full overflow-hidden rounded-full border-2">
                      {avatarPreview ? (
                        <Image
                          src={avatarPreview}
                          alt="Avatar preview"
                          fill
                          unoptimized
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="bg-primary-light text-primary-dark flex h-full w-full items-center justify-center text-lg font-extrabold">
                          {user?.name ? (
                            user.name.charAt(0).toUpperCase()
                          ) : (
                            <UserCircleIcon size={28} weight="duotone" />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Remove Avatar Badge */}
                    {(avatarPreview || avatarFile) && (
                      <button
                        type="button"
                        onClick={() => setShowRemoveAvatarModal(true)}
                        title="Remove photo"
                        aria-label="Remove photo"
                        className="bg-danger absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-white shadow-sm transition-opacity hover:opacity-90"
                      >
                        <TrashIcon size={9} weight="bold" />
                      </button>
                    )}
                  </div>

                  {/* Upload trigger button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-border bg-background text-heading hover:border-primary-dark hover:text-primary-dark flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-xs font-semibold transition-colors"
                  >
                    <CameraIcon size={15} weight="duotone" />
                    {avatarFile ? "Change Photo" : "Upload Photo"}
                  </button>

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="avatar"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/avif,image/webp"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>

                {/* Selected file Name Feedback */}
                {avatarFile && (
                  <p className="text-muted flex items-center gap-1.5 text-[11px]">
                    <ImageIcon size={12} weight="duotone" />
                    {avatarFile.name}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="text-heading text-xs font-bold tracking-wide uppercase"
                >
                  Full Name
                </label>

                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Admin Name"
                    className="border-border bg-background text-heading focus:border-primary-dark focus:ring-primary-dark w-full rounded-md border py-2.5 pr-3 pl-9 text-xs font-semibold focus:ring-1 focus:outline-hidden"
                  />

                  <div className="text-muted pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <UserIcon size={16} weight="duotone" />
                  </div>
                </div>
              </div>
            </form>
          </div>

          <Button
            type="submit"
            form="profile-form"
            loading={isUpdatingProfile}
            disabled={isUpdatingProfile}
            className="w-full justify-center py-2.5 text-xs"
            rightIcon={<CheckCircleIcon size={16} weight="bold" />}
          >
            Save Changes
          </Button>
        </StaggerItem>

        {/* Section 2: Request Email Change */}
        <StaggerItem className="border-border bg-surface flex flex-col justify-between space-y-6 rounded-xl border p-6 shadow-2xs">
          <div className="space-y-4">
            <div className="border-border border-b pb-4">
              <h3 className="text-heading flex items-center gap-2 font-extrabold">
                <EnvelopeIcon
                  size={20}
                  weight="duotone"
                  className="text-primary-dark"
                />
                <span>Change Email</span>
              </h3>

              <p className="text-muted text-xs">
                Verification link will be emailed.
              </p>
            </div>

            {emailStatus.text && (
              <div
                className={`flex items-start justify-between gap-2 rounded-lg border p-3 text-xs font-semibold ${
                  emailStatus.type === "success"
                    ? "border-primary-dark/30 bg-primary-light text-primary-dark"
                    : "border-danger/30 bg-danger/10 text-danger"
                }`}
              >
                <span>{emailStatus.text}</span>
                <button
                  type="button"
                  onClick={() => setEmailStatus({ type: "", text: "" })}
                  className="shrink-0 opacity-60 transition-opacity hover:opacity-100"
                  aria-label="Dismiss"
                >
                  <XIcon size={13} weight="bold" />
                </button>
              </div>
            )}

            <form
              id="email-form"
              onSubmit={handleEmailSubmit}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label
                  htmlFor="newEmail"
                  className="text-heading text-xs font-bold tracking-wide uppercase"
                >
                  New Email Address
                </label>

                <div className="relative">
                  <input
                    type="email"
                    id="newEmail"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="newemail@example.com"
                    className="border-border bg-background text-heading focus:border-primary-dark focus:ring-primary-dark w-full rounded-md border py-2.5 pr-3 pl-9 text-xs font-semibold focus:ring-1 focus:outline-hidden"
                  />

                  <div className="text-muted pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <EnvelopeIcon size={16} weight="duotone" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="emailCurrentPassword"
                  className="text-heading text-xs font-bold tracking-wide uppercase"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={showEmailPassword ? "text" : "password"}
                    id="emailCurrentPassword"
                    required
                    value={emailCurrentPassword}
                    onChange={(e) => setEmailCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="border-border bg-background text-heading focus:border-primary-dark focus:ring-primary-dark w-full rounded-md border py-2.5 pr-9 pl-9 text-xs font-semibold focus:ring-1 focus:outline-hidden"
                  />

                  <div className="text-muted pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <LockKeyIcon size={16} weight="duotone" />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowEmailPassword((prev) => !prev)}
                    className="text-muted hover:text-heading absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showEmailPassword ? (
                      <EyeSlashIcon size={16} weight="bold" />
                    ) : (
                      <EyeIcon size={16} weight="bold" />
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <Button
            type="submit"
            form="email-form"
            loading={isRequestingEmailChange}
            disabled={isRequestingEmailChange}
            variant="outline"
            className="w-full justify-center py-2.5 text-xs"
            rightIcon={<PaperPlaneTiltIcon size={16} weight="bold" />}
          >
            Send Link
          </Button>
        </StaggerItem>

        {/* Section 3: Password & Security */}
        <StaggerItem className="border-border bg-surface flex flex-col justify-between space-y-6 rounded-xl border p-6 shadow-2xs">
          <div className="space-y-4">
            <div className="border-border border-b pb-4">
              <h3 className="text-heading flex items-center gap-2 font-extrabold">
                <LockKeyIcon
                  size={20}
                  weight="duotone"
                  className="text-primary-dark"
                />
                <span>Security</span>
              </h3>

              <p className="text-muted text-xs">Update account password.</p>
            </div>

            {passwordStatus.text && (
              <div
                className={`flex items-start justify-between gap-2 rounded-lg border p-3 text-xs font-semibold ${
                  passwordStatus.type === "success"
                    ? "border-primary-dark/30 bg-primary-light text-primary-dark"
                    : "border-danger/30 bg-danger/10 text-danger"
                }`}
              >
                <span>{passwordStatus.text}</span>
                <button
                  type="button"
                  onClick={() => setPasswordStatus({ type: "", text: "" })}
                  className="shrink-0 opacity-60 transition-opacity hover:opacity-100"
                  aria-label="Dismiss"
                >
                  <XIcon size={13} weight="bold" />
                </button>
              </div>
            )}

            <form
              id="password-form"
              onSubmit={handlePasswordSubmit}
              className="space-y-3"
            >
              <div className="space-y-1">
                <label
                  htmlFor="currentPassword"
                  className="text-heading text-xs font-bold tracking-wide uppercase"
                >
                  Current Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="currentPassword"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="border-border bg-background text-heading focus:border-primary-dark focus:ring-primary-dark w-full rounded-md border py-2 pr-9 pl-9 text-xs font-semibold focus:ring-1 focus:outline-hidden"
                  />

                  <div className="text-muted pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <LockKeyIcon size={16} weight="duotone" />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-muted hover:text-heading absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <EyeSlashIcon size={16} weight="bold" />
                    ) : (
                      <EyeIcon size={16} weight="bold" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="newPassword"
                  className="text-heading text-xs font-bold tracking-wide uppercase"
                >
                  New Password
                </label>

                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="border-border bg-background text-heading focus:border-primary-dark focus:ring-primary-dark w-full rounded-md border px-3 py-2 text-xs font-semibold focus:ring-1 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="confirmPassword"
                  className="text-heading text-xs font-bold tracking-wide uppercase"
                >
                  Confirm New Password
                </label>

                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="border-border bg-background text-heading focus:border-primary-dark focus:ring-primary-dark w-full rounded-md border px-3 py-2 text-xs font-semibold focus:ring-1 focus:outline-hidden"
                />
              </div>
            </form>
          </div>

          <Button
            type="submit"
            form="password-form"
            loading={isChangingPassword}
            disabled={isChangingPassword}
            variant="outline"
            className="w-full justify-center py-2.5 text-xs"
            rightIcon={<ShieldCheckIcon size={16} weight="bold" />}
          >
            Update Password
          </Button>
        </StaggerItem>
      </Stagger>

      <DeleteConfirmationModal
        isOpen={showRemoveAvatarModal}
        onClose={() => setShowRemoveAvatarModal(false)}
        onConfirm={handleConfirmRemoveAvatar}
        title="Remove Profile Photo?"
        description="Your profile photo will be removed when you save changes. This cannot be undone."
      />
    </Container>
  );
}

export default AdminProfilePage;
