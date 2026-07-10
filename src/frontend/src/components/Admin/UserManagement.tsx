import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '../../types';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Placeholder fetch - replace URL with real endpoint
//         const response = await axios.get<User[]>('/api/users');
//         setUsers(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error('Failed to fetch users:', err);
//         setError(err?.response?.data?.message ?? 'Unable to load users');
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {users.map(u => (
        <li key={u.id}>{u.name} ({u.email})</li>
      ))}
    </ul>
  );
};

export default UserManagement;
