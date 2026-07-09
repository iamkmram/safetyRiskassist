/**
 * Knowledge item model - used for search results.
 */
export interface KnowledgeItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  updated_at: string; // ISO8601
}
