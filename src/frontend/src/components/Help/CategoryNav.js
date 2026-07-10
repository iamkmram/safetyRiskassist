import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { helpArticles } from "../../utils/mockData";
const categories = Array.from(new Set(helpArticles.map((a) => a.category))).sort();
const CategoryNav = ({ selected, onSelect }) => {
    return (_jsxs("aside", { className: "w-64 border-r p-4", children: [_jsx("h2", { className: "font-bold mb-2", children: "Categories" }), _jsxs("ul", { children: [categories.map((cat) => {
                        const count = helpArticles.filter((a) => a.category === cat).length;
                        const isActive = selected === cat;
                        return (_jsxs("li", { className: `p-2 cursor-pointer ${isActive ? "bg-gray-200" : ""}`, onClick: () => onSelect(cat), children: [cat, " (", count, ")"] }, cat));
                    }), _jsxs("li", { className: `p-2 cursor-pointer ${selected === "" ? "bg-gray-200" : ""}`, onClick: () => onSelect(""), children: ["All (", helpArticles.length, ")"] })] })] }));
};
export default CategoryNav;
