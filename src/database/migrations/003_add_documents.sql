CREATE TABLE documents (
    document_id    UUID PRIMARY KEY,
    user_id        UUID NOT NULL,
    title          TEXT NOT NULL,
    file_path      TEXT NOT NULL,
    uploaded_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
