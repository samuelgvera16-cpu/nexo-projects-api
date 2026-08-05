import type { Request, Response } from "express";

import { AppError } from "../errors/AppError.js";
import {
  createProject,
  deleteProject,
  getProjectByIdForUser,
  getProjectsForUser,
  updateProject,
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

export async function updateExistingProject(
  req: Request<ProjectParams>,
  res: Response
) {
  if (!req.user) {
    throw new AppError("Autenticación requerida", 401);
  }

  const existingProject = await getProjectByIdForUser(
    req.params.id,
    req.user.id
  );

  if (!existingProject) {
    throw new AppError("Proyecto no encontrado", 404);
  }

  if (existingProject.role !== "owner" && existingProject.role !== "admin") {
    throw new AppError("No tienes permiso para actualizar este proyecto", 403);
  }

  const updatedProject = await updateProject(
    req.params.id,
    req.body,
    req.user.id
  );

  if (!updatedProject) {
    throw new AppError("Proyecto no encontrado", 404);
  }

  return res.json(updatedProject);
}

export async function deleteExistingProject(
  req: Request<ProjectParams>,
  res: Response
) {
  if (!req.user) {
    throw new AppError("Autenticación requerida", 401);
  }

  const existingProject = await getProjectByIdForUser(
    req.params.id,
    req.user.id
  );

  if (!existingProject) {
    throw new AppError("Proyecto no encontrado", 404);
  }

  if (existingProject.role !== "owner") {
    throw new AppError("Solo el propietario puede eliminar este proyecto", 403);
  }

  const deleted = await deleteProject(req.params.id, req.user.id);

  if (!deleted) {
    throw new AppError("Proyecto no encontrado", 404);
  }

  return res.status(204).send();
}
