/**
 * Stub DatabaseService - returns empty collections.
 * Real implementations would use Azure Cosmos DB / PostgreSQL.
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

import { Pool } from 'pg';
import { HelpArticle } from '../models/KnowledgeItem';

// Create a PostgreSQL connection pool (uses DATABASE_URL env var)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/**
 * Retrieves help articles with optional filtering.
 * @param filter Optional filter object
 */
export const getHelpArticles = async (
  filter?: {
    category?: string;
    search?: string;
    popular?: boolean;
    recent?: boolean;
  }
): Promise<HelpArticle[]> => {
  const conditions: string[] = [];
  const values: any[] = [];

  if (filter?.category) {
    values.push(filter.category);
    conditions.push(`category = $${values.length}`);
  }
  if (filter?.search) {
    values.push(`%${filter.search}%`);
    conditions.push(`(title ILIKE $${values.length} OR content ILIKE $${values.length})`);
  }
  if (filter?.popular) {
    values.push(true);
    conditions.push(`is_popular = $${values.length}`);
  }
  if (filter?.recent) {
    values.push(true);
    conditions.push(`is_recent = $${values.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const sql = `SELECT * FROM help_articles ${whereClause} ORDER BY updated_at DESC`;

  try {
    const { rows } = await pool.query(sql, values);
    return rows;
  } catch (err) {
    throw new Error(`Failed to fetch help articles: ${err instanceof Error ? err.message : String(err)}`);
  }
};

/**
 * Retrieves a single help article by its UUID.
 * @param id Article UUID string
 */
export const getHelpArticleById = async (id: string): Promise<HelpArticle | null> => {
  const sql = `SELECT * FROM help_articles WHERE id = $1`;
  try {
    const { rows } = await pool.query(sql, [id]);
    return rows[0] ?? null;
  } catch (err) {
    throw new Error(`Failed to fetch help article ${id}: ${err instanceof Error ? err.message : String(err)}`);
  }
};

/**
 * Creates a new help article.
 * @param payload Article data without id / timestamps
 */
export const createHelpArticle = async (
  payload: Omit<HelpArticle, 'id' | 'created_at' | 'updated_at'>
): Promise<HelpArticle> => {
  const sql = `
    INSERT INTO help_articles (title, category, content, is_popular, is_recent)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [
    payload.title,
    payload.category,
    payload.content,
    payload.is_popular ?? false,
    payload.is_recent ?? false,
  ];
  try {
    const { rows } = await pool.query(sql, values);
    return rows[0];
  } catch (err) {
    throw new Error(`Failed to create help article: ${err instanceof Error ? err.message : String(err)}`);
  }
};

/**
 * Updates an existing help article.
 * @param id Article UUID
 * @param payload Partial fields to update
 */
export const updateHelpArticle = async (
  id: string,
  payload: Partial<Omit<HelpArticle, 'id'>>
): Promise<void> => {
  const setClauses: string[] = [];
  const values: any[] = [];

  if (payload.title !== undefined) {
    values.push(payload.title);
    setClauses.push(`title = $${values.length}`);
  }
  if (payload.category !== undefined) {
    values.push(payload.category);
    setClauses.push(`category = $${values.length}`);
  }
  if (payload.content !== undefined) {
    values.push(payload.content);
    setClauses.push(`content = $${values.length}`);
  }
  if (payload.is_popular !== undefined) {
    values.push(payload.is_popular);
    setClauses.push(`is_popular = $${values.length}`);
  }
  if (payload.is_recent !== undefined) {
    values.push(payload.is_recent);
    setClauses.push(`is_recent = $${values.length}`);
  }

  if (setClauses.length === 0) {
    // Nothing to update
    return;
  }

  values.push(id);
  const sql = `UPDATE help_articles SET ${setClauses.join(', ')}, updated_at = now() WHERE id = $${values.length}`;

  try {
    await pool.query(sql, values);
  } catch (err) {
    throw new Error(`Failed to update help article ${id}: ${err instanceof Error ? err.message : String(err)}`);
  }
};
