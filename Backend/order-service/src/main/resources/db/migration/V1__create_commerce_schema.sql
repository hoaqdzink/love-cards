-- V1: Commerce schema — hosting_plans, orders, order_items, cart_items, order_status_history
CREATE SCHEMA IF NOT EXISTS commerce;

CREATE TABLE commerce.hosting_plans (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    duration_months INTEGER NOT NULL,
    price           BIGINT NOT NULL,
    description     TEXT,
    features        JSONB DEFAULT '[]',
    is_recommended  BOOLEAN DEFAULT FALSE,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by      UUID,
    updated_by      UUID
);

CREATE TABLE commerce.orders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code      VARCHAR(20) UNIQUE NOT NULL,
    user_id         UUID NOT NULL,
    total_amount    BIGINT NOT NULL CHECK (total_amount > 0),
    payment_method  VARCHAR(30),
    payment_status  VARCHAR(20) NOT NULL DEFAULT 'pending',
    payment_ref     VARCHAR(255),
    payment_data    JSONB DEFAULT '{}',
    status          VARCHAR(20) NOT NULL DEFAULT 'created',
    paid_at         TIMESTAMP,
    deleted_at      TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by      UUID,
    updated_by      UUID
);

CREATE INDEX idx_orders_user_id ON commerce.orders(user_id, created_at DESC);
CREATE INDEX idx_orders_status ON commerce.orders(status);

CREATE TABLE commerce.order_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id        UUID NOT NULL REFERENCES commerce.orders(id) ON DELETE CASCADE,
    template_id     UUID NOT NULL,
    hosting_plan_id UUID REFERENCES commerce.hosting_plans(id),
    template_price  BIGINT NOT NULL,
    hosting_price   BIGINT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE commerce.cart_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL,
    template_id     UUID NOT NULL,
    added_at        TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, template_id)
);

CREATE TABLE commerce.order_status_history (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id        UUID NOT NULL REFERENCES commerce.orders(id),
    from_status     VARCHAR(20),
    to_status       VARCHAR(20) NOT NULL,
    reason          TEXT,
    changed_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    changed_by      UUID
);

CREATE INDEX idx_order_status_history_order_id ON commerce.order_status_history(order_id, changed_at);
