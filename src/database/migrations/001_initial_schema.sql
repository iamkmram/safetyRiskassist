-- 001_initial_schema.sql
-- Core tables required for the Travel Knowledge Assistant

CREATE TABLE IF NOT EXISTS users (
    id INT IDENTITY PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    department_id INT NOT NULL,
    password_hash NVARCHAR(255) NOT NULL,
    created_at DATETIME2 DEFAULT SYSDATETIME()
);

CREATE TABLE IF NOT EXISTS departments (
    id INT IDENTITY PRIMARY KEY,
    name NVARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS conversations (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id INT NOT NULL,
    started_at DATETIME2 DEFAULT SYSDATETIME(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS messages (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    conversation_id UNIQUEIDENTIFIER NOT NULL,
    sender NVARCHAR(50) NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    created_at DATETIME2 DEFAULT SYSDATETIME(),
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);

CREATE TABLE IF NOT EXISTS analytics_metrics (
    id INT IDENTITY PRIMARY KEY,
    total_queries_this_week INT NOT NULL,
    most_searched_topics NVARCHAR(MAX) NOT NULL, -- JSON array stored as string
    recent_conversations NVARCHAR(MAX) NOT NULL, -- JSON array stored as string
    trending_travel_alerts INT NOT NULL,
    captured_at DATETIME2 DEFAULT SYSDATETIME()
);
