# 💌 Love Cards — Nền Tảng Thiệp Mời Kỹ Thuật Số

![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4-green?logo=springboot)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-7-red?logo=redis)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3-orange?logo=rabbitmq)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow)

> **🌐 Live Demo:** Coming soon

---

## Giới Thiệu / Overview

**Love Cards** là nền tảng tạo và chia sẻ thiệp mời kỹ thuật số trực tuyến, hướng đến thị trường Việt Nam.

Người dùng có thể duyệt mẫu thiệp, tùy chỉnh nội dung (tên, ngày, ảnh, nhạc), thanh toán và chia sẻ thiệp mời đến khách mời qua Zalo, Messenger, SMS hoặc QR code — tất cả chỉ trong vài phút.

### Vấn đề giải quyết

- Thiệp mời truyền thống (in ấn) tốn kém, mất thời gian và khó chia sẻ rộng rãi
- Các giải pháp thiệp kỹ thuật số hiện tại trên thị trường Việt Nam còn hạn chế về mẫu mã và trải nghiệm
- Người tổ chức sự kiện cần một công cụ đơn giản, đẹp và dễ chia sẻ ngay trên điện thoại

### Mô hình kinh doanh

- **Trả phí theo mẫu** (pay-per-template): mỗi mẫu thiệp có đơn giá riêng (10.000 - 99.999.999 VND)
- **Gói Hosting**: thiệp tồn tại trực tuyến theo thời gian (gia hạn theo tháng)
- **Hỗ trợ song ngữ**: Tiếng Việt (mặc định) + Tiếng Anh
- **Mobile-first**: tối ưu cho thiết bị di động

### Đối tượng người dùng

| Đối tượng | Mô tả |
|-----------|-------|
| Cặp đôi cưới | 22-35 tuổi, cần thiệp đẹp, dễ chia sẻ Zalo/Messenger, có RSVP |
| Người tổ chức sinh nhật | 18-40 tuổi, cần thiệp nhanh, giá hợp lý |
| Người tổ chức tiệc | 25-45 tuổi, cần thiệp chuyên nghiệp, tùy chỉnh được |
| Doanh nghiệp (B2B) | Nhà hàng tiệc cưới, event planner — mua số lượng lớn |

---

## ✨ Tính Năng / Features

### Dành cho Người dùng

| Tính năng | Mô tả |
|-----------|-------|
| 🎨 Danh mục mẫu thiệp | Duyệt, tìm kiếm, lọc theo loại sự kiện (cưới/sinh nhật/tiệc) và màu sắc, sắp xếp theo phổ biến/giá |
| 🛒 Giỏ hàng thông minh | Lưu cookie khi chưa đăng nhập, tự động gộp vào tài khoản khi đăng nhập |
| 💳 Đa phương thức thanh toán | QR chuyển khoản ngân hàng, MoMo, ZaloPay, VNPay, Visa/Mastercard |
| ✏️ Tùy chỉnh thiệp | Điền trường động (tên, ngày, địa điểm), upload ảnh + crop, chọn nhạc nền |
| 👁️ Xem trước real-time | Preview thiệp cập nhật ngay khi chỉnh sửa, hỗ trợ full-screen |
| 💾 Tự động lưu | Auto-save mỗi 30 giây, không mất dữ liệu |
| 🚀 Xuất bản & Chia sẻ | URL riêng cho thiệp, QR code, chia sẻ qua Zalo/Messenger/SMS với Open Graph preview |
| 📊 Phân tích | Lượt xem, thiết bị (mobile/tablet/desktop), nguồn truy cập (Zalo/Facebook/SMS) |
| 💒 RSVP & Lời chúc | Khách mời xác nhận tham dự, gửi lời chúc hiển thị trên thiệp |
| 🏦 Tài khoản ngân hàng | Hiển thị số tài khoản nhận mừng cưới trên thiệp |

### Dành cho Khách mời

