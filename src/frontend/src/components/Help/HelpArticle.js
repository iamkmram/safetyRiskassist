import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from "react-router-dom";
import Layout from "../Common/Layout";
import { helpArticles } from "../../utils/mockData";
const HelpArticle = () => {
    const { articleId } = useParams();
    const article = helpArticles.find((a) => a.id === articleId);
    if (!article) {
        return (_jsx(Layout, { children: _jsx("p", { children: "Article not found." }) }));
    }
    return (_jsx(Layout, { children: _jsxs("div", { className: "max-w-3xl mx-auto p-4", children: [_jsx("h1", { className: "text-2xl font-bold mb-2", children: article.title }), _jsx("p", { className: "text-sm text-gray-500 mb-4", children: article.category }), _jsx("div", { className: "prose", dangerouslySetInnerHTML: { __html: article.content } }), _jsxs("div", { className: "mt-6", children: [_jsx("button", { className: "mr-2 px-4 py-2 bg-green-600 text-white rounded", onClick: () => alert("Thanks for the feedback!"), children: "Was this helpful?" }), _jsx("button", { className: "px-4 py-2 bg-gray-300 rounded", onClick: () => alert("Sorry it wasnt helpful."), children: "Not helpful" })] })] }) }));
};
export default HelpArticle;
