import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
// @ts-ignore
import { UserPreferences } from "../../../utils/mockData";
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
    return (_jsxs("form", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { children: "Language" }), _jsxs("select", { value: prefs.language, onChange: e => setPrefs({ ...prefs, language: e.target.value }), children: [_jsx("option", { children: "English" }), _jsx("option", { children: "Spanish" }), _jsx("option", { children: "German" })] })] }), _jsxs("div", { children: [_jsx("label", { children: "Notifications" }), _jsxs("div", { children: [_jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: prefs.notifications.email, onChange: () => handleToggle("email") }), "Email"] }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: prefs.notifications.desktop, onChange: () => handleToggle("desktop") }), "Desktop"] }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: prefs.notifications.teams, onChange: () => handleToggle("teams") }), "Teams"] })] })] }), _jsx("button", { type: "button", onClick: handleSave, children: "Save Changes" })] }));
}
