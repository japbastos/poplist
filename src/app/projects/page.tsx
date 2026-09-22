import { ServerAppShell } from "@/components/layout/server-app-shell";
import { PageHeader } from "@/components/shared/page-header";
import {
  CreateProjectSheet,
  ProjectsList,
} from "@/features/projects/components/projects-list";
import { listProjects } from "@/server/services/projects-service";

export default async function ProjectsPage() {
  const projects = await listProjects();

  return (
    <ServerAppShell>
      <div className="space-y-6">
        <PageHeader
          title="Projetos"
          description="Área reservada para organizar iniciativas, cores, status e tarefas relacionadas."
          actions={<CreateProjectSheet />}
        />
        <ProjectsList projects={projects} />
      </div>
    </ServerAppShell>
  );
}
