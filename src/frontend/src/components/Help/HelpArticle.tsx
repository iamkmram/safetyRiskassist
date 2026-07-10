import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { mockHelpArticles } from '../../utils/mockData';
import Layout from '../Common/Layout';

const HelpArticle: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const article = mockHelpArticles.find(a => a.id === articleId);

  const [rating, setRating] = useState(article?.rating ?? 0);
  const [helpful, setHelpful] = useState(article?.helpful ?? 0);
  const [notHelpful, setNotHelpful] = useState(article?.notHelpful ?? 0);

  if (!article) {
    return (
      <Layout>
        <p>Article not found.</p>
      </Layout>
    );
  }

  const handleFeedback = (type: 'helpful' | 'notHelpful') => {
    if (type === 'helpful') setHelpful(prev => prev + 1);
    else setNotHelpful(prev => prev + 1);
    // TODO: send feedback to backend
  };

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold">{article.title}</h1>
        <p className="text-sm text-gray-500">
          {article.category}  Updated{' '}
          {new Date(article.lastUpdated).toLocaleDateString()}
        </p>
        <div
          className="mt-4 prose"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        <div className="mt-6">
          <p>Rating: {rating.toFixed(1)} / 5</p>
          <button onClick={() => setRating(rating + 0.1)} className="mr-2">
            Rate Up
          </button>
          <button onClick={() => setRating(rating - 0.1)} className="mr-2">
            Rate Down
          </button>
        </div>
        <div className="mt-4">
          <p>Was this helpful?</p>
          <button
            onClick={() => handleFeedback('helpful')}
            className="mr-2"
          >{`Yes (${helpful})`}</button>
          <button onClick={() => handleFeedback('notHelpful')}>
            {`No (${notHelpful})`}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default HelpArticle;
