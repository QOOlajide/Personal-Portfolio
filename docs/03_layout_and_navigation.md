# Visual Theme & Motion Contract

Theme:
- Dark, low-saturation, minimalist
- Near-black → charcoal background gradient
- High contrast, muted typography
- ONE accent color only
- No glassmorphism, no flashy gradients, no neon

Typography:
- Classy, professional, standard
- Prefer Geist Sans / Inter / IBM Plex Sans
- Use tracking + uppercase for hero styling (not decorative fonts)

---------------------------------------
Motion Philosophy (Very Important)

Motion should feel:
- Sleek
- Smooth
- Calm
- Slightly slow
- Intentional

Motion should NEVER feel:
- Bouncy
- Flashy
- Distracting
- “Demo-like”

---------------------------------------
Framer Motion — Usage Contract

Framer Motion is:
- Allowed
- Encouraged
- To be used sparingly and intentionally

Purpose of Framer Motion in this project:
- Enhance perceived quality
- Improve flow between states
- Add subtle polish
- NOT to draw attention to itself

Allowed use cases:
- Page transitions (route changes):
  - fade-in + slight vertical translate
- Section entry:
  - opacity from 0 → 1
  - translateY from 4–8px → 0
- Hover micro-interactions:
  - subtle lift (≤ 4px)
  - slight opacity or shadow change
- Button and link focus/hover polish

Disallowed use cases:
- Spring or bounce animations
- Large translations or scaling
- Scroll hijacking
- Complex animation timelines
- Decorative or purely aesthetic motion

---------------------------------------
Motion Parameters (Lock These)

Timing:
- Section / page entry: 0.5s – 0.7s
- Hover interactions: 0.22s – 0.32s

Easing:
- Prefer ease-in-out
- Avoid spring physics entirely

Distance:
- Max translateY: 8px
- Prefer opacity-first motion

---------------------------------------
Implementation Guidance

- Framer Motion should wrap components intentionally (pages, sections, cards)
- Do not animate everything
- Static UI is preferred unless motion improves clarity or feel
- If unsure whether to animate something, do not animate it

---------------------------------------
Overall Feel

The site should feel:
- Premium
- Thoughtful
- Confident
- Calm

Motion should support reading and navigation — never compete with them.
