import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import { AuthUser } from '../../types/auth.types';
import {
  UserDetail,
  UserPreferences,
  UserSecurity,
  ActivitySummary,
} from '../../../shared/types/database.types';
import { toSnake, toCamel } from '../../utils/helpers';
import Layout from '../Common/Layout';

// -------------------------------------------------------------------
// Helpers & Constants
// -------------------------------------------------------------------
const API_BASE = '/api';

const handleLogout = () => {
  console.log('Logout placeholder  no real auth');
};

// -------------------------------------------------------------------
// Props
// -------------------------------------------------------------------
interface UserProfileProps {
  /** Optional user id - if omitted, the component will use the logged‑in user from the auth context */
  userId?: string;
}

// -------------------------------------------------------------------
// Main Component (merged)
// -------------------------------------------------------------------
export const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  // ----- Base dropdown state (avatar, name) -----
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<AuthUser | null>(null);

  // ----- Simple profile fetch (source) -----
  const [name, setName] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [loadingSimple, setLoadingSimple] = useState<boolean>(true);
  const [errorSimple, setErrorSimple] = useState<string>('');

  // ----- Full user management (integration) -----
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [activeTab, setActiveTab] = useState<
    'profile' | 'preferences' | 'security' | 'activity'
  >('profile');
  const [loadingManagement, setLoadingManagement] = useState<boolean>(false);

  // -----------------------------------------------------------------
  // Load base auth profile on mount (BASE)
  // -----------------------------------------------------------------
  useEffect(() => {
    setProfile(authUser || null);
  }, [authUser]);

  // -----------------------------------------------------------------
  // Load simple profile (SOURCE)
  // -----------------------------------------------------------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const endpoint = userId
          ? `/api/users/${encodeURIComponent(userId)}`
          : '/api/users/me';
        console.log(`[UserProfile] Fetching profile from ${endpoint}`);
        const response = await axios.get(endpoint);
        const { name, department } = response.data;
        setName(name);
        setDepartment(department);
        setLoadingSimple(false);
      } catch (err: any) {
        console.error('[UserProfile] Error fetching profile:', err);
        setErrorSimple(
          err?.response?.data?.message ?? 'Unable to load profile'
        );
        setLoadingSimple(false);
      }
    };
    fetchProfile();
  }, [userId]);

  // -----------------------------------------------------------------
  // Load detailed user data for management UI (INTEGRATION)
  // -----------------------------------------------------------------
  useEffect(() => {
    const fetchUserDetail = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUserDetail(toCamel(data) as UserDetail);
        } else {
          toast.error('Failed to load profile');
        }
      } catch (e) {
        toast.error('Failed to load profile');
      }
    };
    fetchUserDetail();
  }, []);

  // -----------------------------------------------------------------
  // Handlers for Management Tabs (INTEGRATION)
  // -----------------------------------------------------------------
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDetail) return;
    const token = localStorage.getItem('access_token');
    setLoadingManagement(true);
    const payload = toSnake({
      name: userDetail.name,
      email: userDetail.email,
      department: userDetail.department,
      role: userDetail.role,
    });
    const res = await fetch(`${API_BASE}/users/me/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    setLoadingManagement(false);
    if (res.ok) {
      toast.success('Profile updated');
    } else {
      const err = await res.json();
      toast.error(err.detail || 'Failed to update profile');
    }
  };

  const handlePreferencesSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDetail) return;
    const token = localStorage.getItem('access_token');
    setLoadingManagement(true);
    const payload = toSnake(userDetail.preferences);
    const res = await fetch(`${API_BASE}/users/me/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    setLoadingManagement(false);
    if (res.ok) {
      toast.success('Preferences saved');
    } else {
      const err = await res.json();
      toast.error(err.detail || 'Failed to save preferences');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const current = (
      form.elements.namedItem('current_password') as HTMLInputElement
    ).value;
    const newPass = (
      form.elements.namedItem('new_password') as HTMLInputElement
    ).value;
    const confirm = (
      form.elements.namedItem('confirm_password') as HTMLInputElement
    ).value;

    if (newPass !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    const token = localStorage.getItem('access_token');
    setLoadingManagement(true);
    const payload = toSnake({
      current_password: current,
      new_password: newPass,
    });
    const res = await fetch(`${API_BASE}/users/me/security/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    setLoadingManagement(false);
    if (res.ok) {
      toast.success('Password changed');
      form.reset();
    } else {
      const err = await res.json();
      toast.error(err.detail || 'Failed to change password');
    }
  };

  const handleAccountDelete = async () => {
    if (
      !window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone.'
      )
    ) {
      return;
    }
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE}/users/me`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      toast.success('Account deleted');
      window.location.href = '/goodbye';
    } else {
      const err = await res.json();
      toast.error(err.detail || 'Failed to delete account');
    }
  };

  // -----------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------
  // Loading states
  if (loadingSimple || (userDetail === null && !errorSimple)) {
    return <div data-testid="loading">Loading profile...</div>;
  }

  // Error from simple profile fetch
  if (errorSimple) {
    return (
      <div className="p-4 text-red-600" data-testid="error">
        Error: {errorSimple}
      </div>
    );
  }

  return (
    <Layout>
      {/* Base dropdown (BASE) */}
      {profile && (
        <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-8 h-8 rounded-full"
          />
          <span>{profile.name}</span>
          <button
            className="ml-2 text-sm text-gray-600 hover:underline"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}

      {/* Simple welcome (SOURCE) */}
      <div className="p-4 bg-white rounded shadow mt-4">
        <h2 className="text-xl font-semibold">Welcome, {name}!</h2>
        <p className="text-gray-600">Department: {department}</p>
      </div>

      {/* Full management UI (INTEGRATION) */}
      {userDetail && (
        <div className="user-profile mt-6" data-testid="user-profile">
          <nav className="breadcrumbs mb-4">
            <a href="/dashboard">Dashboard</a> / <span>Profile</span>
          </nav>

          <div className="tabs mb-4 flex space-x-2">
            {(['profile', 'preferences', 'security', 'activity'] as const).map(
              (tab) => (
                <button
                  key={tab}
                  data-testid={`${tab}-tab`}
                  className={activeTab === tab ? 'active' : ''}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              )
            )}
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSave} data-testid="profile-form">
              <div>
                <label>Name</label>
                <input
                  required
                  type="text"
                  value={userDetail.name}
                  onChange={(e) =>
                    setUserDetail({ ...userDetail, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  required
                  type="email"
                  value={userDetail.email}
                  onChange={(e) =>
                    setUserDetail({ ...userDetail, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label>Department</label>
                <input
                  type="text"
                  value={userDetail.department}
                  onChange={(e) =>
                    setUserDetail({
                      ...userDetail,
                      department: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label>Role</label>
                <select
                  required
                  value={userDetail.role}
                  onChange={(e) =>
                    setUserDetail({ ...userDetail, role: e.target.value })
                  }
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
                    formData.append('photo', file);
                    const token = localStorage.getItem('access_token');
                    const res = await fetch(`${API_BASE}/users/me/profile`, {
                      method: 'PUT',
                      headers: { Authorization: `Bearer ${token}` },
                      body: formData,
                    });
                    if (res.ok) {
                      toast.success('Photo uploaded');
                    } else {
                      toast.error('Failed to upload photo');
                    }
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={loadingManagement}
                data-testid="save-button"
              >
                Save Changes
              </button>
            </form>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <form onSubmit={handlePreferencesSave} data-testid="preferences-form">
              <div>
                <label>UI Theme</label>
                <select
                  value={userDetail.preferences.ui_theme}
                  onChange={(e) =>
                    setUserDetail({
                      ...userDetail,
                      preferences: {
                        ...userDetail.preferences,
                        ui_theme: e.target.value as 'light' | 'dark',
                      },
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
                  checked={userDetail.preferences.notifications_enabled}
                  onChange={(e) =>
                    setUserDetail({
                      ...userDetail,
                      preferences: {
                        ...userDetail.preferences,
                        notifications_enabled: e.target.checked,
                      },
                    })
                  }
                />
              </div>
              <div>
                <label>Language</label>
                <select
                  value={userDetail.preferences.language}
                  onChange={(e) =>
                    setUserDetail({
                      ...userDetail,
                      preferences: {
                        ...userDetail.preferences,
                        language: e.target.value as any,
                      },
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
              <button type="submit" disabled={loadingManagement}>
                Save Preferences
              </button>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordChange} data-testid="security-form">
              <div>
                <label>Current Password</label>
                <input name="current_password" type="password" required />
              </div>
              <div>
                <label>New Password</label>
                <input name="new_password" type="password" required />
              </div>
              <div>
                <label>Confirm New Password</label>
                <input name="confirm_password" type="password" required />
              </div>
              <button type="submit" disabled={loadingManagement}>
                Change Password
              </button>
            </form>
          )}

          {/* Activity Tab (placeholder) */}
          {activeTab === 'activity' && (
            <div data-testid="activity-view">
              {/* Activity summary could be rendered here using ActivitySummary type */}
              <p>Activity history will be displayed here.</p>
            </div>
          )}

          {/* Delete Account */}
          <div className="mt-4">
            <button
              className="text-red-600 hover:underline"
              onClick={handleAccountDelete}
            >
              Delete Account
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default UserProfile;

// -------------------------------------------------------------------
// Placeholder component (BASE)
// -------------------------------------------------------------------
export const Placeholder = () => {
  return <div>Placeholder component for ${__dirname}</div>;
};
