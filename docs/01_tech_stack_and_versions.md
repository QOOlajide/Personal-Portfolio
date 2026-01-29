# Tech Stack — Locked Versions (Stability First)

Use ONLY the following versions unless I explicitly approve a change.

Framework & Runtime:
- next@16.1.3
- react@19.2.3
- react-dom@19.2.3
- node >= 20 (LTS)

Language & Tooling:
- typescript@5.9.3

Styling & UI (NO CLI tools):
- tailwindcss@4.1.18
- lucide-react@0.562.0
- class-variance-authority@0.7.1
- clsx@2.1.1
- tailwind-merge@3.4.0

State & Motion:
- zustand@5.0.10
- framer-motion@12.x (minimal usage only)

Design system:
- Use shadcn/ui-style components
- Components must be manually added and locally owned
- Do NOT install or use the shadcn CLI

Hard rules:
- React and react-dom MUST always match exactly.
- Do NOT use React canary builds.
- Do NOT use loose version ranges (* or blanket ^).
- Keep dependencies minimal (this is a portfolio).
