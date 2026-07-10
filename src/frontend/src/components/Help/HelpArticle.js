"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const Layout_1 = __importDefault(require("../Common/Layout"));
const mockData_1 = require("../../utils/mockData");
const HelpArticle = () => {
    const { articleId } = (0, react_router_dom_1.useParams)();
    const article = mockData_1.helpArticles.find((a) => a.id === articleId);
    if (!article) {
        return ((0, jsx_runtime_1.jsx)(Layout_1.default, { children: (0, jsx_runtime_1.jsx)("p", { children: "Article not found." }) }));
    }
    return ((0, jsx_runtime_1.jsx)(Layout_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-3xl mx-auto p-4", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold mb-2", children: article.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500 mb-4", children: article.category }), (0, jsx_runtime_1.jsx)("div", { className: "prose", dangerouslySetInnerHTML: { __html: article.content } }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-6", children: [(0, jsx_runtime_1.jsx)("button", { className: "mr-2 px-4 py-2 bg-green-600 text-white rounded", onClick: () => alert("Thanks for the feedback!"), children: "Was this helpful?" }), (0, jsx_runtime_1.jsx)("button", { className: "px-4 py-2 bg-gray-300 rounded", onClick: () => alert("Sorry it wasnt helpful."), children: "Not helpful" })] })] }) }));
};
exports.default = HelpArticle;
