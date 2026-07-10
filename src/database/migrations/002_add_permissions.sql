CREATE TABLE permissions (
    permission_id  UUID PRIMARY KEY,
    role           TEXT NOT NULL,
    resource       TEXT NOT NULL,
    can_read       BOOLEAN NOT NULL DEFAULT FALSE,
    can_write      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO permissions (permission_id, role, resource, can_read, can_write)
VALUES
    (gen_random_uuid(), 'admin', 'help', TRUE, TRUE),
    (gen_random_uuid(), 'user',  'help', TRUE, FALSE);
