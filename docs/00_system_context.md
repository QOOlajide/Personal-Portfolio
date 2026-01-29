# System Context — Portfolio V1

Project:
- Developer portfolio for Quamdeen Olajide
- Brand name: Deen Dynamics
- Built with Next.js (App Router), TypeScript, Tailwind CSS
- Deployed on Vercel

---------------------------------------
Core Principles

- This portfolio is production-minded, not a demo.
- Decisions prioritize stability, clarity, and long-term maintainability.
- Avoid overengineering, novelty features, and unnecessary dependencies.
- Every feature must be explainable and justifiable in an interview.

---------------------------------------
Routing Model (IMPORTANT)

This project uses **multi-page routing**, NOT one-page scroll.

Explicitly:
- Do NOT use scroll-based navigation (no #about, #projects, etc.)
- Do NOT implement a single long landing page
- Each major section lives on its own route

Approved routes (V1):
- `/`        → Home (Hero / brand entry point)
- `/about`   → About + Experience
- `/projects`→ Projects
- `/contact` → Contact form

Navigation behavior:
- Navbar links navigate between routes
- No smooth-scroll logic tied to navigation
- Page transitions may use subtle motion (see motion spec)

---------------------------------------
Scope Discipline (Very Important)

This is a V1 portfolio.

Allowed:
- Clear branding
- Focused content
- Minimal, intentional motion
- Simple backend logic for contact form
- Clean UI with strong hierarchy

Disallowed:
- Feature creep
- Blog engine (external Medium links only)
- Auth systems
- Dashboards
- Excessive animations
- “Just because it’s cool” additions

---------------------------------------
AI / Cursor Usage Rules

Cursor is treated as a junior engineer.

Cursor must:
- Follow the currently supplied spec file(s) only
- Implement one task at a time
- Ask for clarification if a spec is ambiguous
- Never invent requirements, tools, or assets

Cursor must NOT:
- Assume one-page scroll behavior
- Merge specs across unrelated tasks
- Upgrade dependencies without instruction
- Introduce libraries not explicitly approved
- Guess image paths or filenames

---------------------------------------
Change Management

If a core decision changes (routing, stack, delivery mechanism):
- Update this file first
- Then update dependent specs if necessary
- Do NOT “patch around” outdated assumptions

This file is the root of truth for architectural intent.
