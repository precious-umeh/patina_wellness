import { Suspense } from "react";
import BrandLoader from "@/app/components/shared/BrandLoader";
import Container from "@/app/components/shared/Container";
import Section from "@/app/components/shared/Section";
import ResetPasswordContent from "@/app/components/ui/ResetPasswordContent";

export const metadata = {
  title: "Reset Password",
  description: "Secure password reset portal for Patina Wellness Solutions.",
};

function ResetPasswordPage() {
  return (
    <main className="bg-background flex min-h-screen flex-col justify-center">
      <Section className="py-12 sm:py-16">
        <Container className="max-w-md">
          <Suspense fallback={<BrandLoader />}>
            <ResetPasswordContent />
          </Suspense>
        </Container>
      </Section>
    </main>
  );
}

export default ResetPasswordPage;
