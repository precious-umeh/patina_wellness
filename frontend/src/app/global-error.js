"use client";

import "./globals.css";

import Link from "next/link";
import {
  ArrowClockwiseIcon,
  HouseIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

export default function GlobalError({ reset }) {
  return (
    <html lang="en">
      <body>
        <main>
          <section className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-20">
            <div
              aria-hidden="true"
              className="bg-primary/15 pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full blur-3xl"
            />

            <div
              aria-hidden="true"
              className="bg-secondary/15 pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full blur-3xl"
            />

            <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
              <div className="bg-primary/20 text-primary-dark mb-6 flex h-16 w-16 items-center justify-center rounded-2xl">
                <WarningCircleIcon size={32} weight="duotone" />
              </div>

              <p
                aria-hidden="true"
                className="text-primary-dark text-8xl leading-none font-extrabold tracking-tight sm:text-9xl"
              >
                Oops!
              </p>

              <h1 className="text-heading mt-6 text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Something went wrong.
              </h1>

              <p className="mt-5 max-w-xl leading-relaxed sm:text-lg sm:leading-8">
                We&apos;re sorry, but an unexpected application error occured.
                Please try again or return to our homepage.
              </p>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
                <button
                  onClick={() => reset()}
                  className="bg-primary text-heading hover:bg-primary-hover inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold transition-colors"
                >
                  <ArrowClockwiseIcon size={20} weight="duotone" />
                  Try Again
                </button>

                <Link
                  href="/"
                  className="border-border text-heading hover:bg-surface inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3 font-semibold transition-colors"
                >
                  <HouseIcon size={20} weight="duotone" />
                  Back to Home
                </Link>
              </div>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
