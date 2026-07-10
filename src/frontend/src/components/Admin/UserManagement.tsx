// @ts-ignore
import React, { useEffect, useState } from 'react';
// import { fetchAllUsers, deleteUser } from '../../../shared/services/AdminService';

/**
 * UserManagement - simple admin UI to list and delete users.
 * Demonstrates input validation, error handling and logging.
 */
const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<Array<{ id: string; email: string }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (e) {
      console.error('Error loading users:', e);
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (e) {
      console.error('Delete error:', e);
      setError('Unable to delete user.');
    }
  };

  if (loading) return <div data-testid="admin-loading">Loading users...</div>;
  if (error) return <div data-testid="admin-error" style={{ color: 'red' }}>{error}</div>;

  return (
    <div data-testid="admin-users">
      <h2>User Management</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.email}</td>
                <td>
                  <button onClick={() => handleDelete(u.id)} data-testid={`delete-${u.id}`}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManagement;
