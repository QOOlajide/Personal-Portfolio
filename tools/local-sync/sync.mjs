#!/usr/bin/env node
/**
 * Local activity heartbeat for Deen Dynamics project cards.
 *
 * Watches folders, matches git remotes github.com/QOOlajide/<repo>,
 * and POSTs /api/activity so the matching card can show "Building now".
 *
 * Config: ~/.deen-sync.json  (see deen-sync.example.json)
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync, watch } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

const CONFIG_PATH = join(homedir(), ".deen-sync.json");
const IGNORED_DIRS = new Set([
  ".git",
  "node_modules",
  ".next",
  "dist",
  "build",
  "coverage",
  ".venv",
  "venv",
  ".turbo",
]);
const MAX_DEPTH = 4;
const DEBOUNCE_MS = 2000;
const OWNER = "QOOlajide";

/** @typedef {{ endpoint: string, secret: string, roots: string[] }} Config */

function loadConfig() {
  if (!existsSync(CONFIG_PATH)) {
    console.error(`Missing ${CONFIG_PATH}`);
    console.error("Copy tools/local-sync/deen-sync.example.json to ~/.deen-sync.json");
    process.exit(1);
  }
  const parsed = JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
  if (!parsed.endpoint || !parsed.secret || !Array.isArray(parsed.roots)) {
    console.error("Config needs endpoint, secret, and roots[]");
    process.exit(1);
  }
  return {
    endpoint: String(parsed.endpoint).replace(/\/$/, ""),
    secret: String(parsed.secret),
    roots: parsed.roots.map((root) => resolve(expandHome(root))),
  };
}

function expandHome(path) {
  if (path === "~") return homedir();
  if (path.startsWith("~/")) return join(homedir(), path.slice(2));
  return path;
}

function git(dir, args) {
  try {
    return execFileSync("git", ["-C", dir, ...args], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

function repoFromRemote(url) {
  const match = url.match(/github\.com[:/]+QOOlajide\/([^/.]+)/i);
  return match?.[1] ?? null;
}

function findGitRepos(root, depth = 0, found = []) {
  if (depth > MAX_DEPTH || !existsSync(root)) return found;
  if (existsSync(join(root, ".git"))) {
    found.push(root);
    return found;
  }
  let entries = [];
  try {
    entries = readdirSync(root);
  } catch {
    return found;
  }
  for (const name of entries) {
    if (IGNORED_DIRS.has(name) || name.startsWith(".")) continue;
    const full = join(root, name);
    try {
      if (statSync(full).isDirectory()) findGitRepos(full, depth + 1, found);
    } catch {
      // unreadable
    }
  }
  return found;
}

function matchedWorkspaces(roots) {
  /** @type {{ dir: string, repo: string, branch: string }[]} */
  const matched = [];
  for (const root of roots) {
    for (const dir of findGitRepos(root)) {
      const remote = git(dir, ["remote", "get-url", "origin"]);
      const repo = repoFromRemote(remote);
      if (!repo) continue;
      const branch = git(dir, ["branch", "--show-current"]) || "main";
      matched.push({ dir, repo, branch });
    }
  }
  return matched;
}

async function postActivity(config, repo, branch) {
  const response = await fetch(`${config.endpoint}/api/activity`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: config.secret,
      repo,
      branch,
    }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status} ${text}`);
  }
}

function isDirty(dir) {
  return git(dir, ["status", "--porcelain"]).length > 0;
}

function shouldIgnoreChange(filename) {
  if (!filename) return true;
  return filename.split(/[\\/]/).some((part) => IGNORED_DIRS.has(part));
}

async function main() {
  const config = loadConfig();
  const workspaces = matchedWorkspaces(config.roots);
  if (workspaces.length === 0) {
    console.log("No QOOlajide remotes found under configured roots.");
  } else {
    console.log(`Watching ${workspaces.length} repo(s):`);
    for (const item of workspaces) {
      console.log(`  ${OWNER}/${item.repo}  (${item.dir})`);
    }
  }

  for (const item of workspaces) {
    if (!isDirty(item.dir)) continue;
    try {
      await postActivity(config, item.repo, item.branch);
      console.log(`heartbeat ${item.repo} (${item.branch}) — dirty tree`);
    } catch (error) {
      console.error(`heartbeat failed ${item.repo}:`, error.message);
    }
  }

  const timers = new Map();
  for (const item of workspaces) {
    try {
      watch(item.dir, { recursive: true }, (_event, filename) => {
        if (shouldIgnoreChange(filename ? String(filename) : "")) return;
        const previous = timers.get(item.dir);
        if (previous) clearTimeout(previous);
        timers.set(
          item.dir,
          setTimeout(async () => {
            const branch = git(item.dir, ["branch", "--show-current"]) || item.branch;
            try {
              await postActivity(config, item.repo, branch);
              console.log(`heartbeat ${item.repo} (${branch})`);
            } catch (error) {
              console.error(`heartbeat failed ${item.repo}:`, error.message);
            }
          }, DEBOUNCE_MS),
        );
      });
    } catch (error) {
      console.error(`watch failed ${item.dir}:`, error.message);
    }
  }

  console.log("Local sync running. Ctrl+C to stop.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
