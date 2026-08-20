import type { GraphState } from "./types";

/** Collapse classify/copy/image/redis failures into a curl-readable skipReason. */
export function graphFail(
  state: GraphState,
  node: string,
  detail: string,
): GraphState {
  const skipReason = `generate-failed:${node}:${detail}`
    .replace(/\s+/g, " ")
    .slice(0, 240);
  console.error(`[project-graph] ${state.owner}/${state.repo} ${skipReason}`);
  return { ...state, skipReason, outcome: "skipped", failedAt: node };
}

export function errorDetail(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}
