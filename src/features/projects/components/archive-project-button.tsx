"use client";

import { Archive } from "lucide-react";

import { archiveProjectAction } from "@/features/projects/actions/project-actions";
import { Button } from "@/components/ui/button";

type ArchiveProjectButtonProps = {
  projectId: string;
  projectName: string;
};

export function ArchiveProjectButton({
  projectId,
  projectName,
}: ArchiveProjectButtonProps) {
  return (
    <form
      action={archiveProjectAction}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Arquivar o projeto "${projectName}"? Ele deixará de aparecer na lista padrão.`,
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={projectId} />
      <Button type="submit" variant="outline" size="sm">
        <Archive className="size-4" aria-hidden="true" />
        Arquivar
      </Button>
    </form>
  );
}
