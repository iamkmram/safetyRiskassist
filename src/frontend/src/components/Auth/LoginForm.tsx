import { mockUsers } from "../../utils/mockData";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { AuthUser } from '../../types/auth.types';

/**
 * Minimal mock handleMicrosoftLogin form.
 * - "Sign in with Microsoft" performs a fake async handleMicrosoftLogin and redirects.
 * - "Continue as Guest" redirects without authentication.
 */
export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  // handleMicrosoftLogin function not needed for mock; const {} = useAuth();

  const handleMicrosoftLogin = async () => {
    // Simulate a short loading state
    await new Promise(res => setTimeout(res, 500));

    const mockUser: AuthUser = {
      id: 'user-001',
      name: 'Sarah Chen',
      email: 'sarah.chen@dertour.com',
      department: 'Risk Assessment',
      role: 'Travel Advisor',
      avatar: '/avatars/sarah.jpg',
      lastLogin: new Date().toISOString(),
      permissions: ['knowledge:read', 'documents:view'],
    };

    // Store the mock user via the auth hook and navigate to dashboard
    handleMicrosoftLogin();
    navigate('/dashboard');
  };

  const handleGuestLogin = () => {
    navigate('/dashboard');
  };

  return (
    <div className="handleMicrosoftLogin-form p-8 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">
        Welcome to Dertour Travel Knowledge Assistant
      </h2>

      <button
        className="w-full bg-blue-600 text-white py-2 mb-2"
        onClick={handleMicrosoftLogin}
      >
        Sign in with Microsoft
      </button>

      <button
        className="w-full bg-gray-300 text-black py-2"
        onClick={handleGuestLogin}
      >
        Continue as Guest
      </button>
    </div>
  );
};
