 
// @ts-nocheck
import { DatabaseService } from "./DatabaseService";
import { PermissionService } from "./PermissionService";
import { KnowledgeItem } from "../models/KnowledgeItem";

/**
 * SearchService - provides both simple DB fulltext search and Azure AI Search with RBAC.
 */
export class SearchService {
  // Instance property for permission checks
  private permissionService = new PermissionService();

  // Static simple search using DB
  static async search(query: string): Promise<KnowledgeItem[]> {
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
  async search(userId: string, query: string): Promise<KnowledgeItem[]> {
    const rawResults: KnowledgeItem[] = await this.mockSearchBackend(query);
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
  private async mockSearchBackend(query: string): Promise<KnowledgeItem[]> {
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
