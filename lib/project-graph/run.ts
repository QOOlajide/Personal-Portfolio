import { ingestAndDedupe } from "./nodes/ingest";
import { gatherRepo } from "./nodes/gather";
import { classifySection } from "./nodes/classify";
import { writeCardCopy } from "./nodes/copy";
import { sourceUnsplashPhoto } from "./nodes/image";
import { persistAndPublish } from "./nodes/persist";
import type { GraphState, IngestInput } from "./types";

/**
 * Explicit graph. Each node receives the same typed state object.
 * This is graph engineering inside the Next.js app — not a chatbot on the page.
 *
 * push → ingestAndDedupe
 *   ├ skip → No card
 *   ├ known seed/auto → updatePushTimestamp
 *   └ new qualifying → gather → classify → copy → image → persist
 */
export async function runProjectGraph(input: IngestInput): Promise<GraphState> {
  console.log(
    `[project-graph] start trigger=${input.trigger} repo=${input.owner}/${input.repo}`,
  );

  let state = await ingestAndDedupe(input);
  if (state.outcome === "skipped" || state.outcome === "status-only") {
    console.log(
      `[project-graph] ${state.outcome} repo=${input.owner}/${input.repo} reason=${state.skipReason ?? "known-card"}`,
    );
    return state;
  }

  state = await gatherRepo(state);
  if (state.outcome === "skipped") return logSkip(state);

  try {
    state = await classifySection(state);
    if (state.outcome === "skipped") return logSkip(state);

    state = await writeCardCopy(state);
    if (state.outcome === "skipped") return logSkip(state);

    state = await sourceUnsplashPhoto(state);
    if (state.outcome === "skipped") return logSkip(state);

    state = await persistAndPublish(state);
  } catch (error) {
    console.error(
      `[project-graph] failed repo=${input.owner}/${input.repo}`,
      error,
    );
    return logSkip({
      ...state,
      skipReason: "generate-failed",
      outcome: "skipped",
    });
  }

  if (state.outcome === "skipped") return logSkip(state);

  console.log(
    `[project-graph] created slug=${state.card?.slug} section=${state.section}`,
  );
  return state;
}

function logSkip(state: GraphState): GraphState {
  console.log(
    `[project-graph] skipped repo=${state.owner}/${state.repo} reason=${state.skipReason ?? "unknown"}`,
  );
  return state;
}
