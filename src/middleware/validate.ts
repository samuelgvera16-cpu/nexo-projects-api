import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

export function validateBody(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Datos inválidos",
        errors: result.error.issues,
      });
    }

    req.body = result.data;

    return next();
  };
}
export function validateParams(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        message: "Parámetros inválidos",
        errors: result.error.issues,
      });
    }

    req.params = result.data as typeof req.params;

    return next();
  };
}
