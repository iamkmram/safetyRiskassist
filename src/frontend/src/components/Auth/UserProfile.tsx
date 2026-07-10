/* eslint-disable */
// @ts-nocheck
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Spinner,
  MessageBar,
  MessageBarType,
  Stack,
  Text,
} from '@fluentui/react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { MetricCard } from './MetricCard';
import './UserProfile.css';
import Layout from '../Common/Layout';
import { AuthUser } from '../../types/auth.types';
import {
  UserDetail,
  UserPreferences,
  UserSecurity,
  ActivitySummary,
} from '../../../shared/types/database.types';
import { toSnake, toCamel } from '../../utils/helpers';

// -------------------------------------------------------------------
// Helpers & Constants
// -------------------------------------------------------------------
const API_BASE = '/api';

const handleLogout = () => {
  console.log('Logout placeholder  no real auth');
};

// -------------------------------------------------------------------
// Types for Fluent UI profile (source branch)
// -------------------------------------------------------------------
interface Permission {
  id: string;
  key: string;
  description?: string;
}

interface AuthProfileData {
  sub: string;
  name?: string;
  email?: string;
  permissions: Permission[];
}

// -------------------------------------------------------------------
// Props
// -------------------------------------------------------------------
interface UserProfileProps {
  /** Optional user id - if omitted, the component will use the logged‑in user from the auth context */
  userId?: string;
}

// -------------------------------------------------------------------
// Fluent UI Auth Profile Component
// -------------------------------------------------------------------
const AuthFluentProfile: React.FC = () => {
  const [profile, setProfile] = useState<AuthProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchAuthProfile = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No access token');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(toCamel(data) as AuthProfileData);
        } else {
          const err = await res.json();
          setError(err.message ?? 'Failed to load auth profile');
        }
      } catch (e) {
        setError('Failed to load auth profile');
      } finally {
        setLoading(false);
      }
    };
    fetchAuthProfile();
  }, []);

  if (loading) {
    return <Spinner label="Loading auth profile..." />;
  }

  if (error) {
    return (
      <MessageBar messageBarType={MessageBarType.error}>
        {error}
      </MessageBar>
    );
  }

  return (
    <Stack tokens={{ childrenGap: 10 }} styles={{ root: { padding: 20 } }}>
      <Text variant="xLarge">Auth Profile</Text>
      <Text>Subject: {profile?.sub}</Text>
      <Text>Name: {profile?.name ?? 'N/A'}</Text>
      <Text>Email: {profile?.email ?? 'N/A'}</Text>
      <Text>Permissions:</Text>
      <Stack tokens={{ childrenGap: 5 }}>
        {profile?.permissions.map((perm) => (
          <Text key={perm.id}>
            {perm.key} {perm.description && `- ${perm.description}`}
          </Text>
        ))}
      </Stack>
    </Stack>
  );
};

// -------------------------------------------------------------------
// Main User Profile Component (merged)
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
        setErrorSimple(err?.response?.data?.message ?? 'Unable to load profile');
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

  // The component currently performs side‑effects only; no UI is rendered.
  return null;
};
