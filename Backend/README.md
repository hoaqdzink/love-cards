# Love Cards Backend — Microservices

Hệ thống backend cho nền tảng thiệp mời kỹ thuật số Love Cards, xây dựng theo kiến trúc Microservices với Spring Boot + Spring Cloud.

---

## Tech Stack

| Thành phần | Công nghệ |
|-----------|-----------|
| Framework | Spring Boot 3.4.x |
| Java | 21+ |
| Cloud | Spring Cloud 2024.0.0 |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Message Broker | RabbitMQ 3 |
| Build Tool | Maven |
| Container | Docker + Docker Compose |

---

## Cấu trúc dự án

```text
Backend/
├── pom.xml                      # Parent POM (multi-module)
├── docker-compose.yml           # PostgreSQL + pgAdmin + Redis + RabbitMQ
├── common-lib/                  # Shared: ApiResponse, exceptions, utils
├── service-discovery/           # Eureka Server (port 8761)
├── config-server/               # Spring Cloud Config (port 8888)
├── api-gateway/                 # Spring Cloud Gateway (port 8080)
├── auth-service/                # Authentication + User (port 8081)
├── template-service/            # Catalog + Music (port 8082)
├── order-service/               # Cart + Order + Payment (port 8083)
├── card-service/                # Card + Media + Publish + RSVP + Wishes (port 8084)
├── notification-service/        # Email async (port 8085)
└── analytics-service/           # Analytics tracking (port 8086)
```

---

## Chi tiết từng Module

### common-lib
**Loại:** Library (không chạy độc lập)
**Nhiệm vụ:** Chứa code dùng chung cho tất cả services — không duplicate code.

Bao gồm:
- `ApiResponse<T>` — format response chuẩn cho mọi API
- `PageResponse<T>` — response phân trang
- `GlobalExceptionHandler` — xử lý lỗi tập trung (404, 400, 422, 500)
- `ResourceNotFoundException`, `BusinessException` — custom exceptions

Mọi service đều depend vào module này.

---

### service-discovery (Eureka Server)
**Port:** 8761
**Nhiệm vụ:** "Danh bạ" cho microservices — mỗi service khi khởi động tự đăng ký vào đây.

Cách hoạt động:
1. Template Service khởi động → đăng ký: "Tôi là template-service, port 8082"
2. API Gateway cần gọi Template Service → hỏi Eureka: "template-service ở đâu?"
3. Eureka trả: "IP 10.0.0.5, port 8082" → Gateway gọi đúng chỗ

**Tại sao cần:** Trong microservices, IP/port có thể thay đổi. Eureka giúp services tự tìm nhau mà không hardcode địa chỉ.

**Dashboard:** http://localhost:8761 — xem tất cả services đang chạy.

---

### config-server (Spring Cloud Config)
**Port:** 8888
**Nhiệm vụ:** Quản lý cấu hình tập trung cho tất cả services.

Cách hoạt động:
1. Config Server lưu config chung (DB URL, Redis host, RabbitMQ...)
2. Mỗi service khi khởi động → hỏi Config Server lấy config
3. Đổi config 1 chỗ → tất cả services nhận được

**Tại sao cần:** Thay vì mỗi service có file config riêng với DB password, chỉ cần quản lý 1 chỗ. Đổi password DB → đổi 1 file, không sửa 6 services.

Config nằm tại: `config-server/src/main/resources/configs/application.yml`

---

### api-gateway (Spring Cloud Gateway)
**Port:** 8080
**Nhiệm vụ:** "Cửa ngõ" duy nhất — Frontend chỉ gọi 1 URL (localhost:8080), Gateway chuyển tiếp đến đúng service.

Cách hoạt động:
- Request `/api/v1/templates/...` → route đến Template Service
- Request `/api/v1/orders/...` → route đến Order Service
- Request `/api/v1/cards/...` → route đến Card Service

Ngoài routing, Gateway còn lo:
- **CORS** — cho phép Frontend (port 5173) gọi API
- **Rate Limiting** — giới hạn request/phút (chống spam)
- **JWT Filter** — kiểm tra token (Phase 5)

**Tại sao cần:** Frontend không cần biết có bao nhiêu services, chạy ở port nào. Chỉ cần gọi 1 URL duy nhất.

---

### auth-service
**Port:** 8081
**Schema:** `auth`, `admin`
**Nhiệm vụ:** Xác thực người dùng — đăng ký, đăng nhập, quản lý token.

Chức năng:
- Đăng ký bằng Email + mật khẩu
- Đăng nhập bằng Email/Google/Facebook
- JWT token (access 15 phút + refresh 7 ngày)
- Quên mật khẩu / đặt lại mật khẩu
- Xác thực email
- Rate limiting (5 login/phút)

Tables: `auth.users`, `admin.audit_logs`

---

### template-service
**Port:** 8082
**Schema:** `catalog`
**Nhiệm vụ:** Quản lý mẫu thiệp — danh mục, tìm kiếm, lọc, preview.