| Tính năng | Mô tả |
|-----------|-------|
| 📱 Xem thiệp | Mở link xem thiệp đầy đủ (animation, nhạc) — không cần đăng nhập |
| ✅ RSVP | Xác nhận tham dự / không tham dự + số người đi cùng |
| 💬 Lời chúc | Gửi lời chúc hiển thị trên thiệp cho mọi người xem |
| 🏦 Mừng cưới | Xem thông tin tài khoản ngân hàng + nút copy số tài khoản |

### Dành cho Admin

| Tính năng | Mô tả |
|-----------|-------|
| 📋 Dashboard | Tổng quan KPIs: người dùng, đơn hàng, doanh thu |
| 🎨 Quản lý mẫu | Upload mẫu thiệp mới, cấu hình trường động, đặt giá |
| 📦 Quản lý đơn hàng | Xem danh sách đơn, xác nhận thanh toán thủ công (QR) |
| 👥 Quản lý người dùng | Khóa/mở khóa tài khoản, xem lịch sử hoạt động |

---

## 🏗️ Kiến Trúc Hệ Thống / Architecture

### Tổng quan

Hệ thống được xây dựng theo kiến trúc **Microservices** với Spring Boot + Spring Cloud. Mỗi service có database schema riêng, giao tiếp qua REST (đồng bộ) và RabbitMQ (bất đồng bộ).

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                           │
│  ┌─────────────────────┐    ┌─────────────────────────┐     │
│  │  Love Cards SPA     │    │  Admin Panel (/admin)   │     │
│  │  React 19 + Vite    │    │  Cùng SPA, route riêng  │     │
│  └──────────┬──────────┘    └────────────┬────────────┘     │
└─────────────┼────────────────────────────┼──────────────────┘
              │            HTTPS           │
              ▼                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY (8080)                       │
│                 Spring Cloud Gateway                        │
│       Routing · CORS · Rate Limiting · JWT Filter           │
└──────────┬──────────┬──────────┬──────────┬─────────────────┘
           │          │          │          │
     ┌─────▼───┐ ┌────▼───┐ ┌────▼───┐ ┌────▼────┐
     │  Auth   │ │Template│ │ Order  │ │  Card   │  ...
     │ Service │ │Service │ │Service │ │ Service │
     │  8081   │ │  8082  │ │  8083  │ │  8084   │
     └────┬────┘ └───┬────┘ └───┬────┘ └────┬────┘
          │          │          │           │
     ┌────▼──────────▼──────────▼───────────▼────┐
     │              PostgreSQL 16                │
     │       (Mỗi service 1 schema riêng)        │
     └───────────────────────────────────────────┘
              │              │
     ┌────────▼────┐   ┌─────▼──────┐
     │   Redis 7   │   │ RabbitMQ 3 │
     │Cache/Session│   │Async Events│
     └─────────────┘   └────────────┘
