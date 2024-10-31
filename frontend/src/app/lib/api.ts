import axios, { AxiosError } from "axios";
import { LoginCredentials, RegisterCredentials } from "../types/auth";
import { Task } from "../types/task";

// Define the expected structure of the error response
interface ErrorResponse {
  message: string;
  // Add other fields as necessary
}

// Create an axios instance with a predefined base URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
});

// Utility function to get a cookie by name
const getCookie = (name: string): string | null => {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
};

// Utility function to set a cookie
const setCookie = (name: string, value: string, days: number): void => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

// Utility function to delete a cookie
const deleteCookie = (name: string): void => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

// Interceptor to add the token to requests
api.interceptors.request.use(
  (config) => {
    const token = getCookie("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handles response errors
const handleResponseError = (error: AxiosError<ErrorResponse>): void => {
  const message = error.response?.data.message || error.message;

  // Check for authentication errors (e.g., 401 Unauthorized)
  if (error.response?.status === 401) {
    deleteCookie("token"); // Optionally clear the token if not authenticated
    throw new Error("Unauthorized access. Please log in again.");
  }

  throw new Error(message);
};

// Authentication service
export const auth = {
  // Login function to authenticate a user
  login: async (credentials: LoginCredentials) => {
    try {
      const { data } = await api.post("/auth/login", credentials);
      setCookie("token", data.token, 7); // Set the token cookie for 7 days
      return data;
    } catch (error) {
      handleResponseError(error as AxiosError<ErrorResponse>);
    }
  },

  // Registration function to create a new user
  register: async (credentials: RegisterCredentials) => {
    try {
      const { data } = await api.post("/auth/register", credentials);
      setCookie("token", data.token, 7); // Set the token cookie for 7 days
      return data;
    } catch (error) {
      handleResponseError(error as AxiosError<ErrorResponse>);
    }
  },

  // Logout function to clear the token
  logout: () => {
    deleteCookie("token"); // Delete the token cookie
  },
};

// Task service
export const tasks = {
  // Function to retrieve all tasks, optionally filtered by status
  getAll: async (status: string = "") => {
    try {
      const params = status ? { status } : {};
      const { data } = await api.get("/tasks", { params });
      return data;
    } catch (error) {
      handleResponseError(error as AxiosError<ErrorResponse>);
    }
  },

  // Function to retrieve a task by its ID
  getById: async (id: number) => {
    try {
      const { data } = await api.get(`/tasks/${id}`);
      return data;
    } catch (error) {
      handleResponseError(error as AxiosError<ErrorResponse>);
    }
  },

  // Function to create a new task
  create: async (task: Omit<Task, "id" | "userId">) => {
    try {
      const { data } = await api.post("/tasks", task);
      return data;
    } catch (error) {
      handleResponseError(error as AxiosError<ErrorResponse>);
    }
  },

  // Function to update an existing task by its ID
  update: async (id: number, task: Partial<Omit<Task, "id" | "userId">>) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, task);
      return data;
    } catch (error) {
      handleResponseError(error as AxiosError<ErrorResponse>);
    }
  },

  // Function to delete a task by its ID
  delete: async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      handleResponseError(error as AxiosError<ErrorResponse>);
    }
  },
};
