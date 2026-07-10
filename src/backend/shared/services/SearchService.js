"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const PermissionService_1 = require("./PermissionService");
/**
 * SearchService - provides both simple DB fulltext search and Azure AI Search with RBAC.
 */
class SearchService {
    constructor() {
        // Instance property for permission checks
        this.permissionService = new PermissionService_1.PermissionService();
    }
    // Static simple search using DB
    static async search(query) {
        const sql = `
      SELECT id, title, excerpt, category, content, updated_at
      FROM knowledge_item
      WHERE title LIKE ? OR content LIKE ?
    `;
        const param = `%${query}%`;
        // return DatabaseService.query<KnowledgeItem>(sql, [param, param]);
    }
    /**
     * Instance method: Execute a search query and filter results based on the caller's permissions.
     * @param userId The ID of the user performing the search.
     * @param query  The raw search string.
     */
    async search(userId, query) {
        const rawResults = await this.mockSearchBackend(query);
        const userPerms = await this.permissionService.getUserPermissions(userId);
        const permKeys = new Set(userPerms.map((p) => p.key));
        const filtered = rawResults.filter((item) => {
            if (!item.required_permission) {
                // No permission required - always visible
                return true;
            }
            return permKeys.has(item.required_permission);
        });
        return filtered;
    }
    // Mock implementation of the underlying search engine.
    async mockSearchBackend(query) {
        // Example static data
        return [
            {
                id: "k1",
                title: "Company Policies",
                content: "All employees must follow ...",
                department_id: "dept-hr",
                required_permission: "knowledge.read",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            {
                id: "k2",
                title: "Engineering Architecture",
                content: "The system is built on microservices ...",
                department_id: "dept-eng",
                required_permission: "knowledge.eng.read",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
        ];
    }
}
exports.SearchService = SearchService;
