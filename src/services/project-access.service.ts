import { pool } from "../config/database.js";

type ProjectAccessResult = {
  has_access: boolean;
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
