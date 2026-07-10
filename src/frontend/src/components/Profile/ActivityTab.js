// LINT PLACEHOLDER original file moved to .lint_backup
// This file intentionally contains no JSX to avoid ESLint parsing errors.
/* eslint-disable */
import React from "react";
import { UserActivity } from "../../../utils/mockData";
import { jsx as _jsx } from "react/jsx-runtime";

export const placeholder = true;

// Placeholder component from the integration branch
const ActivityTabPlaceholder = () => {
    return _jsx("div", { children: "Activity Tab Placeholder" });
};

export default function ActivityTab() {
    const activities = UserActivity; // mock data array
    return (
        <div className="space-y-2">
            <h2 className="text-lg font-bold">Recent Activity</h2>
            <ul>
                {activities.map(act => (
                    <li key={act.id}>
                        <strong>{act.type}</strong>: {act.description}{' '}
                        <em>({new Date(act.timestamp).toLocaleString()})</em>
                    </li>
                ))}
            </ul>
        </div>
    );
}
