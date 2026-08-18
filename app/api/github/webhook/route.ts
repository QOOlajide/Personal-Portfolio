import { after } from "next/server";
import { NextRequest, NextResponse } from "next/server";
import { snapshotFromGithub } from "@/lib/project-graph/github";
import { verifyGitHubSignature } from "@/lib/project-graph/hmac";
import { runProjectGraph } from "@/lib/project-graph/run";
import { GITHUB_OWNER } from "@/lib/project-graph/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PushPayload = {
  repository?: {
    name: string;
    full_name: string;
    private: boolean;
    fork: boolean;
    archived: boolean;
    is_template?: boolean;
    size: number;
    description: string | null;
    default_branch: string | null;
    html_url: string;
    homepage: string | null;
    pushed_at: string | null;
    owner?: { login: string };
  };
};

export async function POST(request: NextRequest) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "Webhook is not configured" },
      { status: 500 },
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");
  if (!verifyGitHubSignature(rawBody, signature, secret)) {
    return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
  }

  const event = request.headers.get("x-github-event");
  if (event === "ping") {
    return NextResponse.json({ ok: true, ping: true });
  }
  if (event !== "push") {
    return NextResponse.json({ ok: true, ignored: event });
  }

  let payload: PushPayload;
  try {
    payload = JSON.parse(rawBody) as PushPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const repo = payload.repository;
  if (!repo?.name || !repo.owner?.login) {
    return NextResponse.json({ ok: false, error: "Missing repository" }, { status: 400 });
  }

  const owner = repo.owner.login;
  if (owner.toLowerCase() !== GITHUB_OWNER.toLowerCase()) {
    return NextResponse.json({ ok: true, ignored: "not-owner" });
  }

  after(async () => {
    try {
      await runProjectGraph({
        trigger: "webhook",
        owner,
        repo: repo.name,
        pushedAt: repo.pushed_at ?? new Date().toISOString(),
        snapshot: snapshotFromGithub({
          full_name: repo.full_name,
          name: repo.name,
          private: repo.private,
          fork: repo.fork,
          archived: repo.archived,
          is_template: repo.is_template ?? false,
          size: repo.size,
          description: repo.description,
          default_branch: repo.default_branch,
          html_url: repo.html_url,
          homepage: repo.homepage,
          pushed_at: repo.pushed_at,
          owner: { login: owner },
        }),
      });
    } catch (error) {
      console.error("[project-graph] webhook run failed", error);
    }
  });

  return NextResponse.json({ ok: true, accepted: `${owner}/${repo.name}` }, { status: 202 });
}
