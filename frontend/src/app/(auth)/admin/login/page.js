import { ArrowLeftIcon, ShieldCheckIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import AdminLoginGuard from "@/app/components/auth/AdminLoginGuard";
import Container from "@/app/components/shared/Container";
import Section from "@/app/components/shared/Section";
import LoginForm from "@/app/components/ui/LoginForm";

import Reveal from "@/app/components/animations/Reveal";
import Stagger from "@/app/components/animations/Stagger";
import StaggerItem from "@/app/components/animations/StaggerItem";

export const metadata = {
  title: "Admin Portal Access",
  description:
    "Secure administrative login portal for Patina Wellness Solutions management.",
};

export default function AdminLoginPage() {
  return (
    <AdminLoginGuard>
      <main className="bg-background flex min-h-screen flex-col justify-center">
        <Section className="py-12 sm:py-16">
          <Container className="max-w-md">
            {/* Card Container */}
            <Reveal distance={16} duration={0.5}>
              <div className="border-border bg-surface rounded-xl border p-8 shadow-md sm:p-10">
                <Stagger delay={0.12} staggerDelay={0.08} className="space-y-8">
                  {/* Header Badge & Title */}
                  <StaggerItem className="space-y-3 text-center">
                    <div className="bg-primary-light text-primary-dark mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full">
                      <ShieldCheckIcon size={32} weight="duotone" />
                    </div>

                    <div>
                      <span className="text-primary-dark text-xs font-bold tracking-wider uppercase">
                        Management Portal
                      </span>
                      <h1 className="text-heading mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                        Admin Sign In
                      </h1>
                    </div>

                    <p className="text-xs leading-relaxed">
                      Enter your credentials to access the Patina Wellness
                      administrative dashboard.
                    </p>
                  </StaggerItem>

                  {/* Login Form */}
                  <StaggerItem>
                    <LoginForm />
                  </StaggerItem>

                  {/* Return to Public Website */}
                  <StaggerItem className="border-border border-t pt-6 text-center">
                    <Link
                      href="/"
                      className="text-primary-dark inline-flex items-center gap-1.5 text-xs font-bold underline-offset-3 hover:underline"
                    >
                      <ArrowLeftIcon size={14} weight="bold" />
                      Return to Patina Public Site
                    </Link>
                  </StaggerItem>
                </Stagger>
              </div>
            </Reveal>
          </Container>
        </Section>
      </main>
    </AdminLoginGuard>
  );
}
