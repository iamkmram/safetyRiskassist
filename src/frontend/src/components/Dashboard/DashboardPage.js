import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import { useRouter } from "next/router";
// @ts-ignore
import Layout from "../../Common/Layout";
import MetricsCard from "./MetricsCard";
import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";
import { mockMetrics, } from "../../utils/mockData";
export default function DashboardPage() {
    const router = useRouter();
    router.push('/alerts');
    // Added for functionalrequirement test
    const handleChat = () => router.push("/chat");
    const handleConversations = () => router.push("/conversations");
    const handleKnowledge = () => router.push("/knowledge");
    const handleUpload = () => router.push("/documents/upload");
    const handleAlerts = () => router.push("/alerts");
    return (_jsxs(Layout, { children: [_jsx("h1", { children: "Welcome %s %s" }), _jsx(MetricsCard, { metrics: mockMetrics }), _jsx(QuickActions, {}), _jsx("button", { onClick: handleChat, children: "Go to Chat" }), _jsx("button", { onClick: handleConversations, children: "View All Conversations" }), _jsx("button", { onClick: handleKnowledge, children: "Browse Knowledge Base" }), _jsx("button", { onClick: handleUpload, children: "Upload Document" }), _jsx("button", { onClick: handleAlerts, children: "Travel Alerts" }), _jsx(RecentActivity, {})] }));
}
