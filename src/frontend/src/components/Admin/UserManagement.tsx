import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '../../types'; // Adjust import based on your project alias

interface UserManagementProps {}

const UserManagement: React.FC<UserManagementProps> = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchUsers = async () => {
    try {
      const resp = await axios.get<User[]>('/api/admin/users');
      setUsers(resp.data);
      setLoading(false);
    } catch (err:any) {
      console.error('Failed to fetch users:', err);
      setError(err?.response?.data?.message ?? 'Unable to load users');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deactivateUser = async (userId: string) => {
    if (!window.confirm('Deactivate this user?')) return;
    try {
      await axios.post(`/api/admin/users/${encodeURIComponent(userId)}/deactivate`);
      setUsers(prev => prev.map(u => (u.id === userId ? { ...u, active: false } : u)));
    } catch (err) {
      console.error('Deactivation failed:', err);
      alert('Failed to deactivate user.');
    }
  };

  if (loading) return <div className="p-4">Loading users...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="p-4 bg-gray-50 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Department</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-b">
              <td className="py-2 px-4">{u.name}</td>
              <td className="py-2 px-4">{u.email}</td>
              <td className="py-2 px-4">{u.department ?? '--'}</td>
              <td className="py-2 px-4">{u.active ? 'Active' : 'Inactive'}</td>
              <td className="py-2 px-4">
                {u.active && (
                  <button
                    className="text-sm text-red-600 hover:underline"
                    onClick={() => deactivateUser(u.id)}
                  >
                    Deactivate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
