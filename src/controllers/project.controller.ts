import type { Request, Response } from "express";

import { AppError } from "../errors/AppError.js";
import { createProject } from "../services/project.service.js";

export async function createNewProject(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError("Autenticación requerida", 401);
  }

  const project = await createProject({
    ...req.body,
    owner_id: req.user.id,
  });

  return res.status(201).json(project);
}
