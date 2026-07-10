/**
 * Types used across the backend for databaserelated operations.
 */

export interface DatabaseConfig {
  host: string;
  port: string;
  database: string;
  user: string;
  password: string;
  ssl: string; // "true" | "false"
}

/** Payload for permission evaluation */
export interface PermissionCheckRequest {
  subjectId: string;   // UUID of user
  resource: string;   // e.g. "knowledge"
  action: string;      // e.g. "read"
}

/** Result returned by PermissionService */
export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
}
