import { pool } from "../config/database.js";
import type { Project } from "../models/project.js";

interface CreateProjectInput {
  owner_id: string;
  name: string;
  description?: string | null;
}

export async function createProject(
  data: CreateProjectInput
): Promise<Project> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const projectResult = await client.query<Project>(
      `
        INSERT INTO projects (
          owner_id,
          name,
          description
        )
        VALUES ($1, $2, $3)
        RETURNING
          id,
          owner_id,
          name,
          description,
          created_at,
          updated_at
      `,
      [data.owner_id, data.name, data.description ?? null]
    );

    const project = projectResult.rows[0]!;

    await client.query(
      `
        INSERT INTO project_members (
          project_id,
          user_id,
          role
        )
        VALUES ($1, $2, 'owner')
      `,
      [project.id, data.owner_id]
    );

    await client.query("COMMIT");

    return project;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
