import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Both email and password are required.');
            return;
        }
        setSubmitting(true);
        try {
            const resp = await axios.post('/api/auth/login', { email, password });
            const { token, user } = resp.data;
            // Store token securely - example using localStorage (replace with your auth store)
            localStorage.setItem('authToken', token);
            localStorage.setItem('userInfo', JSON.stringify(user));
            navigate('/dashboard');
        }
        catch (err) {
            console.error('Login failed:', err);
            setError(err?.response?.data?.message ?? 'Login failed. Please try again.');
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "max-w-sm mx-auto p-6 bg-white rounded shadow", children: [_jsx("h2", { className: "text-2xl font-bold mb-4 text-center", children: "Sign In" }), error && _jsx("div", { className: "mb-4 text-red-600", children: error }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium mb-1", children: "Email" }), _jsx("input", { id: "email", type: "email", required: true, className: "w-full border px-3 py-2 rounded", value: email, onChange: e => setEmail(e.target.value), disabled: submitting })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium mb-1", children: "Password" }), _jsx("input", { id: "password", type: "password", required: true, className: "w-full border px-3 py-2 rounded", value: password, onChange: e => setPassword(e.target.value), disabled: submitting })] }), _jsx("button", { type: "submit", className: "w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50", disabled: submitting, children: submitting ? 'Signing in...' : 'Sign In' })] }));
};
export default LoginForm;
