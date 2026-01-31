"use client";

import { motion } from "motion/react";
import { FiClock, FiGithub, FiExternalLink } from "react-icons/fi";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

const transition = {
  duration: 0.6,
  ease: [0.4, 0, 0.2, 1] as const,
};

interface Project {
  slug: string;
  title: string;
  duration?: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
}

const projects: Project[] = [
  {
    slug: "eid-community-platform",
    title: "Eid Community Platform",
    duration: "3 months",
    description:
      "A full-stack community platform built for the Muslim community, featuring event coordination, community engagement tools, and an AI-powered Islamic Q&A feature using RAG to provide trusted, cited answers.",
    techStack: [
      "React",
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "Redis",
      "Docker",
    ],
    githubUrl: "https://github.com/QOOlajide/eid-community-platform",
    demoUrl: undefined,
  },
  {
    slug: "mcp-schedule-meeting-server",
    title: "MCP Schedule Meeting Server",
    duration: "2 months",
    description:
      "A Model Context Protocol (MCP) server that integrates Google Calendar, Notion, and Slack to enable cross-tool orchestration. Reduces context switching and saves users 1–2 hours weekly.",
    techStack: ["Python", "FastAPI"],
    githubUrl: "https://github.com/QOOlajide/mcp-schedule-meeting-server",
    demoUrl: undefined,
  },
  {
    slug: "agent-workflow-builder",
    title: "Agent Workflow Builder",
    duration: "2 months",
    description:
      "A visual tool for designing and deploying agentic workflows. Enables users to orchestrate multi-step AI agent pipelines without writing complex code.",
    techStack: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
    githubUrl: "https://github.com/QOOlajide/agent-workflow-builder",
    demoUrl: undefined,
  },
  {
    slug: "terminal-coding-agent",
    title: "Terminal Coding Agent",
    duration: "1.5 months",
    description:
      "A terminal-based AI coding assistant that helps developers write, debug, and refactor code directly from the command line. Designed for efficiency and minimal context switching.",
    techStack: ["Python", "Bash"],
    githubUrl: "https://github.com/QOOlajide/terminal-coding-agent",
    demoUrl: undefined,
  },
  {
    slug: "ai-customer-support-voice-agent",
    title: "AI Customer Support Voice Agent",
    duration: "2.5 months",
    description:
      "An AI-powered customer support system built for Aven, featuring real-time chat and voice Q&A capabilities. Reduced customer support workload by 25%+ through intelligent query handling.",
    techStack: ["Next.js", "TypeScript", "Pinecone", "Vercel"],
    githubUrl: "https://github.com/QOOlajide/ai-customer-support-agent",
    demoUrl: undefined,
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      variants={fadeUp}
      transition={{ ...transition, delay: 0.1 + index * 0.1 }}
      className="group flex flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-background-secondary)] transition-all duration-[var(--duration-hover)] hover:border-[var(--color-border-hover)] hover:shadow-lg hover:shadow-black/5"
    >
      {/* Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden bg-[var(--color-background-tertiary)]">
        <ImageWithFallback
          src={`/images/projects/${project.slug}.jpg`}
          alt={`${project.title} thumbnail`}
          fill
          className="object-cover transition-transform duration-[var(--duration-hover)] group-hover:scale-[1.02]"
          fallbackText="Project image coming soon"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Title */}
        <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
          {project.title}
        </h3>

        {/* Meta row */}
        {project.duration && (
          <div className="flex items-center gap-2 text-sm text-[var(--color-foreground-subtle)]">
            <FiClock className="h-4 w-4" />
            <span>Duration: {project.duration}</span>
          </div>
        )}

        {/* Description */}
        <p className="text-sm leading-relaxed text-[var(--color-foreground-muted)]">
          {project.description}
        </p>

        {/* Tech stack chips */}
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-[var(--color-background-tertiary)] px-3 py-1 text-xs font-medium text-[var(--color-foreground-muted)]"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Spacer to push actions to bottom */}
        <div className="flex-1" />

        {/* Action row */}
        <div className="flex items-center gap-4 border-t border-[var(--color-border)] pt-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-foreground)] transition-colors duration-[var(--duration-hover)] hover:text-[var(--color-accent)]"
            >
              <FiGithub className="h-4 w-4" />
              <span>View Code</span>
            </a>
          )}

          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition-colors duration-[var(--duration-hover)] hover:bg-[var(--color-accent-hover)]"
            >
              <FiExternalLink className="h-4 w-4" />
              <span>Demo</span>
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <motion.div
        initial="initial"
        animate="animate"
        className="flex flex-col gap-12"
      >
        {/* Page header */}
        <motion.div variants={fadeUp} transition={transition}>
          <h1 className="text-3xl font-medium tracking-tight text-[var(--color-foreground)] sm:text-4xl">
            Projects
          </h1>
          <p className="mt-4 text-base text-[var(--color-foreground-muted)] sm:text-lg">
            Production-ready systems built with purpose and care.
          </p>
        </motion.div>

        {/* Projects grid */}
        <div className="grid gap-8 sm:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
