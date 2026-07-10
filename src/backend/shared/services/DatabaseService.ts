// @ts-nocheck
import { CosmosClient, Container, Database as CosmosDatabase } from '@azure/cosmos';
import { logger } from '../../utils/logger';
import { Pool } from 'pg';
import { KnowledgeItemDB } from '../types/database.types';
import * as fs from 'fs';
import * as path from 'path';
import sqlite3 from 'sqlite3';
import { open, Database as SQLiteDatabase } from 'sqlite';
import { getConnection } from 'typeorm';
import { User } from '../models/User';
import { UserPreferences } from '../models/UserPreferences';
import { UserActivity } from '../models/UserActivity';

/**
 * Unified DatabaseService providing Azure Cosmos DB, PostgreSQL, SQLite,
 * and TypeORM helpers. All behaviours from previous implementations are
 * retained.
 */
export class DatabaseService {
  // ---------- Azure Cosmos DB ----------
  private static instance: DatabaseService;
  private client: CosmosClient;
  private database?: CosmosDatabase;

  // ---------- PostgreSQL ----------
  private pgPool: Pool;

  // ---------- SQLite ----------
  private static sqliteDbInstance: SQLiteDatabase | null = null;

  private constructor(connectionString: string) {
    // Initialise Cosmos client
    this.client = new CosmosClient(connectionString);
    // Initialise PostgreSQL pool
    this.pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  // ---------- Azure Cosmos DB init ----------
  public static async init(connectionString: string): Promise<DatabaseService> {
    if (!DatabaseService.instance) {
      const svc = new DatabaseService(connectionString);
      await svc.ensureDatabase();
      DatabaseService.instance = svc;
    }
    return DatabaseService.instance;
  }

  private async ensureDatabase(): Promise<void> {
    try {
      const { database } = await this.client.databases.createIfNotExists({
        id: process.env.COSMOS_DB_NAME ?? 'travel-assistant-db',
      });
      this.database = database;
      logger.info('Cosmos DB database ensured.');
    } catch (err: any) {
      logger.error('Failed to ensure Cosmos DB database:', err);
      throw err;
    }
  }

  public async getContainer(containerId: string): Promise<Container> {
    if (!this.database) {
      throw new Error('DatabaseService not initialised - call init() first.');
    }
    try {
      const { container } = await this.database.containers.createIfNotExists({
        id: containerId,
      });
      logger.info(`Container '${containerId}' ready.`);
      return container;
    } catch (err: any) {
      logger.error(`Failed to get/create container '${containerId}':`, err);
      throw err;
    }
  }

  public async createItem<T>(containerId: string, item: T): Promise<T> {
    const container = await this.getContainer(containerId);
    const { resource } = await container.items.create(item);
    return resource as T;
  }

  public async readItem<T>(containerId: string, id: string, partitionKey: string): Promise<T> {
    const container = await this.getContainer(containerId);
    const { resource } = await container.item(id, partitionKey).read<T>();
    return resource as T;
  }

  public async queryItems<T>(containerId: string, query: string, parameters?: any[]): Promise<T[]> {
    const container = await this.getContainer(containerId);
    const { resources } = await container.items
      .query<T>({ query, parameters })
      .fetchAll();
    return resources;
  }

  // ---------- PostgreSQL Instance Helpers ----------
  async getAllHelpArticles(): Promise<KnowledgeItemDB[]> {
    const res = await this.pgPool.query(
      'SELECT * FROM help_articles WHERE is_published = TRUE ORDER BY created_at DESC',
    );
    return res.rows;
  }

  async getHelpArticleById(articleId: string): Promise<KnowledgeItemDB | null> {
    const res = await this.pgPool.query(
      'SELECT * FROM help_articles WHERE article_id = $1 AND is_published = TRUE',
      [articleId],
    );
    return res.rowCount ? res.rows[0] : null;
  }

  async searchHelpArticles(query: string): Promise<KnowledgeItemDB[]> {
    const pattern = `%${query}%`;
    const res = await this.pgPool.query(
      `SELECT * FROM help_articles
       WHERE is_published = TRUE AND (title ILIKE $1 OR content ILIKE $1)
       ORDER BY created_at DESC`,
      [pattern],
    );
    return res.rows;
  }

  async incrementViewCount(articleId: string): Promise<void> {
    await this.pgPool.query(
      'UPDATE help_articles SET view_count = view_count + 1, updated_at = NOW() WHERE article_id = $1',
      [articleId],
    );
  }

  async getPopularArticles(limit: number = 5): Promise<KnowledgeItemDB[]> {
    const res = await this.pgPool.query(
      `SELECT * FROM help_articles
       WHERE is_published = TRUE
       ORDER BY view_count DESC, updated_at DESC
       LIMIT $1`,
      [limit],
    );
    return res.rows;
  }

  // ---------- SQLite Static Helpers ----------
  private static async getDb(): Promise<SQLiteDatabase> {
    if (DatabaseService.sqliteDbInstance) {
      return DatabaseService.sqliteDbInstance;
    }
    const dbPath = path.resolve(__dirname, '../../../database/app.db');
    DatabaseService.sqliteDbInstance = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    await DatabaseService.sqliteDbInstance.exec('PRAGMA journal_mode=WAL;');
    await DatabaseService.sqliteDbInstance.exec('PRAGMA foreign_keys=ON;');
    return DatabaseService.sqliteDbInstance;
  }

  /** Run a SELECT query on SQLite - returns rows as any[] */
  static async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const db = await DatabaseService.getDb();
    return db.all<T>(sql, params);
  }

