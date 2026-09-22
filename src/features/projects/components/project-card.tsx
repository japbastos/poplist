import { Pencil } from "lucide-react";

import { ArchiveProjectButton } from "@/features/projects/components/archive-project-button";
import { ProjectForm } from "@/features/projects/components/project-form";
import type { Project } from "@/server/db/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormSheet } from "@/components/shared/form-sheet";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="size-3 rounded-full"
                style={{ backgroundColor: project.color ?? "#974aaa" }}
                aria-hidden="true"
              />
              <CardTitle className="truncate">{project.name}</CardTitle>
            </div>
            <CardDescription className="mt-2 line-clamp-2">
              {project.description ?? "Sem descrição."}
            </CardDescription>
          </div>
          <Badge variant="secondary">Ativo</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <FormSheet
            title="Editar projeto"
            trigger={
              <Button type="button" variant="outline" size="sm">
                <Pencil className="size-4" aria-hidden="true" />
                Editar
              </Button>
            }
          >
            <ProjectForm project={project} />
          </FormSheet>
          <ArchiveProjectButton projectId={project.id} projectName={project.name} />
        </div>
      </CardContent>
    </Card>
  );
}
