/* eslint-disable */
import React from "react";
import { DashboardMetrics } from "../../utils/mockData";

interface Props {
  metrics: DashboardMetrics;
}

export default function MetricsCard({ metrics }: Props) {
  const {
    totalQueries,
    weeklyQueries,
    topTopics,
    recentConversations,
    activeAlerts,
  } = metrics;

  return (
    <div className="metrics-card">
      <h2>Total Queries: {totalQueries}</h2>
      <p>Weekly Queries: {weeklyQueries}</p>
      <p>Top Topics: {topTopics.join(", ")}</p>
      <p>Recent Conversations: {recentConversations}</p>
      <p>Active Alerts: {activeAlerts}</p>
    </div>
  );
}