Chức năng:
- Danh sách mẫu thiệp (filter theo event_type, colors, sort, pagination)
- Mẫu nổi bật (featured) + trending cho trang chủ
- Chi tiết mẫu + danh sách trường động (template_fields)
- Thư viện nhạc nền
- Redis cache cho danh sách mẫu (5-15 phút)

Tables: `catalog.templates`, `catalog.template_fields`, `catalog.music_library`

---

### order-service
**Port:** 8083
**Schema:** `commerce`
**Nhiệm vụ:** Giỏ hàng, đơn hàng, thanh toán.

Chức năng:
- Giỏ hàng: thêm/xóa mẫu, merge cookie → DB khi đăng nhập
- Tạo đơn hàng + chọn gói hosting
- Thanh toán: QR chuyển khoản, VNPay, MoMo, ZaloPay, Visa
- Order state machine (10 trạng thái)
- Webhook nhận callback từ cổng thanh toán
- Timeout 30 phút cho QR (scheduled job)
- Publish event `OrderPaid` → Card Service tạo thiệp

Tables: `commerce.hosting_plans`, `commerce.orders`, `commerce.order_items`, `commerce.cart_items`, `commerce.order_status_history`

---

### card-service
**Port:** 8084
**Schema:** `cards`, `engagement`
**Nhiệm vụ:** Thiệp đã mua — tùy chỉnh, xuất bản, chia sẻ, RSVP, lời chúc.

Chức năng:
- Danh sách thiệp của user (draft/published/expired)
- Tùy chỉnh: điền trường động, upload ảnh, chọn nhạc
- Auto-save (PUT idempotent)
- Xuất bản: generate URL + slug + QR code + OG image
- Public view: khách mời xem thiệp (không cần auth)
- RSVP: khách xác nhận tham dự
- Lời chúc: khách gửi lời chúc
- Tài khoản ngân hàng mừng cưới

Tables: `cards.cards`, `cards.card_fields`, `cards.card_media`, `cards.bank_accounts`, `engagement.rsvps`, `engagement.wishes`

---

### notification-service
**Port:** 8085
**Schema:** `marketing`
**Nhiệm vụ:** Gửi email + quản lý newsletter/B2B contacts.

Chức năng:
- Gửi email xác thực, reset password, xác nhận đơn hàng
- Gửi email nhắc gia hạn hosting
- Thông báo RSVP/lời chúc mới cho owner
- Newsletter: đăng ký, double opt-in, hủy đăng ký
- Form liên hệ B2B
- Tất cả email gửi async qua RabbitMQ

Tables: `marketing.newsletter_subscribers`, `marketing.b2b_contacts`

---

### analytics-service
**Port:** 8086
**Schema:** `analytics`
**Nhiệm vụ:** Theo dõi lượt xem thiệp — thống kê cho owner.

Chức năng:
- Track page view khi khách mời mở thiệp
- Parse device (mobile/tablet/desktop), OS, nguồn (Zalo/Facebook/SMS)
- Hash IP cho unique view count
- Dashboard: tổng views, views theo ngày, device breakdown, source breakdown
- Scheduled job: aggregate raw → daily summary

Tables: `analytics.card_analytics_raw`, `analytics.card_analytics_daily`

---

## Yêu cầu hệ thống

- Java 21+ (`java -version`)
- Maven 3.9+ (`mvn -version`)
- Docker + Docker Compose (`docker --version`)

---

## Hướng dẫn chạy

### Cách 1: Dùng script (khuyến nghị)

Script tự động khởi động infrastructure + tất cả services theo đúng thứ tự, có health check.

```bash
cd Backend

# Build trước khi chạy lần đầu (hoặc khi có code mới)
mvn clean package -DskipTests

# Cấp quyền thực thi (chỉ cần lần đầu)
chmod +x start-all.sh stop-all.sh

# Khởi động toàn bộ
./start-all.sh

# Dừng toàn bộ services (không dừng Docker containers)
./stop-all.sh
```

Script `start-all.sh` sẽ tự động:
1. Kiểm tra và khởi động Docker containers (PostgreSQL, Redis, RabbitMQ) nếu chưa chạy
2. Khởi động Service Discovery → chờ ready
3. Khởi động Config Server → chờ ready
4. Khởi động API Gateway
5. Khởi động tất cả Business Services song song

Logs được lưu tại `Backend/logs/*.log`.

---

### Cách 2: Chạy thủ công từng service

Phù hợp khi chỉ cần chạy 1-2 services để debug.

#### Bước 1 — Khởi động Infrastructure

```bash
cd Backend
docker compose up -d
```

Kiểm tra containers đang chạy:

```bash
docker compose ps
```

Kết quả mong đợi:
| Container | Port | Mô tả |
|-----------|------|-------|
| `lovecards-postgres` | 5432 | PostgreSQL 16 |
| `lovecards-pgadmin` | 5050 | pgAdmin 4 (quản lý DB) |
| `lovecards-redis` | 6379 | Redis 7 |
| `lovecards-rabbitmq` | 5672, 15672 | RabbitMQ (AMQP + Management UI) |

