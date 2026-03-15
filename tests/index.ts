import { describe, afterEach, beforeEach } from "vitest";
import { db } from "../src/db/index.js";

export function describeWithTransaction(
  name: string,
  fn: () => void | Promise<void>,
) {
  describe(name, () => {
    beforeEach(async () => {
      await db.execute(`BEGIN`);
    });

    afterEach(async () => {
      await db.execute(`ROLLBACK`);
    });

    fn();
  });
}
