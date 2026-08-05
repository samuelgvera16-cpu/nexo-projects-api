export type ProjectRole = "owner" | "admin" | "member";

export interface ProjectMember {
  project_id: string;
  user_id: string;
  name: string;
  email: string;
  role: ProjectRole;
  joined_at: Date;
}
