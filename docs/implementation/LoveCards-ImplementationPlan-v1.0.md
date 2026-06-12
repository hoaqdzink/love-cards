# Kế Hoạch Triển Khai Dự Án — Love Cards Platform

**Phiên bản:** 1.0
**Ngày:** 2026-05-22
**Trạng thái:** Chính thức
**Kiến trúc:** Microservices (Spring Boot + Spring Cloud)
**Tài liệu tham chiếu:** LoveCards-BRD-v1.0.md, LoveCards-ApplicationDesign-v1.0.md, LoveCards-FunctionalDesign-v1.0.md

---

## Quyết Định Đã Xác Nhận

| # | Câu hỏi | Quyết định |
|---|---------|-----------|
| 1 | Kiến trúc Backend | **Microservices** ngay từ đầu |
| 2 | Cổng thanh toán | **Tất cả**: QR + VNPay + MoMo + ZaloPay + Visa |
| 3 | Admin Panel | **Cùng repo, cùng SPA** — route `/admin/*` |
| 4 | Mẫu thiệp | **Tạo 2-3 mẫu demo** trong quá trình dev |
| 5 | SMS/OTP | **Bỏ qua** phase đầu — chỉ Email + OAuth |
| 6 | Thanh toán (payment) | **Tách Phase 2.5** — Phase 2 chỉ Cart & Checkout; payment khi cần |
| 7 | Mock user Phase 2–4 | Header **`X-User-Id`** do client gửi; Phase 5 Gateway validate JWT và overwrite |

---

## Tổng Quan Phases

| Phase | Tên | EPICs | Thời lượng ước tính | Kế hoạch chi tiết |
|-------|-----|-------|---------------------|-------------------|
| 0 | Infrastructure & Foundation | - | 1-2 tuần | `phase-0-plan.md` |
| 1 | Catalog & Template (Trang chủ + Danh mục) | EPIC 1, 2 | 2-3 tuần | `implementation-plan-phase1.md` ✅ |
| 2 | Cart & Checkout (không payment) | EPIC 3 | 1-2 tuần | `implementation-plan-phase2.md` |
| 2.5 | Payment & Post-Checkout | EPIC 6 | 2-3 tuần | `implementation-plan-phase2.5-payment.md` |
| 3 | Card Customization | EPIC 5 | 2-3 tuần | _(chưa tạo)_ |
| 4 | Publish & Share | EPIC 7 | 1-2 tuần | _(chưa tạo)_ |
| 5 | Authentication & User | EPIC 4 | 1-2 tuần | _(chưa tạo)_ |
| 6 | RSVP, Wishes, Analytics, Admin, Legal, i18n | EPIC 8-12 | 3-4 tuần | _(chưa tạo)_ |

> **Ghi chú:** Auth được đẩy xuống Phase 5. Phase 2–4 dùng header `X-User-Id` (mock). Phase 5: JWT thật, Gateway overwrite `X-User-Id`, **`POST /cart/merge` trên FE** sau login, ProtectedRoute. Phase 3 cần card `draft` sau PAID → **tiền đề Phase 2.5** (hoặc seed dev).

---


## Phase 0 — Infrastructure & Foundation

### Mục tiêu
Setup toàn bộ hạ tầng microservices, CI/CD, database, và project skeleton cho cả FE lẫn BE.

### Backend

| Task | Chi tiết |
|------|---------|
| Parent POM / Gradle | Multi-module project: `love-cards-backend/pom.xml` |
| Common Library | `common-lib`: shared DTOs, exceptions, ApiResponse, utils |
| API Gateway | Spring Cloud Gateway — routing, CORS, rate limiting |
| Service Discovery | Eureka Server |
| Config Server | Spring Cloud Config (Git-based hoặc native) |
| Auth Service skeleton | Spring Boot app + PostgreSQL schema `auth` |
| Template Service skeleton | Spring Boot app + PostgreSQL schema `catalog` |
| Order Service skeleton | Spring Boot app + PostgreSQL schema `commerce` |
| Card Service skeleton | Spring Boot app + PostgreSQL schema `cards` |
| Notification Service skeleton | Spring Boot app (email async) |
| Docker Compose | PostgreSQL, Redis, RabbitMQ, Eureka, Config Server, Gateway, all services |
| Flyway setup | Migration scripts cho tất cả schemas (Phase 1 tables) |
| CI/CD Pipeline | GitHub Actions: build, test, Docker build cho mỗi service |

