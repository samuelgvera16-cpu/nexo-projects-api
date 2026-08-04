import { pool } from "../config/database.js";

type ProjectAccessResult = {
  has_access: boolean;
};

export type ProjectRole = "owner" | "admin" | "member";

type ProjectRoleResult = {
  role: ProjectRole;
};

export async function userHasProjectAccess(
  userId: string,
  projectId: string
): Promise<boolean> {
  const result = await pool.query<ProjectAccessResult>(
    `
      SELECT EXISTS (
        SELECT 1
        FROM projects AS project
        WHERE project.id = $1
          AND (
            project.owner_id = $2
            OR EXISTS (
              SELECT 1
              FROM project_members AS member
              WHERE member.project_id = project.id
                AND member.user_id = $2
            )
          )
      ) AS has_access
    `,
    [projectId, userId]
  );

  return result.rows[0]?.has_access ?? false;
}

export async function getUserProjectRole(
  userId: string,
  projectId: string
): Promise<ProjectRole | undefined> {
  const result = await pool.query<ProjectRoleResult>(
    `
      SELECT
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
          OR member.user_id IS NOT NULL
        )
      LIMIT 1
    `,
    [projectId, userId]
  );

  return result.rows[0]?.role;
}
