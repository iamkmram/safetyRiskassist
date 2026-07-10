/* eslint-disable */
/* eslint-disable */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
export const AuthGuard = ({ children, guest = false, }) => {
    const { user, loading, isAuthenticated } = useAuth();
    // Preserve loading behavior from the original implementation.
    if (loading) {
        return <div>Loading...</div>;
    }
    // Determine authentication status using either `user` or `isAuthenticated`.
    const authenticated = Boolean(user) || Boolean(isAuthenticated);
    // If the route is not for guests and the user is not authenticated, redirect.
    if (!guest && !authenticated) {
        return <Navigate to="/login" replace/>;
    }
    // Otherwise render the protected content.
    return <>{children}</>;
};
// FIXED placeholder minimal valid React component
export const Placeholder = () => {
    return <div>Placeholder component for {__dirname}</div>;
};
export default Placeholder;
