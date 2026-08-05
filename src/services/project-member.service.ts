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

export async function updateProjectMemberRole(
  projectId: string,
  userId: string,
  role: AssignableProjectRole
): Promise<ProjectMember | null> {
  const result = await pool.query<ProjectMember>(
    `
      UPDATE project_members AS member
      SET role = $3
      FROM
        projects AS project,
        users AS project_user
      WHERE member.project_id = $1
        AND member.user_id = $2
        AND project.id = member.project_id
        AND project.owner_id <> member.user_id
        AND project_user.id = member.user_id
      RETURNING
        member.project_id,
        member.user_id,
        project_user.name,
        project_user.email,
        member.role,
        member.joined_at
    `,
    [projectId, userId, role]
  );

  return result.rows[0] ?? null;
}

export async function getProjectMemberById(
  projectId: string,
  userId: string
): Promise<ProjectMember | null> {
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
        AND member.user_id = $2
      LIMIT 1
    `,
    [projectId, userId]
  );

  return result.rows[0] ?? null;
}

export async function removeProjectMember(
  projectId: string,
  targetUserId: string,
  actorUserId: string
): Promise<boolean> {
  const result = await pool.query(
    `
      DELETE FROM project_members AS target
      USING projects AS project
      WHERE target.project_id = $1
        AND target.user_id = $2
        AND project.id = target.project_id
        AND project.owner_id <> target.user_id
        AND (
          project.owner_id = $3
          OR (
            target.role = 'member'
            AND EXISTS (
              SELECT 1
              FROM project_members AS actor
              WHERE actor.project_id = target.project_id
                AND actor.user_id = $3
                AND actor.role = 'admin'
            )
          )
        )
    `,
    [projectId, targetUserId, actorUserId]
  );

  return result.rowCount !== null && result.rowCount > 0;
}
