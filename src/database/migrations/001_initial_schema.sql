-- 001_initial_schema.sql
-- Create the auth_user table and insert three mock users.
-- SQLite dialect is used; JSON stored as TEXT.

PRAGMA foreign_keys=ON;
PRAGMA journal_mode=WAL;

CREATE TABLE IF NOT EXISTS auth_user (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    department TEXT,
    role TEXT,
    avatar TEXT,
    last_login TEXT,
    permissions TEXT   -- JSON array stored as TEXT
);

INSERT INTO auth_user (id, name, email, department, role, avatar, last_login, permissions) VALUES
('user-001',
 'Sarah Chen',
 'sarah.chen@dertour.com',
 'Risk Assessment',
 'Travel Advisor',
 '/avatars/sarah.jpg',
 '2026-07-08T14:30:00Z',
 '["knowledge:read","documents:view"]');

INSERT INTO auth_user (id, name, email, department, role, avatar, last_login, permissions) VALUES
('user-002',
 'Marcus Weber',
 'marcus.weber@dertour.com',
 'Operations',
 'Senior Manager',
 '/avatars/marcus.jpg',
 '2026-07-07T09:15:00Z',
 '["knowledge:read","documents:view","admin:access"]');

INSERT INTO auth_user (id, name, email, department, role, avatar, last_login, permissions) VALUES
('user-003',
 'Emma Schneider',
 'emma.schneider@dertour.com',
 'Customer Service',
 'Travel Specialist',
 '/avatars/emma.jpg',
 '2026-07-06T11:45:00Z',
 '["knowledge:read"]');
