# Database Design Decisions — Love Cards Platform

**Phiên bản:** 1.0
**Ngày:** 2025

---

## 1. Quyết định đã xác nhận

| # | Quyết định | Lựa chọn | Lý do |
|---|-----------|----------|-------|
| D1 | Soft Delete | `deleted_at` cho tables quan trọng (users, templates, orders, cards) | Khôi phục dữ liệu, audit trail, tránh mất data vĩnh viễn |
| D2 | Audit Columns | `created_at` + `updated_at` + `created_by` + `updated_by` cho tất cả tables | Track ai tạo/sửa, hỗ trợ debug và compliance |
| D3 | Order Status History | Bảng riêng `order_status_history` | State machine phức tạp, cần track transitions cho debug, dispute resolution |
| D4 | Guest Link ID | 1 nanoid(10) per card, lưu trong bảng `cards` | Đơn giản cho MVP, mỗi card 1 URL duy nhất |
| D5 | Analytics Split | 2 bảng: `card_analytics_raw` + `card_analytics_daily` | Raw cho chi tiết, daily cho dashboard performance. Scheduled job aggregate |
| D6 | Schema Separation | Tách schema theo bounded context | Isolation, clear ownership, dễ scale/migrate từng context độc lập |

---

## 2. Schema Layout

| Schema | Tables | Bounded Context |
|--------|--------|-----------------|
| `auth` | users | Identity & Access |
| `catalog` | templates, template_fields, music_library | Catalog & Discovery |
| `commerce` | cart_items, hosting_plans, orders, order_items, order_status_history | Commerce |
| `cards` | cards, card_fields, card_media, bank_accounts | Card Creation |
| `engagement` | rsvps, wishes | Engagement |
| `analytics` | card_analytics_raw, card_analytics_daily | Analytics |
| `marketing` | newsletter_subscribers, b2b_contacts | Marketing & Legal |
| `admin` | audit_logs | Admin |

**Tổng: 8 schemas, 17 tables**

---

## 3. Data Type Conventions

| Convention | Rule | Ví dụ |
|-----------|------|-------|
| Primary Key | UUID v4 (`gen_random_uuid()`) | Tất cả tables |
| Money | BIGINT (VND, không decimal) | price, total_amount |
| Timestamps | TIMESTAMP WITHOUT TIME ZONE (UTC) | created_at, updated_at |
| Short strings (bounded) | VARCHAR(n) | email(320), phone(15), slug(200) |
| Long strings (unbounded) | TEXT | description, file_url, user_agent |
| Flexible data | JSONB | metadata, color_tags, validation, payment_data |
| Enums | PostgreSQL ENUM type | Defined per schema |
| Boolean flags | BOOLEAN with DEFAULT | is_active, is_featured, email_verified |

---

## 4. Indexing Strategy

### Primary Indexes (tự động từ PK/UNIQUE)
- Tất cả PK (UUID) → B-tree index
- UNIQUE constraints → unique B-tree index

### Secondary Indexes (performance)

| Table | Index | Type | Mục đích |
|-------|-------|------|---------|
| auth.users | (status) | B-tree | Admin filter users |
| auth.users | (auth_provider, provider_id) | B-tree | OAuth lookup |
| catalog.templates | (status, event_type) | B-tree | Catalog filter |
| catalog.templates | (color_tags) | GIN | JSONB contains query |
| catalog.templates | (is_featured) WHERE is_featured=true | Partial | Homepage featured |
| catalog.templates | (is_trending) WHERE is_trending=true | Partial | Homepage trending |
| catalog.template_fields | (template_id, display_order) | B-tree | Load fields ordered |
| commerce.orders | (user_id, created_at DESC) | B-tree | User order list |
| commerce.orders | (status) | B-tree | Admin filter |
| commerce.order_status_history | (order_id, changed_at) | B-tree | History timeline |
| cards.cards | (user_id, status) | B-tree | User card list |
| cards.cards | (slug, user_id) | B-tree | URL resolution |
| cards.cards | (expires_at) WHERE status='published' | Partial | Expiry scheduler |
| cards.card_fields | (card_id) | B-tree | Load card data |
| cards.card_media | (card_id) | B-tree | Load card media |
| engagement.rsvps | (card_id) | B-tree | Load RSVPs |
| engagement.rsvps | (card_id, guest_name) | B-tree | Upsert match |
| engagement.wishes | (card_id, is_visible, created_at DESC) | B-tree | Public display |
| analytics.card_analytics_raw | (card_id, viewed_at) | B-tree | Dashboard queries |
| analytics.card_analytics_daily | (card_id, date) | UNIQUE | Aggregation lookup |
| admin.audit_logs | (entity_type, entity_id) | B-tree | Entity history |
| admin.audit_logs | (actor_id, created_at DESC) | B-tree | Admin activity |

