/**
 * TypeScript interface representing a knowledge item stored in the database.
 */
export interface KnowledgeItem {
  /** Unique identifier (UUID) */
  id: string;
  /** Title of the knowledge item */
  title: string;
  /** Full text content */
  content: string;
  /** Identifier of the user who created the item */
  createdBy?: string;
  /** Timestamp of creation */
  createdAt: string; // ISO string
  /** Timestamp of last update */
  updatedAt: string; // ISO string
}
