import { gatherRepoSignals } from "../github";
import type { GraphState } from "../types";

/**
 * Node 2 — gatherRepo
 * README, languages, topics, homepage, package.json / pyproject.toml, latest commit.
 */
export async function gatherRepo(state: GraphState): Promise<GraphState> {
  const gathered = await gatherRepoSignals(state.owner, state.repo);
  if (!gathered) {
    return {
      ...state,
      skipReason: "empty",
      outcome: "skipped",
    };
  }

  if (gathered.private || gathered.fork || gathered.archived || gathered.sizeKb <= 0) {
    return {
      ...state,
      gathered,
      skipReason: gathered.private
        ? "private"
        : gathered.fork
          ? "fork"
          : gathered.archived
            ? "archived"
            : "empty",
      outcome: "skipped",
    };
  }

  return { ...state, gathered };
}
