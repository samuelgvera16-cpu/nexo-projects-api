import { describe, expect, it } from "vitest";

import {
  addProjectMemberSchema,
  projectMemberParamsSchema,
  updateProjectMemberRoleSchema,
} from "../src/schemas/project-member.schema.js";

describe("Project member schemas", () => {
  it("normalizes email and defaults to member role", () => {
    const result = addProjectMemberSchema.safeParse({
      email: "  MEMBER@EXAMPLE.COM  ",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe("member@example.com");
      expect(result.data.role).toBe("member");
    }
  });

  it("accepts the admin role", () => {
    const result = addProjectMemberSchema.safeParse({
      email: "admin@example.com",
      role: "admin",
    });

    expect(result.success).toBe(true);
  });

  it("rejects assigning the owner role", () => {
    const result = updateProjectMemberRoleSchema.safeParse({
      role: "owner",
    });

    expect(result.success).toBe(false);
  });

  it("rejects client-controlled user IDs", () => {
    const result = addProjectMemberSchema.safeParse({
      email: "member@example.com",
      user_id: "11111111-1111-4111-8111-111111111111",
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid project member parameters", () => {
    const result = projectMemberParamsSchema.safeParse({
      id: "invalid-project",
      userId: "invalid-user",
    });

    expect(result.success).toBe(false);
  });
});
