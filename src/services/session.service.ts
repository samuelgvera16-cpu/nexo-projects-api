import { createHash, randomBytes } from "node:crypto";

import { pool } from "../config/database.js";

import type { User } from "../models/user.js";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const SESSION_TOKEN_BYTES = 32;

export const SESSION_COOKIE_NAME = "nexo_session";

export interface CreatedSession {
  token: string;
  expiresAt: Date;
}

export function createSessionToken(): string {
  return randomBytes(SESSION_TOKEN_BYTES).toString("base64url");
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string): Promise<CreatedSession> {
  const token = createSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await pool.query(
    `
    INSERT INTO sessions (
      user_id,
      token_hash,
      expires_at
    )
    VALUES ($1, $2, $3)
    `,
    [userId, tokenHash, expiresAt]
  );

  return {
    token,
    expiresAt,
  };
}
export async function findUserBySessionToken(
  token: string
): Promise<User | undefined> {
  const tokenHash = hashSessionToken(token);

  const result = await pool.query<User>(
    `
    SELECT
      users.id,
      users.name,
      users.email,
      users.created_at,
      users.updated_at
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.token_hash = $1
      AND sessions.expires_at > NOW()
    LIMIT 1
    `,
    [tokenHash]
  );

  return result.rows[0];
}