### Frontend

| Task | Chi tiết |
|------|---------|
| Install dependencies | TanStack Query, Zustand, react-i18next, react-router-dom (đã có 1 phần) |
| Project structure | Tạo đầy đủ folders: `app/`, `features/`, `shared/`, `layouts/`, `pages/` |
| API client | `shared/services/api.ts` — fetch wrapper + interceptors + error handling |
| Auth store | `app/store/useAuthStore.ts` — token management |
| Cart store | `app/store/useCartStore.ts` — cookie cart |
| UI store | `app/store/useUIStore.ts` — toasts, modals |
| Router setup | `app/router/index.tsx` — tất cả routes (lazy load) |
| Providers | QueryProvider, AuthProvider, I18nProvider |
| Shared components | Button, Input, Modal, Toast, Pagination, SearchBar (skeleton) |
| i18n setup | `locales/vi/`, `locales/en/` — common keys |
| Environment config | `.env.example` với `VITE_API_URL` |

### Database

| Migration | Tables |
|-----------|--------|
| V1 | `auth.users` |
| V2 | `catalog.templates`, `catalog.template_fields`, `catalog.music_library` |
| V3 | `commerce.hosting_plans`, `commerce.orders`, `commerce.order_items`, `commerce.cart_items`, `commerce.order_status_history` |
| V4 | `cards.cards`, `cards.card_fields`, `cards.card_media`, `cards.bank_accounts` |

### Tiêu chí hoàn thành Phase 0
- [ ] Tất cả services khởi động thành công qua Docker Compose
- [ ] Eureka dashboard hiển thị tất cả services registered
- [ ] API Gateway route request đến đúng service
- [ ] Flyway migrations chạy thành công, tables được tạo
- [ ] Frontend `npm run dev` chạy, routing hoạt động
- [ ] CI pipeline build + test pass cho cả FE và BE

### Kiểm thử Phase 0
- Smoke test: mỗi service có `/actuator/health` trả 200
- Gateway routing test: `GET /api/v1/templates` → route đến Template Service
- Frontend: navigate giữa các routes không lỗi

---

## Phase 1 — Catalog & Template (EPIC 1, 2)

### Mục tiêu
Trang chủ hiển thị đầy đủ sections. Trang danh mục có filter, sort, search, pagination. Preview mẫu thiệp hoạt động. Tất cả endpoints public (không cần auth).

### Backend (Template Service)

| API | Method | Endpoint | Mô tả |
|-----|--------|----------|-------|
| List templates | GET | `/templates` | Filter, sort, search, paginate |
| Featured | GET | `/templates/featured` | Mẫu nổi bật |
| Trending | GET | `/templates/trending` | Mẫu trending |
| Detail | GET | `/templates/{slug}` | Chi tiết + fields |
| Categories | GET | `/templates/categories` | Danh mục + count |
| Music list | GET | `/music` | Thư viện nhạc (filter genre) |

**Kỹ thuật:**
- Redis cache: featured (15min), trending (15min), template list (5min)
- JSONB query cho color_tags filter
- Full-text search trên name + description
- View count increment (async, debounce 1/user/template/hour)

### Frontend

| Page/Component | Mô tả |
|----------------|-------|
| HomePage (cải tiến) | Hero, Category, Template Gallery, Trending, HowItWorks, Testimonials, CTA |
| CatalogPage | Grid templates + FilterPanel + SearchBar + Sort + Pagination |
| TemplatePreviewPage | Preview iframe + thông tin mẫu + nút "Thêm giỏ hàng" |
| FilterPanel | Event type chips + Color swatches + Sort dropdown |
| TemplateCard | Thumbnail, name, price, badge, hover actions |

