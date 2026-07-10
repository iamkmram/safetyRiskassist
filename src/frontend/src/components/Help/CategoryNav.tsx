 
 
// @ts-nocheck
import React from "react";
import { helpArticles } from "../../utils/mockData";

type Props = {
  selected: string;
  onSelect: (category: string) => void;
};

const categories = Array.from(
  new Set(helpArticles.map((a) => a.category))
).sort();

const CategoryNav: React.FC<Props> = ({ selected, onSelect }) => {
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
