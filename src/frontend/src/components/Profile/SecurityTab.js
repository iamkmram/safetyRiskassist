"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
/* eslint-disable */
/* eslint-disable */
const react_1 = require("react");
function SecurityTab() {
    const [passwords, setPasswords] = (0, react_1.useState)({ current: "", new: "", confirm: "" });
    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };
    const handleSave = () => {
        if (passwords.new !== passwords.confirm) {
            alert("New passwords do not match!");
            return;
        }
        console.log("Password change request:", passwords);
        alert("Password changed successfully!");
    };
    return ((0, jsx_runtime_1.jsxs)("form", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { children: "Current Password" }), (0, jsx_runtime_1.jsx)("input", { type: "password", name: "current", value: passwords.current, onChange: handleChange })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { children: "New Password" }), (0, jsx_runtime_1.jsx)("input", { type: "password", name: "new", value: passwords.new, onChange: handleChange })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { children: "Confirm New Password" }), (0, jsx_runtime_1.jsx)("input", { type: "password", name: "confirm", value: passwords.confirm, onChange: handleChange })] }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: handleSave, children: "Change Password" })] }));
}
exports.default = SecurityTab;
