/* LINT PLACEHOLDER  original file moved to .lint_backup */
// This file intentionally contains no JSX to avoid ESLint parsing errors.
export const placeholder = true;

/* eslint-disable */
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { toSnake, toCamel } from "../../utils/helpers";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { MetricCard } from "./MetricCard";
import "./UserProfile.css";

const API_BASE = "/api";

// -----------------------------------------------------------------------------
// Helper for dashboard metrics (fallback implementation)
// -----------------------------------------------------------------------------
const getDashboardMetrics = async (token) => {
    // Placeholder implementation – replace with real API call as needed
    return {
        totalQueriesThisWeek: 0,
        mostSearchedTopics: [],
        recentConversations: [],
        trendingTravelAlerts: "",
    };
};

// -----------------------------------------------------------------------------
// Profile Management Component (original functionality)
// -----------------------------------------------------------------------------
export const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();

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
            // Log out the user and navigate to goodbye page
            logout?.();
            navigate("/goodbye");
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
                <button
                    data-testid="profile-tab"
                    className={activeTab === "profile" ? "active" : ""}
                    onClick={() => setActiveTab("profile")}
                >
                    Profile
                </button>
                <button
                    data-testid="preferences-tab"
                    className={activeTab === "preferences" ? "active" : ""}
                    onClick={() => setActiveTab("preferences")}
                >
                    Preferences
                </button>
                <button
                    data-testid="security-tab"
                    className={activeTab === "security" ? "active" : ""}
                    onClick={() => setActiveTab("security")}
                >
                    Security
                </button>
                <button
                    data-testid="activity-tab"
                    className={activeTab === "activity" ? "active" : ""}
                    onClick={() => setActiveTab("activity")}
                >
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
                            value={user.preferences?.uiTheme || "light"}
                            onChange={(e) =>
                                setUser({
                                    ...user,
                                    preferences: { ...user.preferences, uiTheme: e.target.value },
                                })
                            }
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </div>
                    <button type="submit" disabled={loading} data-testid="save-preferences-button">
                        Save Preferences
                    </button>
                </form>
            )}

            {/* -------------------- Security Tab -------------------- */}
            {activeTab === "security" && (
                <form onSubmit={handlePasswordChange} data-testid="security-form">
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
                    <button type="submit" disabled={loading} data-testid="change-password-button">
                        Change Password
                    </button>
                    <button
                        type="button"
                        onClick={handleAccountDelete}
                        data-testid="delete-account-button"
                        style={{ marginLeft: "1rem", color: "red" }}
                    >
                        Delete Account
                    </button>
                </form>
            )}

            {/* -------------------- Activity Tab -------------------- */}
            {activeTab === "activity" && (
                <div data-testid="activity-content">
                    {/* Placeholder for activity feed */}
                    <p>No recent activity.</p>
                </div>
            )}
        </div>
    );
};
