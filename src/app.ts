import { Hono } from "hono";
import { logger } from "hono/logger";
import listNames from "./names/listNames.js";
import addName from "./names/addName.js";
import { UniqueConstraintError } from "./errors.js";

const app = new Hono();

app.use(logger());
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/names", async (c) => {
  const names = await listNames();
  return c.json(names);
});

app.post("/names", async (c) => {
  const { name } = await c.req.json();
  const result = await addName({ name });
  return c.json(result, { status: 201 });
});

app.onError((err, c) => {
  if (err instanceof UniqueConstraintError) {
    return c.json({ error: err.message }, { status: 400 });
  }
  console.error(err);
  return c.json({ error: "Internal Server Error" }, { status: 500 });
});

export default app;
