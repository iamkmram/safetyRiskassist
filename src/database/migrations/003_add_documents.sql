-- 003_add_documents.sql
-- Add additional constraints and indexes for documents

CREATE INDEX IF NOT EXISTS idx_documents_knowledge_item_id
    ON documents (knowledge_item_id);

ALTER TABLE documents
    ADD CONSTRAINT chk_documents_filename_not_empty CHECK (length(filename) > 0);
