"use client";

import Link from "next/link";
import { motion } from "motion/react";

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

const transition = {
  duration: 0.6,
  ease: [0.4, 0, 0.2, 1] as const,
};

const affiliations = [
  "CodePath",
  "CareerSpring",
  "Npower",
  "ColorStack",
  "Basta",
  "NSLS",
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="flex min-h-[calc(100vh-4rem)] items-center">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <motion.div
            initial="initial"
            animate="animate"
            className="flex flex-col items-center gap-8 text-center"
          >
            {/* Primary headline */}
            <motion.h1
              variants={fadeUp}
              transition={{ ...transition, delay: 0 }}
              className="text-4xl font-medium tracking-[0.2em] text-[var(--color-foreground)] sm:text-5xl md:text-6xl"
            >
              DEEN DYNAMICS
            </motion.h1>

            {/* Secondary line */}
            <motion.p
              variants={fadeUp}
              transition={{ ...transition, delay: 0.1 }}
              className="text-lg text-[var(--color-foreground-muted)] sm:text-xl"
            >
              Quamdeen Olajide — Full-Stack Software Engineer
            </motion.p>

            {/* Supporting statement */}
            <motion.p
              variants={fadeUp}
              transition={{ ...transition, delay: 0.2 }}
              className="max-w-2xl text-base leading-relaxed text-[var(--color-foreground-subtle)] sm:text-lg"
            >
              I build production-ready, agentic systems with purpose — carefully
              considering who benefits, how they're used, and whether they create
              real value.
            </motion.p>

            {/* Optional subtext */}
            <motion.p
              variants={fadeUp}
              transition={{ ...transition, delay: 0.3 }}
              className="text-sm text-[var(--color-foreground-subtle)]"
            >
              Thoughtful engineering. Real users. Responsible impact.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              variants={fadeUp}
              transition={{ ...transition, delay: 0.4 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              {/* Primary CTA */}
              <Link
                href="/projects"
                className="inline-flex items-center justify-center rounded-md bg-[var(--color-accent)] px-6 py-3 text-sm font-medium text-white transition-colors duration-[var(--duration-hover)] hover:bg-[var(--color-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
              >
                View Projects
              </Link>

              {/* Secondary CTA */}
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-[var(--color-border)] bg-transparent px-6 py-3 text-sm font-medium text-[var(--color-foreground)] transition-colors duration-[var(--duration-hover)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-background-tertiary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
              >
                Resume
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Affiliations Carousel */}
      <section className="overflow-hidden border-t border-[var(--color-border)] py-16">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="mb-10 text-center text-sm font-medium uppercase tracking-widest text-[var(--color-foreground-subtle)]"
        >
          Affiliated With
        </motion.p>

        <div className="logos-track relative overflow-hidden whitespace-nowrap">
          {/* Gradient fade — left */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[var(--color-background)] to-transparent" />
          {/* Gradient fade — right */}
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[var(--color-background)] to-transparent" />

          {/* Two identical slides for seamless infinite loop */}
          {[0, 1].map((copy) => (
            <div key={copy} className="logos-slide">
              {[...affiliations, ...affiliations, ...affiliations].map(
                (name, i) => (
                  <span
                    key={`${copy}-${i}`}
                    className="mx-10 inline-block text-xl font-semibold text-[var(--color-foreground-subtle)] transition-colors duration-300 hover:text-[var(--color-foreground)]"
                  >
                    {name}
                  </span>
                )
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
