-- 002_add_permissions.sql
-- Permissions table for RBAC
CREATE TABLE IF NOT EXISTS permissions (
    id VARCHAR(36) PRIMARY KEY,
    role NVARCHAR(100) NOT NULL,
    resource NVARCHAR(255) NOT NULL,
    action NVARCHAR(50) NOT NULL
);
