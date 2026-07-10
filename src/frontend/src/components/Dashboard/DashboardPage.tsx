import React from "react";
import Layout from "../../components/Common/Layout";
import { dashboardMetrics } from "../../utils/mockData";
import MetricsCard from "./MetricsCard";
import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";
import { useNavigate } from "react-router-dom";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const input = form.elements.namedItem("search") as HTMLInputElement;
    const query = input.value.trim();
    if (query) {
      navigate("/chat", { state: { prefilledQuery: query } });
    }
  };

  return (
    <Layout>
      {/* Notification banner */}
      <div className="bg-yellow-100 p-2 text-center">
        <span>New travel advisories are available.</span>
        <button className="ml-4 underline" onClick={() => {/* dismiss logic */}}>
          Dismiss
        </button>
      </div>

      {/* Welcome message */}
      <header className="my-4">
        <h1 className="text-2xl font-bold">
          Welcome, {/* user name placeholder */}John Doe
        </h1>
        <p className="text-gray-600">Department: {/* department placeholder */}Travel Ops</p>
      </header>

      {/* Metrics cards */}
      <section className="grid grid-cols-2 gap-4 mb-6">
        <MetricsCard title="Total Queries This Week" value={dashboardMetrics.totalQueries} />
        <MetricsCard title="Weekly Queries" value={dashboardMetrics.weeklyQueries} />
        <MetricsCard title="Recent Conversations" value={dashboardMetrics.recentConversations.length} />
        <MetricsCard title="Active Alerts" value={dashboardMetrics.activeAlerts} />
      </section>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <input
          name="search"
          type="text"
          placeholder="Ask about travel risks, safety guidelines, or destination information..."
          className="w-full p-3 border rounded focus:outline-none focus:ring"
          autoFocus
        />
      </form>

      {/* Quick action cards */}
      <section className="mb-6">
        <QuickActions />
      </section>

      {/* Main content layout */}
      <div className="flex">
        {/* Placeholder for main content (e.g., charts) */}
        <div className="flex-1 p-4 bg-white rounded shadow">
          {/* Future content goes here */}
        </div>

        {/* Recent activity sidebar */}
        <aside className="w-64 ml-4">
          <RecentActivity />
        </aside>
      </div>
    </Layout>
  );
};

export default DashboardPage;
