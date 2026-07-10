 
import React, { useState } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-ignore
import Layout from "../../Common/Layout";
import ProfileEditor from "./ProfileEditor";
import PreferencesTab from "./PreferencesTab";
import SecurityTab from "./SecurityTab";
import ActivityTab from "./ActivityTab";

export const placeholder = true;

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("profile");
    const renderTab = () => {
        switch (activeTab) {
            case "profile":
                return <ProfileEditor />;
            case "preferences":
                return <PreferencesTab />;
            case "security":
                return <SecurityTab />;
            case "activity":
                return <ActivityTab />;
            default:
                return null;
        }
    };
    return (
        <Layout>
            <div className="p-4">
                <nav className="mb-4 flex space-x-4">
                    <button onClick={() => setActiveTab("profile")}>Profile</button>
                    <button onClick={() => setActiveTab("preferences")}>Preferences</button>
                    <button onClick={() => setActiveTab("security")}>Security</button>
                    <button onClick={() => setActiveTab("activity")}>Activity</button>
                </nav>
                {renderTab()}
            </div>
        </Layout>
    );
}
