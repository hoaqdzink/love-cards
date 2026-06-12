-- V2: Engagement schema — rsvps, wishes
CREATE SCHEMA IF NOT EXISTS engagement;

CREATE TABLE engagement.rsvps (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id         UUID NOT NULL,
    guest_name      VARCHAR(100) NOT NULL,
    attending       BOOLEAN NOT NULL,
    guest_count     INTEGER DEFAULT 1,
    note            TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rsvps_card_id ON engagement.rsvps(card_id);
CREATE INDEX idx_rsvps_card_id_guest_name ON engagement.rsvps(card_id, guest_name);

CREATE TABLE engagement.wishes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id         UUID NOT NULL,
    sender_name     VARCHAR(100) NOT NULL,
    content         TEXT NOT NULL,
    is_visible      BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_wishes_card_id ON engagement.wishes(card_id, is_visible, created_at DESC);
