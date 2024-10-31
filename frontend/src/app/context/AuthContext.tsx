import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  login: (token: string) => void;
  logout: () => void;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (storedToken) {
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    setToken(token);
    // Use secure cookies for sensitive data (adjust as necessary)
    document.cookie = `token=${token}; path=/; secure; samesite=strict;`;
  };

  const logout = () => {
    setToken(null);
    document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  };

  return (
    <AuthContext.Provider
      value={{ login, logout, token, isAuthenticated: !!token, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
