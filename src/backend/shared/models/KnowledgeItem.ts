/**
 * KnowledgeItem model - combines fields from multiple versions.
 * Includes legacy and new identifiers, content details, and metadata.
 */
export interface KnowledgeItem {
  /** Legacy identifier (used in older code) */
  id: string;
  /** Current article identifier (used in newer authentication flow) */
  article_id: string;
  /** Title of the knowledge article */
  title: string;
  /** Short excerpt of the article (legacy) */
  excerpt: string;
  /** Full content of the article */
  content: string;
  /** Category of the article */
  category: string;
  /** Creation timestamp (ISO8601) */
  created_at: string;
  /** Last updated timestamp (ISO8601) */
  updated_at: string;
  /** Indicates if the article is popular */
  is_popular: boolean;
  /** Publication status of the article */
  is_published: boolean;
  /** Number of times the article has been viewed */
  view_count: number;
}
