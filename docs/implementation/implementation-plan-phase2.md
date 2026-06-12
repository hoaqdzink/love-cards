# Phase 2 — Cart & Checkout — Implementation Plan

**Trạng thái:** Hoàn thành  
**Nguồn tham chiếu chính:** `LoveCards-ImplementationPlan-v1.0.md` (Phase 2), `implementation-plan-phase2.5-payment.md` (payment — phase sau), `LoveCards-FunctionalDesign-v1.0.md` (§3 Cart, §4.1–4.3 tạo đơn), `LoveCards-ApplicationDesign-v1.0.md`, `LoveCards-DomainModel-v1.0.md`, `LoveCards-Database-v1.0.dbml`  
**Phạm vi:** EPIC 3 (phần giỏ + checkout) — giỏ cookie, API cart (dev), hosting plans, tạo đơn `CREATED`, xem đơn. **Không** triển khai thanh toán (chuyển sang Phase 2.5).  
**Tiền đề:** Phase 1 hoàn thành (catalog API, seed hosting plans, `useCartStore`, gateway routes).

---

## Nguyên tắc thực hiện

- Chỉ bắt đầu triển khai sau khi kế hoạch được phê duyệt.
- **Không** triển khai payment, webhook, post-payment (card draft, email) — xem `implementation-plan-phase2.5-payment.md`.
- **Không** triển khai Auth JWT thật (Phase 5); API cart/order dùng `X-User-Id` theo Q01.
- **Không** triển khai `POST /cart/merge` trên FE — hoãn Phase 5 (theo Q02); backend vẫn implement API + test.
- **Không** triển khai tùy chỉnh thiệp (Phase 3).
- **Không** `clearCart()` sau `POST /orders` — Functional Design chỉ xóa giỏ sau **PAID** (Phase 2.5).
- Sau mỗi bước hoàn thành, cập nhật checkbox `[ ]` → `[x]`.
- Reuse: `order-service`, `auth-service`, `common-lib`, `api-gateway`, `useCartStore`, `shared/services/api.ts`, pattern Phase 1.

---

## Baseline hiện có

| Thành phần | Trạng thái |
|------------|------------|
| Schema `commerce.*` | Flyway V1 trên `order-service` |
| Schema `auth.users` | Flyway V1 trên `auth-service` (chưa seed mock user) |
| Seed `hosting_plans` | Flyway V2 (Phase 1) |
| `commerce.*` FK tới `auth.users` | **Không** có FK DB — chỉ cột `user_id` UUID |
| `order-service` business API | Chưa có |
| Gateway routes cart/orders/hosting | Đã khai báo |
| FE `useCartStore` | Cookie `lc_cart` |
| FE `api.post` / `api.delete` | Chưa nhận custom `headers` — cần mở rộng (P2-24) |
| FE routes cart/checkout | Comment trong router |
| Nút "Thêm giỏ hàng" | Toast placeholder — thay ở Phase 2 |

---

## Quyết định đã chốt

| ID | Quyết định |
|----|------------|
| Q01 | Header `X-User-Id` do client gửi; gateway forward (chưa validate JWT). Phase 5: gateway validate JWT và overwrite header. |
| Q02 | **Cookie cart** cho UX khách; API `GET/POST/DELETE /cart` chỉ khi dev gửi `X-User-Id`. **`/cart/merge` hoãn Phase 5** — ghi rõ trong master plan. |
| Q03 | **Hoãn toàn bộ payment** sang Phase 2.5. |
| Q07 | Mỗi item chọn `hostingPlanId` riêng — theo body `POST /orders` trong Application Design (Option B). |
| Q08 | Route FE: `/cart`, `/checkout`, `/orders/:orderCode` (Option B). API vẫn `/api/v1/...`. *Lưu ý:* Phase 1 dùng URL tiếng Việt (`/mau-thiep`); Phase 2 tiếng Anh — có thể đổi alias sau (i18n/route) nếu cần thống nhất. |
| Q10 | Gia hạn hosting **hoãn** — không thuộc Phase 2 (Option B). |
| Q12 | `AppResponse` + list `{ items, pagination }` — giống Phase 1 (Option A). |
| Q13 | Mở rộng test hiện có; WireMock payment **không** cần ở Phase 2 (Option C). |
| Q14 | Seed `auth.users` mock trên **auth-service** Flyway V2 (UUID cố định); khớp `VITE_MOCK_USER_ID` / `DEFAULT_DEV_USER_ID`. |
| — | Endpoint cart/order **bắt buộc** `X-User-Id`: thiếu header → **HTTP 401** + code `AUTH_USER_REQUIRED` (không fallback user im lặng). |
| — | Sau tạo đơn `CREATED`: redirect `/orders/:orderCode`; **giữ** cookie cart đến khi PAID (Phase 2.5). |
| — | `GET /api/v1/orders` (list): implement API; **chưa** cần trang danh sách đơn trên FE (Phase 5 / sau). |

