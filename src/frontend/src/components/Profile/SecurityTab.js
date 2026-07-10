/* eslint-disable */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable */
import { useState } from "react";
export default function SecurityTab() {
    const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
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
    return (_jsxs("form", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { children: "Current Password" }), _jsx("input", { type: "password", name: "current", value: passwords.current, onChange: handleChange })] }), _jsxs("div", { children: [_jsx("label", { children: "New Password" }), _jsx("input", { type: "password", name: "new", value: passwords.new, onChange: handleChange })] }), _jsxs("div", { children: [_jsx("label", { children: "Confirm New Password" }), _jsx("input", { type: "password", name: "confirm", value: passwords.confirm, onChange: handleChange })] }), _jsx("button", { type: "button", onClick: handleSave, children: "Change Password" })] }));
}
