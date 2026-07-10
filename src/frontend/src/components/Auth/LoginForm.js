import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/auth';
import './LoginForm.css';
export const LoginForm = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/');
        }
        catch (err) {
            setError('Invalid credentials');
        }
    };
    return (_jsxs("div", { className: "login-form-container", children: [_jsxs("form", { onSubmit: handleSubmit, className: "login-form", children: [_jsx("h2", { children: "Sign In" }), error && _jsx("div", { className: "error", children: error }), _jsx("input", { type: "text", placeholder: "Username", value: username, onChange: e => setUsername(e.target.value), required: true }), _jsx("input", { type: "password", placeholder: "Password", value: password, onChange: e => setPassword(e.target.value), required: true }), _jsx("button", { type: "submit", children: "Login" })] }), _jsxs("div", { className: "auxiliary-actions", children: [_jsx("button", { className: "link-btn", onClick: () => navigate('/knowledge'), children: "Browse Knowledge Base" }), _jsx("button", { className: "link-btn", onClick: () => navigate('/documents/upload'), children: "Upload Document" })] })] }));
};
export default LoginForm;
