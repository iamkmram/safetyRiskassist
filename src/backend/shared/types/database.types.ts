/* eslint-disable */
// ------------------------------------------------------------------
// Database type definitions
// ------------------------------------------------------------------

export interface Permission {
  id: string;
  key: string;
  description?: string;
  // Optional resource scope (e.g., department, document)
  resource_id?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface UserPermission extends Permission {
  // Helper flag to indicate inherited permissions
  inherited?: boolean;
}
