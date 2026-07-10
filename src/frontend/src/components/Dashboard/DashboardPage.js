"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Layout_1 = __importDefault(require("../../components/Common/Layout"));
const mockData_1 = require("../../utils/mockData");
const MetricsCard_1 = __importDefault(require("./MetricsCard"));
const QuickActions_1 = __importDefault(require("./QuickActions"));
const RecentActivity_1 = __importDefault(require("./RecentActivity"));
const react_router_dom_1 = require("react-router-dom");
const DashboardPage = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleSearch = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const input = form.elements.namedItem("search");
        const query = input.value.trim();
        if (query) {
            navigate("/chat", { state: { prefilledQuery: query } });
        }
    };
    return ((0, jsx_runtime_1.jsxs)(Layout_1.default, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-yellow-100 p-2 text-center", children: [(0, jsx_runtime_1.jsx)("span", { children: "New travel advisories are available." }), (0, jsx_runtime_1.jsx)("button", { className: "ml-4 underline", onClick: () => { }, children: "Dismiss" })] }), (0, jsx_runtime_1.jsxs)("header", { className: "my-4", children: [(0, jsx_runtime_1.jsxs)("h1", { className: "text-2xl font-bold", children: ["Welcome, ", "John Doe"] }), (0, jsx_runtime_1.jsxs)("p", { className: "text-gray-600", children: ["Department: ", "Travel Ops"] })] }), (0, jsx_runtime_1.jsxs)("section", { className: "grid grid-cols-2 gap-4 mb-6", children: [(0, jsx_runtime_1.jsx)(MetricsCard_1.default, { title: "Total Queries This Week", value: mockData_1.dashboardMetrics.totalQueries }), (0, jsx_runtime_1.jsx)(MetricsCard_1.default, { title: "Weekly Queries", value: mockData_1.dashboardMetrics.weeklyQueries }), (0, jsx_runtime_1.jsx)(MetricsCard_1.default, { title: "Recent Conversations", value: mockData_1.dashboardMetrics.recentConversations.length }), (0, jsx_runtime_1.jsx)(MetricsCard_1.default, { title: "Active Alerts", value: mockData_1.dashboardMetrics.activeAlerts })] }), (0, jsx_runtime_1.jsx)("form", { onSubmit: handleSearch, className: "mb-6", children: (0, jsx_runtime_1.jsx)("input", { name: "search", type: "text", placeholder: "Ask about travel risks, safety guidelines, or destination information...", className: "w-full p-3 border rounded focus:outline-none focus:ring", autoFocus: true }) }), (0, jsx_runtime_1.jsx)("section", { className: "mb-6", children: (0, jsx_runtime_1.jsx)(QuickActions_1.default, {}) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex-1 p-4 bg-white rounded shadow" }), (0, jsx_runtime_1.jsx)("aside", { className: "w-64 ml-4", children: (0, jsx_runtime_1.jsx)(RecentActivity_1.default, {}) })] })] }));
};
exports.default = DashboardPage;
