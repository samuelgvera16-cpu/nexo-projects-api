import { describe, expect, it } from "vitest";

import { loginSchema, registerSchema } from "../src/schemas/auth.schema.js";

describe("Authentication schemas", () => {
  it("normalizes valid registration data", () => {
    const result = registerSchema.parse({
      name: "  Samuel Vera  ",
      email: "  SAMUEL@EXAMPLE.COM  ",
      password: "a secure passphrase",
    });

    expect(result).toEqual({
      name: "Samuel Vera",
      email: "samuel@example.com",
      password: "a secure passphrase",
    });
  });

  it("rejects a password shorter than 12 characters", () => {
    const result = registerSchema.safeParse({
      name: "Samuel Vera",
      email: "samuel@example.com",
      password: "short",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = registerSchema.safeParse({
      name: "Samuel Vera",
      email: "not-an-email",
      password: "a secure passphrase",
    });

    expect(result.success).toBe(false);
  });

  it("rejects unexpected registration properties", () => {
    const result = registerSchema.safeParse({
      name: "Samuel Vera",
      email: "samuel@example.com",
      password: "a secure passphrase",
      role: "admin",
    });

    expect(result.success).toBe(false);
  });

  it("normalizes a login email without changing the password", () => {
    const result = loginSchema.parse({
      email: "  SAMUEL@EXAMPLE.COM ",
      password: " password with spaces ",
    });

    expect(result).toEqual({
      email: "samuel@example.com",
      password: " password with spaces ",
    });
  });
});
