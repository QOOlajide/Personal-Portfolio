"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";
import { FiGithub, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { SiVercel } from "react-icons/si";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

const transition = {
  duration: 0.6,
  ease: [0.4, 0, 0.2, 1] as const,
};

type ProjectStatus = "completed" | "active-development" | "shipped";

interface Project {
  slug: string;
  title: string;
  status: ProjectStatus;
  description: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
}

const statusConfig: Record<
  ProjectStatus,
  { label: string; dotColor: string; textColor: string }
> = {
  completed: {
    label: "Completed",
    dotColor: "bg-blue-500",
    textColor: "text-blue-500",
  },
  shipped: {
    label: "Shipped",
    dotColor: "bg-emerald-500",
    textColor: "text-emerald-500",
  },
  "active-development": {
    label: "Active Development",
    dotColor: "bg-amber-400",
    textColor: "text-amber-400",
  },
};

const projects: Project[] = [
  {
    slug: "eid-community-platform",
    title: "Eid Community Platform",
    status: "active-development",
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
    status: "active-development",
    description:
      "A Model Context Protocol (MCP) server that integrates Google Calendar, Notion, and Slack to enable cross-tool orchestration. Reduces context switching and saves users 1–2 hours weekly.",
    techStack: ["Python", "FastAPI"],
    githubUrl: "https://github.com/QOOlajide/mcp-schedule-meeting-server",
    demoUrl: undefined,
  },
  {
    slug: "agent-workflow-builder",
    title: "Agent Workflow Builder",
    status: "shipped",
    description:
      "A visual tool for designing and deploying agentic workflows. Enables users to orchestrate multi-step AI agent pipelines without writing complex code.",
    techStack: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
    githubUrl: "https://github.com/QOOlajide/agent-workflow-builder",
    demoUrl: "https://agent-workflow-omega.vercel.app/",
  },
  {
    slug: "terminal-coding-agent",
    title: "Terminal Coding Agent",
    status: "completed",
    description:
      "A terminal-based AI coding assistant that helps developers write, debug, and refactor code directly from the command line. Designed for efficiency and minimal context switching.",
    techStack: ["Bash", "TypeScript", "Gemini API"],
    githubUrl: "https://github.com/QOOlajide/terminal-coding-agent",
    demoUrl: undefined,
  },
  {
    slug: "ai-customer-support-voice-agent",
    title: "AI Customer Support Voice Agent",
    status: "completed",
    description:
      "An AI-powered customer support system built for Aven, featuring real-time chat and voice Q&A capabilities. Reduced customer support workload by 25%+ through intelligent query handling.",
    techStack: ["Next.js", "TypeScript", "Pinecone", "Vercel"],
    githubUrl: "https://github.com/QOOlajide/ai-customer-support-agent",
    demoUrl: undefined,
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const config = statusConfig[project.status];

  return (
    <motion.article
      variants={fadeUp}
      transition={{ ...transition, delay: 0.1 + index * 0.1 }}
      className="group flex w-[320px] shrink-0 flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-background-secondary)] transition-all duration-[var(--duration-hover)] hover:border-[var(--color-border-hover)] hover:shadow-lg hover:shadow-black/5"
    >
      {/* Thumbnail */}
      <div className="relative h-40 w-full overflow-hidden bg-[var(--color-background-tertiary)]">
        <ImageWithFallback
          src={`/images/projects/${project.slug}.jpg`}
          alt={`${project.title} thumbnail`}
          fill
          className="object-cover transition-transform duration-[var(--duration-hover)] group-hover:scale-[1.02]"
          fallbackText="Project image coming soon"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Title */}
        <h3 className="text-base font-semibold text-[var(--color-foreground)]">
          {project.title}
        </h3>

        {/* Status badge */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-block h-2 w-2 rounded-full ${config.dotColor}`}
          />
          <span className={`text-xs font-medium ${config.textColor}`}>
            {config.label}
          </span>
        </div>

        {/* Description */}
        <p className="line-clamp-3 text-xs leading-relaxed text-[var(--color-foreground-muted)]">
          {project.description}
        </p>

        {/* Tech stack chips */}
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-[var(--color-background-tertiary)] px-2.5 py-0.5 text-[10px] font-medium text-[var(--color-foreground-muted)]"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Spacer to push actions to bottom */}
        <div className="flex-1" />

        {/* Action row */}
        <div className="flex items-center gap-4 border-t border-[var(--color-border)] pt-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-foreground)] transition-colors duration-[var(--duration-hover)] hover:text-[var(--color-accent)]"
            >
              <FiGithub className="h-3.5 w-3.5" />
              <span>View Code</span>
            </a>
          )}

          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-foreground)] transition-colors duration-[var(--duration-hover)] hover:text-[var(--color-accent)]"
            >
              <SiVercel className="h-3.5 w-3.5" />
              <span>Try Demo</span>
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function ProjectsPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hoveredBtn, setHoveredBtn] = useState<"left" | "right" | null>(null);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = 340;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <motion.div
        initial="initial"
        animate="animate"
        className="flex flex-col gap-12"
      >
        {/* Page header */}
        <motion.div variants={fadeUp} transition={transition} className="text-center">
          <h1 className="text-3xl font-medium tracking-tight text-[var(--color-foreground)] sm:text-4xl">
            Projects
          </h1>
          <p className="mt-4 text-base text-[var(--color-foreground-muted)] sm:text-lg">
            Production-ready systems built with purpose and care.
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div variants={fadeUp} transition={{ ...transition, delay: 0.1 }} className="relative">
          {/* Navigation arrows */}
          <div className="mb-4 flex items-center justify-end gap-2">
            <button
              onClick={() => scroll("left")}
              onMouseEnter={() => setHoveredBtn("left")}
              onMouseLeave={() => setHoveredBtn(null)}
              disabled={!canScrollLeft}
              aria-label="Previous projects"
              className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 text-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-30"
              style={{
                backgroundColor: hoveredBtn === "left" && canScrollLeft ? "#ffffff" : "var(--color-background-secondary)",
                color: hoveredBtn === "left" && canScrollLeft ? "#000000" : "var(--color-foreground)",
              }}
            >
              <FiChevronLeft className="h-4 w-4" />
              <span>Prev</span>
            </button>
            <button
              onClick={() => scroll("right")}
              onMouseEnter={() => setHoveredBtn("right")}
              onMouseLeave={() => setHoveredBtn(null)}
              disabled={!canScrollRight}
              aria-label="Next projects"
              className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 text-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-30"
              style={{
                backgroundColor: hoveredBtn === "right" && canScrollRight ? "#ffffff" : "var(--color-background-secondary)",
                color: hoveredBtn === "right" && canScrollRight ? "#000000" : "var(--color-foreground)",
              }}
            >
              <span>Next</span>
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Scrollable row */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {projects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
