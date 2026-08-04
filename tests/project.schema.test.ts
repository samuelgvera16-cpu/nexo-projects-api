import { describe, expect, it } from "vitest";

import {
  createProjectSchema,
  projectIdParamSchema,
  updateProjectSchema,
} from "../src/schemas/project.schema.js";

describe("Project schemas", () => {
  it("accepts and normalizes a valid project", () => {
    const result = createProjectSchema.safeParse({
      name: "  Portfolio API  ",
      description: "  A collaborative project  ",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.name).toBe("Portfolio API");
      expect(result.data.description).toBe("A collaborative project");
    }
  });

  it("rejects client-controlled ownership", () => {
    const result = createProjectSchema.safeParse({
      name: "Unauthorized ownership",
      owner_id: "11111111-1111-4111-8111-111111111111",
    });

    expect(result.success).toBe(false);
  });

  it("accepts clearing a project description", () => {
    const result = updateProjectSchema.safeParse({
      description: null,
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty project update", () => {
    const result = updateProjectSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it("rejects an invalid project UUID", () => {
    const result = projectIdParamSchema.safeParse({
      id: "not-a-valid-uuid",
    });

    expect(result.success).toBe(false);
  });
});
