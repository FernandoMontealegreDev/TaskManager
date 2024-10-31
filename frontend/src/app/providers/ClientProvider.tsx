"use client";

import React from "react";
import { AuthProvider } from "../context/AuthContext";

/**
 * ClientProvider component that wraps its children with the AuthProvider.
 * It ensures that the child components are rendered only after the client has mounted,
 * preventing discrepancies between server-side and client-side rendering.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be rendered
 * @returns {JSX.Element} The rendered ClientProvider component
 */
export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Set mounted to true after the component has mounted
    setMounted(true);
  }, []);

  return (
    <AuthProvider>
      {/* Ensure that child content is consistent during SSR */}
      {mounted ? children : null}
    </AuthProvider>
  );
}
