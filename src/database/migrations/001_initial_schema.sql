-- Help Documentation & Support Center
CREATE TABLE IF NOT EXISTS help_articles (
    id UUID PRIMARY KEY,
    title VARCHAR NOT NULL,
    category VARCHAR NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    is_popular BOOLEAN DEFAULT FALSE,
    is_recent BOOLEAN DEFAULT FALSE
);

-- Seed sample help articles
INSERT INTO help_articles (id, title, category, content, is_popular, is_recent) VALUES
('help-001', 'Getting Started with the AI Assistant', 'Getting Started', 'Welcome to the AI Assistant...', TRUE, FALSE),
('help-002', 'How to Search for Travel Information', 'Using the AI Assistant', 'Learn how to ask effective questions...', FALSE, TRUE),
('help-003', 'Uploading and Managing Documents', 'Document Management', 'Stepbystep guide for document upload...', FALSE, FALSE)
ON CONFLICT DO NOTHING;