  /** Run an INSERT/UPDATE/DELETE on SQLite - returns { changes, lastID } */
  static async execute(sql: string, params: any[] = []): Promise<{ changes: number; lastID: number }> {
    const db = await DatabaseService.getDb();
    const result = await db.run(sql, params);
    return { changes: result.changes ?? 0, lastID: result.lastID ?? 0 };
  }

  /** Seed mock users in SQLite (idempotent) */
  static async seedMockUsers(): Promise<void> {
    const db = await DatabaseService.getDb();
    const count = await db.get<{ cnt: number }>('SELECT COUNT(*) as cnt FROM auth_user;');
    if (count.cnt > 0) {
      return;
    }
    const sql = fs.readFileSync(
      path.resolve(__dirname, '../../../database/migrations/001_initial_schema.sql'),
      'utf-8',
    );
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
  static async ormQuery(...args: any[]): Promise<any> {
    return Promise.resolve(null);
  }

  static async get_user(user_id: string): Promise<User | null> {
    const repo = getConnection().getRepository(User);
    return await repo.findOne(user_id);
  }

  static async update_user_profile(user_id: string, data: Partial<User>): Promise<void> {
    const repo = getConnection().getRepository(User);
    await repo.update(user_id, data);
  }

  static async update_user_preferences(user_id: string, prefs: Partial<UserPreferences>): Promise<void> {
    const repo = getConnection().getRepository(UserPreferences);
    await repo.update({ userId: user_id }, prefs);
  }

  static async change_password(user_id: string, new_hash: string): Promise<void> {
    const repo = getConnection().getRepository(User);
    await repo.update(user_id, { hashedPassword: new_hash });
  }

  static async get_user_activity(user_id: string): Promise<UserActivity[]> {
    const repo = getConnection().getRepository(UserActivity);
    return await repo.find({
      where: { userId: user_id },
      order: { timestamp: 'DESC' },
      take: 10,
    });
  }

  static async soft_delete_user(user_id: string): Promise<void> {
    const repo = getConnection().getRepository(User);
    await repo.update(user_id, { isDeleted: true });
  }
}

/**
 * Stub generic fetchAll - returns empty collections.
 * Real implementations would query a specific table.
 */
export async function fetchAll<T>(tableName: string): Promise<T[]> {
  return [];
}

/**
 * Generic insert stub - resolves immediately.
 */
export async function insertOne<T>(tableName: string, record: T): Promise<void> {
  return;
}

import { KnowledgeItem } from '../models/KnowledgeItem';
import { PermissionService } from './PermissionService';
import { sql } from '@vercel/postgres'; // adjust import according to actual DB client

// Helper to generate UUIDs - replace with actual utility if present
function generateUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Extended Knowledgespecific database actions.
 */
export class KnowledgeDatabaseService extends DatabaseService {
  async createKnowledgeItem(
    item: Omit<KnowledgeItem, 'id' | 'createdAt' | 'updatedAt'>,
    userId: string
  ): Promise<KnowledgeItem> {
    const allowed = await PermissionService.hasAccess(userId, 'knowledge_items', 'create');
    if (!allowed) throw new Error('Access denied');

    const id = generateUuid();
    const now = new Date();

    const result = await sql`
      INSERT INTO knowledge_items (id, title, content, created_at, updated_at)
      VALUES (${id}, ${item.title}, ${item.content}, ${now}, ${now})
      RETURNING *`;
    return result[0] as KnowledgeItem;
  }

  async getKnowledgeItemById(id: string, userId: string): Promise<KnowledgeItem | null> {
    const allowed = await PermissionService.hasAccess(userId, 'knowledge_items', 'read');
    if (!allowed) throw new Error('Access denied');

    const result = await sql`SELECT * FROM knowledge_items WHERE id = ${id}`;
    return result.length ? (result[0] as KnowledgeItem) : null;
  }

  async updateKnowledgeItem(
    id: string,
    updates: Partial<Omit<KnowledgeItem, 'id' | 'createdAt' | 'updatedAt'>>,
    userId: string
  ): Promise<KnowledgeItem> {
    const allowed = await PermissionService.hasAccess(userId, 'knowledge_items', 'update');
    if (!allowed) throw new Error('Access denied');

    const now = new Date();

    const result = await sql`
      UPDATE knowledge_items
      SET title = COALESCE(${updates.title}, title),
          content = COALESCE(${updates.content}, content),
          updated_at = ${now}
      WHERE id = ${id}
      RETURNING *`;
    return result[0] as KnowledgeItem;
  }

  async deleteKnowledgeItem(id: string, userId: string): Promise<void> {
    const allowed = await PermissionService.hasAccess(userId, 'knowledge_items', 'delete');
    if (!allowed) throw new Error('Access denied');

    await sql`DELETE FROM knowledge_items WHERE id = ${id}`;
  }
}
