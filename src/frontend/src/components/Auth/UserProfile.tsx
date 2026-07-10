// @ts-nocheck
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import { Logger } from '../../utils/Logger';

/** Shape of user data returned by the backend */
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  department: string;
}

/** Component that fetches and displays the loggedin user's profile */
export const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No auth token found');
      }

      const response = await axios.get<{ user: User }>('/api/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user);
      setError(null);
    } catch (err) {
      const msg = (err as Error).message || 'Failed to load profile';
      Logger.error('UserProfile fetch error', { error: msg });
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.reload();
  };

  if (loading) {
    return <CircularProgress data-testid="loading-indicator" />;
  }

  if (error) {
    return (
      <Card sx={{ maxWidth: 400, margin: 'auto' }}>
        <CardContent>
          <Typography color="error">Error: {error}</Typography>
          <Button variant="contained" onClick={fetchProfile}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ maxWidth: 400, margin: 'auto' }}>
      <CardContent>
        <Typography variant="h5">{user?.name}</Typography>
        <Typography color="text.secondary">{user?.email}</Typography>
        <Typography color="text.secondary">
          {user?.role} - {user?.department}
        </Typography>
        <Button variant="outlined" color="secondary" onClick={handleLogout} sx={{ mt: 2 }}>
          Logout
        </Button>
      </CardContent>
    </Card>
  );
};
