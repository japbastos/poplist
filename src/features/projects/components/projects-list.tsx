import { FolderKanban, Plus } from "lucide-react";

import { ProjectCard } from "@/features/projects/components/project-card";
import { ProjectForm } from "@/features/projects/components/project-form";
import type { Project } from "@/server/db/schema";
import { EmptyState } from "@/components/shared/empty-state";
import { FormSheet } from "@/components/shared/form-sheet";
import { Button } from "@/components/ui/button";

type ProjectsListProps = {
  projects: Project[];
};

export function ProjectsList({ projects }: ProjectsListProps) {
  if (projects.length === 0) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="Nenhum projeto ativo"
        description="Crie o primeiro projeto para organizar tarefas e acompanhar tempo por iniciativa."
        action={<CreateProjectSheet />}
      />
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

export function CreateProjectSheet() {
  return (
    <FormSheet
      title="Novo projeto"
      trigger={
        <Button type="button">
          <Plus className="size-4" aria-hidden="true" />
          Novo projeto
        </Button>
      }
    >
      <ProjectForm />
    </FormSheet>
  );
}
