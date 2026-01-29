# Content Allocation Rules — Multi-Page Routing (V1)

This project uses multi-page routing, not one-page scroll.

Routes:
- /         → Home (Hero only)
- /about    → About + Experience
- /projects → Projects
- /contact  → Contact form

Rules:
- Do NOT implement anchor navigation (#about, #projects, etc.)
- Do NOT stack all sections on one page
- Each route should remain focused and scannable
- Navbar links navigate between routes

Home (/):
- Hero copy (locked)
- CTAs:
  - View Projects → /projects
  - Resume → /resume.pdf

About (/about):
- About copy (locked)
- Experience section (resume-based only)
- Medium link (Writing)

Projects (/projects):
- Projects cards per UI contract
- No category pills
- Locked project order

Contact (/contact):
- Contact form UI matches screenshot
- Backend sends email via Resend
- Social links + clickable brand logo
