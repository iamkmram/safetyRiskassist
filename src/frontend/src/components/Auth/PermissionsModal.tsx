// @ts-nocheck
/**
 * PermissionsModal.tsx
 * --------------------
 * Small modal that shows a document's permissions and lets an admin
 * modify them. Utilises the backend PermissionService via ReactQuery.
 */

import { useState, useEffect } from 'react';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input } from '@material-tailwind/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PermissionPayload, canView, setPermissions } from '../../../../src/backend/shared/services/PermissionService';

interface PermissionsModalProps {
  open: boolean;
  onClose: () => void;
  documentId: string;
}

/** Simple fetch helper - replace with real API call when ready */
async function fetchPermissions(documentId: string): Promise<PermissionPayload> {
  const resp = await fetch(`${import.meta.env.VITE_API_BASE}/documents/${documentId}/permissions`);
  if (!resp.ok) throw new Error('Failed to load permissions');
  return resp.json();
}

export function PermissionsModal({ open, onClose, documentId }: PermissionsModalProps) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(['permissions', documentId], () => fetchPermissions(documentId), {
    enabled: open,
  });

  const mutation = useMutation(
    (payload: PermissionPayload) => setPermissions(documentId, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['permissions', documentId]);
        onClose();
      },
    }
  );

  const [localPerms, setLocalPerms] = useState<PermissionPayload>({ permissions: [] });

  useEffect(() => {
    if (data) setLocalPerms(data);
  }, [data]);

  const handleAdd = () => {
    setLocalPerms(prev => ({
      permissions: [...prev.permissions, { department: '', role: '' }],
    }));
  };

  const handleChange = (idx: number, field: 'department' | 'role', value: string) => {
    const updated = [...localPerms.permissions];
    updated[idx][field] = value;
    setLocalPerms({ permissions: updated });
  };

  const handleSave = () => {
    mutation.mutate(localPerms);
  };

  return (
    <Dialog open={open} handler={onClose} size="lg">
      <DialogHeader>Document Permissions</DialogHeader>
      <DialogBody divider>
        {isLoading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-500">{(error as Error).message}</p>}
        {data && (
          <div className="space-y-4">
            {localPerms.permissions.map((p, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  label="Department"
                  value={p.department}
                  onChange={e => handleChange(i, 'department', e.target.value)}
                />
                <Input
                  label="Role"
                  value={p.role}
                  onChange={e => handleChange(i, 'role', e.target.value)}
                />
              </div>
            ))}
            <Button variant="text" color="blue" onClick={handleAdd}>
              + Add Permission
            </Button>
          </div>
        )}
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={onClose}>Cancel</Button>
        <Button variant="filled" color="green" onClick={handleSave} disabled={mutation.isLoading}>
          Save
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
