import type {
  ErrorRequestHandler,
  RequestHandler,
} from "express";

import { AppError } from "../errors/AppError.js";

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
    });

    return;
  }

  // JSON mal escrito enviado por el cliente
  if (error instanceof SyntaxError && "body" in error) {
    res.status(400).json({
      message: "JSON inválido",
    });

    return;
  }

  console.error(error);

  res.status(500).json({
    message: "Error interno del servidor",
  });
};