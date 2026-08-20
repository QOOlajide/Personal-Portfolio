import { GITHUB_OWNER } from "../types";
import type { AutoProject, GraphState } from "../types";
import { slugifyRepoName } from "../slug";
import { saveAutoCard, setLastPushedAt } from "../store";

/**
 * Node 6 — persistAndPublish
 * Write the card JSON to Redis. The projects page reads it on the next request.
 * No git commit. No Vercel rebuild wait.
 */
export async function persistAndPublish(state: GraphState): Promise<GraphState> {
  if (!state.gathered || !state.copy || !state.photo || !state.section) {
    return { ...state, skipReason: "generate-failed", outcome: "skipped" };
  }

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

  try {
    await saveAutoCard(card);
    await setLastPushedAt(slug, state.pushedAt ?? state.gathered.pushedAt ?? now);
  } catch (error) {
    console.error("[project-graph] persist failed", error);
    return { ...state, skipReason: "generate-failed", outcome: "skipped" };
  }

  return { ...state, card, outcome: "created" };
}
