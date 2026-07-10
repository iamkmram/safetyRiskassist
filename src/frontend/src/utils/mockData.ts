 
export const mockMetrics = {
  totalQueries: 47,
  weeklyQueries: 12,
  topTopics: ["COVID-19 restrictions", "Turkey safety", "Flight delays"],
  activeAlerts: 3,
};

export const recentConversations = [
  { id: "c1", title: "Travel to Italy", snippet: "What are the COVID rules?" },
  { id: "c2", title: "Flight delay query", snippet: "Why is my flight delayed?" },
  { id: "c3", title: "Safety in Japan", snippet: "Is Japan safe postpandemic?" },
];
export const mockUsers: any[] = [];
export const mockQuickActions = [
  { title: 'Latest COVID-19 Restrictions', description: 'Get current travel requirements', query: 'What are the latest COVID-19 travel restrictions?' },
  { title: 'High-Risk Destinations', description: 'View current travel warnings', query: 'Show me high-risk travel destinations' },
  { title: 'Emergency Protocols', description: 'Access emergency procedures', query: 'What emergency protocols should I follow?' },
  { title: 'Weather Alerts', description: 'Check severe weather warnings', query: 'Are there any weather-related travel alerts?' }
];
export const mockData = [];
export const dashboardMetrics = { ...mockMetrics, recentConversations };
export const quickActions = mockQuickActions;
