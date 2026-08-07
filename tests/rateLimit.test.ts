import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { createRateLimiter } from "../src/middleware/rateLimit.js";

describe("Rate limiting", () => {
  it("returns 429 after the configured request limit", async () => {
    const testApp = express();

    testApp.use(
      createRateLimiter(2, {
        message: "Límite de prueba alcanzado",
      })
    );

    testApp.get("/limited", (_req, res) => {
      res.json({ ok: true });
    });

    const firstResponse = await request(testApp).get("/limited");
    const secondResponse = await request(testApp).get("/limited");
    const limitedResponse = await request(testApp).get("/limited");

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(200);
    expect(limitedResponse.status).toBe(429);
    expect(limitedResponse.body).toEqual({
      message: "Límite de prueba alcanzado",
    });
    expect(limitedResponse.headers["ratelimit"]).toBeDefined();
  });
});
