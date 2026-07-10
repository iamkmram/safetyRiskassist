-- ------------------------------------------------------------------
-- 003_add_documents.sql
-- Table for document metadata that can be attached to knowledge items
-- ------------------------------------------------------------------

CREATE TABLE documents (
    id               VARCHAR(36) PRIMARY KEY,
    name             VARCHAR(255) NOT NULL,
    mime_type        VARCHAR(100),
    storage_url      VARCHAR(1024) NOT NULL,
    uploaded_by      VARCHAR(36) REFERENCES users(id),
    department_id    VARCHAR(36) REFERENCES departments(id),
    required_permission VARCHAR(100), -- permission key needed to access
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
