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
import { LoginCredentials } from "../types/auth";
import { useAuth } from "../context/AuthContext";
import { auth } from "../lib/api";

/**
 * LoginForm Component
 *
 * Handles user login, including input validation, API calls, and redirection.
 *
 * @returns {JSX.Element} A styled login form with email and password inputs.
 */
const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic client-side validation
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await auth.login(formData);
      login(data.token);
      router.push("/tasks");
    } catch {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const { email, password } = formData;
    if (!email || !password) {
      setError("Both email and password are required.");
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
        <CardTitle className="text-lg font-semibold">Login</CardTitle>
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
              disabled={isLoading}
              required
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
              disabled={isLoading}
              required
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
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p>Don&apos;t have an account?</p>
          <Button
            variant="link"
            onClick={() => router.push("/auth/register")}
            className="text-blue-600 hover:text-blue-700 transition duration-200"
          >
            Register
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
