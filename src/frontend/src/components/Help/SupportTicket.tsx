import React, { useState } from 'react';
import Layout from '../Common/Layout';
import { useNavigate } from 'react-router-dom';

export const SupportTicket: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app you would POST to an API endpoint.
    console.log('Ticket submitted', { subject, description });
    setSubmitted(true);
    // Redirect back to help center after a short delay
    setTimeout(() => navigate('/help'), 2000);
  };

  if (submitted) {
    return (
      <Layout>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">Ticket Submitted</h2>
          <p>Thank you! Our support team will get back to you shortly.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-4">Contact Support</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              required
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              rows={5}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Ticket
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default SupportTicket;
