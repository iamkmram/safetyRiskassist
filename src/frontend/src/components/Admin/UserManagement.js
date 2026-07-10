"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
// @ts-ignore
const react_1 = require("react");
const AdminService_1 = require("../../../shared/services/AdminService");
/**
 * UserManagement - simple admin UI to list and delete users.
 * Demonstrates input validation, error handling and logging.
 */
const UserManagement = () => {
    const [users, setUsers] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const loadUsers = async () => {
        try {
            const data = await (0, AdminService_1.fetchAllUsers)();
            setUsers(data);
        }
        catch (e) {
            console.error('Error loading users:', e);
            setError('Failed to load users.');
        }
        finally {
            setLoading(false);
        }
    };
    (0, react_1.useEffect)(() => {
        loadUsers();
    }, []);
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?'))
            return;
        try {
            await (0, AdminService_1.deleteUser)(id);
            setUsers(prev => prev.filter(u => u.id !== id));
        }
        catch (e) {
            console.error('Delete error:', e);
            setError('Unable to delete user.');
        }
    };
    if (loading)
        return (0, jsx_runtime_1.jsx)("div", { "data-testid": "admin-loading", children: "Loading users..." });
    if (error)
        return (0, jsx_runtime_1.jsx)("div", { "data-testid": "admin-error", style: { color: 'red' }, children: error });
    return ((0, jsx_runtime_1.jsxs)("div", { "data-testid": "admin-users", children: [(0, jsx_runtime_1.jsx)("h2", { children: "User Management" }), users.length === 0 ? ((0, jsx_runtime_1.jsx)("p", { children: "No users found." })) : ((0, jsx_runtime_1.jsxs)("table", { children: [(0, jsx_runtime_1.jsx)("thead", { children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { children: "ID" }), (0, jsx_runtime_1.jsx)("th", { children: "Email" }), (0, jsx_runtime_1.jsx)("th", { children: "Actions" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { children: users.map(u => ((0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("td", { children: u.id }), (0, jsx_runtime_1.jsx)("td", { children: u.email }), (0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsx)("button", { onClick: () => handleDelete(u.id), "data-testid": `delete-${u.id}`, children: "Delete" }) })] }, u.id))) })] }))] }));
};
exports.default = UserManagement;
