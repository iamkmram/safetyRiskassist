import React from 'react';
import { Avatar, Card, Spin, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';

/**
 * Props for the UserProfile component.
 */
interface UserProfileProps {
  /** Full name of the user */
  name: string;
  /** Optional URL to the avatar image */
  avatarUrl?: string;
  /** Loading state while user data is being fetched */
  loading?: boolean;
}

/**
 * A simple user profile card displaying avatar and name.
 * Includes comprehensive error handling and fallback UI.
 */
export const UserProfile: React.FC<UserProfileProps> = ({
  name,
  avatarUrl,
  loading = false,
}) => {
  // Guard against missing required props
  if (!name) {
    message.error('User name is required to display the profile.');
    return null;
  }

  return (
    <Card style={{ width: 300, textAlign: 'center' }}>
      {loading ? (
        <Spin />
      ) : (
        <>
          <Avatar
            size={64}
            src={avatarUrl}
            icon={!avatarUrl ? <UserOutlined /> : undefined}
            alt={`${name}'s avatar`}
          />
          <h3 style={{ marginTop: 16 }}>{name}</h3>
        </>
      )}
    </Card>
  );
};

export default UserProfile;
