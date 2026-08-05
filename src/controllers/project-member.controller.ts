import type { Request, Response } from "express";

import { AppError } from "../errors/AppError.js";
import {
  addProjectMember,
  getProjectMembers,
  updateProjectMemberRole,
} from "../services/project-member.service.js";
import { getProjectByIdForUser } from "../services/project.service.js";

type ProjectParams = {
  id: string;
};

type ProjectMemberParams = ProjectParams & {
  userId: string;
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

export async function addMemberToProject(
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

  if (project.role === "member") {
    throw new AppError("No tienes permiso para agregar integrantes", 403);
  }

  if (project.role === "admin" && req.body.role === "admin") {
    throw new AppError(
      "Solo el propietario puede agregar administradores",
      403
    );
  }

  const result = await addProjectMember(
    req.params.id,
    req.body.email,
    req.body.role
  );

  if (result.status === "user_not_found") {
    throw new AppError("Usuario no encontrado", 404);
  }

  if (result.status === "already_member") {
    throw new AppError("El usuario ya pertenece al proyecto", 409);
  }

  return res.status(201).json(result.member);
}

export async function changeProjectMemberRole(
  req: Request<ProjectMemberParams>,
  res: Response
) {
  if (!req.user) {
    throw new AppError("Autenticación requerida", 401);
  }

  const project = await getProjectByIdForUser(req.params.id, req.user.id);

  if (!project) {
    throw new AppError("Proyecto no encontrado", 404);
  }

  if (project.role !== "owner") {
    throw new AppError("Solo el propietario puede cambiar roles", 403);
  }

  if (req.params.userId === project.owner_id) {
    throw new AppError("No puedes cambiar el rol del propietario", 400);
  }

  const updatedMember = await updateProjectMemberRole(
    req.params.id,
    req.params.userId,
    req.body.role
  );

  if (!updatedMember) {
    throw new AppError("Integrante no encontrado", 404);
  }

  return res.json(updatedMember);
}
