-- V2: Admin schema — audit_logs
CREATE SCHEMA IF NOT EXISTS admin;

CREATE TABLE admin.audit_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id        UUID NOT NULL,
    action          VARCHAR(50) NOT NULL,
    entity_type     VARCHAR(50) NOT NULL,
    entity_id       UUID NOT NULL,
    old_value       JSONB,
    new_value       JSONB,
    reason          TEXT,
    ip_address      VARCHAR(45),
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_actor_id ON admin.audit_logs(actor_id, created_at DESC);
CREATE INDEX idx_audit_logs_entity ON admin.audit_logs(entity_type, entity_id);
