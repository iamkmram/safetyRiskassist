-- ------------------------------------------------------------
-- Initial schema for user profile feature
-- ------------------------------------------------------------

CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    department TEXT,
    role TEXT NOT NULL,
    profile_photo_url TEXT,
    hashed_password TEXT NOT NULL,
    mfa_enabled BOOLEAN DEFAULT 0,
    last_password_change TEXT,
    is_deleted BOOLEAN DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE user_preferences (
    user_id TEXT PRIMARY KEY,
    ui_theme TEXT CHECK (ui_theme IN ('light','dark')) NOT NULL DEFAULT 'light',
    notifications_enabled BOOLEAN NOT NULL DEFAULT 1,
    language TEXT CHECK (language IN ('en','es','fr','de','zh')) NOT NULL DEFAULT 'en',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_activity (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    recent_conversations INTEGER DEFAULT 0,
    documents_viewed INTEGER DEFAULT 0,
    last_login TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
