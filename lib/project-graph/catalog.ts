import { SEED_PROJECTS } from "@/data/projects";
import { GITHUB_OWNER } from "./types";
import type {
  LiveOverlay,
  ProjectCatalog,
  PublishedProject,
  StoredCard,
} from "./types";
import { getActivity, getLastPushedAt, listAutoCards } from "./store";
import { slugifyRepoName } from "./slug";

export async function overlayFor(card: StoredCard): Promise<LiveOverlay> {
  const [lastPushedAt, activity] = await Promise.all([
    getLastPushedAt(card.slug),
    getActivity(card.slug),
  ]);

  return {
    lastPushedAt: lastPushedAt ?? undefined,
    buildingNow: activity
      ? { branch: activity.branch, since: activity.at }
      : null,
    displayStatus: activity ? "building-now" : card.status,
  };
}

export async function toPublished(card: StoredCard): Promise<PublishedProject> {
  const live = await overlayFor(card);
  return {
    slug: card.slug,
    title: card.title,
    status: card.status,
    description: card.description,
    techStack: card.techStack,
    githubUrl: card.githubUrl,
    githubRepo: card.githubRepo,
    demoUrl: card.demoUrl,
    imageUrl: card.imageUrl,
    section: card.section,
    source: card.source,
    photographer: card.source === "graph" ? card.photographer : undefined,
    live,
  };
}

export async function getPublishedCatalog(): Promise<ProjectCatalog> {
  const autoCards = await listAutoCards().catch((error) => {
    console.error("[project-graph] redis catalog read failed", error);
    return [];
  });

  const seedSlugs = new Set(SEED_PROJECTS.map((card) => card.slug));
  const uniqueAuto = autoCards.filter((card) => !seedSlugs.has(card.slug));
  uniqueAuto.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const published = await Promise.all([
    ...SEED_PROJECTS.map(toPublished),
    ...uniqueAuto.map(toPublished),
  ]);

  return {
    ai: published.filter((card) => card.section === "ai"),
    ml: published.filter((card) => card.section === "ml"),
    systems: published.filter((card) => card.section === "systems"),
  };
}

export function slugForActivityRepo(repo: string): string {
  const fromSeed = SEED_PROJECTS.find(
    (card) =>
      card.githubRepo.toLowerCase() === `${GITHUB_OWNER}/${repo}`.toLowerCase() ||
      card.slug === slugifyRepoName(repo),
  );
  return fromSeed?.slug ?? slugifyRepoName(repo);
}
