import type { Request, Response } from "express";

import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from "../services/task.service.js";

import { AppError } from "../errors/AppError.js";

type TaskParams = {
  id: string;
};

export async function getTasks(
  req: Request,
  res: Response
) {
  const tasks = await getAllTasks();

  return res.json(tasks);
}

export async function getTask(
  req: Request<TaskParams>,
  res: Response
) {
  const id = req.params.id;

  const task = await getTaskById(id);

  if (!task) {
    throw new AppError("Tarea no encontrada", 404);
  }

  return res.json(task);
}

export async function createNewTask(
  req: Request,
  res: Response
) {
  const task = await createTask(req.body);

  return res.status(201).json(task);
}

export async function updateExistingTask(
  req: Request<TaskParams>,
  res: Response
) {
  const id = req.params.id;

  const task = await updateTask(id, req.body);

  if (!task) {
    throw new AppError("Tarea no encontrada", 404);
  }

  return res.json(task);
}

export async function deleteExistingTask(
  req: Request<TaskParams>,
  res: Response
) {
  const id = req.params.id;

  const deleted = await deleteTask(id);

  if (!deleted) {
    throw new AppError("Tarea no encontrada", 404);
  }

  return res.status(204).send();
}