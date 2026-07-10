import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryNav from './CategoryNav';
import { mockHelpArticles } from '../../utils/mockData';
import Layout from '../Common/Layout';

const HelpCenter: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const filtered = mockHelpArticles.filter(a => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category ? a.category === category : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="flex">
        <CategoryNav selected={category} onSelect={setCategory} />
        <div className="flex-1 p-4">
          <input
            type="text"
            placeholder="Search help..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border p-2 w-full mb-4"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(article => (
              <div
                key={article.id}
                className="border p-4 rounded cursor-pointer hover:shadow"
                onClick={() => navigate(`/help/${article.id}`)}
              >
                <h3 className="font-bold">{article.title}</h3>
                <p className="text-sm text-gray-600">{article.category}</p>
                <p className="mt-2">{article.content.slice(0, 100)}...</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HelpCenter;
