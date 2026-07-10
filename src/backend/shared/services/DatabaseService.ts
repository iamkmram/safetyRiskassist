import { Pool, QueryResult } from 'pg';
import { Logger } from '../utils/Logger';

/**
 * DatabaseService - provides a singleton Postgres connection pool.
 * All queries go through this service so we can centralise error handling
 * and logging.
 */
export class DatabaseService {
  private static instance: DatabaseService;
  private pool: Pool;

  private constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set.');
    }

    // Initialise the pool
    this.pool = new Pool({
      connectionString,
      // Optional: configure pool size via env vars
      max: Number(process.env.DB_POOL_MAX) || 10,
      idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT) || 30000,
    });

    Logger.info('Database pool created.');
  }

  /** Get the singleton instance */
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Execute a parametrised query.
   * @param text SQL query string
   * @param params Optional query parameters
   */
  public async query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    try {
      Logger.debug(`Executing query: ${text} | params: ${JSON.stringify(params)}`);
      const result = await this.pool.query<T>(text, params);
      Logger.debug(`Query returned ${result.rowCount} rows.`);
      return result;
    } catch (err) {
      Logger.error(`Database query failed: ${(err as Error).message}`, { query: text, params });
      throw err;
    }
  }

  /** Gracefully close the pool (useful for tests / lambda shutdown) */
  public async close(): Promise<void> {
    await this.pool.end();
    Logger.info('Database pool closed.');
  }
}
