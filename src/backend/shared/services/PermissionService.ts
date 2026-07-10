import { DatabaseService } from './DatabaseService';
import { Permission } from '../types/database.types';
import { logger } from '../../utils/logger';

/**
 * Service responsible for permission checks.
 * Uses the 'permissions' container.
 */
export class PermissionService {
  private static readonly CONTAINER = 'permissions';
  private dbService: DatabaseService;

  constructor(dbService: DatabaseService) {
    this.dbService = dbService;
  }

  /** Check if a user has a given role */
  public async hasRole(userId: string, role: string): Promise<boolean> {
    try {
      const query = `
        SELECT VALUE COUNT(1) FROM c
        WHERE c.user_id = @userId AND c.role = @role
      `;
      const params = [
        { name: '@userId', value: userId },
        { name: '@role', value: role },
      ];
      const result = await this.dbService.queryItems<number>(PermissionService.CONTAINER, query, params);
      const count = result[0] ?? 0;
      logger.debug(`Permission check for user ${userId} role ${role}: ${count > 0}`);
      return count > 0;
    } catch (err:any) {
      logger.error('Permission check failed:', err);
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
    return await this.dbService.createItem(PermissionService.CONTAINER, newPermission);
  }
}
