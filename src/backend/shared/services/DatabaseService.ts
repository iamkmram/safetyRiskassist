import { Pool, QueryResult } from 'pg';
import { DBConfig } from '../types/database.types';

export class DatabaseService {
  private static instance: DatabaseService;
  private pool: Pool;

  private constructor(config: DBConfig) {
    this.pool = new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      ssl: config.ssl,
    });
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      const config: DBConfig = {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        database: process.env.DB_NAME || 'appdb',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        ssl: process.env.DB_SSL === 'true',
      };
      DatabaseService.instance = new DatabaseService(config);
    }
    return DatabaseService.instance;
  }

  public async query<T>(text: string, params?: any[]): Promise<QueryResult<T>> {
    const client = await this.pool.connect();
    try {
      return await client.query<T>(text, params);
    } finally {
      client.release();
    }
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }
}