**Kỹ thuật:**
- TanStack Query: `useTemplates`, `useFeaturedTemplates`, `useTrendingTemplates`
- URL state cho filters: `/danh-muc?event_type=wedding&sort=popular&page=0`
- Debounce search 300ms
- Lazy load images

### Database
- Seed data: 2-3 mẫu thiệp demo (HTML + assets upload lên S3 hoặc local)
- Seed: hosting_plans (2 gói: 6 tháng, 12 tháng)
- Seed: music_library (3-5 bài nhạc royalty-free)

### Tiêu chí hoàn thành Phase 1
- [ ] Trang chủ hiển thị đầy đủ sections với data từ API
- [ ] Danh mục: filter theo event_type, colors hoạt động
- [ ] Danh mục: sort (popular, newest, price) hoạt động
- [ ] Danh mục: search bằng keyword hoạt động
- [ ] Danh mục: pagination hoạt động
- [ ] Preview mẫu: hiển thị HTML template trong iframe
- [ ] Responsive: mobile/tablet/desktop
- [ ] Cache Redis hoạt động (featured, trending)
- [ ] Có ít nhất 2 mẫu thiệp demo hoạt động

### Kiểm thử Phase 1
- Unit test: TemplateService (filter logic, cache)
- Integration test: TemplateController (pagination, filter combinations)
- Frontend: component test TemplateCard, FilterPanel
- Performance: trang danh mục load < 3s với 20+ mẫu
- Responsive: test trên 320px, 768px, 1280px

---

## Phase 2 — Cart & Checkout (EPIC 3)

> **Kế hoạch chi tiết:** `implementation-plan-phase2.md`  
> **Quyết định 2026-06-03:** Chưa cần thanh toán — payment chuyển **Phase 2.5**.

### Mục tiêu
User thêm mẫu vào giỏ (cookie), xem giỏ, checkout, chọn gói hosting per item, tạo đơn trạng thái `CREATED`, xem chi tiết đơn. Endpoint cart/order dùng header `X-User-Id` (mock). **Không** triển khai payment UI/API.

### Backend (Order Service) — Phase 2

| API | Method | Endpoint | Mô tả |
|-----|--------|----------|-------|
| Get cart | GET | `/cart` | Giỏ DB (cần `X-User-Id`) |
| Add to cart | POST | `/cart/items` | Thêm template |
| Remove from cart | DELETE | `/cart/items/{templateId}` | Xóa khỏi giỏ |
| Merge cart | POST | `/cart/merge` | Backend sẵn sàng; **FE gọi ở Phase 5** |
| Hosting plans | GET | `/hosting-plans` | Danh sách gói (public) |
| Create order | POST | `/orders` | Tạo đơn → `CREATED` |
| Get orders | GET | `/orders` | Danh sách đơn user |
| Get order detail | GET | `/orders/{orderCode}` | Chi tiết đơn |

**Kỹ thuật Phase 2:**
- Cookie cart (FE) + API cart (dev/`X-User-Id`)
- Thiếu `X-User-Id` trên cart/order → `401` + `AUTH_USER_REQUIRED`
- Order state machine tối thiểu: `CREATED`, `CANCELLED`
- Feign validate template + snapshot giá
- Seed `auth.users` mock trên **auth-service** Flyway V2
- **Không** xóa cookie cart sau tạo đơn — chỉ sau PAID (Phase 2.5)

### Frontend — Phase 2

| Page/Component | Mô tả |
|----------------|-------|
| CartPage (`/cart`) | Items từ cookie, tổng tiền, checkout |
| CheckoutPage (`/checkout`) | Hosting per item, tạo đơn |
| Order page (`/orders/:orderCode`) | Đơn `CREATED`, thông báo payment Phase 2.5 |
| Cart icon (Header) | Badge từ cookie store |

**Hoãn Phase 2:** QRPaymentPage, PaymentReturnPage, chọn payment method thật.

### Tiêu chí hoàn thành Phase 2
- [ ] Thêm/xóa mẫu giỏ hàng qua cookie (UX chính)
- [ ] API cart DB với `X-User-Id`
- [ ] `POST /cart/merge` backend có; FE merge **Phase 5**
- [ ] Tạo đơn `CREATED` với hosting per item
- [ ] Trang cart / checkout / order detail hoạt động

