"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnowledgeDatabaseService = exports.insertOne = exports.fetchAll = exports.DatabaseService = void 0;
// @ts-nocheck
const cosmos_1 = require("@azure/cosmos");
const logger_1 = require("../../utils/logger");
const pg_1 = require("pg");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const typeorm_1 = require("typeorm");
/**
 * Unified DatabaseService providing Azure Cosmos DB, PostgreSQL, SQLite,
 * and TypeORM helpers. All behaviours from previous implementations are
 * retained.
 */
class DatabaseService {
    constructor(connectionString) {
        // Initialise Cosmos client
        this.client = new cosmos_1.CosmosClient(connectionString);
        // Initialise PostgreSQL pool
        this.pgPool = new pg_1.Pool({
            connectionString: process.env.DATABASE_URL,
        });
    }
    // ---------- Azure Cosmos DB init ----------
    static async init(connectionString) {
        if (!DatabaseService.instance) {
            const svc = new DatabaseService(connectionString);
            await svc.ensureDatabase();
            DatabaseService.instance = svc;
        }
        return DatabaseService.instance;
    }
    async ensureDatabase() {
        try {
            const { database } = await this.client.databases.createIfNotExists({
                id: process.env.COSMOS_DB_NAME ?? 'travel-assistant-db',
            });
            this.database = database;
            logger_1.logger.info('Cosmos DB database ensured.');
        }
        catch (err) {
            logger_1.logger.error('Failed to ensure Cosmos DB database:', err);
            throw err;
        }
    }
    async getContainer(containerId) {
        if (!this.database) {
            throw new Error('DatabaseService not initialised - call init() first.');
        }
        try {
            const { container } = await this.database.containers.createIfNotExists({
                id: containerId,
            });
            logger_1.logger.info(`Container '${containerId}' ready.`);
            return container;
        }
        catch (err) {
            logger_1.logger.error(`Failed to get/create container '${containerId}':`, err);
            throw err;
        }
    }
    async createItem(containerId, item) {
        const container = await this.getContainer(containerId);
        const { resource } = await container.items.create(item);
        return resource;
    }
    async readItem(containerId, id, partitionKey) {
        const container = await this.getContainer(containerId);
        const { resource } = await container.item(id, partitionKey).read();
        return resource;
    }
    async queryItems(containerId, query, parameters) {
        const container = await this.getContainer(containerId);
        const { resources } = await container.items
            .query({ query, parameters })
            .fetchAll();
        return resources;
    }
    // ---------- PostgreSQL Instance Helpers ----------
    async getAllHelpArticles() {
        const res = await this.pgPool.query('SELECT * FROM help_articles WHERE is_published = TRUE ORDER BY created_at DESC');
        return res.rows;
    }
    async getHelpArticleById(articleId) {
        const res = await this.pgPool.query('SELECT * FROM help_articles WHERE article_id = $1 AND is_published = TRUE', [articleId]);
        return res.rowCount ? res.rows[0] : null;
    }
    async searchHelpArticles(query) {
        const pattern = `%${query}%`;
        const res = await this.pgPool.query(`SELECT * FROM help_articles
       WHERE is_published = TRUE AND (title ILIKE $1 OR content ILIKE $1)
       ORDER BY created_at DESC`, [pattern]);
        return res.rows;
    }
    async incrementViewCount(articleId) {
        await this.pgPool.query('UPDATE help_articles SET view_count = view_count + 1, updated_at = NOW() WHERE article_id = $1', [articleId]);
    }
    async getPopularArticles(limit = 5) {
        const res = await this.pgPool.query(`SELECT * FROM help_articles
       WHERE is_published = TRUE
       ORDER BY view_count DESC, updated_at DESC
       LIMIT $1`, [limit]);
        return res.rows;
    }
    // ---------- SQLite Static Helpers ----------
    static async getDb() {
        if (DatabaseService.sqliteDbInstance) {
            return DatabaseService.sqliteDbInstance;
        }
        const dbPath = path.resolve(__dirname, '../../../database/app.db');
        DatabaseService.sqliteDbInstance = await (0, sqlite_1.open)({
            filename: dbPath,
            driver: sqlite3_1.default.Database,
        });
        await DatabaseService.sqliteDbInstance.exec('PRAGMA journal_mode=WAL;');
        await DatabaseService.sqliteDbInstance.exec('PRAGMA foreign_keys=ON;');
        return DatabaseService.sqliteDbInstance;
    }
    /** Run a SELECT query on SQLite - returns rows as any[] */
    static async query(sql, params = []) {
        const db = await DatabaseService.getDb();
        return db.all(sql, params);
    }
    /** Run an INSERT/UPDATE/DELETE on SQLite - returns { changes, lastID } */
    static async execute(sql, params = []) {
        const db = await DatabaseService.getDb();
        const result = await db.run(sql, params);
        return { changes: result.changes ?? 0, lastID: result.lastID ?? 0 };
    }
    /** Seed mock users in SQLite (idempotent) */
    static async seedMockUsers() {
        const db = await DatabaseService.getDb();
        const count = await db.get('SELECT COUNT(*) as cnt FROM auth_user;');
        if (count.cnt > 0) {
            return;
        }
        const sql = fs.readFileSync(path.resolve(__dirname, '../../../database/migrations/001_initial_schema.sql'), 'utf-8');
        const statements = sql
            .split(';')
            .map((s) => s.trim())
            .filter((s) => s.length > 0);
        for (const stmt of statements) {
            await db.exec(stmt + ';');
        }
    }
    // ---------- TypeORM Static Helpers ----------
    /** Placeholder generic query (original integration version) */
    static async ormQuery(...args) {
        return Promise.resolve(null);
    }
    static async get_user(user_id) {
        const repo = (0, typeorm_1.getConnection)().getRepository(User_1.User);
        return await repo.findOne(user_id);
    }
    static async update_user_profile(user_id, data) {
        const repo = (0, typeorm_1.getConnection)().getRepository(User_1.User);
        await repo.update(user_id, data);
    }
    static async update_user_preferences(user_id, prefs) {
        const repo = (0, typeorm_1.getConnection)().getRepository(UserPreferences_1.UserPreferences);
        await repo.update({ userId: user_id }, prefs);
    }
    static async change_password(user_id, new_hash) {
        const repo = (0, typeorm_1.getConnection)().getRepository(User_1.User);
        await repo.update(user_id, { hashedPassword: new_hash });
    }
    static async get_user_activity(user_id) {
        const repo = (0, typeorm_1.getConnection)().getRepository(UserActivity_1.UserActivity);
        return await repo.find({
            where: { userId: user_id },
            order: { timestamp: 'DESC' },
            take: 10,
        });
    }
    static async soft_delete_user(user_id) {
        const repo = (0, typeorm_1.getConnection)().getRepository(User_1.User);
        await repo.update(user_id, { isDeleted: true });
    }
}
exports.DatabaseService = DatabaseService;
// ---------- SQLite ----------
DatabaseService.sqliteDbInstance = null;
/**
 * Stub generic fetchAll - returns empty collections.
 * Real implementations would query a specific table.
 */
