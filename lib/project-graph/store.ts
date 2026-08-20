import { SEED_BY_REPO, SEED_BY_SLUG } from "@/data/projects";
import { getRedis } from "@/lib/redis";
import { ACTIVITY_TTL_MS } from "./types";
import type { AutoProject } from "./types";
import { normalizeRepoKey } from "./slug";

const AUTO_INDEX = "deen:cards:index";
const REPO_INDEX = "deen:cards:by-repo";

function autoCardKey(slug: string) {
  return `deen:card:${slug}`;
}

function pushKey(slug: string) {
  return `deen:push:${slug}`;
}

function activityKey(slug: string) {
  return `deen:activity:${slug}`;
}

export async function getAutoCard(slug: string): Promise<AutoProject | null> {
  const redis = getRedis();
  if (!redis) return null;
  const card = await redis.get<AutoProject>(autoCardKey(slug));
  return card ?? null;
}

export async function listAutoCards(): Promise<AutoProject[]> {
  const redis = getRedis();
  if (!redis) return [];

  const slugs = await redis.smembers<string[]>(AUTO_INDEX);
  if (!slugs?.length) return [];

  const cards = await Promise.all(slugs.map((slug) => getAutoCard(slug)));
  return cards.filter((card): card is AutoProject => Boolean(card));
}

export async function findCardByRepo(
  owner: string,
  repo: string,
): Promise<{ kind: "seed" | "graph"; slug: string } | null> {
  const key = normalizeRepoKey(owner, repo);
  const seed = SEED_BY_REPO.get(key);
  if (seed) return { kind: "seed", slug: seed.slug };

  const redis = getRedis();
  if (!redis) return null;
  const slug = await redis.hget<string>(REPO_INDEX, key);
  if (!slug) return null;
  return { kind: "graph", slug };
}

export async function saveAutoCard(card: AutoProject): Promise<void> {
  // 1. Same Upstash REST client the page uses. Null = env vars missing in THIS runtime
  //    (Vercel Production vs Preview vs local). /projects can still show seed cards.
  const redis = getRedis();
  if (!redis) {
    throw new Error("Redis is not configured");
  }

  // 2. The card body: title, copy, Unsplash imageUrl, section, photographer, …
  await redis.set(autoCardKey(card.slug), card);
  // 3. Membership set so listAutoCards() can find every auto slug.
  await redis.sadd(AUTO_INDEX, card.slug);
  // 4. Lookup so the next push to QOOlajide/voice-agent is status-only, not a rewrite.
  await redis.hset(REPO_INDEX, {
    [card.githubRepo.toLowerCase()]: card.slug,
  });
}

export async function setLastPushedAt(slug: string, at: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  await redis.set(pushKey(slug), at);
}

export async function getLastPushedAt(slug: string): Promise<string | null> {
  const redis = getRedis();
  if (!redis) return null;
  return (await redis.get<string>(pushKey(slug))) ?? null;
}

export type ActivityRecord = {
  branch: string;
  at: string;
  repo: string;
};

export async function setActivity(
  slug: string,
  record: ActivityRecord,
): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    throw new Error("Redis is not configured");
  }
  await redis.set(activityKey(slug), record, {
    px: ACTIVITY_TTL_MS,
  });
}

export async function getActivity(slug: string): Promise<ActivityRecord | null> {
  const redis = getRedis();
  if (!redis) return null;
  const record = await redis.get<ActivityRecord>(activityKey(slug));
  if (!record) return null;
  const age = Date.now() - new Date(record.at).getTime();
  if (Number.isNaN(age) || age > ACTIVITY_TTL_MS) return null;
  return record;
}

export function resolveSlugForRepo(owner: string, repo: string): string | null {
  const seed = SEED_BY_REPO.get(normalizeRepoKey(owner, repo));
  return seed?.slug ?? null;
}

export function isSeedSlug(slug: string): boolean {
  return SEED_BY_SLUG.has(slug);
}
