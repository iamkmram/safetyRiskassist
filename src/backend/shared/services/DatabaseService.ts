// @ts-nocheck
import { Pool } from 'pg';
import { KnowledgeItemDB } from '../types/database.types';
import * as fs from 'fs';
import * as path from 'path';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

/**
 * DatabaseService provides both PostgreSQL and SQLite utilities.
 * - Instance methods use a PostgreSQL connection pool.
 * - Static methods use a singleton SQLite connection.
 * This hybrid approach preserves existing functionality from both branches.
 */
export class DatabaseService {
  // PostgreSQL connection pool (instance-level)
  private pool: Pool;

  // SQLite singleton instance (static)
  private static dbInstance: Database | null = null;

  constructor() {
    // Initialise PostgreSQL pool using environment variable
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  /** ---------- SQLite Static Helpers ---------- */

  /** Initialise and return a singleton SQLite DB connection. */
  static async getDb(): Promise<Database> {
    if (this.dbInstance) {
      return this.dbInstance;
    }
    const dbPath = path.resolve(__dirname, '../../../database/app.db');
    this.dbInstance = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    // Enable WAL mode for better concurrency
    await this.dbInstance.exec('PRAGMA journal_mode=WAL;');
    await this.dbInstance.exec('PRAGMA foreign_keys=ON;');
    return this.dbInstance;
  }

  /** Run a SELECT query - returns rows as any[] */
  static async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const db = await this.getDb();
    return db.all<T>(sql, params);
  }

  /** Run an INSERT/UPDATE/DELETE - returns { changes, lastID } */
  static async execute(sql: string, params: any[] = []): Promise<{ changes: number; lastID: number }> {
    const db = await this.getDb();
    const result = await db.run(sql, params);
    return { changes: result.changes ?? 0, lastID: result.lastID ?? 0 };
  }

  /**
   * Seed the three mock users defined in the migration file.
   * This method is idempotent - it will not insert duplicates.
   */
  static async seedMockUsers(): Promise<void> {
    const db = await this.getDb();
    const count = await db.get<{ cnt: number }>('SELECT COUNT(*) as cnt FROM auth_user;');
    if (count.cnt > 0) {
      // Already seeded
      return;
    }

    const sql = fs.readFileSync(
      path.resolve(__dirname, '../../../database/migrations/001_initial_schema.sql'),
      'utf-8',
    );

    // The migration file contains both CREATE TABLE and INSERT statements.
    // Split on ";" to execute statements sequentially.
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const stmt of statements) {
      await db.exec(stmt + ';');
    }
  }

  /** ---------- PostgreSQL Instance Helpers ---------- */

  async getAllHelpArticles(): Promise<KnowledgeItemDB[]> {
    const res = await this.pool.query(
      'SELECT * FROM help_articles WHERE is_published = TRUE ORDER BY created_at DESC',
    );
    return res.rows;
  }

  async getHelpArticleById(articleId: string): Promise<KnowledgeItemDB | null> {
    const res = await this.pool.query(
      'SELECT * FROM help_articles WHERE article_id = $1 AND is_published = TRUE',
      [articleId],
    );
    return res.rowCount ? res.rows[0] : null;
  }

  async searchHelpArticles(query: string): Promise<KnowledgeItemDB[]> {
    const pattern = `%${query}%`;
    const res = await this.pool.query(
      `SELECT * FROM help_articles
       WHERE is_published = TRUE AND (title ILIKE $1 OR content ILIKE $1)
       ORDER BY created_at DESC`,
      [pattern],
    );
    return res.rows;
  }

  async incrementViewCount(articleId: string): Promise<void> {
    await this.pool.query(
      'UPDATE help_articles SET view_count = view_count + 1, updated_at = NOW() WHERE article_id = $1',
      [articleId],
    );
  }

  async getPopularArticles(limit: number = 5): Promise<KnowledgeItemDB[]> {
    const res = await this.pool.query(
      `SELECT * FROM help_articles
       WHERE is_published = TRUE
       ORDER BY view_count DESC, updated_at DESC
       LIMIT $1`,
      [limit],
    );
    return res.rows;
  }
}

/**
 * Stub generic fetchAll - returns empty collections.
 * Real implementations would query a specific table.
 */
export async function fetchAll<T>(tableName: string): Promise<T[]> {
  // No real DB - return empty array.
  return [];
}

/**
 * Generic insert stub - resolves immediately.
 */
export async function insertOne<T>(tableName: string, record: T): Promise<void> {
  // No operation.
  return;
}
