/* eslint-disable */
/* eslint-disable */
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/auth';
import './LoginForm.css';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();

  // State from integration version
  const [email, setEmail] = useState<string>('');
  // State from source version
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
        const resp = await axios.post('/api/auth/login', { email, password });
        const { token, user } = resp.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userInfo', JSON.stringify(user));
        navigate('/dashboard');
      } else {
        // Fallback to source version's login service
        await login(username, password);
        navigate('/');
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(
        err?.response?.data?.message ??
          'Login failed. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit} className="login-form max-w-sm mx-auto p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}

        {/* Email field (integration version) */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={submitting}
          />
        </div>

        {/* Username field (source version) */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            className="w-full border px-3 py-2 rounded"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={submitting}
          />
        </div>

        {/* Password field (common) */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
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

      <div className="auxiliary-actions mt-4 flex justify-center space-x-4">
        <button
          className="link-btn text-blue-600 underline"
          onClick={() => navigate('/knowledge')}
        >
          Browse Knowledge Base
        </button>
        <button
          className="link-btn text-blue-600 underline"
          onClick={() => navigate('/documents/upload')}
        >
          Upload Document
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
