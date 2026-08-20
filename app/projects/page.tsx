import { ProjectsView } from "@/components/projects/projects-view";
import { getPublishedCatalog } from "@/lib/project-graph/catalog";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const catalog = await getPublishedCatalog();
  return <ProjectsView catalog={catalog} />;
}