#### Bước 2 — Build

```bash
mvn clean package -DskipTests
```

#### Bước 3 — Chạy services theo thứ tự

**Quan trọng:** Phải chạy đúng thứ tự. Service Discovery và Config Server phải ready trước khi chạy các service khác.

```bash
# 1. Service Discovery (BẮT BUỘC chạy đầu tiên)
java -jar service-discovery/target/service-discovery-0.0.1-SNAPSHOT.jar
# Chờ đến khi http://localhost:8761 accessible

# 2. Config Server (BẮT BUỘC chạy sau Service Discovery)
java -jar config-server/target/config-server-0.0.1-SNAPSHOT.jar
# Chờ đến khi http://localhost:8888/actuator/health trả OK

# 3. API Gateway
java -jar api-gateway/target/api-gateway-0.0.1-SNAPSHOT.jar

# 4. Business services (chạy song song, mỗi service 1 terminal)
java -jar auth-service/target/auth-service-0.0.1-SNAPSHOT.jar
java -jar template-service/target/template-service-0.0.1-SNAPSHOT.jar
java -jar order-service/target/order-service-0.0.1-SNAPSHOT.jar
java -jar card-service/target/card-service-0.0.1-SNAPSHOT.jar
java -jar notification-service/target/notification-service-0.0.1-SNAPSHOT.jar
java -jar analytics-service/target/analytics-service-0.0.1-SNAPSHOT.jar
```

#### Bước 4 — Kiểm tra

| URL | Mô tả |
|-----|-------|
| http://localhost:8761 | Eureka Dashboard — xem tất cả services đã registered |
| http://localhost:8888/actuator/health | Config Server health check |
| http://localhost:8080/api/v1/templates | API Gateway → Template Service |
| http://localhost:15672 | RabbitMQ Management UI (guest/guest) |
| http://localhost:5050 | pgAdmin (`dev@lovecards.dev` / `lovecards_dev`) — server **Love Cards (local)** đã cấu hình sẵn |

**pgAdmin:** Sau `docker compose up -d`, mở http://localhost:5050. Đăng nhập bằng `PGADMIN_DEFAULT_EMAIL` / `PGADMIN_DEFAULT_PASSWORD` trong `.env`. Trong cây bên trái: **Development → Love Cards (local)** — kết nối tới container `postgres` (user `lovecards`, DB `lovecards`). Các schema chính: `catalog`, `commerce`, `auth`.

---

### Chạy từng service riêng lẻ (development mode)

Khi chỉ cần phát triển 1 service cụ thể, có thể chạy trực tiếp từ IDE hoặc Maven:

```bash
# Chạy bằng Maven (auto-reload khi code thay đổi nếu có spring-boot-devtools)
cd auth-service
mvn spring-boot:run

# Hoặc chạy bằng IntelliJ/VS Code — Run main class trực tiếp
```

**Lưu ý:** Vẫn cần Service Discovery + Config Server + Docker containers đang chạy.

---

## Database

Mỗi service quản lý schema riêng, migrations chạy tự động bằng Flyway khi service khởi động.

| Service | Schema | Tables |
|---------|--------|--------|
| auth-service | `auth` | users |
| auth-service | `admin` | audit_logs |
| template-service | `catalog` | templates, template_fields, music_library |
| order-service | `commerce` | hosting_plans, orders, order_items, cart_items, order_status_history |
| card-service | `cards` | cards, card_fields, card_media, bank_accounts |
| card-service | `engagement` | rsvps, wishes |
| analytics-service | `analytics` | card_analytics_raw, card_analytics_daily |
| notification-service | `marketing` | newsletter_subscribers, b2b_contacts |

**Connection mặc định (dev):**
- Host: `localhost:5432`
- Database: `lovecards`
- User: `lovecards`
- Password: `lovecards_dev`

---

## API Gateway Routing

| Path | Service |
|------|---------|
| `/api/v1/auth/**` | auth-service |
| `/api/v1/templates/**`, `/api/v1/music/**` | template-service |
| `/api/v1/cart/**`, `/api/v1/orders/**`, `/api/v1/hosting-plans/**` | order-service |
| `/api/v1/cards/**`, `/api/v1/public/cards/**`, `/api/v1/upload/**` | card-service |
| `/api/v1/analytics/**` | analytics-service |
| `/api/v1/newsletter/**`, `/api/v1/b2b/**` | notification-service |

---

## Dừng services

```bash
# Dừng tất cả services (dùng script)
./stop-all.sh

# Dừng Docker containers (infrastructure)
docker compose down

# Dừng Docker containers + xóa data (reset hoàn toàn)
docker compose down -v
```

---

## Tài liệu liên quan

- [Implementation Plan](../docs/implementation/LoveCards-ImplementationPlan-v1.0.md)
- [Database Schema (DBML)](../docs/technical-docs/LoveCards-Database-v1.0.dbml)
- [Functional Design](../docs/technical-docs/LoveCards-FunctionalDesign-v1.0.md)
- [BE Skills](../.kiro/skills/BE_skills.md)
