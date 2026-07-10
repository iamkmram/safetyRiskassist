"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
/**
 * SearchService - very simple fulltext search over the KnowledgeItem table.
 * For the prototype we perform a LIKE query on the title field.
 */
class SearchService {
    static async search(query) {
        const sql = `
      SELECT id, title, excerpt, category, content, updated_at
      FROM knowledge_item
      WHERE title LIKE ? OR content LIKE ?
    `;
        const param = `%${query}%`;
        //     return DatabaseService.query<KnowledgeItem>(sql, [param, param]);
    }
}
exports.SearchService = SearchService;
