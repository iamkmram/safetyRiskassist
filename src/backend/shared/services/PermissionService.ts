import { DatabaseService } from "./DatabaseService";
import type { Permission } from "../types/database.types";

/**
 * Permission helper that works against the mock user data.
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
 * PermissionService - provides various permission checks against the database.
 */
export class PermissionService {
  private db: DatabaseService;

  constructor() {
    this.db = new DatabaseService();
  }

  /**
   * Checks if a role can read the "help" resource.
   */
  async canReadHelp(role: string): Promise<boolean> {
    const res = await this.db["pool"].query(
      "SELECT can_read FROM permissions WHERE role = $1 AND resource = $2",
      [role, "help"]
    );
    return res.rowCount ? res.rows[0].can_read : false;
  }

  /**
   * Checks if a role can write to the "help" resource.
   */
  async canWriteHelp(role: string): Promise<boolean> {
    const res = await this.db["pool"].query(
      "SELECT can_write FROM permissions WHERE role = $1 AND resource = $2",
      [role, "help"]
    );
    return res.rowCount ? res.rows[0].can_write : false;
  }

  /**
   * Returns true if the user has the requested permission string.
   */
  static async hasPermission(userId: string, permission: string): Promise<boolean> {
    const rows = await DatabaseService.query<{ permissions: string }>(
      "SELECT permissions FROM auth_user WHERE id = ?",
      [userId]
    );
    if (rows.length === 0) {
      return false;
    }
    try {
      const perms: string[] = JSON.parse(rows[0].permissions);
      return perms.includes(permission);
    } catch {
      return false;
    }
  }
}
