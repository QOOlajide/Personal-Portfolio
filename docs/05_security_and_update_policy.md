# Security & Dependency Policy

Goals:
- Avoid known vulnerabilities
- Avoid accidental breakage
- Keep installs deterministic

Rules:
- Always use a lockfile.
- Do NOT mass-upgrade dependencies.
- Update in small, deliberate batches only.

Audit workflow:
- Run `npm audit --omit=dev`
- If HIGH or CRITICAL issues exist in production deps:
  - Stop
  - Propose the smallest safe fix
  - Do NOT upgrade unrelated packages

This portfolio prioritizes:
- Stability
- Longevity
- Predictable behavior