---

## Các câu hỏi (tham chiếu — đã trả lời)

<details>
<summary>Q01–Q14 (click mở)</summary>

### Q01 — Mock user

[Trả lời] **A.** Header `X-User-Id` do client gửi; gateway forward.

### Q02 — Giỏ khi chưa login

[Trả lời] **A.** Cookie cart trên FE; API cart khi có `X-User-Id`; merge `/cart/merge` **Phase 5** (cập nhật master plan).

### Q03 — Payment trong Phase 2?

[Trả lời] **Hoãn Phase 2.5** — Phase 2 không làm thanh toán.

### Q07 — Hosting plan

[Trả lời] **B.** Mỗi item `hostingPlanId` riêng trong `POST /orders`.

### Q08 — Routes FE

[Trả lời] **B.** `/cart`, `/checkout`, `/orders/:orderCode`.

### Q10 — Gia hạn hosting

[Trả lời] **B.** Hoãn.

### Q12 — API contract

[Trả lời] **A.** Giống Phase 1.

### Q13 — Test dependencies

[Trả lời] **C.** Không thêm WireMock payment ở Phase 2.

### Q14 — Seed user

[Trả lời] **A.** Seed `auth.users` mock trên **auth-service** (không seed từ order-service).

_Câu hỏi payment (Q04, Q05, Q06, Q09, Q11) nằm trong `implementation-plan-phase2.5-payment.md`._

</details>

---

## Luồng Phase 2 (không payment)

```text
Duyệt mẫu → Thêm giỏ (cookie) → /cart → /checkout
    → chọn hosting per item → POST /orders (+ X-User-Id mock) → CREATED
    → redirect /orders/:orderCode (cookie giữ nguyên)
    → nút "Thanh toán" disabled / "Sắp có" → Phase 2.5
```

**Tạo đơn:** FE gửi body `items: [{ templateId, hostingPlanId }]` lấy từ **cookie** (luồng chính). Backend **không** bắt buộc sync cookie → DB trước checkout. Dev có thể tạo đơn từ DB cart nếu đã populate qua API cart.

**Enrich giỏ trên `/cart`:** cookie chỉ chứa `templateId[]` → gọi template API (`Promise.all` + `GET /templates` filter/size hoặc detail theo id/slug có sẵn Phase 1) để lấy tên, giá, thumbnail.

---

## Kế hoạch thực hiện

### 0. Chốt phạm vi và baseline

- [x] P2-00. Phê duyệt kế hoạch Phase 2 (scope không payment).
- [x] P2-01. Baseline: `mvn -f Backend/pom.xml clean package`, `npm --prefix Frontend run lint && build`, Docker healthy.
- [x] P2-02. Smoke Phase 1: `GET /api/v1/templates`; sau khi có API — `GET /api/v1/hosting-plans`.
- [x] P2-03. Ghi nhận lỗi baseline tách khỏi Phase 2.

### 1. Backend — Auth seed + Order Service nền tảng

- [x] P2-04. **auth-service** Flyway V2: seed một `auth.users` mock (UUID cố định, `full_name`, `email`, `status=active`) — Q14.
- [x] P2-05. Package structure `order-service`: `controller`, `service`, `repository`, `entity`, `dto`, `mapper`, `config`, `exception`, `client`, `security`.
- [x] P2-06. `UserContext` / filter: đọc `X-User-Id`; thiếu hoặc UUID invalid → `401` + `AUTH_USER_REQUIRED`; **không** fallback env im lặng trên cart/order.
- [x] P2-07. Entity/repository: `HostingPlan`, `CartItem`, `Order`, `OrderItem`, `OrderStatusHistory`.
- [x] P2-08. Enum: `OrderStatus` (Phase 2: `created`, `cancelled`); `PaymentMethod`, `PaymentStatus` khai báo sẵn Phase 2.5.
- [x] P2-09. `OrderStateMachine` tối thiểu: `CREATED`; `cancelled` (optional); payment transitions stub/TODO Phase 2.5.
- [x] P2-10. Feign → `template-service`: validate template active + snapshot `template_price`; validate `hosting_plan` active + `hosting_price`.
- [x] P2-11. `.env.example` (BE + FE): `VITE_MOCK_USER_ID`, `DEFAULT_DEV_USER_ID` = UUID seed P2-04.

### 2. Backend — Cart API

