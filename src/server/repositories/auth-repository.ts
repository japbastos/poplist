import { and, eq, gt } from "drizzle-orm";

import { db } from "@/server/db/client";
import {
  authSessions,
  users,
  type NewAuthSession,
  type NewUser,
} from "@/server/db/schema";

export async function createUser(values: NewUser) {
  const [user] = await db.insert(users).values(values).returning();

  return user;
}

export async function createUserIfNotExists(values: NewUser) {
  const [user] = await db
    .insert(users)
    .values(values)
    .onConflictDoNothing({
      target: users.email,
    })
    .returning();

  return user ?? null;
}

export async function getUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user ?? null;
}

export async function createAuthSession(values: NewAuthSession) {
  const [session] = await db.insert(authSessions).values(values).returning();

  return session;
}

export async function getValidAuthSessionByTokenHash(tokenHash: string) {
  const [session] = await db
    .select({
      session: authSessions,
      user: users,
    })
    .from(authSessions)
    .innerJoin(users, eq(authSessions.userId, users.id))
    .where(
      and(
        eq(authSessions.tokenHash, tokenHash),
        gt(authSessions.expiresAt, new Date()),
      ),
    )
    .limit(1);

  return session ?? null;
}

export async function deleteAuthSessionByTokenHash(tokenHash: string) {
  await db.delete(authSessions).where(eq(authSessions.tokenHash, tokenHash));
}
