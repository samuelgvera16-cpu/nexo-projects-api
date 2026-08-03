import { Router } from "express";

import {
  createNewTask,
  deleteExistingTask,
  getTask,
  getTasks,
  updateExistingTask,
} from "../controllers/task.controller.js";

import {
  createTaskSchema,
  taskIdParamSchema,
  updateTaskSchema,
} from "../schemas/task.schema.js";

import { validateBody, validateParams } from "../middleware/validate.js";

const router = Router();

router.get("/", getTasks);

router.get("/:id", validateParams(taskIdParamSchema), getTask);

router.post("/", validateBody(createTaskSchema), createNewTask);

router.put(
  "/:id",
  validateParams(taskIdParamSchema),
  validateBody(updateTaskSchema),
  updateExistingTask
);

router.delete("/:id", validateParams(taskIdParamSchema), deleteExistingTask);

export default router;
