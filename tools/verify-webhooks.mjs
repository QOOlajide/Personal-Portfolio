#!/usr/bin/env node
/**
 * Checks whether product repos have a push hook to /api/github/webhook.
 * A hook only on Personal-Portfolio never creates cards.
 *
 *   npm run verify:webhooks
 *
 * Needs GITHUB_TOKEN with admin:repo_hook (classic) or Repository webhooks
 * read (fine-grained). 403 means the token cannot list hooks — use GitHub UI.
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OWNER = "QOOlajide";
const WEBHOOK_SUFFIX = "/api/github/webhook";
const PRODUCT_REPOS = ["voice-agent"];
const PORTFOLIO_REPO = "Personal-Portfolio";

function loadEnvFile(name) {
  const path = join(root, name);
  if (!existsSync(path)) return;
  for (const raw of readFileSync(path, "utf8").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnvFile(".env");
loadEnvFile(".env.local");

function hookMatches(hooks) {
  return hooks.some((hook) => {
    const url = String(hook?.config?.url ?? "");
    const events = Array.isArray(hook?.events) ? hook.events : [];
    return url.endsWith(WEBHOOK_SUFFIX) && events.includes("push") && hook.active !== false;
  });
}

async function listHooks(repo) {
  const token = process.env.GITHUB_TOKEN;
  if (!token?.trim()) {
    return { ok: false, status: 0, message: "GITHUB_TOKEN missing" };
  }
  const response = await fetch(
    `https://api.github.com/repos/${OWNER}/${repo}/hooks`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "deen-dynamics-portfolio",
      },
    },
  );
  const body = await response.text();
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: body.slice(0, 160).replace(/\s+/g, " "),
    };
  }
  return { ok: true, hooks: JSON.parse(body) };
}

let missing = 0;
let unverifiable = 0;

console.log("\nProduct-repo push webhooks (not Personal-Portfolio)\n");

for (const repo of PRODUCT_REPOS) {
  const result = await listHooks(repo);
  if (!result.ok) {
    if (result.status === 403 || result.status === 404) {
      unverifiable += 1;
      console.log(
        `INFO  ${OWNER}/${repo} — token cannot list hooks (${result.status}). Confirm a push webhook in that repo’s GitHub Settings, or install an account GitHub App subscribed to push.`,
      );
    } else {
      missing += 1;
      console.log(`FAIL  ${OWNER}/${repo} — ${result.message}`);
    }
    continue;
  }
  if (hookMatches(result.hooks)) {
    console.log(`PASS  ${OWNER}/${repo} — push hook to ${WEBHOOK_SUFFIX}`);
  } else {
    missing += 1;
    console.log(
      `FAIL  ${OWNER}/${repo} — no active push hook ending in ${WEBHOOK_SUFFIX}. Future pushes will not create cards.`,
    );
  }
}

const portfolio = await listHooks(PORTFOLIO_REPO);
console.log("");
if (!portfolio.ok) {
  console.log(
    `INFO  ${OWNER}/${PORTFOLIO_REPO} — could not list hooks (${portfolio.status || portfolio.message}). Ingest skips this repo either way.`,
  );
} else if (hookMatches(portfolio.hooks)) {
  console.log(
    `WARN  ${OWNER}/${PORTFOLIO_REPO} has the site webhook. Ingest skips that repo, so those deliveries never create cards. Product repos (or an account GitHub App) still need the same payload URL.`,
  );
} else {
  console.log(
    `INFO  ${OWNER}/${PORTFOLIO_REPO} has no product webhook (expected; that repo is skipped).`,
  );
}

if (missing === 0 && unverifiable === 0) {
  console.log("\nProduct webhook check passed.\n");
  process.exit(0);
}
if (missing > 0) {
  console.log(
    `\n${missing} product repo(s) confirmed missing a push webhook. Add one in GitHub Settings or an account GitHub App.\n`,
  );
  process.exit(1);
}
console.log(
  `\nCould not confirm ${unverifiable} product repo(s). GITHUB_TOKEN is likely scoped to ${PORTFOLIO_REPO} only — add the hook in the GitHub UI.\n`,
);
process.exit(1);
