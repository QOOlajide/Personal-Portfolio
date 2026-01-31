"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

const transition = {
  duration: 0.6,
  ease: [0.4, 0, 0.2, 1],
};

const experiences = [
  {
    company: "Refilgas",
    role: "Software Development Engineering Intern",
    location: "Remote",
    dates: "Jan 2026 – Present",
    bullets: [
      "Collaborated with 9 cross-functional team members to develop key features for a logistics platform serving LPG gas delivery across Nigeria.",
      "Built an end-to-end waitlist API using FastAPI, PostgreSQL, and Resend email automation, capturing 3 early adopters.",
    ],
  },
  {
    company: "Headstarter",
    role: "Software Development Engineering Resident",
    location: "New York, NY",
    dates: "June 2025 – Present",
    bullets: [
      "Implemented an AI-powered customer support system for Aven using Next.js, TypeScript, Pinecone (vector DB), Exa (web scraping), VAPI Docs and OpenAI APIs.",
      "Delivered an MVP enabling real-time chat and voice Q&A, reducing customer support workload by 25%+.",
      "Designed and deployed a Model Context Protocol (MCP) server in Python (FastAPI, Pydantic) integrating Google Calendar, Notion, and Slack.",
      "Demonstrated cross-tool orchestration with potential to save 1–2 hours per user weekly by reducing context switching.",
    ],
  },
  {
    company: "CodePath",
    role: "Software Development Engineering Fellow",
    location: "Remote",
    dates: "May 2025 – Aug 2025",
    bullets: [
      "Launched a full-stack community platform using React, Node.js/Express, PostgreSQL, Redis, Stripe API, and Docker, resulting in a scalable system ready for deployment on AWS.",
      "Added an AI-powered Islamic Q&A feature with Retrieval Augmented Generation (RAG) pipeline and OpenAI GPT to provide trusted, cited answers, reducing misinformation risk for the community.",
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <motion.div
        initial="initial"
        animate="animate"
        className="flex flex-col gap-20"
      >
        {/* About Section */}
        <section className="flex flex-col gap-8">
          <motion.h1
            variants={fadeUp}
            transition={{ ...transition, delay: 0 }}
            className="text-3xl font-medium tracking-tight text-[var(--color-foreground)] sm:text-4xl"
          >
            About
          </motion.h1>

          <motion.div
            variants={fadeUp}
            transition={{ ...transition, delay: 0.1 }}
            className="flex flex-col gap-6 text-base leading-relaxed text-[var(--color-foreground-muted)] sm:text-lg"
          >
            <p>
              I'm Quamdeen Olajide, a full-stack software engineer focused on
              building production-ready systems, not toy apps. I specialize in
              agentic workflows and solving real-world problems through
              thoughtful, end-to-end engineering.
            </p>

            <p>
              I'm also a Muslim, and that identity meaningfully shapes how I
              build. Before I code, I ask: who benefits from this, how can it be
              used, and is it permissible and beneficial in the long run? That
              reflection drives both my technical and product decisions.
            </p>

            <p>
              Some of my work is built specifically for the Muslim community,
              such as an Eid community platform. Other projects—like my AI
              customer support agent and terminal-based coding tools—are
              designed to benefit both Muslims and non-Muslims alike.
            </p>

            <p>
              Every project I ship is deliberately considered, impact-driven,
              and built with responsibility in mind. Feel free to explore my{" "}
              <Link
                href="/projects"
                className="text-[var(--color-accent)] transition-colors duration-[var(--duration-hover)] hover:text-[var(--color-accent-hover)]"
              >
                projects
              </Link>
              , or{" "}
              <Link
                href="/contact"
                className="text-[var(--color-accent)] transition-colors duration-[var(--duration-hover)] hover:text-[var(--color-accent-hover)]"
              >
                reach out
              </Link>{" "}
              if you'd like to collaborate or have an inquiry.
            </p>
          </motion.div>

          {/* Medium / Writing Link */}
          <motion.div
            variants={fadeUp}
            transition={{ ...transition, delay: 0.2 }}
          >
            <a
              href="https://medium.com/@quamdeenolajide"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[var(--color-foreground-subtle)] transition-colors duration-[var(--duration-hover)] hover:text-[var(--color-foreground)]"
            >
              <span>Read my writing on Medium</span>
              <FiExternalLink className="h-4 w-4" />
            </a>
          </motion.div>
        </section>

        {/* Experience Section */}
        <section className="flex flex-col gap-10">
          <motion.h2
            variants={fadeUp}
            transition={{ ...transition, delay: 0.3 }}
            className="text-2xl font-medium tracking-tight text-[var(--color-foreground)] sm:text-3xl"
          >
            Experience
          </motion.h2>

          <div className="flex flex-col gap-12">
            {experiences.map((exp, index) => (
              <motion.article
                key={exp.company}
                variants={fadeUp}
                transition={{ ...transition, delay: 0.4 + index * 0.1 }}
                className="flex flex-col gap-4"
              >
                {/* Company & Role */}
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
                    {exp.company}
                  </h3>
                  <p className="text-base text-[var(--color-foreground-muted)]">
                    {exp.role}
                  </p>
                  <p className="text-sm text-[var(--color-foreground-subtle)]">
                    {exp.location} · {exp.dates}
                  </p>
                </div>

                {/* Bullet Points */}
                <ul className="flex flex-col gap-2 pl-4">
                  {exp.bullets.map((bullet, bulletIndex) => (
                    <li
                      key={bulletIndex}
                      className="relative text-sm leading-relaxed text-[var(--color-foreground-muted)] before:absolute before:-left-4 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-[var(--color-foreground-subtle)]"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </section>
      </motion.div>
    </div>
  );
}
