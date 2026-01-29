# Deen Dynamics — Portfolio V1

Developer portfolio for **Quamdeen Olajide**.

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| Language | TypeScript | 5.9.3 |
| Runtime | React | 19.2.3 |
| Styling | Tailwind CSS | 4.1.18 |
| Icons | Lucide React | 0.562.0 |
| Utilities | clsx, tailwind-merge, class-variance-authority | — |
| State | Zustand | 5.0.10 |
| Motion | Framer Motion | 12.0.0 |

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with navbar, footer, theme script
│   ├── page.tsx            # Home (/)
│   ├── about/page.tsx      # About (/about)
│   ├── projects/page.tsx   # Projects (/projects)
│   ├── contact/page.tsx    # Contact (/contact)
│   ├── globals.css         # Theme variables, base styles
│   ├── icon.tsx            # Generated favicon
│   └── apple-icon.tsx      # Generated Apple touch icon
├── components/
│   ├── layout/
│   │   ├── navbar.tsx      # Sticky navbar with route links
│   │   ├── footer.tsx      # Footer with social icons
│   │   └── theme-toggle.tsx # Dark/light mode toggle
│   └── ui/
│       └── image-with-fallback.tsx # Image component with placeholder
├── lib/
│   └── utils.ts            # cn() helper for class merging
├── public/
│   └── images/
│       ├── brand/          # Brand assets (logo, favicon source)
│       ├── projects/       # Project thumbnails
│       ├── ui-reference/   # Dev reference images (not rendered)
│       └── misc/           # Optional extras
└── docs/                   # Spec files (design contracts)
```

## Completed (Phase 1)

### Global Layout & Theme
- [x] Dark-first theme (charcoal background `#0a0a0b`, white text `#fafafa`)
- [x] Light theme (white background, charcoal text)
- [x] CSS variables for consistent theming
- [x] Geist Sans / Inter / IBM Plex Sans font stack

### Dark Mode Toggle
- [x] Moon/Sun icon toggle in navbar
- [x] Persists choice to localStorage
- [x] Inline script prevents flash of wrong theme
- [x] Yellow glow hover effect for affordance

### Navigation
- [x] Sticky navbar with backdrop blur
- [x] Brand text: "Quamdeen Olajide"
- [x] Route links: Home, About, Projects, Contact
- [x] Active route highlighting

### Footer
- [x] Copyright: "© 2026 Deen Dynamics"
- [x] GitHub icon → [github.com/QOOlajide](https://github.com/QOOlajide)
- [x] LinkedIn icon → [linkedin.com/in/quamdeen-olajide](https://www.linkedin.com/in/quamdeen-olajide/)

### Assets & Metadata
- [x] Image folder structure per contract
- [x] ImageWithFallback component for missing images
- [x] Generated favicon with "D" lettermark
- [x] Site title: "Deen Dynamics"
- [x] Meta description (recruiter-friendly)

### Route Pages (Placeholders)
- [x] `/` — Home
- [x] `/about` — About + Experience
- [x] `/projects` — Projects
- [x] `/contact` — Contact

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Next Steps

- [ ] Hero section content
- [ ] About + Experience section
- [ ] Projects section with cards
- [ ] Contact form

---

Built with intention. No feature creep.
