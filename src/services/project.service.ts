import { pool } from "../config/database.js";
import type { Project, ProjectWithRole } from "../models/project.js";

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
export async function getProjectsForUser(
  userId: string
): Promise<ProjectWithRole[]> {
  const result = await pool.query<ProjectWithRole>(
    `
      SELECT
        project.id,
        project.owner_id,
        project.name,
        project.description,
        project.created_at,
        project.updated_at,
        CASE
          WHEN project.owner_id = $1 THEN 'owner'
          ELSE member.role
        END AS role
      FROM projects AS project
      LEFT JOIN project_members AS member
        ON member.project_id = project.id
        AND member.user_id = $1
      WHERE project.owner_id = $1
        OR member.user_id = $1
      ORDER BY project.updated_at DESC
    `,
    [userId]
  );

  return result.rows;
}
export async function getProjectByIdForUser(
  projectId: string,
  userId: string
): Promise<ProjectWithRole | null> {
  const result = await pool.query<ProjectWithRole>(
    `
      SELECT
        project.id,
        project.owner_id,
        project.name,
        project.description,
        project.created_at,
        project.updated_at,
        CASE
          WHEN project.owner_id = $2 THEN 'owner'
          ELSE member.role
        END AS role
      FROM projects AS project
      LEFT JOIN project_members AS member
        ON member.project_id = project.id
        AND member.user_id = $2
      WHERE project.id = $1
        AND (
          project.owner_id = $2
          OR member.user_id = $2
        )
      LIMIT 1
    `,
    [projectId, userId]
  );

  return result.rows[0] ?? null;
}
