/* eslint-disable */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable */
// @ts-nocheck
import { useState } from "react";
import Layout from "../Common/Layout";
import CategoryNav from "./CategoryNav";
import { helpArticles } from "../../utils/mockData";
const HelpCenter = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const filtered = helpArticles.filter((a) => {
        const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? a.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });
    return (_jsx(Layout, { children: _jsxs("div", { className: "flex", children: [_jsx(CategoryNav, { selected: selectedCategory, onSelect: setSelectedCategory }), _jsxs("div", { className: "flex-1 p-4", children: [_jsx("input", { type: "text", placeholder: "Search help...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "border rounded p-2 w-full mb-4" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: filtered.map((article) => (_jsxs("div", { className: "border rounded p-4 cursor-pointer hover:bg-gray-50", onClick: () => (window.location.href = `/help/${article.id}`), children: [_jsx("h3", { className: "font-bold", children: article.title }), _jsx("p", { className: "text-sm text-gray-600", children: article.category })] }, article.id))) })] })] }) }));
};
export default HelpCenter;
