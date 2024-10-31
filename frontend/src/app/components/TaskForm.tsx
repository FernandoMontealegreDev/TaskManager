import React, { useEffect, useState } from "react";
import Button from "../components/ui/button";
import Input from "../components/ui/input";
import { Task } from "../types/task";
import { tasks } from "../lib/api";
import { AxiosError } from "axios";

// Interface representing the structure of an error response from the API
interface ErrorResponse {
  message: string;
}

// Props interface for the TaskForm component
interface TaskFormProps {
  onTaskAdded: () => void; // Callback function to be called when a task is successfully added
  existingTask?: Task | null; // Optional existing task to edit, if any
  onClose?: () => void; // Optional callback function to close the form
  setCurrentTask?: React.Dispatch<React.SetStateAction<Task | null>>; // Optional setter for current task
}

// TaskForm component for adding or editing tasks
const TaskForm: React.FC<TaskFormProps> = ({
  onTaskAdded,
  existingTask,
  onClose,
}) => {
  // State to manage form data
  const [formData, setFormData] = useState({
    title: existingTask ? existingTask.title : "", // Title of the task
    description: existingTask ? existingTask.description : "", // Description of the task
    status: existingTask ? existingTask.status : "pending", // Status of the task
    dueDate: existingTask ? existingTask.dueDate.split("T")[0] : "", // Due date of the task
  });

  // State to manage error and success messages
  const [error, setError] = useState<string | null>(null); // Error message state
  const [success, setSuccess] = useState<string | null>(null); // Success message state

  // Effect to update form data when an existing task is provided
  useEffect(() => {
    if (existingTask) {
      setFormData({
        title: existingTask.title,
        description: existingTask.description,
        status: existingTask.status,
        dueDate: existingTask.dueDate.split("T")[0],
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "pending",
        dueDate: "",
      });
    }
  }, [existingTask]);

  // Validate form fields before submission
  const validateFields = () => {
    const { title, description, dueDate } = formData;
    const currentDate = new Date();
    const selectedDueDate = new Date(dueDate);

    // Reset currentDate and selectedDueDate to midnight
    currentDate.setHours(0, 0, 0, 0);
    selectedDueDate.setHours(0, 0, 0, 0);

    // Check for required fields
    if (!title || !description || !dueDate) {
      setError("All fields are required."); // Set error message if fields are missing
      return false;
    }

    // Check if the due date is a future date
    if (selectedDueDate < currentDate) {
      setError("Due date must be a future date."); // Set error message if due date is invalid
      return false;
    }

    // Clear error if validation passes
    setError(null);
    return true;
  };

  // Check if a task with the same title already exists
  const checkTaskExists = async (title: string): Promise<boolean> => {
    try {
      const tasksList = await tasks.getAll(); // Fetch all tasks
      return tasksList.some((task: Task) => task.title === title); // Check for duplicates
    } catch (error) {
      console.error("Error checking task existence", error); // Log error
      return false; // Return false in case of an error
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    setError(null); // Reset error state
    setSuccess(null); // Reset success state

    // Validate fields before proceeding
    if (!validateFields()) {
      return; // Exit if validation fails
    }

    // Check if the task already exists
    const taskExists = await checkTaskExists(formData.title);

    if (taskExists && !existingTask) {
      setError(
        "A task with this title already exists. Please choose another title."
      ); // Set error if title exists
      return;
    }

    // Submit task data to the API
    try {
      const taskData = {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString(), // Convert due date to ISO format
      };

      console.log("Submitting task data:", taskData); // Log task data

      // If editing an existing task, update it; otherwise, create a new task
      if (existingTask) {
        await tasks.update(existingTask.id, taskData);
        setSuccess("Task updated successfully!"); // Set success message
      } else {
        await tasks.create(taskData);
        setSuccess("Task added successfully!"); // Set success message
      }
      onTaskAdded(); // Call the onTaskAdded callback

      // Close the form if the onClose callback is provided
      if (onClose) {
        onClose();
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>; // Type the error as AxiosError

      // Handle different error responses
      if (axiosError.response) {
        if (axiosError.response.data.message.includes("already exists")) {
          setError(
            "A task with this title already exists. Please choose another title."
          ); // Set error for duplicate title
        } else {
          setError(
            axiosError.response.data.message ||
              "Failed to add/update task. Please try again." // Set error for other issues
          );
        }
      } else {
        setError("An unexpected error occurred. Please try again."); // Set error for unexpected issues
      }
    }
  };

  // Handle input field changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value })); // Update form data state
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="dialog-header mb-4 flex justify-between items-center">
          <h2 className="dialog-title text-lg font-semibold">
            {existingTask ? "Edit Task" : "Add Task"}
          </h2>
          <Button onClick={onClose} className="text-red-600 hover:text-red-800">
            X
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block">
            <span className="block text-sm font-medium mb-1">Title</span>
            <Input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
              className="border-gray-300 rounded p-2 w-full"
            />
          </label>
          <label className="block">
            <span className="block text-sm font-medium mb-1">Description</span>
            <Input
              type="text"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              required
              className="border-gray-300 rounded p-2 w-full"
            />
          </label>
          <label className="block">
            <span className="block text-sm font-medium mb-1">Status</span>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-sm font-medium mb-1">Due Date</span>
            <Input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleInputChange("dueDate", e.target.value)}
              required
              className="border-gray-300 rounded p-2 w-full"
            />
          </label>
          {error && <div className="text-red-500">{error}</div>}{" "}
          {/* Display error message */}
          {success && <div className="text-green-500">{success}</div>}{" "}
          {/* Display success message */}
          <Button
            type="submit"
            className="w-full bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            {existingTask ? "Update Task" : "Add Task"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
