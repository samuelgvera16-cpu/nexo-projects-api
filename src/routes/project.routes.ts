import { Router } from "express";

import { createNewProject } from "../controllers/project.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { validateBody } from "../middleware/validate.js";
import { createProjectSchema } from "../schemas/project.schema.js";

const router = Router();

router.use(requireAuth);

router.post("/", validateBody(createProjectSchema), createNewProject);

export default router;
