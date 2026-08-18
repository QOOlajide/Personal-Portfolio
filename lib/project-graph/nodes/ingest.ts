import { fetchRepoSnapshot } from "../github";
import { shouldSkipRepo } from "../skip";
import { findCardByRepo, setLastPushedAt } from "../store";
import type { GraphState, IngestInput } from "../types";
import { GITHUB_OWNER } from "../types";

/**
 * Node 1 — ingestAndDedupe
 * Ignore private, forks, templates-by-name, archived, empty, portfolio, noise.
 * If a seed or auto card already exists, only refresh lastPushedAt.
 */
export async function ingestAndDedupe(input: IngestInput): Promise<GraphState> {
  const state: GraphState = {
    trigger: input.trigger,
    owner: input.owner,
    repo: input.repo,
    pushedAt: input.pushedAt,
    snapshot: input.snapshot,
  };

  if (input.owner.toLowerCase() !== GITHUB_OWNER.toLowerCase()) {
    state.skipReason = "not-owner";
    state.outcome = "skipped";
    return state;
  }

  const existing = await findCardByRepo(input.owner, input.repo);
  if (existing) {
    state.existing = existing;
    const at = input.pushedAt ?? new Date().toISOString();
    await setLastPushedAt(existing.slug, at);
    state.outcome = "status-only";
    return state;
  }

  const snapshot = input.snapshot ?? (await fetchRepoSnapshot(input.owner, input.repo));
  if (!snapshot) {
    state.skipReason = "empty";
    state.outcome = "skipped";
    return state;
  }
  state.snapshot = snapshot;

  const skipReason = shouldSkipRepo(input.owner, input.repo, snapshot);
  if (skipReason) {
    state.skipReason = skipReason;
    state.outcome = "skipped";
    return state;
  }

  return state;
}
