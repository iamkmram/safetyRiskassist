// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { MetricCard } from './MetricCard';
import './UserProfile.css';

/**
 * UserProfile component now also acts as the main Dashboard.
 * It displays a welcome banner, key metric cards, a central search box,
 * quickaction cards, recent conversations and a dismissible notification banner.
 */
export const UserProfile: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState<{
    totalQueriesThisWeek: number;
    mostSearchedTopics: string[];
    recentConversations: { id: string; snippet: string; timestamp: string }[];
    trendingTravelAlerts: number;
  } | null>(null);

  const [showBanner, setShowBanner] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Load dashboard metrics on mount
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getDashboardMetrics(token);
        setMetrics(data);
      } catch (err) {
        console.error('Failed to load dashboard metrics', err);
      }
    };
    fetchMetrics();
  }, [token]);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      const encoded = encodeURIComponent(searchQuery.trim());
      navigate(`/chat?query=${encoded}`);
    }
  };

  const quickActions = [
    {
      title: 'Latest COVID19 Restrictions',
      description: 'Get current travel requirements',
      query: 'What are the latest COVID19 travel restrictions?'
    },
    {
      title: 'HighRisk Destinations',
      description: 'View current travel warnings',
      query: 'Show me highrisk travel destinations'
    },
    {
      title: 'Emergency Protocols',
      description: 'Access emergency procedures',
      query: 'What emergency protocols should I follow?'
    },
    {
      title: 'Weather Alerts',
      description: 'Check severe weather warnings',
      query: 'Are there any weatherrelated travel alerts?'
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Notification Banner */}
      {showBanner && (
        <div className="notification-banner">
          <span>New travel advisories available</span>
          <button
            className="close-btn"
            onClick={() => setShowBanner(false)}
            aria-label="Dismiss"
          >

          </button>
        </div>
      )}

      {/* Welcome Message */}
      {user && (
        <h2 className="welcome-msg">
          Welcome, {user.name} - {user.department}
        </h2>
      )}

      {/* Metrics Cards */}
      <div className="metrics-grid">
        {metrics ? (
          <>
            <MetricCard
              title="Queries This Week"
              value={metrics.totalQueriesThisWeek}
            />
            <MetricCard
              title="Most Searched Topics"
              value={metrics.mostSearchedTopics.join(', ')}
            />
            <MetricCard
              title="Recent Conversations"
              value={metrics.recentConversations.length}
            />
            <MetricCard
              title="Trending Travel Alerts"
              value={metrics.trendingTravelAlerts}
            />
          </>
        ) : (
          <p>Loading metrics...</p>
        )}
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <input
          type="text"
          className="search-box"
          placeholder="Ask about travel risks, safety guidelines, or destination information..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearchSubmit()}
        />
        <button className="search-btn" onClick={handleSearchSubmit}>
          Search
        </button>
      </div>

      {/* Quick Action Cards */}
      <div className="quick-actions-grid">
        {quickActions.map(action => (
          <div
            key={action.title}
            className="quick-action-card"
            onClick={() => navigate(`/chat?query=${encodeURIComponent(action.query)}`)}
            role="button"
          >
            <h3>{action.title}</h3>
            <p>{action.description}</p>
          </div>
        ))}
      </div>

      {/* Right Sidebar - Recent Conversations */}
      <aside className="recent-conversations-sidebar">
        <h4>Recent Conversations</h4>
        <ul>
          {metrics?.recentConversations.map(conv => (
            <li key={conv.id}>
              <a href={`/chat/${conv.id}`}>
                <span className="snippet">{conv.snippet}</span>
                <span className="timestamp">{conv.timestamp}</span>
              </a>
            </li>
          ))}
        </ul>
        <a href="/conversations" className="view-all-link">
          View All Conversations
        </a>
      </aside>
    </div>
  );
};

export default UserProfile;
