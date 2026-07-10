/**
 * KnowledgeItem model - represents a single knowledgebase article.
 * This file is used by both the search and retrieve functions.
 */
export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string; // ISO8601 timestamp
  updatedAt?: string;
}
