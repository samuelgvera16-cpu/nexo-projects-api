import type { Request, Response } from "express";

import { env } from "../config/env.js";
import { AppError } from "../errors/AppError.js";
import type { LoginInput, RegisterInput } from "../schemas/auth.schema.js";
import {
  createSession,
  SESSION_COOKIE_NAME,
} from "../services/session.service.js";
import { authenticateUser, createUser } from "../services/user.service.js";

type RegisterRequest = Request<Record<string, never>, unknown, RegisterInput>;

type LoginRequest = Request<Record<string, never>, unknown, LoginInput>;

export async function register(req: RegisterRequest, res: Response) {
  const user = await createUser(req.body);

  return res.status(201).json({
    user,
  });
}

export async function login(req: LoginRequest, res: Response) {
  const user = await authenticateUser(req.body);

  if (!user) {
    throw new AppError("Credenciales inválidas", 401);
  }

  const session = await createSession(user.id);

  res.cookie(SESSION_COOKIE_NAME, session.token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    expires: session.expiresAt,
    path: "/",
  });

  return res.json({
    user,
  });
}
export function getCurrentUser(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError("Autenticación requerida", 401);
  }

  return res.json({
    user: req.user,
  });
}
