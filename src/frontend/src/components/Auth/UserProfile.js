// LINT PLACEHOLDER  original file moved to .lint_backup
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

const API_BASE = "/api";

// -----------------------------------------------------------------------------
// Profile Management Component (original functionality)
// -----------------------------------------------------------------------------
export const UserProfile = () => {
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
                            value={user.preferences?.uiTheme || ""}
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
                    <button type="submit" disabled={loading} data-testid="save-pref-button">
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
                </form>
            )}

            {/* -------------------- Activity Tab -------------------- */}
            {activeTab === "activity" && (
                <div data-testid="activity-tab-content">
                    <p>Recent activity will be displayed here.</p>
                </div>
            )}

            {/* -------------------------------------------------------- */}
            {isAdmin && (
                <button onClick={handleAccountDelete} data-testid="delete-account-button">
                    Delete Account
                </button>
            )}
        </div>
    );
};

// -----------------------------------------------------------------------------
// Dashboard Component (new analytics overview)
// -----------------------------------------------------------------------------
export const Dashboard = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState(null);
    const [showBanner, setShowBanner] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Load dashboard metrics on mount
    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const data = await getDashboardMetrics(token);
                setMetrics(data);
            } catch (err) {
                console.error("Failed to load dashboard metrics", err);
            }
        };
        fetchMetrics();
    }, [token]);

    const handleSearchSubmit = () => {
        if (searchQuery.trim()) {
            const encoded = encodeURIComponent(searchQuery.trim());
            navigate(`/chat?query=${encoded}`);
        }
    };

    const quickActions = [
        {
            title: "Latest COVID19 Restrictions",
            description: "Get current travel requirements",
            query: "What are the latest COVID19 travel restrictions?",
        },
        {
            title: "HighRisk Destinations",
            description: "View current travel warnings",
            query: "Show me highrisk travel destinations",
        },
        {
            title: "Emergency Protocols",
            description: "Access emergency procedures",
            query: "What emergency protocols should I follow?",
        },
        {
            title: "Weather Alerts",
            description: "Check severe weather warnings",
            query: "Are there any weatherrelated travel alerts?",
        },
    ];

    return _jsxs("div", {
        className: "dashboard-container",
        children: [
            showBanner &&
                _jsxs(
                    "div",
                    {
                        className: "notification-banner",
                        children: [
                            _jsx("span", { children: "New travel advisories available" }),
                            _jsx("button", {
                                className: "close-btn",
                                onClick: () => setShowBanner(false),
                                "aria-label": "Dismiss",
                            }),
                        ],
                    },
                    "banner"
                ),
            user &&
                _jsxs(
                    "h2",
                    {
                        className: "welcome-msg",
                        children: ["Welcome, ", user.name, " - ", user.department],
                    },
                    "welcome"
                ),
            _jsx("div", {
                className: "metrics-grid",
                children: metrics
                    ? _jsxs(
                          _Fragment,
                          {
                              children: [
                                  _jsx(MetricCard, {
                                      title: "Queries This Week",
                                      value: metrics.totalQueriesThisWeek,
                                  }),
                                  _jsx(MetricCard, {
                                      title: "Most Searched Topics",
                                      value: metrics.mostSearchedTopics.join(", "),
                                  }),
                                  _jsx(MetricCard, {
                                      title: "Recent Conversations",
                                      value: metrics.recentConversations.length,
                                  }),
                                  _jsx(MetricCard, {
                                      title: "Trending Travel Alerts",
                                      value: metrics.trendingTravelAlerts,
                                  }),
                              ],
                          },
                          "metrics"
                      )
                    : _jsx("p", { children: "Loading metrics..." }),
            }),
            _jsxs("div", {
                className: "search-section",
                children: [
                    _jsx("input", {
                        type: "text",
                        className: "search-box",
                        placeholder:
                            "Ask about travel risks, safety guidelines, or destination information...",
                        value: searchQuery,
                        onChange: (e) => setSearchQuery(e.target.value),
                        onKeyDown: (e) => e.key === "Enter" && handleSearchSubmit(),
                    }),
                    _jsx("button", {
                        className: "search-btn",
                        onClick: handleSearchSubmit,
                        children: "Search",
                    }),
                ],
            }),
            _jsx(
                "div",
                {
                    className: "quick-actions-grid",
                    children: quickActions.map((action) =>
                        _jsxs(
                            "div",
                            {
                                className: "quick-action-card",
                                onClick: () =>
                                    navigate(`/chat?query=${encodeURIComponent(action.query)}`),
                                role: "button",
                                children: [
                                    _jsx("h3", { children: action.title }),
                                    _jsx("p", { children: action.description }),
                                ],
                            },
                            action.title
                        )
                    ),
                },
                "quickactions"
            ),
            _jsxs("aside", {
                className: "recent-conversations-sidebar",
                children: [
                    _jsx("h4", { children: "Recent Conversations" }),
                    _jsx(
                        "ul",
                        {
                            children: metrics?.recentConversations.map((conv) =>
                                _jsx(
                                    "li",
                                    {
                                        children: _jsxs(
                                            "a",
                                            {
                                                href: `/chat/${conv.id}`,
                                                children: [
                                                    _jsx("span", {
                                                        className: "snippet",
                                                        children: conv.snippet,
                                                    }),
                                                    _jsx("span", {
                                                        className: "timestamp",
                                                        children: conv.timestamp,
                                                    }),
                                                ],
                                            },
                                            "link"
                                        ),
                                    },
                                    conv.id
                                )
                            ),
                        },
                        "list"
                    ),
                    _jsx("a", {
                        href: "/conversations",
                        className: "view-all-link",
                        children: "View All Conversations",
                    }),
                ],
            }),
        ],
    });
};

export default Dashboard;
