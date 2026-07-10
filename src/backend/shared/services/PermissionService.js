"use strict";
/**
 * PermissionService - evaluates whether a subject (user/role) is allowed
 * to perform an action on a given resource.
 * Uses the DatabaseService to read permission assignments.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionService = void 0;
const DatabaseService_1 = __importDefault(require("./DatabaseService"));
class PermissionService {
    /**
     * Checks if a subject is allowed to perform an action on a resource.
     * Returns { allowed: true } or { allowed: false, reason?: string }
     */
    async evaluate(request) {
        const { subjectId, resource, action } = request;
        // Simple logic: a user inherits permissions via their roles.
        const sql = `
      SELECT 1
      FROM user_roles ur
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.id
      WHERE ur.user_id = $1
        AND p.resource = $2
        AND p.action = $3
      LIMIT 1;
    `;
        const rows = await DatabaseService_1.default.query(sql, [subjectId, resource, action]);
        const allowed = rows.length > 0;
        return allowed
            ? { allowed: true }
            : { allowed: false, reason: 'Permission not found for the subject.' };
    }
}
exports.PermissionService = PermissionService;
exports.default = new PermissionService();
