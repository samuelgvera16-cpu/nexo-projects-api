import type { Request, Response } from "express";

import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from "../services/task.service.js";

import { AppError } from "../errors/AppError.js";

import { userHasProjectAccess } from "../services/project-access.service.js";

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

  const deleted = await deleteTask(id, req.user.id);

  if (!deleted) {
    throw new AppError("Tarea no encontrada", 404);
  }

  return res.status(204).send();
}
