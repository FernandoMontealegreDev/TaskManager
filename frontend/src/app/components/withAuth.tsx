"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

const withAuth = (WrappedComponent: React.FC) => {
  const AuthenticatedComponent: React.FC = (props) => {
    const router = useRouter();
    const { token, isLoading } = useAuth();

    useEffect(() => {
      // Redirect to login if not authenticated
      if (!isLoading && !token) {
        router.push("/auth/login");
      }
    }, [isLoading, token, router]);

    if (isLoading) {
      return <p>Loading...</p>; // Show loading state while checking auth
    }

    // Render the wrapped component if authenticated
    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
