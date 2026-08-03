import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, "El correo es demasiado largo")
  .email("El correo no tiene un formato válido");

const passwordSchema = z
  .string()
  .min(12, "La contraseña debe tener al menos 12 caracteres")
  .max(128, "La contraseña no puede exceder 128 caracteres");

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(120, "El nombre no puede exceder 120 caracteres"),

    email: emailSchema,

    password: passwordSchema,
  })
  .strict();

export const loginSchema = z
  .object({
    email: emailSchema,

    password: z
      .string()
      .min(1, "La contraseña es obligatoria")
      .max(128, "La contraseña no puede exceder 128 caracteres"),
  })
  .strict();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
