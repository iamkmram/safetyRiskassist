// @ts-nocheck
import * as fs from "fs";
import * as path from "path";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

/**
 * Simple SQLite wrapper used for the demo prototype.
 * It loads the DB file `./src/database/app.db` (created automatically).
 * In production a proper connection pool / ORM would be used.
 */
export class DatabaseService {
  private static dbInstance: Database | null = null;

  /** Initialise and return a singleton DB connection. */
  static async getDb(): Promise<Database> {
    if (this.dbInstance) {
      return this.dbInstance;
    }
    const dbPath = path.resolve(__dirname, "../../../database/app.db");
    this.dbInstance = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    // Enable WAL mode for better concurrency
    await this.dbInstance.exec("PRAGMA journal_mode=WAL;");
    await this.dbInstance.exec("PRAGMA foreign_keys=ON;");
    return this.dbInstance;
  }

  /** Run a SELECT query - returns rows as any[] */
  static async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const db = await this.getDb();
    return db.all<T>(sql, params);
  }

  /** Run an INSERT/UPDATE/DELETE - returns { changes, lastID } */
  static async execute(sql: string, params: any[] = []): Promise<{
    changes: number;
    lastID: number;
  }> {
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
    const count = await db.get<{ cnt: number }>("SELECT COUNT(*) as cnt FROM auth_user;");
    if (count.cnt > 0) {
      // Already seeded
      return;
    }

    const sql = fs.readFileSync(
      path.resolve(__dirname, "../../../database/migrations/001_initial_schema.sql"),
      "utf-8",
    );

    // The migration file contains both CREATE TABLE and INSERT statements.
    // Split on "INSERT" to execute inserts after the table exists.
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const stmt of statements) {
      await db.exec(stmt + ";");
    }
  }
}
