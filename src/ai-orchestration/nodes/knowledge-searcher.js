"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.knowledgeSearcher = void 0;
const DatabaseService_1 = __importDefault(require("../../backend/shared/services/DatabaseService"));
/**
 * KnowledgeSearcher - performs a simple fulltext search on the knowledge_items table.
 * Parameters:
 *   query: string - the search term
 * Returns: Promise<KnowledgeItem[]>
 */
async function knowledgeSearcher(query) {
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
    const rows = await DatabaseService_1.default.query(sql, [`%${sanitized}%`]);
    return rows;
}
exports.knowledgeSearcher = knowledgeSearcher;
