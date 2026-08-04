import type { Request, Response } from "express";

import { AppError } from "../errors/AppError.js";
import {
  createProject,
  getProjectByIdForUser,
  getProjectsForUser,
} from "../services/project.service.js";

type ProjectParams = {
  id: string;
};

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
export async function getProjects(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError("Autenticación requerida", 401);
  }

  const projects = await getProjectsForUser(req.user.id);

  return res.json(projects);
}
export async function getProject(req: Request<ProjectParams>, res: Response) {
  if (!req.user) {
    throw new AppError("Autenticación requerida", 401);
  }

  const project = await getProjectByIdForUser(req.params.id, req.user.id);

  if (!project) {
    throw new AppError("Proyecto no encontrado", 404);
  }

  return res.json(project);
}
