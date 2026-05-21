# API Design Rules

## Role
Bạn là AI Agent hỗ trợ thiết kế RESTful API cho dự án Love Cards. Đảm bảo API nhất quán, dễ hiểu, backward-compatible, và tuân thủ REST best practices.

## Core Principles
- API là contract giữa FE và BE — thay đổi phải cẩn thận.
- Consumer-first: thiết kế từ góc nhìn người dùng API (frontend dev).
- Consistency > Perfection: nhất quán quan trọng hơn hoàn hảo từng endpoint.
- Không expose internal implementation (DB schema, entity structure) ra API.

---

## URL Convention

### Rules

| Rule                          | Ví dụ đúng                    | Ví dụ sai                      |
|-------------------------------|-------------------------------|--------------------------------|
| Dùng noun, không verb         | `GET /cards`                  | `GET /getCards`                |
| Plural nouns                  | `/templates`                  | `/template`                    |
| Kebab-case                    | `/hosting-plans`              | `/hostingPlans`, `/hosting_plans` |
| Lowercase                     | `/auth/verify-otp`            | `/auth/VerifyOTP`              |
| Nested resource max 2 cấp    | `/cards/{id}/media`           | `/users/{id}/cards/{id}/media/{id}/comments` |
| ID trong path cho single resource | `/cards/{id}`             | `/cards?id=123`                |
| Filter/sort/page trong query  | `/templates?sort=popular`     | `/templates/sort/popular`      |

### URL Structure

```text
https://api.lovecards.vn/v1/{resource}
                         ──── ─────────
                          │       │
                     version   resource (plural noun)
```

### Resource Naming

| Resource       | URL                          | Ghi chú                    |
|----------------|------------------------------|----------------------------|
| Templates      | `/v1/templates`              | Public catalog             |
| Cards          | `/v1/cards`                  | User's customized cards    |
| Orders         | `/v1/orders`                 | User's orders              |
| Cart           | `/v1/cart`                   | Singular (1 cart per user) |
| Auth           | `/v1/auth/*`                 | Authentication actions     |
| Public views   | `/v1/public/cards/{slug}`    | No auth required           |
| Admin          | `/v1/admin/*`                | Admin-only endpoints       |

---

## HTTP Methods

| Method  | Mục đích              | Idempotent | Request Body | Response Code      |
|---------|-----------------------|------------|--------------|-------------------|
| GET     | Lấy resource          | ✅         | Không        | 200               |
| POST    | Tạo resource mới      | ❌         | Có           | 201 + Location    |
| PUT     | Cập nhật toàn bộ      | ✅         | Có           | 200               |
| PATCH   | Cập nhật một phần     | ❌         | Có           | 200               |
| DELETE  | Xóa resource          | ✅         | Không        | 204 (no content)  |

### Khi nào dùng POST vs PUT vs PATCH

| Tình huống                              | Method | Ví dụ                              |
|-----------------------------------------|--------|-------------------------------------|
| Tạo mới resource                        | POST   | `POST /cards`                       |
| Thay thế toàn bộ resource               | PUT    | `PUT /cards/{id}/fields`            |
| Cập nhật 1-2 fields                     | PATCH  | `PATCH /cards/{id}/wishes/{wid}`    |
| Action không phải CRUD                  | POST   | `POST /cards/{id}/publish`          |
| Toggle on/off                           | PATCH  | `PATCH /admin/users/{id}/status`    |

---

## Request Format

### Query Parameters (GET requests)

```text
GET /v1/templates?event_type=wedding&colors=pink,gold&sort=popular&page=0&size=12&q=rose
                  ──────────────────  ──────────────  ──────────  ──────  ──────  ──────
                  filter               filter (array)  sort        page    size    search
```

