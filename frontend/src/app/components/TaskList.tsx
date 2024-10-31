"use client";

import React, { useEffect, useState, useCallback } from "react";
import { tasks } from "../lib/api";
import Button from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import TaskForm from "./TaskForm";
import { Task } from "../types/task";
import { useRouter } from "next/navigation";

/**
 * TaskList Component
 *
 * Renders a list of tasks with options to filter, add, edit, and delete tasks.
 * Displays a loading state and handles error messages.
 *
 * @returns {JSX.Element} The task list interface.
 */
const TaskList: React.FC = () => {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const router = useRouter(); // Inicializa useRouter

  /**
   * Loads tasks based on the current filter.
   * Uses async/await to fetch tasks from the API.
   */
  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await tasks.getAll(filter !== "all" ? filter : undefined);

      // Mark tasks as overdue
      const currentDate = new Date();
      const updatedTasks = data.map((task: Task) => {
        // Especifica que 'task' es de tipo Task
        if (
          new Date(task.dueDate) < currentDate &&
          task.status !== "completed"
        ) {
          return { ...task, status: "overdue" };
        }
        return task;
      });

      setTaskList(updatedTasks);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("Unauthorized access")) {
          setError("You need to log in to access your tasks.");
          router.push("/auth/login");
        } else {
          console.error("Error loading tasks:", error);
          setError("Failed to load tasks. Please try again.");
        }
      } else {
        console.error("Unexpected error loading tasks:", error);
        setError("Failed to load tasks. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [filter, router]);

  // Load tasks when the component mounts or when the filter changes
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  /**
   * Handles deleting a task after user confirmation.
   * Calls the API to delete the task and refreshes the task list.
   * @param {number} id - The ID of the task to delete.
   */
  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await tasks.delete(id);
        loadTasks();
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error deleting task:", error);
          setError("Failed to delete task. Please try again.");
        } else {
          console.error("Unexpected error deleting task:", error);
          setError("Failed to delete task. Please try again.");
        }
      }
    }
  };

  /**
   * Opens the dialog to edit a selected task.
   * @param {Task} task - The task to edit.
   */
  const handleEdit = (task: Task) => {
    setCurrentTask(task);
    setIsDialogOpen(true);
  };

  /**
   * Closes the dialog and resets the current task state.
   */
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentTask(null);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          disabled={isLoading}
          className="border p-2 rounded"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>{" "}
          {/* Opción para filtrar tareas vencidas */}
        </select>
        <Button
          onClick={() => {
            setCurrentTask(null);
            setIsDialogOpen(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Add New Task
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto transition-all duration-300 ease-in-out">
          <DialogHeader className="relative">
            <DialogTitle className="text-lg font-semibold">
              {currentTask ? "Edit Task" : "Add New Task"}
            </DialogTitle>
            <Button
              className="absolute top-2 right-2 text-red-600 hover:text-red-800"
              onClick={handleCloseDialog}
            >
              X
            </Button>
          </DialogHeader>

          <TaskForm
            existingTask={currentTask}
            onClose={handleCloseDialog}
            onTaskAdded={loadTasks}
            setCurrentTask={setCurrentTask}
          />

          {error && <p className="text-red-500">{error}</p>}
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <p>Loading tasks...</p>
      ) : (
        <>
          {error && <div className="text-red-500">{error}</div>}
          <ul className="mt-4">
            {taskList.length === 0 ? (
              <p>No tasks available.</p>
            ) : (
              taskList.map((task) => (
                <li
                  key={task.id}
                  className="flex justify-between items-center p-2 border-b"
                >
                  <div>
                    <strong>{task.title}</strong> - {task.description} (
                    {task.status})
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                      onClick={() => handleEdit(task)}
                    >
                      Edit
                    </Button>
                    <Button
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                      onClick={() => handleDelete(task.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default TaskList;
