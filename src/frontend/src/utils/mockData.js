 
export const mockUsers = [
    {
        id: 'user-001',
        name: 'Sarah Chen',
        email: 'sarah.chen@dertour.com',
        department: 'Risk Assessment',
        role: 'Travel Advisor',
        avatar: '/avatars/sarah.jpg',
        lastLogin: '2026-07-08T14:30:00Z',
        permissions: ['knowledge:read', 'documents:view']
    },
    {
        id: 'user-002',
        name: 'Marcus Weber',
        email: 'marcus.weber@dertour.com',
        department: 'Operations',
        role: 'Senior Manager',
        avatar: '/avatars/marcus.jpg',
        lastLogin: '2026-07-07T09:15:00Z',
        permissions: ['knowledge:read', 'documents:view']
    },
    {
        id: 'user-003',
        name: 'Emma Schneider',
        email: 'emma.schneider@dertour.com',
        department: 'Customer Service',
        role: 'Travel Specialist',
        avatar: '/avatars/emma.jpg',
        lastLogin: '2026-07-06T11:45:00Z',
        permissions: ['knowledge:read']
    }
];
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
export const mockQuickActions = [];
export const mockData = [];
export const DashboardMetrics = {};