```

### Danh sách Microservices

| Service | Port | Nhiệm vụ |
|---------|------|----------|
| **api-gateway** | 8080 | Cửa ngõ duy nhất — routing, CORS, rate limiting, JWT filter |
| **service-discovery** | 8761 | Eureka Server — "danh bạ" để services tự tìm nhau |
| **config-server** | 8888 | Quản lý cấu hình tập trung cho tất cả services |
| **auth-service** | 8081 | Xác thực: đăng ký, đăng nhập (Email/Google/Facebook), JWT, quên mật khẩu |
| **template-service** | 8082 | Danh mục mẫu thiệp: tìm kiếm, lọc, phân trang, thư viện nhạc nền |
| **order-service** | 8083 | Giỏ hàng, đơn hàng, tích hợp cổng thanh toán (VNPay/MoMo/ZaloPay) |
| **card-service** | 8084 | Tùy chỉnh thiệp, upload ảnh, xuất bản, RSVP, lời chúc |
| **notification-service** | 8085 | Gửi email bất đồng bộ (xác thực, xác nhận đơn, nhắc gia hạn) |
| **analytics-service** | 8086 | Theo dõi lượt xem thiệp, phân tích thiết bị/nguồn truy cập |

### Tại sao chọn Microservices?

- **Độc lập triển khai**: sửa 1 service không ảnh hưởng service khác
- **Scale riêng**: service nào tải cao thì scale riêng (ví dụ: public card view)
- **Bounded context rõ ràng**: mỗi service có domain riêng, không chia sẻ database
- **Fault isolation**: 1 service lỗi không kéo sập toàn bộ hệ thống (Circuit Breaker)
- **Phù hợp cho team mở rộng**: nhiều dev có thể làm song song trên các services khác nhau

---

## 🛠️ Công Nghệ / Tech Stack

### Backend

| Thành phần | Công nghệ | Ghi chú |
|-----------|-----------|---------|
| Framework | Spring Boot 3.4.x | Java 21 LTS, Virtual Threads |
| Cloud | Spring Cloud 2024.0.0 | Gateway, Eureka, Config Server |
| ORM | Spring Data JPA + Hibernate 6 | PostgreSQL dialect |
| Security | Spring Security 6 + JWT + OAuth2 | Google, Facebook login |
| Database | PostgreSQL 16 | Schema per service |
| Cache | Redis 7 | Session, rate limiting, OTP, cache |
| Message Broker | RabbitMQ 3 | Async events giữa services |
| Migration | Flyway | Tự động chạy khi service khởi động |
| API Docs | SpringDoc OpenAPI | Swagger UI tự động |
| Resilience | Resilience4j | Circuit Breaker, Retry, Timeout |
| Build | Maven (multi-module) | Parent POM quản lý version |
| Container | Docker + Docker Compose | Dev environment |

### Frontend

| Thành phần | Công nghệ | Ghi chú |
|-----------|-----------|---------|
| Framework | React 19 | SPA, feature-based architecture |
| Build Tool | Vite 8 | Fast HMR, ESM-native |
| Language | TypeScript 5.9 | Strict mode |
| Styling | TailwindCSS 4 | Utility-first CSS |
| Routing | React Router 7 | Client-side routing |
| Server State | TanStack Query 5 | Cache, refetch, loading states |
| Client State | Zustand 5 | Cart, UI state, auth |
| i18n | react-i18next | Song ngữ VI/EN |
| Icons | Phosphor Icons | Lightweight icon set |

### Hạ tầng (Infrastructure)

| Thành phần | Công nghệ | Ghi chú |
|-----------|-----------|---------|
| Cloud (dự kiến) | AWS | EC2/ECS, RDS, S3, CloudFront |
| CI/CD (dự kiến) | GitHub Actions | Build, test, deploy tự động |
| Monitoring (dự kiến) | CloudWatch + Micrometer | Logs, metrics, alerts |
| File Storage (dự kiến) | AWS S3 + CloudFront | Ảnh, nhạc, template assets |

---

## 📁 Cấu Trúc Dự Án / Project Structure

```
love-cards/
├── Backend/
│   ├── pom.xml                    # Parent POM (multi-module Maven)
│   ├── docker-compose.yml         # PostgreSQL + Redis + RabbitMQ
│   ├── start-all.sh               # Script khởi động tất cả services
│   ├── stop-all.sh                # Script dừng tất cả services
│   ├── common-lib/                # Code dùng chung: ApiResponse, exceptions, utils
│   ├── service-discovery/         # Eureka Server (đăng ký & tìm kiếm service)
│   ├── config-server/             # Quản lý config tập trung
│   ├── api-gateway/               # Cửa ngõ API (routing, CORS, JWT filter)
│   ├── auth-service/              # Xác thực + Quản lý người dùng
│   ├── template-service/          # Danh mục mẫu thiệp + Thư viện nhạc
│   ├── order-service/             # Giỏ hàng + Đơn hàng + Thanh toán
│   ├── card-service/              # Tùy chỉnh thiệp + Xuất bản + RSVP + Lời chúc
│   ├── notification-service/      # Gửi email bất đồng bộ
│   └── analytics-service/         # Theo dõi lượt xem + Thống kê
│
├── Frontend/
│   ├── src/
│   │   ├── app/                   # Router, stores (Zustand), providers
│   │   ├── features/             # Modules theo tính năng (home, catalog, auth...)
│   │   ├── shared/               # Components, hooks, services tái sử dụng
│   │   ├── layouts/              # Layout trang (MainLayout, AdminLayout)
│   │   └── locales/              # File dịch (vi/en)
│   ├── package.json
│   └── vite.config.ts
│
└── docs/
    ├── business-docs/             # BRD, User Stories, Application Design
    ├── technical-docs/            # Domain Model, Database, Functional Design
    └── implementation/            # Kế hoạch triển khai theo phase
