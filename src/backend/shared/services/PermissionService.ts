import { DatabaseService } from "./DatabaseService";

/**
 * PermissionService - reads the `permissions` JSON array stored in auth_user.
 */
export class PermissionService {
  /** Returns true if the user has the requested permission string. */
  static async hasPermission(userId: string, permission: string): Promise<boolean> {
    const rows = await DatabaseService.query<{ permissions: string }>(
      "SELECT permissions FROM auth_user WHERE id = ?",
      [userId],
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
