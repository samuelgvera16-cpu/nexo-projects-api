import { pool } from "../config/database.js";
import type { ProjectMember } from "../models/project-member.js";

export async function getProjectMembers(
  projectId: string
): Promise<ProjectMember[]> {
  const result = await pool.query<ProjectMember>(
    `
      SELECT
        member.project_id,
        member.user_id,
        project_user.name,
        project_user.email,
        CASE
          WHEN project.owner_id = member.user_id THEN 'owner'
          ELSE member.role
        END AS role,
        member.joined_at
      FROM project_members AS member
      INNER JOIN users AS project_user
        ON project_user.id = member.user_id
      INNER JOIN projects AS project
        ON project.id = member.project_id
      WHERE member.project_id = $1
      ORDER BY
        CASE
          WHEN project.owner_id = member.user_id THEN 0
          WHEN member.role = 'admin' THEN 1
          ELSE 2
        END,
        project_user.name ASC
    `,
    [projectId]
  );

  return result.rows;
}
