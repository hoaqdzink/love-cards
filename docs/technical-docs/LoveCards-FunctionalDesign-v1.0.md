# Functional Design — Love Cards Platform

**Phiên bản:** 1.0
**Ngày:** 2025
**Trạng thái:** Đang soạn thảo
**Tài liệu tham chiếu:** LoveCards-DomainModel-v1.0.md, LoveCards-ApplicationDesign-v1.0.md

---

## Mục Lục

1. [Module Auth](#1-module-auth)
2. [Module Template & Catalog](#2-module-template--catalog)
3. [Module Cart](#3-module-cart)
4. [Module Order & Payment](#4-module-order--payment)
5. [Module Card Customize](#5-module-card-customize)
6. [Module Publish & Share](#6-module-publish--share)
7. [Module RSVP, Wishes & Bank Info](#7-module-rsvp-wishes--bank-info)
8. [Module Analytics](#8-module-analytics)
9. [Module Admin Panel](#9-module-admin-panel)
10. [Cross-cutting Concerns](#10-cross-cutting-concerns)

---

## 1. Module Auth

### 1.1 Use Cases

| UC | Actor | Mô tả | Precondition |
|----|-------|-------|-------------|
| UC-AUTH-01 | KVL | Đăng ký bằng Email + Mật khẩu | Chưa có tài khoản |
| UC-AUTH-02 | KVL | Đăng nhập bằng Email + Mật khẩu | Có tài khoản, email verified |
| UC-AUTH-03 | KVL | Đăng ký/Đăng nhập bằng SĐT + OTP | - |
| UC-AUTH-04 | KVL | Đăng nhập bằng Google OAuth | - |
| UC-AUTH-05 | KVL | Đăng nhập bằng Facebook OAuth | - |
| UC-AUTH-06 | NDL | Quên mật khẩu | Có tài khoản email |
| UC-AUTH-07 | NDL | Đặt lại mật khẩu | Có reset token hợp lệ |
| UC-AUTH-08 | NDL | Đăng xuất | Đang đăng nhập |
| UC-AUTH-09 | System | Refresh access token | Có refresh token hợp lệ |
| UC-AUTH-10 | KVL | Xác thực email | Có verify token |

### 1.2 Chi tiết Use Case: Đăng ký Email (UC-AUTH-01)

**Flow chính:**
1. User nhập: fullName, email, password, confirmPassword
2. Validate input (xem 1.3)
3. Kiểm tra email chưa tồn tại
4. Hash password (BCrypt, cost 12)
5. Tạo User (status=pending, emailVerified=false)
6. Generate verify token (UUID, TTL 24h, lưu Redis)
7. Gửi email xác thực (async)
8. Trả về 201 + message "Kiểm tra email để xác thực"

**Flow thay thế:**
- Email đã tồn tại → 409 CONFLICT, "Email đã được sử dụng"
- Email format sai → 422, validation error

**Post-condition:**
- Event `UserRegistered` được publish
- User tồn tại trong DB với status=pending

### 1.3 Validation Rules

| Trường | Rules |
|--------|-------|
| fullName | Required, 2-100 ký tự, trim whitespace |
| email | Required, RFC 5321, lowercase, max 320 chars |
| password | Required, min 8 chars, phải có ít nhất 1 chữ + 1 số |
| confirmPassword | Required, phải khớp password |
| phone | 10 số, bắt đầu bằng 0, format VN |

### 1.4 Chi tiết Use Case: Đăng nhập Google OAuth (UC-AUTH-04)

**Flow chính:**
1. Frontend redirect user đến Google OAuth consent screen
2. User authorize → Google redirect về callback URL với `code`
3. Frontend gửi `code` đến backend POST `/auth/oauth/google`
4. Backend exchange `code` → access token với Google
5. Backend lấy user info từ Google (email, name, avatar, providerId)
6. Tìm user theo email:
   - **Có user + auth_provider=google** → đăng nhập
   - **Có user + auth_provider khác** → link Google vào account đó
   - **Không có user** → tạo user mới (status=active, emailVerified=true)
7. Generate JWT (access 15min + refresh 7 days)
8. Trả về tokens + user info
9. Frontend trigger cart merge (nếu có cookie cart)

**Post-condition:**
- Event `UserLoggedIn` được publish
- Nếu user mới: Event `UserRegistered` được publish

### 1.5 Chi tiết Use Case: SĐT + OTP (UC-AUTH-03)

**Flow gửi OTP:**
1. User nhập SĐT
2. Validate format (10 số, bắt đầu 0)
3. Kiểm tra rate limit: max 5 OTP/giờ/SĐT (Redis counter)
4. Generate OTP 6 chữ số
5. Lưu OTP vào Redis (key: `otp:{phone}`, TTL: 5 phút)
6. Gửi SMS qua Twilio/SpeedSMS (async)
7. Trả về 200 + message "OTP đã gửi"

**Flow xác thực OTP:**
1. User nhập OTP
2. Lấy OTP từ Redis theo phone
3. So sánh:
   - Đúng → xóa OTP khỏi Redis, tiếp tục
   - Sai → tăng attempt counter, max 3 lần → block 15 phút
4. Tìm user theo phone:
   - Có → đăng nhập
   - Không có → tạo user mới (phoneVerified=true)
5. Generate JWT tokens
6. Trả về tokens + user info

### 1.6 Token Strategy

```
┌─────────────────────────────────────────────────┐
│              JWT TOKEN LIFECYCLE                │
├─────────────────────────────────────────────────┤
│                                                 │
│  Access Token:                                  │
│  ├── Payload: {userId, role, email}             │
│  ├── TTL: 15 phút                               │
│  ├── Storage: Memory (Zustand)                  │
│  └── Refresh: tự động khi 401                   │
│                                                 │
│  Refresh Token:                                 │
│  ├── Payload: {userId, tokenId}                 │
│  ├── TTL: 7 ngày                                │
│  ├── Storage: HttpOnly cookie                   │
│  ├── Rotation: mỗi lần refresh → token mới      │
│  └── Revoke: lưu blacklist trong Redis          │
│                                                 │
│  Flow:                                          │
│  1. Login → access + refresh                    │
│  2. API call → Bearer {accessToken}             │
│  3. 401 → POST /auth/refresh (cookie)           │
│  4. New access token → retry request            │
│  5. Refresh expired → redirect /dang-nhap       │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 1.7 Error Codes

| Code | HTTP | Message |
|------|------|---------|
| AUTH_EMAIL_EXISTS | 409 | Email đã được sử dụng |
| AUTH_PHONE_EXISTS | 409 | Số điện thoại đã được sử dụng |
| AUTH_INVALID_CREDENTIALS | 401 | Email hoặc mật khẩu không đúng |
| AUTH_EMAIL_NOT_VERIFIED | 403 | Vui lòng xác thực email trước |
| AUTH_ACCOUNT_BLOCKED | 403 | Tài khoản đã bị khóa |
| AUTH_OTP_EXPIRED | 400 | OTP đã hết hạn |
| AUTH_OTP_INVALID | 400 | OTP không đúng |
| AUTH_OTP_RATE_LIMIT | 429 | Vượt quá số lần gửi OTP |
| AUTH_OTP_MAX_ATTEMPTS | 429 | Quá nhiều lần nhập sai, thử lại sau 15 phút |
| AUTH_TOKEN_EXPIRED | 401 | Token đã hết hạn |
| AUTH_TOKEN_INVALID | 401 | Token không hợp lệ |
| AUTH_RESET_TOKEN_INVALID | 400 | Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn |
| AUTH_OAUTH_FAILED | 400 | Xác thực với {provider} thất bại |


---

## 2. Module Template & Catalog

### 2.1 Use Cases

| UC | Actor | Mô tả |
|----|-------|-------|
| UC-TPL-01 | KVL | Xem danh sách mẫu (paginated) |
| UC-TPL-02 | KVL | Lọc mẫu theo event type |
| UC-TPL-03 | KVL | Lọc mẫu theo màu sắc |
| UC-TPL-04 | KVL | Sắp xếp mẫu (popular, newest, price) |
| UC-TPL-05 | KVL | Tìm kiếm mẫu bằng từ khóa |
| UC-TPL-06 | KVL | Xem chi tiết / preview mẫu |
| UC-TPL-07 | KVL | Xem mẫu featured (trang chủ) |
| UC-TPL-08 | KVL | Xem mẫu trending (trang chủ) |
| UC-TPL-09 | KVL | Xem danh mục sự kiện + số lượng |

### 2.2 Search & Filter Logic

**Query Builder:**
```
GET /templates?event_type=wedding&colors=pink,gold&sort=popular&page=1&size=12&q=rose
```

**Filter Pipeline:**
1. Base query: `WHERE status = 'active'`
2. + event_type filter: `AND event_type IN (:types)`
3. + color filter: `AND color_tags ?| array[:colors]` (JSONB contains any)
4. + search: `AND (name ILIKE '%:q%' OR description ILIKE '%:q%')`
5. Sort:
   - `popular` → `ORDER BY purchase_count DESC, view_count DESC`
   - `newest` → `ORDER BY created_at DESC`
   - `price_asc` → `ORDER BY price ASC`
   - `price_desc` → `ORDER BY price DESC`
6. Pagination: `LIMIT :size OFFSET (:page - 1) * :size`

**Response format:**
```json
{
  "data": [...templates],
  "pagination": {
    "page": 1,
    "size": 12,
    "total": 48,
    "totalPages": 4
  }
}
```

### 2.3 Template Preview Logic

**Khi user xem preview:**
1. GET `/templates/{slug}` → trả về template + fields
2. Frontend load `previewUrl` (HTML) trong iframe
3. Inject placeholder data vào template HTML
4. Increment `view_count` (async, debounce 1 view/user/template/hour)

### 2.4 Caching Strategy

| Data | Cache | TTL | Invalidation |
|------|-------|-----|-------------|
| Template list (popular) | Redis | 5 phút | On template update |
| Template detail | Redis | 10 phút | On template update |
| Featured templates | Redis | 15 phút | On admin change |
| Trending templates | Redis | 15 phút | Recalculate hourly |
| Categories + count | Redis | 30 phút | On template status change |

### 2.5 Error Codes

| Code | HTTP | Message |
|------|------|---------|
| TPL_NOT_FOUND | 404 | Mẫu thiệp không tồn tại |
| TPL_INACTIVE | 404 | Mẫu thiệp không khả dụng |
| TPL_INVALID_FILTER | 400 | Bộ lọc không hợp lệ |

---

## 3. Module Cart

### 3.1 Use Cases

| UC | Actor | Mô tả |
|----|-------|-------|
| UC-CART-01 | KVL | Thêm mẫu vào giỏ (cookie) |
| UC-CART-02 | NDL | Thêm mẫu vào giỏ (DB) |
| UC-CART-03 | KVL/NDL | Xem giỏ hàng |
| UC-CART-04 | KVL/NDL | Xóa mẫu khỏi giỏ |
| UC-CART-05 | NDL | Merge giỏ hàng cookie → DB |

### 3.2 Cart Strategy (Dual Storage)

```
┌─────────────────────────────────────────────────────────────┐
│                    CART DUAL STORAGE                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  CHƯA ĐĂNG NHẬP (Cookie Cart):                              │
│  ├── Storage: Cookie "lc_cart" (HttpOnly=false, 7 days)     │
│  ├── Format: JSON array of template IDs                     │
│  ├── Max items: 20                                          │
│  ├── Read: Frontend đọc trực tiếp                           │
│  └── Write: Frontend ghi trực tiếp                          │
│                                                             │
│  ĐÃ ĐĂNG NHẬP (DB Cart):                                    │
│  ├── Storage: PostgreSQL table cart_items                   │
│  ├── Read: GET /cart (API call)                             │
│  ├── Write: POST/DELETE /cart/items (API call)              │
│  └── Sync: Real-time qua API                                │
│                                                             │
│  MERGE FLOW (khi đăng nhập):                                │
│  1. Frontend đọc cookie cart                                │
│  2. POST /cart/merge { cookieItems: [...ids] }              │
│  3. Backend: forEach id → INSERT IGNORE (skip duplicate)    │
│  4. Backend trả về merged cart                              │
│  5. Frontend xóa cookie cart                                │
│  6. Hiển thị toast nếu có items được merge                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Cookie Format

```json
// Cookie name: "lc_cart"
// Cookie options: path=/, maxAge=7days, SameSite=Lax
["template-uuid-1", "template-uuid-2", "template-uuid-3"]
```

### 3.4 Merge Logic (Chi tiết)

```
Input: cookieItems = ["id-A", "id-B", "id-C"]
DB cart hiện tại: ["id-B", "id-D"]

Process:
  - id-A: không có trong DB → INSERT → merged
  - id-B: đã có trong DB → SKIP
  - id-C: không có trong DB → INSERT → merged

Result:
  - DB cart: ["id-B", "id-D", "id-A", "id-C"]
  - Response: { mergedCount: 2, cart: [...] }
  - Toast: "Đã thêm 2 mẫu từ phiên trước vào giỏ hàng"
```

### 3.5 Validation & Error Codes

| Code | HTTP | Message |
|------|------|---------|
| CART_TEMPLATE_NOT_FOUND | 404 | Mẫu thiệp không tồn tại |
| CART_TEMPLATE_INACTIVE | 400 | Mẫu thiệp không còn khả dụng |
| CART_DUPLICATE | 409 | Mẫu này đã có trong giỏ hàng |
| CART_MAX_ITEMS | 400 | Giỏ hàng đã đầy (tối đa 20 mẫu) |

---

## 4. Module Order & Payment

### 4.1 Use Cases

| UC | Actor | Mô tả |
|----|-------|-------|
| UC-ORD-01 | NDL | Tạo đơn hàng từ giỏ hàng |
| UC-ORD-02 | NDL | Thanh toán QR chuyển khoản |
| UC-ORD-03 | NDL | Thanh toán MoMo |
| UC-ORD-04 | NDL | Thanh toán VNPay |
| UC-ORD-05 | NDL | Thanh toán ZaloPay |
| UC-ORD-06 | NDL | Thanh toán thẻ quốc tế |
| UC-ORD-07 | NDL | Xem chi tiết đơn hàng |
| UC-ORD-08 | NDL | Gia hạn hosting |
| UC-ORD-09 | ADM | Xác nhận thanh toán thủ công |
| UC-ORD-10 | ADM | Hủy đơn hàng |

### 4.2 Order State Machine

```
                    ┌─────────────────────────────────────────┐
                    │         ORDER STATE MACHINE             │
                    └─────────────────────────────────────────┘

                              ┌─────────┐
                              │ CREATED │
                              └────┬────┘
                                   │
                          select payment method
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
             ┌───────────┐ ┌───────────┐   ┌───────────┐
             │ PENDING_QR│ │PENDING_   │   │PENDING_   │
             │           │ │EWALLET    │   │CARD       │
             └─────┬─────┘ └─────┬─────┘   └─────┬─────┘
                   │             │               │
         ┌────────┼────────┐     │               │
         │        │        │     │               │
    timeout   confirmed  webhook  callback    callback
    (30min)   transfer   (IPN)   (return)    (return)
         │        │        │     │              │
         ▼        ▼        ▼     ▼              ▼
  ┌──────────┐ ┌────┐  ┌────┐ ┌────┐         ┌────┐
  │EXPIRED   │ │VERI│  │PAID│ │PAID│         │PAID│
  │(timeout) │ │FYING│ │    │ │    │         │    │
  └──────────┘ └──┬─┘  └──┬─┘ └──┬─┘         └──┬─┘
                  │        │      │             │
            bank webhook   │      │             │
            or manual      │      │             │
            confirm        │      │             │
                  │        │      │             │
                  ▼        ▼      ▼             ▼
               ┌─────────────────────────────────┐
               │              PAID               │
               └───────────────┬─────────────────┘
                               │
                        create Card records
                        send confirmation email
                        clear cart items
                               │
                               ▼
                        ┌─────────────┐
                        │  COMPLETED  │
                        └─────────────┘

  Từ bất kỳ state nào (trừ PAID/COMPLETED):
                │
    admin cancel / user cancel
                │
                ▼
         ┌──────────┐
         │CANCELLED │
         └──────────┘

  Payment gateway trả về lỗi:
             │
             ▼
      ┌──────────┐
      │  FAILED  │──── user có thể retry (tạo payment mới)
      └──────────┘
```

### 4.3 State Transitions

| From | To | Trigger | Side Effects |
|------|----|---------|-------------|
| - | CREATED | User tạo đơn | Generate orderCode, calculate total |
| CREATED | PENDING_QR | Chọn QR bank | Generate VietQR, start 30min timer |
| CREATED | PENDING_EWALLET | Chọn MoMo/VNPay/ZaloPay | Redirect to gateway |
| CREATED | PENDING_CARD | Chọn Visa/MC | Tokenize + charge |
| PENDING_QR | VERIFYING | User click "Tôi đã thanh toán" | Start verification |
| PENDING_QR | EXPIRED | 30 phút timeout | Notify user |
| VERIFYING | PAID | Bank webhook / Admin confirm | → COMPLETED flow |
| VERIFYING | FAILED | Không nhận được tiền sau 24h | Notify user |
| PENDING_EWALLET | PAID | Gateway IPN callback (success) | → COMPLETED flow |
| PENDING_EWALLET | FAILED | Gateway callback (failed) | Allow retry |
| PENDING_CARD | PAID | Gateway callback (success) | → COMPLETED flow |
| PENDING_CARD | FAILED | Card declined | Show error, allow retry |
| PAID | COMPLETED | Cards created + email sent | Final state |
| Any (not PAID/COMPLETED) | CANCELLED | Admin/User cancel | Release items |
| FAILED | CREATED | User retry | New payment attempt |
| EXPIRED | CREATED | User retry | New payment attempt |

### 4.4 Payment: QR Chuyển khoản (Chi tiết)

**Flow:**
1. User chọn "Chuyển khoản ngân hàng"
2. Backend generate:
   - Nội dung CK: `LC {orderCode}` (ví dụ: "LC LC-20250516-A1B2")
   - QR image via VietQR API (bank, account, amount, content)
3. Trả về: QR image URL, bank info, amount, transfer content
4. Start timer 30 phút (Redis key: `order_timeout:{orderId}`)
5. User quét QR, chuyển khoản
6. User click "Tôi đã thanh toán" → status = VERIFYING
7. Xác nhận:
   - **Tự động:** Bank webhook/API check → match amount + content → PAID
   - **Thủ công:** Admin xác nhận trong panel → PAID
8. Nếu 24h không xác nhận được → FAILED

**Timeout handling:**
- 30 phút: hiển thị warning "Đơn hàng sắp hết hạn"
- Hết 30 phút: status → EXPIRED, hiển thị "Đơn hàng đã hết hạn, vui lòng thử lại"
- User có thể tạo payment mới (order quay về CREATED)

### 4.5 Payment: E-wallet (MoMo/VNPay/ZaloPay)

**Flow chung:**
1. User chọn ví điện tử
2. Backend tạo payment request đến gateway
3. Gateway trả về redirect URL
4. Frontend redirect user đến gateway
5. User thanh toán trên gateway
6. Gateway redirect về Love Cards (return URL) + gửi IPN callback
7. Backend xử lý IPN:
   - Verify signature
   - Check amount match
   - Update order status → PAID
8. Frontend hiển thị trang xác nhận

**Retry logic:**
- Nếu FAILED → user có thể chọn lại phương thức và thử lại
- Mỗi retry tạo payment attempt mới (lưu trong payment_data JSONB)
- Max 5 attempts/order

### 4.6 Post-Payment Flow (PAID → COMPLETED)

```
[Order PAID]
     │
     ├── 1. Tạo Card records cho mỗi OrderItem
     │       - Card(status=draft, expiresAt=now+durationMonths)
     │
     ├── 2. Xóa items khỏi cart
     │
     ├── 3. Gửi email xác nhận đơn hàng (async)
     │       - Mã đơn, chi tiết items, tổng tiền
     │       - Link đến trang tùy chỉnh thiệp
     │
     ├── 4. Publish event OrderPaid
     │
     └── 5. Update order status → COMPLETED
```

### 4.7 Gia hạn Hosting

**Flow:**
1. Scheduler check daily: cards sắp hết hạn (7 ngày, 1 ngày)
2. Gửi email nhắc gia hạn
3. User click "Gia hạn" → hiển thị gói gia hạn (theo tháng)
4. User chọn gói + thanh toán (cùng flow payment)
5. Sau khi paid: `card.expiresAt += durationMonths`

### 4.8 Error Codes

| Code | HTTP | Message |
|------|------|---------|
| ORD_CART_EMPTY | 400 | Giỏ hàng trống |
| ORD_TEMPLATE_UNAVAILABLE | 400 | Mẫu {name} không còn khả dụng |
| ORD_HOSTING_PLAN_INVALID | 400 | Gói hosting không hợp lệ |
| ORD_NOT_FOUND | 404 | Đơn hàng không tồn tại |
| ORD_ALREADY_PAID | 400 | Đơn hàng đã được thanh toán |
| ORD_EXPIRED | 400 | Đơn hàng đã hết hạn |
| ORD_PAYMENT_FAILED | 400 | Thanh toán thất bại: {reason} |
| ORD_PAYMENT_MISMATCH | 400 | Số tiền chuyển khoản không khớp |
| ORD_MAX_RETRY | 400 | Vượt quá số lần thử thanh toán |


---

## 5. Module Card Customize

### 5.1 Use Cases

| UC | Actor | Mô tả |
|----|-------|-------|
| UC-CRD-01 | NTT | Xem danh sách trường động của mẫu |
| UC-CRD-02 | NTT | Điền/cập nhật trường động |
| UC-CRD-03 | NTT | Upload ảnh cho trường image |
| UC-CRD-04 | NTT | Crop ảnh đã upload |
| UC-CRD-05 | NTT | Xóa ảnh đã upload |
| UC-CRD-06 | NTT | Chọn nhạc nền từ thư viện |
| UC-CRD-07 | NTT | Xem preview real-time |
| UC-CRD-08 | NTT | Lưu bản nháp (manual + auto-save) |
| UC-CRD-09 | NTT | Cấu hình settings (RSVP, wishes, bank) |
| UC-CRD-10 | NTT | Thêm/sửa thông tin tài khoản ngân hàng |

### 5.2 Auto-save Logic

```
┌─────────────────────────────────────────────────────────┐
│                    AUTO-SAVE STRATEGY                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Trigger:                                               │
│  ├── Mỗi 30 giây (interval timer)                       │
│  ├── Khi user blur khỏi input field                     │
│  └── Khi user navigate away (beforeunload)              │
│                                                         │
│  Debounce:                                              │
│  ├── Gom tất cả changes trong 2 giây                    │
│  └── Gửi 1 request PUT /cards/{id}/fields               │
│                                                         │
│  Conflict resolution:                                   │
│  ├── Last-write-wins (single user editing)              │
│  └── updatedAt check (optimistic locking)               │
│                                                         │
│  UI feedback:                                           │
│  ├── "Đang lưu..." (saving indicator)                   │
│  ├── "Đã lưu lúc 14:32" (success)                       │
│  └── "Lưu thất bại, thử lại..." (error + retry)         │
│                                                         │
│  Unsaved changes warning:                               │
│  └── beforeunload dialog nếu có changes chưa save       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 5.3 Image Upload Flow

```
1. User chọn file ảnh
2. Frontend validate:
   - Format: JPG, PNG, WebP, GIF, HEIC
   - Size: max 10MB
3. Frontend hiển thị crop tool (aspect ratio theo template field config)
4. User crop → confirm
5. Frontend upload cropped image:
   - POST /upload/image (multipart/form-data)
   - Body: file + cardId + templateFieldId
6. Backend:
   - Validate MIME type (server-side)
   - Generate unique filename: {cardId}/{fieldId}/{uuid}.{ext}
   - Upload to S3
   - Create CardMedia record
   - Return: { mediaId, fileUrl }
7. Frontend cập nhật preview với ảnh mới
```

### 5.4 Music Selection

**Flow:**
1. GET `/music?genre=romantic` → danh sách nhạc
2. User nghe thử (play/pause trên frontend)
3. User chọn 1 bài → PUT `/cards/{id}/music` { musicId }
4. Preview cập nhật nhạc nền
5. Chọn "Không có nhạc" → PUT `/cards/{id}/music` { musicId: null }

### 5.5 Preview Rendering

```
┌─────────────────────────────────────────────────────────┐
│                 REAL-TIME PREVIEW                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Desktop: Split layout                                  │
│  ├── Left panel: Form fields (50%)                      │
│  └── Right panel: Live preview iframe (50%)             │
│                                                         │
│  Mobile: Tab layout                                     │
│  ├── Tab 1: Form fields                                 │
│  └── Tab 2: Preview (full screen)                       │
│                                                         │
│  Preview update mechanism:                              │
│  1. User types in field                                 │
│  2. Debounce 300ms                                      │
│  3. PostMessage to iframe: { type: 'UPDATE_FIELD',      │
│     fieldKey: 'bride_name', value: 'Lan' }              │
│  4. Template HTML listens + updates DOM                 │
│                                                         │
│  Full-screen preview:                                   │
│  └── Mở modal/overlay hiển thị thiệp full viewport      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 5.6 Validation Rules

| Trường | Rules |
|--------|-------|
| field_value (text) | Max length theo template_field.max_length |
| field_value (date) | ISO 8601 format, không quá khứ (tùy config) |
| field_value (time) | HH:mm format |
| image file | JPG/PNG/WebP/GIF/HEIC, max 10MB |
| music selection | musicId phải tồn tại và is_active=true |

### 5.7 Error Codes

| Code | HTTP | Message |
|------|------|---------|
| CRD_NOT_FOUND | 404 | Thiệp không tồn tại |
| CRD_NOT_OWNER | 403 | Bạn không có quyền chỉnh sửa thiệp này |
| CRD_EXPIRED | 403 | Thiệp đã hết hạn, vui lòng gia hạn |
| CRD_FIELD_REQUIRED | 422 | Trường {label} là bắt buộc |
| CRD_FIELD_TOO_LONG | 422 | Trường {label} vượt quá {max} ký tự |
| CRD_IMAGE_TOO_LARGE | 400 | Ảnh vượt quá 10MB |
| CRD_IMAGE_INVALID_FORMAT | 400 | Định dạng ảnh không được hỗ trợ |
| CRD_MUSIC_NOT_FOUND | 404 | Bài nhạc không tồn tại |

---

## 6. Module Publish & Share

### 6.1 Use Cases

| UC | Actor | Mô tả |
|----|-------|-------|
| UC-PUB-01 | NTT | Xuất bản thiệp |
| UC-PUB-02 | NTT | Xem URL thiệp |
| UC-PUB-03 | NTT | Copy URL vào clipboard |
| UC-PUB-04 | NTT | Tải QR code (PNG) |
| UC-PUB-05 | NTT | Chia sẻ qua Zalo |
| UC-PUB-06 | NTT | Chia sẻ qua Messenger |
| UC-PUB-07 | NTT | Chia sẻ qua SMS |
| UC-PUB-08 | KM | Xem thiệp công khai |

### 6.2 Publish Flow

```
1. User click "Xuất bản thiệp"
2. Backend validate:
   - Card status = draft
   - Order đã paid
   - Tất cả required fields đã có giá trị
3. Generate URL components:
   - slug: slugify(eventName) → "dam-cuoi-minh-lan"
   - guestLinkId: nanoid(10) → "a1b2c3d4e5"
4. Generate OG image:
   - Render template HTML → screenshot (headless browser)
   - Upload thumbnail to S3
   - Set og_image_url
5. Update card:
   - status → published
   - publishedAt → now()
   - slug, og_title, og_description, og_image_url
6. Return: { url, qrCodeUrl }
7. Event CardPublished → enable analytics tracking
```

### 6.3 URL Structure

```
https://lovecards.vn/thiep/{slug}/{ownerId}/{guestLinkId}

Ví dụ:
https://lovecards.vn/thiep/dam-cuoi-minh-lan/a1b2c3d4/e5f6g7h8i9
```

- `slug`: Vietnamese no-diacritics, hyphenated (max 200 chars)
- `ownerId`: first 8 chars of user UUID
- `guestLinkId`: nanoid 10 chars (unique per card)

### 6.4 QR Code Generation

- Library: ZXing (Java) hoặc qrcode-generator
- Format: PNG, 512x512px
- Branded: Logo Love Cards ở giữa (30% size)
- Error correction: Level H (30% — cho phép logo che)
- Download: GET `/cards/{id}/qr` → image/png

### 6.5 Open Graph Meta Tags

```html
<meta property="og:type" content="website" />
<meta property="og:url" content="https://lovecards.vn/thiep/..." />
<meta property="og:title" content="Thiệp cưới Minh & Lan" />
<meta property="og:description" content="Bạn được mời đến lễ cưới..." />
<meta property="og:image" content="https://cdn.lovecards.vn/og/card-uuid.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

- OG image size: 1200x630px (Facebook/Zalo optimal)
- Server-side rendered (SSR hoặc pre-rendered) cho crawlers

### 6.6 Share Buttons Logic

| Kênh | Implementation |
|------|---------------|
| Copy URL | `navigator.clipboard.writeText(url)` |
| Zalo | `https://zalo.me/share?url={encodedUrl}` |
| Messenger | `https://www.facebook.com/dialog/send?link={encodedUrl}&app_id={appId}` |
| SMS | `sms:?body={encodedMessage}` (mobile deep link) |

### 6.7 Public Card View (Khách mời)

**Flow:**
1. Khách mời mở URL
2. Server check:
   - Card tồn tại? → 404 nếu không
   - Card published? → 404 nếu draft
   - Card expired? → hiển thị "Thiệp đã hết hạn"
3. Trả về card data + template HTML + field values + music
4. Frontend render:
   - Load template HTML
   - Inject field values
   - Play nhạc (autoplay muted, toggle button)
   - Hiển thị RSVP form (nếu enabled)
   - Hiển thị wishes (nếu enabled)
   - Hiển thị bank info (nếu enabled)
5. Track analytics (async POST)

### 6.8 Error Codes

| Code | HTTP | Message |
|------|------|---------|
| PUB_REQUIRED_FIELDS_MISSING | 422 | Vui lòng điền đầy đủ thông tin bắt buộc |
| PUB_NOT_PAID | 403 | Vui lòng thanh toán trước khi xuất bản |
| PUB_ALREADY_PUBLISHED | 400 | Thiệp đã được xuất bản |
| PUB_CARD_NOT_FOUND | 404 | Thiệp không tồn tại |
| PUB_CARD_EXPIRED | 410 | Thiệp đã hết hạn |


---

## 7. Module RSVP, Wishes & Bank Info

> **Mức chi tiết: High-level** (Phase 2)

### 7.1 RSVP

**Use Cases:**
- Khách mời gửi RSVP (tham dự / không tham dự + số người + ghi chú)
- Khách mời cập nhật RSVP (ghi đè theo guestName)
- Owner xem tổng hợp RSVP (tham dự / không / chưa phản hồi)
- Owner xuất danh sách RSVP ra CSV

**Business Logic:**
- Không cần đăng nhập
- Match RSVP cũ bằng `guestName` (case-insensitive trim) → update thay vì tạo mới
- Chỉ hiển thị nếu `card.enableRsvp = true`
- Tổng số người = SUM(guestCount) WHERE attending=true

**State:** Không có state machine — đơn giản create/update

### 7.2 Wishes (Lời chúc)

**Use Cases:**
- Khách mời gửi lời chúc (tên + nội dung)
- Khách mời xem tất cả lời chúc trên thiệp
- Owner ẩn/hiện lời chúc
- Owner xóa lời chúc
- Owner bật/tắt tính năng lời chúc

**Business Logic:**
- Không cần đăng nhập
- Nội dung max 500 ký tự (validate cả client + server)
- Hiển thị theo thứ tự mới nhất lên trên
- Chỉ hiển thị wishes có `isVisible = true` cho khách mời
- Owner thấy tất cả (kể cả hidden)
- Pagination: load thêm (infinite scroll hoặc "Xem thêm")

### 7.3 Bank Info (Tài khoản ngân hàng)

**Use Cases:**
- Owner thêm tài khoản ngân hàng (bank, số TK, tên chủ TK, label)
- Owner sửa/xóa tài khoản
- Owner bật/tắt hiển thị bank info
- Khách mời xem + copy số tài khoản

**Business Logic:**
- Tối đa 4 tài khoản/card
- Chỉ hiển thị nếu `card.enableBankInfo = true`
- Nút copy: `navigator.clipboard.writeText(accountNumber)`
- Chỉ hiển thị cho mẫu loại "wedding" hoặc theo cấu hình mẫu

---

## 8. Module Analytics

> **Mức chi tiết: High-level** (Phase 2)

### 8.1 Data Collection

**Khi khách mời mở thiệp:**
1. Frontend gửi beacon/POST với:
   - cardId
   - device info (UA parsing)
   - referrer / UTM params
   - timestamp
2. Backend:
   - Hash IP (SHA-256) cho unique count
   - Parse UA → device_type, os
   - Detect source từ referrer/UTM
   - INSERT vào card_analytics

**Exclusion:** Owner views không tính (check userId nếu có token)

### 8.2 Dashboard Metrics

| Metric | Query |
|--------|-------|
| Tổng lượt xem | COUNT(*) WHERE card_id = :id |
| Unique views | COUNT(DISTINCT ip_hash) WHERE card_id = :id |
| Views hôm nay | COUNT(*) WHERE viewed_at >= today |
| Views 7 ngày | GROUP BY DATE(viewed_at) LIMIT 7 |
| Device breakdown | GROUP BY device_type → pie chart |
| Source breakdown | GROUP BY source → bar chart |
| OS breakdown | GROUP BY os |

### 8.3 Caching

- Dashboard data cache: Redis, TTL 1 giờ
- Invalidate on new page view (hoặc batch update mỗi 5 phút)

---

## 9. Module Admin Panel

> **Mức chi tiết: High-level** (Phase 2)

### 9.1 Features Overview

| Feature | Mô tả |
|---------|-------|
| Dashboard | KPIs: tổng users, orders hôm nay, doanh thu, mẫu active |
| Template Management | CRUD mẫu, upload HTML + assets, cấu hình fields, bật/tắt |
| Order Management | Danh sách đơn, filter, xác nhận thanh toán thủ công, hủy đơn |
| User Management | Danh sách users, tìm kiếm, khóa/mở khóa |
| Revenue Report | Biểu đồ doanh thu theo ngày/tuần/tháng, top mẫu bán chạy |

### 9.2 Access Control

- Route guard: chỉ user có `role = admin`
- Session timeout: 8 giờ không hoạt động
- Audit log: mọi action ghi vào bảng `admin_audit_logs`
- Login: chỉ email + password (không OAuth)
- Max 5 login attempts → lock 15 phút

### 9.3 Template Upload Flow

```
1. Admin upload file ZIP chứa: index.html + assets (CSS, JS, images)
2. Backend:
   - Extract ZIP
   - Validate HTML structure (có placeholder markers)
   - Upload tất cả files lên S3: templates/{templateId}/
   - Set preview_url = S3 URL of index.html
3. Admin cấu hình:
   - Tên, slug, event_type, price, color_tags
   - Danh sách template_fields (key, label, type, required, order)
4. Admin preview → confirm → set status = active
```

---

## 10. Cross-cutting Concerns

### 10.1 Internationalization (i18n)

| Aspect | Implementation |
|--------|---------------|
| Storage | localStorage key: `lc_language` |
| Default | `vi` (Tiếng Việt) |
| Supported | `vi`, `en` |
| Library | react-i18next (frontend), Accept-Language header (backend) |
| Scope | Tất cả UI text, error messages, validation messages |
| Exclusion | User-generated content (tên sự kiện, lời chúc) không dịch |
| Backend errors | Trả error code, frontend map sang message theo ngôn ngữ |

### 10.2 Notification Service

| Channel | Use Cases | Provider |
|---------|-----------|----------|
| Email | Xác thực, reset password, xác nhận đơn, nhắc gia hạn, RSVP/wish mới | AWS SES / SendGrid |
| SMS | OTP verification | Twilio / SpeedSMS |
| In-app Toast | Cart added, save success, errors | Frontend (Zustand UI store) |

**Email Template Engine:** Thymeleaf (server-side)

**Async Processing:** Tất cả notification gửi async (Spring @Async hoặc message queue)

### 10.3 Rate Limiting

| Endpoint | Limit | Window | Storage |
|----------|-------|--------|---------|
| POST /auth/login | 5 requests | 1 phút | Redis |
| POST /auth/login/phone | 5 requests | 1 giờ | Redis |
| POST /auth/verify-otp | 3 requests | 15 phút | Redis |
| POST /auth/register | 3 requests | 1 giờ | Redis |
| POST /upload/image | 20 requests | 1 phút | Redis |
| POST /public/cards/*/rsvp | 10 requests | 1 phút | Redis |
| POST /public/cards/*/wishes | 10 requests | 1 phút | Redis |
| POST /newsletter/subscribe | 3 requests | 1 giờ | Redis |
| POST /b2b/contact | 3 requests | 1 giờ | Redis |
| General API | 100 requests | 1 phút | Redis |

**Implementation:** Spring filter + Redis sliding window counter

**Response khi bị limit:** HTTP 429 + header `Retry-After: {seconds}`

### 10.4 Caching Strategy

| Layer | Tool | Use Case |
|-------|------|----------|
| HTTP Cache | CloudFront | Static assets (JS, CSS, images): max-age 1 year |
| API Cache | Redis | Template lists, categories, featured/trending |
| Query Cache | TanStack Query | Frontend: staleTime 5min cho templates |
| Session Cache | Redis | JWT blacklist, OTP codes, rate limit counters |

**Cache Invalidation Pattern:**
- Write-through: update DB + invalidate cache key
- TTL-based: tự expire sau thời gian cấu hình
- Event-driven: Domain Event → invalidate related cache keys

### 10.5 Error Handling Strategy

**Backend:**
```java
// Global exception handler
@RestControllerAdvice
public class GlobalExceptionHandler {
    // BusinessException → 4xx + error code + message
    // ValidationException → 422 + field errors
    // AuthException → 401/403
    // NotFoundException → 404
    // Unexpected → 500 + generic message (log details)
}
```

**Frontend:**
```typescript
// API interceptor
- 401 → auto refresh token → retry
- 401 (after refresh) → redirect /dang-nhap
- 403 → show "Không có quyền"
- 404 → show 404 page
- 422 → show field-level errors
- 429 → show "Vui lòng thử lại sau"
- 500 → show "Đã xảy ra lỗi, vui lòng thử lại"
```

**Error Response Format:**
```json
{
  "error": "AUTH_INVALID_CREDENTIALS",
  "message": "Email hoặc mật khẩu không đúng",
  "timestamp": "2025-05-16T10:30:00Z",
  "path": "/v1/auth/login",
  "details": {
    "field": "password",
    "hint": "Mật khẩu phải có ít nhất 8 ký tự"
  }
}
```

### 10.6 Logging & Monitoring

| Level | Khi nào | Ví dụ |
|-------|---------|-------|
| ERROR | Lỗi không mong đợi, cần xử lý | Payment webhook failed, DB connection lost |
| WARN | Có vấn đề nhưng hệ thống vẫn hoạt động | Rate limit hit, OTP max attempts |
| INFO | Business events quan trọng | User registered, Order paid, Card published |
| DEBUG | Chi tiết kỹ thuật (chỉ dev/staging) | SQL queries, API request/response |

**Structured Logging:** JSON format cho CloudWatch Logs Insights query

### 10.7 File Upload Security

| Check | Mô tả |
|-------|-------|
| MIME type validation | Server-side check magic bytes (không tin Content-Type header) |
| File size limit | 10MB max (configurable) |
| Filename sanitization | Strip special chars, generate UUID filename |
| Storage isolation | Mỗi card có folder riêng: `cards/{cardId}/{fieldId}/` |
| Access control | S3 presigned URLs (TTL 1h) hoặc CloudFront signed URLs |
| Virus scan | Optional: ClamAV scan trước khi lưu (Phase 2) |

---

## Phụ lục A: Tổng hợp Error Codes

| Module | Prefix | Range |
|--------|--------|-------|
| Auth | AUTH_ | 10 codes |
| Template | TPL_ | 3 codes |
| Cart | CART_ | 4 codes |
| Order | ORD_ | 9 codes |
| Card | CRD_ | 7 codes |
| Publish | PUB_ | 5 codes |
| General | GEN_ | RATE_LIMIT, INTERNAL_ERROR, VALIDATION_ERROR |

---

## Phụ lục B: Tổng hợp Scheduled Jobs

| Job | Schedule | Mô tả |
|-----|----------|-------|
| Card Expiry Check | Daily 00:00 | Tìm cards sắp hết hạn → gửi email nhắc |
| Card Status Update | Daily 01:00 | Cards hết hạn → status = expired |
| Order Timeout | Every 5 min | Orders PENDING_QR > 30 min → EXPIRED |
| Trending Recalculate | Hourly | Tính lại trending templates |
| Analytics Aggregation | Daily 02:00 | Aggregate raw views → daily summary |
| Cleanup Expired Tokens | Daily 03:00 | Xóa expired OTP, reset tokens từ Redis |

---

*Tài liệu này được tạo dựa trên LoveCards-DomainModel-v1.0.md và LoveCards-ApplicationDesign-v1.0.md.*
*Phiên bản: 1.0 | Ngày tạo: 2025*