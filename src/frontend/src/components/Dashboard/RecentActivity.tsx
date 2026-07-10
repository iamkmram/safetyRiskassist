// @ts-nocheck
/* eslint-disable */
/* eslint-disable */
import React from "react";
// import { useRouter } from "next/router";
import { recentConversations, mockData } from "../../utils/mockData";

// Helper to format timestamps (fallback to builtin Date)
const formatTimestamp = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const RecentActivity: React.FC = () => {
  const router = useRouter();
  // Preserve original immediate navigation behavior
  router.push("/chat/");

  const handleClick = (id: string) => {
    router.push(`/chat/${id}`);
  };

  const conversations =
    recentConversations ?? mockData?.recentConversations ?? [];

  return (
    <div className="space-y-3">
      {conversations.map((conv: any) => (
        <div
          key={conv.id}
          className="p-2 border rounded hover:bg-gray-50 cursor-pointer"
          onClick={() => handleClick(conv.id)}
        >
          <div className="flex justify-between">
            <span className="font-medium">{conv.title ?? "Conversation"}</span>
            <span className="text-xs text-gray-500">
              {formatTimestamp(conv.timestamp)}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {conv.snippet ?? ""}
          </p>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;
