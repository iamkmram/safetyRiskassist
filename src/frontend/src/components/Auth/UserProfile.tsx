import { mockUsers } from "../../utils/mockData";
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AuthUser } from '../../types/auth.types';
const handleLogout = () => { console.log('Logout placeholder  no real auth'); };

/**
 * Simple userprofile dropdown used in the navigation bar.
 * Shows avatar, name and a handleLogout button.
 */
export const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<AuthUser | null>(null);

  useEffect(() => {
    setProfile(user);
  }, [user]);

  if (!profile) {
    return null; // nothing to render when not logged in
  }

  return (
    <div className="flex items-center space-x-2">
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
  );
};
