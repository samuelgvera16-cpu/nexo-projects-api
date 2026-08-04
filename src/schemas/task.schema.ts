import { z } from "zod";

export const createTaskSchema = z
  .object({
    project_id: z.uuid(),
    assigned_to: z.uuid().nullable().optional(),

    title: z
      .string()
      .min(1, "El título es obligatorio")
      .max(200, "El título no puede tener más de 200 caracteres"),

    description: z.string().nullable().optional(),

    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  })
  .strict();
export const updateTaskSchema = z
  .object({
    title: z
      .string()
      .min(1, "El título no puede estar vacío")
      .max(200, "El título no puede tener más de 200 caracteres")
      .optional(),

    description: z.string().nullable().optional(),

    assigned_to: z.uuid().nullable().optional(),

    status: z
      .enum(["todo", "in_progress", "completed", "cancelled"])
      .optional(),

    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debes proporcionar al menos un campo para actualizar",
  });
export const taskIdParamSchema = z.object({
  id: z.uuid("El ID debe ser un UUID válido"),
});
