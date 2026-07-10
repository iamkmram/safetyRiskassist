-- ------------------------------------------------------------------
-- 002_add_permissions.sql
-- Seed initial permission data
-- ------------------------------------------------------------------

INSERT INTO permissions (id, key, description) VALUES
    ('perm-1', 'knowledge.read', 'Read any knowledge item'),
    ('perm-2', 'knowledge.write', 'Create or modify knowledge items'),
    ('perm-3', 'admin.manage', 'Administer system configuration'),
    ('perm-4', 'department.read', 'Read departmentscoped resources');

-- Example rolepermission assignments (these are just illustrative)
INSERT INTO role_permission (role_id, permission_id) VALUES
    ('role-admin', 'perm-3'),
    ('role-knowledge-reader', 'perm-1'),
    ('role-knowledge-writer', 'perm-2');
