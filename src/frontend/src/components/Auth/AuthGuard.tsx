 
 
 
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { mockUsers } from '../../utils/mockData';

// AuthGuard protects routes.
// - Shows a loading indicator while auth state resolves.
// - If `guest` is true, the route is accessible without authentication.
// - Otherwise, unauthenticated users are redirected to /login.
// - Renders children for authenticated users.
interface AuthGuardProps {
  children: ReactNode;
  guest?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  guest = false,
}) => {
  // @ts-ignore
  const { user, loading, isAuthenticated } = useAuth();

  // Preserve loading behavior from the original implementation.
  if (loading) {
    return <div>Loading...</div>;
  }

  // Determine authentication status using either `user` or `isAuthenticated`.
  const authenticated = Boolean(user) || Boolean(isAuthenticated);

  // If the route is not for guests and the user is not authenticated, redirect.
  if (!guest && !authenticated) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise render the protected content.
  return <>{children}</>;
};

// FIXED placeholder minimal valid React component
export const Placeholder = () => {
  // Combine placeholder outputs from both versions
  return <div>Placeholder component for {__dirname}{'.'}</div>;
};

export default Placeholder;
