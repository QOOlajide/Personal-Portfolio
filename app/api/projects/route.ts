import { NextResponse } from "next/server";
import { getPublishedCatalog } from "@/lib/project-graph/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  const catalog = await getPublishedCatalog();
  return NextResponse.json(catalog, {
    headers: { "Cache-Control": "no-store" },
  });
}
