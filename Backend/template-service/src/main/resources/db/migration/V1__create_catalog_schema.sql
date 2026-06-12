-- V1: Catalog schema — templates, template_fields, music_library
CREATE SCHEMA IF NOT EXISTS catalog;

CREATE TABLE catalog.templates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(200) NOT NULL,
    slug            VARCHAR(200) UNIQUE NOT NULL,
    description     TEXT,
    event_type      VARCHAR(50) NOT NULL,
    color_tags      JSONB DEFAULT '[]',
    price           BIGINT NOT NULL CHECK (price > 0),
    status          VARCHAR(20) NOT NULL DEFAULT 'inactive',
    preview_url     TEXT NOT NULL,
    thumbnail_url   TEXT,
    assets_path     TEXT,
    has_music       BOOLEAN DEFAULT FALSE,
    is_featured     BOOLEAN DEFAULT FALSE,
    is_trending     BOOLEAN DEFAULT FALSE,
    view_count      BIGINT DEFAULT 0,
    purchase_count  BIGINT DEFAULT 0,
    metadata        JSONB DEFAULT '{}',
    deleted_at      TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by      UUID,
    updated_by      UUID
);

CREATE INDEX idx_templates_status_event_type ON catalog.templates(status, event_type);
CREATE INDEX idx_templates_is_featured ON catalog.templates(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_templates_is_trending ON catalog.templates(is_trending) WHERE is_trending = TRUE;
CREATE INDEX idx_templates_color_tags ON catalog.templates USING GIN (color_tags);

CREATE TABLE catalog.template_fields (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id     UUID NOT NULL REFERENCES catalog.templates(id) ON DELETE CASCADE,
    field_key       VARCHAR(100) NOT NULL,
    field_label     VARCHAR(200) NOT NULL,
    field_type      VARCHAR(30) NOT NULL,
    placeholder     VARCHAR(200),
    is_required     BOOLEAN DEFAULT FALSE,
    max_length      INTEGER,
    display_order   INTEGER NOT NULL DEFAULT 0,
    validation      JSONB DEFAULT '{}',
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by      UUID,
    updated_by      UUID,
    UNIQUE(template_id, display_order)
);

CREATE INDEX idx_template_fields_template_id ON catalog.template_fields(template_id);

CREATE TABLE catalog.music_library (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(200) NOT NULL,
    genre           VARCHAR(50),
    duration_sec    INTEGER,
    file_url        TEXT NOT NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by      UUID,
    updated_by      UUID
);
