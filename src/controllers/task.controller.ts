import type { Request, Response } from "express";

import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from "../services/task.service.js";

import { AppError } from "../errors/AppError.js";

import {
  getUserProjectRole,
  userHasProjectAccess,
} from "../services/project-access.service.js";
type TaskParams = {
  id: string;
};

export async function getTasks(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError("Autenticación requerida", 401);
  }

  const tasks = await getAllTasks(req.user.id);

  return res.json(tasks);
}

export async function getTask(req: Request<TaskParams>, res: Response) {
  if (!req.user) {
    throw new AppError("Autenticación requerida", 401);
  }

  const id = req.params.id;

  const task = await getTaskById(id, req.user.id);

  if (!task) {
    throw new AppError("Tarea no encontrada", 404);
  }

  return res.json(task);
}

export async function createNewTask(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError("Autenticación requerida", 401);
  }

  const hasProjectAccess = await userHasProjectAccess(
    req.user.id,
    req.body.project_id
  );

  if (!hasProjectAccess) {
    throw new AppError("Proyecto no encontrado", 404);
  }

  if (req.body.assigned_to) {
    const assigneeHasProjectAccess = await userHasProjectAccess(
      req.body.assigned_to,
      req.body.project_id
    );

    if (!assigneeHasProjectAccess) {
      throw new AppError("El usuario asignado no pertenece al proyecto", 400);
    }
  }

  const task = await createTask({
    ...req.body,
    created_by: req.user.id,
  });

  return res.status(201).json(task);
}

export async function updateExistingTask(
  req: Request<TaskParams>,
  res: Response
) {
  if (!req.user) {
    throw new AppError("Autenticación requerida", 401);
  }

  const id = req.params.id;

  if (Object.hasOwn(req.body, "assigned_to") && req.body.assigned_to !== null) {
    const existingTask = await getTaskById(id, req.user.id);

    if (!existingTask) {
      throw new AppError("Tarea no encontrada", 404);
    }

    const assigneeHasProjectAccess = await userHasProjectAccess(
      req.body.assigned_to,
      existingTask.project_id
    );

    if (!assigneeHasProjectAccess) {
      throw new AppError("El usuario asignado no pertenece al proyecto", 400);
    }
  }

  const task = await updateTask(id, req.body, req.user.id);

  if (!task) {
    throw new AppError("Tarea no encontrada", 404);
  }

  return res.json(task);
}

export async function deleteExistingTask(
  req: Request<TaskParams>,
  res: Response
) {
  if (!req.user) {
    throw new AppError("Autenticación requerida", 401);
  }

  const id = req.params.id;

  const task = await getTaskById(id, req.user.id);

  if (!task) {
    throw new AppError("Tarea no encontrada", 404);
  }

  const role = await getUserProjectRole(req.user.id, task.project_id);

  if (role !== "owner" && role !== "admin") {
    throw new AppError("No tienes permiso para eliminar esta tarea", 403);
  }

  const deleted = await deleteTask(id, req.user.id);

  if (!deleted) {
    throw new AppError("Tarea no encontrada", 404);
  }

  return res.status(204).send();
}
