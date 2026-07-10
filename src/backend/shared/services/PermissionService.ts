/**
 * Permission helper that works against the mock user data.
 */

import { MOCK_USERS } from "../models/User";

/**
 * Checks whether a given user (by id) possesses a specific permission string.
 * Returns false if the user cannot be found.
 *
 * @param userId - the identifier of the user (e.g., "user-001")
 * @param permission - permission string such as "knowledge:read"
 */
export function hasPermission(userId: string, permission: string): boolean {
  const user = MOCK_USERS.find((u) => u.id === userId);
  if (!user) {
    return false;
  }
  return user.permissions.includes(permission);
}

/**
 * Determines whether a user role is allowed to view help content.
 * Current implementation permits all roles; future RBAC can extend this.
 * @param user_role Role identifier (e.g., 'admin', 'user')
 */
export const canViewHelp = (user_role: string): boolean => {
  // Placeholder: allow every role for now
  return true;
};
