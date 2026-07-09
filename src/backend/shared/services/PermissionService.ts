import { DatabaseService } from './DatabaseService';
import type { Permission } from '../types/database.types';

export class PermissionService {
  private db: DatabaseService;

  constructor() {
    this.db = new DatabaseService();
  }

  async canReadHelp(role: string): Promise<boolean> {
    const res = await this.db['pool'].query(
      'SELECT can_read FROM permissions WHERE role = $1 AND resource = $2',
      [role, 'help']
    );
    return res.rowCount ? res.rows[0].can_read : false;
  }

  async canWriteHelp(role: string): Promise<boolean> {
    const res = await this.db['pool'].query(
      'SELECT can_write FROM permissions WHERE role = $1 AND resource = $2',
      [role, 'help']
    );
    return res.rowCount ? res.rows[0].can_write : false;
  }
}
