"use client";

import { Save } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

import {
  createProjectAction,
  updateProjectAction,
} from "@/features/projects/actions/project-actions";
import {
  initialProjectActionState,
  type ProjectActionState,
} from "@/features/projects/actions/project-action-state";
import type { Project } from "@/server/db/schema";
import { Button } from "@/components/ui/button";

type ProjectFormProps = {
  project?: Project;
};

const projectColors = ["#974aaa", "#1447e6", "#009588", "#f99c00", "#e40014"];

export function ProjectForm({ project }: ProjectFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const action = project ? updateProjectAction : createProjectAction;
  const [state, formAction, pending] = useActionState<
    ProjectActionState,
    FormData
  >(action, initialProjectActionState);

  useEffect(() => {
    if (!state.message) {
      return;
    }

    if (state.status === "success") {
      toast.success(state.message);

      if (!project) {
        formRef.current?.reset();
      }
    }

    if (state.status === "error") {
      toast.error(state.message);
    }
  }, [project, state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}

      <div className="space-y-2">
        <label htmlFor="project-name" className="text-sm font-medium">
          Nome
        </label>
        <input
          id="project-name"
          name="name"
          type="text"
          required
          maxLength={80}
          defaultValue={project?.name ?? ""}
          className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
        />
        {state.fieldErrors?.name?.[0] ? (
          <p className="text-sm text-destructive">{state.fieldErrors.name[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="project-description" className="text-sm font-medium">
          Descrição
        </label>
        <textarea
          id="project-description"
          name="description"
          rows={3}
          defaultValue={project?.description ?? ""}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
        />
        {state.fieldErrors?.description?.[0] ? (
          <p className="text-sm text-destructive">
            {state.fieldErrors.description[0]}
          </p>
        ) : null}
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Cor</legend>
        <div className="flex flex-wrap gap-2">
          {projectColors.map((color) => (
            <label
              key={color}
              className="relative flex size-9 cursor-pointer items-center justify-center rounded-md border"
            >
              <input
                type="radio"
                name="color"
                value={color}
                defaultChecked={(project?.color ?? "#974aaa") === color}
                className="peer sr-only"
              />
              <span
                className="size-5 rounded-full peer-focus-visible:ring-2 peer-focus-visible:ring-ring"
                style={{ backgroundColor: color }}
              />
              <span className="absolute inset-0 rounded-md ring-0 ring-brand-secondary peer-checked:ring-2" />
              <span className="sr-only">{color}</span>
            </label>
          ))}
        </div>
        {state.fieldErrors?.color?.[0] ? (
          <p className="text-sm text-destructive">{state.fieldErrors.color[0]}</p>
        ) : null}
      </fieldset>

      <Button type="submit" disabled={pending}>
        <Save className="size-4" aria-hidden="true" />
        {pending ? "Salvando..." : "Salvar projeto"}
      </Button>
    </form>
  );
}
