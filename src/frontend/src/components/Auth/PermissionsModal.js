import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * PermissionsModal.tsx
 * --------------------
 * Small modal that shows a document's permissions and lets an admin
 * modify them. Utilises the backend PermissionService via ReactQuery.
 */
import { useState, useEffect } from 'react';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input } from '@material-tailwind/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { setPermissions } from '../../../../src/backend/shared/services/PermissionService';
/** Simple fetch helper - replace with real API call when ready */
async function fetchPermissions(documentId) {
    const resp = await fetch(`${import.meta.env.VITE_API_BASE}/documents/${documentId}/permissions`);
    if (!resp.ok)
        throw new Error('Failed to load permissions');
    return resp.json();
}
export function PermissionsModal({ open, onClose, documentId }) {
    const queryClient = useQueryClient();
    const { data, isLoading, error } = useQuery(['permissions', documentId], () => fetchPermissions(documentId), {
        enabled: open,
    });
    const mutation = useMutation((payload) => setPermissions(documentId, payload), {
        onSuccess: () => {
            queryClient.invalidateQueries(['permissions', documentId]);
            onClose();
        },
    });
    const [localPerms, setLocalPerms] = useState({ permissions: [] });
    useEffect(() => {
        if (data)
            setLocalPerms(data);
    }, [data]);
    const handleAdd = () => {
        setLocalPerms(prev => ({
            permissions: [...prev.permissions, { department: '', role: '' }],
        }));
    };
    const handleChange = (idx, field, value) => {
        const updated = [...localPerms.permissions];
        updated[idx][field] = value;
        setLocalPerms({ permissions: updated });
    };
    const handleSave = () => {
        mutation.mutate(localPerms);
    };
    return (_jsxs(Dialog, { open: open, handler: onClose, size: "lg", children: [_jsx(DialogHeader, { children: "Document Permissions" }), _jsxs(DialogBody, { divider: true, children: [isLoading && _jsx("p", { className: "text-gray-600", children: "Loading..." }), error && _jsx("p", { className: "text-red-500", children: error.message }), data && (_jsxs("div", { className: "space-y-4", children: [localPerms.permissions.map((p, i) => (_jsxs("div", { className: "flex gap-2", children: [_jsx(Input, { label: "Department", value: p.department, onChange: e => handleChange(i, 'department', e.target.value) }), _jsx(Input, { label: "Role", value: p.role, onChange: e => handleChange(i, 'role', e.target.value) })] }, i))), _jsx(Button, { variant: "text", color: "blue", onClick: handleAdd, children: "+ Add Permission" })] }))] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "text", color: "red", onClick: onClose, children: "Cancel" }), _jsx(Button, { variant: "filled", color: "green", onClick: handleSave, disabled: mutation.isLoading, children: "Save" })] })] }));
}
