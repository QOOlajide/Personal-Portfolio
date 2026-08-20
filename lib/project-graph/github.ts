import { GITHUB_OWNER } from "./types";
import type { GatheredRepo, RepoSnapshot } from "./types";

const API = "https://api.github.com";

function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "deen-dynamics-portfolio",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function githubJson<T>(path: string): Promise<T | null> {
  const response = await fetch(`${API}${path}`, {
    headers: githubHeaders(),
    cache: "no-store",
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub ${response.status} ${path}: ${body.slice(0, 200)}`);
  }
  return (await response.json()) as T;
}

async function githubTextFile(path: string): Promise<string | null> {
  const data = await githubJson<{ content?: string; encoding?: string }>(path);
  if (!data?.content) return null;
  if (data.encoding === "base64") {
    return Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf8");
  }
  return data.content;
}

export type GithubRepo = {
  full_name: string;
  name: string;
  private: boolean;
  fork: boolean;
  archived: boolean;
  is_template: boolean;
  size: number;
  description: string | null;
  default_branch: string | null;
  html_url: string;
  homepage: string | null;
  pushed_at: string | null;
  topics?: string[];
  owner: { login: string };
};

export function snapshotFromGithub(repo: GithubRepo): RepoSnapshot {
  return {
    private: repo.private,
    fork: repo.fork,
    archived: repo.archived,
    isTemplate: repo.is_template,
    sizeKb: repo.size,
    description: repo.description,
    defaultBranch: repo.default_branch,
    htmlUrl: repo.html_url,
    homepage: repo.homepage,
    pushedAt: repo.pushed_at,
  };
}

export async function fetchRepo(owner: string, repo: string): Promise<GithubRepo | null> {
  return githubJson<GithubRepo>(`/repos/${owner}/${repo}`);
}

export async function fetchRepoSnapshot(
  owner: string,
  repo: string,
): Promise<RepoSnapshot | null> {
  const data = await fetchRepo(owner, repo);
  return data ? snapshotFromGithub(data) : null;
}

export async function listOwnerPublicRepos(): Promise<GithubRepo[]> {
  const repos: GithubRepo[] = [];
  for (let page = 1; page <= 5; page += 1) {
    const batch = await githubJson<GithubRepo[]>(
      `/users/${GITHUB_OWNER}/repos?per_page=100&type=owner&sort=updated&page=${page}`,
    );
    if (!batch?.length) break;
    repos.push(...batch.filter((repo) => !repo.private));
    if (batch.length < 100) break;
  }
  return repos;
}

function truncate(text: string, max = 8000): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}\n…`;
}

export async function gatherRepoSignals(
  owner: string,
  repo: string,
): Promise<GatheredRepo | null> {
  const meta = await fetchRepo(owner, repo);
  if (!meta) return null;

  const [readmeRaw, languages, commits, packageRaw, pyproject] = await Promise.all([
    githubTextFile(`/repos/${owner}/${repo}/readme`).catch(() => null),
    githubJson<Record<string, number>>(`/repos/${owner}/${repo}/languages`).catch(
      () => ({} as Record<string, number>),
    ),
    githubJson<{ commit?: { message?: string } }[]>(
      `/repos/${owner}/${repo}/commits?per_page=1`,
    ).catch(() => []),
    githubTextFile(`/repos/${owner}/${repo}/contents/package.json`).catch(() => null),
    githubTextFile(`/repos/${owner}/${repo}/contents/pyproject.toml`).catch(() => null),
  ]);

  let packageJson: Record<string, unknown> | null = null;
  if (packageRaw) {
    try {
      packageJson = JSON.parse(packageRaw) as Record<string, unknown>;
    } catch {
      packageJson = null;
    }
  }

  return {
    fullName: meta.full_name,
    name: meta.name,
    description: meta.description,
    homepage: meta.homepage,
    topics: meta.topics ?? [],
    languages: languages ?? {},
    defaultBranch: meta.default_branch ?? "main",
    pushedAt: meta.pushed_at ?? new Date().toISOString(),
    readme: truncate(readmeRaw ?? ""),
    latestCommitMessage: commits?.[0]?.commit?.message ?? null,
    packageJson,
    pyproject,
    sizeKb: meta.size,
    fork: meta.fork,
    archived: meta.archived,
    isTemplate: meta.is_template,
    private: meta.private,
  };
}

export function demoUrlFromHomepage(homepage: string | null): string | undefined {
  if (!homepage) return undefined;
  try {
    const url = new URL(homepage);
    if (!["http:", "https:"].includes(url.protocol)) return undefined;
    if (url.hostname === "github.com") return undefined;
    return homepage;
  } catch {
    return undefined;
  }
}
