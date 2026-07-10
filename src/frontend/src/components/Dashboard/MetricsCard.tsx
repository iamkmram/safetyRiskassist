/* eslint-disable */
import React from "react";
import { mockMetrics } from "../../utils/mockData";

export const MetricsCard: React.FC = () => (
  <div style={{ border: "1px solid #ccc", padding: "10px", borderRadius: "4px" }}>
    <h3>Dashboard Summary</h3>
    <p>Total Queries: {mockMetrics.totalQueries}</p>
    <p>Weekly Queries: {mockMetrics.weeklyQueries}</p>
    <p>Active Alerts: {mockMetrics.activeAlerts}</p>
  </div>
);

export default MetricsCard;
