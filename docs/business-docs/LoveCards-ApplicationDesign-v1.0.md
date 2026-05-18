# Application Design — Love Cards Platform

**Phiên bản:** 1.0
**Ngày:** 2025
**Trạng thái:** Đã phê duyệt
**Tài liệu tham chiếu:** LoveCards-UserStories.md, LoveCards-BRD-v1.0.md

---

## Mục Lục

1. [Tổng quan Tech Stack](#1-tổng-quan-tech-stack)
2. [Kiến trúc hệ thống](#2-kiến-trúc-hệ-thống)
3. [Data Models / Database Schema](#3-data-models--database-schema)
4. [API Design](#4-api-design)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Luồng xử lý chính](#6-luồng-xử-lý-chính)
7. [Third-party Integrations](#7-third-party-integrations)
8. [Security & Authentication](#8-security--authentication)
9. [Deployment & Infrastructure](#9-deployment--infrastructure)

---

## 1. Tổng quan Tech Stack

### 1.1 Frontend

| Thành phần | Công nghệ | Phiên bản | Ghi chú |
|-----------|-----------|-----------|---------|
| Framework | React | 19.x | SPA, feature-based architecture |
| Build Tool | Vite | 8.x | Fast HMR, ESM-native |
| Ngôn ngữ | TypeScript | 5.9.x | Strict mode |
| Styling | TailwindCSS | 4.x | Utility-first CSS |
| Routing | React Router | 7.x | Client-side routing |
| State (Server) | TanStack Query | 5.x | Cache, refetch, loading states |
| State (Client) | Zustand | 5.x | Cart, UI state, language |
| Icons | Phosphor Icons | 2.x | Lightweight icon set |
| i18n | react-i18next | latest | Song ngữ VI/EN |

### 1.2 Backend

| Thành phần | Công nghệ | Phiên bản | Ghi chú |
|-----------|-----------|-----------|---------|
| Framework | Spring Boot | 3.4.x | Java 21+ |
| Ngôn ngữ | Java | 21 LTS | Virtual threads support |
| ORM | Spring Data JPA + Hibernate | 6.x | PostgreSQL dialect |
| Security | Spring Security | 6.x | OAuth2, JWT |
| API Docs | SpringDoc OpenAPI | 2.x | Swagger UI tự động |
| Validation | Jakarta Validation | 3.x | Bean validation |
| Email | Spring Mail + Thymeleaf | - | Template email |
| SMS | Twilio / SpeedSMS | - | OTP verification |

### 1.3 Database & Storage

| Thành phần | Công nghệ | Ghi chú |
|-----------|-----------|---------|
| Database chính | PostgreSQL | 16.x, AWS RDS |
| Cache | Redis | Session, rate limiting, OTP |
| File Storage | AWS S3 | Ảnh, nhạc, template assets |
| CDN | AWS CloudFront | Phân phối static assets |

### 1.4 Infrastructure

| Thành phần | Công nghệ | Ghi chú |
|-----------|-----------|---------|
| Cloud | AWS | EC2/ECS, RDS, S3, CloudFront |
| Container | Docker | Backend containerized |
| CI/CD | GitHub Actions | Build, test, deploy |
| Monitoring | CloudWatch | Logs, metrics, alerts |


---

## 2. Kiến trúc hệ thống

### 2.1 Sơ đồ kiến trúc tổng thể

```
┌─────────────────────────────────────────────────────────────────-┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────-┤
│                                                                  │
│  ┌──────────────────────┐    ┌────────────────────-──┐           │
│  │   Love Cards SPA     │    │   Admin Panel         │           │
│  │   (React 19 + Vite)  │    │   (cùng repo, /admin) │           │
│  │   lovecards.vn       │    │   lovecards.vn/admin  │           │
│  └──────────┬───────────┘    └──────────-┬───────────┘           │
│             │                            │                       │
└─────────────┼────────────────────────────┼───────────────────────┘
              │ HTTPS (REST API)           │
              ▼                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API GATEWAY / LOAD BALANCER               │
│                       (AWS ALB / Nginx)                         │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Spring Boot Application (3.4.x)             │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │                                                          │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌──────────────┐    │   │
│  │  │  Auth   │ │Template │ │  Order  │ │    Card      │    │   │
│  │  │ Module  │ │ Module  │ │ Module  │ │   Module     │    │   │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └──────┬───────┘    │   │
│  │       │           │           │             |            │   │
│  │  ┌────┴────┐ ┌────┴────┐ ┌────┴────┐ ┌──────┴───────┐    │   │
│  │  │  Cart   │ │  RSVP   │ │  Wish   │ │  Analytics   │    │   │
│  │  │ Module  │ │ Module  │ │ Module  │ │   Module     │    │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └──────────────┘    │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
└──────────┬──────────────┬──────────────┬────────────────────────┘
           │              │              │
           ▼              ▼              ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  PostgreSQL  │  │    Redis     │  │   AWS S3     │
│  (AWS RDS)   │  │  (ElastiC.)  │  │ + CloudFront │
│              │  │              │  │              │
│ Users        │  │ Sessions     │  │ Images       │
│ Templates    │  │ OTP codes    │  │ Music        │
│ Orders       │  │ Rate limits  │  │ Template HTML│
│ Cards        │  │ Cache        │  │ Thumbnails   │
│ RSVPs        │  │              │  │              │
│ Wishes       │  │              │  │              │
│ Analytics    │  │              │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
```

### 2.2 Phân tách Module Backend

| Module | Trách nhiệm | EPICs liên quan |
|--------|-------------|-----------------|
| **auth** | Đăng ký, đăng nhập (Google, Facebook, Email, SĐT), JWT, OAuth2 | EPIC 4 |
| **user** | Profile, quản lý tài khoản | EPIC 4, 12 |
| **template** | CRUD mẫu thiệp, tìm kiếm, lọc, phân loại | EPIC 1, 2, 12 |
| **cart** | Giỏ hàng (cookie merge, DB sync) | EPIC 3 |
| **order** | Đơn hàng, thanh toán, gói hosting, gia hạn | EPIC 6 |
| **card** | Thiệp đã tùy chỉnh, trường động, xuất bản, URL | EPIC 5, 7 |
| **media** | Upload ảnh, crop, nhạc nền, S3 integration | EPIC 5 |
| **share** | Chia sẻ URL, QR code, Open Graph | EPIC 7 |
| **rsvp** | Xác nhận tham dự, tổng hợp | EPIC 8 |
| **wish** | Lời chúc, quản lý hiển thị | EPIC 8 |
| **analytics** | Lượt xem, thiết bị, nguồn truy cập | EPIC 9 |
| **notification** | Email, SMS (OTP, xác nhận đơn, nhắc gia hạn) | Xuyên suốt |
| **admin** | Dashboard, quản lý mẫu/đơn hàng/người dùng | EPIC 12 |
| **legal** | Newsletter, B2B form, cookie consent | EPIC 10 |


---

## 3. Data Models / Database Schema

### 3.1 Entity Relationship Diagram (Tổng quan)

```
┌──────────┐       ┌──────────────┐       ┌──────────┐
│   User   │──1:N──│    Order     │──1:N──│   Card   │
└──────────┘       └──────────────┘       └──────────┘
     │                    │                     │
     │               ┌────┴────┐                │
     │               │OrderItem│                │
     │               └────┬────┘           ┌────┴────┐
     │                    │                │CardField│
     │              ┌─────┴─────┐          └─────────┘
     │              │  Template │               │
     │              └─────┬─────┘          ┌────┴────┐
     │                    │                │  Media  │
     │              ┌─────┴─────-─┐        └─────────┘
     │              │TemplateField│             │
     │              └───────────-─┘        ┌────┴────┐
     │                                     │  RSVP   │
     │                                     └─────────┘
     │                                          │
     │                                     ┌────┴────┐
     │                                     │  Wish   │
     └─────────────────────────────────────└─────────┘
```

### 3.2 Chi tiết Schema (Phase 1 — EPIC 1-7)

#### Quy tắc chọn kiểu dữ liệu

| Kiểu | Khi nào dùng | Ví dụ |
|------|-------------|-------|
| `VARCHAR(n)` | Trường có giới hạn rõ ràng về nghiệp vụ, cần enforce ở DB level | email (320), phone (15), slug (200), status/enum (30), order_code (20) |
| `TEXT` | Nội dung dài, không xác định trước độ dài, hoặc URLs | description, message, content, file_url, user_agent |
| `JSONB` | Dữ liệu có cấu trúc linh hoạt, cần query bên trong, hoặc extensible | tags, validation rules, metadata, payment response |

#### users

```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(320) UNIQUE,                   -- RFC 5321 max email length
    phone           VARCHAR(15) UNIQUE,                    -- E.164 format max
    password_hash   TEXT,                                  -- bcrypt output varies
    full_name       VARCHAR(100) NOT NULL,
    avatar_url      TEXT,                                  -- URL length unpredictable
    auth_provider   VARCHAR(20) NOT NULL DEFAULT 'local',  -- local, google, facebook
    provider_id     VARCHAR(255),                          -- OAuth provider ID
    role            VARCHAR(20) NOT NULL DEFAULT 'user',   -- user, admin
    status          VARCHAR(20) NOT NULL DEFAULT 'active', -- active, blocked, pending
    email_verified  BOOLEAN DEFAULT FALSE,
    phone_verified  BOOLEAN DEFAULT FALSE,
    language        VARCHAR(5) DEFAULT 'vi',               -- vi, en
    metadata        JSONB DEFAULT '{}',                    -- extensible: preferences, settings
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
```

#### templates

```sql
CREATE TABLE templates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(200) NOT NULL,
    slug            VARCHAR(200) UNIQUE NOT NULL,
    description     TEXT,                                  -- mô tả dài, không giới hạn
    event_type      VARCHAR(50) NOT NULL,                  -- wedding, birthday, party, other
    color_tags      JSONB DEFAULT '[]',                    -- ["pink", "white", "gold"]
    price           BIGINT NOT NULL,                       -- VND (stored as integer)
    status          VARCHAR(20) NOT NULL DEFAULT 'inactive', -- active, inactive
    preview_url     TEXT NOT NULL,                         -- S3 URL, độ dài không cố định
    thumbnail_url   TEXT,
    assets_path     TEXT,                                  -- S3 folder path
    has_music       BOOLEAN DEFAULT FALSE,
    is_featured     BOOLEAN DEFAULT FALSE,
    is_trending     BOOLEAN DEFAULT FALSE,
    view_count      BIGINT DEFAULT 0,
    purchase_count  BIGINT DEFAULT 0,
    metadata        JSONB DEFAULT '{}',                    -- extensible: style, extra config
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
```

#### template_fields (trường động của mẫu)

```sql
CREATE TABLE template_fields (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id     UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    field_key       VARCHAR(100) NOT NULL,                 -- bride_name, groom_name, event_date
    field_label     VARCHAR(200) NOT NULL,
    field_type      VARCHAR(30) NOT NULL,                  -- text, date, time, textarea, image
    placeholder     VARCHAR(200),
    is_required     BOOLEAN DEFAULT FALSE,
    max_length      INTEGER,
    display_order   INTEGER NOT NULL DEFAULT 0,
    validation      JSONB DEFAULT '{}',                    -- {"regex": "...", "min": 0, "max": 100}
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
```

#### orders

```sql
CREATE TABLE orders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_code      VARCHAR(20) UNIQUE NOT NULL,           -- LC-20250515-XXXX (format cố định)
    user_id         UUID NOT NULL REFERENCES users(id),
    total_amount    BIGINT NOT NULL,                       -- VND
    payment_method  VARCHAR(30),                           -- qr_bank, momo, zalopay, vnpay, visa
    payment_status  VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, paid, failed, cancelled
    payment_ref     VARCHAR(255),                          -- transaction reference từ gateway
    payment_data    JSONB DEFAULT '{}',                    -- gateway response, metadata
    paid_at         TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
```

#### order_items

```sql
CREATE TABLE order_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    template_id     UUID NOT NULL REFERENCES templates(id),
    hosting_plan_id UUID REFERENCES hosting_plans(id),
    template_price  BIGINT NOT NULL,
    hosting_price   BIGINT NOT NULL DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
```

#### hosting_plans

```sql
CREATE TABLE hosting_plans (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    duration_months INTEGER NOT NULL,
    price           BIGINT NOT NULL,                       -- VND
    description     TEXT,                                  -- mô tả dài
    features        JSONB DEFAULT '[]',                    -- ["RSVP", "Analytics", "Custom OG"]
    is_recommended  BOOLEAN DEFAULT FALSE,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
```

#### cards (thiệp đã tùy chỉnh)

```sql
CREATE TABLE cards (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    template_id     UUID NOT NULL REFERENCES templates(id),
    order_item_id   UUID REFERENCES order_items(id),
    event_name      VARCHAR(200),
    slug            VARCHAR(200),                          -- auto-generated from event_name
    status          VARCHAR(20) NOT NULL DEFAULT 'draft',  -- draft, published, expired
    published_at    TIMESTAMP,
    expires_at      TIMESTAMP,
    music_id        UUID REFERENCES music_library(id),
    enable_rsvp     BOOLEAN DEFAULT TRUE,
    enable_wishes   BOOLEAN DEFAULT TRUE,
    enable_bank_info BOOLEAN DEFAULT FALSE,
    og_title        VARCHAR(200),
    og_description  TEXT,                                  -- mô tả OG có thể dài
    og_image_url    TEXT,                                  -- URL không cố định
    settings        JSONB DEFAULT '{}',                    -- extensible card settings
    view_count      BIGINT DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
```

#### card_fields (dữ liệu đã điền)

```sql
CREATE TABLE card_fields (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id         UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    template_field_id UUID NOT NULL REFERENCES template_fields(id),
    field_value     TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
```

#### card_media (ảnh đã upload)

```sql
CREATE TABLE card_media (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id         UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    template_field_id UUID REFERENCES template_fields(id),
    file_url        TEXT NOT NULL,                         -- S3 URL, độ dài không cố định
    file_type       VARCHAR(20) NOT NULL,                  -- image, music
    file_size       BIGINT,
    original_name   VARCHAR(255),
    metadata        JSONB DEFAULT '{}',                    -- crop info, dimensions, etc.
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
```

#### cart_items (giỏ hàng DB cho user đã đăng nhập)

```sql
CREATE TABLE cart_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    template_id     UUID NOT NULL REFERENCES templates(id),
    added_at        TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, template_id)
);
```

#### music_library

```sql
CREATE TABLE music_library (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(200) NOT NULL,
    genre           VARCHAR(50),                           -- romantic, cheerful, classical
    duration_sec    INTEGER,
    file_url        TEXT NOT NULL,                         -- S3 URL
    is_active       BOOLEAN DEFAULT TRUE,
    metadata        JSONB DEFAULT '{}',                    -- artist, bpm, mood tags
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### 3.3 Schema bổ sung (Phase 2 — EPIC 8-12)

#### rsvps

```sql
CREATE TABLE rsvps (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id         UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    guest_name      VARCHAR(100) NOT NULL,
    attending       BOOLEAN NOT NULL,
    guest_count     INTEGER DEFAULT 1,
    note            TEXT,                                  -- ghi chú tự do, không giới hạn
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
```

#### wishes (lời chúc)

```sql
CREATE TABLE wishes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id         UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    sender_name     VARCHAR(100) NOT NULL,
    content         TEXT NOT NULL,                         -- nội dung lời chúc, tối đa 500 ký tự (validate ở app)
    is_visible      BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
```

#### bank_accounts (tài khoản ngân hàng mừng cưới)

```sql
CREATE TABLE bank_accounts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id         UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    bank_name       VARCHAR(100) NOT NULL,
    account_number  VARCHAR(30) NOT NULL,                  -- số tài khoản ngân hàng VN max ~20 ký tự
    account_holder  VARCHAR(100) NOT NULL,
    label           VARCHAR(50),                           -- bride, groom
    display_order   INTEGER DEFAULT 0,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
```

#### card_analytics

```sql
CREATE TABLE card_analytics (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id         UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    viewed_at       TIMESTAMP NOT NULL DEFAULT NOW(),
    device_type     VARCHAR(20),                           -- mobile, tablet, desktop
    os              VARCHAR(30),                           -- iOS, Android, Windows, macOS
    source          VARCHAR(50),                           -- zalo, facebook, messenger, sms, direct
    ip_hash         VARCHAR(64),                           -- SHA-256 hash, luôn 64 chars
    user_agent      TEXT,                                  -- UA string rất dài, không giới hạn
    extra           JSONB DEFAULT '{}'                     -- UTM params, referrer details
);
CREATE INDEX idx_card_analytics_card_id ON card_analytics(card_id);
CREATE INDEX idx_card_analytics_viewed_at ON card_analytics(viewed_at);
```

#### newsletter_subscribers

```sql
CREATE TABLE newsletter_subscribers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(320) UNIQUE NOT NULL,
    confirmed       BOOLEAN DEFAULT FALSE,
    confirm_token   VARCHAR(255),
    unsubscribed    BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
```

#### b2b_contacts

```sql
CREATE TABLE b2b_contacts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name    VARCHAR(200) NOT NULL,
    contact_name    VARCHAR(100) NOT NULL,
    email           VARCHAR(320) NOT NULL,
    phone           VARCHAR(15),
    message         TEXT,                                  -- nội dung liên hệ, không giới hạn
    status          VARCHAR(20) DEFAULT 'new',             -- new, contacted, closed
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
```


---

## 4. API Design

### 4.1 Quy ước chung

- Base URL: `https://api.lovecards.vn/v1`
- Format: JSON
- Authentication: Bearer JWT token trong header `Authorization`
- Pagination: `?page=1&size=20`
- Error format: `{ "error": "ERROR_CODE", "message": "Mô tả lỗi", "details": {} }`
- HTTP Status Codes: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 422 (Validation Error), 500 (Server Error)

### 4.2 API Endpoints — Phase 1 (EPIC 1-7)

#### Auth Module

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/auth/register` | Đăng ký bằng email + mật khẩu | No |
| POST | `/auth/login` | Đăng nhập email + mật khẩu | No |
| POST | `/auth/login/phone` | Gửi OTP đến SĐT | No |
| POST | `/auth/verify-otp` | Xác thực OTP | No |
| POST | `/auth/oauth/google` | Đăng nhập Google (exchange code) | No |
| POST | `/auth/oauth/facebook` | Đăng nhập Facebook (exchange code) | No |
| POST | `/auth/forgot-password` | Gửi email reset mật khẩu | No |
| POST | `/auth/reset-password` | Đặt lại mật khẩu | No |
| POST | `/auth/verify-email` | Xác thực email (từ link) | No |
| POST | `/auth/refresh` | Refresh access token | No |
| POST | `/auth/logout` | Đăng xuất (invalidate token) | Yes |
| GET | `/auth/me` | Lấy thông tin user hiện tại | Yes |

#### Template Module

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/templates` | Danh sách mẫu (filter, sort, search, paginate) | No |
| GET | `/templates/featured` | Mẫu nổi bật (trang chủ) | No |
| GET | `/templates/trending` | Mẫu trending (trang chủ) | No |
| GET | `/templates/{slug}` | Chi tiết mẫu + fields | No |
| GET | `/templates/categories` | Danh sách danh mục sự kiện + số lượng | No |
| GET | `/templates/search?q=keyword` | Tìm kiếm mẫu | No |

**Query params cho GET `/templates`:**
- `event_type` — lọc theo loại sự kiện (wedding, birthday, party)
- `colors` — lọc theo màu sắc (pink, white, gold...)
- `sort` — sắp xếp (popular, newest, price_asc, price_desc)
- `page`, `size` — phân trang
- `q` — từ khóa tìm kiếm

#### Cart Module

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/cart` | Lấy giỏ hàng của user | Yes |
| POST | `/cart/items` | Thêm mẫu vào giỏ hàng | Yes |
| DELETE | `/cart/items/{templateId}` | Xóa mẫu khỏi giỏ hàng | Yes |
| POST | `/cart/merge` | Gộp giỏ hàng cookie vào DB | Yes |

**Request body cho POST `/cart/merge`:**
```json
{
  "cookieItems": ["template-id-1", "template-id-2"]
}
```

#### Order Module

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/hosting-plans` | Danh sách gói hosting | No |
| POST | `/orders` | Tạo đơn hàng mới | Yes |
| GET | `/orders` | Danh sách đơn hàng của user | Yes |
| GET | `/orders/{orderCode}` | Chi tiết đơn hàng | Yes |
| POST | `/orders/{orderCode}/pay/qr` | Tạo QR thanh toán chuyển khoản | Yes |
| POST | `/orders/{orderCode}/pay/momo` | Thanh toán MoMo | Yes |
| POST | `/orders/{orderCode}/pay/vnpay` | Thanh toán VNPay | Yes |
| POST | `/orders/{orderCode}/pay/zalopay` | Thanh toán ZaloPay | Yes |
| POST | `/orders/{orderCode}/pay/card` | Thanh toán thẻ quốc tế | Yes |
| POST | `/orders/{orderCode}/confirm-transfer` | User xác nhận đã chuyển khoản | Yes |
| POST | `/orders/{orderCode}/renew` | Gia hạn hosting | Yes |

**Request body cho POST `/orders`:**
```json
{
  "items": [
    {
      "templateId": "uuid",
      "hostingPlanId": "uuid"
    }
  ]
}
```

#### Card Module (Thiệp đã tùy chỉnh)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/cards` | Danh sách thiệp của user | Yes |
| GET | `/cards/{id}` | Chi tiết thiệp (owner) | Yes |
| PUT | `/cards/{id}/fields` | Cập nhật trường động | Yes |
| POST | `/cards/{id}/media` | Upload ảnh cho thiệp | Yes |
| DELETE | `/cards/{id}/media/{mediaId}` | Xóa ảnh | Yes |
| PUT | `/cards/{id}/music` | Chọn nhạc nền | Yes |
| PUT | `/cards/{id}/settings` | Cập nhật settings (RSVP, wishes, bank) | Yes |
| POST | `/cards/{id}/publish` | Xuất bản thiệp | Yes |
| GET | `/cards/{id}/preview` | Preview thiệp (owner) | Yes |

#### Public Card View (Khách mời xem thiệp)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/public/cards/{slug}/{ownerId}/{guestLinkId}` | Xem thiệp công khai | No |

#### Media Module

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/music` | Danh sách nhạc nền (filter by genre) | Yes |
| POST | `/upload/image` | Upload ảnh (trả về S3 URL) | Yes |

### 4.3 API Endpoints — Phase 2 (EPIC 8-12)

#### RSVP Module

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/public/cards/{cardId}/rsvp` | Gửi RSVP (khách mời) | No |
| GET | `/cards/{id}/rsvps` | Xem tổng hợp RSVP (owner) | Yes |
| GET | `/cards/{id}/rsvps/export` | Xuất CSV | Yes |

#### Wish Module

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/public/cards/{cardId}/wishes` | Gửi lời chúc (khách mời) | No |
| GET | `/public/cards/{cardId}/wishes` | Xem lời chúc trên thiệp | No |
| GET | `/cards/{id}/wishes` | Quản lý lời chúc (owner) | Yes |
| PATCH | `/cards/{id}/wishes/{wishId}` | Ẩn/hiện lời chúc | Yes |
| DELETE | `/cards/{id}/wishes/{wishId}` | Xóa lời chúc | Yes |

#### Analytics Module

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/cards/{id}/analytics/overview` | Dashboard tổng quan | Yes |
| GET | `/cards/{id}/analytics/views` | Lượt xem theo ngày | Yes |
| GET | `/cards/{id}/analytics/devices` | Phân tích thiết bị | Yes |
| GET | `/cards/{id}/analytics/sources` | Phân tích nguồn truy cập | Yes |

#### Admin Module

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/admin/dashboard` | Dashboard tổng quan | Admin |
| GET | `/admin/templates` | Quản lý mẫu | Admin |
| POST | `/admin/templates` | Upload mẫu mới | Admin |
| PUT | `/admin/templates/{id}` | Cập nhật mẫu | Admin |
| DELETE | `/admin/templates/{id}` | Xóa mẫu | Admin |
| GET | `/admin/orders` | Quản lý đơn hàng | Admin |
| PATCH | `/admin/orders/{id}/status` | Cập nhật trạng thái đơn | Admin |
| GET | `/admin/users` | Quản lý người dùng | Admin |
| PATCH | `/admin/users/{id}/status` | Khóa/mở khóa user | Admin |
| GET | `/admin/revenue` | Báo cáo doanh thu | Admin |

#### Legal Module

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/newsletter/subscribe` | Đăng ký newsletter | No |
| POST | `/newsletter/confirm/{token}` | Xác nhận email | No |
| POST | `/b2b/contact` | Gửi form liên hệ B2B | No |


---

## 5. Frontend Architecture

### 5.1 Cấu trúc thư mục (Feature-based)

```
Frontend/src/
├── app/
│   ├── router/
│   │   ├── index.tsx              # Route definitions
│   │   ├── ProtectedRoute.tsx     # Auth guard
│   │   └── AdminRoute.tsx         # Admin guard
│   ├── store/
│   │   ├── useAuthStore.ts        # Zustand: auth state
│   │   ├── useCartStore.ts        # Zustand: cart (cookie + sync)
│   │   ├── useLanguageStore.ts    # Zustand: i18n toggle
│   │   └── useUIStore.ts          # Zustand: modals, toasts
│   └── providers/
│       ├── QueryProvider.tsx       # TanStack Query provider
│       ├── AuthProvider.tsx        # Auth context
│       └── I18nProvider.tsx        # react-i18next
│
├── features/
│   ├── home/                      # EPIC 1: Trang chủ
│   │   ├── components/
│   │   ├── hooks/
│   │   └── data/
│   ├── catalog/                   # EPIC 2: Danh mục & Tìm kiếm
│   │   ├── components/
│   │   ├── hooks/
│   │   │   ├── useTemplates.ts    # TanStack Query: fetch templates
│   │   │   ├── useTemplateFilters.ts
│   │   │   └── useTemplateSearch.ts
│   │   └── pages/
│   ├── cart/                      # EPIC 3: Giỏ hàng
│   │   ├── components/
│   │   ├── hooks/
│   │   └── pages/
│   ├── auth/                      # EPIC 4: Xác thực
│   │   ├── components/
│   │   ├── hooks/
│   │   └── pages/
│   ├── customize/                 # EPIC 5: Tùy chỉnh thiệp
│   │   ├── components/
│   │   ├── hooks/
│   │   └── pages/
│   ├── checkout/                  # EPIC 6: Thanh toán
│   │   ├── components/
│   │   ├── hooks/
│   │   └── pages/
│   ├── publish/                   # EPIC 7: Xuất bản & Chia sẻ
│   │   ├── components/
│   │   ├── hooks/
│   │   └── pages/
│   ├── guest-view/                # EPIC 8: Khách mời xem thiệp
│   │   ├── components/
│   │   └── pages/
│   ├── analytics/                 # EPIC 9: Phân tích
│   │   ├── components/
│   │   └── pages/
│   ├── legal/                     # EPIC 10: Pháp lý
│   │   └── pages/
│   └── admin/                     # EPIC 12: Admin Panel
│       ├── components/
│       ├── hooks/
│       └── pages/
│
├── shared/
│   ├── components/                # UI components tái sử dụng
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Toast/
│   │   ├── Pagination/
│   │   ├── SearchBar/
│   │   ├── FilterPanel/
│   │   ├── card-product/          # (đã có)
│   │   └── ...
│   ├── hooks/                     # (đã có: scroll, hover hooks)
│   ├── services/
│   │   ├── api.ts                 # Axios/fetch instance + interceptors
│   │   └── endpoints.ts           # API endpoint constants
│   └── utils/
│       ├── cookie.ts              # Cart cookie helpers
│       ├── format.ts              # formatPrice, formatDate
│       ├── slug.ts                # Vietnamese slug generator
│       └── validation.ts          # Form validation rules
│
├── layouts/
│   ├── MainLayout.tsx             # (đã có)
│   ├── AdminLayout.tsx            # Layout cho admin panel
│   ├── Header.tsx                 # (đã có)
│   └── Footer.tsx                 # (đã có)
│
├── pages/                         # Route-level pages
│   ├── HomePage.tsx               # (đã có)
│   ├── CatalogPage.tsx
│   ├── TemplatePreviewPage.tsx
│   ├── CartPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── CheckoutPage.tsx
│   ├── OrderConfirmPage.tsx
│   ├── CustomizePage.tsx
│   ├── MyCardsPage.tsx
│   ├── CardAnalyticsPage.tsx
│   ├── PublicCardPage.tsx         # Khách mời xem thiệp
│   ├── TermsPage.tsx
│   ├── PrivacyPage.tsx
│   └── admin/
│       ├── AdminDashboardPage.tsx
│       ├── AdminTemplatesPage.tsx
│       ├── AdminOrdersPage.tsx
│       └── AdminUsersPage.tsx
│
├── styles/
│   └── globals.css                # (đã có)
├── types/
│   ├── user.ts
│   ├── template.ts
│   ├── order.ts
│   ├── card.ts
│   └── api.ts
├── assets/
├── App.tsx
└── main.tsx
```

### 5.2 Routing Plan

```typescript
// app/router/index.tsx
const routes = [
  // Public routes
  { path: '/', element: <HomePage /> },
  { path: '/danh-muc', element: <CatalogPage /> },
  { path: '/danh-muc/:eventType', element: <CatalogPage /> },
  { path: '/mau-thiep/:slug', element: <TemplatePreviewPage /> },
  { path: '/gio-hang', element: <CartPage /> },
  { path: '/dang-nhap', element: <LoginPage /> },
  { path: '/dang-ky', element: <RegisterPage /> },
  { path: '/quen-mat-khau', element: <ForgotPasswordPage /> },
  { path: '/dat-lai-mat-khau/:token', element: <ResetPasswordPage /> },
  { path: '/dieu-khoan-su-dung', element: <TermsPage /> },
  { path: '/chinh-sach-bao-mat', element: <PrivacyPage /> },

  // Public card view (khách mời)
  { path: '/thiep/:eventSlug/:ownerId/:guestLinkId', element: <PublicCardPage /> },

  // Protected routes (cần đăng nhập)
  { path: '/thanh-toan', element: <ProtectedRoute><CheckoutPage /></ProtectedRoute> },
  { path: '/don-hang/:orderCode', element: <ProtectedRoute><OrderConfirmPage /></ProtectedRoute> },
  { path: '/tuy-chinh/:cardId', element: <ProtectedRoute><CustomizePage /></ProtectedRoute> },
  { path: '/thiep-cua-toi', element: <ProtectedRoute><MyCardsPage /></ProtectedRoute> },
  { path: '/thiep-cua-toi/:cardId/phan-tich', element: <ProtectedRoute><CardAnalyticsPage /></ProtectedRoute> },

  // Admin routes
  { path: '/admin', element: <AdminRoute><AdminDashboardPage /></AdminRoute> },
  { path: '/admin/mau-thiep', element: <AdminRoute><AdminTemplatesPage /></AdminRoute> },
  { path: '/admin/don-hang', element: <AdminRoute><AdminOrdersPage /></AdminRoute> },
  { path: '/admin/nguoi-dung', element: <AdminRoute><AdminUsersPage /></AdminRoute> },
];
```

### 5.3 State Management Strategy

| Layer | Tool | Dữ liệu | Ghi chú |
|-------|------|---------|---------|
| Server State | TanStack Query | Templates, orders, cards, RSVP, analytics | Cache, auto-refetch, optimistic updates |
| Client State | Zustand | Auth (token, user), Cart (cookie sync), Language, UI | Persist to localStorage/cookie |
| Form State | React Hook Form | Checkout form, customize fields, auth forms | Validation, performance |
| URL State | React Router | Filters, search, pagination | Shareable URLs |

### 5.4 Internationalization (i18n)

```
src/
├── locales/
│   ├── vi/
│   │   ├── common.json       # Nút, label chung
│   │   ├── home.json         # Trang chủ
│   │   ├── catalog.json      # Danh mục
│   │   ├── auth.json         # Đăng nhập/ký
│   │   ├── cart.json         # Giỏ hàng
│   │   ├── checkout.json     # Thanh toán
│   │   ├── customize.json    # Tùy chỉnh
│   │   └── errors.json       # Thông báo lỗi
│   └── en/
│       ├── common.json
│       ├── home.json
│       └── ...
```

- Mặc định: Tiếng Việt
- Lưu lựa chọn trong localStorage
- Không dùng URL prefix (`/vi/`, `/en/`)
- Nội dung user-generated không dịch tự động


---

## 6. Luồng xử lý chính

### 6.1 Luồng Mua thiệp (Browse → Payment → Customize → Publish)

```
┌─────────-┐     ┌──────────┐     ┌──────────┐     ┌─────────-─┐
│  Browse  │────▶│  Preview │────▶│ Add Cart │────▶│  Login    │
│ Catalog  │     │ Template │     │ (cookie) │     │(if needed)│
└─────-────┘     └──────────┘     └──────────┘     └────┬──────┘
                                                        │
                                                        ▼
┌──────-───┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Publish  │◀────│Customize │◀────│  Order   │◀────│ Checkout │
│  Card    │     │  Card    │     │ Confirm  │     │ Payment  │
└────┬─-───┘     └──────────┘     └──────────┘     └──────────┘
     │
     ▼
┌─────────┐
│  Share  │
│URL/QR/  │
│Zalo/SMS │
└─────────┘
```

**Chi tiết từng bước:**

1. **Browse Catalog** — GET `/templates` với filters
2. **Preview Template** — GET `/templates/{slug}` → hiển thị preview HTML trong iframe
3. **Add to Cart** — Lưu `templateId` vào cookie (chưa đăng nhập) hoặc POST `/cart/items` (đã đăng nhập)
4. **Login** — Nếu chưa đăng nhập → redirect `/dang-nhap?redirect=/gio-hang` → sau login POST `/cart/merge`
5. **Checkout** — Chọn hosting plan → POST `/orders` → redirect đến payment gateway
6. **Payment** — Xử lý thanh toán (QR/MoMo/VNPay/Card) → webhook callback → cập nhật order status
7. **Order Confirm** — Hiển thị xác nhận → tạo Card record (status: draft)
8. **Customize** — PUT `/cards/{id}/fields`, POST `/cards/{id}/media`, PUT `/cards/{id}/music`
9. **Publish** — POST `/cards/{id}/publish` → generate URL + OG image
10. **Share** — Hiển thị URL, QR code, nút chia sẻ Zalo/Messenger/SMS

### 6.2 Luồng Xác thực (Login + Cart Merge)

```
┌──────────────────────────────────────────────────────────-────┐
│                    ĐĂNG NHẬP GOOGLE/FACEBOOK                  │
├────────────────────────────────────────────────────────────-──┤
│                                                               │
│  Client                    Backend                            │
│    │                         │                                │
│    │──── OAuth redirect ────▶│                                │
│    │                         │──── Verify with Provider ────▶ │
│    │                         │◀─── User info ───────────────  │
│    │                         │                                │
│    │                         │── Find/Create user in DB       │
│    │                         │── Generate JWT (access+refresh)│
│    │                         │                                │
│    │◀─── JWT tokens ──────-──│                                │
│    │                         │                                │
│    │── Read cart from cookie │                                │
│    │── POST /cart/merge ────▶│── Merge cookie items to DB     │
│    │                         │── Skip duplicates              │
│    │◀─── Updated cart ─────-─│                                │
│    │                         │                                │
│    │── Clear cookie cart     │                                │
│    │── Redirect to prev page │                                │
│                                                               │
└────────────────────────────────────────────────────────-──────┘
```

### 6.3 Luồng Khách mời xem thiệp

```
┌────────────────────────────────────────────────────────────-──┐
│                    KHÁCH MỜI XEM THIỆP                        │
├────────────────────────────────────────────────────────────-──┤
│                                                               │
│  1. Nhận link: lovecards.vn/thiep/{slug}/{ownerId}/{linkId}   │
│                                                               │
│  2. Frontend request:                                         │
│     GET /public/cards/{slug}/{ownerId}/{linkId}               │
│     → Trả về: card data + template HTML + fields + music      │
│                                                               │
│  3. Render thiệp:                                             │
│     - Load template HTML trong iframe/container               │
│     - Inject field values vào template                        │
│     - Play nhạc nền (autoplay with mute toggle)               │
│     - Track analytics (POST /analytics event)                 │
│                                                               │
│  4. Tương tác:                                                │
│     - RSVP: POST /public/cards/{cardId}/rsvp                  │
│     - Lời chúc: POST /public/cards/{cardId}/wishes            │
│     - Xem tài khoản ngân hàng (nếu bật)                       │
│                                                               │
└────────────────────────────────────────────────────────-──────┘
```

### 6.4 Luồng Thanh toán QR chuyển khoản

```
Client                    Backend                    Bank/VietQR
  │                         │                           │
  │── POST /orders/{id}/    │                           │
  │   pay/qr ──────────────▶│                           │
  │                         │── Generate order code     │
  │                         │── Create VietQR content   │
  │◀── QR image + info ─────│                           │
  │                         │                           │
  │   [User quét QR,        │                           │
  │    chuyển khoản]        │                           │
  │                         │                           │
  │── POST /orders/{id}/    │                           │
  │   confirm-transfer ────▶│                           │
  │                         │── Check bank webhook/API  │
  │                         │   (hoặc manual confirm)   │
  │                         │                           │
  │                         │── Update order: paid      │
  │                         │── Create card record      │
  │                         │── Send email confirmation │
  │◀── Order confirmed ─────│                           │
  │                         │                           │
```


---

## 7. Third-party Integrations

### 7.1 Tổng quan tích hợp

| Dịch vụ | Mục đích | SDK/API | Ghi chú |
|---------|---------|---------|---------|
| Google OAuth | Đăng nhập | Spring Security OAuth2 Client | Client ID + Secret |
| Facebook OAuth | Đăng nhập | Spring Security OAuth2 Client | App ID + Secret |
| VNPay | Thanh toán ví/thẻ | VNPay SDK Java | Sandbox → Production |
| MoMo | Thanh toán ví | MoMo Payment API v2 | Partner code |
| ZaloPay | Thanh toán ví | ZaloPay API | App ID |
| VietQR | QR chuyển khoản | VietQR API | Generate QR image |
| Twilio / SpeedSMS | Gửi OTP | REST API | Rate limit 5/hour |
| AWS SES / SendGrid | Email | Spring Mail | Transactional emails |
| AWS S3 | File storage | AWS SDK Java | Upload ảnh, nhạc, templates |
| AWS CloudFront | CDN | - | Serve static assets |

### 7.2 Payment Gateway Flow

```
┌─────────────────────────────────────────────────────────┐
│                   PAYMENT INTEGRATION                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────┐                                            │
│  │  User   │                                            │
│  │ chọn PT │                                            │
│  └────┬────┘                                            │
│       │                                                 │
│       ├── QR Bank ──▶ VietQR API ──▶ Generate QR image  │
│       │                              User tự chuyển     │
│       │                              Webhook/manual xác │
│       │                              nhận               │
│       │                                                 │
│       ├── MoMo ────▶ MoMo API ───▶ Redirect to MoMo     │
│       │                              IPN callback       │
│       │                                                 │
│       ├── VNPay ───▶ VNPay API ──▶ Redirect to VNPay    │
│       │                             Return URL callback │
│       │                                                 │
│       ├── ZaloPay ─▶ ZaloPay API ▶ Redirect to ZaloPay  │
│       │                              Callback URL       │
│       │                                                 │
│       └── Card ────▶ VNPay/Stripe ▶ Tokenize + charge   │
│                                     3D Secure if needed │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 7.3 Email Templates

| Email | Trigger | Nội dung |
|-------|---------|---------|
| Xác thực email | Sau đăng ký | Link xác thực (hết hạn 24h) |
| Reset mật khẩu | Quên mật khẩu | Link đặt lại (hết hạn 1h) |
| Xác nhận đơn hàng | Thanh toán thành công | Mã đơn, chi tiết, link tùy chỉnh |
| Nhắc gia hạn (7 ngày) | Cron job | Thiệp sắp hết hạn, link gia hạn |
| Nhắc gia hạn (1 ngày) | Cron job | Thiệp hết hạn ngày mai |
| RSVP mới | Khách gửi RSVP | Tên khách, trạng thái, số người |
| Lời chúc mới | Khách gửi lời chúc | Tên người gửi, nội dung |
| Newsletter xác nhận | Đăng ký newsletter | Link double opt-in |

---

## 8. Security & Authentication

### 8.1 Authentication Strategy

```
┌─────────────────────────────────────────────────────────┐
│                  JWT-BASED AUTHENTICATION               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Access Token:                                          │
│  - Thời hạn: 15 phút                                    │
│  - Lưu: Memory (Zustand store)                          │
│  - Dùng: Authorization header                           │
│                                                         │
│  Refresh Token:                                         │
│  - Thời hạn: 7 ngày                                     │
│  - Lưu: HttpOnly cookie (secure, SameSite=Strict)       │
│  - Dùng: POST /auth/refresh                             │
│                                                         │
│  Flow:                                                  │
│  1. Login → nhận access + refresh token                 │
│  2. API call → gửi access token trong header            │
│  3. Access expired → auto refresh bằng refresh token    │
│  4. Refresh expired → redirect về login                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 8.2 Authorization (Role-based)

| Role | Quyền |
|------|-------|
| `anonymous` | Xem templates, preview, thêm cart (cookie), xem thiệp công khai, gửi RSVP/wish |
| `user` | Tất cả anonymous + mua, tùy chỉnh, xuất bản, quản lý thiệp, xem analytics |
| `admin` | Tất cả user + quản lý templates, orders, users, xem revenue |

### 8.3 Security Measures

| Biện pháp | Chi tiết |
|-----------|---------|
| HTTPS | TLS 1.2+ bắt buộc, redirect HTTP → HTTPS |
| Password Hashing | BCrypt (cost factor 12) |
| Input Validation | Jakarta Validation (server) + Zod/React Hook Form (client) |
| SQL Injection | JPA Parameterized queries (không raw SQL) |
| XSS | Content Security Policy headers, sanitize user input |
| CSRF | SameSite cookie + CSRF token cho form submissions |
| Rate Limiting | Redis-based: Login (5/min), OTP (5/hour), API (100/min) |
| File Upload | Validate MIME type, max 10MB, virus scan (optional) |
| PCI Compliance | Không lưu thông tin thẻ — delegate cho payment gateway |
| CORS | Whitelist: lovecards.vn, localhost (dev) |
| Audit Log | Ghi log admin actions (who, what, when) |

### 8.4 OTP Security

```
- OTP length: 6 digits
- Expiry: 5 phút
- Max attempts: 3 lần sai → block 15 phút
- Max sends: 5 lần/giờ/SĐT
- Storage: Redis (auto-expire)
- Delivery: SMS via Twilio/SpeedSMS
```

---

## 9. Deployment & Infrastructure

### 9.1 AWS Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        AWS CLOUD                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐                                           │
│  │  Route 53    │  DNS: lovecards.vn                        │
│  └──────┬───────┘                                           │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────┐     ┌──────────────────────────────┐      │
│  │  CloudFront  │────▶│  S3 Bucket (Static Frontend) │      │
│  │  (CDN)       │     │  + Media files               │      │
│  └──────┬───────┘     └──────────────────────────────┘      │
│         │                                                   │
│         │ /api/*                                            │
│         ▼                                                   │
│  ┌──────────────┐                                           │
│  │     ALB      │  Application Load Balancer                │
│  └──────┬───────┘                                           │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────┐     ┌──────────────┐                      │
│  │  ECS Fargate │     │  ECS Fargate │  (Auto-scaling)      │
│  │  (Backend 1) │     │  (Backend 2) │                      │
│  └──────┬───────┘     └──────┬───────┘                      │
│         │                    │  v                           │
│         ▼                    ▼ v                            │
│  ┌──────────────┐     ┌──────────────┐                      │
│  │  RDS         │     │ ElastiCache  │                      │
│  │ PostgreSQL   │     │   (Redis)    │                      │
│  │  (Multi-AZ)  │     │              │                      │
│  └──────────────┘     └──────────────┘                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 9.2 Environments

| Environment | Mục đích | URL | Ghi chú |
|-------------|---------|-----|---------|
| Development | Dev local | localhost:5173 (FE), localhost:8080 (BE) | Docker Compose |
| Staging | Test trước deploy | staging.lovecards.vn | AWS (nhỏ hơn prod) |
| Production | Live | lovecards.vn | AWS (full setup) |

### 9.3 CI/CD Pipeline (GitHub Actions)

```yaml
# Simplified flow:
trigger: push to main / PR

jobs:
  # Backend
  - build-backend:
      - Checkout
      - Java 21 setup
      - Maven build + test
      - Docker build
      - Push to ECR
      - Deploy to ECS (staging/prod)

  # Frontend
  - build-frontend:
      - Checkout
      - Node 20 setup
      - npm install
      - npm run build
      - Upload to S3
      - Invalidate CloudFront cache
```

### 9.4 Docker Setup (Development)

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16
    ports: ["5432:5432"]
    environment:
      POSTGRES_DB: lovecards
      POSTGRES_USER: lovecards
      POSTGRES_PASSWORD: dev_password

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  backend:
    build: ./Backend
    ports: ["8080:8080"]
    depends_on: [postgres, redis]
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/lovecards
      SPRING_REDIS_HOST: redis

  # Frontend chạy local bằng `npm run dev` (Vite HMR)
```

### 9.5 Monitoring & Logging

| Tool | Mục đích |
|------|---------|
| AWS CloudWatch | Application logs, metrics, alarms |
| CloudWatch Logs Insights | Query logs |
| Health Check | ALB health check endpoint `/actuator/health` |
| Alerts | Email/Slack khi error rate > threshold |

---

## Phụ lục A — Quyết định kỹ thuật đã xác nhận

| Quyết định | Lựa chọn | Lý do |
|-----------|----------|-------|
| Backend framework | Java Spring Boot 3.4.x | Yêu cầu của Product Owner |
| Database | PostgreSQL 16 | Relational, phù hợp với orders/users/templates |
| Frontend state | TanStack Query + Zustand | Nhẹ, TypeScript-first, phù hợp quy mô MVP |
| File storage | AWS S3 + CloudFront | Free Tier 12 tháng, đồng bộ với AWS hosting |
| Hosting | AWS (ECS + RDS + S3) | Full-stack trên 1 cloud provider |
| Admin Panel | Cùng repo, route `/admin/*` | Đơn giản, dùng chung API |
| Phạm vi | Full-stack, chia 2 phase | Phase 1: EPIC 1-7, Phase 2: EPIC 8-12 |

---

## Phụ lục B — Phân chia Phase triển khai

### Phase 1 (EPIC 1-7): Core Business Flow

| Ưu tiên | Module | Mô tả |
|---------|--------|-------|
| 1 | Backend setup | Spring Boot project, DB schema, Docker, CI/CD |
| 2 | Auth | Đăng ký/đăng nhập (Google, Facebook, Email, SĐT) |
| 3 | Template | API danh mục, tìm kiếm, lọc, preview |
| 4 | Cart | Giỏ hàng cookie + DB, merge |
| 5 | Order + Payment | Đơn hàng, tích hợp VNPay/MoMo |
| 6 | Card Customize | Trường động, upload ảnh, nhạc |
| 7 | Publish + Share | Xuất bản URL, QR, Open Graph |

### Phase 2 (EPIC 8-12): Extended Features

| Ưu tiên | Module | Mô tả |
|---------|--------|-------|
| 8 | RSVP + Wishes | Khách mời tương tác |
| 9 | Analytics | Lượt xem, thiết bị, nguồn |
| 10 | Legal | Cookie consent, ToS, Privacy |
| 11 | i18n | Song ngữ VI/EN |
| 12 | Admin Panel | Dashboard, quản lý mẫu/đơn/user |

---

*Tài liệu này được tạo dựa trên LoveCards-UserStories.md và LoveCards-BRD-v1.0.md.*
*Phiên bản: 1.0 | Ngày tạo: 2025 | Trạng thái: Đã phê duyệt*