"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricCard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
require("./MetricCard.css");
/**
 * Simple reusable card for displaying a single KPI.
 */
const MetricCard = ({ title, value }) => ((0, jsx_runtime_1.jsxs)("div", { className: "metric-card", children: [(0, jsx_runtime_1.jsx)("h3", { className: "metric-title", children: title }), (0, jsx_runtime_1.jsx)("p", { className: "metric-value", children: value })] }));
exports.MetricCard = MetricCard;
