import React from "react";
import { AuthUser } from "../../types/auth.types";
import { MOCK_USERS } from "../../utils/mockDataExports";

export const Placeholder = () => {
  return <div>Placeholder component for ${__dirname}</div>;
};

/**
 * Simple admin table that lists the three mock users.
 * The Delete button calls a placeholder PermissionService method.
 */
interface MockUser {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  avatar: string;
}

const mockUsers: MockUser[] = [
  {
    id: "user-001",
    name: "Sarah Chen",
    email: "sarah.chen@dertour.com",
    department: "Risk Assessment",
    role: "Travel Advisor",
    avatar: "/avatars/sarah.jpg",
  },
  {
    id: "user-002",
    name: "Marcus Weber",
    email: "marcus.weber@dertour.com",
    department: "Operations",
    role: "Senior Manager",
    avatar: "/avatars/marcus.jpg",
  },
  {
    id: "user-003",
    name: "Emma Schneider",
    email: "emma.schneider@dertour.com",
    department: "Customer Service",
    role: "Travel Specialist",
    avatar: "/avatars/emma.jpg",
  },
];

export const UserManagement: React.FC = () => {
  const handleDelete = async (userId: string) => {
    // Placeholder call - in a real app this would invoke an API endpoint.
    // const hasPermission = await PermissionService.hasPermission(userId, "admin:delete_user");
    const hasPermission = true;
    if (hasPermission) {
      // toast.success(`User ${userId} would be deleted (mock)`);
    } else {
      // toast.error("You do not have permission to delete users");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">User Management</h2>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Avatar</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Department</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="p-2 border">
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
              </td>
              <td className="p-2 border">{user.name}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">{user.department}</td>
              <td className="p-2 border">{user.role}</td>
              <td className="p-2 border">
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Placeholder;
