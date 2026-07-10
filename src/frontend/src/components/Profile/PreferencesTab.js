/* eslint-disable */
import React, { useState } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-ignore
import { UserPreferences } from "../../../utils/mockData";

export const placeholder = true;

export default function PreferencesTab() {
    const [prefs, setPrefs] = useState(UserPreferences);
    const handleToggle = (field) => {
        setPrefs({
            ...prefs,
            notifications: { ...prefs.notifications, [field]: !prefs.notifications[field] },
        });
    };
    const handleSave = () => {
        console.log("Saved preferences:", prefs);
        alert("Preferences saved!");
    };
    return (
        <form className="space-y-4">
            <div>
                <label>Language</label>
                <select value={prefs.language} onChange={e => setPrefs({ ...prefs, language: e.target.value })}>
                    <option>English</option>
                    <option>Spanish</option>
                    <option>German</option>
                </select>
            </div>
            <div>
                <label>Notifications</label>
                <div>
                    <label>
                        <input type="checkbox" checked={prefs.notifications.email} onChange={() => handleToggle("email")} />
                        Email
                    </label>
                    <label>
                        <input type="checkbox" checked={prefs.notifications.desktop} onChange={() => handleToggle("desktop")} />
                        Desktop
                    </label>
                    <label>
                        <input type="checkbox" checked={prefs.notifications.teams} onChange={() => handleToggle("teams")} />
                        Teams
                    </label>
                </div>
            </div>
            <button type="button" onClick={handleSave}>Save Changes</button>
        </form>
    );
}
