# Projects Section — UI Contract (match Screenshot #1 format)

Goal:
- Project cards should match the format of the first screenshot (mobile card layout).

Grid behavior:
- Desktop: 2-column grid (max 2 cards per row)
- Tablet: 2-column
- Mobile: 1-column (stacked)

Card layout (top → bottom):
1) Thumbnail (image banner)
   - Fixed height (consistent across cards)
   - Rounded corners
   - Cover/center crop
   - Optional subtle overlay gradient for legibility

2) Category pills OVERLAID on thumbnail (top-right)
   - 1–2 pills maximum (e.g., "AI/ML", "Web Development")
   - Semi-transparent background, blurred look optional
   - Rounded "capsule" style
   - White text, muted opacity

3) Title (bold, large)
   - Example: “CampusMind AI Agent”
   - Left aligned

4) Meta row with icon
   - Example: clock icon + "Duration: 4.5 months"
   - Keep muted (secondary text)

5) Description paragraph (2–4 lines)
   - Scannable; clamp overflow if needed

6) Tech stack chips (wrap)
   - Rounded chips
   - Muted background
   - Max: 8–10 chips displayed (avoid chip spam)
   - If more than max, show “+X more” chip OR prioritize core stack only

7) Bottom action row (two actions)
   - Left action: “View Project →” (primary link style)
   - Right action: “Demo” (secondary link/button style)
   - Additionally REQUIRED by your initial spec:
     - Add GitHub button somewhere in the action row (icon button acceptable)
     - Add Demo button (if available)
   - If a project lacks demo: disable/hide Demo, but keep layout aligned

Interaction:
- Hover: slow, smooth (slight lift + opacity)
- No bouncy transitions
- Click: card should not be fully clickable if it causes accidental navigation; only buttons/links clickable

Content rules:
- Title: ≤ 40 characters ideal
- Description: “what it does + who it helps” in 1–2 sentences
- Always show GitHub if public
- Always show Demo if deployed
