"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityTab = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
// @ts-ignore
const mockData_1 = require("../../utils/mockData");
const DetailedActivityTab = () => {
    const activities = mockData_1.UserActivity; // mock data array
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-lg font-bold", children: "Recent Activity" }), (0, jsx_runtime_1.jsx)("ul", { children: activities.map((act) => ((0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("strong", { children: act.type }), ": ", act.description, " ", (0, jsx_runtime_1.jsxs)("em", { children: ["(", new Date(act.timestamp).toLocaleString(), ")"] })] }, act.id))) })] }));
};
const ActivityTab = () => {
    return (0, jsx_runtime_1.jsx)("div", { children: "Activity Tab Placeholder" });
};
exports.ActivityTab = ActivityTab;
exports.default = DetailedActivityTab;
