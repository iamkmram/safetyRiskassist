"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
/* eslint-disable */
/* eslint-disable */
const react_1 = require("react");
// @ts-ignore
// @ts-ignore
const mockData_1 = require("../../../utils/mockData");
function PreferencesTab() {
    const [prefs, setPrefs] = (0, react_1.useState)(mockData_1.any);
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
    return ((0, jsx_runtime_1.jsxs)("form", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { children: "Language" }), (0, jsx_runtime_1.jsxs)("select", { value: prefs.language, onChange: e => setPrefs({ ...prefs, language: e.target.value }), children: [(0, jsx_runtime_1.jsx)("option", { children: "English" }), (0, jsx_runtime_1.jsx)("option", { children: "Spanish" }), (0, jsx_runtime_1.jsx)("option", { children: "German" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { children: "Notifications" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: prefs.notifications.email, onChange: () => handleToggle("email") }), "Email"] }), (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: prefs.notifications.desktop, onChange: () => handleToggle("desktop") }), "Desktop"] }), (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: prefs.notifications.teams, onChange: () => handleToggle("teams") }), "Teams"] })] })] }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: handleSave, children: "Save Changes" })] }));
}
exports.default = PreferencesTab;
