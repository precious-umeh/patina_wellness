import { cn } from "@/app/lib/utils";
import Container from "./Container";
import FadeUp from "../animations/FadeUp";

function PageHero({ eyebrow, title, description, className }) {
  return (
    <section
      className={cn(
        "border-border bg-surface relative overflow-hidden border-b py-20 sm:py-28 lg:py-32",
        className,
      )}
    >
      {/*  Base Subtle Gradient Fade */}
      <div className="from-surface via-surface to-surface absolute inset-0 bg-linear-to-b" />

      {/*  Soft Mesh Blended Background (Primary + Secondary Ambient Glows) */}
      {/* Primary Color Glow (Top Left) */}
      <div
        aria-hidden="true"
        className="bg-primary/20 pointer-events-none absolute -top-24 -left-20 h-96 w-96 rounded-full blur-3xl"
      />

      {/* Secondary Color Glow (Top Right Accent) */}
      <div
        aria-hidden="true"
        className="bg-secondary/25 pointer-events-none absolute -top-12 -right-16 h-112 w-md rounded-full blur-3xl"
      />

      {/* Secondary Accent Highlight Blob (Bottom Left) */}
      <div
        aria-hidden="true"
        className="bg-secondary-light/40 pointer-events-none absolute -bottom-24 left-1/3 h-80 w-80 rounded-full blur-3xl"
      />

      {/* 3. Subtle Micro-Pattern Overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05] dark:opacity-[0.10]"
      >
        <div className="text-heading absolute inset-0 bg-[radial-gradient(circle,currentColor_1.5px,transparent_1.5px)] bg-size-[32px_32px]" />
      </div>

      {/* 4. Hero Content */}
      <Container className="relative z-10">
        <div className="max-w-3xl space-y-4">
          {eyebrow && (
            <FadeUp>
              <div>
                {/* Eyebrow Badge incorporating Secondary Color Token */}
                <span className="border-secondary/30 bg-secondary-light/50 text-heading inline-flex items-center rounded-full border px-3.5 py-1.5 text-xs font-bold tracking-wide uppercase shadow-xs backdrop-blur-xs">
                  {eyebrow}
                </span>
              </div>
            </FadeUp>
          )}

          <FadeUp delay={0.1}>
            <h1 className="text-heading nav-desktop:text-6xl text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl">
              {title}
            </h1>
          </FadeUp>

          {description && (
            <FadeUp delay={0.2}>
              <p className="text-body max-w-2xl pt-2 text-base leading-relaxed sm:text-lg sm:leading-8">
                {description}
              </p>
            </FadeUp>
          )}
        </div>
      </Container>
    </section>
  );
}

export default PageHero;
