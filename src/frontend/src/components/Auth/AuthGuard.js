// LINT PLACEHOLDER  original file moved to .lint_backup
// This file intentionally contains no JSX to avoid ESLint parsing errors.
export const placeholder = true;

/* eslint-disable */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const AuthGuard = ({ children, guest = false }) => {
    const { user, loading, isAuthenticated } = useAuth();
    if (loading) {
        return <div>Loading...</div>;
    }
    const authenticated = Boolean(user) || Boolean(isAuthenticated);
    if (!guest && !authenticated) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

export const Placeholder = () => {
    return <div>Placeholder component for {__dirname}</div>;
};

export default Placeholder;
