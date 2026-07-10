import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../../services/api';
import { User } from '../../types/api.types';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setUser(data);
      } catch (e: any) {
        setError(e.message ?? 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!user) return <div>No user data.</div>;

  return (
    <div className="user-profile">
      <h2>{user.username}'s Profile</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Department:</strong> {user.department?.name ?? 'N/A'}</p>
      <p><strong>Roles:</strong> {user.roles?.map(r => r.name).join(', ') ?? 'None'}</p>
    </div>
  );
};

export default UserProfile;
