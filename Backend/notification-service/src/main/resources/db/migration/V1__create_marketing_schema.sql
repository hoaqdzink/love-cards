-- V1: Marketing schema — newsletter_subscribers, b2b_contacts
CREATE SCHEMA IF NOT EXISTS marketing;

CREATE TABLE marketing.newsletter_subscribers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(320) UNIQUE NOT NULL,
    confirmed       BOOLEAN DEFAULT FALSE,
    confirm_token   VARCHAR(255),
    unsubscribed    BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE marketing.b2b_contacts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name    VARCHAR(200) NOT NULL,
    contact_name    VARCHAR(100) NOT NULL,
    email           VARCHAR(320) NOT NULL,
    phone           VARCHAR(15),
    message         TEXT,
    status          VARCHAR(20) DEFAULT 'new',
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_by      UUID
);
