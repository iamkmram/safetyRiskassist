// @ts-ignore
import { AuthUser } from "../../types/auth.types";
import { MOCK_USERS } from "../../utils/mockDataExports";
// import { MOCK_USERS, AuthUser } from "../../../backend/shared/models/User";

/**
 * Simple admin UI that lists all mock users with avatar and basic info.
 * This component is intentionally lightweight - it demonstrates the shape
 * of the data without any pagination or actions.
 */
const UserManagement: React.FC = () => {
  const renderUser = (user: AuthUser) => (
    <div
      key={user.id}
      className="flex items-center p-3 border-b border-gray-200 hover:bg-gray-50"
    >
      <img
        src={user.avatar}
        alt={user.name}
        className="h-12 w-12 rounded-full object-cover mr-4"
      />
      <div className="flex-1">
        <p className="font-medium">{user.name}</p>
        <p className="text-sm text-gray-600">{user.email}</p>
        <p className="text-xs text-gray-500">
          {user.role} - {user.department}
        </p>
      </div>
    </div>
  );

  return (
    <section className="max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>
      <div className="bg-white rounded shadow">{MOCK_USERS.map(renderUser)}</div>
    </section>
  );
};

export default UserManagement;
