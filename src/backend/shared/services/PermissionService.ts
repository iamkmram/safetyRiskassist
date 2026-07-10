import { queryDatabase } from '../utils/database';
import { PermissionRow } from '../types/database.types';

/**
 * Existing PermissionService logic is preserved; we only append the new method.
 */
export class PermissionService {
  /**
   * Checks whether the given user has the `dashboard_view` permission.
   */
  static async hasDashboardAccess(userId: string): Promise<boolean> {
    const sql = `
      SELECT 1 FROM permissions
      WHERE user_id = @userId
        AND permission_name = 'dashboard_view'
    `;
    const result = await queryDatabase<PermissionRow>(sql, { userId });
    return result.length > 0;
  }

  // ... other existing methods can be added here
}
