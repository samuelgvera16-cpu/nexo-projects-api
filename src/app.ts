import express from "express";

import taskRoutes from "./routes/task.routes.js";

import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.routes.js";

import cookieParser from "cookie-parser";

import projectRoutes from "./routes/project.routes.js";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    mensaje: "Hola desde Express + TypeScript 🚀",
    version: "1.0.0",
  });
});

app.use("/auth", authRoutes);
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/tasks", taskRoutes);

// Deben ir DESPUÉS de las rutas
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
