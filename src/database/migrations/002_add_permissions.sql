-- 002_add_permissions.sql
-- Permissions table for rolebased access

CREATE TABLE IF NOT EXISTS permissions (
    id INT IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    permission_name NVARCHAR(100) NOT NULL,
    granted_at DATETIME2 DEFAULT SYSDATETIME(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
