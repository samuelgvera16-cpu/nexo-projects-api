import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../src/app.js";

describe("OpenAPI documentation", () => {
  it("exposes the OpenAPI document", async () => {
    const response = await request(app).get("/openapi.json");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      openapi: "3.1.0",
      info: {
        title: "Nexo Projects API",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          sessionCookie: {
            type: "apiKey",
            in: "cookie",
            name: "nexo_session",
          },
        },
      },
    });

    expect(Object.keys(response.body.paths)).toEqual(
      expect.arrayContaining([
        "/",
        "/openapi.json",
        "/auth/register",
        "/auth/login",
        "/auth/me",
        "/auth/logout",
        "/projects",
        "/projects/{id}",
        "/projects/{id}/members",
        "/projects/{id}/members/{userId}",
        "/tasks",
        "/tasks/{id}",
      ])
    );
  });

  it("serves the Swagger UI", async () => {
    const response = await request(app).get("/docs/");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("text/html");
    expect(response.text).toContain("Nexo Projects API Docs");
  });
});
