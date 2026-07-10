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

// -------------------------------------------------------------------
// HelpArticle interface - mirrors the help_articles table in the DB
// -------------------------------------------------------------------
export interface HelpArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  created_at: string; // ISO8601 timestamp
  updated_at: string; // ISO8601 timestamp
  is_popular: boolean;
  is_recent: boolean;
}
