"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../components/ui/button";
import Input from "../components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { RegisterCredentials } from "../types/auth";
import { useAuth } from "../context/AuthContext";
import { auth } from "../lib/api";

/**
 * Error type expected from the auth.register function.
 */
interface AuthError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

/**
 * RegisterForm Component
 *
 * Renders a form for user registration, including fields for name, email, and password.
 * Utilizes `auth.register` for registration and `login` from the `AuthContext` for authentication
 * and redirects to the tasks page upon successful registration.
 *
 * @returns {JSX.Element} A responsive registration form component.
 */
const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState<RegisterCredentials>({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Handles form submission, including registration and redirection
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate the form before submission
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await auth.register(formData);
      login(data.token);
      router.push("/tasks");
    } catch (error) {
      const authError = error as AuthError; // Type assertion
      setError(
        authError.response?.data?.message ||
          "Error registering. Please try again."
      ); // Display specific error message if available
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const { email, password, name } = formData;

    if (!name || !email || !password) {
      setError("All fields are required.");
      return false;
    }

    // Simple regex for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    setError(""); // Clear error if validation passes
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Register</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              aria-invalid={!!error}
              aria-describedby="name-error"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              aria-invalid={!!error}
              aria-describedby="email-error"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              aria-invalid={!!error}
              aria-describedby="password-error"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition duration-200 ease-in-out"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </form>

        {/* Legend for already registered users */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already registered?{" "}
            <button
              onClick={() => router.push("/auth/login")}
              className="text-blue-600 hover:underline"
            >
              Login here.
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
