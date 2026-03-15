import { DrizzleQueryError } from "drizzle-orm";
import { db } from "../db/index.js";
import { namesTable } from "../db/schema.js";
import { UniqueConstraintError } from "../errors.js";

export default async function addName({ name }: { name: string }) {
  try {
    const [newName] = await db
      .insert(namesTable)
      .values({ name })
      .returning()
      .execute();

    return newName;
  } catch (error) {
    if (error instanceof DrizzleQueryError) {
      if (
        error.cause?.message.includes(
          "duplicate key value violates unique constraint",
        )
      ) {
        throw new UniqueConstraintError(`Name "${name}" already exists`);
      }
    }
    throw error;
  }
}