```

---

## 🗄️ Database

Mỗi service quản lý schema riêng theo pattern **Database per Service**. Migrations chạy tự động bằng Flyway khi service khởi động.

| Service | Schema | Tables | Mô tả |
|---------|--------|--------|-------|
| auth-service | `auth` | users | Thông tin người dùng, OAuth providers |
| auth-service | `admin` | audit_logs | Lịch sử hành động admin |
| template-service | `catalog` | templates, template_fields, music_library | Mẫu thiệp, trường động, nhạc nền |
| order-service | `commerce` | hosting_plans, orders, order_items, cart_items, order_status_history | Gói hosting, đơn hàng, giỏ hàng |
| card-service | `cards` | cards, card_fields, card_media, bank_accounts | Thiệp đã tùy chỉnh, ảnh, tài khoản NH |
| card-service | `engagement` | rsvps, wishes | Xác nhận tham dự, lời chúc |
| notification-service | `marketing` | newsletter_subscribers, b2b_contacts | Newsletter, liên hệ B2B |
| analytics-service | `analytics` | card_analytics_raw, card_analytics_daily | Dữ liệu lượt xem thô + tổng hợp ngày |

**Kết nối mặc định (dev):**
- Host: `localhost:5432`
- Database: `lovecards`
- User: `lovecards`
- Password: `lovecards_dev`

---

## 🔄 Giao Tiếp Giữa Services / Event-Driven Communication

Services giao tiếp bất đồng bộ qua RabbitMQ domain events:

| Event | Publisher | Subscriber | Hành động |
|-------|-----------|-----------|-----------|
| `UserRegistered` | Auth Service | Notification Service | Gửi email xác thực tài khoản |
| `UserLoggedIn` | Auth Service | Order Service | Trigger gộp giỏ hàng cookie → DB |
| `OrderPaid` | Order Service | Card Service, Notification | Tạo card records + gửi email xác nhận |
| `CardPublished` | Card Service | Notification, Analytics | Bật tracking + thông báo owner |
| `CardExpired` | Card Service (Scheduler) | Notification | Gửi email nhắc gia hạn |
| `RSVPSubmitted` | Card Service | Notification | Thông báo cho chủ thiệp |
| `WishSubmitted` | Card Service | Notification | Thông báo cho chủ thiệp |

### Giao tiếp đồng bộ (Feign Client)

| From | To | Mục đích |
|------|----|----------|
| Order Service | Template Service | Validate template + lấy giá |
| Card Service | Template Service | Lấy danh sách trường động |
| API Gateway | All services | Route request đến đúng service |

---

## 🚀 Hướng Dẫn Chạy / Getting Started

### Yêu cầu hệ thống

| Tool | Version | Kiểm tra |
|------|---------|----------|
| Java | 21+ | `java -version` |
| Maven | 3.9+ | `mvn -version` |
| Node.js | 20+ | `node -version` |
| Docker | Latest | `docker --version` |
| Docker Compose | Latest | `docker compose version` |

### Backend

```bash
cd Backend

