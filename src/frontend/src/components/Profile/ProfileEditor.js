import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
// @ts-ignore
import { UserProfile } from "../../../utils/mockData";
export default function ProfileEditor() {
    const [profile, setProfile] = useState(UserProfile);
    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };
    const handleSave = () => {
        // In a real app, call an API. Here we just log.
        console.log("Saved profile:", profile);
        alert("Profile saved successfully!");
    };
    return (_jsxs("form", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { children: "Name" }), _jsx("input", { name: "name", value: profile.name, onChange: handleChange })] }), _jsxs("div", { children: [_jsx("label", { children: "Email" }), _jsx("input", { name: "email", value: profile.email, onChange: handleChange })] }), _jsxs("div", { children: [_jsx("label", { children: "Department" }), _jsx("input", { name: "department", value: profile.department, onChange: handleChange })] }), _jsxs("div", { children: [_jsx("label", { children: "Role" }), _jsx("input", { name: "role", value: profile.role, onChange: handleChange })] }), _jsx("button", { type: "button", onClick: handleSave, children: "Save Changes" })] }));
}
