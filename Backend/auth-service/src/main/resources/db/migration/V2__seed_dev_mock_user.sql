-- V2: Dev mock user for Phase 2 cart/order (X-User-Id header)
INSERT INTO auth.users (
    id, email, full_name, auth_provider, role, status, email_verified
) VALUES (
    '10000000-0000-4000-8000-000000000001',
    'dev@lovecards.local',
    'Dev User',
    'local',
    'user',
    'active',
    TRUE
) ON CONFLICT (id) DO NOTHING;
