import React, { useState } from 'react';
import { User } from '../../types';

export const UserProfile: React.FC = () => {
  const [user] = useState<User>({});
  return <div>User Profile Placeholder</div>;
};

export default UserProfile;
