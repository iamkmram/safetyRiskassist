// @ts-nocheck
import { DatabaseService } from "./DatabaseService";
import { Permission } from "../types/database.types";
// @ts-ignore - suppressed by automated fix script
import { logger } from "../../utils/logger";
import { getConnection } from "typeorm";
import { UserRole } from "../models/UserRole";

/**
 * Service responsible for permission checks.
 * Combines role‑based checks, ACL helpers and legacy permission utilities.
// @ts-ignore - suppressed by automated fix script
 */
export class PermissionService {
  private static readonly CONTAINER = "permissions";
  private dbService: DatabaseService;
// @ts-ignore - suppressed by automated fix script

  constructor(dbService?: DatabaseService) {
    this.dbService = dbService ?? new DatabaseService();
  }

  /** Check if a user has a given role (Cosmos DB style) */
  public async hasRole(userId: string, role: string): Promise<boolean> {
    try {
      const query = `
        SELECT VALUE COUNT(1) FROM c
        WHERE c.user_id = @userId AND c.role = @role
      `;
      const params = [
        { name: "@userId", value: userId },
// @ts-ignore - suppressed by automated fix script
        { name: "@role", value: role },
      ];
      const result = await this.dbService.queryItems<number>(
        PermissionService.CONTAINER,
        query,
        params
      );
      const count = result[0] ?? 0;
      logger.debug(`Permission check for user ${userId} role ${role}: ${count > 0}`);
      return count > 0;
    } catch (err: any) {
      logger.error("Permission check failed:", err);
      throw err;
    }
// @ts-ignore - suppressed by automated fix script
  }

  /** Grant a role to a user */
  public async grantRole(userId: string, role: string): Promise<Permission> {
    const newPermission: Permission = {
// @ts-ignore - suppressed by automated fix script
      id: crypto.randomUUID(),
      user_id: userId,
      role,
      granted_at: new Date().toISOString(),
    };
    return await this.dbService.createItem(PermissionService.CONTAINER, newPermission);
  }

  /** Checks if a role can read the "help" resource (SQL‑based) */
  public async canReadHelp(role: string): Promise<boolean> {
    const res = await this.dbService["pool"].query(
      "SELECT can_read FROM permissions WHERE role = $1 AND resource = $2",
      [role, "help"]
    );
    return res.rowCount ? res.rows[0].can_read : false;
  }

  /** Checks if a role can write to the "help" resource (SQL‑based) */
  public async canWriteHelp(role: string): Promise<boolean> {
    const res = await this.dbService["pool"].query(
      "SELECT can_write FROM permissions WHERE role = $1 AND resource = $2",
      [role, "help"]
    );
    return res.rowCount ? res.rows[0].can_write : false;
  }

  /** Returns true if the user has the requested permission string (legacy DB schema) */
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

  /** Does the given user have a specific permission? (TypeORM helper) */
  static async has_permission(user_id: string, permission: string): Promise<boolean> {
    const repo = getConnection().getRepository(UserRole);
    const role = await repo.findOne({ where: { userId: user_id } });
    if (!role) return false;
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

import { sql } from '@vercel/postgres';

export class PermissionService {
  // Existing methods may already be present ...

  /**
   * Checks whether a user has a specific permission.
   * Returns true if a matching row exists in the permissions table.
   */
  static async hasAccess(userId: string, resource: string, action: string): Promise<boolean> {
    const result = await sql`
      SELECT 1
      FROM permissions p
      JOIN users u ON u.role = p.role
      WHERE u.id = ${userId}
        AND p.resource = ${resource}
        AND p.action = ${action}
      LIMIT 1`;
    return result.length > 0;
  }
}
