-- V1: Cards schema — cards, card_fields, card_media, bank_accounts
CREATE SCHEMA IF NOT EXISTS cards;

CREATE TABLE cards.cards (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL,
    template_id     UUID NOT NULL,
    order_item_id   UUID,
    event_name      VARCHAR(200),
    slug            VARCHAR(200),
    guest_link_id   VARCHAR(10) UNIQUE,
    status          VARCHAR(20) NOT NULL DEFAULT 'draft',
    published_at    TIMESTAMP,
    expires_at      TIMESTAMP,
    music_id        UUID,
    enable_rsvp     BOOLEAN DEFAULT TRUE,
    enable_wishes   BOOLEAN DEFAULT TRUE,
    enable_bank_info BOOLEAN DEFAULT FALSE,
    og_title        VARCHAR(200),
    og_description  TEXT,
    og_image_url    TEXT,
    settings        JSONB DEFAULT '{}',
    view_count      BIGINT DEFAULT 0,
    deleted_at      TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by      UUID,
    updated_by      UUID
);

CREATE INDEX idx_cards_user_id ON cards.cards(user_id, status);
CREATE INDEX idx_cards_slug_user_id ON cards.cards(slug, user_id);
CREATE INDEX idx_cards_expires_at ON cards.cards(expires_at) WHERE status = 'published';

CREATE TABLE cards.card_fields (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id             UUID NOT NULL REFERENCES cards.cards(id) ON DELETE CASCADE,
    template_field_id   UUID NOT NULL,
    field_value         TEXT,
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(card_id, template_field_id)
);

CREATE INDEX idx_card_fields_card_id ON cards.card_fields(card_id);

CREATE TABLE cards.card_media (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id             UUID NOT NULL REFERENCES cards.cards(id) ON DELETE CASCADE,
    template_field_id   UUID,
    file_url            TEXT NOT NULL,
    file_type           VARCHAR(20) NOT NULL,
    file_size           BIGINT,
    original_name       VARCHAR(255),
    metadata            JSONB DEFAULT '{}',
    created_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_card_media_card_id ON cards.card_media(card_id);

CREATE TABLE cards.bank_accounts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id         UUID NOT NULL REFERENCES cards.cards(id) ON DELETE CASCADE,
    bank_name       VARCHAR(100) NOT NULL,
    account_number  VARCHAR(30) NOT NULL,
    account_holder  VARCHAR(100) NOT NULL,
    label           VARCHAR(50),
    display_order   INTEGER DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
