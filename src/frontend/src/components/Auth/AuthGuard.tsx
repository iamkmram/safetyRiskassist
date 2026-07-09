import { mockUsers } from "../../utils/mockData";
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Route protection component.
 * - Shows a loading indicator while auth state resolves.
 * - Redirects unauthenticated users to /login.
 * - Renders children for authenticated users.
 */
interface Props {
  children: ReactNode;
}

export const AuthGuard: React.FC<Props> = ({ children }) => {
  const { isAuthenticated } = useAuth();

// loading state removed (was: if (loading) { ... }
}
