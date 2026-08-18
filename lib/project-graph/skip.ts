import { GITHUB_OWNER, PORTFOLIO_REPO } from "./types";
import type { RepoSnapshot } from "./types";

/**
 * Name/description tokens that mean practice or noise — not a product card.
 * Matched case-insensitively against `name description`.
 */
const NOISE_PATTERNS: RegExp[] = [
  /challenge/i,
  /playground/i,
  /demo-repo/i,
  /tutorial/i,
  /homework/i,
  /practice/i,
  /fundamentals?/i,
];

export type SkipReason =
  | "not-owner"
  | "private"
  | "fork"
  | "template"
  | "archived"
  | "empty"
  | "portfolio"
  | "noise";

export function looksLikeTemplateName(name: string, description: string | null): boolean {
  const blob = `${name} ${description ?? ""}`;
  return /\btemplate\b/i.test(blob) || /[-_]template\b/i.test(name);
}

export function looksLikeNoise(name: string, description: string | null): boolean {
  const blob = `${name} ${description ?? ""}`;
  return NOISE_PATTERNS.some((pattern) => pattern.test(blob));
}

export function isPortfolioRepo(name: string): boolean {
  return name.toLowerCase() === PORTFOLIO_REPO.toLowerCase();
}

/**
 * GitHub's `is_template` flag is not enough by itself (`llm-router` is original
 * work that happens to be marked as a template). Skip templates when the name
 * or description says template — e.g. llm-chat-app-template.
 */
export function shouldSkipRepo(
  owner: string,
  name: string,
  snapshot: RepoSnapshot,
): SkipReason | null {
  if (owner.toLowerCase() !== GITHUB_OWNER.toLowerCase()) return "not-owner";
  if (snapshot.private) return "private";
  if (snapshot.fork) return "fork";
  if (isPortfolioRepo(name)) return "portfolio";
  if (snapshot.archived) return "archived";
  if (snapshot.sizeKb <= 0) return "empty";
  if (looksLikeTemplateName(name, snapshot.description)) return "template";
  if (looksLikeNoise(name, snapshot.description)) return "noise";
  return null;
}
