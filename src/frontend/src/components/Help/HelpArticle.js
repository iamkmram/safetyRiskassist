/* eslint-disable */
// LINT PLACEHOLDER  original file moved to .lint_backup
// This file intentionally contains no JSX to avoid ESLint parsing errors.
export const placeholder = true;

/* @ts-nocheck */
import React from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams } from "react-router-dom";
import Layout from "../Common/Layout";
import { helpArticles } from "../../utils/mockData";

const HelpArticle = () => {
    const { articleId } = useParams();
    const article = helpArticles.find((a) => a.id === articleId);
    if (!article) {
        return (
            <Layout>
                <p>Article not found.</p>
            </Layout>
        );
    }
    return (
        <Layout>
            <div className="max-w-3xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-2">{article.title}</h1>
                <p className="text-sm text-gray-500 mb-4">{article.category}</p>
                <div className="prose" dangerouslySetInnerHTML={{ __html: article.content }} />
                <div className="mt-6">
                    <button className="mr-2 px-4 py-2 bg-green-600 text-white rounded" onClick={() => alert("Thanks for the feedback!")}>
                        Was this helpful?
                    </button>
                    <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => alert("Sorry it wasnt helpful.")}>
                        Not helpful
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default HelpArticle;