| Param type | Convention          | Ví dụ                          |
|------------|---------------------|--------------------------------|
| Filter     | `snake_case`        | `event_type=wedding`           |
| Array      | Comma-separated     | `colors=pink,gold`             |
| Sort       | `sort=field_order`  | `sort=popular`, `sort=price_asc` |
| Pagination | `page` + `size`     | `page=0&size=12`               |
| Search     | `q`                 | `q=rose garden`                |

### Request Body (POST/PUT/PATCH)

```json
{
  "title": "Đám cưới Minh & Lan",
  "content": "Trân trọng kính mời...",
  "templateId": "uuid-here"
}
```

| Rule                              | Giải thích                              |
|-----------------------------------|-----------------------------------------|
| camelCase cho field names         | Frontend-friendly                       |
| Không gửi field không thay đổi (PATCH) | Chỉ gửi fields cần update         |
| Dates dùng ISO-8601               | `"2025-06-15T10:30:00Z"`               |
| Money dùng integer (VND)          | `"price": 99000` (không dùng float)    |
| IDs dùng string (UUID)            | `"templateId": "550e8400-..."`          |

---

## Response Format

### Success Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "data": { ... },
  "timestamp": "2025-05-21T10:30:00Z"
}
```

### Paginated Response

```json
{
  "success": true,
  "code": "SUCCESS",
  "data": {
    "content": [ ... ],
    "totalElements": 48,
    "totalPages": 4,
    "currentPage": 0,
    "size": 12
  },
  "timestamp": "2025-05-21T10:30:00Z"
}
```

### Error Response

```json
{
  "success": false,
  "code": "VALIDATION_FAILED",
  "message": "Dữ liệu không hợp lệ",
  "errors": {
    "title": "Tiêu đề là bắt buộc",
    "templateId": "Template không tồn tại"
  },
  "timestamp": "2025-05-21T10:30:00Z"
}
```

### Response Rules

| Rule                                  | Giải thích                              |
|---------------------------------------|-----------------------------------------|
| Luôn wrap trong `ApiResponse`         | Consistent structure                    |
| `data` là null khi error              | Không trả data khi fail                 |
| `errors` object cho validation        | Field-level errors cho form             |
| `message` là human-readable           | Hiển thị trực tiếp cho user             |
| `code` là machine-readable            | Frontend dùng để map logic              |
| Timestamps dùng ISO-8601 UTC          | Consistent timezone                     |
| Không trả fields null/undefined       | Bỏ qua hoặc dùng default value         |

---

## HTTP Status Codes

### Sử dụng đúng

| Code | Khi nào                                    | Ví dụ                              |
|------|--------------------------------------------|------------------------------------|
| 200  | Request thành công                         | GET, PUT, PATCH thành công         |
| 201  | Resource được tạo                          | POST tạo card, order               |
| 204  | Thành công, không có body                  | DELETE thành công                   |
| 400  | Request sai format/logic                   | Missing required field              |
| 401  | Chưa xác thực                              | Thiếu/sai token                    |
| 403  | Không có quyền                             | User xóa card của người khác       |
| 404  | Resource không tồn tại                     | Card ID không có                   |
| 409  | Conflict                                   | Email đã tồn tại                   |
| 422  | Validation/Business logic error            | Vi phạm business rule              |
| 429  | Rate limited                               | Quá nhiều request                  |
| 500  | Server error                               | Unexpected exception               |
| 503  | Service unavailable                        | Downstream service down            |

### Không dùng

| Code | Lý do                                      |
|------|--------------------------------------------|
| 200 cho mọi thứ | Mất ngữ nghĩa HTTP                |
| 404 cho validation error | 404 = resource không tồn tại, không phải input sai |
| 500 cho business error | 500 = bug, không phải expected behavior |

---

## Versioning

### Rules
- Dùng URL path versioning: `/v1/`, `/v2/`.
- Mỗi breaking change → version mới.
- Version cũ phải hoạt động ít nhất 1 release cycle sau khi version mới ra.
- Non-breaking changes (thêm field, thêm endpoint) → giữ version hiện tại.

### Breaking vs Non-breaking Changes

| Breaking (cần version mới)           | Non-breaking (giữ version)            |
|--------------------------------------|---------------------------------------|
| Xóa field khỏi response             | Thêm field vào response              |
| Đổi tên field                        | Thêm endpoint mới                    |
| Đổi type của field                   | Thêm query param optional            |
| Xóa endpoint                         | Thêm enum value                      |
| Đổi URL structure                    | Thêm header optional                 |
| Đổi error code                       | Deprecate (nhưng giữ hoạt động)      |

### Deprecation Flow

```text
1. Đánh dấu deprecated trong docs + response header
2. Log warning khi endpoint cũ được gọi
3. Thông báo consumers (changelog, email)
4. Giữ hoạt động ít nhất 1 tháng
5. Remove sau khi confirm không còn traffic
```

---

## Authentication & Authorization

### Headers

```text
Authorization: Bearer {accessToken}
X-User-Id: {userId}              ← Set by Gateway (internal)
X-User-Roles: {roles}           ← Set by Gateway (internal)
```

### Endpoint Classification

| Type     | Auth Required | Ví dụ                              |
|----------|---------------|-------------------------------------|
| Public   | ❌            | `GET /templates`, `GET /public/cards/*` |
| User     | ✅ (any role) | `GET /cards`, `POST /orders`        |
| Owner    | ✅ + ownership check | `PUT /cards/{id}/fields`     |
| Admin    | ✅ + admin role | `GET /admin/dashboard`             |

### Authorization Pattern

```text
Public endpoints:     Không check
User endpoints:       Check token valid
Owner endpoints:      Check token valid + resource.userId == currentUser.id
Admin endpoints:      Check token valid + role == 'admin'
```

---

## Pagination

### Request

```text
GET /v1/templates?page=0&size=12&sort=popular
```

| Param  | Default | Max  | Ghi chú                    |
|--------|---------|------|----------------------------|
| page   | 0       | -    | Zero-indexed               |
| size   | 12      | 100  | Giới hạn để tránh abuse    |
| sort   | varies  | -    | Predefined sort options    |

### Response

```json
{
  "content": [...],
  "totalElements": 48,
  "totalPages": 4,
  "currentPage": 0,
  "size": 12,
  "hasNext": true,
  "hasPrevious": false
}
```

### Rules
- Zero-indexed pages (page 0 = trang đầu).
- Luôn trả `totalElements` và `totalPages`.
- Max `size` = 100 (server enforce).
- Default `size` = 12 (phù hợp grid 3x4 hoặc 4x3).
- Sort options phải predefined, không cho sort arbitrary field.

---

## Filtering & Search

### Filter Convention

```text
GET /v1/templates?event_type=wedding&colors=pink,gold&price_min=50000&price_max=200000
```

| Pattern              | Ví dụ                          | Ghi chú                    |
|----------------------|--------------------------------|----------------------------|
| Exact match          | `status=published`             | Single value               |
| Multiple values      | `colors=pink,gold`             | Comma-separated OR         |
| Range                | `price_min=50000&price_max=200000` | Min/max pair          |
| Boolean              | `is_featured=true`             | true/false string          |
| Search               | `q=rose garden`                | Full-text search           |

### Rules
- Filter params dùng `snake_case`.
- Unknown filter params → ignore (không error).
- Empty filter value → ignore (treat as "no filter").
- Invalid filter value → 400 Bad Request.

---

## Error Codes Convention

### Format

```text
{MODULE}_{ERROR_NAME}

Ví dụ:
- AUTH_EMAIL_EXISTS
- CART_MAX_ITEMS
- ORD_PAYMENT_FAILED
- CRD_NOT_OWNER
```

### Module Prefixes

| Prefix | Module       |
|--------|-------------|
| AUTH_  | Authentication |
| TPL_   | Template     |
| CART_  | Cart         |
| ORD_   | Order        |
| CRD_   | Card         |
| PUB_   | Publish      |
| GEN_   | General      |

### Rules
- Error code là UPPER_SNAKE_CASE.
- Prefix theo module.
- Message là human-readable, có thể hiển thị cho user.
- Frontend map error code → i18n message (không dùng message từ BE trực tiếp nếu có i18n).

---

## API Design Patterns

### Action Endpoints (non-CRUD)

Khi action không map vào CRUD, dùng POST + verb:

```text
POST /v1/cards/{id}/publish        ← Action: xuất bản
POST /v1/orders/{code}/pay/momo    ← Action: thanh toán
POST /v1/cart/merge                ← Action: gộp giỏ hàng
POST /v1/auth/logout               ← Action: đăng xuất
```

### Bulk Operations

```text
POST /v1/admin/templates/bulk-activate
Body: { "ids": ["id-1", "id-2", "id-3"] }

Response: {
  "success": true,
  "data": {
    "processed": 3,
    "failed": 0,
    "results": [...]
  }
}
```

### File Upload

```text
POST /v1/upload/image
Content-Type: multipart/form-data

Form fields:
- file: binary
- cardId: string
- templateFieldId: string

Response: {
  "data": {
    "mediaId": "uuid",
    "fileUrl": "https://cdn.lovecards.vn/...",
    "fileSize": 1024000
  }
}
```

### Webhook Endpoints

```text
POST /v1/webhooks/vnpay       ← Payment gateway callback
POST /v1/webhooks/bank        ← Bank transfer notification

Rules:
- Verify signature/checksum
- Idempotent (handle duplicate callbacks)
- Return 200 quickly, process async
- Log full payload for debugging
```

---

## Rate Limiting

### Headers

```text
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1621500000
Retry-After: 60              ← Chỉ khi bị 429
```

### Limits

| Endpoint Category    | Limit          | Window  |
|---------------------|----------------|---------|
| Public (GET)        | 100 req        | 1 phút  |
| Auth (POST)         | 5 req          | 1 phút  |
| Upload              | 20 req         | 1 phút  |
| OTP                 | 5 req          | 1 giờ   |
| General (authenticated) | 200 req   | 1 phút  |

---

## API Documentation Rules

### Mỗi endpoint phải document

| Item              | Bắt buộc | Ví dụ                              |
|-------------------|-----------|-------------------------------------|
| Method + URL      | ✅        | `POST /v1/cards`                    |
| Summary           | ✅        | "Tạo thiệp mới"                    |
| Auth requirement  | ✅        | "Bearer token required"             |
| Request params    | ✅        | Query params, path params           |
| Request body      | ✅ (nếu có) | JSON schema + example            |
| Success response  | ✅        | Status code + body example          |
| Error responses   | ✅        | Possible error codes                |
| Rate limit        | Nếu khác default | "5 req/min"                  |

### Changelog

Mỗi thay đổi API phải ghi vào changelog:

```markdown
## v1.2.0 (2025-06-01)
### Added
- `GET /v1/cards/{id}/analytics/sources` — Phân tích nguồn truy cập

### Changed
- `GET /v1/templates` — Thêm query param `price_min`, `price_max`

### Deprecated
- `GET /v1/templates/search` — Dùng `GET /v1/templates?q=...` thay thế
```

---

## Forbidden Actions

AI Agent KHÔNG được:
- Expose database column names trực tiếp (dùng camelCase DTO).
- Trả về toàn bộ entity (chỉ trả fields cần thiết).
- Dùng GET cho actions có side effects.
- Dùng 200 cho mọi response (phải dùng đúng status code).
- Tạo endpoint không có trong API design docs mà chưa được approve.
- Breaking change mà không tạo version mới.
- Trả sensitive data (password hash, internal IDs, tokens) trong response.
- Thiết kế endpoint quá specific cho 1 UI screen (API phải reusable).
- Dùng query params cho sensitive data (dùng body hoặc header).
- Tạo deeply nested URLs (max 2 levels: `/resource/{id}/sub-resource`).
