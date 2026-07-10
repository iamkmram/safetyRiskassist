// @ts-nocheck
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface AuthGuardProps {
  children: ReactNode;
  guest?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, guest = false }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (guest) {
    return <>{children}</>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
