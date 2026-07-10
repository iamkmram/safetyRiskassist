import React from "react";
import { mockQuickActions } from "../../utils/mockData";

type Action = {
  title: string;
  description: string;
  route: string;
};

const actions: Action[] = [
  {
    title: "Latest COVID-19 Restrictions",
    description: "Get current travel requirements",
    route: "/chat",
  },
  {
    title: "High-Risk Destinations",
    description: "View current travel warnings",
    route: "/chat",
  },
  {
    title: "Emergency Protocols",
    description: "Access emergency procedures",
    route: "/chat",
  },
  {
    title: "Weather Alerts",
    description: "Check weather related travel alerts",
    route: "/chat",
  },
];

export const QuickActions: React.FC = () => (
  <div style={{ display: "grid", gap: "10px", gridTemplateColumns: "repeat(2, 1fr)" }}>
    {actions.map((a) => (
      <div
        key={a.title}
        style={{
          border: "1px solid #ddd",
          padding: "8px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={() => {
          // Navigation stub - replace with router when integrated
          console.log("Navigate to", a.route);
        }}
      >
        <strong>{a.title}</strong>
        <p>{a.description}</p>
      </div>
    ))}
  </div>
);

export default QuickActions;
