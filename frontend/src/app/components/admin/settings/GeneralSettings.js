import {
  EnvelopeSimpleIcon,
  FloppyDiskIcon,
  InstagramLogoIcon,
  LinkIcon,
  MapPinIcon,
  PhoneIcon,
  PowerIcon,
  SnapchatLogoIcon,
  UserCircleIcon,
  WhatsappLogoIcon,
  YoutubeLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import Button from "../../shared/Button";

function GeneralSettings({
  settings,
  loading,
  saving,
  error,
  successMessage,
  onChange,
  onSave,
}) {
  if (loading) {
    return (
      <section className="space-y-4">
        {/* Section Header */}
        <div>
          <h2 className="text-heading text-lg font-extrabold">
            General Settings
          </h2>

          <p className="text-muted mt-1 text-xs">
            Manage the general contact and social media information displayed
            across the website.
          </p>
        </div>

        {/* Loading Skeleton */}
        <div className="border-border bg-surface animate-pulse overflow-hidden rounded-xl border shadow-2xs">
          <div className="space-y-8 p-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="bg-border h-4 w-40 rounded" />
                <div className="bg-border h-3 w-72 rounded" />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="bg-border h-3 w-24 rounded" />
                  <div className="bg-border h-11 w-full rounded-lg" />
                </div>

                <div className="space-y-2">
                  <div className="bg-border h-3 w-24 rounded" />
                  <div className="bg-border h-11 w-full rounded-lg" />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <div className="bg-border h-3 w-20 rounded" />
                  <div className="bg-border h-11 w-full rounded-lg" />
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="border-border space-y-4 border-t pt-6">
              <div className="space-y-2">
                <div className="bg-border h-4 w-32 rounded" />
                <div className="bg-border h-3 w-80 rounded" />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <div className="bg-border h-5 w-24 rounded" />
                    <div className="bg-border h-5 w-full rounded-lg" />
                  </div>
                ))}
              </div>
            </div>

            {/* Founder */}
            <div className="border-border space-y-4 border-t pt-6">
              <div className="space-y-2">
                <div className="bg-border h-4 w-36 rounded" />
                <div className="bg-border h-3 w-72 rounded" />
              </div>

              <div className="space-y-2">
                <div className="bg-border h-3 w-28 rounded" />
                <div className="bg-border h-11 w-full rounded-lg" />
              </div>
            </div>

            {/* Save */}
            <div className="border-border flex items-center justify-between border-t pt-5">
              <div className="bg-border h-3 w-64 rounded" />
              <div className="bg-border h-10 w-32 rounded-lg" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-heading text-lg font-extrabold">
          General Settings
        </h2>

        <p className="text-muted mt-1 text-xs">
          Manage the general contact and social media information displayed
          across the website.
        </p>
      </div>

      {/* Settings Card */}
      <div className="border-border bg-surface overflow-hidden rounded-xl border shadow-2xs">
        <div className="space-y-8 p-6">
          {/* Contact Information */}
          <div>
            <div className="mb-4 flex items-start gap-4">
              <div className="bg-primary-light text-primary-dark flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                <PhoneIcon size={20} weight="duotone" />
              </div>

              <div>
                <h3 className="text-heading text-sm font-extrabold">
                  Contact Information
                </h3>

                <p className="text-muted mt-1 text-xs leading-relaxed">
                  Manage the contact details displayed across the website.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Phone */}
              <div>
                <label
                  htmlFor="general-phone"
                  className="text-heading mb-2 block text-xs font-bold"
                >
                  Phone Number
                </label>

                <div className="relative">
                  <PhoneIcon
                    size={17}
                    weight="duotone"
                    className="text-muted absolute top-1/2 left-3 -translate-y-1/2"
                  />

                  <input
                    id="general-phone"
                    type="tel"
                    value={settings?.contact?.phone ?? ""}
                    onChange={(e) =>
                      onChange("contact", "phone", e.target.value)
                    }
                    placeholder="+234..."
                    className="border-border bg-background text-heading placeholder:text-muted focus:border-primary-dark focus:ring-primary-dark/20 h-11 w-full rounded-lg border pr-3 pl-10 text-xs transition outline-none focus:ring-2"
                  />
                </div>
              </div>

              {/* WhatsApp */}
              <div>
                <label
                  htmlFor="general-whatsapp"
                  className="text-heading mb-2 block text-xs font-bold"
                >
                  WhatsApp Number
                </label>

                <div className="relative">
                  <WhatsappLogoIcon
                    size={18}
                    weight="duotone"
                    className="text-muted absolute top-1/2 left-3 -translate-y-1/2"
                  />

                  <input
                    id="general-whatsapp"
                    type="tel"
                    value={settings?.contact?.whatsapp ?? ""}
                    onChange={(e) =>
                      onChange("contact", "whatsapp", e.target.value)
                    }
                    placeholder="+234..."
                    className="border-border bg-background text-heading placeholder:text-muted focus:border-primary-dark focus:ring-primary-dark/20 h-11 w-full rounded-lg border pr-3 pl-10 text-xs transition outline-none focus:ring-2"
                  />
                </div>

                <p className="text-muted mt-1.5 text-[10px]">
                  This number will be used for WhatsApp contact links across the
                  website.
                </p>
              </div>

              {/* Location */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="general-location"
                  className="text-heading mb-2 block text-xs font-bold"
                >
                  Location
                </label>

                <div className="relative">
                  <MapPinIcon
                    size={17}
                    weight="duotone"
                    className="text-muted absolute top-1/2 left-3 -translate-y-1/2"
                  />

                  <input
                    id="general-location"
                    type="text"
                    value={settings?.location ?? ""}
                    onChange={(e) => onChange(null, "location", e.target.value)}
                    placeholder="e.g. Lagos, Nigeria"
                    className="border-border bg-background text-heading placeholder:text-muted focus:border-primary-dark focus:ring-primary-dark/20 h-11 w-full rounded-lg border pr-3 pl-10 text-xs transition outline-none focus:ring-2"
                  />
                </div>

                <p className="text-muted mt-1.5 text-[10px]">
                  Leave blank if you do not want to display a physical location.
                </p>
              </div>
            </div>
          </div>

          {/* Support Email */}
          <div className="border-border border-t pt-6">
            <div className="mb-4 flex items-start gap-4">
              <div className="bg-background text-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                <EnvelopeSimpleIcon size={20} weight="duotone" />
              </div>

              <div>
                <h3 className="text-heading text-sm font-extrabold">
                  Support Email
                </h3>

                <p className="text-muted mt-1 text-xs leading-relaxed">
                  The email address customers can use to contact the business.
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="general-support-email"
                className="text-heading mb-2 block text-xs font-bold"
              >
                Email Address
              </label>

              <div className="relative">
                <EnvelopeSimpleIcon
                  size={17}
                  weight="duotone"
                  className="text-muted absolute top-1/2 left-3 -translate-y-1/2"
                />

                <input
                  id="general-support-email"
                  type="email"
                  value={settings?.supportEmail ?? ""}
                  onChange={(e) =>
                    onChange(null, "suppoertEmail", e.target.value)
                  }
                  placeholder="suppoert@example.com"
                  className="border-border bg-background text-heading placeholder:text-muted focus:border-primary-dark focus:ring-primary-dark/20 h-11 w-full rounded-lg border pr-3 pl-10 text-xs transition outline-none focus:ring-2"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="border-border border-t pt-6">
            <div className="mb-4 flex items-start gap-4">
              <div className="bg-background text-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                <LinkIcon size={20} weight="duotone" />
              </div>

              <div>
                <h3 className="text-heading text-sm font-extrabold">
                  Social Media Links
                </h3>

                <p className="text-muted mt-1 text-xs leading-relaxed">
                  Update the business social media accounts displayed across the
                  website.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {/* Instagram */}
              <div>
                <label
                  htmlFor="general-instagram"
                  className="text-heading mb-2 block text-xs font-bold"
                >
                  Business Instagram
                </label>

                <div className="relative">
                  <InstagramLogoIcon
                    size={17}
                    weight="duotone"
                    className="text-muted absolute top-1/2 left-3 -translate-y-1/2"
                  />

                  <input
                    id="general-instagram"
                    type="url"
                    value={settings?.socialLinks?.instagram ?? ""}
                    onChange={(e) =>
                      onChange("socialLinks", "instagram", e.target.value)
                    }
                    placeholder="https://instagram.com/..."
                    className="border-border bg-background text-heading placeholder:text-muted focus:border-primary-dark focus:ring-primary-dark h-11 w-full rounded-lg border pr-3 pl-10 text-xs transition outline-none focus:ring-2"
                  />
                </div>
              </div>

              {/* Snapchat */}
              <div>
                <label
                  htmlFor="general-snapchat"
                  className="text-heading mb-2 block text-xs font-bold"
                >
                  Snapchat
                </label>

                <div className="relative">
                  <SnapchatLogoIcon
                    size={17}
                    weight="duotone"
                    className="text-muted absolute top-1/2 left-3 -translate-y-1/2"
                  />

                  <input
                    id="general-snapchat"
                    type="url"
                    value={settings?.socialLinks?.snapchat ?? ""}
                    onChange={(e) =>
                      onChange("socialLinks", "snapchat", e.target.value)
                    }
                    placeholder="https://snapchat.com/..."
                    className="border-border bg-background text-heading placeholder:text-muted focus:border-primary-dark focus:ring-primary-dark/20 h-11 w-full rounded-lg border pr-3 pl-10 text-xs transition outline-none focus:ring-2"
                  />
                </div>
              </div>

              {/* YouTube */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="general-youtube"
                  className="text-heading mb-2 block text-xs font-bold"
                >
                  YouTube
                </label>

                <div className="relative">
                  <YoutubeLogoIcon
                    size={18}
                    weight="duotone"
                    className="text-muted absolute top-1/2 left-3 -translate-y-1/2"
                  />

                  <input
                    id="general-youtube"
                    type="url"
                    value={settings?.socialLinks?.youtube ?? ""}
                    onChange={(e) =>
                      onChange("socialLinks", "youtube", e.target.value)
                    }
                    placeholder="https://youtube.com/..."
                    className="border-border bg-background text-heading placeholder:text-muted focus:border-primary-dark focus:ring-primary-dark/20 h-11 w-full rounded-lg border pr-3 pl-10 text-xs transition outline-none focus:ring-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Founder */}
          <div className="border-border border-t pt-6">
            <div className="mb-4 flex items-start gap-4">
              <div className="bg-background text-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                <UserCircleIcon size={20} weight="duotone" />
              </div>

              <div>
                <h3 className="text-heading text-sm font-extrabold">Founder</h3>

                <p className="text-muted mt-1 text-xs leading-relaxed">
                  Manage the founder&apos;s social media link displayed in the
                  &ldquo;Meet Our Founder&rdquo; section.
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="founder-instagram"
                className="text-heading mb-2 block text-xs font-bold"
              >
                Founder Instagram
              </label>

              <div className="relative">
                <InstagramLogoIcon
                  size={17}
                  weight="duotone"
                  className="text-muted absolute top-1/2 left-3 -translate-y-1/2"
                />

                <input
                  id="founder-instagram"
                  type="url"
                  value={settings?.founder?.instagram ?? ""}
                  onChange={(e) =>
                    onChange("founder", "instagram", e.target.value)
                  }
                  placeholder="https://instagram.com/..."
                  className="border-border bg-background text-heading placeholder:text-muted focus:border-primary-dark focus:ring-primary-dark/20 h-11 w-full rounded-lg border pr-3 pl-10 text-xs transition outline-none focus:ring-2"
                />
              </div>
            </div>
          </div>

          {/* Feedback */}
          {error && (
            <div className="border-danger/30 bg-danger/10 rounded-lg border p-4">
              <p className="text-danger text-xs font-semibold">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4">
              <p className="text-xs font-bold text-emerald-800">
                {successMessage}
              </p>
            </div>
          )}

          {/* Save */}
          <div className="border-border flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted text-[11px]">
              Changes will affect the contact and social information displayed
              across the website.
            </p>

            <Button
              onClick={onSave}
              loading={saving}
              disabled={saving}
              leftIcon={<FloppyDiskIcon size={15} weight="bold" />}
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GeneralSettings;