### Kiểm thử Phase 2
- Unit test: order code, total calculation, cart rules
- Integration test: create order `CREATED`
- Frontend: CartPage, CheckoutPage

---

## Phase 2.5 — Payment & Post-Checkout (EPIC 6)

> **Kế hoạch chi tiết:** `implementation-plan-phase2.5-payment.md`  
> **Tiền đề:** Phase 2 hoàn thành.

### Mục tiêu
Thanh toán đầy đủ (QR + VNPay + MoMo + ZaloPay + Visa theo quyết định dự án), webhook, order state machine đầy đủ, sau PAID tạo card `draft` + email xác nhận.

### Backend (Order Service) — bổ sung Phase 2.5

| API | Method | Endpoint | Mô tả |
|-----|--------|----------|-------|
| Pay QR | POST | `/orders/{code}/pay/qr` | QR chuyển khoản |
| Pay MoMo | POST | `/orders/{code}/pay/momo` | MoMo |
| Pay VNPay | POST | `/orders/{code}/pay/vnpay` | VNPay |
| Pay ZaloPay | POST | `/orders/{code}/pay/zalopay` | ZaloPay |
| Pay Card | POST | `/orders/{code}/pay/card` | Thẻ quốc tế |
| Confirm transfer | POST | `/orders/{code}/confirm-transfer` | User xác nhận CK |
| Webhook VNPay/MoMo/ZaloPay | POST | `/webhooks/*` | IPN |

**Kỹ thuật:**
- Order state machine đầy đủ (10 states)
- VietQR / QR local (theo plan Phase 2.5)
- Redis order timeout 30 phút (QR)
- RabbitMQ `OrderPaid` → Card + Notification
- Scheduled job expire orders

### Frontend — Phase 2.5

| Page/Component | Mô tả |
|----------------|-------|
| CheckoutPage | Bật chọn payment method |
| QRPaymentPage | QR + countdown + confirm |
| PaymentReturnPage | Redirect từ gateway |
| OrderConfirmPage | Sau PAID + link customize |

### Tiêu chí hoàn thành Phase 2.5
- [ ] Thanh toán QR + e-wallet + thẻ (theo scope đã chốt)
- [ ] Webhook → order PAID
- [ ] Card record `draft` sau PAID
- [ ] Email xác nhận đơn
- [ ] Order timeout QR 30 phút

### Kiểm thử Phase 2.5
- Integration: full checkout → pay → PAID → COMPLETED
- Contract: webhook signature
- Manual: sandbox VNPay/MoMo

---

## Phase 3 — Card Customization (EPIC 5)

> **Tiền đề:** Phase **2.5** (card `draft` sau PAID) hoặc seed dev tạm thời.

### Mục tiêu
User có thể tùy chỉnh thiệp: điền trường động, upload ảnh + crop, chọn nhạc, preview real-time, auto-save. Dùng header `X-User-Id` (mock đến Phase 5).

### Backend (Card Service)

| API | Method | Endpoint | Mô tả |
|-----|--------|----------|-------|
| Get cards | GET | `/cards` | Danh sách thiệp user |
| Get card detail | GET | `/cards/{id}` | Chi tiết thiệp + fields |
| Update fields | PUT | `/cards/{id}/fields` | Cập nhật trường động |
| Upload media | POST | `/cards/{id}/media` | Upload ảnh |
| Delete media | DELETE | `/cards/{id}/media/{mediaId}` | Xóa ảnh |
| Set music | PUT | `/cards/{id}/music` | Chọn nhạc nền |
| Update settings | PUT | `/cards/{id}/settings` | RSVP, wishes, bank toggles |
| Preview | GET | `/cards/{id}/preview` | Preview data |
| Upload image | POST | `/upload/image` | Upload → S3 → return URL |

**Kỹ thuật:**
- AWS S3 integration (presigned URL hoặc direct upload)
- Image validation: MIME type check, max 10MB
- Auto-save: PUT endpoint idempotent
- Optimistic locking (updatedAt check)

