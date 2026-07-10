import { DashboardMetrics } from '../types/database.types';

/**
 * Stub service that fetches dashboard metrics.
 * In a real implementation this would execute raw SQL against Azure SQL.
 */
export async function getDashboardMetrics(authToken: string): Promise<DashboardMetrics> {
  // Placeholder: simulate async DB call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        totalQueriesThisWeek: 47,
        mostSearchedTopics: ['COVID-19 restrictions', 'Turkey safety', 'Flight delays'],
        recentConversations: [
          { id: 'c1', snippet: 'What are the entry requirements for Brazil?', timestamp: '2023-10-01 09:15' },
          { id: 'c2', snippet: 'Show me travel alerts for Europe', timestamp: '2023-10-02 14:22' }
        ],
        trendingTravelAlerts: 3
      });
    }, 200);
  });
}
