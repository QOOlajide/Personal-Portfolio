# Dark Mode Toggle (No Dependencies)

Goal:
- Provide a dark mode toggle without using next-themes or any external library.

Requirements:
- Use the Tailwind "class" strategy (dark mode via a class on <html>).
- Persist user choice in localStorage (e.g., "theme" = "dark" | "light").
- On first load:
  - If localStorage has a value, apply it.
  - Else, fall back to prefers-color-scheme.
- Must avoid a "flash" of wrong theme on initial render:
  - Apply theme class as early as possible (before paint), using a tiny inline script.
- Toggle control:
  - In navbar, near the Resume button (or on the far right).
  - Accessible: button has aria-label, focus styles, and visible state.
- Default aesthetic: dark-first (portfolio looks best dark).
