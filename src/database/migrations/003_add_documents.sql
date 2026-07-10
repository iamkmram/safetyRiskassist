-- 003_add_documents.sql
-- Documents uploaded by users

CREATE TABLE IF NOT EXISTS documents (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    user_id INT NOT NULL,
    filename NVARCHAR(255) NOT NULL,
    content_type NVARCHAR(100),
    storage_url NVARCHAR(500) NOT NULL,
    uploaded_at DATETIME2 DEFAULT SYSDATETIME(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
