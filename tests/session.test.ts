import { describe, expect, it } from "vitest";

import {
  createSessionToken,
  hashSessionToken,
} from "../src/services/session.service.js";

describe("Session security", () => {
  it("generates unique URL-safe session tokens", () => {
    const firstToken = createSessionToken();
    const secondToken = createSessionToken();

    expect(firstToken).not.toBe(secondToken);
    expect(firstToken).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(secondToken).toMatch(/^[A-Za-z0-9_-]{43}$/);
  });

  it("hashes session tokens without storing the original token", () => {
    const token = createSessionToken();
    const tokenHash = hashSessionToken(token);

    expect(tokenHash).not.toBe(token);
    expect(tokenHash).toMatch(/^[a-f0-9]{64}$/);
    expect(hashSessionToken(token)).toBe(tokenHash);
  });
});
