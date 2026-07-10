"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
// @ts-ignore
const react_1 = require("react");
const auth_1 = require("../../services/auth");
const Layout_1 = __importDefault(require("../Common/Layout"));
const UserProfile = () => {
    const [profile, setProfile] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const fetch = async () => {
            try {
                const data = await (0, auth_1.getProfile)();
                setProfile(data);
            }
            catch (e) {
                setError('Failed to load profile.');
                console.error(e);
            }
        };
        fetch();
    }, []);
    if (error) {
        return (0, jsx_runtime_1.jsx)(Layout_1.default, { children: (0, jsx_runtime_1.jsx)("p", { className: "text-red-600", children: error }) });
    }
    if (!profile) {
        return (0, jsx_runtime_1.jsx)(Layout_1.default, { children: (0, jsx_runtime_1.jsx)("p", { children: "Loading profile..." }) });
    }
    return ((0, jsx_runtime_1.jsx)(Layout_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-md mx-auto p-4 bg-white rounded shadow", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-semibold mb-4", children: "My Profile" }), (0, jsx_runtime_1.jsxs)("dl", { children: [(0, jsx_runtime_1.jsx)("dt", { className: "font-medium", children: "Full Name" }), (0, jsx_runtime_1.jsx)("dd", { className: "mb-2", children: profile.fullName }), (0, jsx_runtime_1.jsx)("dt", { className: "font-medium", children: "Email" }), (0, jsx_runtime_1.jsx)("dd", { className: "mb-2", children: profile.email }), (0, jsx_runtime_1.jsx)("dt", { className: "font-medium", children: "Department" }), (0, jsx_runtime_1.jsx)("dd", { className: "mb-2", children: profile.departmentId }), (0, jsx_runtime_1.jsx)("dt", { className: "font-medium", children: "Roles" }), (0, jsx_runtime_1.jsx)("dd", { className: "mb-2", children: profile.roles?.join(', ') }), (0, jsx_runtime_1.jsx)("dt", { className: "font-medium", children: "Permissions" }), (0, jsx_runtime_1.jsx)("dd", { children: profile.permissions?.join(', ') })] })] }) }));
};
exports.default = UserProfile;
