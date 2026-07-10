-- 001_initial_schema.sql
-- Base table for knowledge items
CREATE TABLE IF NOT EXISTS knowledge_items (
    id VARCHAR(36) PRIMARY KEY,
    title NVARCHAR(255) NOT NULL,
    content NTEXT NOT NULL,
    vector_blob VARBINARY(MAX) NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
