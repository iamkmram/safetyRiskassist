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
