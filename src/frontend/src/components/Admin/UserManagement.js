import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { fetchUsers } from '../../services/api';
import './UserManagement.css';
export const UserManagement = () => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchUsers();
                setUsers(data.users);
            }
            catch (err) {
                console.error('Failed to fetch users', err);
            }
        };
        load();
    }, []);
    return (_jsxs("div", { className: "user-management", children: [_jsx("h2", { children: "User Management" }), _jsxs("table", { className: "users-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Name" }), _jsx("th", { children: "Email" }), _jsx("th", { children: "Department" })] }) }), _jsx("tbody", { children: users.map(u => (_jsxs("tr", { children: [_jsx("td", { children: u.name }), _jsx("td", { children: u.email }), _jsx("td", { children: u.department })] }, u.id))) })] })] }));
};
export default UserManagement;
