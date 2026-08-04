import { describe, expect, it } from "vitest";

import { hashPassword, verifyPassword } from "../src/security/password.js";

describe("Password security", () => {
  it("hashes a password without storing the original value", async () => {
    const password = "StrongPassword123!";
    const hash = await hashPassword(password);

    expect(hash).not.toContain(password);
    expect(hash).toMatch(/^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/);
  });

  it("uses a different salt for every hash", async () => {
    const password = "StrongPassword123!";

    const firstHash = await hashPassword(password);
    const secondHash = await hashPassword(password);

    expect(firstHash).not.toBe(secondHash);
  });

  it("accepts the correct password", async () => {
    const password = "StrongPassword123!";
    const hash = await hashPassword(password);

    await expect(verifyPassword(password, hash)).resolves.toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashPassword("StrongPassword123!");

    await expect(verifyPassword("IncorrectPassword123!", hash)).resolves.toBe(
      false
    );
  });

  it("rejects a malformed stored hash", async () => {
    await expect(
      verifyPassword("StrongPassword123!", "invalid-hash")
    ).resolves.toBe(false);
  });
});