### Frontend

| Page/Component | Mô tả |
|----------------|-------|
| CustomizePage | Split layout: form (left) + preview iframe (right) |
| DynamicFieldForm | Render fields theo template_fields config |
| ImageUploader | Upload + crop tool (aspect ratio) |
| MusicSelector | List nhạc + play/pause + select |
| LivePreview | Iframe + postMessage update |
| SaveIndicator | "Đang lưu..." / "Đã lưu lúc 14:32" |
| MyCardsPage | Danh sách thiệp của user (draft/published/expired) |

**Kỹ thuật:**
- Auto-save: debounce 2s + interval 30s
- PostMessage to iframe for real-time preview
- Image crop library (react-image-crop hoặc tương tự)
- beforeunload warning nếu có unsaved changes
- Mobile: tab layout (Form | Preview)

### Tiêu chí hoàn thành Phase 3
- [ ] Hiển thị form trường động theo template config
- [ ] Điền trường → preview cập nhật real-time
- [ ] Upload ảnh + crop → hiển thị trong preview
- [ ] Chọn nhạc nền → preview phát nhạc
- [ ] Auto-save hoạt động (30s interval + blur)
- [ ] Save indicator hiển thị đúng trạng thái
- [ ] beforeunload warning khi có unsaved changes
- [ ] MyCardsPage hiển thị danh sách thiệp
- [ ] Responsive: mobile tab layout hoạt động

### Kiểm thử Phase 3
- Unit test: CardService (field validation, ownership check)
- Integration test: upload flow (mock S3)
- Frontend: DynamicFieldForm rendering, auto-save logic
- Manual test: upload ảnh thật, crop, preview trên mobile

---

## Phase 4 — Publish & Share (EPIC 7)

### Mục tiêu
User xuất bản thiệp, nhận URL, chia sẻ qua QR/Zalo/Messenger/SMS. Khách mời xem thiệp không cần đăng nhập.

### Backend (Card Service)

| API | Method | Endpoint | Mô tả |
|-----|--------|----------|-------|
| Publish card | POST | `/cards/{id}/publish` | Xuất bản → generate URL |
| Get QR | GET | `/cards/{id}/qr` | QR code image (PNG) |
| Public view | GET | `/public/cards/{slug}/{ownerId}/{guestLinkId}` | Xem thiệp công khai |

**Kỹ thuật:**
- Slug generation: Vietnamese → no diacritics → hyphenated
- nanoid(10) cho guestLinkId
- OG image generation: headless browser screenshot → S3
- QR code: ZXing library, branded logo, 512x512px
- Public endpoint: no auth, check card status (published/expired)

### Frontend

| Page/Component | Mô tả |
|----------------|-------|
| PublishSuccessPage | URL + QR + share buttons |
| ShareButtons | Copy URL, Zalo, Messenger, SMS |
| PublicCardPage | Render thiệp cho khách mời (full screen) |
| ExpiredCardPage | Thông báo thiệp hết hạn |
| NotFoundPage | 404 cho URL không tồn tại |

**Kỹ thuật:**
- OG meta tags (server-side rendered hoặc pre-rendered)
- Share deep links: Zalo, Messenger, SMS
- Music autoplay (muted) + toggle button
- Analytics beacon on page load

### Tiêu chí hoàn thành Phase 4
- [ ] Publish thiệp → nhận URL đúng format
- [ ] QR code download hoạt động
- [ ] Share buttons: Copy URL, Zalo, Messenger, SMS hoạt động
- [ ] Khách mời mở URL → xem thiệp đầy đủ (animation, nhạc, nội dung)
- [ ] OG preview hiển thị đúng khi share lên Zalo/Facebook
- [ ] Thiệp expired → hiển thị thông báo hết hạn
- [ ] URL không tồn tại → 404 page

### Kiểm thử Phase 4
- Unit test: slug generation, publish validation
- Integration test: public card view endpoint
- Frontend: PublicCardPage rendering
- Manual test: share link lên Zalo, kiểm tra OG preview
- Performance: public card page load < 5s trên 4G

---

