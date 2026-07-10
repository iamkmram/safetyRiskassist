"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Placeholder = exports.AuthGuard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const useAuth_1 = require("../../hooks/useAuth");
const AuthGuard = ({ children, guest = false, }) => {
    // @ts-ignore
    const { user, loading, isAuthenticated } = (0, useAuth_1.useAuth)();
    // Preserve loading behavior from the original implementation.
    if (loading) {
        return (0, jsx_runtime_1.jsx)("div", { children: "Loading..." });
    }
    // Determine authentication status using either `user` or `isAuthenticated`.
    const authenticated = Boolean(user) || Boolean(isAuthenticated);
    // If the route is not for guests and the user is not authenticated, redirect.
    if (!guest && !authenticated) {
        return (0, jsx_runtime_1.jsx)(react_router_dom_1.Navigate, { to: "/login", replace: true });
    }
    // Otherwise render the protected content.
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
};
exports.AuthGuard = AuthGuard;
// FIXED placeholder minimal valid React component
const Placeholder = () => {
    // Combine placeholder outputs from both versions
    return (0, jsx_runtime_1.jsxs)("div", { children: ["Placeholder component for ", __dirname, '.'] });
};
exports.Placeholder = Placeholder;
exports.default = exports.Placeholder;
