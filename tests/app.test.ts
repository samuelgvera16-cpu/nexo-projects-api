import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../src/app.js";

describe("Application routes", () => {
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

  it("rejects an invalid task UUID", async () => {
    const response = await request(app).get("/tasks/not-a-valid-uuid");

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Parámetros inválidos");
    expect(response.body.errors).toBeInstanceOf(Array);
  });

  it("rejects an empty task update", async () => {
    const response = await request(app)
      .put("/tasks/00000000-0000-4000-8000-000000000000")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Datos inválidos");
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: "Debes proporcionar al menos un campo para actualizar",
        }),
      ])
    );
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
