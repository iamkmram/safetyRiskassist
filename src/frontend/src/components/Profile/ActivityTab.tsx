/* eslint-disable */
import React from "react";
// @ts-ignore
import { UserActivity } from "../../utils/mockData";

const DetailedActivityTab: React.FC = () => {
  const activities: UserActivity[] = UserActivity; // mock data array

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-bold">Recent Activity</h2>
      <ul>
        {activities.map((act) => (
          <li key={act.id}>
            <strong>{act.type}</strong>: {act.description}{" "}
            <em>({new Date(act.timestamp).toLocaleString()})</em>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const ActivityTab: React.FC = () => {
  return <div>Activity Tab Placeholder</div>;
};

export default DetailedActivityTab;
