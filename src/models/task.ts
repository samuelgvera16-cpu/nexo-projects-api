export interface Task {
  id: string;
  project_id: string;
  assigned_to: string | null;
  created_by: string;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  due_date: Date | null;
  created_at: Date;
  updated_at: Date;
}