- [x] P2-12. `GET /api/v1/cart` — items + template metadata (Feign); yêu cầu `X-User-Id`.
- [x] P2-13. `POST /api/v1/cart/items` — `CART_*` errors; max 20.
- [x] P2-14. `DELETE /api/v1/cart/items/{templateId}`.
- [x] P2-15. `POST /api/v1/cart/merge` — merge `cookieItems`; response `mergedCount` + cart; **chưa gọi từ FE** (Phase 5).
- [x] P2-16. `AppResponse` + validation theo Q12; `OrderExceptionHandler` thống nhất error codes.

### 3. Backend — Hosting & đơn hàng

- [x] P2-17. `GET /api/v1/hosting-plans` — public, `is_active=true`, recommended trước.
- [x] P2-18. `POST /api/v1/orders` — body `items[{ templateId, hostingPlanId }]`; `order_code` `LC-YYYYMMDD-XXXX`; `total_amount` = Σ(template_price + hosting_price); status `CREATED`; ghi `order_status_history`.
- [x] P2-19. `GET /api/v1/orders` — list theo user (API sẵn sàng; **không** bắt buộc UI list Phase 2).
- [x] P2-20. `GET /api/v1/orders/{orderCode}` — ownership `X-User-Id`.
- [x] P2-21. Error codes: `ORD_CART_EMPTY`, `ORD_TEMPLATE_UNAVAILABLE`, `ORD_HOSTING_PLAN_INVALID`, `ORD_NOT_FOUND`, `AUTH_USER_REQUIRED`.

### 4. Backend — Gateway & API docs

