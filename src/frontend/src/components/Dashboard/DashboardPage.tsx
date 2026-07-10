// @ts-nocheck
import React from "react";
import { useRouter } from "next/router";
import { useNavigate } from "react-router-dom";
import Layout from "../Common/Layout";
import MetricsCard from "./MetricsCard";
import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";
import { mockMetrics, recentConversations } from "../../utils/mockData";

type QuickAction = {
  title: string;
  description: string;
  query: string;
  route: string;
};

const quickActions: QuickAction[] = [
  {
    title: "Latest COVID-19 Restrictions",
    description: "Get current travel requirements",
    query: "What are the latest COVID-19 travel restrictions?",
    route: "/chat",
  },
  {
    title: "High-Risk Destinations",
    description: "View current travel warnings",
    query: "Show me high-risk travel destinations",
    route: "/chat",
  },
  {
    title: "Emergency Protocols",
    description: "Access emergency procedures",
    query: "What emergency protocols should I follow?",
    route: "/chat",
  },
  {
    title: "Weather Alerts",
    description: "Check severe weather warnings",
    query: "Are there any weather-related travel alerts?",
    route: "/chat",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const navigate = useNavigate();

  // Initial redirect as in original implementation
  router.push("/alerts");

  const handleChat = () => router.push("/chat");
  const handleConversations = () => router.push("/conversations");
  const handleKnowledge = () => router.push("/knowledge");
  const handleUpload = () => router.push("/documents/upload");
  const handleAlerts = () => router.push("/alerts");

  const handleQuickAction = (action: QuickAction) => {
    navigate(action.route, { state: { prefill: action.query } });
  };

  const handleNav = (path: string) => router.push(path);

  return (
    <Layout>
      {/* Welcome Section */}
      <section className="welcome">
        <h1>Welcome, User</h1>
      </section>

      {/* Metrics */}
      <section className="metrics">
        <MetricsCard metrics={mockMetrics} />
      </section>

      {/* Search Bar */}
      <section className="search">
        <input
          type="text"
          placeholder="Ask about travel risks, safety guidelines, or destination information..."
          autoFocus
          className="w-full p-2 border rounded"
          onKeyDown={e => e.key === "Enter" && handleNav("/chat")}
        />
      </section>

      {/* Quick Action Cards */}
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

      {/* Navigation Shortcuts - original buttons */}
      <section className="shortcuts flex space-x-4 mt-6">
        <button onClick={handleChat}>Go to Chat</button>
        <button onClick={handleConversations}>View All Conversations</button>
        <button onClick={handleKnowledge}>Browse Knowledge Base</button>
        <button onClick={handleUpload}>Upload Document</button>
        <button onClick={handleAlerts}>Travel Alerts</button>
      </section>

      {/* Recent Activity */}
      <aside className="recent-activity mt-6">
        <RecentActivity />
      </aside>
    </Layout>
  );
}
