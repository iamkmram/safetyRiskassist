import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../../../shared/services/AuthService';

/**
 * UserProfile - displays basic information about the authenticated user.
 * Includes error handling and loading state.
 */
const UserProfile: React.FC = () => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const current = await getCurrentUser();
        setUser(current);
      } catch (e) {
        console.error('Failed to fetch user:', e);
        setError('Unable to load user information.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return <div data-testid="profile-loading">Loading...</div>;
  }

  if (error) {
    return <div data-testid="profile-error" style={{ color: 'red' }}>{error}</div>;
  }

  if (!user) {
    return <div data-testid="profile-none">No user data.</div>;
  }

  return (
    <div data-testid="profile-success">
      <h2>User Profile</h2>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
};

export default UserProfile;
