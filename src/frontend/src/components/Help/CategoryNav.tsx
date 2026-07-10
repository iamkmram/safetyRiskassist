import React from 'react';
import { mockHelpArticles } from '../../utils/mockData';

type Props = {
  selected: string | null;
  onSelect: (category: string | null) => void;
};

const categories = Array.from(
  new Set(mockHelpArticles.map(a => a.category))
);

const CategoryNav: React.FC<Props> = ({ selected, onSelect }) => {
  return (
    <nav className="w-48 p-4 border-r">
      <h2 className="font-bold mb-2">Categories</h2>
      <ul>
        <li
          className={`cursor-pointer py-1 ${!selected ? 'font-semibold' : ''}`}
          onClick={() => onSelect(null)}
        >
          All ({mockHelpArticles.length})
        </li>
        {categories.map(cat => (
          <li
            key={cat}
            className={`cursor-pointer py-1 ${
              selected === cat ? 'font-semibold' : ''
            }`}
            onClick={() => onSelect(cat)}
          >
            {cat} ({mockHelpArticles.filter(a => a.category === cat).length})
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CategoryNav;
