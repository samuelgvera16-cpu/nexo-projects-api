import express from "express";

import taskRoutes from "./routes/task.routes.js";

import {
  errorHandler,
  notFoundHandler,
} from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensaje: "Hola desde Express + TypeScript 🚀",
    version: "1.0.0",
  });
});

app.use("/tasks", taskRoutes);

// Deben ir DESPUÉS de las rutas
app.use(notFoundHandler);
app.use(errorHandler);

export default app;