import { z } from "zod";

const assignableProjectRoleSchema = z.enum(["admin", "member"]);

export const addProjectMemberSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .max(254, "El correo es demasiado largo")
      .email("El correo no tiene un formato válido"),

    role: assignableProjectRoleSchema.default("member"),
  })
  .strict();

export const updateProjectMemberRoleSchema = z
  .object({
    role: assignableProjectRoleSchema,
  })
  .strict();

export const projectMemberParamsSchema = z
  .object({
    id: z.uuid("El ID del proyecto debe ser un UUID válido"),
    userId: z.uuid("El ID del usuario debe ser un UUID válido"),
  })
  .strict();

export type AddProjectMemberInput = z.infer<typeof addProjectMemberSchema>;

export type UpdateProjectMemberRoleInput = z.infer<
  typeof updateProjectMemberRoleSchema
>;
