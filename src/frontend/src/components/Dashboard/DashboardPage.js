/* eslint-disable */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import { useRouter } from "next/router";
import { useNavigate } from "react-router-dom";
import Layout from "../Common/Layout";
import MetricsCard from "./MetricsCard";
import RecentActivity from "./RecentActivity";
import { mockMetrics } from "../../utils/mockData";
const quickActions = [
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
    const handleQuickAction = (action) => {
        navigate(action.route, { state: { prefill: action.query } });
    };
    const handleNav = (path) => router.push(path);
    return (_jsxs(Layout, { children: [_jsx("section", { className: "welcome", children: _jsx("h1", { children: "Welcome, User" }) }), _jsx("section", { className: "metrics", children: _jsx(MetricsCard, { metrics: mockMetrics }) }), _jsx("section", { className: "search", children: _jsx("input", { type: "text", placeholder: "Ask about travel risks, safety guidelines, or destination information...", autoFocus: true, className: "w-full p-2 border rounded", onKeyDown: e => e.key === "Enter" && handleNav("/chat") }) }), _jsx("section", { className: "quick-actions grid grid-cols-2 gap-4 mt-4", children: quickActions.map(action => (_jsxs("div", { className: "p-4 border rounded cursor-pointer hover:bg-gray-100", onClick: () => handleQuickAction(action), children: [_jsx("h3", { className: "font-semibold", children: action.title }), _jsx("p", { className: "text-sm text-gray-600", children: action.description })] }, action.title))) }), _jsxs("section", { className: "shortcuts flex space-x-4 mt-6", children: [_jsx("button", { onClick: handleChat, children: "Go to Chat" }), _jsx("button", { onClick: handleConversations, children: "View All Conversations" }), _jsx("button", { onClick: handleKnowledge, children: "Browse Knowledge Base" }), _jsx("button", { onClick: handleUpload, children: "Upload Document" }), _jsx("button", { onClick: handleAlerts, children: "Travel Alerts" })] }), _jsx("aside", { className: "recent-activity mt-6", children: _jsx(RecentActivity, {}) })] }));
}
