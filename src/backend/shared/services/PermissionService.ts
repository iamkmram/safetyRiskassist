import { DatabaseService } from "./DatabaseService";
import {
  Permission,
  Role,
  Department,
  UserPermission,
} from "../types/database.types";
import { logger } from "../../utils/logger";
import { getConnection } from "typeorm";
import { UserRole } from "../models/UserRole";
import { sql } from "@vercel/postgres";

/**
 * Service responsible for permission checks.
 * Combines role‑based checks, ACL helpers, legacy permission utilities,
 * and advanced RBAC queries.
 */
export class PermissionService {
  private static readonly CONTAINER = "permissions";
  private dbService: DatabaseService;
  private db = new DatabaseService();

  constructor(dbService?: DatabaseService) {
    this.dbService = dbService ?? new DatabaseService();
  }

  // ------------------------------------------------------------------
  // Instance methods – role/SQL based checks (Cosmos DB & PostgreSQL)
  // ------------------------------------------------------------------

  /** Check if a user has a given role (Cosmos DB style) */
  public async hasRole(userId: string, role: string): Promise<boolean> {
    try {
      const query = `
        SELECT VALUE COUNT(1) FROM c
        WHERE c.user_id = @userId AND c.role = @role
      `;
      const params = [
        { name: "@userId", value: userId },
        { name: "@role", value: role },
      ];
      const result = await this.dbService.queryItems<number>(
        PermissionService.CONTAINER,
        query,
        params
      );
      const count = result[0] ?? 0;
      logger.debug(
        `Permission check for user ${userId} role ${role}: ${count > 0}`
      );
      return count > 0;
    } catch (err: any) {
      logger.error("Permission check failed:", err);
      throw err;
    }
  }

  /** Grant a role to a user */
  public async grantRole(userId: string, role: string): Promise<Permission> {
    const newPermission: Permission = {
      id: crypto.randomUUID(),
      user_id: userId,
      role,
      granted_at: new Date().toISOString(),
    };
    return await this.dbService.createItem(
      PermissionService.CONTAINER,
      newPermission
    );
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

  // ------------------------------------------------------------------
  // Advanced RBAC helpers (new functionality)
  // ------------------------------------------------------------------

  /**
   * Fetch all permissions (including inherited) for a given user.
   */
  async getUserPermissions(userId: string): Promise<UserPermission[]> {
    // Direct permissions via roles
    const directSql = `
      SELECT p.id, p.key, p.description, p.resource_id, 0 AS inherited
      FROM permissions p
      JOIN role_permission rp ON p.id = rp.permission_id
      JOIN user_role ur ON rp.role_id = ur.role_id
      WHERE ur.user_id = $1
    `;
    const direct = await this.db.query<UserPermission>(directSql, [userId]);

    // Inherited permissions via role hierarchy
    const inheritedSql = `
      SELECT p.id, p.key, p.description, p.resource_id, 1 AS inherited
      FROM permissions p
      JOIN role_permission rp ON p.id = rp.permission_id
      JOIN role_hierarchy rh ON rp.role_id = rh.parent_role_id
      JOIN user_role ur ON rh.child_role_id = ur.role_id
      WHERE ur.user_id = $1
    `;
    const inherited = await this.db.query<UserPermission>(inheritedSql, [
      userId,
    ]);

    // Combine and deduplicate by permission id
    const map = new Map<string, UserPermission>();
    direct.concat(inherited).forEach((perm) => {
      const existing = map.get(perm.id);
      if (!existing || (perm.inherited && !existing.inherited)) {
        map.set(perm.id, perm);
      }
    });
    return Array.from(map.values());
  }

  /**
   * Check whether a user has a specific permission.
   * Falls back to legacy permission schema if necessary.
   */
  async hasPermission(
    userId: string,
    permissionKey: string,
    resourceId?: string
  ): Promise<boolean> {
    // First, attempt the modern RBAC check
    const perms = await this.getUserPermissions(userId);
    const modernMatch = perms.some((p) => {
      if (p.key !== permissionKey) return false;
      if (resourceId && p.resource_id) {
        return p.resource_id === resourceId;
      }
      return true;
    });
    if (modernMatch) {
      return true;
    }

    // Legacy fallback: permissions stored as JSON in auth_user table
    const rows = await DatabaseService.query<{ permissions: string }>(
      "SELECT permissions FROM auth_user WHERE id = ?",
      [userId]
    );
    if (rows.length === 0) {
      return false;
    }
    try {
      const permsLegacy: string[] = JSON.parse(rows[0].permissions);
      return permsLegacy.includes(permissionKey);
    } catch {
      return false;
    }
  }

  /**
   * Retrieve the full permission set that a role inherits (including its own).
   */
  async inheritPermissions(roleId: string): Promise<Permission[]> {
    const sqlQuery = `
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
    return this.db.query<Permission>(sqlQuery, [roleId]);
  }

  // ------------------------------------------------------------------
  // Static helpers – legacy / TypeORM utilities
  // ------------------------------------------------------------------

  /** Returns true if the user has the requested permission string (legacy DB schema) */
  static async hasPermissionLegacy(
    userId: string,
    permission: string
  ): Promise<boolean> {
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
  static async has_permission(
    user_id: string,
    permission: string
  ): Promise<boolean> {
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

  /**
   * Checks whether a user has a specific permission.
   * Returns true if a matching row exists in the permissions table.
   */
  static async hasAccess(
    userId: string,
    resource: string,
    action: string
  ): Promise<boolean> {
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
