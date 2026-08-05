import type { Request, Response } from "express";

import { AppError } from "../errors/AppError.js";
import { getProjectMembers } from "../services/project-member.service.js";
import { getProjectByIdForUser } from "../services/project.service.js";

type ProjectParams = {
  id: string;
};

export async function listProjectMembers(
  req: Request<ProjectParams>,
  res: Response
) {
  if (!req.user) {
    throw new AppError("Autenticación requerida", 401);
  }

  const project = await getProjectByIdForUser(req.params.id, req.user.id);

  if (!project) {
    throw new AppError("Proyecto no encontrado", 404);
  }

  const members = await getProjectMembers(req.params.id);

  return res.json(members);
}
