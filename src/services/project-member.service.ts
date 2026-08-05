import { pool } from "../config/database.js";
import type { ProjectMember } from "../models/project-member.js";

type AssignableProjectRole = "admin" | "member";

export type AddProjectMemberResult =
  | {
      status: "created";
      member: ProjectMember;
    }
  | {
      status: "user_not_found";
    }
  | {
      status: "already_member";
    };

interface ProjectMemberUser {
  id: string;
  name: string;
  email: string;
}

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

export async function addProjectMember(
  projectId: string,
  email: string,
  role: AssignableProjectRole
): Promise<AddProjectMemberResult> {
  const userResult = await pool.query<ProjectMemberUser>(
    `
      SELECT
        id,
        name,
        email
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [email]
  );

  const projectUser = userResult.rows[0];

  if (!projectUser) {
    return {
      status: "user_not_found",
    };
  }

  const memberResult = await pool.query<{
    project_id: string;
    user_id: string;
    role: AssignableProjectRole;
    joined_at: Date;
  }>(
    `
      INSERT INTO project_members (
        project_id,
        user_id,
        role
      )
      VALUES ($1, $2, $3)
      ON CONFLICT (project_id, user_id) DO NOTHING
      RETURNING
        project_id,
        user_id,
        role,
        joined_at
    `,
    [projectId, projectUser.id, role]
  );

  const createdMember = memberResult.rows[0];

  if (!createdMember) {
    return {
      status: "already_member",
    };
  }

  return {
    status: "created",
    member: {
      ...createdMember,
      name: projectUser.name,
      email: projectUser.email,
    },
  };
}
