import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface UserProfileProps {
  /** Optional user id - if omitted, the component will use the loggedin user from the auth context */
  userId?: string;
}

/**
 * Displays the loggedin user's name and department.
 * Handles loading & error states and logs to console for debugging.
 */
const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [name, setName] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const endpoint = userId
          ? `/api/users/${encodeURIComponent(userId)}`
          : '/api/users/me';
        console.log(`[UserProfile] Fetching profile from ${endpoint}`);
        const response = await axios.get(endpoint);
        const { name, department } = response.data;
        setName(name);
        setDepartment(department);
        setLoading(false);
      } catch (err:any) {
        console.error('[UserProfile] Error fetching profile:', err);
        setError(err?.response?.data?.message ?? 'Unable to load profile');
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  if (loading) {
    return <div className="p-4">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold">Welcome, {name}!</h2>
      <p className="text-gray-600">Department: {department}</p>
    </div>
  );
};

export default UserProfile;
