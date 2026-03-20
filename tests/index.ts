import { describe, afterEach, beforeEach } from "vitest";
import { db } from "../src/db/index.js";

export function describeWithTransaction(
  name: string,
  fn: () => void | Promise<void>,
) {
  describe(name, async () => {
    beforeEach(async () => {
      await db.begin();
    });

    afterEach(async () => {
      await db.rollback();
    });

    fn();
  });
}