## Phase 5 — Authentication & User (EPIC 4)

### Mục tiêu
Tích hợp hệ thống xác thực thật. Kết nối JWT vào tất cả protected endpoints đã xây dựng ở Phase 1-4. User có thể đăng ký, đăng nhập (Email + Google + Facebook), quên/đặt lại mật khẩu, đăng xuất.

### Backend (Auth Service)

| API | Method | Endpoint | Mô tả |
|-----|--------|----------|-------|
| Register | POST | `/auth/register` | Email + password |
| Login | POST | `/auth/login` | Email + password → JWT |
| Google OAuth | POST | `/auth/oauth/google` | Exchange code → JWT |
| Facebook OAuth | POST | `/auth/oauth/facebook` | Exchange code → JWT |
| Forgot Password | POST | `/auth/forgot-password` | Gửi email reset link |
| Reset Password | POST | `/auth/reset-password` | Đặt lại mật khẩu |
| Verify Email | POST | `/auth/verify-email` | Xác thực email |
| Refresh Token | POST | `/auth/refresh` | Refresh access token |
| Logout | POST | `/auth/logout` | Invalidate token |
| Get Me | GET | `/auth/me` | Thông tin user hiện tại |

**Kỹ thuật:**
- JWT (access 15min + refresh 7 days HttpOnly cookie)
- BCrypt cost 12
- Redis: verify tokens, reset tokens, JWT blacklist
- Rate limiting: login 5/min, register 3/hour
- Email verification (async via Notification Service + RabbitMQ)
- **Kết nối lại:** Thay mock userId bằng JWT thật cho Cart, Order, Card endpoints
- **Gateway filter:** JwtAuthenticationFilter validate token, inject X-User-Id header

### Frontend (features/auth/)

| Page/Component | Mô tả |
|----------------|-------|
| LoginPage | Form email/password + Google/Facebook buttons |
| RegisterPage | Form fullName/email/password/confirmPassword |
| ForgotPasswordPage | Form nhập email |
| ResetPasswordPage | Form mật khẩu mới |
| VerifyEmailPage | Xử lý verify token từ URL |
| ProtectedRoute | Guard component redirect `/dang-nhap` |
| Header auth state | Avatar/tên user hoặc nút Đăng nhập |

**Kết nối lại Frontend:**
- API client: thêm Authorization header từ useAuthStore
- Auto refresh token khi 401
- **Cart merge:** `POST /cart/merge` sau login thành công (đã hoãn từ Phase 2 — không miss)
- Gateway overwrite `X-User-Id` từ JWT; client không tự gửi `X-User-Id` production
- ProtectedRoute wrap các pages: Checkout, Customize, MyCards

### Database
- Table: `auth.users` (đã tạo Phase 0)
- Redis keys: `verify:{token}`, `reset:{token}`, `jwt_blacklist:{tokenId}`

### Tiêu chí hoàn thành Phase 5
- [ ] Đăng ký email → nhận email xác thực → click link → tài khoản active
- [ ] Đăng nhập email/password → nhận JWT → gọi `/auth/me` thành công
- [ ] Đăng nhập Google OAuth hoạt động end-to-end
- [ ] Đăng nhập Facebook OAuth hoạt động end-to-end
- [ ] Quên mật khẩu → nhận email → đặt lại thành công
- [ ] Token refresh tự động khi access token hết hạn
- [ ] Đăng xuất invalidate token
- [ ] Rate limiting hoạt động (5 login/min)
- [ ] **Tất cả protected endpoints (Cart, Order, Card) dùng JWT thật**
- [ ] **Cart merge hoạt động sau login thật**
- [ ] **ProtectedRoute redirect đúng khi chưa login**
- [ ] Frontend: form validation, error messages, loading states

### Kiểm thử Phase 5
- Unit test: AuthService (register, login, token generation)
- Integration test: AuthController (full flow)
- Integration test: protected endpoints reject khi không có token
- Frontend: component test LoginForm, RegisterForm
- Manual test: OAuth flow trên browser thật
- E2E test: full flow từ login → cart → checkout → customize

---

