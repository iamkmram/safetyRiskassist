import { Pool } from 'pg';
import { Logger } from '../utils/Logger';
/**
 * DatabaseService - provides a singleton Postgres connection pool.
 * All queries go through this service so we can centralise error handling
 * and logging.
 */
export class DatabaseService {
    static instance;
    pool;
    constructor() {
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
    static getInstance() {
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
    async query(text, params) {
        try {
            Logger.debug(`Executing query: ${text} | params: ${JSON.stringify(params)}`);
            const result = await this.pool.query(text, params);
            Logger.debug(`Query returned ${result.rowCount} rows.`);
            return result;
        }
        catch (err) {
            Logger.error(`Database query failed: ${err.message}`, { query: text, params });
            throw err;
        }
    }
    /** Gracefully close the pool (useful for tests / lambda shutdown) */
    async close() {
        await this.pool.end();
        Logger.info('Database pool closed.');
    }
}
