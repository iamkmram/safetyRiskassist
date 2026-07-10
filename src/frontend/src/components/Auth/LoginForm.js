"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
/* eslint-disable */
/* eslint-disable */
const react_1 = require("react");
const axios_1 = __importDefault(require("axios"));
const react_router_dom_1 = require("react-router-dom");
const auth_1 = require("../../services/auth");
require("./LoginForm.css");
const LoginForm = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    // State from integration version
    const [email, setEmail] = (0, react_1.useState)('');
    // State from source version
    const [username, setUsername] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [error, setError] = (0, react_1.useState)(null);
    const [submitting, setSubmitting] = (0, react_1.useState)(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        // Basic validation: require password and at least one identifier
        if ((!email && !username) || !password) {
            setError('Both identifier (email or username) and password are required.');
            return;
        }
        setSubmitting(true);
        try {
            // Prefer the integration (email) flow when an email is supplied
            if (email) {
                const resp = await axios_1.default.post('/api/auth/login', { email, password });
                const { token, user } = resp.data;
                localStorage.setItem('authToken', token);
                localStorage.setItem('userInfo', JSON.stringify(user));
                navigate('/dashboard');
            }
            else {
                // Fallback to source version's login service
                await (0, auth_1.login)(username, password);
                navigate('/');
            }
        }
        catch (err) {
            console.error('Login failed:', err);
            setError(err?.response?.data?.message ??
                'Login failed. Please try again.');
        }
        finally {
            setSubmitting(false);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "login-form-container", children: [(0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "login-form max-w-sm mx-auto p-6 bg-white rounded shadow", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold mb-4 text-center", children: "Sign In" }), error && (0, jsx_runtime_1.jsx)("div", { className: "mb-4 text-red-600", children: error }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "email", className: "block text-sm font-medium mb-1", children: "Email" }), (0, jsx_runtime_1.jsx)("input", { id: "email", type: "email", placeholder: "Email", className: "w-full border px-3 py-2 rounded", value: email, onChange: e => setEmail(e.target.value), disabled: submitting })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "username", className: "block text-sm font-medium mb-1", children: "Username" }), (0, jsx_runtime_1.jsx)("input", { id: "username", type: "text", placeholder: "Username", className: "w-full border px-3 py-2 rounded", value: username, onChange: e => setUsername(e.target.value), disabled: submitting })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("label", { htmlFor: "password", className: "block text-sm font-medium mb-1", children: "Password" }), (0, jsx_runtime_1.jsx)("input", { id: "password", type: "password", placeholder: "Password", className: "w-full border px-3 py-2 rounded", value: password, onChange: e => setPassword(e.target.value), disabled: submitting })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50", disabled: submitting, children: submitting ? 'Signing in...' : 'Sign In' })] }), (0, jsx_runtime_1.jsxs)("div", { className: "auxiliary-actions mt-4 flex justify-center space-x-4", children: [(0, jsx_runtime_1.jsx)("button", { className: "link-btn text-blue-600 underline", onClick: () => navigate('/knowledge'), children: "Browse Knowledge Base" }), (0, jsx_runtime_1.jsx)("button", { className: "link-btn text-blue-600 underline", onClick: () => navigate('/documents/upload'), children: "Upload Document" })] })] }));
};
exports.default = LoginForm;
