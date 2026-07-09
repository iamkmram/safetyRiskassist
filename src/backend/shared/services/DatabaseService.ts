import { Pool } from 'pg';
import { KnowledgeItemDB } from '../types/database.types';

export class DatabaseService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async getAllHelpArticles(): Promise<KnowledgeItemDB[]> {
    const res = await this.pool.query(
      'SELECT * FROM help_articles WHERE is_published = TRUE ORDER BY created_at DESC'
    );
    return res.rows;
  }

  async getHelpArticleById(articleId: string): Promise<KnowledgeItemDB | null> {
    const res = await this.pool.query(
      'SELECT * FROM help_articles WHERE article_id = $1 AND is_published = TRUE',
      [articleId]
    );
    return res.rowCount ? res.rows[0] : null;
  }

  async searchHelpArticles(query: string): Promise<KnowledgeItemDB[]> {
    const pattern = `%${query}%`;
    const res = await this.pool.query(
      `SELECT * FROM help_articles
       WHERE is_published = TRUE AND (title ILIKE $1 OR content ILIKE $1)
       ORDER BY created_at DESC`,
      [pattern]
    );
    return res.rows;
  }

  async incrementViewCount(articleId: string): Promise<void> {
    await this.pool.query(
      'UPDATE help_articles SET view_count = view_count + 1, updated_at = NOW() WHERE article_id = $1',
      [articleId]
    );
  }

  async getPopularArticles(limit: number = 5): Promise<KnowledgeItemDB[]> {
    const res = await this.pool.query(
      `SELECT * FROM help_articles
       WHERE is_published = TRUE
       ORDER BY view_count DESC, updated_at DESC
       LIMIT $1`,
      [limit]
    );
    return res.rows;
  }
}
