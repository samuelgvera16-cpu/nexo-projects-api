import { pool } from "../config/database.js";
import type { User, UserWithPassword } from "../models/user.js";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema.js";
import { hashPassword, verifyPassword } from "../security/password.js";

const dummyPasswordHashPromise = hashPassword("invalid user password");

export async function createUser(data: RegisterInput): Promise<User> {
  const passwordHash = await hashPassword(data.password);

  const result = await pool.query<User>(
    `
    INSERT INTO users (
      name,
      email,
      password_hash
    )
    VALUES ($1, $2, $3)
    RETURNING
      id,
      name,
      email,
      created_at,
      updated_at
    `,
    [data.name, data.email, passwordHash]
  );

  return result.rows[0]!;
}

export async function findUserByEmail(
  email: string
): Promise<UserWithPassword | undefined> {
  const result = await pool.query<UserWithPassword>(
    `
    SELECT
      id,
      name,
      email,
      password_hash,
      created_at,
      updated_at
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  return result.rows[0];
}

export function toPublicUser(user: UserWithPassword): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

export async function authenticateUser(
  data: LoginInput
): Promise<User | undefined> {
  const user = await findUserByEmail(data.email);

  const passwordHash = user?.password_hash ?? (await dummyPasswordHashPromise);

  const passwordIsValid = await verifyPassword(data.password, passwordHash);

  if (!user || !passwordIsValid) {
    return undefined;
  }

  return toPublicUser(user);
}
