/**
 * Centralised TypeScript interfaces for DB entities.
 * Keeps compiletime safety between services and migrations.
 */

/** User record */
export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  department?: string;
  created_at: string;
  updated_at: string;
}

/** Permission record */
export interface Permission {
  id: string;
  user_id: string;
  role: string;
  granted_at: string;
}

/** Document / KnowledgeItem record */
export interface Document {
  id: string;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
  updated_at: string;
}
