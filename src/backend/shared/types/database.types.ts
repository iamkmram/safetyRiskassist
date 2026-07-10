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
