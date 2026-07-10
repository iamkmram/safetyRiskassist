import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { mockMetrics } from "../../utils/mockData";

export const MetricsCard = ({ metrics }) => {
  const {
    totalQueries,
    weeklyQueries,
    topTopics,
    recentConversations,
    activeAlerts,
  } = metrics || mockMetrics;

  return _jsxs(
    "div",
    {
      style: {
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "4px",
      },
      children: [
        _jsx("h3", { children: "Dashboard Summary" }),
        _jsxs("p", { children: ["Total Queries: ", totalQueries] }),
        _jsxs("p", { children: ["Weekly Queries: ", weeklyQueries] }),
        _jsxs("p", {
          children: [
            "Top Topics: ",
            topTopics && topTopics.length ? topTopics.join(", ") : "",
          ],
        }),
        _jsxs("p", { children: ["Recent Conversations: ", recentConversations] }),
        _jsxs("p", { children: ["Active Alerts: ", activeAlerts] }),
      ],
    }
  );
};

export default MetricsCard;
