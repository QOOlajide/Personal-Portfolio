# Build Order Checklist — Portfolio V1 (Multi-Page Routing)

Routing model:
- Multi-page (no scroll anchors)

Routes:
- /        → Home
- /about   → About + Experience
- /projects→ Projects
- /contact → Contact

Navbar:
- Home | About | Projects | Contact | Resume
- Dark mode toggle in navbar
- Resume opens /resume.pdf in new tab

---------------------------------------
PHASE 0 — Repo bootstrap
1) Scaffold Next.js App Router project
2) Confirm pinned versions
3) Add lockfile and commit
4) Configure Tailwind with dark mode (class strategy)

Gate:
- App runs locally
- Dark mode toggles correctly

---------------------------------------
PHASE 1 — Global layout & branding
1) Root layout with shared navbar + footer
2) Title: "Deen Dynamics"
3) Favicon: profile photo
4) Global background + typography

Gate:
- Branding correct across all routes

---------------------------------------
PHASE 2 — Navigation
1) Navbar links to routes (not anchors)
2) Active route styling
3) Resume button works
4) Dark mode persists across routes

Gate:
- Navigation works across all pages

---------------------------------------
PHASE 3 — Home (/)
1) Hero section with locked copy
2) CTAs:
   - View Projects → /projects
   - Resume → PDF

Gate:
- Clean, fast landing page

---------------------------------------
PHASE 4 — About (/about)
1) About copy (locked)
2) Experience section (resume-based only)
3) Writing link to Medium

Gate:
- About reads cleanly
- Experience matches resume

---------------------------------------
PHASE 5 — Projects (/projects)
1) Project cards per UI contract
2) No category pills
3) Tech chips from resume only
4) Locked project order:
   - Eid Community Platform
   - MCP Schedule Meeting Server
   - Agent Workflow Builder
   - Terminal Coding Agent
   - AI Customer Support Voice Agent

Gate:
- Cards look consistent
- All links valid

---------------------------------------
PHASE 6 — Contact (/contact)
1) Contact form UI matches screenshot
2) POST /api/contact via Gmail SMTP
3) Validation + honeypot + rate limit
4) Social links + clickable brand logo

Gate:
- Email arrives at quamola@gmail.com
- Success state visible

---------------------------------------
PHASE 7 — Final hardening
1) Production build
2) npm audit --omit=dev
3) Mobile responsiveness check
4) Deploy to Vercel

Gate:
- Live site works end-to-end
