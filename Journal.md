# Projects carousel — fix journal

This document records what was wrong with the **AI Projects / ML Projects** carousels on [`app/projects/page.tsx`](app/projects/page.tsx), how we narrowed it down, and what we changed.

---

## What it was before

- A horizontal row of **fixed-width** cards (`w-[320px]`), `gap-6` (24px), inside a scroll container with **`overflow-x-auto`** and **Prev / Next** buttons.
- **Scroll step** was hardcoded as **`340px`**, while one logical column is **`320 + 24 = 344px`**. Each click stopped slightly short of a full column, so scroll positions drifted and cards could sit partly under the overflow edge during or after smooth scrolling.
- **Viewport vs cards:** At a typical content width (~976px), **three** 320px cards plus **two** gaps need **1008px**. The row was **wider than the viewport**, so the **third visible card** was always partially cut off at rest—not something a scroll-step tweak alone could fix.
- **“Back to first three” / first card clipping:** After scrolling to the **end**, `maxScroll` is often **not** a multiple of one step (e.g. `720` vs step `344`). Repeated **Prev** produced small remainders (e.g. `32px` `scrollLeft`). **`scrollBy(-step)`** plus **`behavior: "smooth"`** could leave a **small positive `scrollLeft`**, so the strip was shifted and the **left** side of the first card (including rounded corners) looked clipped (~98% visible).
- **Prev to home** and **Next to end** sometimes used **instant** `scrollLeft` assignments for correctness, which felt **abrupt** compared to the other steps.

---

## How we fixed it

### 1. Correct scroll distance

- **Before:** `scrollBy({ left: ±340 })`.
- **After:** Measure **`cardWidth + gap`** from the DOM (`offsetWidth` of the first card + computed `gap`) and use that as **`step`** for every programmatic scroll.

This keeps each click aligned to **one full card + gap**.

### 2. Fit three cards in the viewport (fluid width)

- **Before:** Fixed **`320px`** cards when the row could not fit `3 × 320 + 2 × gap`.
- **After:** Card width **`min(20rem, calc((100% - 3rem) / 3))`** (Tailwind: `100%_-_3rem` with underscores for spaces).  
  - **`3rem`** = two **`gap-6`** gaps.  
  - Caps at **320px** (`20rem`) when the row is wide enough.

So three columns + gaps match the carousel width and nothing is “stuck” halfway off-screen by geometry alone.

### 3. Reliable “home” and “end” without trimming

- **Before:** Relying only on **`scrollBy`** and smooth scrolling let **subpixel** `scrollLeft` linger.
- **After:**
  - Use **`scrollTo({ left: target, behavior: "smooth" })`** with explicit targets: for **Prev**, when within one **`step`** of the start, target **`0`**; for **Next**, when the next step would pass the end, target **`maxScroll`**.
  - A **`scrollend`** listener snaps **`scrollLeft`** to **`0`** or **`maxScroll`** when within **1px**, so smooth scrolling doesn’t leave a thin clip at the start or end.

### 4. Layout breathing room

- **`px-2`** on the scroll container so the first/last cards aren’t flush against the overflow edge (helps **rounded corners** read cleanly).

### 5. Smoother last-step motion

- **Next to last page:** use **`scrollTo({ left: maxScroll, behavior: "smooth" })`** instead of instant **`scrollLeft = maxScroll`**.
- **Prev to first page:** use **`scrollTo({ left: 0, behavior: "smooth" })`** instead of instant **`scrollLeft = 0`**, with the same **`scrollend`** snap as above.

### 6. What we removed along the way

- **`scroll-smooth`** on the carousel container (avoid extra CSS smooth behavior fighting programmatic scroll).
- **`snap-x` / `snap-mandatory` / `snap-start`** (they were tried earlier; not needed once step math and snapping logic were correct).

---

## Files touched

- **[`app/projects/page.tsx`](app/projects/page.tsx)** — `ProjectCard` width classes, `ProjectCarousel` scroll logic, scroll container classes, **`scrollend`** effect.

---

## Summary (one paragraph)

The carousel failed in three layers: **wrong step size (340 vs 344)**, **fixed card width** where **three** cards didn’t fit the row, and **smooth scroll + max-scroll math** leaving **non-zero** `scrollLeft` at the start. We fixed the **step** from live measurements, made **card width** fluid so **three** columns fit the viewport, added **horizontal padding** and a **`scrollend`** snap to **0** / **maxScroll**, and used **smooth** `scrollTo` for the last step to **Prev** and **Next** so motion stays consistent without bringing the old clipping back.
