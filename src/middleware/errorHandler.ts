import type { ErrorRequestHandler, RequestHandler } from "express";

import { AppError } from "../errors/AppError.js";

type PostgresError = Error & {
  code: string;
};

type ErrorResponse = {
  statusCode: number;
  message: string;
};

const postgresErrorResponses: Record<string, ErrorResponse> = {
  "23502": {
    statusCode: 400,
    message: "Falta un valor obligatorio",
  },
  "23503": {
    statusCode: 400,
    message: "La referencia proporcionada no existe",
  },
  "23505": {
    statusCode: 409,
    message: "El recurso ya existe",
  },
  "23514": {
    statusCode: 400,
    message: "El valor no cumple las reglas de la base de datos",
  },
  "22P02": {
    statusCode: 400,
    message: "El formato de uno de los valores es inválido",
  },
};

function isPostgresError(error: unknown): error is PostgresError {
  return (
    error instanceof Error && "code" in error && typeof error.code === "string"
  );
}

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
    });

    return;
  }

  if (error instanceof SyntaxError && "body" in error) {
    res.status(400).json({
      message: "JSON inválido",
    });

    return;
  }

  if (isPostgresError(error)) {
    const response = postgresErrorResponses[error.code];

    if (response) {
      res.status(response.statusCode).json({
        message: response.message,
      });

      return;
    }
  }

  console.error(error);

  res.status(500).json({
    message: "Error interno del servidor",
  });
};