## Phase 6 — RSVP, Wishes, Analytics, Admin, Legal, i18n (EPIC 8-12)

### Mục tiêu
Hoàn thiện tất cả tính năng còn lại: khách mời tương tác, analytics, admin panel, pháp lý, song ngữ.

### 6A — RSVP & Wishes & Bank Info (EPIC 8)

**Backend (Card Service / Engagement endpoints):**

| API | Method | Endpoint |
|-----|--------|----------|
| Submit RSVP | POST | `/public/cards/{cardId}/rsvp` |
| Get RSVPs | GET | `/cards/{id}/rsvps` |
| Export RSVPs | GET | `/cards/{id}/rsvps/export` |
| Submit wish | POST | `/public/cards/{cardId}/wishes` |
| Get wishes (public) | GET | `/public/cards/{cardId}/wishes` |
| Get wishes (owner) | GET | `/cards/{id}/wishes` |
| Toggle wish | PATCH | `/cards/{id}/wishes/{wishId}` |
| Delete wish | DELETE | `/cards/{id}/wishes/{wishId}` |

**Frontend:**
- RSVP form trên PublicCardPage
- Wishes section trên PublicCardPage (infinite scroll)
- Bank info display + copy button
- Owner: RSVP dashboard + Wishes management

**Database:** `engagement.rsvps`, `engagement.wishes`, `cards.bank_accounts`

---

### 6B — Analytics (EPIC 9)

**Backend (Analytics Service hoặc Card Service):**

| API | Method | Endpoint |
|-----|--------|----------|
| Track view | POST | `/analytics/track` |
| Overview | GET | `/cards/{id}/analytics/overview` |
| Views by day | GET | `/cards/{id}/analytics/views` |
| Devices | GET | `/cards/{id}/analytics/devices` |
| Sources | GET | `/cards/{id}/analytics/sources` |

**Frontend:**
- CardAnalyticsPage: KPIs + line chart + pie charts
- Track beacon on PublicCardPage load

**Database:** `analytics.card_analytics_raw`, `analytics.card_analytics_daily`
**Scheduled job:** Daily aggregation raw → daily

---

### 6C — Admin Panel (EPIC 12)

**Backend (Admin endpoints trên các services):**

| API | Method | Endpoint |
|-----|--------|----------|
| Dashboard | GET | `/admin/dashboard` |
| Templates CRUD | GET/POST/PUT/DELETE | `/admin/templates` |
| Orders list | GET | `/admin/orders` |
| Confirm payment | PATCH | `/admin/orders/{id}/status` |
| Users list | GET | `/admin/users` |
| Block/unblock user | PATCH | `/admin/users/{id}/status` |
| Revenue report | GET | `/admin/revenue` |

**Frontend:**
- AdminLayout (sidebar navigation)
- AdminDashboardPage (KPIs + charts)
- AdminTemplatesPage (CRUD + upload ZIP)
- AdminOrdersPage (list + filter + manual confirm)
- AdminUsersPage (list + block/unblock)
- AdminRoute guard (role check)

**Database:** `admin.audit_logs`

---

### 6D — Legal & Marketing (EPIC 10)

**Backend:**

| API | Method | Endpoint |
|-----|--------|----------|
| Newsletter subscribe | POST | `/newsletter/subscribe` |
| Newsletter confirm | POST | `/newsletter/confirm/{token}` |
| B2B contact | POST | `/b2b/contact` |

**Frontend:**
- Newsletter form (footer)
- B2B contact form
- Cookie consent banner
- TermsPage, PrivacyPage (static content)

**Database:** `marketing.newsletter_subscribers`, `marketing.b2b_contacts`

---

### 6E — i18n & Responsive (EPIC 11)

**Frontend:**
- Hoàn thiện tất cả translation keys (vi + en)
- Language toggle trên Header
- Test responsive trên tất cả pages (320px → 2560px)
- Fix mọi layout issues

---

