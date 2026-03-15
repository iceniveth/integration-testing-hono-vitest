import { expect, test } from "vitest";
import app from "../src/app.js";
import { describeWithTransaction } from "./index.js";

describeWithTransaction("Names", async () => {
  test("POST /", async () => {
    const res = await app.request("/names", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "john" }),
    });
    expect(res.status).toBe(201);
    expect(await res.json()).toMatchObject({ name: "john" });

    const res2 = await app.request("/names");
    expect(res2.status).toBe(200);
    expect(await res2.json()).toMatchObject([{ name: "john" }]);
  });

  test("POST / responds bad request if a name already exists", async () => {
    const res = await app.request("/names", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "john" }),
    });
    expect(res.status).toBe(201);

    const res2 = await app.request("/names", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "john" }),
    });
    expect(res2.status).toBe(400);
    expect(await res2.json()).toMatchObject({
      error: 'Name "john" already exists',
    });
  });

  test("GET /", async () => {
    const res = await app.request("/names");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });
});
