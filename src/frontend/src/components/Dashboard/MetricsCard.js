import { jsxs as _jsxs } from "react/jsx-runtime";
export default function MetricsCard({ metrics }) {
    const { totalQueries, weeklyQueries, topTopics, recentConversations, activeAlerts, } = metrics;
    return (_jsxs("div", { className: "metrics-card", children: [_jsxs("h2", { children: ["Total Queries: ", totalQueries] }), _jsxs("p", { children: ["Weekly Queries: ", weeklyQueries] }), _jsxs("p", { children: ["Top Topics: ", topTopics.join(", ")] }), _jsxs("p", { children: ["Recent Conversations: ", recentConversations] }), _jsxs("p", { children: ["Active Alerts: ", activeAlerts] })] }));
}
