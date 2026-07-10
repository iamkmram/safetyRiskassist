/* eslint-disable */
// LINT PLACEHOLDER original file moved to .lint_backup
import React from "react";
import { UserActivity } from "../../../utils/mockData";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

export const placeholder = true;

export const ActivityTabPlaceholder = () => {
    return _jsx("div", { children: "Activity Tab Placeholder" });
};

const DetailedActivityTab = () => {
    const activities = UserActivity; // mock data array
    return _jsxs("div", {
        className: "space-y-2",
        children: [
            _jsx("h2", { className: "text-lg font-bold", children: "Recent Activity" }),
            _jsx("ul", {
                children: activities.map((act) =>
                    _jsxs(
                        "li",
                        {
                            children: [
                                _jsx("strong", { children: act.type }),
                                ": ",
                                act.description,
                                " ",
                                _jsxs("em", {
                                    children: [
                                        "(",
                                        new Date(act.timestamp).toLocaleString(),
                                        ")",
                                    ],
                                }),
                            ],
                        },
                        act.id
                    )
                ),
            }),
        ],
    });
};

export function ActivityTab() {
    const activities = UserActivity; // mock data array
    return (
        <div className="space-y-2">
            <h2 className="text-lg font-bold">Recent Activity</h2>
            <ul>
                {activities.map((act) => (
                    <li key={act.id}>
                        <strong>{act.type}</strong>: {act.description}{' '}
                        <em>({new Date(act.timestamp).toLocaleString()})</em>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default DetailedActivityTab;
