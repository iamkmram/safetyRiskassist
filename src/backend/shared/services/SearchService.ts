import { PermissionService } from './PermissionService';
import { KnowledgeItem } from '../models/KnowledgeItem';

// ------------------------------------------------------------------
// SearchService - thin wrapper around Azure AI Search with RBAC filtering
// ------------------------------------------------------------------

export class SearchService {
  private permissionService = new PermissionService();

  /**
   * Execute a search query and filter results based on the caller's permissions.
   * @param userId The ID of the user performing the search.
   * @param query  The raw search string.
   */
  async search(userId: string, query: string): Promise<KnowledgeItem[]> {
    // ---- 1. Perform the raw search against Azure AI Search ----
    // NOTE: In a real implementation you would call the Azure SDK.
    // Here we mock the result set for illustration purposes.
    const rawResults: KnowledgeItem[] = await this.mockSearchBackend(query);

    // ---- 2. Retrieve the user's permissions ----
    const userPerms = await this.permissionService.getUserPermissions(userId);
    const permKeys = new Set(userPerms.map((p) => p.key));

    // ---- 3. Filter knowledge items according to required_permission ----
    const filtered = rawResults.filter((item) => {
      if (!item.required_permission) {
        // No permission required - always visible
        return true;
      }
      return permKeys.has(item.required_permission);
    });

    return filtered;
  }

  // ------------------------------------------------------------------
  // Mock implementation of the underlying search engine.
  // Replace with the real Azure AI Search client.
  // ------------------------------------------------------------------
  private async mockSearchBackend(query: string): Promise<KnowledgeItem[]> {
    // Example static data
    return [
      {
        id: 'k1',
        title: 'Company Policies',
        content: 'All employees must follow ...',
        department_id: 'dept-hr',
        required_permission: 'knowledge.read',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'k2',
        title: 'Engineering Architecture',
        content: 'The system is built on microservices ...',
        department_id: 'dept-eng',
        required_permission: 'knowledge.eng.read',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }
}
