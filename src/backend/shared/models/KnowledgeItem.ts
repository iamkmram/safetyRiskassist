/**
 * TypeScript model for a Knowledge Item.
 * Mirrors the SQL table defined in 001_initial_schema.sql.
 */

export interface KnowledgeItem {
  id: string; // UUID
  title: string;
  content: string;
  category?: string;
  createdBy: string; // user UUID
  createdAt: string; // ISO8601 timestamp
  updatedAt: string; // ISO8601 timestamp
}
