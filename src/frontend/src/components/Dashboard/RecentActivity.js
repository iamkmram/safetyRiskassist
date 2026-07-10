"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const mockData_1 = require("../../utils/mockData");
const RecentActivity = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const openConversation = (id) => {
        navigate(`/chat/${id}`);
    };
    return ((0, jsx_runtime_1.jsxs)("aside", { className: "space-y-3", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold", children: "Recent Conversations" }), mockData_1.recentConversations.slice(0, 5).map((conv) => ((0, jsx_runtime_1.jsxs)("div", { className: "p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100", onClick: () => openConversation(conv.id), children: [(0, jsx_runtime_1.jsx)("p", { className: "font-medium", children: conv.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500", children: conv.snippet }), (0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-400", children: conv.title })] }, conv.id)))] }));
};
exports.default = RecentActivity;
