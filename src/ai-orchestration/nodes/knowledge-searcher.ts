import { KnowledgeItem } from '../../backend/shared/models/KnowledgeItem';
import DatabaseService from '../../backend/shared/services/DatabaseService';

/**
 * KnowledgeSearcher - performs a simple fulltext search on the knowledge_items table.
 * Parameters:
 *   query: string - the search term
 * Returns: Promise<KnowledgeItem[]>
 */
export async function knowledgeSearcher(query: string): Promise<KnowledgeItem[]> {
  if (typeof query !== 'string' || query.trim() === '') {
    throw new Error('Query must be a nonempty string');
  }

  const sanitized = query.replace(/[%_]/g, '\\$&'); // escape % and _
  const sql = `
    SELECT id, title, content, created_at as "createdAt"
    FROM knowledge_items
    WHERE title ILIKE $1 OR content ILIKE $1
    ORDER BY created_at DESC
    LIMIT 20
  `;
  const rows = await DatabaseService.query<KnowledgeItem>(sql, [`%${sanitized}%`]);
  return rows;
}
