import { DatabaseService } from './DatabaseService';

/**
 * Service that encapsulates permissionrelated queries.
 */
export class PermissionService {
  private static db = DatabaseService.getInstance();

  /**
   * Returns an array of permission names granted to a user.
   */
  public static async getUserPermissions(userId: string): Promise<string[]> {
    const query = `
      SELECT p.name
      FROM permissions p
      JOIN user_permissions up ON up.permission_id = p.id
      WHERE up.user_id = $1
    `;
    try {
      const result = await this.db.query<{ name: string }>(query, [userId]);
      return result.rows.map((row) => row.name);
    } catch (err) {
      console.error('Failed to load permissions for user', userId, err);
      return []; // Failsafe: treat as no permissions
    }
  }

  /**
   * Checks whether a user has a specific permission.
   */
  public static async userHasPermission(userId: string, permission: string): Promise<boolean> {
    const perms = await this.getUserPermissions(userId);
    return perms.includes(permission);
  }
}
