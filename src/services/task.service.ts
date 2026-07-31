import type { Task } from "../models/task.js";
import { pool } from "../config/database.js";

export async function getAllTasks(): Promise<Task[]> {
  const result = await pool.query<Task>(
    `
    SELECT
      id,
      project_id,
      assigned_to,
      created_by,
      title,
      description,
      status,
      priority,
      due_date,
      created_at,
      updated_at
    FROM tasks
    ORDER BY created_at DESC
    `
  );

  return result.rows;
}

export async function getTaskById(id: string): Promise<Task | undefined> {
  const result = await pool.query<Task>(
    `
    SELECT
      id,
      project_id,
      assigned_to,
      created_by,
      title,
      description,
      status,
      priority,
      due_date,
      created_at,
      updated_at
    FROM tasks
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
}
interface CreateTaskInput {
  project_id: string;
  created_by: string;
  assigned_to?: string | null;
  title: string;
  description?: string | null;
  priority?: "low" | "medium" | "high" | "urgent";
}

export async function createTask(
  data: CreateTaskInput
): Promise<Task> {
  const result = await pool.query<Task>(
    `
    INSERT INTO tasks (
      project_id,
      created_by,
      assigned_to,
      title,
      description,
      priority
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [
      data.project_id,
      data.created_by,
      data.assigned_to ?? null,
      data.title,
      data.description ?? null,
      data.priority ?? "medium",
    ]
  );

  return result.rows[0]!;
}
interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  assigned_to?: string | null;
  status?: "todo" | "in_progress" | "completed" | "cancelled";
  priority?: "low" | "medium" | "high" | "urgent";
}

export async function updateTask(
  id: string,
  data: UpdateTaskInput
): Promise<Task | undefined> {
  const result = await pool.query<Task>(
    `
    UPDATE tasks
    SET
      title = COALESCE($2, title),
      description = COALESCE($3, description),
      assigned_to = COALESCE($4, assigned_to),
      status = COALESCE($5, status),
      priority = COALESCE($6, priority),
      updated_at = NOW()
    WHERE id = $1
    RETURNING *
    `,
    [
      id,
      data.title ?? null,
      data.description ?? null,
      data.assigned_to ?? null,
      data.status ?? null,
      data.priority ?? null,
    ]
  );

  return result.rows[0];
}
export async function deleteTask(id: string): Promise<boolean> {
  const result = await pool.query(
    `
    DELETE FROM tasks
    WHERE id = $1
    `,
    [id]
  );

  return result.rowCount !== null && result.rowCount > 0;
}