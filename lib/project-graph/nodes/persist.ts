import { errorDetail, graphFail } from "../fail";
import { slugifyRepoName } from "../slug";
import { saveAutoCard, setLastPushedAt } from "../store";
import { GITHUB_OWNER } from "../types";
import type { AutoProject, GraphState } from "../types";

/**
 * Node 6 — this is what actually "publishes" a backfilled (or webhook) card.
 * It does not git-push. It writes JSON to Redis. /projects reads Redis next request.
 */
export async function persistAndPublish(state: GraphState): Promise<GraphState> {
  // 1. Refuse to save a half-built card (missing copy, photo, or section).
  if (!state.gathered || !state.copy || !state.photo || !state.section) {
    return graphFail(state, "persist", "missing gathered, copy, photo, or section");
  }

  // 2. Build the JSON document the page will render (slug, Unsplash URL, demo, chips).
  const now = new Date().toISOString();
  const slug = slugifyRepoName(state.repo);
  const card: AutoProject = {
    slug,
    title: state.copy.title,
    status: "active-development",
    description: state.copy.description,
    techStack: state.copy.techStack,
    githubUrl: `https://github.com/${GITHUB_OWNER}/${state.repo}`,
    githubRepo: `${GITHUB_OWNER}/${state.repo}`,
    demoUrl: state.copy.demoUrl,
    imageUrl: state.photo.imageUrl,
    section: state.section,
    source: "graph",
    locked: false,
    photographer: state.photo.photographer,
    createdAt: now,
    lastGeneratedAt: now,
  };

  // 3. Write to Redis. If UPSTASH_* is missing on this process, saveAutoCard throws.
  try {
    await saveAutoCard(card);
    await setLastPushedAt(slug, state.pushedAt ?? state.gathered.pushedAt ?? now);
  } catch (error) {
    console.error("[project-graph] persist failed", error);
    return graphFail(state, "persist", errorDetail(error));
  }

  // 4. Tell the orchestrator this walk created a new auto card (not a seed rewrite).
  return { ...state, card, outcome: "created" };
}
