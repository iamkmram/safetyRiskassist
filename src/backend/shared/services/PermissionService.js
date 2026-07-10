"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionService = void 0;
// @ts-nocheck
const DatabaseService_1 = require("./DatabaseService");
const logger_1 = require("../../utils/logger");
const typeorm_1 = require("typeorm");
/**
 * Service responsible for permission checks.
 * Combines role‑based checks, ACL helpers and legacy permission utilities.
 */
class PermissionService {
    constructor(dbService) {
        this.dbService = dbService ?? new DatabaseService_1.DatabaseService();
    }
    /** Check if a user has a given role (Cosmos DB style) */
    async hasRole(userId, role) {
        try {
            const query = `
        SELECT VALUE COUNT(1) FROM c
        WHERE c.user_id = @userId AND c.role = @role
      `;
            const params = [
                { name: "@userId", value: userId },
                { name: "@role", value: role },
            ];
            const result = await this.dbService.queryItems(PermissionService.CONTAINER, query, params);
            const count = result[0] ?? 0;
            logger_1.logger.debug(`Permission check for user ${userId} role ${role}: ${count > 0}`);
            return count > 0;
        }
        catch (err) {
            logger_1.logger.error("Permission check failed:", err);
            throw err;
        }
    }
    /** Grant a role to a user */
    async grantRole(userId, role) {
        const newPermission = {
            id: crypto.randomUUID(),
            user_id: userId,
            role,
            granted_at: new Date().toISOString(),
        };
        return await this.dbService.createItem(PermissionService.CONTAINER, newPermission);
    }
    /** Checks if a role can read the "help" resource (SQL‑based) */
    async canReadHelp(role) {
        const res = await this.dbService["pool"].query("SELECT can_read FROM permissions WHERE role = $1 AND resource = $2", [role, "help"]);
        return res.rowCount ? res.rows[0].can_read : false;
    }
    /** Checks if a role can write to the "help" resource (SQL‑based) */
    async canWriteHelp(role) {
        const res = await this.dbService["pool"].query("SELECT can_write FROM permissions WHERE role = $1 AND resource = $2", [role, "help"]);
        return res.rowCount ? res.rows[0].can_write : false;
    }
    /** Returns true if the user has the requested permission string (legacy DB schema) */
    static async hasPermission(userId, permission) {
        const rows = await DatabaseService_1.DatabaseService.query("SELECT permissions FROM auth_user WHERE id = ?", [userId]);
        if (rows.length === 0) {
            return false;
        }
        try {
            const perms = JSON.parse(rows[0].permissions);
            return perms.includes(permission);
        }
        catch {
            return false;
        }
    }
    /** Does the given user have a specific permission? (TypeORM helper) */
    static async has_permission(user_id, permission) {
        const repo = (0, typeorm_1.getConnection)().getRepository(UserRole_1.UserRole);
        const role = await repo.findOne({ where: { userId: user_id } });
        if (!role)
            return false;
        const rolePermissions = {
            admin: ["admin_settings", "view_all"],
            user: ["view_own"],
        };
        const perms = rolePermissions[role.role] || [];
        return perms.includes(permission);
    }
    /** Helper used by the frontend to quickly know if a user is admin */
    static async is_admin(user_id) {
        const repo = (0, typeorm_1.getConnection)().getRepository(UserRole_1.UserRole);
        const role = await repo.findOne({ where: { userId: user_id } });
        return role?.role === "admin";
    }
}
exports.PermissionService = PermissionService;
PermissionService.CONTAINER = "permissions";
const postgres_1 = require("@vercel/postgres");
class PermissionService {
    // Existing methods may already be present ...
    /**
     * Checks whether a user has a specific permission.
     * Returns true if a matching row exists in the permissions table.
     */
    static async hasAccess(userId, resource, action) {
        const result = await (0, postgres_1.sql) `
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
exports.PermissionService = PermissionService;
