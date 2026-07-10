import { DatabaseService } from './DatabaseService';
import {
  Permission,
  Role,
  Department,
  UserPermission,
} from '../types/database.types';

// ------------------------------------------------------------------
// PermissionService - centralised RBAC helper
// ------------------------------------------------------------------

export class PermissionService {
  private db = new DatabaseService();

  /**
   * Fetch all permissions (including inherited) for a given user.
   */
  async getUserPermissions(userId: string): Promise<UserPermission[]> {
    // Direct permissions via roles
    const sql = `
      SELECT p.id, p.key, p.description, p.resource_id, 0 AS inherited
      FROM permissions p
      JOIN role_permission rp ON p.id = rp.permission_id
      JOIN user_role ur ON rp.role_id = ur.role_id
      WHERE ur.user_id = $1
    `;
    const direct = await this.db.query<UserPermission>(sql, [userId]);

    // Inherited permissions via role hierarchy (simple example - assumes a role_parents table)
    const inheritedSql = `
      SELECT p.id, p.key, p.description, p.resource_id, 1 AS inherited
      FROM permissions p
      JOIN role_permission rp ON p.id = rp.permission_id
      JOIN role_hierarchy rh ON rp.role_id = rh.parent_role_id
      JOIN user_role ur ON rh.child_role_id = ur.role_id
      WHERE ur.user_id = $1
    `;
    const inherited = await this.db.query<UserPermission>(inheritedSql, [userId]);

    // Combine and deduplicate by permission id
    const map = new Map<string, UserPermission>();
    direct.concat(inherited).forEach((perm) => {
      const existing = map.get(perm.id);
      if (!existing || (existing && perm.inherited && !existing.inherited)) {
        map.set(perm.id, perm);
      }
    });
    return Array.from(map.values());
  }

  /**
   * Check whether a user has a specific permission.
   * Optionally, match a scoped resource ID (e.g., department ID or document ID).
   */
  async hasPermission(
    userId: string,
    permissionKey: string,
    resourceId?: string,
  ): Promise<boolean> {
    const perms = await this.getUserPermissions(userId);
    return perms.some((p) => {
      if (p.key !== permissionKey) return false;
      if (resourceId && p.resource_id) {
        return p.resource_id === resourceId;
      }
      return true;
    });
  }

  /**
   * Retrieve the full permission set that a role inherits (including its own).
   */
  async inheritPermissions(roleId: string): Promise<Permission[]> {
    const sql = `
      WITH RECURSIVE role_tree AS (
        SELECT id FROM roles WHERE id = $1
        UNION
        SELECT rh.parent_role_id
        FROM role_hierarchy rh
        JOIN role_tree rt ON rh.child_role_id = rt.id
      )
      SELECT DISTINCT p.id, p.key, p.description, p.resource_id
      FROM permissions p
      JOIN role_permission rp ON p.id = rp.permission_id
      JOIN role_tree rt ON rp.role_id = rt.id
    `;
    return this.db.query<Permission>(sql, [roleId]);
  }
}
