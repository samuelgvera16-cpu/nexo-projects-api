import { Router } from "express";

import {
  createNewProject,
  getProjects,
} from "../controllers/project.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { validateBody } from "../middleware/validate.js";
import { createProjectSchema } from "../schemas/project.schema.js";

const router = Router();

router.use(requireAuth);

router.get("/", getProjects);

router.post("/", validateBody(createProjectSchema), createNewProject);

export default router;
