"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { motion, useReducedMotion } from "motion/react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const SCROLL_TOP_THRESHOLD_PX = 72;
/** Within this many px of the document bottom counts as “at bottom”. */
const BOTTOM_THRESHOLD_PX = 64;
/** Projects/Contact: “More below” sits top-right, just below sticky `h-16` navbar. */
const ANCHOR_MORE_BELOW_TOP_PX = 80;
/**
 * Middle “Scroll”: vertically halfway between the same right-rail slots as “More below” (top)
 * and “Back to top” (bottom), not viewport-centered.
 */
function anchorScrollRailMidTopPx(
  vh: number,
  cueHeight: number,
  footerHeightPx: number,
) {
  const ch = cueHeight || 56;
  const topSlot = ANCHOR_MORE_BELOW_TOP_PX;
  const bottomInset = footerHeightPx + GAP_ABOVE_FOOTER_PX;
  const bottomSlotTop = Math.round(vh - bottomInset - ch);
  if (bottomSlotTop <= topSlot) {
    return Math.max(0, Math.round((topSlot + bottomSlotTop) / 2));
  }
  return Math.round((topSlot + bottomSlotTop) / 2);
}

/**
 * Tight to the viewport edge — same 10px margin the old `left`+clamp used
 * (`vw - cw - edge`), not `right-6`/`sm:right-10` (which sat farther in).
 */
const ANCHOR_VIEWPORT_INSET_PX = 10;

function anchorFloatedViewportRightPx() {
  return ANCHOR_VIEWPORT_INSET_PX;
}

const bounceTransition = {
  duration: 1.75,
  ease: [0.4, 0, 0.2, 1] as const,
};

const bothAxisBounceTransition = {
  duration: 2.2,
  ease: [0.4, 0, 0.2, 1] as const,
};

/** Compact chip — closer to the original cue, not a large card. */
const cueVisualClassName =
  "pointer-events-auto flex flex-col items-center gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-background)]/95 px-2.5 py-1.5 text-center text-[var(--color-foreground-subtle)] shadow-sm backdrop-blur-sm transition-colors duration-[var(--duration-hover)] hover:text-[var(--color-foreground-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] sm:px-3 sm:py-2";

const labelClassName =
  "text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-foreground-subtle)] sm:text-[11px] sm:tracking-[0.25em]";

/** Space between “Back to top” and the footer (px). */
const GAP_ABOVE_FOOTER_PX = 10;

type ScrollPhase = "top" | "middle" | "bottom";

type ScrollNavigationCueProps = {
  scrollDownTargetId?: string;
  side?: "center" | "left" | "right";
  contentAnchorId?: string;
  pinToHero?: boolean;
};

