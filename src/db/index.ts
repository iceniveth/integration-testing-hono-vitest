import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const _db = drizzle({
  client: pool,
  casing: "snake_case",
  logger: false,
});

function begin() {
  return _db.execute("begin");
}

function rollback() {
  return _db.execute("rollback");
}

export async function isInTransaction() {
  const result = await _db.execute<{ in_transaction: boolean }>(
    "SELECT transaction_timestamp() != statement_timestamp() AS in_transaction",
  );
  return result.rows[0].in_transaction;
}

async function commit() {
  try {
    await _db.execute("commit");
  } catch (error) {
    await rollback();
    throw error;
  }
  return;
}

async function currentConnectionId() {
  const result = await db.execute<{ pid: number }>(
    "SELECT pg_backend_pid() AS pid",
  );
  return result.rows[0].pid;
}

let _savepointSeq = 0;

/**
 * Executes a database operation within a transaction context.
 *
 * If already in a transaction, creates a savepoint for nested transaction support.
 * If not in a transaction, begins a new one and commits on success or rolls back on error.
 *
 * @template T - The type of value returned by the transaction function.
 * @param fn - An async function that receives the database instance and performs operations within the transaction.
 * @returns A promise that resolves with the result of the transaction function.
 * @throws Re-throws any error that occurs during the transaction, after appropriate rollback/savepoint cleanup.
 *
 * @example
 * ```typescript
 * const result = await transaction(async (tx) => {
 *   await tx.execute('INSERT INTO users VALUES (...)');
 *   return { success: true };
 * });
 * ```
 */
async function transaction<T>(fn: (db: typeof _db) => Promise<T>): Promise<T> {
  if (await isInTransaction()) {
    const sp = `sp${++_savepointSeq}`;
    await _db.execute(`SAVEPOINT ${sp}`);
    try {
      const result = await fn(_db);
      await _db.execute(`RELEASE SAVEPOINT ${sp}`);
      return result;
    } catch (error) {
      if (await isInTransaction()) {
        await _db.execute(`ROLLBACK TO SAVEPOINT ${sp}`);
      } else {
        await rollback();
      }
      throw error;
    }
  } else {
    await begin();
    try {
      const result = await fn(_db);
      await commit();
      return result;
    } catch (error) {
      await rollback();
      throw error;
    }
  }
}

const db = Object.assign(_db, {
  begin,
  commit,
  currentConnectionId,
  rollback,
  transaction,
});

export { db, pool };
