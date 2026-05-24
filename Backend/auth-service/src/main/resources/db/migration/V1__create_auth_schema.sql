-- V1: Auth schema — users table
CREATE SCHEMA IF NOT EXISTS auth;

CREATE TABLE auth.users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(320) UNIQUE,
    phone           VARCHAR(15) UNIQUE,
    password_hash   TEXT,
    full_name       VARCHAR(100) NOT NULL,
    avatar_url      TEXT,
    auth_provider   VARCHAR(20) NOT NULL DEFAULT 'local',
    provider_id     VARCHAR(255),
    role            VARCHAR(20) NOT NULL DEFAULT 'user',
    status          VARCHAR(20) NOT NULL DEFAULT 'pending',
    email_verified  BOOLEAN DEFAULT FALSE,
    phone_verified  BOOLEAN DEFAULT FALSE,
    language        VARCHAR(5) DEFAULT 'vi',
    metadata        JSONB DEFAULT '{}',
    deleted_at      TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by      UUID,
    updated_by      UUID,
    CONSTRAINT chk_users_email_or_phone CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

CREATE INDEX idx_users_status ON auth.users(status);
CREATE INDEX idx_users_auth_provider ON auth.users(auth_provider, provider_id);
