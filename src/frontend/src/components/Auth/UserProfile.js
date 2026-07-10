import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import { Logger } from '../../utils/Logger';
/** Component that fetches and displays the loggedin user's profile */
export const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No auth token found');
            }
            const response = await axios.get('/api/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data.user);
            setError(null);
        }
        catch (err) {
            const msg = err.message || 'Failed to load profile';
            Logger.error('UserProfile fetch error', { error: msg });
            setError(msg);
        }
        finally {
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
        return _jsx(CircularProgress, { "data-testid": "loading-indicator" });
    }
    if (error) {
        return (_jsx(Card, { sx: { maxWidth: 400, margin: 'auto' }, children: _jsxs(CardContent, { children: [_jsxs(Typography, { color: "error", children: ["Error: ", error] }), _jsx(Button, { variant: "contained", onClick: fetchProfile, children: "Retry" })] }) }));
    }
    return (_jsx(Card, { sx: { maxWidth: 400, margin: 'auto' }, children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h5", children: user?.name }), _jsx(Typography, { color: "text.secondary", children: user?.email }), _jsxs(Typography, { color: "text.secondary", children: [user?.role, " - ", user?.department] }), _jsx(Button, { variant: "outlined", color: "secondary", onClick: handleLogout, sx: { mt: 2 }, children: "Logout" })] }) }));
};
