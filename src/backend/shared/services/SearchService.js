/* eslint-disable */
import { DatabaseService } from "./DatabaseService";
/**
 * SearchService - very simple fulltext search over the KnowledgeItem table.
 * For the prototype we perform a LIKE query on the title field.
 */
export class SearchService {
    static async search(query) {
        const sql = `
      SELECT id, title, excerpt, category, content, updated_at
      FROM knowledge_item
      WHERE title LIKE ? OR content LIKE ?
    `;
        const param = `%${query}%`;
        return DatabaseService.query(sql, [param, param]);
    }
}
