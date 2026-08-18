import { completeJson } from "../llm";
import type { GraphState, PhotographerCredit } from "../types";

const JARGON =
  /\b(fastapi|typescript|javascript|python|react|next\.?js|node\.?js|api|mcp|llm|github|docker|redis|postgres|sql|html|css|wasm|rust|json|http|graphql|openai|gemini)\b/i;

const SECTION_FALLBACK: Record<string, string[]> = {
  ai: ["hands writing in a notebook at night", "people collaborating around a table"],
  ml: ["library study table natural light", "pencils and paper on a wooden desk"],
  systems: ["workshop tools on a wooden bench", "calendar planning notebook"],
};

const SYSTEM = `Propose 1–2 Unsplash search queries for a real photograph.

The photo will sit on a production portfolio card. It must look like something a photographer captured — a scene, object, or gathering.
Never use tech jargon, product names, framework names, "code", "laptop with code", "neural network", "AI brain", or illustrations.

Good: "community gathering night", "calendar planning notebook", "desert trail sunrise".
Bad: "FastAPI", "MCP server", "machine learning".

Return JSON only: { "queries": string[] }`;

/**
 * Node 5 — sourceUnsplashPhoto
 * LLM proposes concrete scene queries. Unsplash first, Pexels if rate-limited.
 * Hotlink the CDN URL and store photographer credit. Never touches seed images.
 */
export async function sourceUnsplashPhoto(state: GraphState): Promise<GraphState> {
  if (!state.gathered || !state.copy || !state.section) {
    return { ...state, skipReason: "empty", outcome: "skipped" };
  }

  const json = await completeJson({
    system: SYSTEM,
    user: [
      `title: ${state.copy.title}`,
      `description: ${state.copy.description}`,
      `repo: ${state.gathered.name}`,
      `github description: ${state.gathered.description ?? ""}`,
    ].join("\n"),
    temperature: 0.5,
  });

  const proposed = Array.isArray(json.queries)
    ? json.queries.filter((item): item is string => typeof item === "string")
    : [];
  const queries = sanitizeQueries(proposed, state.section);

  const photo =
    (await searchUnsplash(queries)) ?? (await searchPexels(queries));

  if (!photo) {
    return { ...state, skipReason: "generate-failed", outcome: "skipped" };
  }

  return { ...state, photo };
}

function sanitizeQueries(proposed: string[], section: string): string[] {
  const cleaned = proposed
    .map((query) => query.trim())
    .filter((query) => query.length > 3 && !JARGON.test(query))
    .slice(0, 2);
  if (cleaned.length > 0) return cleaned;
  return SECTION_FALLBACK[section] ?? SECTION_FALLBACK.systems;
}

async function searchUnsplash(
  queries: string[],
): Promise<{ imageUrl: string; photographer: PhotographerCredit } | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;

  for (const query of queries) {
    const url = new URL("https://api.unsplash.com/search/photos");
    url.searchParams.set("query", query);
    url.searchParams.set("orientation", "landscape");
    url.searchParams.set("per_page", "8");
    url.searchParams.set("content_filter", "high");

    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${key}`,
        "Accept-Version": "v1",
      },
      cache: "no-store",
    });

    if (response.status === 403 || response.status === 429) {
      console.warn("[project-graph] Unsplash rate limited, falling back to Pexels");
      return null;
    }
    if (!response.ok) continue;

    const data = (await response.json()) as {
      results?: {
        id: string;
        urls?: { regular?: string; raw?: string };
        user?: { name?: string; links?: { html?: string } };
        links?: { download_location?: string };
        width?: number;
        height?: number;
      }[];
    };

    const photo = (data.results ?? []).find((item) => item.urls?.regular);
    if (!photo?.urls?.regular) continue;

    if (photo.links?.download_location) {
      await fetch(photo.links.download_location, {
        headers: { Authorization: `Client-ID ${key}` },
        cache: "no-store",
      }).catch(() => undefined);
    }

    return {
      imageUrl: photo.urls.regular,
      photographer: {
        name: photo.user?.name || "Unsplash photographer",
        url: photo.user?.links?.html || "https://unsplash.com",
        source: "unsplash",
      },
    };
  }

  return null;
}

async function searchPexels(
  queries: string[],
): Promise<{ imageUrl: string; photographer: PhotographerCredit } | null> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return null;

  for (const query of queries) {
    const url = new URL("https://api.pexels.com/v1/search");
    url.searchParams.set("query", query);
    url.searchParams.set("orientation", "landscape");
    url.searchParams.set("per_page", "8");

    const response = await fetch(url, {
      headers: { Authorization: key },
      cache: "no-store",
    });
    if (!response.ok) continue;

    const data = (await response.json()) as {
      photos?: {
        src?: { landscape?: string; large?: string };
        photographer?: string;
        photographer_url?: string;
      }[];
    };

    const photo = (data.photos ?? []).find(
      (item) => item.src?.landscape || item.src?.large,
    );
    if (!photo) continue;

    return {
      imageUrl: photo.src?.landscape || photo.src?.large || "",
      photographer: {
        name: photo.photographer || "Pexels photographer",
        url: photo.photographer_url || "https://www.pexels.com",
        source: "pexels",
      },
    };
  }

  return null;
}
