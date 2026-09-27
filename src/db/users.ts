import { db } from "./index.ts";
import { users } from "./schema.ts";

export async function getOrCreateUser(uid: string, email: string) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        email: email || "",
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email: email || "",
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error("Database user upsert failed:", error);
    throw new Error("Não foi possível sincronizar o perfil de usuário.", {
      cause: error,
    });
  }
}
