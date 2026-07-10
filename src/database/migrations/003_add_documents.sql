-- 003_add_documents.sql
-- Adds a documents table linked to knowledge items

CREATE TABLE IF NOT EXISTS documents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    knowledge_item_id UUID REFERENCES knowledge_items(id) ON DELETE CASCADE,
    filename        VARCHAR(255) NOT NULL,
    file_url        TEXT NOT NULL,
    uploaded_at     TIMESTAMP WITH TIME ZONE DEFAULT now()
);
