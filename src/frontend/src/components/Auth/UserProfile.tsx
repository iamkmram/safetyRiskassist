/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Spinner, MessageBar, MessageBarType } from '@fluentui/react';
import { Stack, Text } from '@fluentui/react';

// ------------------------------------------------------------------
// UserProfile - displays current user information and their permissions
// ------------------------------------------------------------------

interface Permission {
  id: string;
  key: string;
  description?: string;
}

interface UserProfile {
  sub: string;
  name?: string;
  email?: string;
  permissions: Permission[];
}

export const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const resp = await fetch('/api/v1/auth/profile', {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
          },
        });

        if (!resp.ok) {
          const err = await resp.json();
          throw new Error(err.error || 'Failed to load profile');
        }

        const data = await resp.json();
        setProfile(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <Spinner label="Loading profile..." />;
  }

  if (error) {
    return (
      <MessageBar messageBarType={MessageBarType.error}>
        {error}
      </MessageBar>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <Stack tokens={{ childrenGap: 10 }} styles={{ root: { width: 300, padding: 20 } }}>
      <Text variant="xLarge">User Profile</Text>
      <Text>Name: {profile.name ?? 'N/A'}</Text>
      <Text>Email: {profile.email ?? 'N/A'}</Text>
      <Text variant="large">Permissions</Text>
      {profile.permissions.length === 0 ? (
        <Text>No permissions assigned.</Text>
      ) : (
        <Stack tokens={{ childrenGap: 5 }}>
          {profile.permissions.map((perm) => (
            <Text key={perm.id}> {perm.key}{perm.description ? ` - ${perm.description}` : ''}</Text>
          ))}
        </Stack>
      )}
    </Stack>
  );
};
