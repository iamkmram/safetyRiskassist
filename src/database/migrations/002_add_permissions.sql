-- 002_add_permissions.sql
-- Populate default permissions used by the application

INSERT INTO permissions (resource, action, description) VALUES
('knowledge', 'create', 'Create a knowledge item'),
('knowledge', 'read',   'Read a knowledge item'),
('knowledge', 'update', 'Update a knowledge item'),
('knowledge', 'delete', 'Delete a knowledge item'),
('conversation', 'create', 'Start a new conversation'),
('conversation', 'read',   'Read conversation messages'),
('conversation', 'update', 'Update conversation metadata'),
('conversation', 'delete', 'Delete a conversation')
ON CONFLICT DO NOTHING;