export function ScrollNavigationCue({
  scrollDownTargetId,
  side = "right",
  contentAnchorId,
  pinToHero = false,
}: ScrollNavigationCueProps) {
  const prefersReducedMotion = useReducedMotion();
  const [hasOverflow, setHasOverflow] = useState(false);
  const [scrollPhase, setScrollPhase] = useState<ScrollPhase>("top");
  const [floatedAnchorStyle, setFloatedAnchorStyle] = useState<CSSProperties>(
    () => (contentAnchorId ? { visibility: "hidden" } : {}),
  );
  const [backToTopBottomPx, setBackToTopBottomPx] = useState(74);
  const cueRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  const heroMoreBelowPinned =
    pinToHero &&
    scrollPhase === "top" &&
    Boolean(scrollDownTargetId) &&
    !contentAnchorId;

  const fixedCentered =
    !contentAnchorId &&
    (side === "center" ||
      (pinToHero && (scrollPhase === "middle" || scrollPhase === "bottom")));

  const lowerMoreBelow =
    scrollPhase === "top" &&
    Boolean(scrollDownTargetId) &&
    !contentAnchorId &&
    (pinToHero || side === "center");

  const isBackToTop = scrollPhase === "bottom";

  const bottomInset = isBackToTop
    ? undefined
    : lowerMoreBelow
      ? pinToHero
        ? "bottom-4 sm:bottom-8"
        : "bottom-0 sm:bottom-2"
      : "bottom-6 sm:bottom-10";

  const positionClassName = contentAnchorId
    ? "fixed z-40"
    : heroMoreBelowPinned
      ? cn(
          "absolute left-1/2 right-auto z-10 -translate-x-1/2",
          bottomInset,
        )
      : cn(
          "fixed z-40",
          bottomInset,
          !contentAnchorId &&
            !heroMoreBelowPinned &&
            fixedCentered &&
            "left-1/2 right-auto -translate-x-1/2",
          !contentAnchorId &&
            !heroMoreBelowPinned &&
            !fixedCentered &&
            side === "left" &&
            "left-6 right-auto sm:left-10",
          !contentAnchorId &&
            !heroMoreBelowPinned &&
            !fixedCentered &&
            side === "right" &&
            "right-6 left-auto sm:right-10",
        );

  const cueClassName = cn(cueVisualClassName, positionClassName);

  useLayoutEffect(() => {
    if (!contentAnchorId || !hasOverflow) {
      setFloatedAnchorStyle({});
      return;
    }

    const anchor = document.getElementById(contentAnchorId);
    const footer = document.getElementById("site-footer");
    if (!anchor) {
      setFloatedAnchorStyle({ visibility: "hidden" });
      return;
    }

    const updateFloated = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const doc = document.documentElement;
      const total = doc.scrollHeight;
      const atBottom = y + vh >= total - BOTTOM_THRESHOLD_PX;

      const cueEl = cueRef.current;
      const ch = cueEl?.offsetHeight ?? 0;

      const fh = footer?.offsetHeight ?? 64;
      const insetRight = anchorFloatedViewportRightPx();

      if (atBottom) {
        setFloatedAnchorStyle({
          right: insetRight,
          left: "auto",
          bottom: fh + GAP_ABOVE_FOOTER_PX,
          top: "auto",
          transform: "none",
          visibility: "visible",
        });
        return;
      }

      const nearTop = y <= SCROLL_TOP_THRESHOLD_PX;

      if (nearTop) {
        setFloatedAnchorStyle({
          right: insetRight,
          left: "auto",
          top: ANCHOR_MORE_BELOW_TOP_PX,
          bottom: "auto",
          transform: "none",
          visibility: "visible",
        });
        return;
      }

      setFloatedAnchorStyle({
        right: insetRight,
        left: "auto",
        top: anchorScrollRailMidTopPx(vh, ch, fh),
        bottom: "auto",
        transform: "none",
        visibility: "visible",
      });
    };

    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateFloated);
    };

    updateFloated();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(anchor);
    const el = cueRef.current;
    if (el) ro.observe(el);
    if (footer) ro.observe(footer);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      ro.disconnect();
    };
  }, [contentAnchorId, hasOverflow]);

  useLayoutEffect(() => {
    if (contentAnchorId || !hasOverflow) return;

    const footer = document.getElementById("site-footer");
    if (!footer) return;

    const measure = () => {
      setBackToTopBottomPx(footer.offsetHeight + GAP_ABOVE_FOOTER_PX);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(footer);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [contentAnchorId, hasOverflow]);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const y = window.scrollY;
      const vh = window.innerHeight;
      const total = doc.scrollHeight;
      const atBottom =
        y + vh >= total - BOTTOM_THRESHOLD_PX;

      let phase: ScrollPhase;
      if (atBottom) phase = "bottom";
      else if (y <= SCROLL_TOP_THRESHOLD_PX) phase = "top";
      else phase = "middle";

      setScrollPhase(phase);
      setHasOverflow(total > vh + 2);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const ro = new ResizeObserver(update);
    ro.observe(document.documentElement);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      ro.disconnect();
    };
  }, []);

  if (!hasOverflow) return null;

  const behavior: ScrollBehavior =
    prefersReducedMotion ? "auto" : "smooth";

  const scrollDownChunk = () => {
    const doc = document.documentElement;
    const room = doc.scrollHeight - window.innerHeight - window.scrollY;
    const delta = Math.min(
      window.innerHeight * 0.85,
      Math.max(120, room),
    );
    window.scrollBy({ top: delta, behavior });
  };

  const scrollToTop = () => {
    document.getElementById("page-top")?.scrollIntoView({
      behavior,
      block: "start",
    });
  };

  const cueMotionStyle: CSSProperties | undefined = contentAnchorId
    ? floatedAnchorStyle
    : isBackToTop
      ? { bottom: backToTopBottomPx }
      : undefined;

  const chevronDownBounce = (
    <motion.span
      aria-hidden
      animate={prefersReducedMotion ? undefined : { y: [0, 5, 0] }}
      transition={{
        ...bounceTransition,
        repeat: prefersReducedMotion ? 0 : Infinity,
      }}
    >
      <FiChevronDown className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" />
    </motion.span>
  );

  const chevronUpBounce = (
    <motion.span
      aria-hidden
      animate={prefersReducedMotion ? undefined : { y: [0, -5, 0] }}
      transition={{
        ...bounceTransition,
        repeat: prefersReducedMotion ? 0 : Infinity,
      }}
    >
      <FiChevronUp className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" />
    </motion.span>
  );

  const chevronsBothBounce = (
    <motion.span
      aria-hidden
      animate={
        prefersReducedMotion
          ? undefined
          : { y: [0, 5, 0, -5, 0] }
      }
      transition={{
        ...bothAxisBounceTransition,
        repeat: prefersReducedMotion ? 0 : Infinity,
      }}
    >
      <ChevronsUpDown className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" />
    </motion.span>
  );

  if (scrollPhase === "bottom") {
    return (
      <motion.a
        ref={cueRef as RefObject<HTMLAnchorElement>}
        href="#page-top"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: bounceTransition.ease }}
        className={cueClassName}
        style={cueMotionStyle}
        aria-label="Back to top of the page"
        onClick={(e) => {
          if (prefersReducedMotion) {
            e.preventDefault();
            scrollToTop();
          }
        }}
      >
        <span className={labelClassName}>Back to top</span>
        {chevronUpBounce}
      </motion.a>
    );
  }

  if (scrollPhase === "top" && scrollDownTargetId) {
    return (
      <motion.a
        ref={cueRef as RefObject<HTMLAnchorElement>}
        href={`#${scrollDownTargetId}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: bounceTransition.ease }}
        className={cueClassName}
        style={cueMotionStyle}
        aria-label="Scroll to more content"
      >
        <span className={labelClassName}>More below</span>
        {chevronDownBounce}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={cueRef as RefObject<HTMLButtonElement>}
      type="button"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: bounceTransition.ease }}
      className={cueClassName}
      style={cueMotionStyle}
      aria-label="Scroll up or down the page. Click to scroll down."
      onClick={scrollDownChunk}
    >
      <span className={labelClassName}>Scroll</span>
      {chevronsBothBounce}
    </motion.button>
  );
}
