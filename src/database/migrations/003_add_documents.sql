-- Add linking table between documents and conversations
CREATE TABLE conversation_documents (
    conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
    document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
    PRIMARY KEY (conversation_id, document_id)
);
