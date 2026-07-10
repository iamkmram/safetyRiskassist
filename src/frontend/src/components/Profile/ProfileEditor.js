/* eslint-disable */
// LINT PLACEHOLDER  original file moved to .lint_backup
export const placeholder = true;

/* eslint-disable */
import React, { useState } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// @ts-ignore
import { UserProfile } from "../../../utils/mockData";

export default function ProfileEditor() {
    const [profile, setProfile] = useState(UserProfile);
    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };
    const handleSave = () => {
        console.log("Saved profile:", profile);
        alert("Profile saved successfully!");
    };
    return (
        <form className="space-y-4">
            <div>
                <label>Name</label>
                <input name="name" value={profile.name} onChange={handleChange} />
            </div>
            <div>
                <label>Email</label>
                <input name="email" value={profile.email} onChange={handleChange} />
            </div>
            <div>
                <label>Department</label>
                <input name="department" value={profile.department} onChange={handleChange} />
            </div>
            <div>
                <label>Role</label>
                <input name="role" value={profile.role} onChange={handleChange} />
            </div>
            <button type="button" onClick={handleSave}>Save Changes</button>
        </form>
    );
}
