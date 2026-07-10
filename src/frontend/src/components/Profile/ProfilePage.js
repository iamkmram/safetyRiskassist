/* eslint-disable */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable */
import { useState } from "react";
// @ts-ignore
import Layout from "../../Common/Layout";
import ProfileEditor from "./ProfileEditor";
import PreferencesTab from "./PreferencesTab";
import SecurityTab from "./SecurityTab";
import ActivityTab from "./ActivityTab";
export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("profile");
    const renderTab = () => {
        switch (activeTab) {
            case "profile":
                return _jsx(ProfileEditor, {});
            case "preferences":
                return _jsx(PreferencesTab, {});
            case "security":
                return _jsx(SecurityTab, {});
            case "activity":
                return _jsx(ActivityTab, {});
            default:
                return null;
        }
    };
    return (_jsx(Layout, { children: _jsxs("div", { className: "p-4", children: [_jsxs("nav", { className: "mb-4 flex space-x-4", children: [_jsx("button", { onClick: () => setActiveTab("profile"), children: "Profile" }), _jsx("button", { onClick: () => setActiveTab("preferences"), children: "Preferences" }), _jsx("button", { onClick: () => setActiveTab("security"), children: "Security" }), _jsx("button", { onClick: () => setActiveTab("activity"), children: "Activity" })] }), renderTab()] }) }));
}
