"use client";

import {
  ArrowRightIcon,
  EnvelopeSimpleIcon,
  MapPinIcon,
  PhoneIcon,
} from "@phosphor-icons/react/dist/ssr";
import { usePathname } from "next/navigation";

import Image from "next/image";
import Container from "../shared/Container";
import Link from "next/link";

import { SOCIAL_CONFIG } from "@/app/data/socials";
import { footerQuickLinks } from "@/app/data/navigations";
import { services } from "@/app/data/services";
import { isActive } from "@/app/lib/navigation";
import { usePublicSiteSettings } from "@/app/hooks/usePublicSiteSettings";
import { formatPhoneNumber } from "@/app/lib/formatPhoneNumber";

function Footer() {
  const pathname = usePathname();

  const { settings } = usePublicSiteSettings();

  const headingClasses =
    "text-heading text-base font-bold tracking-tight uppercase";

  return (
    <footer className="border-border bg-surface mt-16 border-t">
      {/* Institutional Partner Banner */}
      <div className="border-border border-b py-6">
        <Container className="flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:gap-8">
          <span className="text-muted text-xs font-semibold tracking-wider uppercase">
            Trusted and Recognized By
          </span>
          <div className="flex items-center gap-2">
            <Image
              src="/medplus-logo.png"
              alt="MedPlus Pharmacy Logo"
              width={120}
              height={36}
              className="h-8 w-auto object-contain opacity-80 transition-opacity hover:opacity-100"
            />
          </div>
        </Container>
      </div>

      {/* Footer Content */}
      <div className="py-16 lg:py-20">
        <Container className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.9fr_1fr_1.2fr] lg:gap-8">
          {/* Col 1: Brand & Socials */}
          <div className="flex flex-col items-start gap-6">
            <Link href="/" className="inline-block">
              <Image
                src="/Patina_Logo.png"
                alt="Patina Logo"
                width={140}
                height={40}
                className="-mt-4 -ml-5 h-10 w-auto"
              />
            </Link>

            <p className="max-w-xs text-sm leading-relaxed">
              Integrating Functional and Conventional Medicine to evaluate,
              prevent, and reverse chronic metabolic dysfunction at the cellular
              level.
            </p>

            {/* Social Icons */}
            {settings && (
              <div className="flex items-center gap-3 pt-2">
                {SOCIAL_CONFIG.map((social) => {
                  const Icon = social.icon;

                  const href = settings.socialLinks[social.key];

                  return (
                    <a
                      key={social.label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="border-border bg-background text-heading hover:border-primary-dark hover:bg-primary-light hover:text-primary-dark flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300"
                    >
                      <Icon size={20} weight="regular" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Col 2: Quick Links */}
          <div className="flex flex-col items-start gap-4">
            <h4 className={headingClasses}>Quick Links</h4>

            <ul className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-1">
              {footerQuickLinks.map((link) => {
                const linkActive = isActive(link, pathname);

                return (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={`hover:text-primary-dark transition-colors duration-200 ${
                        linkActive ? "text-primary-dark font-semibold" : ""
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Col 3: Services */}
          <div className="flex flex-col items-start gap-4">
            <h4 className={headingClasses}>Our Services</h4>

            <ul className="space-y-3 text-sm">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services#${service.id}`}
                    className="group hover:text-primary-dark inline-flex items-start gap-2 leading-snug transition-colors duration-200"
                  >
                    <ArrowRightIcon
                      size={14}
                      weight="bold"
                      className="text-light group-hover:text-primary-dark mt-1 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                    />
                    <span>{service.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact Details */}
          <div className="flex flex-col items-start gap-4">
            <h4 className={headingClasses}>Contact Us</h4>

            {settings && (
              <div className="space-y-4 text-sm">
                <a
                  href={`tel:${settings.contact.phone}`}
                  className="hover:text-primary-dark flex items-center gap-3 transition-colors duration-200"
                >
                  <div className="bg-primary-light text-primary-dark flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                    <PhoneIcon size={18} weight="bold" />
                  </div>

                  <span>{formatPhoneNumber(settings.contact.phone)}</span>
                </a>

                <a
                  href={`mailto:${settings.supportEmail}`}
                  className="hover:text-primary-dark flex items-center gap-3 transition-colors duration-200"
                >
                  <div className="bg-primary-light text-primary-dark flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                    <EnvelopeSimpleIcon size={18} weight="bold" />
                  </div>
                  <span className="min-win-0 break-all">
                    {settings.supportEmail}
                  </span>
                </a>

                <div className="flex items-center gap-3">
                  <div className="bg-primary-light text-primary-dark flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                    <MapPinIcon size={18} weight="bold" />
                  </div>

                  <span>{settings.location}</span>
                </div>
              </div>
            )}
          </div>
        </Container>
      </div>

      {/* CopyRight Bar */}
      <div className="border-border nav-desktop:pb-6 border-t pt-6 pb-22">
        <Container className="text-muted flex flex-col items-center justify-center gap-2 text-center text-xs">
          <p>
            &copy; {new Date().getFullYear()} Patina Wellness Solutions. All
            rights reserved.
          </p>

          <p>
            Developed by{" "}
            <a
              href="https://wa.me/+2349056205910"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-dark font-semibold"
            >
              Nugo
            </a>
          </p>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;
