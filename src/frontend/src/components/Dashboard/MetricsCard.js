"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const MetricsCard = ({ title, value }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "p-4 bg-white rounded shadow", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-sm font-medium text-gray-500", children: title }), (0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-2xl font-semibold text-gray-900", children: value })] }));
};
exports.default = MetricsCard;
