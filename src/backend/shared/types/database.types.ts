/**
 * Centralised TypeScript interfaces for DB entities.
 * Keeps compiletime safety between services and migrations.
 */

/** Knowledge item from original schema */
export type KnowledgeItemDB = {
  article_id: string;
  title: string;
  content: string;
  category: string;
  created_at: Date;
  updated_at: Date;
  is_popular: boolean;
  is_published: boolean;
  view_count: number;
};

/** Legacy Permission from original schema */
export interface PermissionBase {
  permission_id: string;
  role: string;
  resource: string;
  can_read: boolean;
  can_write: boolean;
  created_at: Date;
}

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

/** Permission record (new schema) */
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

/** Detailed user information */
export interface UserDetail {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  profile_photo_url?: string;
  preferences: UserPreferences;
  security: UserSecurity;
}

/** User preferences */
export interface UserPreferences {
  ui_theme: "light" | "dark";
  notifications_enabled: boolean;
  language: "en" | "es" | "fr" | "de" | "zh";
}

/** User security settings */
export interface UserSecurity {
  mfa_enabled: boolean;
  last_password_change: string; // ISO datetime
}

/** Summary of user activity */
export interface ActivitySummary {
  recent_conversations: number;
  documents_viewed: number;
  last_login: string;
}
