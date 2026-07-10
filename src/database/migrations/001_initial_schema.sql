-- ------------------------------------------------------------------
-- 001_initial_schema.sql
-- Core tables for users, roles, departments and the manytomany junctions.
-- ------------------------------------------------------------------

CREATE TABLE departments (
    id            VARCHAR(36) PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id            VARCHAR(36) PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    description   TEXT,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE permissions (
    id            VARCHAR(36) PRIMARY KEY,
    key           VARCHAR(100) NOT NULL UNIQUE,
    description   TEXT,
    resource_id   VARCHAR(255),               -- optional scoped resource
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id            VARCHAR(36) PRIMARY KEY,
    username      VARCHAR(100) NOT NULL UNIQUE,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    department_id VARCHAR(36) REFERENCES departments(id),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Junction tables -------------------------------------------------

CREATE TABLE user_role (
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE CASCADE,
    role_id VARCHAR(36) REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE role_permission (
    role_id       VARCHAR(36) REFERENCES roles(id) ON DELETE CASCADE,
    permission_id VARCHAR(36) REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- Optional role hierarchy (for inheritance)
CREATE TABLE role_hierarchy (
    parent_role_id VARCHAR(36) REFERENCES roles(id) ON DELETE CASCADE,
    child_role_id  VARCHAR(36) REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (parent_role_id, child_role_id)
);
