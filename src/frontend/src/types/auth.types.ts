
export interface __AuthTypesFix {}

/**
 * AuthUser type added by the compilationfix script.
 * Mirrors the mock user profile specification.
 */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  avatar: string;
  lastLogin: string;
  permissions: string[];
}
