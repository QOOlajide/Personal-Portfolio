"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { PublishedProject } from "@/lib/project-graph/types";
import { fadeUp, ProjectCard, transition } from "./project-card";

export function ProjectCarousel({
  projects,
  label,
  delayOffset = 0,
}: {
  projects: PublishedProject[];
  label: string;
  delayOffset?: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hoveredBtn, setHoveredBtn] = useState<"left" | "right" | null>(null);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

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
  }, [checkScroll, projects.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScrollEnd = () => {
      const max = Math.max(0, el.scrollWidth - el.clientWidth);
      if (el.scrollLeft < 1) el.scrollLeft = 0;
      else if (max > 0 && Math.abs(el.scrollLeft - max) < 1) el.scrollLeft = max;
    };
    el.addEventListener("scrollend", onScrollEnd);
    return () => el.removeEventListener("scrollend", onScrollEnd);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).gap || "0") || 0;
    const cardW = first?.offsetWidth ?? 320;
    const step = cardW + gap;
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    const x = el.scrollLeft;

    if (direction === "left") {
      if (x <= step) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollTo({ left: x - step, behavior: "smooth" });
      }
    } else if (x + step >= maxScroll - 0.5) {
      el.scrollTo({ left: maxScroll, behavior: "smooth" });
    } else {
      el.scrollTo({ left: x + step, behavior: "smooth" });
    }
  };

  return (
    <motion.div
      variants={fadeUp}
      transition={{ ...transition, delay: delayOffset }}
      className="relative"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-[var(--color-foreground)] sm:text-xl">
          {label}
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            onMouseEnter={() => setHoveredBtn("left")}
            onMouseLeave={() => setHoveredBtn(null)}
            disabled={!canScrollLeft}
            aria-label={`Previous ${label}`}
            className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 text-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-30"
            style={{
              backgroundColor:
                hoveredBtn === "left" && canScrollLeft
                  ? "#ffffff"
                  : "var(--color-background-secondary)",
              color:
                hoveredBtn === "left" && canScrollLeft
                  ? "#000000"
                  : "var(--color-foreground)",
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
            aria-label={`Next ${label}`}
            className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 text-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-30"
            style={{
              backgroundColor:
                hoveredBtn === "right" && canScrollRight
                  ? "#ffffff"
                  : "var(--color-background-secondary)",
              color:
                hoveredBtn === "right" && canScrollRight
                  ? "#000000"
                  : "var(--color-foreground)",
            }}
          >
            <span>Next</span>
            <FiChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto px-2 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </div>
    </motion.div>
  );
}
