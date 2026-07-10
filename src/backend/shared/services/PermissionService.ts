/**
 * PermissionService - evaluates whether a subject (user/role) is allowed
 * to perform an action on a given resource.
 * Uses the DatabaseService to read permission assignments.
 */

import DatabaseService from './DatabaseService';
import { PermissionCheckRequest, PermissionCheckResult } from '../types/database.types';

export class PermissionService {
  /**
   * Checks if a subject is allowed to perform an action on a resource.
   * Returns { allowed: true } or { allowed: false, reason?: string }
   */
  public async evaluate(request: PermissionCheckRequest): Promise<PermissionCheckResult> {
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

    const rows = await DatabaseService.query<{ exists: number }>(sql, [subjectId, resource, action]);
    const allowed = rows.length > 0;
    return allowed
      ? { allowed: true }
      : { allowed: false, reason: 'Permission not found for the subject.' };
  }
}

export default new PermissionService();
