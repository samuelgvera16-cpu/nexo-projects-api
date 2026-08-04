import type { RequestHandler } from "express";

import { AppError } from "../errors/AppError.js";
import {
  findUserBySessionToken,
  SESSION_COOKIE_NAME,
} from "../services/session.service.js";

export const requireAuth: RequestHandler = async (req, _res, next) => {
  const cookies = req.cookies as Record<string, unknown> | undefined;

  const token = cookies?.[SESSION_COOKIE_NAME];

  if (typeof token !== "string" || !token) {
    throw new AppError("Autenticación requerida", 401);
  }

  const user = await findUserBySessionToken(token);

  if (!user) {
    throw new AppError("Sesión inválida o expirada", 401);
  }

  req.user = user;

  return next();
};
