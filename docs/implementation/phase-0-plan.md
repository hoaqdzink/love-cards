# Phase 0 — Infrastructure & Foundation — Plan

**Trạng thái:** 🔄 Đang thực hiện
**Bắt đầu:** 2026-05-22

---

## Quyết định

- Build tool: **Maven** (pom.xml)
- Java: **21 LTS**
- Spring Boot: **3.4.x**
- Database dev: **PostgreSQL qua Docker Compose**
- Backend path: `/Users/hoangvinh/Project/love-cards/Backend/`

---

## Tasks

### Backend — Project Setup

- [x] B01. Tạo parent pom.xml (multi-module Maven project)
- [x] B02. Tạo module `common-lib` (ApiResponse, exceptions, base DTOs, utils)
- [x] B03. Tạo module `service-discovery` (Eureka Server)
- [x] B04. Tạo module `config-server` (Spring Cloud Config)
- [x] B05. Tạo module `api-gateway` (Spring Cloud Gateway, routing, CORS)
- [x] B06. Tạo module `auth-service` (skeleton, port 8081)
- [x] B07. Tạo module `template-service` (skeleton, port 8082)
- [x] B08. Tạo module `order-service` (skeleton, port 8083)
- [x] B09. Tạo module `card-service` (skeleton, port 8084)
- [x] B10. Tạo module `notification-service` (skeleton, port 8085)
- [x] B11. Tạo module `analytics-service` (skeleton, port 8086)
- [x] B12. Tạo `docker-compose.yml` (PostgreSQL, Redis, RabbitMQ)
- [x] B13. Flyway migration V1: schema `auth` + table `users`
- [x] B14. Flyway migration V2: schema `catalog` + tables `templates`, `template_fields`, `music_library`
- [x] B15. Flyway migration V3: schema `commerce` + tables `hosting_plans`, `orders`, `order_items`, `cart_items`, `order_status_history`
- [x] B16. Flyway migration V4: schema `cards` + tables `cards`, `card_fields`, `card_media`, `bank_accounts`
- [x] B17. Flyway migration V5: schema `engagement` + tables `rsvps`, `wishes`
- [x] B18. Flyway migration V6: schema `analytics` + tables `card_analytics_raw`, `card_analytics_daily`
- [x] B19. Flyway migration V7: schema `marketing` + tables `newsletter_subscribers`, `b2b_contacts`
- [x] B20. Flyway migration V8: schema `admin` + table `audit_logs`

### Frontend — Project Setup

- [x] F01. Install dependencies: `@tanstack/react-query`, `zustand`, `react-i18next`, `i18next`
- [x] F02. Tạo folder structure: `app/router/`, `app/store/`, `app/providers/`, `shared/services/`, `locales/`
- [x] F03. Tạo `shared/services/api.ts` (fetch wrapper, error handling)
- [x] F04. Tạo `app/store/useAuthStore.ts` (placeholder token management)
- [x] F05. Tạo `app/store/useCartStore.ts` (cookie cart logic)
- [x] F06. Tạo `app/store/useUIStore.ts` (toasts)
- [x] F07. Tạo `app/router/index.tsx` (routes config)
- [x] F08. Tạo `app/providers/QueryProvider.tsx`
- [x] F09. Tạo `app/providers/I18nProvider.tsx` + setup i18n
- [x] F10. Tạo `locales/vi/common.json` + `locales/en/common.json`
- [x] F11. Tạo `.env.example` với `VITE_API_URL`
- [x] F12. Cập nhật `App.tsx` dùng providers + router mới

### Kiểm thử

- [x] T01. Docker Compose up: PostgreSQL, Redis, RabbitMQ khởi động OK
- [x] T02. Tất cả services build thành công (`mvn clean package`)
- [ ] T03. Eureka dashboard hiển thị all services registered
- [ ] T04. API Gateway route `/api/v1/templates` → template-service
- [ ] T05. Flyway migrations chạy thành công (tables được tạo)
- [x] T06. Frontend `npm run dev` chạy không lỗi (TypeScript + ESLint pass)
- [x] T07. Frontend navigate giữa routes hoạt động

---

## Thứ tự thực hiện

1. **Backend project structure** (B01 → B11)
2. **Docker Compose** (B12)
3. **Flyway migrations** (B13 → B20)
4. **Frontend setup** (F01 → F12)
5. **Kiểm thử** (T01 → T07)

---

## Ghi chú

- Mỗi service skeleton chỉ cần: main class + application.yml + health endpoint
- Chưa viết business logic — chỉ đảm bảo services khởi động và đăng ký Eureka
- Frontend chưa kết nối API thật — chỉ setup structure và providers
