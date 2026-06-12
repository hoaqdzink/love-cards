-- V1: Analytics schema — card_analytics_raw, card_analytics_daily
CREATE SCHEMA IF NOT EXISTS analytics;

CREATE TABLE analytics.card_analytics_raw (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id         UUID NOT NULL,
    viewed_at       TIMESTAMP NOT NULL DEFAULT NOW(),
    device_type     VARCHAR(20),
    os              VARCHAR(30),
    source          VARCHAR(50),
    ip_hash         VARCHAR(64),
    user_agent      TEXT,
    extra           JSONB DEFAULT '{}'
);

CREATE INDEX idx_analytics_raw_card_id_viewed_at ON analytics.card_analytics_raw(card_id, viewed_at);

CREATE TABLE analytics.card_analytics_daily (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id         UUID NOT NULL,
    date            DATE NOT NULL,
    total_views     BIGINT NOT NULL DEFAULT 0,
    unique_views    BIGINT NOT NULL DEFAULT 0,
    mobile_views    BIGINT DEFAULT 0,
    tablet_views    BIGINT DEFAULT 0,
    desktop_views   BIGINT DEFAULT 0,
    source_zalo     BIGINT DEFAULT 0,
    source_facebook BIGINT DEFAULT 0,
    source_messenger BIGINT DEFAULT 0,
    source_sms      BIGINT DEFAULT 0,
    source_direct   BIGINT DEFAULT 0,
    source_other    BIGINT DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(card_id, date)
);