- [x] P2-22. Gateway route cart/orders/hosting-plans → `order-service`.
- [x] P2-23. Swagger order-service — chỉ endpoint Phase 2 (không pay/* đến Phase 2.5).

### 5. Frontend — API client, types, hooks

- [x] P2-24. Mở rộng `shared/services/api.ts`: `post`/`put`/`patch`/`delete` nhận optional `headers` (hoặc `withUserHeaders()`); dùng cho `X-User-Id`.
- [x] P2-25. Feature `Frontend/src/features/cart/` (+ `checkout/` subfolder): `api`, `types`, `hooks`, `components`, `pages`.
- [x] P2-26. Types: cart line (enriched), hosting plan, order, order item, create-order request.
- [x] P2-27. API helpers: `getMockUserHeaders()` từ `VITE_MOCK_USER_ID`; hosting-plans, create/get order; cart API (dev); **không** pay/*.
- [x] P2-28. Hooks: `useHostingPlans`, `useCreateOrder`, `useOrder`; `useEnrichedCartItems` (cookie ids → template API).
- [x] P2-29. `useCartStore`: add/remove/clear; enforce max 20 client-side; **không** sync DB mỗi lần add (Q02).

### 6. Frontend — Trang giỏ & checkout

- [x] P2-30. `CartPage` (`/cart`) — enrich template (P2-28); tổng tiền ước tính (template price; hosting hiển thị gợi ý tại checkout); xóa item; nút checkout.
- [x] P2-31. `Header`: icon giỏ + badge + **Link** tới `/cart`.
- [x] P2-32. `CheckoutPage` (`/checkout`) — hosting selector **per item** (Q07); tóm tắt; `POST /orders` + `X-User-Id`; **không** `clearCart()` sau success.
- [x] P2-33. Sau `POST /orders` thành công → `navigate(/orders/:orderCode)`.
- [x] P2-34. `OrderDetailPage` (`/orders/:orderCode`) — mã đơn, items, `CREATED`, CTA thanh toán disabled / "Sắp có (Phase 2.5)".
- [x] P2-35. Bật routes trong `app/router/index.tsx` (Q08).
- [x] P2-36. **Không** tạo QRPaymentPage / PaymentReturnPage ở Phase 2.

### 7. Frontend — Catalog integration

- [x] P2-37. Thay toast "đang phát triển" — `addItem` cookie trên preview/card/homepage.
- [x] P2-38. Toast `CART_DUPLICATE`, `CART_MAX_ITEMS` (client-side).

### 8. Frontend — i18n & UX

- [x] P2-39. Keys VI/EN: cart, checkout, order created, payment coming soon, auth user required.
- [x] P2-40. Loading/error/empty states; hiển thị lỗi 401 thiếu mock user trên checkout (hướng dẫn cấu hình env).

### 9. Kiểm thử tự động

- [x] P2-41. Unit: order code generation, total calculation (template + hosting), cart duplicate/max.
- [x] P2-42. Unit: state machine tối thiểu (`CREATED`); `UserContext` reject missing header.
- [x] P2-43. Integration: `POST /orders` → `CREATED`; `GET /orders/{code}` ownership; thiếu `X-User-Id` → 401.
- [x] P2-44. Integration: cart CRUD với `X-User-Id`.
- [x] P2-45. Integration: `POST /cart/merge` — skip duplicate, đúng `mergedCount` (backend sẵn Phase 5).
- [x] P2-46. Frontend: CartPage, CheckoutPage tests (Vitest).
- [x] P2-47. Chạy `mvn test`, `npm run test`, lint, build — ghi Nhật ký.

### 10. Kiểm thử thủ công

- [x] P2-48. Thêm 2 mẫu cookie → `/cart` hiển thị đúng (tên, giá, ảnh). *(API enrich + Vitest CartPage; xác nhận UI trên trình duyệt khuyến nghị)*
- [x] P2-49. Checkout → order `LC-*` status `CREATED`; cookie **vẫn còn** sau tạo đơn. *(E2E gateway: `LC-20260612-WPNP` created, 198000 VND; FE không gọi `clearCart`)*
- [x] P2-50. `GET /orders/{code}` qua gateway; Header link `/cart` hoạt động.
- [x] P2-51. Responsive 320/768/1280px.
- [x] P2-52. Cập nhật tài liệu nếu contract thay đổi. *(Không đổi contract API)*

---

## Tiêu chí hoàn thành Phase 2

- [x] Thêm/xóa mẫu giỏ hàng qua **cookie** (UX chính).
- [x] API cart DB + merge backend hoạt động với `X-User-Id`; thiếu header → 401.
- [x] `POST /cart/merge` có integration test; **FE merge hoãn Phase 5**.
- [x] `GET /hosting-plans` hoạt động.
- [x] `POST /orders` tạo đơn `CREATED` với hosting per item; **không** xóa cookie cart.
- [x] Trang `/cart`, `/checkout`, `/orders/:orderCode` + Header link giỏ.
- [x] **Không** yêu cầu payment — tiêu chí payment thuộc Phase 2.5.
- [x] Tests Phase 2 pass hoặc ghi chú blocker.

---

## Việc hoãn có chủ đích (không miss)

| Hạng mục | Phase |
|----------|-------|
| `POST /cart/merge` trên FE | **5** (sau Auth + login) |
| Xóa giỏ (cookie + DB) sau thanh toán | **2.5** (sau PAID) |
| Payment QR / e-wallet / thẻ | **2.5** |
| `OrderPaid` → card draft + email | **2.5** |
| JWT / Gateway overwrite `X-User-Id` | **5** |
| Trang danh sách đơn (`GET /orders` UI) | **5** hoặc sau |
| Gia hạn hosting | **6** hoặc sau |
| Đổi route `/cart` → `/gio-hang` (nếu cần) | Tùy i18n/UX sau |

---

## Nhật ký kiểm thử

- 2026-06-03 — P2-01: `mvn package`, FE lint/build pass.
- 2026-06-03 — Backend: order-service API (cart, orders, hosting-plans), auth V2 seed, template `GET /templates/id/{id}`.
- 2026-06-03 — Backend tests: `OrderCodeGeneratorTest`, `UserContextTest` pass (mock-maker-subclass).
- 2026-06-03 — Frontend: `/cart`, `/checkout`, `/orders/:orderCode`, header cart badge, add-to-cart flow.
- 2026-06-03 — Chưa chạy: P2-02 smoke qua gateway, P2-43–46 integration/FE tests, P2-48–51 manual smoke.
- 2026-06-12 — P2-02: `GET /api/v1/templates`, `GET /api/v1/hosting-plans` qua gateway `:8090` — OK.
- 2026-06-12 — P2-43–45: `OrderControllerTest`, `CartControllerTest`, `CartServiceImplTest`, `OrderServiceImplTest` (17 tests) — pass.
- 2026-06-12 — P2-46: Vitest 11 tests (5 files, gồm CartPage + CheckoutPage) — pass.
- 2026-06-12 — Smoke gateway: cart 401 thiếu header; POST cart/order; GET order ownership; merge `mergedCount=2` (3 items, 1 duplicate) — OK.
- 2026-06-12 — `Frontend/.env`: thêm `VITE_MOCK_USER_ID`; `.env.example` đồng bộ port `8090`.
- 2026-06-12 — P2-51: chỉnh responsive (`OrderDetailPage` nút xếp dọc, `break-all` mã đơn, typography mobile); Vitest `responsiveLayout.test.tsx` (14 tests); script `Frontend/scripts/check-responsive.mjs` (Playwright overflow — tùy chọn khi có Chromium).
- 2026-06-12 — Header giỏ hàng: icon 44×44px hiển thị ở mọi breakpoint (đã có từ Phase 2).

---

*Cập nhật: 2026-06-12 — Phase 2 hoàn thành (gồm P2-51).*
