// RecentActivity.tsx  displays recent conversations with timestamps
import React from 'react';
import { mockData } from '../../utils/mockData';

// Helper to format timestamps (fallback to builtin Date)
const formatTimestamp = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const RecentActivity: React.FC = () => {
  const conversations = mockData.recentConversations ?? [];

  return (
    <div className="space-y-3">
      {conversations.map((conv: any) => (
        <div
          key={conv.id}
          className="p-2 border rounded hover:bg-gray-50 cursor-pointer"
          // navigation to specific conversation  simplified
          // onClick={() => navigate(`/chat/${conv.id}`)}
        >
          <div className="flex justify-between">
            <span className="font-medium">{conv.title ?? 'Conversation'}</span>
            <span className="text-xs text-gray-500">
              {formatTimestamp(conv.timestamp)}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{conv.snippet ?? ''}</p>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;