---

## 5. Constraints & Business Rules (DB Level)

| Table | Constraint | Type | Business Rule |
|-------|-----------|------|--------------|
| auth.users | email OR phone NOT NULL | CHECK | IAR-01 |
| auth.users | email UNIQUE (WHERE deleted_at IS NULL) | Partial UNIQUE | IAR-02 |
| auth.users | phone UNIQUE (WHERE deleted_at IS NULL) | Partial UNIQUE | IAR-03 |
| catalog.templates | price > 0 | CHECK | CAT-03 |
| catalog.template_fields | UNIQUE(template_id, display_order) | UNIQUE | CAT-05 |
| commerce.cart_items | UNIQUE(user_id, template_id) | UNIQUE | COM-01 |
| commerce.orders | total_amount > 0 | CHECK | COM-06 |
| cards.cards | guest_link_id UNIQUE | UNIQUE | URL uniqueness |
| cards.card_fields | UNIQUE(card_id, template_field_id) | UNIQUE | One value per field |
| cards.bank_accounts | max 4 per card | APP-LEVEL CHECK | Business rule |
| engagement.wishes | content max 500 chars | APP-LEVEL CHECK | ENG-04 |
| analytics.card_analytics_daily | UNIQUE(card_id, date) | UNIQUE | One row per day |

---

## 6. Cross-Schema References

| From | To | FK Column | Note |
|------|----|-----------|------|
| commerce.cart_items | auth.users | user_id | User owns cart |
| commerce.cart_items | catalog.templates | template_id | Template in cart |
| commerce.orders | auth.users | user_id | User owns order |
| commerce.order_items | catalog.templates | template_id | Template purchased |
| commerce.order_items | commerce.hosting_plans | hosting_plan_id | Plan selected |
| cards.cards | auth.users | user_id | User owns card |
| cards.cards | catalog.templates | template_id | Card based on template |
| cards.cards | commerce.order_items | order_item_id | Card linked to purchase |
| cards.cards | catalog.music_library | music_id | Selected music |
| cards.card_fields | catalog.template_fields | template_field_id | Field definition |
| engagement.rsvps | cards.cards | card_id | RSVP belongs to card |
| engagement.wishes | cards.cards | card_id | Wish belongs to card |
| analytics.card_analytics_raw | cards.cards | card_id | View belongs to card |
| analytics.card_analytics_daily | cards.cards | card_id | Summary for card |
| admin.audit_logs | auth.users | actor_id | Admin who acted |

---

## 7. Migration Strategy

### Phase 1: Core tables
1. auth.users
2. catalog.templates, catalog.template_fields, catalog.music_library
3. commerce.hosting_plans, commerce.orders, commerce.order_items, commerce.cart_items, commerce.order_status_history
4. cards.cards, cards.card_fields, cards.card_media, cards.bank_accounts

### Phase 2: Extended tables
5. engagement.rsvps, engagement.wishes
6. analytics.card_analytics_raw, analytics.card_analytics_daily
7. marketing.newsletter_subscribers, marketing.b2b_contacts
8. admin.audit_logs

### Tools
- **Flyway** (Spring Boot integration) cho version-controlled migrations
- Naming: `V{version}__{description}.sql` (e.g., `V1__create_auth_schema.sql`)

---

## 8. Performance Considerations

| Concern | Solution |
|---------|---------|
| Analytics table growth | Split raw + daily; archive raw > 12 months |
| Template search | GIN index on color_tags JSONB; full-text search on name/description |
| Order listing | Composite index (user_id, created_at DESC) |
| Card public view | Index on guest_link_id (unique); cache in Redis |
| Soft delete queries | Partial indexes WHERE deleted_at IS NULL |
| RSVP upsert | Index on (card_id, guest_name) for efficient match |
| Dashboard aggregation | Pre-computed daily summary table |

---

*Tài liệu này ghi nhận các quyết định thiết kế database cho Love Cards Platform.*
*Phiên bản: 1.0 | Ngày tạo: 2025*