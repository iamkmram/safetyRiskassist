-- Initial schema for Dertour Travel Knowledge Assistant
-- Unified users table combining all features
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    department TEXT,
    role TEXT,
    avatar TEXT,
    profile_photo_url TEXT,
    permissions TEXT,
    last_login TEXT,
    password_hash VARCHAR(255) NOT NULL,
    hashed_password TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    mfa_enabled BOOLEAN DEFAULT 0,
    last_password_change TEXT,
    is_deleted BOOLEAN DEFAULT 0
);

-- Permissions table (reference list)
CREATE TABLE IF NOT EXISTS permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- Sessions table (simple token store)
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Authentication tables and mock data (SQLite dialect; JSON stored as TEXT)
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

-- Help Documentation & Support Center initial schema
CREATE TABLE help_articles (
    article_id      UUID PRIMARY KEY,
    title           TEXT NOT NULL,
    content         TEXT NOT NULL,
    category        TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_popular      BOOLEAN NOT NULL DEFAULT FALSE,
    is_published    BOOLEAN NOT NULL DEFAULT TRUE,
    view_count      INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_help_articles_category ON help_articles(category);
CREATE INDEX idx_help_articles_popular ON help_articles(is_popular);

-- User preferences table
CREATE TABLE user_preferences (
    user_id TEXT PRIMARY KEY,
    ui_theme TEXT CHECK (ui_theme IN ('light','dark')) NOT NULL DEFAULT 'light',
    notifications_enabled BOOLEAN NOT NULL DEFAULT 1,
    language TEXT CHECK (language IN ('en','es','fr','de','zh')) NOT NULL DEFAULT 'en',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User activity tracking table
CREATE TABLE user_activity (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    recent_conversations INTEGER DEFAULT 0,
    documents_viewed INTEGER DEFAULT 0,
    last_login TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
