/* eslint-disable */
/* eslint-disable */
// @ts-nocheck
import React, { useState } from "react";
import Layout from "../Common/Layout";
import CategoryNav from "./CategoryNav";
import { helpArticles } from "../../utils/mockData";

const HelpCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const filtered = helpArticles.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? a.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="flex">
        <CategoryNav
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
        <div className="flex-1 p-4">
          <input
            type="text"
            placeholder="Search help..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded p-2 w-full mb-4"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((article) => (
              <div
                key={article.id}
                className="border rounded p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => (window.location.href = `/help/${article.id}`)}
              >
                <h3 className="font-bold">{article.title}</h3>
                <p className="text-sm text-gray-600">{article.category}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HelpCenter;
