/**
 * Represents a task in the system.
 */
export interface Task {
  id: number; // Unique identifier for the task
  title: string; // Title of the task
  description: string; // Description of the task
  status: "pending" | "in_progress" | "completed"; // Current status of the task
  dueDate: string; // Due date of the task in ISO format (e.g., YYYY-MM-DD)
  userId: number; // Identifier of the user who created or is assigned to the task
}
