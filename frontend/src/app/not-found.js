import {
  ArrowRightIcon,
  HouseIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import FadeUp from "./components/animations/FadeUp";
import Container from "./components/shared/Container";
import Section from "./components/shared/Section";
import Button from "./components/shared/Button";

export default function NotFound() {
  return (
    <main>
      <Section size="lg" className="relative min-h-screen overflow-hidden">
        <div
          aria-hidden="true"
          className="bg-primary/15 pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full blur-3xl"
        />

        <div
          aria-hidden="true"
          className="bg-secondary/15 pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full blur-3xl"
        />

        <Container className="relative z-10">
          <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <FadeUp>
              <div className="bg-primary/20 text-primary-dark mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
                <WarningCircleIcon size={32} weight="duotone" />
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <p
                aria-hidden="true"
                className="text-primary-dark text-8xl leading-none font-extrabold tracking-tight sm:text-9xl"
              >
                404
              </p>
            </FadeUp>

            <FadeUp delay={0.2}>
              <h1 className="text-heading mt-6 text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Looks like you took a wrong turn.
              </h1>
            </FadeUp>

            <FadeUp delay={0.3}>
              <p className="text-body mt-5 max-w-xl leading-relaxed sm:text-lg sm:leading-8">
                The page you&apos;re looking for doesn&apos;t exist or may have
                been moved. Let&apos;s get you back to a healthier direction.
              </p>
            </FadeUp>

            <FadeUp delay={0.4}>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
                <Button
                  href="/"
                  size="md"
                  leftIcon={<HouseIcon size={20} weight="duotone" />}
                >
                  Back to Home
                </Button>

                <Button
                  href="/contact"
                  variant="secondary"
                  size="md"
                  rightIcon={<ArrowRightIcon size={20} weight="duotone" />}
                >
                  Contact Us
                </Button>
              </div>
            </FadeUp>
          </div>
        </Container>
      </Section>
    </main>
  );
}
