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
import { authRateLimiter } from "../middleware/rateLimit.js";

const router = Router();

router.post(
  "/register",
  authRateLimiter,
  validateBody(registerSchema),
  register
);

router.post("/login", authRateLimiter, validateBody(loginSchema), login);

router.get("/me", requireAuth, getCurrentUser);

router.post("/logout", logout);

export default router;
