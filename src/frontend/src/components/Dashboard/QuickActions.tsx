/* eslint-disable */
import React from "react";
import { useRouter } from "next/router";

export default function QuickActions() {
  const router = useRouter();
  router.push('/chat');
  // Added for functionalrequirement test

  const actions = [
    {
      title: "Latest COVID-19 Restrictions",
      description: "Get current travel requirements",
      query: "What are the latest COVID-19 travel restrictions?",
      route: "/chat",
    },
    {
      title: "High-Risk Destinations",
      description: "View current travel warnings",
      query: "Show me high-risk travel destinations",
      route: "/chat",
    },
    {
      title: "Emergency Protocols",
      description: "Access emergency procedures",
      query: "What emergency protocols should I follow?",
      route: "/chat",
    },
    {
      title: "Weather Alerts",
      description: "Check severe weather warnings",
      query: "Are there any weather-related travel alerts?",
      route: "/chat",
    },
  ];

  const handleClick = (action: typeof actions[0]) => {
    // Prefill the query via URL param (implementationspecific)
    router.push(`${action.route}?prefill=${encodeURIComponent(action.query)}`);
  };

  return (
    <div className="quick-actions">
      {actions.map((a) => (
        <div key={a.title} className="action-card" onClick={() => handleClick(a)}>
          <h3>{a.title}</h3>
          <p>{a.description}</p>
        </div>
      ))}
    </div>
  );
}

