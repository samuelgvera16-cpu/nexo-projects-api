import { z } from "zod";

export const createProjectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "El nombre del proyecto es obligatorio")
      .max(150, "El nombre no puede tener más de 150 caracteres"),

    description: z
      .string()
      .trim()
      .max(2000, "La descripción no puede tener más de 2000 caracteres")
      .nullable()
      .optional(),
  })
  .strict();

export const updateProjectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "El nombre del proyecto no puede estar vacío")
      .max(150, "El nombre no puede tener más de 150 caracteres")
      .optional(),

    description: z
      .string()
      .trim()
      .max(2000, "La descripción no puede tener más de 2000 caracteres")
      .nullable()
      .optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debes proporcionar al menos un campo para actualizar",
  });

export const projectIdParamSchema = z.object({
  id: z.uuid("El ID del proyecto debe ser un UUID válido"),
});
