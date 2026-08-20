export const GITHUB_OWNER = "QOOlajide";
export const PORTFOLIO_REPO = "Personal-Portfolio";
export const ACTIVITY_TTL_MS = 20 * 60 * 1000;

export type ProjectSection = "ai" | "ml" | "systems";
export type ProjectStatus = "completed" | "active-development" | "shipped";
export type GraphTrigger = "webhook" | "backfill";
export type GraphOutcome = "created" | "status-only" | "skipped";
export type PhotoSource = "unsplash" | "pexels";

export type PhotographerCredit = {
  name: string;
  url: string;
  source: PhotoSource;
};

export type SeedProject = {
  slug: string;
  title: string;
  status: ProjectStatus;
  description: string;
  techStack: string[];
  githubUrl: string;
  githubRepo: string;
  demoUrl?: string;
  imageUrl: string;
  section: ProjectSection;
  source: "seed";
  locked: true;
};

export type AutoProject = {
  slug: string;
  title: string;
  status: ProjectStatus;
  description: string;
  techStack: string[];
  githubUrl: string;
  githubRepo: string;
  demoUrl?: string;
  imageUrl: string;
  section: ProjectSection;
  source: "graph";
  locked: false;
  photographer: PhotographerCredit;
  createdAt: string;
  lastGeneratedAt: string;
};

export type StoredCard = SeedProject | AutoProject;

export type LiveOverlay = {
  lastPushedAt?: string;
  buildingNow: { branch: string; since: string } | null;
  displayStatus: ProjectStatus | "building-now";
};

export type PublishedProject = {
  slug: string;
  title: string;
  status: ProjectStatus;
  description: string;
  techStack: string[];
  githubUrl?: string;
  githubRepo: string;
  demoUrl?: string;
  imageUrl: string;
  section: ProjectSection;
  source: "seed" | "graph";
  photographer?: PhotographerCredit;
  live: LiveOverlay;
};

export type ProjectCatalog = {
  ai: PublishedProject[];
  ml: PublishedProject[];
  systems: PublishedProject[];
};

export type RepoSnapshot = {
  private: boolean;
  fork: boolean;
  archived: boolean;
  isTemplate: boolean;
  sizeKb: number;
  description: string | null;
  defaultBranch: string | null;
  htmlUrl: string;
  homepage: string | null;
  pushedAt: string | null;
};

export type GatheredRepo = {
  fullName: string;
  name: string;
  description: string | null;
  homepage: string | null;
  topics: string[];
  languages: Record<string, number>;
  defaultBranch: string;
  pushedAt: string;
  readme: string;
  latestCommitMessage: string | null;
  packageJson: Record<string, unknown> | null;
  pyproject: string | null;
  sizeKb: number;
  fork: boolean;
  archived: boolean;
  isTemplate: boolean;
  private: boolean;
};

export type GraphState = {
  trigger: GraphTrigger;
  owner: string;
  repo: string;
  pushedAt?: string;
  snapshot?: RepoSnapshot;
  skipReason?: string;
  outcome?: GraphOutcome;
  existing?: { kind: "seed" | "graph"; slug: string };
  gathered?: GatheredRepo;
  section?: ProjectSection;
  copy?: {
    title: string;
    description: string;
    techStack: string[];
    status: ProjectStatus;
    demoUrl?: string;
  };
  photo?: {
    imageUrl: string;
    photographer: PhotographerCredit;
  };
  card?: AutoProject;
};

export type IngestInput = {
  trigger: GraphTrigger;
  owner: string;
  repo: string;
  pushedAt?: string;
  snapshot?: RepoSnapshot;
};
