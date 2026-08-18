import { after } from "next/server";
import { NextRequest, NextResponse } from "next/server";
import { listOwnerPublicRepos, snapshotFromGithub } from "@/lib/project-graph/github";
import { secretsEqual } from "@/lib/project-graph/hmac";
import { runProjectGraph } from "@/lib/project-graph/run";
import { GITHUB_OWNER } from "@/lib/project-graph/types";
import type { GraphState } from "@/lib/project-graph/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function summarize(state: GraphState) {
  return {
    repo: `${state.owner}/${state.repo}`,
    outcome: state.outcome,
    skipReason: state.skipReason,
    slug: state.card?.slug ?? state.existing?.slug,
    section: state.section,
  };
}

/**
 * One-time (or infrequent) backfill. Auth is a shared secret, not user login —
 * no dashboard, no accounts (docs/00_system_context.md).
 *
 * { "repo": "Waitlist-API" } runs one repo in-request.
 * { "all": true } enqueues every public owner repo.
 */
export async function POST(request: NextRequest) {
  const expected = process.env.SYNC_SECRET;
  if (!expected) {
    return NextResponse.json({ ok: false, error: "Not configured" }, { status: 500 });
  }

  const provided =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    request.headers.get("x-sync-secret") ??
    "";
  if (!provided || !secretsEqual(provided, expected)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: { repo?: string; all?: boolean } = {};
  try {
    body = (await request.json()) as { repo?: string; all?: boolean };
  } catch {
    body = {};
  }

  if (body.repo) {
    const state = await runProjectGraph({
      trigger: "backfill",
      owner: GITHUB_OWNER,
      repo: body.repo,
    });
    return NextResponse.json({ ok: true, result: summarize(state) });
  }

  const repos = await listOwnerPublicRepos();

  after(async () => {
    try {
      for (const repo of repos) {
        await runProjectGraph({
          trigger: "backfill",
          owner: repo.owner.login || GITHUB_OWNER,
          repo: repo.name,
          pushedAt: repo.pushed_at ?? undefined,
          snapshot: snapshotFromGithub(repo),
        });
      }
      console.log(`[project-graph] backfill finished repos=${repos.length}`);
    } catch (error) {
      console.error("[project-graph] backfill failed", error);
    }
  });

  return NextResponse.json(
    {
      ok: true,
      started: true,
      repos: repos.map((repo) => repo.name),
    },
    { status: 202 },
  );
}
