# Domain Model — Love Cards Platform

**Phiên bản:** 1.0
**Ngày:** 2025
**Trạng thái:** Đang soạn thảo
**Tài liệu tham chiếu:** LoveCards-ApplicationDesign-v1.0.md, LoveCards-UserStories-v1.0.md

---

## Mục Lục

1. [Bounded Contexts & Module Boundaries](#1-bounded-contexts--module-boundaries)
2. [Entities, Value Objects & Aggregates](#2-entities-value-objects--aggregates)
3. [Association Map (Quan hệ giữa các Aggregate)](#3-association-map)
4. [Domain Events](#4-domain-events)
5. [Business Rules & Invariants](#5-business-rules--invariants)

---

## 1. Bounded Contexts & Module Boundaries

### 1.1 Context Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                        LOVE CARDS PLATFORM                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐    ┌──────────────────┐    ┌────────────────┐  │
│  │   IDENTITY &    │    │    CATALOG &     │    │   COMMERCE     │  │
│  │   ACCESS        │    │    DISCOVERY     │    │                │  │
│  │                 │    │                  │    │                │  │
│  │  • User         │    │  • Template      │    │  • Cart        │  │
│  │  • Auth         │    │  • TemplateField │    │  • Order       │  │
│  │  • Session      │    │  • Category      │    │  • OrderItem   │  │
│  │                 │    │  • MusicLibrary  │    │  • HostingPlan │  │
│  │                 │    │                  │    │  • Payment     │  │
│  └────────┬────────┘    └────────┬─────────┘    └───────┬────────┘  │
│           │                      │                      │           │
│           │         ┌────────────┼──────────────────────┘           │
│           │         │            │                                  │
│           ▼         ▼            ▼                                  │
│  ┌─────────────────────────────────────────┐                        │
│  │           CARD CREATION                 │                        │
│  │                                         │                        │
│  │  • Card (Aggregate Root)                │                        │
│  │  • CardField                            │                        │
│  │  • CardMedia                            │                        │
│  │  • BankAccount                          │                        │
│  └────────────────────┬────────────────────┘                        │
│                       │                                             │
│           ┌───────────┼───────────┐                                 │
│           ▼           ▼           ▼                                 │
│  ┌──────────────┐ ┌────────┐ ┌──────────────┐                       │
│  │  ENGAGEMENT  │ │ SHARE  │ │  ANALYTICS   │                       │
│  │              │ │        │ │              │                       │
│  │  • RSVP      │ │ • URL  │ │  • PageView  │                       │
│  │  • Wish      │ │ • QR   │ │  • Device    │                       │
│  │              │ │ • OG   │ │  • Source    │                       │
│  └──────────────┘ └────────┘ └──────────────┘                       │
│                                                                     │
│  ┌─────────────────┐    ┌──────────────────┐                        │
│  │   MARKETING &   │    │     ADMIN        │                        │
│  │   LEGAL         │    │                  │                        │
│  │                 │    │  • Dashboard     │                        │
│  │  • Newsletter   │    │  • TemplateAdmin │                        │
│  │  • B2BContact   │    │  • OrderAdmin    │                        │
│  │  • CookieConsent│    │  • UserAdmin     │                        │
│  └─────────────────┘    └──────────────────┘                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Bounded Context Definitions

| Context | Trách nhiệm | Modules | EPICs |
|---------|-------------|---------|-------|
| **Identity & Access** | Quản lý danh tính, xác thực, phân quyền | auth, user | EPIC 4 |
| **Catalog & Discovery** | Quản lý mẫu thiệp, tìm kiếm, lọc, nhạc nền | template, music | EPIC 1, 2 |
| **Commerce** | Giỏ hàng, đơn hàng, thanh toán, gói hosting | cart, order, payment | EPIC 3, 6 |
| **Card Creation** | Tùy chỉnh thiệp, upload media, xuất bản | card, media | EPIC 5, 7 |
| **Engagement** | Tương tác khách mời: RSVP, lời chúc | rsvp, wish | EPIC 8 |
| **Share** | Chia sẻ URL, QR code, Open Graph | share | EPIC 7 |
| **Analytics** | Theo dõi lượt xem, thiết bị, nguồn | analytics | EPIC 9 |
| **Marketing & Legal** | Newsletter, B2B, cookie consent, pháp lý | legal, newsletter | EPIC 10 |
| **Admin** | Quản trị nền tảng | admin | EPIC 12 |

### 1.3 Context Relationships

| Upstream | Downstream | Kiểu quan hệ | Mô tả |
|----------|-----------|--------------|-------|
| Identity & Access | Commerce | Customer-Supplier | Order cần User ID |
| Identity & Access | Card Creation | Customer-Supplier | Card thuộc về User |
| Catalog & Discovery | Commerce | Customer-Supplier | Order chứa Template |
| Catalog & Discovery | Card Creation | Customer-Supplier | Card dựa trên Template |
| Commerce | Card Creation | Domain Event | OrderPaid → tạo Card |
| Card Creation | Engagement | Published Language | Card published → RSVP/Wish enabled |
| Card Creation | Analytics | Published Language | Card published → tracking enabled |
| Card Creation | Share | Published Language | Card published → URL/QR generated |


---

## 2. Entities, Value Objects & Aggregates

### 2.1 Ký hiệu

- **[AR]** = Aggregate Root
- **[E]** = Entity (có identity riêng, thuộc về 1 Aggregate)
- **[VO]** = Value Object (immutable, so sánh bằng giá trị)

---

### 2.2 Context: Identity & Access

#### User [AR]

| Thuộc tính | Kiểu | Mô tả |
|-----------|------|-------|
| id | UUID | Định danh duy nhất |
| email | Email [VO] | Địa chỉ email (nullable nếu đăng ký bằng SĐT) |
| phone | PhoneNumber [VO] | Số điện thoại VN (nullable nếu đăng ký bằng email) |
| passwordHash | String | Bcrypt hash (null nếu OAuth) |
| fullName | String | Họ tên đầy đủ |
| avatarUrl | URL | Ảnh đại diện |
| authProvider | AuthProvider [VO] | local / google / facebook |
| providerId | String | ID từ OAuth provider |
| role | UserRole [VO] | user / admin |
| status | UserStatus [VO] | active / blocked / pending |
| emailVerified | Boolean | Email đã xác thực chưa |
| phoneVerified | Boolean | SĐT đã xác thực chưa |
| language | Language [VO] | vi / en |
| metadata | JSON | Cấu hình mở rộng |
| createdAt | Timestamp | Ngày tạo |
| updatedAt | Timestamp | Ngày cập nhật |

**Value Objects:**

| Value Object | Thuộc tính | Validation |
|-------------|-----------|-----------|
| Email | value: String | RFC 5321, max 320 chars, lowercase |
| PhoneNumber | value: String | 10 số, bắt đầu bằng 0, format VN |
| AuthProvider | value: Enum | local, google, facebook |
| UserRole | value: Enum | user, admin |
| UserStatus | value: Enum | active, blocked, pending |
| Language | value: Enum | vi, en |

---

### 2.3 Context: Catalog & Discovery

#### Template [AR]

| Thuộc tính | Kiểu | Mô tả |
|-----------|------|-------|
| id | UUID | Định danh duy nhất |
| name | String | Tên mẫu thiệp |
| slug | Slug [VO] | URL-friendly identifier |
| description | String | Mô tả chi tiết |
| eventType | EventType [VO] | Loại sự kiện |
| colorTags | ColorTag[] [VO] | Danh sách màu sắc |
| price | Money [VO] | Giá (VND) |
| status | TemplateStatus [VO] | active / inactive |
| previewUrl | URL | Link preview HTML |
| thumbnailUrl | URL | Ảnh thumbnail |
| assetsPath | String | Đường dẫn S3 |
| hasMusic | Boolean | Có nhạc nền không |
| isFeatured | Boolean | Mẫu nổi bật |
| isTrending | Boolean | Mẫu trending |
| viewCount | Long | Lượt xem |
| purchaseCount | Long | Lượt mua |
| fields | TemplateField[] [E] | Danh sách trường động |
| metadata | JSON | Cấu hình mở rộng |

#### TemplateField [E] (thuộc Template Aggregate)

| Thuộc tính | Kiểu | Mô tả |
|-----------|------|-------|
| id | UUID | Định danh |
| fieldKey | String | Key kỹ thuật (bride_name, event_date...) |
| fieldLabel | String | Label hiển thị |
| fieldType | FieldType [VO] | text / date / time / textarea / image |
| placeholder | String | Gợi ý nhập |
| isRequired | Boolean | Bắt buộc hay không |
| maxLength | Integer | Giới hạn ký tự |
| displayOrder | Integer | Thứ tự hiển thị |
| validation | JSON | Quy tắc validation mở rộng |

#### Music [AR]

| Thuộc tính | Kiểu | Mô tả |
|-----------|------|-------|
| id | UUID | Định danh |
| title | String | Tên bài nhạc |
| genre | MusicGenre [VO] | Thể loại |
| durationSec | Integer | Thời lượng (giây) |
| fileUrl | URL | Link file nhạc trên S3 |
| isActive | Boolean | Đang hoạt động |
| metadata | JSON | Artist, BPM, mood tags |

**Value Objects:**

| Value Object | Thuộc tính | Validation |
|-------------|-----------|-----------|
| Slug | value: String | Lowercase, no diacritics, hyphens, max 200 |
| EventType | value: Enum | wedding, birthday, party, other |
| ColorTag | value: String | pink, white, gold, blue, purple, green, red |
| Money | amount: Long, currency: String | amount >= 0, currency = VND |
| TemplateStatus | value: Enum | active, inactive |
| FieldType | value: Enum | text, date, time, textarea, image |
| MusicGenre | value: Enum | romantic, cheerful, classical, acoustic |

---

### 2.4 Context: Commerce

#### Cart [AR]

| Thuộc tính | Kiểu | Mô tả |
|-----------|------|-------|
| userId | UUID | Chủ giỏ hàng |
| items | CartItem[] [E] | Danh sách mẫu trong giỏ |

#### CartItem [E] (thuộc Cart Aggregate)

| Thuộc tính | Kiểu | Mô tả |
|-----------|------|-------|
| id | UUID | Định danh |
| templateId | UUID | Ref đến Template |
| addedAt | Timestamp | Thời điểm thêm |

#### Order [AR]

| Thuộc tính | Kiểu | Mô tả |
|-----------|------|-------|
| id | UUID | Định danh |
| orderCode | OrderCode [VO] | Mã đơn hàng (LC-YYYYMMDD-XXXX) |
| userId | UUID | Ref đến User |
| items | OrderItem[] [E] | Danh sách item |
| totalAmount | Money [VO] | Tổng tiền |
| payment | Payment [VO] | Thông tin thanh toán |
| status | OrderStatus [VO] | Trạng thái đơn |
| paidAt | Timestamp | Thời điểm thanh toán |
| createdAt | Timestamp | Ngày tạo |
| updatedAt | Timestamp | Ngày cập nhật |

#### OrderItem [E] (thuộc Order Aggregate)

| Thuộc tính | Kiểu | Mô tả |
|-----------|------|-------|
| id | UUID | Định danh |
| templateId | UUID | Ref đến Template |
| hostingPlanId | UUID | Ref đến HostingPlan |
| templatePrice | Money [VO] | Giá mẫu tại thời điểm mua |
| hostingPrice | Money [VO] | Giá hosting tại thời điểm mua |

#### HostingPlan [AR]

| Thuộc tính | Kiểu | Mô tả |
|-----------|------|-------|
| id | UUID | Định danh |
| name | String | Tên gói |
| durationMonths | Integer | Thời hạn (tháng) |
| price | Money [VO] | Giá gói |
| description | String | Mô tả |
| features | String[] | Tính năng đi kèm |
| isRecommended | Boolean | Gói đề xuất |
| isActive | Boolean | Đang hoạt động |

**Value Objects:**

| Value Object | Thuộc tính | Validation |
|-------------|-----------|-----------|
| OrderCode | value: String | Format: LC-YYYYMMDD-XXXX (4 random chars) |
| OrderStatus | value: Enum | pending, paid, failed, cancelled |
| Payment | method: PaymentMethod, status: PaymentStatus, ref: String, data: JSON | |
| PaymentMethod | value: Enum | qr_bank, momo, zalopay, vnpay, visa |
| PaymentStatus | value: Enum | pending, processing, success, failed |

---

### 2.5 Context: Card Creation

#### Card [AR] — Aggregate chính của hệ thống

| Thuộc tính | Kiểu | Mô tả |
|-----------|------|-------|
| id | UUID | Định danh |
| userId | UUID | Ref đến User (owner) |
| templateId | UUID | Ref đến Template gốc |
| orderItemId | UUID | Ref đến OrderItem |
| eventName | String | Tên sự kiện |
| slug | Slug [VO] | URL slug |
| status | CardStatus [VO] | draft / published / expired |
| publishedAt | Timestamp | Thời điểm xuất bản |
| expiresAt | Timestamp | Ngày hết hạn hosting |
| musicId | UUID | Ref đến Music |
| enableRsvp | Boolean | Bật RSVP |
| enableWishes | Boolean | Bật lời chúc |
| enableBankInfo | Boolean | Bật thông tin ngân hàng |
| ogMeta | OGMeta [VO] | Open Graph metadata |
| settings | JSON | Cấu hình mở rộng |
| viewCount | Long | Lượt xem |
| fields | CardField[] [E] | Dữ liệu đã điền |
| media | CardMedia[] [E] | Ảnh đã upload |
| bankAccounts | BankAccount[] [E] | Tài khoản ngân hàng |

#### CardField [E] (thuộc Card Aggregate)

| Thuộc tính | Kiểu | Mô tả |
|-----------|------|-------|
| id | UUID | Định danh |
| templateFieldId | UUID | Ref đến TemplateField |
| fieldValue | String | Giá trị đã điền |

#### CardMedia [E] (thuộc Card Aggregate)

| Thuộc tính | Kiểu | Mô tả |
|-----------|------|-------|
| id | UUID | Định danh |
| templateFieldId | UUID | Ref đến TemplateField (ảnh thuộc trường nào) |
| fileUrl | URL | Link file trên S3 |
| fileType | MediaType [VO] | image / music |
| fileSize | Long | Kích thước (bytes) |
| originalName | String | Tên file gốc |
| metadata | JSON | Crop info, dimensions |

#### BankAccount [E] (thuộc Card Aggregate)

| Thuộc tính | Kiểu | Mô tả |
|-----------|------|-------|
| id | UUID | Định danh |
| bankName | String | Tên ngân hàng |
| accountNumber | String | Số tài khoản |
| accountHolder | String | Tên chủ tài khoản |
| label | String | Nhãn (cô dâu / chú rể) |
| displayOrder | Integer | Thứ tự hiển thị |

**Value Objects:**

| Value Object | Thuộc tính | Validation |
|-------------|-----------|-----------|
| CardStatus | value: Enum | draft, published, expired |
| OGMeta | title: String, description: String, imageUrl: URL | title max 200, desc max 500 |
| MediaType | value: Enum | image, music |

---

### 2.6 Context: Engagement

#### RSVP [AR]

| Thuộc tính | Kiểu | Mô tả |
|-----------|------|-------|
| id | UUID | Định danh |
| cardId | UUID | Ref đến Card |
| guestName | String | Tên khách mời |
| attending | Boolean | Có tham dự không |
| guestCount | Integer | Số người đi cùng |
| note | String | Ghi chú |
| createdAt | Timestamp | Ngày gửi |
| updatedAt | Timestamp | Ngày cập nhật |

#### Wish [AR]

| Thuộc tính | Kiểu | Mô tả |
|-----------|------|-------|
| id | UUID | Định danh |
| cardId | UUID | Ref đến Card |
| senderName | String | Tên người gửi |
| content | String | Nội dung lời chúc |
| isVisible | Boolean | Hiển thị trên thiệp |
| createdAt | Timestamp | Ngày gửi |

---

### 2.7 Context: Analytics

#### PageView [E] (không có Aggregate Root riêng — thuộc Card context khi query)

| Thuộc tính | Kiểu | Mô tả |
|-----------|------|-------|
| id | UUID | Định danh |
| cardId | UUID | Ref đến Card |
| viewedAt | Timestamp | Thời điểm xem |
| deviceType | DeviceType [VO] | mobile / tablet / desktop |
| os | String | Hệ điều hành |
| source | TrafficSource [VO] | Nguồn truy cập |
| ipHash | String | Hash IP (unique count) |
| userAgent | String | User agent string |
| extra | JSON | UTM params, referrer |

**Value Objects:**

| Value Object | Thuộc tính | Validation |
|-------------|-----------|-----------|
| DeviceType | value: Enum | mobile, tablet, desktop |
| TrafficSource | value: Enum | zalo, facebook, messenger, sms, direct, other |

---

### 2.8 Context: Marketing & Legal

#### NewsletterSubscriber [AR]

| Thuộc tính | Kiểu | Mô tả |
|-----------|------|-------|
| id | UUID | Định danh |
| email | Email [VO] | Địa chỉ email |
| confirmed | Boolean | Đã xác nhận double opt-in |
| confirmToken | String | Token xác nhận |
| unsubscribed | Boolean | Đã hủy đăng ký |

#### B2BContact [AR]

| Thuộc tính | Kiểu | Mô tả |
|-----------|------|-------|
| id | UUID | Định danh |
| companyName | String | Tên công ty |
| contactName | String | Tên liên hệ |
| email | Email [VO] | Email |
| phone | PhoneNumber [VO] | SĐT |
| message | String | Nội dung |
| status | ContactStatus [VO] | new / contacted / closed |


---

## 3. Association Map

### 3.1 Sơ đồ quan hệ giữa các Aggregate

```
User [AR]
 │
 ├──1:N──▶ Order [AR]
 │            │
 │            └──1:N──▶ OrderItem [E]
 │                         │
 │                         ├── ref ──▶ Template [AR]
 │                         └── ref ──▶ HostingPlan [AR]
 │
 ├──1:N──▶ Card [AR]
 │            │
 │            ├──1:N──▶ CardField [E]
 │            │            └── ref ──▶ TemplateField [E]
 │            │
 │            ├──1:N──▶ CardMedia [E]
 │            │
 │            ├──1:N──▶ BankAccount [E]
 │            │
 │            ├── ref ──▶ Template [AR]
 │            ├── ref ──▶ OrderItem [E]
 │            ├── ref ──▶ Music [AR]
 │            │
 │            ├──1:N──▶ RSVP [AR] (cross-context ref)
 │            ├──1:N──▶ Wish [AR] (cross-context ref)
 │            └──1:N──▶ PageView [E] (cross-context ref)
 │
 └──1:1──▶ Cart [AR]
              └──1:N──▶ CartItem [E]
                           └── ref ──▶ Template [AR]

Template [AR]
 └──1:N──▶ TemplateField [E]
```

### 3.2 Quy tắc tham chiếu

| Quy tắc | Mô tả |
|---------|-------|
| Trong cùng Aggregate | Truy cập trực tiếp qua object reference |
| Giữa các Aggregate | Chỉ tham chiếu bằng ID (không hold object reference) |
| Cross-context | Tham chiếu bằng ID + Domain Event để đồng bộ |

---

## 4. Domain Events

### 4.1 Danh sách Domain Events

| Event | Publisher | Subscribers | Trigger |
|-------|-----------|------------|---------|
| `UserRegistered` | Identity & Access | Notification | Gửi email xác thực |
| `UserEmailVerified` | Identity & Access | - | Kích hoạt tài khoản |
| `UserLoggedIn` | Identity & Access | Commerce | Trigger cart merge |
| `UserBlocked` | Admin | Identity & Access | Invalidate sessions |
| `TemplateCreated` | Catalog | - | Admin upload mẫu mới |
| `TemplateActivated` | Catalog | - | Mẫu xuất hiện trong danh mục |
| `CartItemAdded` | Commerce | - | Cập nhật UI |
| `CartMerged` | Commerce | - | Sau đăng nhập, gộp cookie → DB |
| `OrderCreated` | Commerce | Notification | Gửi email xác nhận đơn |
| `OrderPaid` | Commerce | Card Creation, Notification | Tạo Card record, gửi email |
| `OrderFailed` | Commerce | Notification | Thông báo lỗi thanh toán |
| `OrderCancelled` | Commerce | - | Hủy đơn |
| `CardFieldsUpdated` | Card Creation | - | Auto-save |
| `CardMediaUploaded` | Card Creation | - | Ảnh upload thành công |
| `CardPublished` | Card Creation | Share, Analytics, Notification | Generate URL, enable tracking |
| `CardExpired` | Card Creation (Scheduler) | Notification | Gửi email nhắc gia hạn |
| `CardRenewed` | Commerce | Card Creation | Cập nhật expiresAt |
| `RSVPSubmitted` | Engagement | Notification, Analytics | Thông báo owner |
| `WishSubmitted` | Engagement | Notification | Thông báo owner |
| `CardViewed` | Analytics | - | Track page view |
| `NewsletterSubscribed` | Marketing | Notification | Gửi email double opt-in |
| `B2BContactSubmitted` | Marketing | Notification | Gửi email nội bộ |

### 4.2 Event Flow Diagram

```
[UserLoggedIn]
     │
     ▼
[CartMerged] ──▶ Cookie items gộp vào DB
     │
     ▼
[OrderCreated] ──▶ Email xác nhận đơn
     │
     │ (Payment gateway callback)
     ▼
[OrderPaid] ──▶ Tạo Card (status: draft)
     │          ──▶ Email xác nhận thanh toán
     │
     ▼
[CardFieldsUpdated] ──▶ Auto-save (nhiều lần)
     │
     ▼
[CardPublished] ──▶ Generate URL + QR
     │              ──▶ Generate OG image
     │              ──▶ Enable analytics tracking
     │
     ├──▶ [CardViewed] (mỗi lần khách mời mở)
     ├──▶ [RSVPSubmitted] ──▶ Notify owner
     └──▶ [WishSubmitted] ──▶ Notify owner

[CardExpired] (Scheduler, 7 ngày trước)
     │
     ▼
     Notify owner ──▶ [CardRenewed] hoặc Card status → expired
```

---

## 5. Business Rules & Invariants

### 5.1 Identity & Access

| ID | Rule | Mô tả |
|----|------|-------|
| IAR-01 | Email hoặc Phone bắt buộc | User phải có ít nhất 1 trong 2: email hoặc phone |
| IAR-02 | Email unique | Không có 2 user cùng email |
| IAR-03 | Phone unique | Không có 2 user cùng SĐT |
| IAR-04 | Password strength | Tối thiểu 8 ký tự, bao gồm chữ và số |
| IAR-05 | OAuth auto-link | Nếu email OAuth trùng với email đã đăng ký → link vào account đó |
| IAR-06 | OTP rate limit | Tối đa 5 OTP/giờ/SĐT |
| IAR-07 | OTP expiry | OTP hết hạn sau 5 phút |
| IAR-08 | OTP max attempts | 3 lần nhập sai → block 15 phút |
| IAR-09 | Login rate limit | 5 lần sai/phút → block tạm thời |
| IAR-10 | Admin session | Session admin hết hạn sau 8 giờ không hoạt động |

### 5.2 Catalog & Discovery

| ID | Rule | Mô tả |
|----|------|-------|
| CAT-01 | Template active mới hiển thị | Chỉ template có status=active mới xuất hiện trong danh mục công khai |
| CAT-02 | Slug unique | Mỗi template có slug duy nhất |
| CAT-03 | Price > 0 | Giá mẫu phải lớn hơn 0 (VND) |
| CAT-04 | Template không xóa được nếu có order | Template đã có đơn hàng không thể xóa, chỉ inactive |
| CAT-05 | TemplateField order unique | Trong 1 template, displayOrder không trùng |

### 5.3 Commerce

| ID | Rule | Mô tả |
|----|------|-------|
| COM-01 | Cart no duplicate | Không thêm cùng 1 template vào giỏ 2 lần |
| COM-02 | Cart merge on login | Khi đăng nhập, cookie items được add vào DB, skip nếu trùng |
| COM-03 | Cart merge clear cookie | Sau merge, cookie cart phải được xóa |
| COM-04 | Order requires auth | Chỉ user đã đăng nhập mới tạo được order |
| COM-05 | Order requires hosting plan | Mỗi order item phải chọn 1 hosting plan |
| COM-06 | Order total = sum(items) | totalAmount = Σ(templatePrice + hostingPrice) |
| COM-07 | OrderCode unique | Mã đơn hàng duy nhất, format LC-YYYYMMDD-XXXX |
| COM-08 | Payment timeout | QR chuyển khoản: timeout 30 phút → hiển thị hướng dẫn liên hệ |
| COM-09 | Order immutable after paid | Đơn đã thanh toán không thể sửa items |
| COM-10 | Hosting plan active | Chỉ chọn được hosting plan có isActive=true |

### 5.4 Card Creation

| ID | Rule | Mô tả |
|----|------|-------|
| CRD-01 | Card requires paid order | Card chỉ được tạo sau khi order đã paid |
| CRD-02 | Required fields before publish | Tất cả trường bắt buộc (isRequired=true) phải có giá trị trước khi publish |
| CRD-03 | Publish requires payment | Chỉ publish được khi đã thanh toán thành công |
| CRD-04 | Slug auto-generate | Slug tạo tự động từ eventName (Vietnamese → no diacritics → hyphenated) |
| CRD-05 | URL structure | URL: lovecards.vn/thiep/{slug}/{ownerId}/{guestLinkId} |
| CRD-06 | Published card editable | Card đã publish vẫn có thể chỉnh sửa nội dung (URL không đổi) |
| CRD-07 | Image max size | Upload ảnh tối đa 10MB |
| CRD-08 | Image formats | Hỗ trợ: JPG, PNG, WebP, GIF, HEIC |
| CRD-09 | Auto-save interval | Dữ liệu auto-save mỗi 30 giây |
| CRD-10 | Card expires | Card hết hạn khi expiresAt < now() → status chuyển sang expired |
| CRD-11 | Expired card readonly | Card expired không thể chỉnh sửa, chỉ gia hạn |
| CRD-12 | Music optional | Nhạc nền là tùy chọn, mặc định không có |
| CRD-13 | Bank info toggle | Thông tin ngân hàng chỉ hiển thị khi enableBankInfo=true |

### 5.5 Engagement

| ID | Rule | Mô tả |
|----|------|-------|
| ENG-01 | RSVP no auth required | Khách mời gửi RSVP không cần đăng nhập |
| ENG-02 | RSVP updatable | Khách mời có thể gửi lại RSVP (ghi đè cũ, match by guestName) |
| ENG-03 | RSVP only if enabled | RSVP section chỉ hiển thị nếu card.enableRsvp=true |
| ENG-04 | Wish max length | Nội dung lời chúc tối đa 500 ký tự |
| ENG-05 | Wish no auth required | Khách mời gửi lời chúc không cần đăng nhập |
| ENG-06 | Wish visibility | Owner có thể ẩn/hiện từng lời chúc |
| ENG-07 | Wish only if enabled | Lời chúc chỉ hiển thị nếu card.enableWishes=true |

### 5.6 Analytics

| ID | Rule | Mô tả |
|----|------|-------|
| ANA-01 | Track only published | Chỉ track page view cho card đã published |
| ANA-02 | Unique view by IP hash | Unique view = distinct ipHash trong 1 ngày |
| ANA-03 | Owner view excluded | Lượt xem của owner không tính vào analytics |
| ANA-04 | Data retention | Dữ liệu analytics giữ tối thiểu 12 tháng |

### 5.7 Admin

| ID | Rule | Mô tả |
|----|------|-------|
| ADM-01 | Admin only access | Chỉ user có role=admin mới truy cập admin panel |
| ADM-02 | Template delete restriction | Không xóa template đã có order (chỉ inactive) |
| ADM-03 | Manual payment confirm | Admin có thể thủ công xác nhận thanh toán cho đơn QR |
| ADM-04 | User block reason | Khi block user phải có lý do |
| ADM-05 | Audit trail | Mọi hành động admin được ghi log |

---

## Phụ lục: Glossary

| Thuật ngữ | Định nghĩa |
|-----------|-----------|
| Aggregate | Nhóm entities được quản lý như 1 đơn vị, có Aggregate Root |
| Aggregate Root | Entity chính của Aggregate, điểm truy cập duy nhất từ bên ngoài |
| Entity | Object có identity riêng (UUID), có lifecycle |
| Value Object | Object immutable, so sánh bằng giá trị, không có identity riêng |
| Domain Event | Sự kiện xảy ra trong domain, trigger side effects |
| Bounded Context | Ranh giới logic của 1 nhóm chức năng, có ngôn ngữ riêng |
| Invariant | Quy tắc nghiệp vụ luôn phải đúng tại mọi thời điểm |

---

*Tài liệu này được tạo dựa trên LoveCards-ApplicationDesign-v1.0.md và LoveCards-UserStories-v1.0.md.*
*Phiên bản: 1.0 | Ngày tạo: 2025*