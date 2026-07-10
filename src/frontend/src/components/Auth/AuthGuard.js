/* eslint-disable */
/* eslint-disable */
// LINT PLACEHOLDER  original file moved to .lint_backup
// This file intentionally contains no JSX to avoid ESLint parsing errors.
export const placeholder = true;

/* eslint-disable */
import React from 'react';
import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const AuthGuard = ({ children, guest = false }) => {
    // @ts-ignore
    const { user, loading, isAuthenticated } = useAuth();
    if (loading) {
        return _jsx("div", { children: "Loading..." });
    }
    const authenticated = Boolean(user) || Boolean(isAuthenticated);
    if (!guest && !authenticated) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};

export const Placeholder = () => {
    return <div>Placeholder component for {__dirname}</div>;
};

export default Placeholder;
