"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
/* eslint-disable */
/* eslint-disable */
// @ts-nocheck
const react_1 = require("react");
const Layout_1 = __importDefault(require("../Common/Layout"));
const CategoryNav_1 = __importDefault(require("./CategoryNav"));
const mockData_1 = require("../../utils/mockData");
const HelpCenter = () => {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)("");
    const [selectedCategory, setSelectedCategory] = (0, react_1.useState)("");
    const filtered = mockData_1.helpArticles.filter((a) => {
        const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? a.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });
    return ((0, jsx_runtime_1.jsx)(Layout_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "flex", children: [(0, jsx_runtime_1.jsx)(CategoryNav_1.default, { selected: selectedCategory, onSelect: setSelectedCategory }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1 p-4", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search help...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "border rounded p-2 w-full mb-4" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: filtered.map((article) => ((0, jsx_runtime_1.jsxs)("div", { className: "border rounded p-4 cursor-pointer hover:bg-gray-50", onClick: () => (window.location.href = `/help/${article.id}`), children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-bold", children: article.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: article.category })] }, article.id))) })] })] }) }));
};
exports.default = HelpCenter;
