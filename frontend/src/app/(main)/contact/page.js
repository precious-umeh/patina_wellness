import {
  ArrowRightIcon,
  ClockIcon,
  EnvelopeSimpleIcon,
  MapPinIcon,
  PhoneCallIcon,
} from "@phosphor-icons/react/dist/ssr";

import Container from "../../components/shared/Container";
import PageHero from "../../components/shared/PageHero";
import Section from "../../components/shared/Section";
import SectionTitle from "../../components/shared/SectionTitle";
import ContactFormContent from "@/app/components/ui/ContactFormContent";

import { SOCIAL_CONFIG } from "../../data/socials";
import { getPublicSiteSettings } from "@/app/lib/api/generalSettings";
import {
  formatPhoneNumber,
  formatWhatsAppNumber,
} from "@/app/lib/formatPhoneNumber";

import Reveal from "@/app/components/animations/Reveal";
import Stagger from "@/app/components/animations/Stagger";
import StaggerItem from "@/app/components/animations/StaggerItem";

export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Patina Wellness Solutions. Reach out via phone, email, or social media for consultations and inquiry support.",
};

async function Contact() {
  const response = await getPublicSiteSettings();

  const settings = response?.data;

  const phone = settings?.contact?.phone ?? "";
  const whatsapp = settings?.contact?.whatsapp ?? "";
  const supportEmail = settings?.supportEmail ?? "";
  const location = settings?.location ?? "";

  const contactInfo = [
    {
      icon: <PhoneCallIcon size={24} weight="duotone" />,
      title: "Phone & WhatsApp",
      details: formatPhoneNumber(phone),
      phoneHref: `tel:${phone}`,
      whatsappHref: `https://wa.me/${formatWhatsAppNumber(whatsapp)}`,
      phoneActionText: "Call",
      whatsappActionText: "Chat",
    },
    {
      icon: <EnvelopeSimpleIcon size={24} weight="duotone" />,
      title: "Email Address",
      details: supportEmail,
      href: `mailto:${supportEmail}`,
      actionText: "Send an Email",
    },
    {
      icon: <MapPinIcon size={24} weight="duotone" />,
      title: "Location",
      details: location,
      href: "#",
      actionText: "Virtual & In-Home Services",
    },
  ];

  return (
    <main>
      <PageHero
        eyebrow="Reach out to Patina"
        title=" We're Here to Help You Begin Your Health Journey"
        description="Have questions about our functional testing panels, consultation plans, or holistic protocols? Our clinical team is ready to assist."
      />

      {/* Contact & Inquiry Form Section */}
      <Section>
        <Container>
          <div className="nav-desktop:grid-cols-12 nav-desktop:gap-16 grid grid-cols-1 gap-12">
            {/* Left Col: Direct Details & Social Links */}
            <Reveal
              direction="left"
              className="nav-desktop:col-span-5 space-y-10"
            >
              <div className="w-full">
                <div>
                  <span className="text-primary-dark text-xs font-bold tracking-wider uppercase">
                    Direct Channels
                  </span>

                  <h2 className="text-heading mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
                    Get in Touch
                  </h2>

                  <p className="mt-3 text-base leading-relaxed">
                    Reach out directly for immediate support or book a
                    consultation via our direct contact options.
                  </p>
                </div>

                {/* Direct Info Cards */}
                <div className="space-y-4">
                  {contactInfo.map((item, idx) => (
                    <div
                      key={idx}
                      href={item.href}
                      className="group border-border bg-background hover:border-primary/40 flex items-start gap-4 rounded-xl border p-5 shadow-2xs transition-all duration-300 hover:shadow-xs"
                    >
                      <div className="bg-primary-light text-primary-dark group-hover:bg-primary-hover flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors group-hover:text-white">
                        {item.icon}
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-heading text-sm font-bold">
                          {item.title}
                        </h3>

                        <p className="text-sm font-medium break-all">
                          {item.details}
                        </p>

                        {item.phoneHref && item.whatsappHref ? (
                          <div className="flex items-center gap-2 pt-0.5 text-xs font-bold">
                            <a
                              href={item.phoneHref}
                              className="text-primary-dark underline-offset-3 hover:underline"
                            >
                              {item.phoneActionText}
                            </a>

                            <span className="text-muted">•</span>

                            <a
                              href={item.whatsappHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-dark underline-offset-3 hover:underline"
                            >
                              {item.whatsappActionText}
                            </a>
                          </div>
                        ) : (
                          <a
                            href={item.href}
                            className="text-primary-dark inline-flex items-center pt-0.5 text-xs font-bold underline-offset-3 group-hover:underline"
                          >
                            {item.actionText}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Operating Hours Note */}
                <div className="border-border bg-surface text-muted flex items-center gap-3 rounded-lg border p-4 text-xs">
                  <ClockIcon
                    size={20}
                    weight="duotone"
                    className="text-secondary shrink-0"
                  />
                  <span>
                    <strong>Response Hours: </strong> Monday &mdash; Saturday
                    (8:00 AM - 6:00 PM WAT). Inquiries received outside these
                    hours will be answered next business day.
                  </span>
                </div>
              </div>
            </Reveal>

            {/* Right Col: Contact Inquiry Form */}
            <Reveal
              direction="right"
              className="border-border bg-surface nav-desktop:col-span-7 rounded-xl border p-8 shadow-md sm:p-10"
            >
              <div className="w-full">
                <div className="mb-8 space-y-2">
                  <h3 className="text-heading text-2xl font-bold tracking-tight">
                    Send Us a Message
                  </h3>

                  <p className="text-sm">
                    Fill out the form below and a health consultant will get
                    back to you within 24 hours.
                  </p>
                </div>

                <ContactFormContent />
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Social Media Channels Section */}
      <Section className="bg-surface border-border border-t">
        <Container className="space-y-15">
          <div className="space-y-6">
            <SectionTitle eyebrow="Stay Connected">
              Connect on Social Media
            </SectionTitle>

            <Reveal delay={0.1}>
              <p className="hero-desktop:text-left max-w-2xl text-center leading-relaxed">
                Follow us across social media for daily preventive health
                insights, root-cause educational-content, and community updates.
              </p>
            </Reveal>
          </div>

          <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {SOCIAL_CONFIG.map((social) => {
              const Icon = social.icon;

              const href = settings?.socialLinks?.[social.key];

              return (
                <StaggerItem key={social.label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group border-border bg-background flex flex-col items-center justify-center rounded-xl border p-8 text-center shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${social.colorClass}`}
                  >
                    <div className="bg-surface text-heading group-hover:bg-primary-light mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full transition-colors">
                      <Icon size={28} weight="duotone" />
                    </div>

                    <h3 className="text-heading fot-bold text-lg tracking-tight">
                      {social.label}
                    </h3>

                    <p className="text-muted pt-1 text-xs font-medium">
                      {social.handle}
                    </p>

                    <span className="text-primary-dark mt-4 inline-flex items-center gap-1 text-xs font-bold underline-offset-3 group-hover:underline">
                      {social.actionText}{" "}
                      <ArrowRightIcon size={12} weight="bold" />
                    </span>
                  </a>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Container>
      </Section>
    </main>
  );
}

export default Contact;
