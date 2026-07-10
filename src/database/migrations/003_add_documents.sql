-- 003_add_documents.sql
-- Documents table linked to knowledge items
CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(36) PRIMARY KEY,
    knowledge_item_id VARCHAR(36) NOT NULL,
    file_path NVARCHAR(512) NOT NULL,
    metadata NVARCHAR(MAX) NULL,
    CONSTRAINT fk_knowledge_item FOREIGN KEY (knowledge_item_id)
        REFERENCES knowledge_items(id) ON DELETE CASCADE
);
