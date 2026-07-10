import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './MetricCard.css';
/**
 * Simple reusable card for displaying a single KPI.
 */
export const MetricCard = ({ title, value }) => (_jsxs("div", { className: "metric-card", children: [_jsx("h3", { className: "metric-title", children: title }), _jsx("p", { className: "metric-value", children: value })] }));
