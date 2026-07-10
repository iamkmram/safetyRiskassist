import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
export const AuthGuard = ({ children, guest = false, }) => {
    const { user, loading, isAuthenticated } = useAuth();
    // Preserve loading behavior from the original implementation.
    if (loading) {
        return _jsx("div", { children: "Loading..." });
    }
    // Determine authentication status using either `user` or `isAuthenticated`.
    const authenticated = Boolean(user) || Boolean(isAuthenticated);
    // If the route is not for guests and the user is not authenticated, redirect.
    if (!guest && !authenticated) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    // Otherwise render the protected content.
    return _jsx(_Fragment, { children: children });
};
// FIXED placeholder minimal valid React component
export const Placeholder = () => {
    //   return <div>Placeholder component for {__dirname}</div>;
};
export default Placeholder;
