import type { SeedProject } from "@/lib/project-graph/types";

/**
 * Curated V1 cards. The graph never rewrites copy, section, chips, or photos.
 * Live overlay (lastPushedAt / building now) is the only mutation.
 */
export const SEED_PROJECTS: SeedProject[] = [
  {
    slug: "headstarter-mcp-project",
    title: "MCP Schedule Meeting Server",
    status: "active-development",
    description:
      "A Model Context Protocol (MCP) server that integrates Google Calendar, Notion, and Slack to enable cross-tool orchestration. Reduces context switching and saves users 1–2 hours weekly.",
    techStack: ["Python", "FastAPI"],
    githubUrl: "https://github.com/QOOlajide/headstarter-mcp-project",
    githubRepo: "QOOlajide/headstarter-mcp-project",
    demoUrl: undefined,
    imageUrl: "/images/projects/headstarter-mcp-project.jpg",
    section: "ai",
    source: "seed",
    locked: true,
  },
  {
    slug: "agent-workflow",
    title: "Agent Workflow Builder",
    status: "shipped",
    description:
      "A visual tool for designing and deploying agentic workflows. Enables users to orchestrate multi-step AI agent pipelines without writing complex code.",
    techStack: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
    githubUrl: "https://github.com/QOOlajide/Agent-Workflow",
    githubRepo: "QOOlajide/Agent-Workflow",
    demoUrl: "https://agent-workflow-omega.vercel.app/",
    imageUrl: "/images/projects/agent-workflow.jpg",
    section: "ai",
    source: "seed",
    locked: true,
  },
  {
    slug: "terminal-coding-agent",
    title: "Terminal Coding Agent",
    status: "completed",
    description:
      "A terminal-based AI coding assistant that helps developers write, debug, and refactor code directly from the command line. Designed for efficiency and minimal context switching.",
    techStack: ["Bash", "TypeScript", "Gemini API"],
    githubUrl: "https://github.com/QOOlajide/Terminal-Coding-Agent",
    githubRepo: "QOOlajide/Terminal-Coding-Agent",
    demoUrl: undefined,
    imageUrl: "/images/projects/terminal-coding-agent.jpg",
    section: "ai",
    source: "seed",
    locked: true,
  },
  {
    slug: "headstarter-aven-customer-support",
    title: "AI Customer Support Voice Agent",
    status: "completed",
    description:
      "An AI-powered customer support system built for Aven, featuring real-time chat and voice Q&A capabilities. Reduced customer support workload by 25%+ through intelligent query handling.",
    techStack: ["Next.js", "TypeScript", "Pinecone", "Vercel"],
    githubUrl: "https://github.com/QOOlajide/headstarter-AvenCustomerSupport",
    githubRepo: "QOOlajide/headstarter-AvenCustomerSupport",
    demoUrl: undefined,
    imageUrl: "/images/projects/headstarter-aven-customer-support.jpg",
    section: "ai",
    source: "seed",
    locked: true,
  },
  {
    slug: "eid-al-fitr-2026",
    title: "Eid Community Platform",
    status: "active-development",
    description:
      "A full-stack community platform built for the Muslim community, featuring event coordination, community engagement tools, and an AI-powered Islamic Q&A feature using RAG to provide trusted, cited answers.",
    techStack: [
      "React",
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "Redis",
      "Docker",
    ],
    githubUrl: "https://github.com/QOOlajide/Eid-Al-Fitr-2026",
    githubRepo: "QOOlajide/Eid-Al-Fitr-2026",
    demoUrl: "https://eid-al-fitr-2026-alpha.vercel.app/",
    imageUrl: "/images/projects/eid-al-fitr-2026.jpg",
    section: "ai",
    source: "seed",
    locked: true,
  },
  {
    slug: "personalized-x-recommendation",
    title: "Personalized X Recommendation Algorithm",
    status: "shipped",
    description:
      "A personalized reimplementation of the X recommendation algorithm exposing the full ranking pipeline as a tunable, inspectable engine. Built a resilient ML-adjacent LLM pipeline for ~2,000 sequential Gemini API calls using exponential-backoff retries, 1.5s rate-limit delays, and O(1) duplicate detection — delivering zero data corruption across 500 persona generations and 4 content types.",
    techStack: ["TypeScript", "Next.js", "Gemini API", "Machine Learning"],
    githubUrl: "https://github.com/QOOlajide/Personalized-X-Recommendation",
    githubRepo: "QOOlajide/Personalized-X-Recommendation",
    demoUrl: "https://personalized-x-recommendation.vercel.app/",
    imageUrl: "/images/projects/personalized-x-recommendation.jpg",
    section: "ml",
    source: "seed",
    locked: true,
  },
  {
    slug: "autonomous-ml-agent",
    title: "Autonomous ML Agent",
    status: "shipped",
    description:
      "An autonomous machine learning agent that ingests tabular datasets, automatically cleans and preprocesses data, trains models, and optimizes them for target metrics like accuracy, precision, or recall. The entire pipeline is orchestrated by LLMs that generate and modify code, select algorithms, and iteratively refine the pipeline until the best-performing model is achieved.",
    techStack: ["Python", "LLMs", "Scikit-learn", "Pandas"],
    githubUrl: "https://github.com/QOOlajide/Autonomous-ML-Agent",
    githubRepo: "QOOlajide/Autonomous-ML-Agent",
    demoUrl: "https://autonomous-ml-agent-vg4sonjdug3fgmhxeyzfzu.streamlit.app/",
    imageUrl: "/images/projects/autonomous-ml-agent.jpg",
    section: "ml",
    source: "seed",
    locked: true,
  },
];

export const SEED_BY_SLUG = new Map(
  SEED_PROJECTS.map((project) => [project.slug, project]),
);

export const SEED_BY_REPO = new Map(
  SEED_PROJECTS.map((project) => [project.githubRepo.toLowerCase(), project]),
);
