import type { Request, Response } from "express";

import type { RegisterInput } from "../schemas/auth.schema.js";
import { createUser } from "../services/user.service.js";

type RegisterRequest = Request<Record<string, never>, unknown, RegisterInput>;

export async function register(req: RegisterRequest, res: Response) {
  const user = await createUser(req.body);

  return res.status(201).json({
    user,
  });
}
