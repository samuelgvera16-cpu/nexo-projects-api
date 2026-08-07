import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { apiRateLimiter } from "./middleware/rateLimit.js";

import { openApiDocument } from "./docs/openapi.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(apiRateLimiter);
app.use(
  express.json({
    limit: "100kb",
  })
);
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    mensaje: "Hola desde Express + TypeScript 🚀",
    version: "1.0.0",
  });
});

app.get("/openapi.json", (req, res) => {
  res.json(openApiDocument);
});

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument, {
    customSiteTitle: "Nexo Projects API Docs",
  })
);

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);

// Deben ir DESPUÉS de las rutas
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
