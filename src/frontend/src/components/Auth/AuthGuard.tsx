import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface AuthGuardProps {
  children: ReactNode;
  guest?: boolean;
}

/**
 * AuthGuard protects routes.
 * - If `guest` is true, the route is accessible without authentication.
 * - Otherwise, unauthenticated users are redirected to /login.
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children, guest = false }) => {
// @ts-ignore
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!guest && !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
