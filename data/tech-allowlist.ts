/**
 * Resume-derived tech chips only (docs/12_projects_data_schema.md).
 * Auto-generated cards never invent tools outside this list.
 * Seed cards keep their existing chips, including a few locked exceptions.
 */

export const LANGUAGE_CHIPS = [
  "Python",
  "JavaScript",
  "TypeScript",
  "Java",
  "SQL",
  "HTML/CSS",
  "Bash/Shell Scripting",
] as const;

export const TOOL_CHIPS = [
  "React",
  "Next.js",
  "Node.js",
  "Express.js",
  "FastAPI",
  "PostgreSQL",
  "Redis",
  "Pinecone",
  "Tailwind CSS",
  "Docker",
  "Git",
  "Vercel",
  "AWS",
  "Prometheus",
  "Figma",
] as const;

export const TECH_ALLOWLIST = [...LANGUAGE_CHIPS, ...TOOL_CHIPS] as const;

export type AllowedTech = (typeof TECH_ALLOWLIST)[number];

const ALLOWLIST_SET = new Set<string>(TECH_ALLOWLIST);

/** GitHub language names / lockfile deps → resume chip. */
const SIGNAL_TO_CHIP: Record<string, AllowedTech> = {
  python: "Python",
  javascript: "JavaScript",
  typescript: "TypeScript",
  java: "Java",
  sql: "SQL",
  html: "HTML/CSS",
  css: "HTML/CSS",
  "html/css": "HTML/CSS",
  shell: "Bash/Shell Scripting",
  bash: "Bash/Shell Scripting",
  "bash/shell scripting": "Bash/Shell Scripting",
  react: "React",
  "react-dom": "React",
  next: "Next.js",
  "next.js": "Next.js",
  nextjs: "Next.js",
  node: "Node.js",
  "node.js": "Node.js",
  express: "Express.js",
  "express.js": "Express.js",
  fastapi: "FastAPI",
  postgres: "PostgreSQL",
  postgresql: "PostgreSQL",
  pg: "PostgreSQL",
  redis: "Redis",
  pinecone: "Pinecone",
  "@pinecone-database/pinecone": "Pinecone",
  tailwindcss: "Tailwind CSS",
  "tailwind css": "Tailwind CSS",
  docker: "Docker",
  dockerfile: "Docker",
  git: "Git",
  vercel: "Vercel",
  aws: "AWS",
  prometheus: "Prometheus",
  figma: "Figma",
};

export function isAllowedTech(value: string): value is AllowedTech {
  return ALLOWLIST_SET.has(value);
}

export function chipFromSignal(raw: string): AllowedTech | null {
  const key = raw.trim().toLowerCase();
  return SIGNAL_TO_CHIP[key] ?? null;
}

export function filterToAllowlist(chips: string[], max = 8): AllowedTech[] {
  const seen = new Set<AllowedTech>();
  const out: AllowedTech[] = [];
  for (const chip of chips) {
    const mapped = isAllowedTech(chip) ? chip : chipFromSignal(chip);
    if (!mapped || seen.has(mapped)) continue;
    seen.add(mapped);
    out.push(mapped);
    if (out.length >= max) break;
  }
  return out;
}
