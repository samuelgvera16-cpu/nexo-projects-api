import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../src/app.js";

describe("Application routes", () => {
  it("rejects JSON bodies larger than 100 KB", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        payload: "a".repeat(101 * 1024),
      });

    expect(response.status).toBe(413);
    expect(response.body).toEqual({
      message: "Solicitud demasiado grande",
    });
  });
  it("adds security headers to API responses", async () => {
    const response = await request(app).get("/");

    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["x-frame-options"]).toBe("SAMEORIGIN");
    expect(response.headers["x-powered-by"]).toBeUndefined();
  });
  it("requires authentication to remove a project member", async () => {
    const response = await request(app).delete(
      "/projects/20000000-0000-4000-8000-000000000001/members/30000000-0000-4000-8000-000000000001"
    );

    expect(response.status).toBe(401);
  });
  it("requires authentication to change a project member role", async () => {
    const response = await request(app)
      .patch(
        "/projects/20000000-0000-4000-8000-000000000001/members/30000000-0000-4000-8000-000000000001"
      )
      .send({
        role: "admin",
      });

    expect(response.status).toBe(401);
  });
  it("requires authentication to add a project member", async () => {
    const response = await request(app)
      .post("/projects/20000000-0000-4000-8000-000000000001/members")
      .send({
        email: "member@example.com",
      });

    expect(response.status).toBe(401);
  });
  it("requires authentication to list project members", async () => {
    const response = await request(app).get(
      "/projects/20000000-0000-4000-8000-000000000001/members"
    );

    expect(response.status).toBe(401);
  });
  it("requires authentication to delete a project", async () => {
    const response = await request(app).delete(
      "/projects/20000000-0000-4000-8000-000000000001"
    );

    expect(response.status).toBe(401);
  });
  it("requires authentication to update a project", async () => {
    const response = await request(app)
      .put("/projects/20000000-0000-4000-8000-000000000001")
      .send({
        name: "Unauthorized update",
      });

    expect(response.status).toBe(401);
  });
  it("requires authentication to list projects", async () => {
    const response = await request(app).get("/projects");

    expect(response.status).toBe(401);
  });
  it("requires authentication to get a project", async () => {
    const response = await request(app).get(
      "/projects/20000000-0000-4000-8000-000000000001"
    );

    expect(response.status).toBe(401);
  });
  it("requires authentication to create a project", async () => {
    const response = await request(app).post("/projects").send({
      name: "Private project",
    });

    expect(response.status).toBe(401);
  });
  it("requires authentication to access task routes", async () => {
    const response = await request(app).get("/tasks");

    expect(response.status).toBe(401);
  });
  it("clears the session cookie when logging out", async () => {
    const response = await request(app).post("/auth/logout");

    expect(response.status).toBe(204);
    expect(response.headers["set-cookie"]?.[0]).toContain("nexo_session=;");
    expect(response.headers["set-cookie"]?.[0]).toContain("Expires=");
  });
  it("rejects access to the current user without a session", async () => {
    const response = await request(app).get("/auth/me");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: "Autenticación requerida",
    });
  });
  it("rejects login with an invalid email", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "not-an-email",
      password: "any password",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Datos inválidos");
  });
  it("rejects registration with a short password", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Samuel Vera",
      email: "samuel@example.com",
      password: "short",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Datos inválidos");
  });

  it("rejects privilege injection during registration", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Samuel Vera",
      email: "samuel@example.com",
      password: "a secure passphrase",
      role: "admin",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Datos inválidos");
  });
  it("returns API information from the root route", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      version: "1.0.0",
    });
  });

  it("returns 404 for an unknown route", async () => {
    const response = await request(app).get("/unknown-route");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Ruta no encontrada: GET /unknown-route",
    });
  });

  it("requires authentication before validating a task UUID", async () => {
    const response = await request(app).get("/tasks/not-a-valid-uuid");

    expect(response.status).toBe(401);
  });

  it("requires authentication before validating a task update", async () => {
    const response = await request(app)
      .put("/tasks/00000000-0000-4000-8000-000000000000")
      .send({});

    expect(response.status).toBe(401);
  });

  it("rejects malformed JSON", async () => {
    const response = await request(app)
      .post("/tasks")
      .set("Content-Type", "application/json")
      .send('{"title":');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "JSON inválido",
    });
  });
});
