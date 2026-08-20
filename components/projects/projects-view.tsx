"use client";

import { motion } from "motion/react";
import { ScrollNavigationCue } from "@/components/layout/scroll-navigation-cue";
import type { ProjectCatalog } from "@/lib/project-graph/types";
import { fadeUp, transition } from "./project-card";
import { ProjectCarousel } from "./project-carousel";

export function ProjectsView({ catalog }: { catalog: ProjectCatalog }) {
  return (
    <div id="page-content" className="mx-auto max-w-5xl px-6 py-24">
      <motion.div
        initial="initial"
        animate="animate"
        className="flex flex-col gap-12"
      >
        <motion.div
          variants={fadeUp}
          transition={transition}
          className="text-center"
        >
          <h1 className="text-3xl font-medium tracking-tight text-[var(--color-foreground)] sm:text-4xl">
            Projects
          </h1>
          <p className="mt-4 text-base text-[var(--color-foreground-muted)] sm:text-lg">
            Production-ready systems built with purpose and care.
          </p>
        </motion.div>

        <div
          id="projects-catalog"
          className="flex scroll-mt-16 flex-col gap-12"
        >
          <ProjectCarousel
            projects={catalog.ai}
            label="AI Projects"
            delayOffset={0.1}
          />

          <ProjectCarousel
            projects={catalog.ml}
            label="ML Projects"
            delayOffset={0.2}
          />

          {catalog.systems.length > 0 && (
            <ProjectCarousel
              projects={catalog.systems}
              label="Systems"
              delayOffset={0.3}
            />
          )}
        </div>
      </motion.div>

      <ScrollNavigationCue
        scrollDownTargetId="projects-catalog"
        contentAnchorId="page-content"
      />
    </div>
  );
}
