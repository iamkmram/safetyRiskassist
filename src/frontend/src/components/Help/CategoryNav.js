/* eslint-disable */
/* eslint-disable */
/* @ts-nocheck */
import React from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { helpArticles } from "../../utils/mockData";

export const placeholder = true;

const categories = Array.from(new Set(helpArticles.map((a) => a.category))).sort();

const CategoryNav = ({ selected, onSelect }) => {
    return (
        <aside className="w-64 border-r p-4">
            <h2 className="font-bold mb-2">Categories</h2>
            <ul>
                {categories.map((cat) => {
                    const count = helpArticles.filter((a) => a.category === cat).length;
                    const isActive = selected === cat;
                    return (
                        <li
                            key={cat}
                            className={`p-2 cursor-pointer ${isActive ? "bg-gray-200" : ""}`}
                            onClick={() => onSelect(cat)}
                        >
                            {cat} ({count})
                        </li>
                    );
                })}
                <li
                    className={`p-2 cursor-pointer ${selected === "" ? "bg-gray-200" : ""}`}
                    onClick={() => onSelect("")}
                >
                    All ({helpArticles.length})
                </li>
            </ul>
        </aside>
    );
};

export default CategoryNav;
