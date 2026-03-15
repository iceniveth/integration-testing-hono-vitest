import { db } from "../db/index.js";
import { namesTable } from "../db/schema.js";

export default async function listNames() {
  const names = await db.select().from(namesTable);
  return names;
}
