import { Router } from "express";

import {
  createNewProject,
  getProject,
  getProjects,
} from "../controllers/project.controller.js";

import { requireAuth } from "../middleware/requireAuth.js";
import { validateBody, validateParams } from "../middleware/validate.js";
import {
  createProjectSchema,
  projectIdParamSchema,
} from "../schemas/project.schema.js";

const router = Router();

router.use(requireAuth);

router.get("/", getProjects);

router.get("/:id", validateParams(projectIdParamSchema), getProject);

router.post("/", validateBody(createProjectSchema), createNewProject);

export default router;
