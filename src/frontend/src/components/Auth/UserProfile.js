import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// @ts-nocheck
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { MetricCard } from './MetricCard';
import './UserProfile.css';
/**
 * UserProfile component now also acts as the main Dashboard.
 * It displays a welcome banner, key metric cards, a central search box,
 * quickaction cards, recent conversations and a dismissible notification banner.
 */
export const UserProfile = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState(null);
    const [showBanner, setShowBanner] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    // Load dashboard metrics on mount
    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await getDashboardMetrics(token);
                setMetrics(data);
            }
            catch (err) {
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
    return (_jsxs("div", { className: "dashboard-container", children: [showBanner && (_jsxs("div", { className: "notification-banner", children: [_jsx("span", { children: "New travel advisories available" }), _jsx("button", { className: "close-btn", onClick: () => setShowBanner(false), "aria-label": "Dismiss" })] })), user && (_jsxs("h2", { className: "welcome-msg", children: ["Welcome, ", user.name, " - ", user.department] })), _jsx("div", { className: "metrics-grid", children: metrics ? (_jsxs(_Fragment, { children: [_jsx(MetricCard, { title: "Queries This Week", value: metrics.totalQueriesThisWeek }), _jsx(MetricCard, { title: "Most Searched Topics", value: metrics.mostSearchedTopics.join(', ') }), _jsx(MetricCard, { title: "Recent Conversations", value: metrics.recentConversations.length }), _jsx(MetricCard, { title: "Trending Travel Alerts", value: metrics.trendingTravelAlerts })] })) : (_jsx("p", { children: "Loading metrics..." })) }), _jsxs("div", { className: "search-section", children: [_jsx("input", { type: "text", className: "search-box", placeholder: "Ask about travel risks, safety guidelines, or destination information...", value: searchQuery, onChange: e => setSearchQuery(e.target.value), onKeyDown: e => e.key === 'Enter' && handleSearchSubmit() }), _jsx("button", { className: "search-btn", onClick: handleSearchSubmit, children: "Search" })] }), _jsx("div", { className: "quick-actions-grid", children: quickActions.map(action => (_jsxs("div", { className: "quick-action-card", onClick: () => navigate(`/chat?query=${encodeURIComponent(action.query)}`), role: "button", children: [_jsx("h3", { children: action.title }), _jsx("p", { children: action.description })] }, action.title))) }), _jsxs("aside", { className: "recent-conversations-sidebar", children: [_jsx("h4", { children: "Recent Conversations" }), _jsx("ul", { children: metrics?.recentConversations.map(conv => (_jsx("li", { children: _jsxs("a", { href: `/chat/${conv.id}`, children: [_jsx("span", { className: "snippet", children: conv.snippet }), _jsx("span", { className: "timestamp", children: conv.timestamp })] }) }, conv.id))) }), _jsx("a", { href: "/conversations", className: "view-all-link", children: "View All Conversations" })] })] }));
};
export default UserProfile;
