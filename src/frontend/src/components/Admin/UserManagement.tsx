import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../../services/api';
import './UserManagement.css';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchUsers();
// @ts-ignore
        setUsers(data.users);
      } catch (err) {
        console.error('Failed to fetch users', err);
      }
    };
    load();
  }, []);

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Department</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td><td>{u.email}</td><td>{u.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
