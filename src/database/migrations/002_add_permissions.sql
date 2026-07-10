-- Add indexes for permission lookups
CREATE INDEX idx_user_roles_user_id ON user_roles (user_id);
CREATE INDEX idx_role_permissions_role_id ON role_permissions (role_id);
