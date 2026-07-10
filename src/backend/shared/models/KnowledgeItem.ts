/**
 * KnowledgeItem - represents a searchable piece of knowledge.
 */
export interface KnowledgeItem {
  /** Unique identifier */
  id: string;
  /** Human readable title */
  title: string;
  /** Full content or excerpt */
  content: string;
  /** Tags for categorisation */
  tags?: string[];
  /** Timestamp of creation (ISO string) */
  createdAt: string;
}