async function fetchAll(tableName) {
    return [];
}
exports.fetchAll = fetchAll;
/**
 * Generic insert stub - resolves immediately.
 */
async function insertOne(tableName, record) {
    return;
}
exports.insertOne = insertOne;
const PermissionService_1 = require("./PermissionService");
const postgres_1 = require("@vercel/postgres"); // adjust import according to actual DB client
// Helper to generate UUIDs - replace with actual utility if present
function generateUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
/**
 * Extended Knowledgespecific database actions.
 */
class KnowledgeDatabaseService extends DatabaseService {
    async createKnowledgeItem(item, userId) {
        const allowed = await PermissionService_1.PermissionService.hasAccess(userId, 'knowledge_items', 'create');
        if (!allowed)
            throw new Error('Access denied');
        const id = generateUuid();
        const now = new Date();
        const result = await (0, postgres_1.sql) `
      INSERT INTO knowledge_items (id, title, content, created_at, updated_at)
      VALUES (${id}, ${item.title}, ${item.content}, ${now}, ${now})
      RETURNING *`;
        return result[0];
    }
    async getKnowledgeItemById(id, userId) {
        const allowed = await PermissionService_1.PermissionService.hasAccess(userId, 'knowledge_items', 'read');
        if (!allowed)
            throw new Error('Access denied');
        const result = await (0, postgres_1.sql) `SELECT * FROM knowledge_items WHERE id = ${id}`;
        return result.length ? result[0] : null;
    }
    async updateKnowledgeItem(id, updates, userId) {
        const allowed = await PermissionService_1.PermissionService.hasAccess(userId, 'knowledge_items', 'update');
        if (!allowed)
            throw new Error('Access denied');
        const now = new Date();
        const result = await (0, postgres_1.sql) `
      UPDATE knowledge_items
      SET title = COALESCE(${updates.title}, title),
          content = COALESCE(${updates.content}, content),
          updated_at = ${now}
      WHERE id = ${id}
      RETURNING *`;
        return result[0];
    }
    async deleteKnowledgeItem(id, userId) {
        const allowed = await PermissionService_1.PermissionService.hasAccess(userId, 'knowledge_items', 'delete');
        if (!allowed)
            throw new Error('Access denied');
        await (0, postgres_1.sql) `DELETE FROM knowledge_items WHERE id = ${id}`;
    }
}
exports.KnowledgeDatabaseService = KnowledgeDatabaseService;