# 1. Khởi động infrastructure (PostgreSQL, Redis, RabbitMQ)
docker compose up -d

# 2. Build toàn bộ services
mvn clean package -DskipTests

# 3. Khởi động tất cả services (khuyến nghị dùng script)
chmod +x start-all.sh stop-all.sh    # Chỉ cần lần đầu
./start-all.sh

# Dừng tất cả services
./stop-all.sh

# Dừng infrastructure
docker compose down
```

Script `start-all.sh` tự động:
1. Kiểm tra Docker containers, khởi động nếu chưa chạy
2. Khởi động Service Discovery → chờ ready
3. Khởi động Config Server → chờ ready
4. Khởi động API Gateway
5. Khởi động tất cả Business Services song song

Logs lưu tại `Backend/logs/*.log`

### Frontend

```bash
cd Frontend

# Cài dependencies
npm install

# Chạy development server
npm run dev
```

### Kiểm tra

| URL | Mô tả |
|-----|-------|
| http://localhost:8761 | Eureka Dashboard — xem tất cả services đã đăng ký |
| http://localhost:8080 | API Gateway — cửa ngõ API |
| http://localhost:8888/actuator/health | Config Server health check |
| http://localhost:15672 | RabbitMQ Management UI (guest/guest) |
| http://localhost:5173 | Frontend (Vite dev server) |

---

## 🔐 Bảo Mật / Security

| Tầng | Cơ chế |
|------|--------|
| Gateway | JWT validation, rate limiting (5 login/phút), CORS |
| Authentication | JWT (access 15 phút + refresh 7 ngày HttpOnly cookie) |
| OAuth2 | Google + Facebook login |
| Password | BCrypt cost 12, tối thiểu 8 ký tự (chữ + số) |
| Internal | Services trust headers từ Gateway (internal network only) |
| Data | HTTPS bắt buộc, không log sensitive data, soft delete |

---

## 💳 Thanh Toán / Payment

Hỗ trợ đầy đủ các phương thức thanh toán phổ biến tại Việt Nam:

| Phương thức | Mô tả | Flow |
|-------------|-------|------|
| QR Chuyển khoản | VietQR — quét mã QR bằng app ngân hàng | QR → User CK → Xác nhận (auto/manual) |
| MoMo | Ví điện tử MoMo | Redirect → Thanh toán → Callback |
| ZaloPay | Ví điện tử ZaloPay | Redirect → Thanh toán → Callback |
| VNPay | Cổng thanh toán VNPay | Redirect → Thanh toán → Callback |
| Visa/Mastercard | Thẻ quốc tế | Tokenize → Charge → Callback |

**Order State Machine:** CREATED → PENDING → PAID → COMPLETED (10 trạng thái, timeout 30 phút cho QR)

---

## 📋 Mô Hình Kinh Doanh / Business Model

### Nguồn doanh thu

| Nguồn | Mô tả | Giai đoạn |
|-------|-------|-----------|
| Trả phí theo mẫu | Người dùng mua từng mẫu thiệp (10K - 99.9M VND) | MVP |
| Gói Hosting | Trả phí theo thời gian thiệp tồn tại (gia hạn theo tháng) | MVP |
| B2B | Gói doanh nghiệp cho nhà hàng, event planner | Phase 2 |
| CTV thiết kế | Nhà thiết kế upload mẫu, nhận hoa hồng khi có người mua | Phase 2 |

### Luồng người dùng chính

```
Khám phá trang chủ
    ↓
Duyệt danh mục / Tìm kiếm / Lọc mẫu thiệp
    ↓
Xem trước mẫu (preview đầy đủ)
    ↓
Thêm vào giỏ hàng (cookie nếu chưa đăng nhập)
    ↓
Đăng nhập → Gộp giỏ hàng cookie vào tài khoản
    ↓
Chọn Gói Hosting → Thanh toán (QR/MoMo/VNPay/ZaloPay/Visa)
    ↓
Tùy chỉnh thiệp (điền thông tin, upload ảnh, chọn nhạc)
    ↓
Xem trước → Xuất bản → Nhận URL + QR code
    ↓
Chia sẻ (Zalo / Messenger / SMS / Copy link)
    ↓
Khách mời xem thiệp → RSVP → Gửi lời chúc
```

---

## 🗺️ Lộ Trình / Roadmap

| Phase | Tên | Nội dung chính | Trạng thái |
|-------|-----|---------------|-----------|
| 0 | Infrastructure & Foundation | Setup microservices, Docker, Flyway, FE skeleton | 🚧 Đang thực hiện |
| 1 | Catalog & Template | Trang chủ, danh mục, tìm kiếm, lọc, preview mẫu | ⏳ Kế hoạch |
| 2 | Cart & Checkout & Payment | Giỏ hàng, đơn hàng, tích hợp thanh toán | ⏳ Kế hoạch |
| 3 | Card Customization | Tùy chỉnh thiệp, upload ảnh, crop, nhạc, auto-save | ⏳ Kế hoạch |
| 4 | Publish & Share | Xuất bản, URL, QR code, chia sẻ Zalo/Messenger/SMS | ⏳ Kế hoạch |
| 5 | Authentication & User | Đăng ký/đăng nhập (Email + Google + Facebook), JWT | ⏳ Kế hoạch |
| 6 | RSVP, Wishes, Analytics, Admin, Legal, i18n | Tương tác khách mời, thống kê, admin panel, pháp lý | ⏳ Kế hoạch |

---

## 📖 Tài Liệu / Documentation

| Tài liệu | Mô tả |
|----------|-------|
| [BRD](docs/business-docs/LoveCards-BRD-v1.0.md) | Tài liệu yêu cầu kinh doanh — mục tiêu, phạm vi, mô hình |
| [User Stories](docs/business-docs/LoveCards-UserStories-v1.0.md) | User stories theo 12 EPICs, acceptance criteria chi tiết |
| [Application Design](docs/business-docs/LoveCards-ApplicationDesign-v1.0.md) | Thiết kế ứng dụng — tech stack, API, frontend architecture |
| [Domain Model](docs/technical-docs/LoveCards-DomainModel-v1.0.md) | Bounded contexts, entities, domain events, business rules |
| [Functional Design](docs/technical-docs/LoveCards-FunctionalDesign-v1.0.md) | Use cases chi tiết, validation, error codes, state machines |
| [Database Schema](docs/technical-docs/LoveCards-Database-v1.0.dbml) | Schema DBML — tất cả tables và relationships |
| [Implementation Plan](docs/implementation/LoveCards-ImplementationPlan-v1.0.md) | Kế hoạch triển khai 7 phases chi tiết |
| [Backend README](Backend/README.md) | Hướng dẫn chi tiết Backend — module, chạy, database |

---

## 🧪 Testing Strategy

| Loại test | Công cụ | Phạm vi |
|-----------|---------|---------|
| Unit Test | JUnit 5 + Mockito | Service layer (coverage >= 80%) |
| Integration Test | Spring Boot Test + Testcontainers | Controller + Repository |
| Contract Test | Pact | Inter-service communication |
| Frontend Test | Vitest + Testing Library | Components + hooks |
| E2E Test (planned) | Playwright | Full user journey |

---

## 👤 Tác Giả / Author

**Nguyễn Hoàng Vinh**

- 📧 Email: vinhnh.2312@gmail.com
- 🐙 GitHub: [hoaqdzink](https://github.com/hoaqdzink)

---

## 📄 License

This project is private and not open-sourced.

---

<p align="center">
  Made with ❤️ in Vietnam
</p>
