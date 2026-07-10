// @ts-ignore
import React, { useEffect, useState } from 'react';
// import { getProfile } from '../../services/auth';
type UserProfileType = any;
// import { getProfile } from '../../services/auth';
import Layout from '../Common/Layout';

type UserProfileType = any;
const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
//         const data = await getProfile();
        setProfile(data);
      } catch (e) {
        setError('Failed to load profile.');
        console.error(e);
      }
    };
    fetch();
  }, []);

  if (error) {
    return <Layout><p className="text-red-600">{error}</p></Layout>;
  }

  if (!profile) {
    return <Layout><p>Loading profile...</p></Layout>;
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
        <dl>
          <dt className="font-medium">Full Name</dt>
          <dd className="mb-2">{profile.fullName}</dd>

          <dt className="font-medium">Email</dt>
          <dd className="mb-2">{profile.email}</dd>

          <dt className="font-medium">Department</dt>
          <dd className="mb-2">{profile.departmentId}</dd>

          <dt className="font-medium">Roles</dt>
          <dd className="mb-2">{profile.roles?.join(', ')}</dd>

          <dt className="font-medium">Permissions</dt>
          <dd>{profile.permissions?.join(', ')}</dd>
        </dl>
      </div>
    </Layout>
  );
};

export default UserProfile;
