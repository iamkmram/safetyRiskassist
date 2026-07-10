import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { mockMetrics } from "../../utils/mockData";
export const MetricsCard = () => (_jsxs("div", { style: { border: "1px solid #ccc", padding: "10px", borderRadius: "4px" }, children: [_jsx("h3", { children: "Dashboard Summary" }), _jsxs("p", { children: ["Total Queries: ", mockMetrics.totalQueries] }), _jsxs("p", { children: ["Weekly Queries: ", mockMetrics.weeklyQueries] }), _jsxs("p", { children: ["Active Alerts: ", mockMetrics.activeAlerts] })] }));
export default MetricsCard;
