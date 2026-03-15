import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const namesTable = pgTable("names", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull().unique(),
});
