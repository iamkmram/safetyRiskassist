"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
/* eslint-disable */
/* eslint-disable */
const react_1 = require("react");
// @ts-ignore
// @ts-ignore
const mockData_1 = require("../../../utils/mockData");
function ProfileEditor() {
    const [profile, setProfile] = (0, react_1.useState)(mockData_1.any);
    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };
    const handleSave = () => {
        // In a real app, call an API. Here we just log.
        console.log("Saved profile:", profile);
        alert("Profile saved successfully!");
    };
    return ((0, jsx_runtime_1.jsxs)("form", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { children: "Name" }), (0, jsx_runtime_1.jsx)("input", { name: "name", value: profile.name, onChange: handleChange })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { children: "Email" }), (0, jsx_runtime_1.jsx)("input", { name: "email", value: profile.email, onChange: handleChange })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { children: "Department" }), (0, jsx_runtime_1.jsx)("input", { name: "department", value: profile.department, onChange: handleChange })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { children: "Role" }), (0, jsx_runtime_1.jsx)("input", { name: "role", value: profile.role, onChange: handleChange })] }), (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: handleSave, children: "Save Changes" })] }));
}
exports.default = ProfileEditor;
