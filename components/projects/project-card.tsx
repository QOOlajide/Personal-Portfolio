"use client";

import { FiGithub } from "react-icons/fi";
import { SiVercel } from "react-icons/si";
import { motion } from "motion/react";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import type { PublishedProject } from "@/lib/project-graph/types";

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

const transition = {
  duration: 0.6,
  ease: [0.4, 0, 0.2, 1] as const,
};

const statusConfig = {
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
  "building-now": {
    label: "Building now",
    dotColor: "bg-amber-400 animate-pulse",
    textColor: "text-amber-400",
  },
} as const;

export function ProjectCard({
  project,
  index,
}: {
  project: PublishedProject;
  index: number;
}) {
  const displayStatus = project.live.displayStatus;
  const config = statusConfig[displayStatus];
  const isRemoteImage = project.imageUrl.startsWith("http");

  return (
    <motion.article
      variants={fadeUp}
      transition={{ ...transition, delay: 0.1 + index * 0.1 }}
      className="group flex w-[min(20rem,calc((100%_-_3rem)/3))] shrink-0 flex-col overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-background-secondary)] transition-all duration-[var(--duration-hover)] hover:border-[var(--color-border-hover)] hover:shadow-lg hover:shadow-black/5"
    >
      <div className="relative h-40 w-full overflow-hidden bg-[var(--color-background-tertiary)]">
        <ImageWithFallback
          src={project.imageUrl}
          alt={`${project.title} thumbnail`}
          fill
          unoptimized={isRemoteImage}
          sizes="320px"
          className="object-cover transition-transform duration-[var(--duration-hover)] group-hover:scale-[1.02]"
          fallbackText="Project image coming soon"
        />
        {project.photographer && (
          <a
            href={project.photographer.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-1.5 left-1.5 rounded bg-black/55 px-1.5 py-0.5 text-[9px] leading-none text-white/80 transition-colors hover:text-white"
          >
            Photo by {project.photographer.name}
          </a>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-base font-semibold text-[var(--color-foreground)]">
          {project.title}
        </h3>

        <div className="flex items-center gap-2">
          <span className={`inline-block h-2 w-2 rounded-full ${config.dotColor}`} />
          <span className={`text-xs font-medium ${config.textColor}`}>
            {config.label}
          </span>
          {displayStatus === "building-now" && project.live.buildingNow && (
            <span className="text-[10px] text-[var(--color-foreground-subtle)]">
              {project.live.buildingNow.branch}
            </span>
          )}
        </div>

        <p className="line-clamp-3 text-xs leading-relaxed text-[var(--color-foreground-muted)]">
          {project.description}
        </p>

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

        <div className="flex-1" />

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

export { fadeUp, transition };
