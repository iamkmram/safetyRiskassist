/**
 * DatabaseService - a lightweight wrapper around the PostgreSQL client.
 * It reads connection parameters from environment variables and provides
 * a singleton pool for the rest of the backend.
 */

import { Pool, PoolConfig } from 'pg';
import { DatabaseConfig } from '../types/database.types';

class DatabaseService {
  private static instance: DatabaseService;
  public pool: Pool;

  private constructor(config: DatabaseConfig) {
    const poolConfig: PoolConfig = {
      host: config.host,
      port: Number(config.port),
      database: config.database,
      user: config.user,
      password: config.password,
      ssl: config.ssl === 'true',
      max: 20,
      idleTimeoutMillis: 30000,
    };
    this.pool = new Pool(poolConfig);
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      const cfg: DatabaseConfig = {
        host: process.env.PGHOST || 'localhost',
        port: process.env.PGPORT || '5432',
        database: process.env.PGDATABASE || 'knowledge',
        user: process.env.PGUSER || 'postgres',
        password: process.env.PGPASSWORD || '',
        ssl: process.env.PGSSL || 'false',
      };
      DatabaseService.instance = new DatabaseService(cfg);
    }
    return DatabaseService.instance;
  }

  /** Simple query helper that returns rows typed as <T> */
  public async query<T>(text: string, params?: any[]): Promise<T[]> {
    const client = await this.pool.connect();
    try {
      const res = await client.query<T>(text, params);
      return res.rows;
    } finally {
      client.release();
    }
  }
}

export default DatabaseService.getInstance();
