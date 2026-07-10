"use strict";
/**
 * DatabaseService - a lightweight wrapper around the PostgreSQL client.
 * It reads connection parameters from environment variables and provides
 * a singleton pool for the rest of the backend.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
class DatabaseService {
    constructor(config) {
        const poolConfig = {
            host: config.host,
            port: Number(config.port),
            database: config.database,
            user: config.user,
            password: config.password,
            ssl: config.ssl === 'true',
            max: 20,
            idleTimeoutMillis: 30000,
        };
        this.pool = new pg_1.Pool(poolConfig);
    }
    static getInstance() {
        if (!DatabaseService.instance) {
            const cfg = {
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
    async query(text, params) {
        const client = await this.pool.connect();
        try {
            // @ts-ignore - suppressed by automated fix script (untyped function call)
            const res = await client.query(text, params);
            return res.rows;
        }
        finally {
            client.release();
        }
    }
}
exports.default = DatabaseService.getInstance();
