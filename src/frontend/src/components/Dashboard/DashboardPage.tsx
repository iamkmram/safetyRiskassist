// DashboardPage.tsx  main dashboard layout
import React from 'react';
import Layout from "../Common/Layout";
import { mockDashboardMetrics, mockQuickActions } from "../../utils/mockData";
import { useNavigate } from 'react-router-dom';
import { mockDashboardMetrics, mockQuickActions } from '../../../utils/mockData';

// Reusable quickaction definition
type QuickAction = {
  title: string;
  description: string;
  query: string;
  route: string;
};

const quickActions: QuickAction[] = [
  {
    title: 'Latest COVID-19 Restrictions',
    description: 'Get current travel requirements',
    query: 'What are the latest COVID-19 travel restrictions?',
    route: '/chat',
  },
  {
    title: 'High-Risk Destinations',
    description: 'View current travel warnings',
    query: 'Show me high-risk travel destinations',
    route: '/chat',
  },
  {
    title: 'Emergency Protocols',
    description: 'Access emergency procedures',
    query: 'What emergency protocols should I follow?',
    route: '/chat',
  },
  {
    title: 'Weather Alerts',
    description: 'Check severe weather warnings',
    query: 'Are there any weather-related travel alerts?',
    route: '/chat',
  },
];

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleQuickAction = (action: QuickAction) => {
    // Prefill the query via state or URL param  simplified here
    navigate(action.route, { state: { prefill: action.query } });
  };

  const handleNav = (path: string) => navigate(path);

  return (
    <Layout>
      <section className="welcome">
        <h1>
          Welcome, {mockData.user?.name ?? 'User'} from {mockData.user?.department ?? 'your department'}
        </h1>
      </section>

      {/* Metrics cards  placeholder using mockData */}
      <section className="metrics">
        {/* ... you can map mockData.metrics to <MetricsCard/> components ... */}
      </section>

      {/* Search bar */}
      <section className="search">
        <input
          type="text"
          placeholder="Ask about travel risks, safety guidelines, or destination information..."
          autoFocus
          className="w-full p-2 border rounded"
          onKeyDown={e => e.key === 'Enter' && handleNav('/chat')}
        />
      </section>

      {/* Quick action cards */}
      <section className="quick-actions grid grid-cols-2 gap-4 mt-4">
        {quickActions.map(action => (
          <div
            key={action.title}
            className="p-4 border rounded cursor-pointer hover:bg-gray-100"
            onClick={() => handleQuickAction(action)}
          >
            <h3 className="font-semibold">{action.title}</h3>
            <p className="text-sm text-gray-600">{action.description}</p>
          </div>
        ))}
      </section>

      {/* Navigation shortcuts */}
      <section className="shortcuts flex space-x-4 mt-6">
        <button onClick={() => handleNav('/conversations')}>View All Conversations</button>
        <button onClick={() => handleNav('/knowledge')}>Browse Knowledge Base</button>
        <button onClick={() => handleNav('/documents/upload')}>Upload Document</button>
        <button onClick={() => handleNav('/alerts')}>Travel Alerts</button>
      </section>

      {/* Recent activity sidebar */}
      <aside className="recent-activity mt-6">
        {/* The RecentActivity component will render timestamps */}
        {/* <RecentActivity /> */}
      </aside>
    </Layout>
  );
};

export default DashboardPage;
