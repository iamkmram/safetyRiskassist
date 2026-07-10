import { DatabaseService } from './DatabaseService';
import { Permission } from '../types/database.types';

export class PermissionService {
  private db = DatabaseService.getInstance();

  public async getPermissionsForUser(userId: number): Promise<Permission[]> {
    const result = await this.db.query<Permission>(
      `SELECT p.id, p.name, p.description
       FROM permissions p
       JOIN role_permissions rp ON p.id = rp.permission_id
       JOIN user_roles ur ON rp.role_id = ur.role_id
       WHERE ur.user_id = $1`,
      [userId]
    );
    return result.rows;
  }

  public async userHasPermission(userId: number, permissionName: string): Promise<boolean> {
    const result = await this.db.query<{ count: number }>(
      `SELECT COUNT(*) as count
       FROM permissions p
       JOIN role_permissions rp ON p.id = rp.permission_id
       JOIN user_roles ur ON rp.role_id = ur.role_id
       WHERE ur.user_id = $1 AND p.name = $2`,
      [userId, permissionName]
    );
    return Number(result.rows[0].count) > 0;
  }
}
