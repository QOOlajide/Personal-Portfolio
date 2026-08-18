import { completeJson } from "../llm";
import type { GraphState, ProjectSection } from "../types";

const SECTIONS: ProjectSection[] = ["ai", "ml", "systems"];

const SYSTEM = `You classify one public GitHub repository into a single portfolio section.

Rules (follow strictly, do not use vibes):
- ai: the product is primarily an LLM/agent/RAG/MCP/tool-calling/voice-agent experience for an end user.
- ml: the product is primarily classical ML, training, ranking, recommendation, or model optimization. Calling an LLM as plumbing is not enough.
- systems: APIs, platforms, infra, and product engineering that is not primarily AI or ML. Memory stores, waitlist APIs, routers, and community/utility sites belong here unless they are clearly an end-user AI/ML product.

Return JSON only: { "section": "ai" | "ml" | "systems", "reason": "one sentence" }`;

/**
 * Node 3 — classifySection
 * ai | ml | systems from gathered signals, via a tight LLM rubric.
 */
export async function classifySection(state: GraphState): Promise<GraphState> {
  if (!state.gathered) {
    return { ...state, skipReason: "empty", outcome: "skipped" };
  }

  const gathered = state.gathered;
  const depNames = collectDependencyNames(gathered.packageJson);

  const user = [
    `name: ${gathered.name}`,
    `description: ${gathered.description ?? ""}`,
    `topics: ${gathered.topics.join(", ")}`,
    `languages: ${Object.keys(gathered.languages).join(", ")}`,
    `homepage: ${gathered.homepage ?? ""}`,
    `latest commit: ${gathered.latestCommitMessage ?? ""}`,
    `package.json deps: ${depNames.join(", ")}`,
    `pyproject.toml:\n${(gathered.pyproject ?? "").slice(0, 1500)}`,
    `README:\n${gathered.readme.slice(0, 4000)}`,
  ].join("\n");

  const json = await completeJson({
    system: SYSTEM,
    user,
    temperature: 0,
  });

  const section = json.section;
  if (typeof section !== "string" || !SECTIONS.includes(section as ProjectSection)) {
    return {
      ...state,
      skipReason: "generate-failed",
      outcome: "skipped",
    };
  }

  return { ...state, section: section as ProjectSection };
}

function collectDependencyNames(
  packageJson: Record<string, unknown> | null,
): string[] {
  if (!packageJson) return [];
  const deps = {
    ...((packageJson.dependencies as Record<string, string> | undefined) ?? {}),
    ...((packageJson.devDependencies as Record<string, string> | undefined) ?? {}),
  };
  return Object.keys(deps).slice(0, 40);
}
