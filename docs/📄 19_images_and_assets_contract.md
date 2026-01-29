# Images & Assets — Canonical Contract (V1)

Purpose:
- Ensure all referenced images are concrete, discoverable, and correctly used.
- Prevent Cursor from guessing image names or paths.
- Standardize how images are stored and referenced across the project.

---------------------------------------
Base Rule

ALL images must live under:

/public/images/

No images outside this directory.
No ad-hoc paths.
No dynamic guessing.

---------------------------------------
Folder Structure (Locked)

public/
└── images/
    ├── brand/
    ├── ui-reference/
    ├── projects/
    └── misc/

---------------------------------------
Brand Assets (/public/images/brand)

These assets define identity and branding.

Required files:
- brand-logo.png
  → My circular “Deen Dynamics” profile image
  → Used for:
    - favicon
    - external links brand logo
    - footer brand mark

- brand-logo-square.png (optional)
  → Same logo, square crop
  → Used if needed for Open Graph or meta previews

Rules:
- These files must NOT be renamed.
- These are the only images used for branding.
- brand-logo.png is the favicon source.

---------------------------------------
UI Reference Images (/public/images/ui-reference)

These images are NOT rendered in production UI.
They are for developer reference only.

Purpose:
- Guide layout decisions
- Match formats shown in provided screenshots

Required files:
- projects-card-reference.png
  → Screenshot showing desired Projects card format
  → Used to implement Projects section layout

- experience-section-reference.png
  → Screenshot showing desired Experience section format
  → Used to implement Experience layout

- contact-form-reference.png
  → Screenshot showing desired Contact form layout
  → Used to match “Get in touch / Let’s work together” form

- external-links-reference.png
  → Screenshot showing brand logo next to external/social links

Rules:
- These images are NOT displayed to users.
- They exist only as visual specs for implementation.
- Cursor must treat them as reference, not content.

---------------------------------------
Project Images (/public/images/projects)

Each project must have exactly ONE thumbnail image.

Naming convention:
- Use kebab-case
- Match project slug

Required files:
- eid-community-platform.png
- mcp-schedule-meeting-server.png
- agent-workflow-builder.png
- terminal-coding-agent.png
- ai-customer-support-voice-agent.png

Rules:
- Thumbnails are decorative, not explanatory.
- Consistent aspect ratio across all projects.
- No text-heavy images.
- No category labels baked into images.

---------------------------------------
Misc Images (/public/images/misc)

Optional.
Only used if explicitly required later.

---------------------------------------
Image Usage Rules

- Never hardcode image paths outside /public/images
- Never guess filenames
- Never reuse UI reference images as real UI content
- Project cards must reference images from /projects only
- Favicon must reference /brand/brand-logo.png

---------------------------------------
Cursor Instructions (Important)

If an image is referenced in a spec:
- Assume the image exists at the exact path defined above.
- Do NOT invent filenames.
- Do NOT inline base64 images.
- Do NOT fetch external images.


---------------------------------------
Image Placeholder Policy (IMPORTANT)

During development, project and brand images may be missing
or filenames may not yet match the contract.

Required behavior:
- If an image file is missing, render a visual placeholder instead
- Placeholder must preserve the exact layout and dimensions
- Placeholder must NOT break the page or throw runtime errors

Allowed placeholder approaches:
- Neutral background block with subtle border
- Skeleton-style box
- Static fallback image (e.g., /images/misc/placeholder.png)
- Text-based placeholder (“Project image coming soon”)

Disallowed behavior:
- Throwing errors for missing images
- Breaking layout or card dimensions
- Hard failing due to missing assets

Implementation guidance:
- Use conditional rendering or onError fallbacks
- Do NOT block page rendering on image availability

Intent:
- Images are finalized LAST
- UI and layout correctness comes first
