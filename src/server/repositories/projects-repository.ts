import { and, asc, eq, ilike, ne } from "drizzle-orm";

import { db } from "@/server/db/client";
import { type NewProject, projects } from "@/server/db/schema";

export async function createProject(values: NewProject) {
  const [project] = await db.insert(projects).values(values).returning();

  return project;
}

export async function listProjects() {
  return db.select().from(projects).orderBy(asc(projects.createdAt));
}

export async function listActiveProjects(userId: string) {
  return db
    .select()
    .from(projects)
    .where(and(eq(projects.userId, userId), eq(projects.status, "active")))
    .orderBy(asc(projects.createdAt));
}

export async function getProjectById(id: string, userId: string) {
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, userId)))
    .limit(1);

  return project ?? null;
}

export async function getActiveProjectByName(name: string, userId: string) {
  const [project] = await db
    .select()
    .from(projects)
    .where(
      and(
        eq(projects.userId, userId),
        eq(projects.status, "active"),
        ilike(projects.name, name),
      ),
    )
    .limit(1);

  return project ?? null;
}

export async function getAnotherActiveProjectByName(
  id: string,
  name: string,
  userId: string,
) {
  const [project] = await db
    .select()
    .from(projects)
    .where(
      and(
        eq(projects.status, "active"),
        eq(projects.userId, userId),
        ilike(projects.name, name),
        ne(projects.id, id),
      ),
    )
    .limit(1);

  return project ?? null;
}

export async function updateProjectById(
  id: string,
  userId: string,
  values: Partial<Pick<NewProject, "name" | "description" | "color">>,
) {
  const [project] = await db
    .update(projects)
    .set({
      ...values,
      updatedAt: new Date(),
    })
    .where(and(eq(projects.id, id), eq(projects.userId, userId)))
    .returning();

  return project ?? null;
}

export async function archiveProjectById(id: string, userId: string) {
  const now = new Date();
  const [project] = await db
    .update(projects)
    .set({
      status: "archived",
      archivedAt: now,
      updatedAt: now,
    })
    .where(and(eq(projects.id, id), eq(projects.userId, userId)))
    .returning();

  return project ?? null;
}
