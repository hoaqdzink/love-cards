-- V2: Phase 1 seed data for hosting plans
INSERT INTO commerce.hosting_plans (
    id, name, duration_months, price, description, features, is_recommended, is_active
) VALUES
    ('90000000-0000-4000-8000-000000000006', 'Gói 6 tháng', 6, 99000,
     'Lưu trữ thiệp trực tuyến trong 6 tháng, phù hợp sự kiện ngắn hạn.',
     '["Public URL","QR code","Responsive card"]'::jsonb, false, true),
    ('90000000-0000-4000-8000-000000000012', 'Gói 12 tháng', 12, 159000,
     'Lưu trữ thiệp trực tuyến trong 12 tháng, phù hợp cưới và sự kiện cần lưu lâu hơn.',
     '["Public URL","QR code","Responsive card","Priority hosting"]'::jsonb, true, true)
ON CONFLICT (id) DO NOTHING;
