import { Router } from "express";

import {
  addMemberToProject,
  listProjectMembers,
} from "../controllers/project-member.controller.js";

import { addProjectMemberSchema } from "../schemas/project-member.schema.js";

import {
  createNewProject,
  deleteExistingProject,
  getProject,
  getProjects,
  updateExistingProject,
} from "../controllers/project.controller.js";

import { requireAuth } from "../middleware/requireAuth.js";
import { validateBody, validateParams } from "../middleware/validate.js";
import {
  createProjectSchema,
  projectIdParamSchema,
  updateProjectSchema,
} from "../schemas/project.schema.js";

const router = Router();

router.use(requireAuth);

router.get("/", getProjects);

router.get(
  "/:id/members",
  validateParams(projectIdParamSchema),
  listProjectMembers
);

router.post(
  "/:id/members",
  validateParams(projectIdParamSchema),
  validateBody(addProjectMemberSchema),
  addMemberToProject
);

router.get("/:id", validateParams(projectIdParamSchema), getProject);

router.put(
  "/:id",
  validateParams(projectIdParamSchema),
  validateBody(updateProjectSchema),
  updateExistingProject
);

router.delete(
  "/:id",
  validateParams(projectIdParamSchema),
  deleteExistingProject
);

router.post("/", validateBody(createProjectSchema), createNewProject);

export default router;
