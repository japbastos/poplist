import { loginSchema, type LoginInput } from "@/features/auth/schemas/auth-schemas";
import {
  createUserIfNotExists,
  getUserByEmail,
} from "@/server/repositories/auth-repository";
import { hashPassword, verifyPassword } from "@/server/auth/password";

export async function ensureLocalUser() {
  const email = "local@poplist.dev";
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return existingUser;
  }

  const createdUser = await createUserIfNotExists({
    name: "Usuário local",
    email,
    passwordHash: await hashPassword("poplist-local"),
  });

  return createdUser ?? getUserByEmail(email);
}

export async function authenticateUser(input: LoginInput) {
  const parsed = loginSchema.parse(input);
  const user = await getUserByEmail(parsed.email);

  if (!user) {
    throw new Error("Credenciais inválidas.");
  }

  const validPassword = await verifyPassword(parsed.password, user.passwordHash);

  if (!validPassword) {
    throw new Error("Credenciais inválidas.");
  }

  return user;
}
