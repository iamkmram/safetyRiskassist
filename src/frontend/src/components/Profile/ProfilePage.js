"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
/* eslint-disable */
/* eslint-disable */
const react_1 = require("react");
// @ts-ignore
const Layout_1 = __importDefault(require("../../Common/Layout"));
const ProfileEditor_1 = __importDefault(require("./ProfileEditor"));
const PreferencesTab_1 = __importDefault(require("./PreferencesTab"));
const SecurityTab_1 = __importDefault(require("./SecurityTab"));
const ActivityTab_1 = __importDefault(require("./ActivityTab"));
function ProfilePage() {
    const [activeTab, setActiveTab] = (0, react_1.useState)("profile");
    const renderTab = () => {
        switch (activeTab) {
            case "profile":
                return (0, jsx_runtime_1.jsx)(ProfileEditor_1.default, {});
            case "preferences":
                return (0, jsx_runtime_1.jsx)(PreferencesTab_1.default, {});
            case "security":
                return (0, jsx_runtime_1.jsx)(SecurityTab_1.default, {});
            case "activity":
                return (0, jsx_runtime_1.jsx)(ActivityTab_1.default, {});
            default:
                return null;
        }
    };
    return ((0, jsx_runtime_1.jsx)(Layout_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "p-4", children: [(0, jsx_runtime_1.jsxs)("nav", { className: "mb-4 flex space-x-4", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab("profile"), children: "Profile" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab("preferences"), children: "Preferences" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab("security"), children: "Security" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab("activity"), children: "Activity" })] }), renderTab()] }) }));
}
exports.default = ProfilePage;
