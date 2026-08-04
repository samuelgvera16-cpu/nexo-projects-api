export interface Project {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ProjectWithRole extends Project {
  role: "owner" | "admin" | "member";
}
