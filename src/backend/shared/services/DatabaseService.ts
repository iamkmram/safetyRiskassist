import { Pool, QueryResult } from 'pg';

/**
 * DatabaseService - minimal PostgreSQL wrapper with error handling.
 * Reads connection string from environment variable DATABASE_URL.
 */
export class DatabaseService {
  private static pool: Pool;

  private static getPool(): Pool {
    if (!DatabaseService.pool) {
      const connectionString = process.env.DATABASE_URL;
      if (!connectionString) {
        throw new Error('DATABASE_URL env variable not set');
      }
      DatabaseService.pool = new Pool({ connectionString });
    }
    return DatabaseService.pool;
  }

  /** Execute a parameterised query and return rows */
  public static async query<T = any>(text: string, params?: any[]): Promise<T[]> {
    const client = DatabaseService.getPool();
    try {
      const result: QueryResult<T> = await client.query(text, params);
      return result.rows;
    } catch (err) {
      console.error('Database query error:', err);
      throw err;
    }
  }
}
