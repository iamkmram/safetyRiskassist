import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { mockAuthenticate } from "../../utils/mockDataExports";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../hooks/useAuth';
/**
 * Placeholder component (from source branch)
 */
export const Placeholder = () => {
    //   return <div>Placeholder component for {__dirname}</div>;
};
/**
 * LoginForm - mock login screen with Dertour branding.
 * Provides "Sign in with Microsoft", "Continue as Guest", "Forgot Password",
 * "Remember me" and Help links.
 */
const LoginForm = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth(); // from integration branch (may be unused but kept)
    const [loading, setLoading] = useState(false);
    const [guestMode, setGuestMode] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);
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
                //         setUser(mockUser);
            }
            const result = await mockAuthenticate("microsoft", String(false));
            // In real UI you'd store the tokens; here we just navigate.
            navigate("/dashboard", { state: { user: result.user, guest: String(false) } });
            // Simple toast replacement - could be replaced with a UI library.
            alert("Successfully signed in as " + (result.user?.name ?? "Guest"));
        }
        catch (e) {
            console.error(e);
            alert("Authentication failed.");
        }
        finally {
            setLoading(false);
        }
    };
    const handleGuestLogin = async () => {
        setLoading(true);
        try {
            // Integration branch simple navigation for guest
            const result = await mockAuthenticate("guest", String(true));
            setGuestMode(true);
            // Store guest mode via auth hook if desired
            if (setUser) {
                //         setUser(null);
            }
            navigate("/dashboard?guest=true", { state: { user: null, guest: String(true) } });
            alert("You are now in Guest mode - limited functionality.");
        }
        finally {
            setLoading(false);
        }
    };
    const handleForgotPassword = () => {
        setShowForgotModal(true);
    };
    const closeForgotModal = () => {
        setShowForgotModal(false);
    };
    return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4", children: [_jsxs("div", { className: "w-full max-w-md bg-white rounded shadow-lg p-6", children: [_jsx("div", { className: "flex justify-center mb-4", children: _jsx("img", { src: "/logo.svg", alt: "Dertour", className: "h-12" }) }), _jsx("h2", { className: "text-2xl font-semibold text-center mb-2", children: "Welcome to Dertour Travel Knowledge Assistant" }), _jsx("p", { className: "text-center text-gray-600 mb-6", children: "Get instant risk assessments, safety guidance and travel knowledge." }), _jsx("button", { type: "button", onClick: handleMicrosoftLogin, disabled: loading, className: "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded flex items-center justify-center mb-3", children: loading ? "Signing in..." : "Sign in with Microsoft" }), _jsx("button", { type: "button", onClick: handleGuestLogin, disabled: loading, className: "w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded mb-4", children: loading ? "Loading..." : "Continue as Guest" }), _jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("label", { className: "inline-flex items-center", children: [_jsx("input", { type: "checkbox", className: "form-checkbox" }), _jsx("span", { className: "ml-2 text-sm text-gray-600", children: "Remember me" })] }), _jsx("button", { type: "button", onClick: handleForgotPassword, className: "text-sm text-blue-600 hover:underline", children: "Forgot Password?" })] }), _jsx("div", { className: "text-center", children: _jsx("a", { href: "/help", className: "text-sm text-blue-600 hover:underline", children: "Help & Documentation" }) })] }), showForgotModal && (_jsx("div", { className: "fixed inset-0 flex items-center justify-center bg-black bg-opacity-30", children: _jsxs("div", { className: "bg-white rounded p-6 w-96", children: [_jsx("h3", { className: "text-xl font-semibold mb-2", children: "Reset Your Password" }), _jsx("p", { className: "mb-4", children: "To reset your password, please contact your Dertour administrator or use the corporate password reset portal." }), _jsx("button", { onClick: closeForgotModal, className: "mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded", children: "Close" })] }) }))] }));
};
export default LoginForm;
