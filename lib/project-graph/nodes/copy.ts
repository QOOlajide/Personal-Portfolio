import { filterToAllowlist, TECH_ALLOWLIST } from "@/data/tech-allowlist";
import { graphFail } from "../fail";
import { demoUrlFromHomepage } from "../github";
import { completeJson } from "../llm";
import type { GraphState } from "../types";

const SYSTEM = `You write a Deen Dynamics project card.

Voice: production-ready, calm, intentional. No buzzwords. No gimmicks.
Description must answer: what problem does this solve, and who does it help?
2 sentences. No implementation dump. No stack laundry list in the prose.

Title: clear and descriptive, no cute branding, no abbreviations unless widely known, max 48 characters.

techStack: choose only from this allowlist, core stack only, max 8:
${TECH_ALLOWLIST.join(", ")}

Return JSON only: { "title": string, "description": string, "techStack": string[] }`;

/**
 * Node 4 — writeCardCopy
 * Deen Dynamics voice. Chips are intersected with the resume allowlist in code.
 * New cards always start as active-development.
 */
export async function writeCardCopy(state: GraphState): Promise<GraphState> {
  if (!state.gathered || !state.section) {
    return { ...state, skipReason: "empty", outcome: "skipped" };
  }

  const gathered = state.gathered;
  const languageHints = Object.keys(gathered.languages);
  const user = [
    `section: ${state.section}`,
    `repo: ${gathered.fullName}`,
    `github description: ${gathered.description ?? ""}`,
    `topics: ${gathered.topics.join(", ")}`,
    `languages: ${languageHints.join(", ")}`,
    `latest commit: ${gathered.latestCommitMessage ?? ""}`,
    `README:\n${gathered.readme.slice(0, 4000)}`,
  ].join("\n");

  const json = await completeJson({
    system: SYSTEM,
    user,
    temperature: 0.4,
  });

  const title = typeof json.title === "string" ? json.title.trim() : "";
  const description =
    typeof json.description === "string" ? json.description.trim() : "";
  const proposed = Array.isArray(json.techStack)
    ? json.techStack.filter((item): item is string => typeof item === "string")
    : [];

  const techStack = filterToAllowlist(
    [...proposed, ...languageHints],
    8,
  );

  if (!title || !description) {
    return graphFail(state, "copy", "empty title or description");
  }

  return {
    ...state,
    copy: {
      title: title.slice(0, 80),
      description,
      techStack,
      status: "active-development",
      demoUrl: demoUrlFromHomepage(gathered.homepage),
    },
  };
}
