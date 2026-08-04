import { Router } from "express";

import {
  getCurrentUser,
  login,
  logout,
  register,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { validateBody } from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";

const router = Router();

router.post("/register", validateBody(registerSchema), register);

router.post("/login", validateBody(loginSchema), login);

router.get("/me", requireAuth, getCurrentUser);

router.post("/logout", logout);

export default router;
