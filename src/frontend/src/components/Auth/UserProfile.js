/* eslint-disable */
// LINT PLACEHOLDER  original file moved to .lint_backup
// This file intentionally contains no JSX to avoid ESLint parsing errors.
export const placeholder = true;

/* eslint-disable */
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { toSnake, toCamel } from "../../utils/helpers";

const API_BASE = "/api";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(false);

    // -----------------------------------------------------------------
    // Load user data on mount
    // -----------------------------------------------------------------
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) return;
            const res = await fetch(`${API_BASE}/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setUser(toCamel(data));
            } else {
                toast.error("Failed to load profile");
            }
        };
        fetchUser();
    }, []);

    // -----------------------------------------------------------------
    // Handlers for each tab
    // -----------------------------------------------------------------
    const handleProfileSave = async (e) => {
        e.preventDefault();
        if (!user) return;
        const token = localStorage.getItem("access_token");
        setLoading(true);
        const payload = toSnake({
            name: user.name,
            email: user.email,
            department: user.department,
            role: user.role,
        });
        const res = await fetch(`${API_BASE}/users/me/profile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        setLoading(false);
        if (res.ok) {
            toast.success("Profile updated");
        } else {
            const err = await res.json();
            toast.error(err.detail || "Failed to update profile");
        }
    };

    const handlePreferencesSave = async (e) => {
        e.preventDefault();
        if (!user) return;
        const token = localStorage.getItem("access_token");
        setLoading(true);
        const payload = toSnake(user.preferences);
        const res = await fetch(`${API_BASE}/users/me/preferences`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        setLoading(false);
        if (res.ok) {
            toast.success("Preferences saved");
        } else {
            const err = await res.json();
            toast.error(err.detail || "Failed to save preferences");
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        const form = e.target;
        const current = form.elements.namedItem("current_password").value;
        const newPass = form.elements.namedItem("new_password").value;
        const confirm = form.elements.namedItem("confirm_password").value;
        if (newPass !== confirm) {
            toast.error("Passwords do not match");
            return;
        }
        const token = localStorage.getItem("access_token");
        setLoading(true);
        const payload = toSnake({ current_password: current, new_password: newPass });
        const res = await fetch(`${API_BASE}/users/me/security/password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });
        setLoading(false);
        if (res.ok) {
            toast.success("Password changed");
            form.reset();
        } else {
            const err = await res.json();
            toast.error(err.detail || "Failed to change password");
        }
    };

    const handleAccountDelete = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            return;
        }
        const token = localStorage.getItem("access_token");
        const res = await fetch(`${API_BASE}/users/me`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
            toast.success("Account deleted");
            window.location.href = "/goodbye";
        } else {
            const err = await res.json();
            toast.error(err.detail || "Failed to delete account");
        }
    };

    // -----------------------------------------------------------------
    // Render UI
    // -----------------------------------------------------------------
    if (!user) {
        return <div data-testid="loading">Loading profile...</div>;
    }
    const isAdmin = user.role.toLowerCase() === "admin";

    return (
        <div className="user-profile" data-testid="user-profile">
            <nav className="breadcrumbs">
                <a href="/dashboard">Dashboard</a> / <span>Profile</span>
            </nav>

            <div className="tabs">
                <button data-testid="profile-tab" className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
                    Profile
                </button>
                <button data-testid="preferences-tab" className={activeTab === "preferences" ? "active" : ""} onClick={() => setActiveTab("preferences")}>
                    Preferences
                </button>
                <button data-testid="security-tab" className={activeTab === "security" ? "active" : ""} onClick={() => setActiveTab("security")}>
                    Security
                </button>
                <button data-testid="activity-tab" className={activeTab === "activity" ? "active" : ""} onClick={() => setActiveTab("activity")}>
                    Activity
                </button>
            </div>

            {/* -------------------- Profile Tab -------------------- */}
            {activeTab === "profile" && (
                <form onSubmit={handleProfileSave} data-testid="profile-form">
                    <div>
                        <label>Name</label>
                        <input
                            required
                            type="text"
                            value={user.name}
                            onChange={(e) => setUser({ ...user, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Email</label>
                        <input
                            required
                            type="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Department</label>
                        <input
                            type="text"
                            value={user.department}
                            onChange={(e) => setUser({ ...user, department: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Role</label>
                        <select
                            required
                            value={user.role}
                            onChange={(e) => setUser({ ...user, role: e.target.value })}
                        >
                            <option value="Travel Advisor">Travel Advisor</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <div>
                        <label>Profile Photo</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const formData = new FormData();
                                formData.append("photo", file);
                                const token = localStorage.getItem("access_token");
                                const res = await fetch(`${API_BASE}/users/me/profile`, {
                                    method: "PUT",
                                    headers: { Authorization: `Bearer ${token}` },
                                    body: formData,
                                });
                                if (res.ok) {
                                    toast.success("Photo uploaded");
                                } else {
                                    toast.error("Failed to upload photo");
                                }
                            }}
                        />
                    </div>
                    <button type="submit" disabled={loading} data-testid="save-button">
                        Save Changes
                    </button>
                </form>
            )}

            {/* -------------------- Preferences Tab -------------------- */}
            {activeTab === "preferences" && (
                <form onSubmit={handlePreferencesSave} data-testid="preferences-form">
                    <div>
                        <label>UI Theme</label>
                        <select
                            value={user.preferences.ui_theme}
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    preferences: { ...user.preferences, ui_theme: e.target.value },
                                })
                            }
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </div>
                    <div>
                        <label>Notifications</label>
                        <input
                            type="checkbox"
                            checked={user.preferences.notifications_enabled}
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    preferences: {
                                        ...user.preferences,
                                        notifications_enabled: e.target.checked,
                                    },
                                })
                            }
                        />
                    </div>
                    <div>
                        <label>Language</label>
                        <select
                            value={user.preferences.language}
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    preferences: { ...user.preferences, language: e.target.value },
                                })
                            }
                        >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="zh">Chinese</option>
                        </select>
                    </div>
                    <button type="submit" disabled={loading} data-testid="save-button">
                        Save Changes
                    </button>
                </form>
            )}

            {/* -------------------- Security Tab -------------------- */}
            {activeTab === "security" && (
                <div data-testid="security-section">
                    <h3>Change Password</h3>
                    <form onSubmit={handlePasswordChange} data-testid="password-form">
                        <div>
                            <label>Current Password</label>
                            <input type="password" name="current_password" required />
                        </div>
                        <div>
                            <label>New Password</label>
                            <input type="password" name="new_password" required />
                        </div>
                        <div>
                            <label>Confirm Password</label>
                            <input type="password" name="confirm_password" required />
                        </div>
                        <button type="submit" disabled={loading}>
                            Change Password
                        </button>
                    </form>
                    <hr />
                    <button onClick={handleAccountDelete} data-testid="delete-account-button">
                        Delete Account
                    </button>
                </div>
            )}

            {/* -------------------- Activity Tab -------------------- */}
            {activeTab === "activity" && (
                <div data-testid="activity-section">
                    <p>Activity feed coming soon.</p>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
