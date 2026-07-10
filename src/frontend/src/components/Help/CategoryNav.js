"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const mockData_1 = require("../../utils/mockData");
const categories = Array.from(new Set(mockData_1.helpArticles.map((a) => a.category))).sort();
const CategoryNav = ({ selected, onSelect }) => {
    return ((0, jsx_runtime_1.jsxs)("aside", { className: "w-64 border-r p-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "font-bold mb-2", children: "Categories" }), (0, jsx_runtime_1.jsxs)("ul", { children: [categories.map((cat) => {
                        const count = mockData_1.helpArticles.filter((a) => a.category === cat).length;
                        const isActive = selected === cat;
                        return ((0, jsx_runtime_1.jsxs)("li", { className: `p-2 cursor-pointer ${isActive ? "bg-gray-200" : ""}`, onClick: () => onSelect(cat), children: [cat, " (", count, ")"] }, cat));
                    }), (0, jsx_runtime_1.jsxs)("li", { className: `p-2 cursor-pointer ${selected === "" ? "bg-gray-200" : ""}`, onClick: () => onSelect(""), children: ["All (", mockData_1.helpArticles.length, ")"] })] })] }));
};
exports.default = CategoryNav;
