import { getConnection } from "typeorm";
import { UserRole } from "../models/UserRole";

/**
 * PermissionService - tiny helper around role checking.
 * In a production app you would have a full ACL system.
 */
export class PermissionService {
  /** Does the given user have a specific permission? */
  static async has_permission(user_id: string, permission: string): Promise<boolean> {
    const repo = getConnection().getRepository(UserRole);
    const role = await repo.findOne({ where: { userId: user_id } });
    if (!role) return false;
    // Simple mapping - extend as needed
    const rolePermissions: Record<string, string[]> = {
      admin: ["admin_settings", "view_all"],
      user: ["view_own"],
    };
    const perms = rolePermissions[role.role] || [];
    return perms.includes(permission);
  }

  /** Helper used by the frontend to quickly know if a user is admin */
  static async is_admin(user_id: string): Promise<boolean> {
    const repo = getConnection().getRepository(UserRole);
    const role = await repo.findOne({ where: { userId: user_id } });
    return role?.role === "admin";
  }
}
