#!/usr/bin/env node
/**
 * Checks live-card env vars without printing secrets.
 * Loads .env then .env.local from the repo root.
 *
 *   npm run verify:env
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvFile(name) {
  const path = join(root, name);
  if (!existsSync(path)) return false;
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
  return true;
}

loadEnvFile(".env");
loadEnvFile(".env.local");

const GRAPH = [
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "GITHUB_TOKEN",
  "GITHUB_WEBHOOK_SECRET",
  "SYNC_SECRET",
  "OPENAI_API_KEY",
  "UNSPLASH_ACCESS_KEY",
];
const OPTIONAL = ["OPENAI_MODEL", "PEXELS_API_KEY"];
const SKIP_FOR_GRAPH = ["RESEND_API_KEY", "CONTACT_TO_EMAIL", "CONTACT_FROM_EMAIL"];

function present(key) {
  return Boolean(process.env[key]?.trim());
}

function mask(value) {
  const v = value.trim();
  if (v.length <= 8) return `${v.length} chars`;
  return `${v.slice(0, 4)}…${v.slice(-4)} (${v.length} chars)`;
}

let failed = 0;

function pass(label, detail = "") {
  console.log(`PASS  ${label}${detail ? ` — ${detail}` : ""}`);
}

function fail(label, detail) {
  failed += 1;
  console.log(`FAIL  ${label} — ${detail}`);
}

function skip(label, detail) {
  console.log(`SKIP  ${label} — ${detail}`);
}

console.log("\n1) Present in .env / .env.local\n");
for (const key of GRAPH) {
  if (present(key)) pass(key, mask(process.env[key]));
  else fail(key, "missing — see guide in chat / docs/20");
}
for (const key of OPTIONAL) {
  if (present(key)) pass(key, "optional, set");
  else skip(key, "optional");
}
for (const key of SKIP_FOR_GRAPH) {
  skip(key, "contact form only, not needed for project cards");
}

console.log("\n2) Live API checks (no secrets printed)\n");

async function checkUpstash() {
  const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return skip("Upstash ping", "missing URL or token");
  const response = await fetch(`${url}/ping`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await response.text();
  if (response.ok && /PONG/i.test(body)) pass("Upstash ping");
  else fail("Upstash ping", `${response.status} ${body.slice(0, 120)}`);
}

async function checkGithub() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return skip("GitHub token", "missing");
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": "deen-dynamics-portfolio",
      Accept: "application/vnd.github+json",
    },
  });
  if (!response.ok) {
    return fail("GitHub token", `${response.status} ${await response.text().then((t) => t.slice(0, 120))}`);
  }
  const user = await response.json();
  pass("GitHub token", `login=${user.login}`);
}

async function checkOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return skip("OpenAI", "missing");
  const response = await fetch("https://api.openai.com/v1/models", {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (response.ok) pass("OpenAI key");
  else fail("OpenAI key", `${response.status} ${await response.text().then((t) => t.slice(0, 120))}`);
}

async function checkUnsplash() {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return skip("Unsplash", "missing");
  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", "calendar planning notebook");
  url.searchParams.set("per_page", "1");
  const response = await fetch(url, {
    headers: { Authorization: `Client-ID ${key}`, "Accept-Version": "v1" },
  });
  if (response.ok) pass("Unsplash access key");
  else fail("Unsplash access key", `${response.status} ${await response.text().then((t) => t.slice(0, 120))}`);
}

async function checkPexels() {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return skip("Pexels", "optional fallback");
  const response = await fetch("https://api.pexels.com/v1/search?query=notebook&per_page=1", {
    headers: { Authorization: key },
  });
  if (response.ok) pass("Pexels key");
  else fail("Pexels key", `${response.status}`);
}

await checkUpstash();
await checkGithub();
await checkOpenAI();
await checkUnsplash();
await checkPexels();

console.log("\n3) Secrets you generate (no vendor dashboard)\n");
if (present("GITHUB_WEBHOOK_SECRET")) {
  pass("GITHUB_WEBHOOK_SECRET", "set locally — also paste into GitHub webhook Secret + Vercel");
} else {
  fail("GITHUB_WEBHOOK_SECRET", "run: openssl rand -hex 32");
}
if (present("SYNC_SECRET")) {
  pass("SYNC_SECRET", "set locally — also paste into ~/.deen-sync.json + Vercel");
} else {
  fail("SYNC_SECRET", "run: openssl rand -hex 32");
}

console.log(`\n${failed === 0 ? "All required graph checks passed." : `${failed} check(s) failed.`}\n`);
console.log("Webhook ping can only succeed after this branch is deployed, then GitHub → Recent Deliveries.\n");

process.exit(failed === 0 ? 0 : 1);