### Tiêu chí hoàn thành Phase 6
- [ ] RSVP: khách gửi/cập nhật, owner xem tổng hợp + export CSV
- [ ] Wishes: khách gửi, hiển thị trên thiệp, owner ẩn/hiện/xóa
- [ ] Bank info: owner thêm TK, khách xem + copy
- [ ] Analytics: track views, dashboard hiển thị charts
- [ ] Admin: login, dashboard, CRUD templates, manage orders/users
- [ ] Admin: upload mẫu thiệp mới (ZIP), cấu hình fields
- [ ] Admin: xác nhận thanh toán thủ công
- [ ] Newsletter + B2B form hoạt động
- [ ] Cookie consent banner hoạt động
- [ ] Trang Điều khoản + Bảo mật có nội dung
- [ ] Song ngữ VI/EN chuyển đổi hoạt động toàn bộ app
- [ ] Responsive: không có layout vỡ trên mọi breakpoint

### Kiểm thử Phase 6
- Unit test: RSVP upsert logic, analytics aggregation
- Integration test: admin endpoints (auth + role check)
- Frontend: admin CRUD flows, i18n switching
- Manual test: full user journey end-to-end
- Performance: analytics dashboard load < 2s
- Cross-browser: Chrome, Safari, Firefox

---

## Tổng Hợp Microservices Architecture

```text
love-cards-backend/
├── pom.xml (parent)
├── common-lib/              # Shared: ApiResponse, DTOs, exceptions, utils
├── api-gateway/             # Spring Cloud Gateway (port 8080)
├── service-discovery/       # Eureka Server (port 8761)
├── config-server/           # Spring Cloud Config (port 8888)
├── auth-service/            # Auth + User (port 8081)
├── template-service/        # Catalog + Music (port 8082)
├── order-service/           # Cart + Order + Payment (port 8083)
├── card-service/            # Card + Media + Publish + RSVP + Wishes (port 8084)
├── notification-service/    # Email async (port 8085)
├── analytics-service/       # Analytics tracking + aggregation (port 8086)
└── docker-compose.yml
```

### Service Communication

| From | To | Method | Use Case |
|------|----|--------|----------|
| Order Service | Card Service | RabbitMQ event `OrderPaid` | Tạo card records |
| Card Service | Notification Service | RabbitMQ event `CardPublished` | Gửi email |
| Auth Service | Notification Service | RabbitMQ event `UserRegistered` | Gửi email verify |
| Order Service | Notification Service | RabbitMQ event `OrderPaid` | Gửi email xác nhận |
| Card Service | Template Service | Feign Client (sync) | Lấy template fields |
| Order Service | Template Service | Feign Client (sync) | Validate template + price |
| API Gateway | All services | HTTP routing | Request forwarding |

---

## Scheduled Jobs

| Job | Service | Schedule | Mô tả |
|-----|---------|----------|-------|
| Order Timeout | Order Service | Every 5 min | PENDING_QR > 30min → EXPIRED |
| Card Expiry Check | Card Service | Daily 00:00 | Cards sắp hết hạn → notify |
| Card Status Update | Card Service | Daily 01:00 | Expired cards → status=expired |
| Analytics Aggregation | Analytics Service | Daily 02:00 | Raw → daily summary |
| Trending Recalculate | Template Service | Hourly | Tính lại trending |
| Cleanup Tokens | Auth Service | Daily 03:00 | Xóa expired tokens từ Redis |

---

## Definition of Done (áp dụng mỗi Phase)

Mỗi Phase được coi là **Done** khi:

1. ✅ Tất cả tiêu chí hoàn thành đã checked
2. ✅ Unit tests pass (coverage >= 80% service layer)
3. ✅ Integration tests pass
4. ✅ Frontend: TypeScript no errors, ESLint pass
5. ✅ Responsive: test trên 320px, 768px, 1280px
6. ✅ API documentation (Swagger) cập nhật
7. ✅ Docker build thành công cho tất cả services
8. ✅ Manual smoke test pass

---

*Kế hoạch này được tạo dựa trên toàn bộ tài liệu trong /docs và các quyết định đã xác nhận.*
*Phiên bản: 1.0 | Ngày: 2026-05-22 | Cập nhật: 2026-06-03 — Tách Phase 2 / 2.5 (payment hoãn)*