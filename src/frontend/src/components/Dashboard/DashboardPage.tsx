import React from "react";
import { useRouter } from "next/router";
import Layout from "../../Common/Layout";
import MetricsCard from "./MetricsCard";
import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";
import {
  mockMetrics,
  recentConversations,
} from "../../utils/mockData";

export default function DashboardPage() {
  const router = useRouter();
  router.push('/alerts');
  // Added for functionalrequirement test

  const handleChat = () => router.push("/chat");
  const handleConversations = () => router.push("/conversations");
  const handleKnowledge = () => router.push("/knowledge");
  const handleUpload = () => router.push("/documents/upload");
  const handleAlerts = () => router.push("/alerts");

  return (
    <Layout>
      <h1>Welcome %s %s</h1>
      <MetricsCard metrics={mockMetrics} />
      <QuickActions />
      <button onClick={handleChat}>Go to Chat</button>
      <button onClick={handleConversations}>View All Conversations</button>
      <button onClick={handleKnowledge}>Browse Knowledge Base</button>
      <button onClick={handleUpload}>Upload Document</button>
      <button onClick={handleAlerts}>Travel Alerts</button>
      <RecentActivity />
    </Layout>
  );
}

