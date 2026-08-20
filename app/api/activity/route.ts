import { NextRequest, NextResponse } from "next/server";
import { slugForActivityRepo } from "@/lib/project-graph/catalog";
import { secretsEqual } from "@/lib/project-graph/hmac";
import { setActivity } from "@/lib/project-graph/store";
import { GITHUB_OWNER } from "@/lib/project-graph/types";

export const dynamic = "force-dynamic";

type ActivityBody = {
  repo?: string;
  branch?: string;
  secret?: string;
};

export async function POST(request: NextRequest) {
  const expected = process.env.SYNC_SECRET;
  if (!expected) {
    return NextResponse.json({ ok: false, error: "Not configured" }, { status: 500 });
  }

  let body: ActivityBody;
  try {
    body = (await request.json()) as ActivityBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const provided =
    body.secret ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    request.headers.get("x-sync-secret") ??
    "";

  if (!provided || !secretsEqual(provided, expected)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const repo = body.repo?.trim();
  const branch = body.branch?.trim();
  if (!repo || !branch) {
    return NextResponse.json(
      { ok: false, error: "repo and branch are required" },
      { status: 400 },
    );
  }

  const slug = slugForActivityRepo(repo);

  try {
    await setActivity(slug, {
      repo: `${GITHUB_OWNER}/${repo}`,
      branch,
      at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[project-graph] activity write failed", error);
    return NextResponse.json({ ok: false, error: "Store unavailable" }, { status: 503 });
  }

  return NextResponse.json({ ok: true, slug });
}
