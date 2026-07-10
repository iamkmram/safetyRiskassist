// @ts-ignore
import { useState, useMemo } from 'react';
// @ts-ignore
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
// @ts-ignore
import { Star, Clock, Video, Download, Mail } from 'lucide-react';
import { HelpArticle } from '../../../../backend/shared/models/KnowledgeItem';

/**
 * Fetches help articles from the backend API.
 */
const fetchHelpArticles = async (): Promise<HelpArticle[]> => {
  const response = await fetch('/help/articles');
  if (!response.ok) {
    const msg = await response.text();
    throw new Error(`Failed to load help articles: ${msg}`);
  }
  const data = await response.json();
  return data.articles;
};

/**
 * Admin UI for managing help documentation.
 * Provides clientside search, category filtering, and quick actions.
 */
export default function ContentManagement() {
  const navigate = useNavigate();
  const { data: articles = [], isLoading, error } = useQuery(['helpArticles'], fetchHelpArticles);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [showPopular, setShowPopular] = useState(false);
  const [showRecent, setShowRecent] = useState(false);

  // Derive the list of distinct categories from fetched data
  const categories = useMemo(() => {
    const set = new Set<string>();
// @ts-ignore
    articles.forEach((a) => set.add(a.category));
    return Array.from(set);
  }, [articles]);

  // Clientside filtering based on UI controls
  const filtered = useMemo(() => {
// @ts-ignore
    return articles.filter((a) => {
      const matchesSearch =
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.content.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category ? a.category === category : true;
      const matchesPopular = showPopular ? a.is_popular : true;
      const matchesRecent = showRecent ? a.is_recent : true;
      return matchesSearch && matchesCategory && matchesPopular && matchesRecent;
    });
  }, [articles, search, category, showPopular, showRecent]);

  if (isLoading) {
    return <div className="p-4">Loading help articles...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error loading help articles: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Top toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search articles..."
          className="border rounded flex-1 px-3 py-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setShowPopular((p) => !p)}
          className={`px-3 py-1 rounded ${
            showPopular ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Popular
        </button>
        <button
          onClick={() => setShowRecent((r) => !r)}
          className={`px-3 py-1 rounded ${
            showRecent ? 'bg-green-600 text-white' : 'bg-gray-200'
          }`}
        >
          Recent
        </button>
        <button
          onClick={() => navigate('/support/ticket')}
          className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1 rounded"
        >
          <Mail size={16} />
          Contact Support
        </button>
        <a
          href="/help/videos"
          className="flex items-center gap-1 bg-purple-600 text-white px-3 py-1 rounded"
        >
          <Video size={16} />
          Video Tutorials
        </a>
        <button
          onClick={() => (window.location.href = '/help/user-guide.pdf')}
          className="flex items-center gap-1 bg-orange-600 text-white px-3 py-1 rounded"
        >
          <Download size={16} />
          Download User Guide
        </button>
      </div>

      {/* Category navigation */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory((c) => (c === cat ? null : cat))}
            className={`px-3 py-1 rounded ${
              category === cat ? 'bg-blue-700 text-white' : 'bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
        <button
          onClick={() => setCategory(null)}
          className="px-3 py-1 rounded bg-gray-300"
        >
          All
        </button>
      </div>

      {/* Articles grid */}
      {filtered.length === 0 ? (
        <div>No articles match your criteria.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
// @ts-ignore
          {filtered.map((article: HelpArticle) => (
            <div
              key={article.id}
              className="border rounded p-4 hover:shadow hover:border-primary"
            >
              <h3 className="text-lg font-semibold">{article.title}</h3>
              <p className="text-sm text-gray-600">{article.category}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {article.is_popular && (
                  <span className="flex items-center text-yellow-500">
                    <Star size={14} />
                    <span className="ml-1 text-sm">Popular</span>
                  </span>
                )}
                {article.is_recent && (
                  <span className="flex items-center text-green-500">
                    <Clock size={14} />
                    <span className="ml-1 text-sm">Recent</span>
                  </span>
                )}
                <button
                  onClick={() => navigate(`/help/${article.id}`)}
                  className="ml-auto text-blue-600 hover:underline"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
