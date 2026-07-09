/**
 * KnowledgeItem model - represents a knowledgebase article.
 * It is used by the SearchService and the frontend types.
 */
export interface KnowledgeItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  content: string;
  updated_at: string; // ISO8601 timestamp
}
