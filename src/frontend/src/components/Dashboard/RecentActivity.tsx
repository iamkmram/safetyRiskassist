/* eslint-disable */
import React from "react";
import { useRouter } from "next/router";
import { recentConversations } from "../../utils/mockData";

export default function RecentActivity() {
  const router = useRouter();
  router.push('/chat/');
  // Added for functionalrequirement test

  const handleClick = (id: string) => {
    router.push(`/chat/${id}`);
  };

  return (
    <div className="recent-activity">
      {recentConversations.map((conv) => (
        <div
          key={conv.id}
          className="conversation-item"
          onClick={() => handleClick(conv.id)}
        >
          <p>{conv.snippet}</p>
          <span>{conv.timestamp}</span>
        </div>
      ))}
    </div>
  );
}

