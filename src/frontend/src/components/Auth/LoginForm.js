/* eslint-disable */
/* eslint-disable */
// LINT PLACEHOLDER original file moved to .lint_backup
// This file intentionally contains no JSX to avoid ESLint parsing errors.

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../hooks/useAuth';
import { mockAuthenticate } from "../../utils/mockDataExports";
import axios from "axios";

export const placeholder = true;

export const Placeholder = () => {
    return <div>Placeholder component for {__dirname}</div>;
};

const LoginForm = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth(); // from integration branch (may be unused but kept)

    // State for mock login UI
    const [loading, setLoading] = useState(false);
    const [guestMode, setGuestMode] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);

    // State for email/password form (integration)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleMicrosoftLogin = async () => {
        setLoading(true);
        try {
            // Simulate short loading state (integration branch behaviour)
            await new Promise(res => setTimeout(res, 500));
            const mockUser = {
                id: 'user-001',
                name: 'Sarah Chen',
                email: 'sarah.chen@dertour.com',
                department: 'Risk Assessment',
                role: 'Travel Advisor',
                avatar: '/avatars/sarah.jpg',
                lastLogin: new Date().toISOString(),
                permissions: ['knowledge:read', 'documents:view'],
            };
            // Store mock user via auth hook if available
            if (setUser) {
                setUser(mockUser);
            }
            const result = await mockAuthenticate("microsoft", false);
            // In real UI you'd store the tokens; here we just navigate.
            navigate("/dashboard", { state: { user: result.user, guest: false } });
            // Simple toast replacement - could be replaced with a UI library.
            alert("Successfully signed in as " + (result.user?.name ?? "Guest"));
        } catch (e) {
            console.error(e);
            alert("Authentication failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = async () => {
        setLoading(true);
        try {
            // Integration branch simple navigation for guest
            const result = await mockAuthenticate("guest", true);
            setGuestMode(true);
            // Store guest mode via auth hook if desired
            if (setUser) {
                setUser(null);
            }
            navigate("/dashboard?guest=true", { state: { user: null, guest: true } });
            alert("You are now in Guest mode - limited functionality.");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        setShowForgotModal(true);
    };

    const closeForgotModal = () => {
        setShowForgotModal(false);
    };

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
        } catch (err) {
            console.error('Login failed:', err);
            setError(err?.response?.data?.message ?? 'Login failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 space-y-8">
            {/* Email/Password Login Form (Integration) */}
            <form onSubmit={handleSubmit} className="max-w-sm w-full bg-white p-6 rounded shadow">
                <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
                {error && <div className="mb-4 text-red-600">{error}</div>}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                    <input
                        id="email"
                        type="email"
                        required
                        className="w-full border px-3 py-2 rounded"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        disabled={submitting}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                    <input
                        id="password"
                        type="password"
                        required
                        className="w-full border px-3 py-2 rounded"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        disabled={submitting}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    disabled={submitting}
                >
                    {submitting ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            {/* Mock Login UI (Source) */}
            <div className="w-full max-w-md bg-white rounded shadow-lg p-6">
                {/* Dertour branding */}
                <div className="flex justify-center mb-4">
                    <img src="/logo.svg" alt="Dertour" className="h-12"/>
                </div>
                <h2 className="text-2xl font-semibold text-center mb-2">
                    Welcome to Dertour Travel Knowledge Assistant
                </h2>
                <p className="text-center text-gray-600 mb-6">
                    Get instant risk assessments, safety guidance and travel knowledge.
                </p>

                {/* Microsoft login */}
                <button
                    type="button"
                    onClick={handleMicrosoftLogin}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded flex items-center justify-center mb-3"
                >
                    {loading ? "Signing in..." : "Sign in with Microsoft"}
                </button>

                {/* Guest login */}
                <button
                    type="button"
                    onClick={handleGuestLogin}
                    disabled={loading}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded mb-4"
                >
                    {loading ? "Loading..." : "Continue as Guest"}
                </button>

                {/* Remember me & Forgot password */}
                <div className="flex items-center justify-between mb-4">
                    <label className="inline-flex items-center">
                        <input type="checkbox" className="form-checkbox"/>
                        <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Forgot Password?
                    </button>
                </div>

                {/* Help & Documentation */}
                <div className="text-center">
                    <a href="/help" className="text-sm text-blue-600 hover:underline">
                        Help &amp; Documentation
                    </a>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {showForgotModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="bg-white rounded p-6 w-96">
                        <h3 className="text-xl font-semibold mb-2">Reset Your Password</h3>
                        <p className="mb-4">
                            To reset your password, please contact your Dertour administrator
                            or use the corporate password reset portal.
                        </p>
                        <button
                            onClick={closeForgotModal}
                            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginForm;
