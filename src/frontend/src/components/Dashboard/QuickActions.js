"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const mockData_1 = require("../../utils/mockData");
const QuickActions = () => {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const handleClick = (query) => {
        navigate("/chat", { state: { prefilledQuery: query } });
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-4", children: mockData_1.quickActions.map((action, idx) => ((0, jsx_runtime_1.jsxs)("button", { className: "p-4 bg-blue-50 rounded hover:bg-blue-100 text-left", onClick: () => handleClick(action.query), children: [(0, jsx_runtime_1.jsx)("h4", { className: "font-medium", children: action.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: action.description })] }, idx))) }));
};
exports.default = QuickActions;
