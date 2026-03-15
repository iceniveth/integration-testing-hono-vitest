import { drizzle } from "drizzle-orm/node-postgres";

console.log("database url", process.env.DATABASE_URL);

const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL,
  },
  casing: "snake_case",
});

export { db };
