import { describe, expect, it } from "vitest";

import {
  createTaskSchema,
  taskIdParamSchema,
  updateTaskSchema,
} from "../src/schemas/task.schema.js";

describe("Task schemas", () => {
  it("accepts a valid task creation request", () => {
    const result = createTaskSchema.safeParse({
      project_id: "11111111-1111-4111-8111-111111111111",
      title: "Implement authentication",
      priority: "high",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a client-provided created_by value", () => {
    const result = createTaskSchema.safeParse({
      project_id: "11111111-1111-4111-8111-111111111111",
      created_by: "22222222-2222-4222-8222-222222222222",
      title: "Attempt identity spoofing",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid task UUID", () => {
    const result = taskIdParamSchema.safeParse({
      id: "not-a-valid-uuid",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an empty task update", () => {
    const result = updateTaskSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it("rejects protected fields in a task update", () => {
    const result = updateTaskSchema.safeParse({
      status: "completed",
      created_by: "22222222-2222-4222-8222-222222222222",
      project_id: "33333333-3333-4333-8333-333333333333",
    });

    expect(result.success).toBe(false);
  });
});
