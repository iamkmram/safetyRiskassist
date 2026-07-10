import { DatabaseService } from '../../backend/shared/services/DatabaseService';
import { KnowledgeItem } from '../../backend/shared/models/KnowledgeItem';

/**
 * Searches knowledge items by a simple keyword match on title or content.
 * This is a minimal implementation - in production you would use fulltext search.
 *
 * @param query Search term (caseinsensitive)
 * @returns Array of matching KnowledgeItem objects
 */
export async function searchKnowledge(query: string): Promise<KnowledgeItem[]> {
  if (!query || typeof query !== 'string') {
    throw new Error('A nonempty string query is required.');
  }

  const db = DatabaseService.getInstance();

  const sql = `
    SELECT id, title, content, created_by AS "createdBy",
           created_at AS "createdAt", updated_at AS "updatedAt"
    FROM knowledge_items
    WHERE LOWER(title) LIKE $1 OR LOWER(content) LIKE $1
    ORDER BY created_at DESC
    LIMIT 50;
  `;

  const likePattern = `%${query.toLowerCase()}%`;

  try {
    const result = await db.query<KnowledgeItem>(sql, [likePattern]);
    return result.rows;
  } catch (err) {
    console.error('Error during knowledge search:', err);
    throw err;
  }
}
