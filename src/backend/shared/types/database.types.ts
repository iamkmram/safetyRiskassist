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

/** Types representing rows returned from raw SQL queries */
export interface PermissionRow {
  user_id: string;
  permission_name: string;
}

/** Shape of the data returned by the dashboard metrics endpoint */
export interface DashboardMetrics {
  totalQueriesThisWeek: number;
  mostSearchedTopics: string[];
  recentConversations: {
    id: string;
    snippet: string;
    timestamp: string;
  }[];
  trendingTravelAlerts: number;
}

/* Existing type definitions can be retained below */

export interface UserPermission extends Permission {
  // Helper flag to indicate inherited permissions
  inherited?: boolean;
}
