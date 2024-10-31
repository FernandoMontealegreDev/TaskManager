"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Button from "./ui/button";
import { useAuth } from "../context/AuthContext";

/**
 * Navbar Component
 *
 * Renders the main navigation bar with conditional login/logout functionality.
 * If the user is authenticated, clicking the title navigates to the tasks page.
 *
 * @returns {JSX.Element} A responsive navigation bar component.
 */
const Navbar: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, logout, isLoading } = useAuth();

  // Handle logout and redirect to login page
  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  // Redirect to tasks page if authenticated when title is clicked
  const handleTitleClick = () => {
    if (isAuthenticated) {
      router.push("/tasks");
    }
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <h1
            className={`text-xl font-bold ${
              isAuthenticated ? "cursor-pointer" : ""
            }`}
            onClick={handleTitleClick}
          >
            Task Manager
          </h1>
          {/* Show the Logout button only when the user is authenticated and loading is complete */}
          {!isLoading && isAuthenticated && (
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="flex items-center text-red-600 hover:text-red-700"
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
