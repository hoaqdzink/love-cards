# Glossary — Thuật Ngữ Chuyên Ngành Trong Bộ Skills

Tài liệu giải thích toàn bộ thuật ngữ chuyên ngành xuất hiện trong 4 bộ skills:
- BE_skills.md (Backend)
- FE_skills.md (Frontend)
- Testing_skills.md (Testing)
- API_Design_skills.md (API Design)

---

## Mục Lục

1. [Phần 1 — Backend & Microservices](#phần-1--backend--microservices)
2. [Phần 2 — Frontend & React](#phần-2--frontend--react)
3. [Phần 3 — Testing](#phần-3--testing)
4. [Phần 4 — API Design & HTTP](#phần-4--api-design--http)
5. [Phần 5 — Database & Infrastructure](#phần-5--database--infrastructure)
6. [Phần 6 — Security & Authentication](#phần-6--security--authentication)

---

## Phần 1 — Backend & Microservices


### Microservices (Vi dịch vụ)

**Định nghĩa:** Kiến trúc phần mềm chia ứng dụng thành nhiều service nhỏ, độc lập, mỗi service đảm nhận 1 chức năng cụ thể và có thể deploy riêng.

**Thực tế:** Thay vì 1 ứng dụng lớn (monolith) chứa tất cả code, bạn tách thành nhiều ứng dụng nhỏ: auth-service lo đăng nhập, card-service lo thiệp, payment-service lo thanh toán. Mỗi cái chạy độc lập, hỏng 1 cái không ảnh hưởng cái khác.

**Ví dụ:** Love Cards có: Auth Service, Card Service, User Service, Payment Service — mỗi cái là 1 project Spring Boot riêng.

**Liên quan:** Monolith, Bounded Context, API Gateway, Service Discovery

---

### Monolith (Ứng dụng nguyên khối)

**Định nghĩa:** Kiến trúc truyền thống — toàn bộ code nằm trong 1 ứng dụng duy nhất, deploy cùng nhau.

**Thực tế:** Dễ bắt đầu nhưng khi ứng dụng lớn lên thì khó maintain, khó scale từng phần riêng.

**Ví dụ:** 1 file JAR chứa cả auth, card, payment, admin — deploy 1 lần là xong.

**Liên quan:** Microservices

---

### Bounded Context (Ngữ cảnh giới hạn)

**Định nghĩa:** Khái niệm từ Domain-Driven Design (DDD) — mỗi service có "ranh giới" rõ ràng về dữ liệu và logic mà nó quản lý.

**Thực tế:** Card Service chỉ biết về thiệp, không biết về thanh toán. Payment Service chỉ biết về đơn hàng, không biết chi tiết thiệp. Mỗi service "sở hữu" dữ liệu của mình.

**Ví dụ:** Card Service có bảng `cards`, `card_fields`. Payment Service có bảng `orders`, `payments`. Không ai truy cập DB của nhau.

**Liên quan:** Microservices, Database per Service

---

### API Gateway (Cổng API)

**Định nghĩa:** Một service đứng trước tất cả microservices, đóng vai trò "cửa ngõ" duy nhất mà client (frontend) gọi vào.

**Thực tế:** Frontend chỉ biết 1 URL duy nhất (api.lovecards.vn). Gateway nhận request rồi chuyển tiếp (route) đến đúng service phía sau. Ngoài ra còn lo rate limiting, xác thực token, CORS.

**Ví dụ:**
- Client gọi `GET /api/v1/cards` → Gateway chuyển đến Card Service
- Client gọi `POST /api/v1/auth/login` → Gateway chuyển đến Auth Service

**Liên quan:** Spring Cloud Gateway, Load Balancer, Routing

---

### Service Discovery (Khám phá dịch vụ)

**Định nghĩa:** Cơ chế để các microservices tự đăng ký và tìm thấy nhau mà không cần hardcode địa chỉ IP.

**Thực tế:** Khi Card Service cần gọi User Service, nó hỏi Service Discovery: "User Service đang chạy ở đâu?" thay vì hardcode `http://192.168.1.5:8081`.

**Ví dụ:** Eureka Server — mỗi service khi khởi động sẽ đăng ký: "Tôi là card-service, IP là 10.0.0.5, port 8080". Service khác muốn gọi thì hỏi Eureka.

**Liên quan:** Eureka, Consul, API Gateway

---

### Config Server (Máy chủ cấu hình)

**Định nghĩa:** Service tập trung quản lý cấu hình (config) cho tất cả microservices.

**Thực tế:** Thay vì mỗi service có file `application.yml` riêng với DB password, API keys... bạn để tất cả config ở 1 chỗ (Git repo hoặc Config Server). Khi cần đổi config, đổi 1 chỗ là tất cả services nhận được.

**Ví dụ:** Spring Cloud Config Server lưu config trong Git. Card Service khởi động → hỏi Config Server → nhận được DB URL, Redis host, secret keys.

**Liên quan:** Environment Variables, Spring Cloud Config

---

### Message Broker (Trung gian tin nhắn)

**Định nghĩa:** Hệ thống trung gian giúp các services gửi/nhận tin nhắn (messages) với nhau mà không cần gọi trực tiếp.

**Thực tế:** Khi user tạo đơn hàng thành công, Order Service gửi 1 message "OrderPaid" lên broker. Notification Service lắng nghe message đó và tự động gửi email xác nhận — mà Order Service không cần biết Notification Service tồn tại.

**Ví dụ:** RabbitMQ, Apache Kafka

**Liên quan:** Event-Driven, Producer, Consumer, Queue, Asynchronous

---

### RabbitMQ

**Định nghĩa:** Một message broker phổ biến, dùng giao thức AMQP để gửi/nhận messages giữa các services.

**Thực tế:** Nhẹ, dễ setup, phù hợp cho hầu hết ứng dụng. Messages được đẩy vào queue, consumer lấy ra xử lý.

**Ví dụ:** Card Service publish event "card.created" → RabbitMQ → Notification Service consume và gửi email.

**Liên quan:** Kafka, Message Broker, Queue

---

### Kafka (Apache Kafka)

**Định nghĩa:** Nền tảng streaming phân tán, xử lý hàng triệu messages/giây, lưu trữ messages lâu dài.

**Thực tế:** Mạnh hơn RabbitMQ về throughput và khả năng replay messages. Phù hợp khi cần xử lý lượng data lớn (analytics, logging).

**Ví dụ:** Mỗi lần khách xem thiệp → gửi event vào Kafka → Analytics Service consume để tính lượt xem.

**Liên quan:** RabbitMQ, Message Broker, Event Streaming

---

### Circuit Breaker (Cầu dao ngắt mạch)

**Định nghĩa:** Pattern bảo vệ hệ thống khi 1 service downstream bị lỗi — tự động "ngắt" không gọi nữa, trả về fallback thay vì chờ timeout.

**Thực tế:** Nếu User Service bị chết, Card Service gọi liên tục sẽ bị chậm theo. Circuit Breaker phát hiện User Service lỗi nhiều → ngắt → trả về "Unknown User" ngay lập tức → không ảnh hưởng Card Service.

**Ví dụ:** Resilience4j Circuit Breaker — sau 5 lần gọi User Service fail liên tiếp → mở circuit → 10 giây sau thử lại.

**Liên quan:** Resilience4j, Fallback, Fault Tolerance, Retry

---

### Resilience4j

**Định nghĩa:** Thư viện Java cung cấp các pattern chịu lỗi: Circuit Breaker, Retry, Rate Limiter, Time Limiter.

**Thực tế:** Thay vì tự code logic "thử lại 3 lần, nếu fail thì trả default", bạn dùng annotation `@CircuitBreaker`, `@Retry` của Resilience4j.

**Ví dụ:**
```java
@CircuitBreaker(name = "userService", fallbackMethod = "getUserFallback")
@Retry(name = "userService")
public UserResponse getUser(String id) { ... }
```

**Liên quan:** Circuit Breaker, Retry, TimeLimiter, Fallback

---

### Fallback (Phương án dự phòng)

**Định nghĩa:** Logic thay thế được thực thi khi request chính bị lỗi.

**Thực tế:** Khi không lấy được thông tin user từ User Service, trả về "Unknown User" thay vì báo lỗi 500 cho client.

**Ví dụ:**
```java
private UserResponse getUserFallback(String userId, Throwable t) {
    return UserResponse.builder().id(userId).name("Unknown User").build();
}
```

**Liên quan:** Circuit Breaker, Resilience4j

---

### Feign Client

**Định nghĩa:** Thư viện Java giúp gọi REST API giữa các microservices bằng cách khai báo interface — không cần viết code HTTP thủ công.

**Thực tế:** Thay vì dùng RestTemplate/WebClient viết code gọi HTTP, bạn chỉ cần khai báo interface với annotation, Feign tự generate code gọi API.

**Ví dụ:**
```java
@FeignClient(name = "user-service")
public interface UserClient {
    @GetMapping("/api/v1/users/{userId}")
    ApiResponse<UserResponse> getUserById(@PathVariable String userId);
}
```
Gọi `userClient.getUserById("123")` → Feign tự gọi HTTP GET đến User Service.

**Liên quan:** REST, Microservices, Service Discovery

---

### Spring Cloud Gateway

**Định nghĩa:** Framework của Spring để xây dựng API Gateway — routing, filtering, rate limiting cho microservices.

**Thực tế:** Là "cửa ngõ" duy nhất, nhận tất cả request từ frontend, kiểm tra token, rồi chuyển tiếp đến đúng service.

**Ví dụ:** Request `/api/v1/cards/**` → route đến card-service:8081. Request `/api/v1/auth/**` → route đến auth-service:8082.

**Liên quan:** API Gateway, Routing, Filter

---

### Distributed Tracing (Truy vết phân tán)

**Định nghĩa:** Kỹ thuật theo dõi 1 request xuyên suốt nhiều microservices để biết nó đi qua đâu, mất bao lâu ở mỗi service.

**Thực tế:** User gọi "tạo đơn hàng" → request đi qua Gateway → Order Service → Card Service → Notification Service. Distributed Tracing cho bạn thấy toàn bộ hành trình + thời gian mỗi bước.

**Ví dụ:** Zipkin/Jaeger UI hiển thị timeline: Gateway (2ms) → Order Service (150ms) → Card Service (80ms).

**Liên quan:** Zipkin, Jaeger, Micrometer, Trace ID, Span

---

### ELK Stack

**Định nghĩa:** Bộ 3 công cụ: Elasticsearch + Logstash + Kibana — dùng để thu thập, lưu trữ và hiển thị logs tập trung.

**Thực tế:** Khi có 10 microservices, mỗi cái có log riêng. ELK gom tất cả logs về 1 chỗ, cho phép search, filter, tạo dashboard.

**Ví dụ:** Tìm tất cả logs có `userId=123` trong 24h qua, xuyên suốt mọi services.

**Liên quan:** Centralized Logging, Loki, Kibana

---

### Spring Boot

**Định nghĩa:** Framework Java giúp tạo ứng dụng web/API nhanh chóng với cấu hình tối thiểu (convention over configuration).

**Thực tế:** Thay vì cấu hình hàng trăm dòng XML như Spring truyền thống, Spring Boot tự cấu hình mặc định hợp lý. Bạn chỉ cần viết code business logic.

**Ví dụ:** Tạo 1 REST API chỉ cần: 1 class Controller + annotation `@RestController` + `@GetMapping`.

**Liên quan:** Spring Framework, Java, REST API

---

### Spring Data JPA

**Định nghĩa:** Module của Spring giúp tương tác với database thông qua Java objects (entities) thay vì viết SQL thủ công.

**Thực tế:** Bạn khai báo interface `CardRepository extends JpaRepository<Card, Long>` → Spring tự generate code CRUD (save, findById, delete...) mà không cần viết SQL.

**Ví dụ:**
```java
public interface CardRepository extends JpaRepository<Card, UUID> {
    List<Card> findByUserId(String userId);  // Spring tự tạo SQL
}
```

**Liên quan:** JPA, Hibernate, ORM, Repository Pattern

---

### ORM (Object-Relational Mapping)

**Định nghĩa:** Kỹ thuật ánh xạ giữa object trong code (Java class) và bảng trong database (SQL table).

**Thực tế:** Thay vì viết SQL rồi tự map kết quả vào object, ORM tự động làm việc đó. Class `Card` tương ứng bảng `cards`, field `title` tương ứng column `title`.

**Ví dụ:** Hibernate là ORM phổ biến nhất trong Java. Khi bạn gọi `cardRepository.save(card)` → Hibernate tự generate `INSERT INTO cards (...)`.

**Liên quan:** Hibernate, JPA, Entity, Spring Data JPA

---

### Entity (Thực thể)

**Định nghĩa:** Java class đại diện cho 1 bảng trong database. Mỗi instance của entity = 1 row trong bảng.

**Thực tế:** Class `Card` với annotation `@Entity` → Hibernate biết nó map với bảng `cards`.

**Ví dụ:**
```java
@Entity
@Table(name = "cards")
public class Card {
    @Id
    private UUID id;
    private String title;
    private String userId;
}
```

**Liên quan:** ORM, JPA, Table, Repository

---

### DTO (Data Transfer Object)

**Định nghĩa:** Object dùng để truyền dữ liệu giữa các layer (controller ↔ service ↔ client) — không chứa business logic.

**Thực tế:** Entity có thể có 20 fields nhưng API chỉ cần trả 5 fields. DTO giúp chọn lọc data cần thiết, không expose toàn bộ entity ra ngoài.

**Ví dụ:**
- `CreateCardRequest` — DTO nhận data từ client
- `CardResponse` — DTO trả data về client
- `Card` (entity) — internal, không bao giờ trả trực tiếp cho client

**Liên quan:** Entity, Mapper, Request/Response

---

### Mapper (Bộ ánh xạ)

**Định nghĩa:** Code chuyển đổi giữa Entity và DTO (và ngược lại).

**Thực tế:** Khi nhận `CreateCardRequest` từ client, cần chuyển thành `Card` entity để lưu DB. Khi lấy `Card` từ DB, cần chuyển thành `CardResponse` để trả client.

**Ví dụ:** MapStruct — thư viện tự generate mapper code từ interface:
```java
@Mapper
public interface CardMapper {
    Card toEntity(CreateCardRequest request);
    CardResponse toResponse(Card entity);
}
```

**Liên quan:** DTO, Entity, MapStruct

---

### Repository Pattern

**Định nghĩa:** Pattern tách biệt logic truy cập database ra khỏi business logic. Repository là "cửa ngõ" duy nhất để đọc/ghi database.

**Thực tế:** Service không viết SQL trực tiếp, mà gọi qua Repository: `cardRepository.findById(id)`, `cardRepository.save(card)`.

**Ví dụ:**
```java
public interface CardRepository extends JpaRepository<Card, UUID> {
    List<Card> findByUserIdAndStatus(String userId, String status);
}
```

**Liên quan:** Spring Data JPA, Entity, Service Layer

---

### @RestController

**Định nghĩa:** Annotation đánh dấu 1 class là REST API controller — nhận HTTP request và trả JSON response.

**Thực tế:** Spring Boot thấy annotation này → tự đăng ký class để xử lý HTTP requests. Mỗi method trong class xử lý 1 endpoint.

**Ví dụ:**
```java
@RestController
@RequestMapping("/api/v1/cards")
public class CardController {
    @GetMapping("/{id}")
    public CardResponse getCard(@PathVariable Long id) { ... }
}
```

**Liên quan:** Controller, @RequestMapping, @GetMapping, @PostMapping

---

### @Transactional

**Định nghĩa:** Annotation đảm bảo 1 method thực hiện trong 1 transaction — nếu có lỗi giữa chừng, tất cả thay đổi DB sẽ bị rollback (hoàn tác).

**Thực tế:** Khi tạo đơn hàng: (1) tạo order, (2) tạo order_items, (3) trừ stock. Nếu bước 3 fail, bước 1 và 2 cũng phải rollback — không để data bị "nửa vời".

**Ví dụ:**
```java
@Transactional
public OrderResponse createOrder(CreateOrderRequest request) {
    Order order = orderRepository.save(...);      // Bước 1
    orderItemRepository.saveAll(...);             // Bước 2
    // Nếu exception ở đây → bước 1, 2 tự rollback
}
```

**Liên quan:** Transaction, Rollback, Database, ACID

---

### AOP (Aspect-Oriented Programming)

**Định nghĩa:** Lập trình hướng khía cạnh — tách các "mối quan tâm xuyên suốt" (logging, security, auditing) ra khỏi business logic.

**Thực tế:** Thay vì viết `log.info(...)` ở đầu mỗi method, bạn tạo 1 Aspect tự động log cho tất cả methods trong service layer.

**Ví dụ:**
```java
@Aspect
@Component
public class LoggingAspect {
    @Before("execution(* com.AVi.loved_card.*.service.*.*(..))")
    public void logBefore(JoinPoint jp) {
        log.info("Calling: {}", jp.getSignature().getName());
    }
}
```

**Liên quan:** Aspect, Cross-cutting Concerns, Logging

---

### Lombok

**Định nghĩa:** Thư viện Java giúp giảm boilerplate code bằng annotations — tự generate getter, setter, constructor, builder...

**Thực tế:** Thay vì viết 50 dòng getter/setter cho 10 fields, bạn chỉ cần `@Data` hoặc `@Builder`.

**Ví dụ:**
- `@Data` → tự tạo getter, setter, toString, equals, hashCode
- `@Builder` → tự tạo builder pattern
- `@RequiredArgsConstructor` → tự tạo constructor cho final fields
- `@Slf4j` → tự tạo biến `log` để logging

**Liên quan:** Boilerplate, Java, Annotations

---

### Record (Java Record)

**Định nghĩa:** Cú pháp Java 16+ để tạo immutable data class ngắn gọn — tự có constructor, getter, equals, hashCode, toString.

**Thực tế:** Thay vì class + Lombok cho DTO, dùng record ngắn hơn và immutable (không thay đổi được sau khi tạo).

**Ví dụ:**
```java
public record CreateCardRequest(
    @NotBlank String title,
    @NotBlank String content,
    @NotNull Long templateId
) {}
// Tự có: constructor, getter (title(), content(), templateId()), equals, hashCode
```

**Liên quan:** DTO, Immutable, Java

---

### Flyway

**Định nghĩa:** Công cụ quản lý database migration — theo dõi và áp dụng các thay đổi schema DB theo thứ tự version.

**Thực tế:** Mỗi khi cần thêm bảng/column, bạn tạo file SQL mới (V1, V2, V3...). Flyway tự biết đã chạy đến version nào và chỉ chạy các version mới.

**Ví dụ:**
```
V1__create_users_table.sql
V2__create_cards_table.sql
V3__add_status_column_to_cards.sql
```
Flyway chạy lần lượt V1 → V2 → V3. Lần sau deploy, nếu đã chạy V1-V3 rồi thì chỉ chạy V4 trở đi.

**Liên quan:** Database Migration, Liquibase, Schema

---

### Soft Delete (Xóa mềm)

**Định nghĩa:** Thay vì xóa row khỏi database (hard delete), đánh dấu `deleted_at = timestamp` để ẩn đi nhưng vẫn giữ data.

**Thực tế:** Khi user "xóa" thiệp, data vẫn còn trong DB (có thể khôi phục). Query thêm `WHERE deleted_at IS NULL` để chỉ lấy data chưa xóa.

**Ví dụ:**
```sql
-- Soft delete
UPDATE cards SET deleted_at = NOW() WHERE id = '123';

-- Query chỉ lấy cards chưa xóa
SELECT * FROM cards WHERE deleted_at IS NULL;
```

**Liên quan:** Hard Delete, Auditing, Data Recovery

---

## Phần 2 — Frontend & React


### React

**Định nghĩa:** Thư viện JavaScript (của Meta/Facebook) để xây dựng giao diện người dùng (UI) bằng cách chia UI thành các components nhỏ, tái sử dụng.

**Thực tế:** Thay vì viết HTML thuần, bạn tạo các "component" (ví dụ: Button, Card, Header) rồi ghép lại thành trang. Khi data thay đổi, React tự cập nhật UI.

**Ví dụ:** `<TemplateCard template={data} />` — 1 component hiển thị thông tin 1 mẫu thiệp.

**Liên quan:** Component, JSX, Virtual DOM, Hooks

---

### Component (Thành phần)

**Định nghĩa:** Khối UI độc lập, có thể tái sử dụng. Mỗi component nhận props (dữ liệu đầu vào) và trả về JSX (giao diện).

**Thực tế:** Chia UI thành nhiều components nhỏ: Header, Footer, TemplateCard, LoginForm... Mỗi cái lo 1 phần giao diện.

**Ví dụ:**
```tsx
export function TemplateCard({ template }: { template: Template }) {
  return (
    <article>
      <h3>{template.name}</h3>
      <p>{template.price}₫</p>
    </article>
  );
}
```

**Liên quan:** Props, JSX, React

---

### JSX (JavaScript XML)

**Định nghĩa:** Cú pháp mở rộng cho phép viết "HTML" bên trong JavaScript/TypeScript. Trông giống HTML nhưng thực chất là JavaScript.

**Thực tế:** Thay vì `document.createElement('div')`, bạn viết `<div>Hello</div>` trực tiếp trong code JS.

**Ví dụ:**
```tsx
// JSX
return <h1 className="text-xl">Hello {name}</h1>;

// Compile thành JavaScript
return React.createElement('h1', { className: 'text-xl' }, 'Hello ', name);
```

**Liên quan:** React, Component, TSX

---

### TypeScript

**Định nghĩa:** Ngôn ngữ mở rộng của JavaScript, thêm hệ thống kiểu dữ liệu (type system) giúp phát hiện lỗi trước khi chạy.

**Thực tế:** JavaScript cho phép `let x = "hello"; x = 123;` (đổi type thoải mái). TypeScript bắt lỗi này ngay khi viết code, trước khi chạy.

**Ví dụ:**
```tsx
// TypeScript bắt lỗi ngay
let name: string = "Vinh";
name = 123; // ❌ Error: Type 'number' is not assignable to type 'string'
```

**Liên quan:** JavaScript, Type Safety, Strict Mode

---

### Strict Mode (TypeScript)

**Định nghĩa:** Chế độ kiểm tra nghiêm ngặt nhất của TypeScript — bật tất cả các rule kiểm tra type.

**Thực tế:** Khi bật `"strict": true` trong tsconfig, TypeScript sẽ bắt nhiều lỗi hơn: null check, implicit any, unused variables...

**Ví dụ:** Với strict mode, `function greet(name) {}` sẽ báo lỗi vì `name` không có type. Phải viết `function greet(name: string) {}`.

**Liên quan:** TypeScript, tsconfig, Type Safety

---

### Vite

**Định nghĩa:** Build tool hiện đại cho frontend — khởi động dev server cực nhanh (< 1 giây) và build production tối ưu.

**Thực tế:** Thay thế Webpack (chậm). Vite dùng ES Modules native của browser nên dev server khởi động gần như tức thì, Hot Module Replacement (HMR) cập nhật UI ngay khi save file.

**Ví dụ:** `npm run dev` → Vite khởi động server trong ~300ms. Sửa code → UI cập nhật trong ~50ms.

**Liên quan:** Webpack, HMR, ESM, Build Tool

---

### HMR (Hot Module Replacement)

**Định nghĩa:** Tính năng cập nhật code trên browser ngay lập tức khi bạn save file, mà không cần reload toàn bộ trang.

**Thực tế:** Bạn sửa CSS hoặc component → browser tự cập nhật phần đó mà không mất state (ví dụ: form đang điền dở vẫn giữ nguyên).

**Ví dụ:** Sửa màu button từ `bg-rose` thành `bg-gold` → save → button đổi màu ngay trên browser, không reload.

**Liên quan:** Vite, Dev Server, Development Experience

---

### TailwindCSS

**Định nghĩa:** CSS framework theo hướng utility-first — cung cấp hàng nghìn class nhỏ (utilities) để style trực tiếp trong HTML/JSX.

**Thực tế:** Thay vì viết file CSS riêng với `.card { border-radius: 12px; padding: 16px; }`, bạn viết trực tiếp: `className="rounded-xl p-4"`.

**Ví dụ:**
```tsx
// Tailwind utilities
<button className="px-8 py-4 rounded-full bg-rose text-white hover:bg-rose/90">
  Mua ngay
</button>

// Tương đương CSS truyền thống:
// .btn { padding: 16px 32px; border-radius: 9999px; background: rose; color: white; }
// .btn:hover { background: rgba(rose, 0.9); }
```

**Liên quan:** CSS, Utility-first, Responsive Design

---

### Utility-first

**Định nghĩa:** Triết lý CSS: thay vì tạo class theo component (`.card`, `.btn`), tạo class theo thuộc tính CSS (`p-4`, `text-lg`, `rounded-xl`).

**Thực tế:** Mỗi class làm đúng 1 việc: `p-4` = padding 16px, `text-lg` = font-size lớn, `rounded-xl` = border-radius 12px. Ghép nhiều class lại để tạo style hoàn chỉnh.

**Ví dụ:** `className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm"` — 6 classes, mỗi cái 1 thuộc tính.

**Liên quan:** TailwindCSS, CSS

---

### React Router

**Định nghĩa:** Thư viện quản lý routing (điều hướng trang) cho React SPA — cho phép chuyển trang mà không reload browser.

**Thực tế:** Khi user click "Danh mục" → URL đổi thành `/mau-thiep` → React Router render component `CatalogPage` — tất cả xảy ra trên client, không gọi server.

**Ví dụ:**
```tsx
const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/mau-thiep', element: <CatalogPage /> },
  { path: '/mau-thiep/:slug', element: <TemplateDetailPage /> },
]);
```

**Liên quan:** SPA, Client-side Routing, URL

---

### SPA (Single Page Application)

**Định nghĩa:** Ứng dụng web chỉ load 1 trang HTML duy nhất. Khi chuyển "trang", JavaScript thay đổi nội dung mà không reload browser.

**Thực tế:** Love Cards là SPA — browser load `index.html` 1 lần, sau đó React Router xử lý mọi navigation. Nhanh hơn vì không cần tải lại toàn bộ trang.

**Ví dụ:** Gmail, Facebook, Twitter đều là SPA.

**Liên quan:** React Router, Client-side Routing, MPA (Multi-Page Application)

---

### TanStack Query (React Query)

**Định nghĩa:** Thư viện quản lý server state — tự động fetch, cache, refetch, và sync dữ liệu từ API.

**Thực tế:** Thay vì tự viết `useEffect` + `useState` + loading/error handling cho mỗi API call, TanStack Query lo hết: cache data, tự refetch khi cần, hiển thị loading/error states.

**Ví dụ:**
```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['templates'],
  queryFn: () => api.get('/templates'),
  staleTime: 5 * 60 * 1000, // cache 5 phút
});
// Tự có: loading state, error state, cache, refetch khi focus window
```

**Liên quan:** Server State, Cache, Stale Time, Query Key

---

### Zustand

**Định nghĩa:** Thư viện quản lý client state (trạng thái phía client) cho React — nhẹ, đơn giản, không boilerplate.

**Thực tế:** Dùng cho state không đến từ API: giỏ hàng (cookie cart), user đang đăng nhập, ngôn ngữ hiện tại, modal đang mở/đóng.

**Ví dụ:**
```tsx
const useCartStore = create((set) => ({
  items: [],
  addItem: (id) => set((state) => ({ items: [...state.items, id] })),
}));

// Dùng trong component
const { items, addItem } = useCartStore();
```

**Liên quan:** State Management, Redux, Context API

---

### State (Trạng thái)

**Định nghĩa:** Dữ liệu có thể thay đổi theo thời gian và ảnh hưởng đến UI. Khi state thay đổi, React tự render lại UI.

**Thực tế:** Có 2 loại:
- **Server state:** Data từ API (danh sách templates, thông tin user) → dùng TanStack Query
- **Client state:** Data chỉ tồn tại trên browser (giỏ hàng, modal mở/đóng) → dùng Zustand

**Ví dụ:** `const [count, setCount] = useState(0)` — `count` là state, khi gọi `setCount(1)` → UI re-render hiển thị 1.

**Liên quan:** useState, Zustand, TanStack Query, Props

---

### Props (Properties)

**Định nghĩa:** Dữ liệu truyền từ component cha xuống component con — giống "tham số" của function.

**Thực tế:** Component cha quyết định component con hiển thị gì bằng cách truyền props.

**Ví dụ:**
```tsx
// Cha truyền props
<TemplateCard template={templateData} onSelect={handleSelect} />

// Con nhận props
function TemplateCard({ template, onSelect }: TemplateCardProps) {
  return <h3>{template.name}</h3>;
}
```

**Liên quan:** Component, State, React

---

### Hooks (React Hooks)

**Định nghĩa:** Các function đặc biệt của React (bắt đầu bằng `use`) cho phép dùng state, side effects, và các tính năng React trong function components.

**Thực tế:** Trước React 16.8, phải dùng class components để có state. Hooks cho phép dùng state trong function components — code ngắn gọn hơn nhiều.

**Ví dụ:**
- `useState` — quản lý state local
- `useEffect` — side effects (gọi API, subscribe events)
- `useRef` — tham chiếu DOM element
- `useMemo` — cache giá trị tính toán nặng
- Custom hooks: `useDebounce`, `useScrollProgress`

**Liên quan:** useState, useEffect, Custom Hooks

---

### useEffect

**Định nghĩa:** Hook để thực hiện side effects — code chạy sau khi component render (gọi API, subscribe events, thay đổi DOM).

**Thực tế:** Dùng khi cần "làm gì đó" sau khi UI hiển thị: fetch data, add event listener, start timer.

**Ví dụ:**
```tsx
useEffect(() => {
  // Chạy sau khi component mount
  window.addEventListener('scroll', handleScroll);
  
  // Cleanup khi component unmount
  return () => window.removeEventListener('scroll', handleScroll);
}, []); // [] = chỉ chạy 1 lần khi mount
```

**Liên quan:** Hooks, Side Effects, Cleanup, Dependencies

---

### Lazy Loading (Tải lười)

**Định nghĩa:** Kỹ thuật chỉ tải resource (code, ảnh) khi thực sự cần — không tải hết lúc đầu.

**Thực tế:** Trang chủ không cần code của trang Admin. Lazy loading chỉ tải code Admin khi user navigate đến `/admin`.

**Ví dụ:**
```tsx
// Code của CatalogPage chỉ được tải khi user vào /mau-thiep
const CatalogPage = lazy(() => import('./pages/CatalogPage'));
```

**Liên quan:** Code Splitting, Bundle, Performance, React.lazy

---

### Barrel Export

**Định nghĩa:** File `index.ts` trong folder dùng để re-export tất cả modules — cho phép import gọn hơn.

**Thực tế:** Thay vì import từ đường dẫn dài, import từ folder (index.ts tự resolve).

**Ví dụ:**
```tsx
// shared/hooks/index.ts (barrel)
export { useDebounce } from './useDebounce';
export { useScrollProgress } from './useScrollProgress';

// Import gọn
import { useDebounce, useScrollProgress } from '@/shared/hooks';
// Thay vì:
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useScrollProgress } from '@/shared/hooks/useScrollProgress';
```

**Liên quan:** Module, Import/Export, TypeScript

---

### Path Alias (@/)

**Định nghĩa:** Shortcut cho đường dẫn import — `@/` map đến `src/`, tránh relative paths dài (`../../../shared/hooks`).

**Thực tế:** Cấu hình trong `tsconfig.json` và `vite.config.ts`. Mọi import bắt đầu từ `@/` = bắt đầu từ thư mục `src/`.

**Ví dụ:**
```tsx
// ✅ Dùng alias
import { useDebounce } from '@/shared/hooks';

// ❌ Relative path dài, khó đọc
import { useDebounce } from '../../../shared/hooks';
```

**Liên quan:** TypeScript, Vite, Module Resolution

---

### Responsive Design (Thiết kế đáp ứng)

**Định nghĩa:** Thiết kế UI tự động điều chỉnh layout theo kích thước màn hình — đẹp trên cả mobile, tablet, desktop.

**Thực tế:** Cùng 1 trang web, trên mobile hiển thị 1 cột, tablet 2 cột, desktop 3-4 cột. TailwindCSS dùng prefix `sm:`, `md:`, `lg:` để áp dụng style theo breakpoint.

**Ví dụ:**
```tsx
// 1 cột mobile, 2 cột tablet, 3 cột desktop
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
```

**Liên quan:** Mobile-first, Breakpoints, TailwindCSS, Viewport

---

### Mobile-first

**Định nghĩa:** Triết lý thiết kế: viết CSS cho mobile trước (default), rồi thêm style cho màn hình lớn hơn bằng media queries.

**Thực tế:** Trong Tailwind, class không có prefix = áp dụng cho mobile. `sm:` = tablet trở lên. `md:` = desktop trở lên.

**Ví dụ:**
```tsx
// padding 16px trên mobile, 24px trên tablet, 32px trên desktop
<div className="p-4 sm:p-6 lg:p-8">
```

**Liên quan:** Responsive Design, Breakpoints, TailwindCSS

---

### Accessibility (a11y — Khả năng tiếp cận)

**Định nghĩa:** Thiết kế web sao cho mọi người đều sử dụng được, kể cả người khuyết tật (khiếm thị, khiếm thính, khó vận động).

**Thực tế:** Người dùng screen reader (đọc màn hình) cần `alt` text cho ảnh, `aria-label` cho buttons không có text. Người dùng keyboard cần focus visible.

**Ví dụ:**
```tsx
// ✅ Accessible
<button aria-label="Đóng modal"><X size={20} /></button>
<img alt="Thiệp cưới mẫu Rose Garden" src="..." />

// ❌ Không accessible
<button><X size={20} /></button>  // Screen reader không biết button làm gì
<img src="..." />                  // Screen reader không biết ảnh gì
```

**Liên quan:** WCAG, aria-label, Semantic HTML, Screen Reader

---

### Semantic HTML (HTML ngữ nghĩa)

**Định nghĩa:** Dùng đúng thẻ HTML theo ý nghĩa nội dung: `<nav>` cho navigation, `<article>` cho bài viết, `<button>` cho nút bấm — thay vì dùng `<div>` cho mọi thứ.

**Thực tế:** Screen readers và search engines hiểu cấu trúc trang nhờ semantic HTML. `<nav>` = "đây là menu", `<main>` = "đây là nội dung chính".

**Ví dụ:**
```tsx
// ✅ Semantic
<header>...</header>
<nav>...</nav>
<main>
  <section>...</section>
  <article>...</article>
</main>
<footer>...</footer>

// ❌ Div soup
<div class="header">...</div>
<div class="nav">...</div>
<div class="main">...</div>
```

**Liên quan:** Accessibility, SEO, HTML5

---

### i18n (Internationalization — Quốc tế hóa)

**Định nghĩa:** Viết tắt của "internationalization" (i + 18 ký tự + n). Kỹ thuật thiết kế app hỗ trợ nhiều ngôn ngữ.

**Thực tế:** Thay vì hardcode "Đăng nhập" trong code, dùng key `t('auth.login')`. Khi đổi ngôn ngữ sang English, key đó trả về "Login".

**Ví dụ:**
```tsx
// Translation file (vi.json)
{ "auth": { "login": "Đăng nhập" } }

// Translation file (en.json)
{ "auth": { "login": "Login" } }

// Component
const { t } = useTranslation();
<button>{t('auth.login')}</button>  // Hiển thị theo ngôn ngữ hiện tại
```

**Liên quan:** react-i18next, Localization (l10n), Translation

---

## Phần 3 — Testing


### Unit Test (Kiểm thử đơn vị)

**Định nghĩa:** Test kiểm tra 1 đơn vị code nhỏ nhất (1 function, 1 method) một cách cô lập — mock tất cả dependencies bên ngoài.

**Thực tế:** Test service method `createCard()` bằng cách mock repository, mapper. Chỉ kiểm tra logic bên trong method đó, không cần DB thật.

**Ví dụ:**
```java
@Test
void createCard_withValidRequest_shouldSaveAndReturn() {
    when(cardRepository.save(any())).thenReturn(cardEntity);
    var result = cardService.createCard(request, "user-123");
    assertThat(result.title()).isEqualTo("My Card");
}
```

**Liên quan:** Integration Test, Mock, Assertion

---

### Integration Test (Kiểm thử tích hợp)

**Định nghĩa:** Test kiểm tra nhiều components hoạt động cùng nhau — controller + service + database thật (hoặc gần thật).

**Thực tế:** Gửi HTTP request thật đến controller, qua service, xuống DB (Testcontainers), kiểm tra response. Test gần giống production hơn unit test.

**Ví dụ:**
```java
@Test
void createCard_shouldReturn201() throws Exception {
    mockMvc.perform(post("/api/v1/cards")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""{"title": "Test"}"""))
        .andExpect(status().isCreated());
}
```

**Liên quan:** Unit Test, E2E Test, Testcontainers, MockMvc

---

### E2E Test (End-to-End — Kiểm thử đầu cuối)

**Định nghĩa:** Test mô phỏng hành vi user thật: mở browser, click, gõ, navigate — kiểm tra toàn bộ flow từ UI đến backend.

**Thực tế:** Playwright mở browser thật, điền form đăng nhập, click submit, kiểm tra redirect đến dashboard. Test chậm nhất nhưng gần thực tế nhất.

**Ví dụ:**
```tsx
test('user can login', async ({ page }) => {
  await page.goto('/dang-nhap');
  await page.fill('[name=email]', 'test@example.com');
  await page.fill('[name=password]', 'password123');
  await page.click('button[type=submit]');
  await expect(page).toHaveURL('/dashboard');
});
```

**Liên quan:** Playwright, Integration Test, Browser Automation

---

### Mock (Giả lập)

**Định nghĩa:** Object giả thay thế dependency thật trong test — cho phép kiểm soát behavior và kiểm tra interactions.

**Thực tế:** Khi test CardService, bạn không muốn gọi DB thật. Mock `CardRepository` để trả về data giả, kiểm tra service xử lý đúng.

**Ví dụ:**
```java
@Mock private CardRepository cardRepository;

// Khi gọi save() → trả về entity giả
when(cardRepository.save(any())).thenReturn(fakeCard);

// Kiểm tra save() được gọi đúng 1 lần
verify(cardRepository, times(1)).save(any());
```

**Liên quan:** Mockito, Stub, Spy, Unit Test

---

### Mockito

**Định nghĩa:** Thư viện Java phổ biến nhất để tạo mock objects trong unit test.

**Thực tế:** Dùng `@Mock` để tạo mock, `when(...).thenReturn(...)` để định nghĩa behavior, `verify(...)` để kiểm tra method được gọi.

**Ví dụ:**
```java
@ExtendWith(MockitoExtension.class)
class CardServiceTest {
    @Mock private CardRepository repo;
    @InjectMocks private CardServiceImpl service;
    
    @Test
    void test() {
        when(repo.findById(1L)).thenReturn(Optional.of(card));
        // ...
    }
}
```

**Liên quan:** Mock, Unit Test, @Mock, @InjectMocks

---

### Testcontainers

**Định nghĩa:** Thư viện Java chạy Docker containers trong test — cho phép dùng PostgreSQL, Redis, RabbitMQ thật trong integration test.

**Thực tế:** Thay vì dùng H2 (in-memory DB có behavior khác PostgreSQL), Testcontainers khởi động PostgreSQL container thật. Test xong → container tự xóa.

**Ví dụ:**
```java
@Container
static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");

// Test dùng PostgreSQL thật, không phải H2
```

**Liên quan:** Docker, Integration Test, PostgreSQL, Container

---

### MSW (Mock Service Worker)

**Định nghĩa:** Thư viện frontend mock API ở network level — intercept HTTP requests và trả response giả mà không cần backend thật.

**Thực tế:** Khi test React component gọi API, MSW chặn request và trả response giả. Component không biết đang dùng mock — code production không thay đổi.

**Ví dụ:**
```tsx
const server = setupServer(
  http.get('*/templates', () => {
    return HttpResponse.json({ data: [{ id: '1', name: 'Rose' }] });
  })
);
// Component gọi fetch('/templates') → MSW trả response giả
```

**Liên quan:** Mock, API Testing, Frontend Testing

---

### Vitest

**Định nghĩa:** Test runner cho Vite projects — nhanh, tương thích API với Jest, native ESM support.

**Thực tế:** Thay thế Jest cho Vite projects. Dùng cùng config Vite (aliases, plugins), chạy nhanh hơn Jest vì dùng Vite's transform pipeline.

**Ví dụ:**
```tsx
import { describe, it, expect, vi } from 'vitest';

describe('formatPrice', () => {
  it('formats VND correctly', () => {
    expect(formatPrice(99000)).toBe('99.000₫');
  });
});
```

**Liên quan:** Jest, Test Runner, Vite

---

### React Testing Library

**Định nghĩa:** Thư viện test React components theo cách user tương tác — query elements bằng role, label, text (không bằng class/id).

**Thực tế:** Test giống cách user thật dùng app: "tìm button có text 'Đăng nhập'", "gõ vào input có label 'Email'". Không test implementation details.

**Ví dụ:**
```tsx
render(<LoginForm />);
await userEvent.type(screen.getByLabelText('Email'), 'test@mail.com');
await userEvent.click(screen.getByRole('button', { name: /đăng nhập/i }));
expect(screen.getByText('Chào mừng')).toBeInTheDocument();
```

**Liên quan:** Testing Library, userEvent, screen, render

---

### Assertion (Khẳng định)

**Định nghĩa:** Câu lệnh kiểm tra kết quả thực tế có đúng như mong đợi không. Nếu sai → test fail.

**Thực tế:** Sau khi gọi function, bạn assert kết quả: "giá trị trả về phải bằng X", "method Y phải được gọi 1 lần".

**Ví dụ:**
```java
// Java (AssertJ)
assertThat(result.title()).isEqualTo("My Card");
assertThat(list).hasSize(3);
assertThat(result).isNotNull();

// TypeScript (Vitest)
expect(result).toBe(5);
expect(array).toHaveLength(3);
expect(fn).toHaveBeenCalledWith('arg');
```

**Liên quan:** expect, assertThat, Test

---

### Test Coverage (Độ phủ test)

**Định nghĩa:** Phần trăm code được chạy qua bởi test. Coverage 80% = 80% dòng code đã được test chạy qua.

**Thực tế:** Không phải 100% coverage = code tốt. Nhưng coverage thấp (< 50%) = nhiều logic chưa được kiểm tra, dễ có bug ẩn.

**Ví dụ:** Service có 100 dòng code, test chạy qua 80 dòng → coverage = 80%.

**Liên quan:** Unit Test, CI/CD, Quality Gate

---

### Given/When/Then

**Định nghĩa:** Pattern tổ chức test thành 3 phần rõ ràng: chuẩn bị dữ liệu (Given), thực hiện action (When), kiểm tra kết quả (Then).

**Thực tế:** Giúp test dễ đọc — người đọc biết ngay: setup gì, làm gì, expect gì.

**Ví dụ:**
```java
@Test
void createCard_shouldSave() {
    // Given — chuẩn bị
    var request = new CreateCardRequest("Title", "Content", 1L);
    when(repo.save(any())).thenReturn(card);

    // When — thực hiện
    var result = service.createCard(request, "user-1");

    // Then — kiểm tra
    assertThat(result.title()).isEqualTo("Title");
    verify(repo).save(any());
}
```

**Liên quan:** AAA (Arrange/Act/Assert), Test Structure

---

### Parameterized Test (Test tham số hóa)

**Định nghĩa:** Chạy cùng 1 test logic với nhiều bộ input khác nhau — tránh copy-paste test chỉ đổi data.

**Thực tế:** Thay vì viết 5 test giống nhau chỉ khác input, viết 1 test + danh sách inputs.

**Ví dụ:**
```java
@ParameterizedTest
@ValueSource(strings = {"", " ", "ab"})
void createCard_withInvalidTitle_shouldThrow(String title) {
    var request = new CreateCardRequest(title, "Content", 1L);
    assertThatThrownBy(() -> service.createCard(request, "user-1"))
        .isInstanceOf(ValidationException.class);
}
// Chạy 3 lần với 3 giá trị title khác nhau
```

**Liên quan:** Unit Test, DRY, Test Data

---

### Playwright

**Định nghĩa:** Framework E2E testing của Microsoft — điều khiển browser thật (Chrome, Firefox, Safari) để test UI.

**Thực tế:** Mở browser, navigate đến trang, tương tác như user thật, chụp screenshot, kiểm tra kết quả.

**Ví dụ:**
```tsx
test('user can add template to cart', async ({ page }) => {
  await page.goto('/mau-thiep');
  await page.click('[data-testid="template-card-1"] button');
  await expect(page.locator('.cart-count')).toHaveText('1');
});
```

**Liên quan:** E2E Test, Browser Automation, Cypress

---

## Phần 4 — API Design & HTTP


### REST (Representational State Transfer)

**Định nghĩa:** Kiến trúc thiết kế API dựa trên HTTP — dùng URL đại diện cho resources, HTTP methods đại diện cho actions.

**Thực tế:** Thay vì tạo endpoint `/getUser`, `/createUser`, `/deleteUser`, REST dùng 1 URL `/users` + methods: GET (lấy), POST (tạo), DELETE (xóa).

**Ví dụ:**
```
GET    /api/v1/cards       → Lấy danh sách cards
POST   /api/v1/cards       → Tạo card mới
GET    /api/v1/cards/123   → Lấy card có id=123
PUT    /api/v1/cards/123   → Cập nhật card 123
DELETE /api/v1/cards/123   → Xóa card 123
```

**Liên quan:** HTTP, Resource, Endpoint, CRUD

---

### HTTP Methods (Phương thức HTTP)

**Định nghĩa:** Các "động từ" trong HTTP request cho biết client muốn làm gì với resource.

**Thực tế:**
- **GET** — Lấy data (đọc, không thay đổi gì)
- **POST** — Tạo mới (gửi data lên server)
- **PUT** — Cập nhật toàn bộ (thay thế hoàn toàn)
- **PATCH** — Cập nhật một phần (chỉ sửa vài fields)
- **DELETE** — Xóa

**Ví dụ:** `POST /api/v1/orders` = "Tạo đơn hàng mới". `DELETE /api/v1/cart/items/123` = "Xóa item 123 khỏi giỏ".

**Liên quan:** REST, Idempotent, CRUD

---

### Idempotent (Lũy đẳng)

**Định nghĩa:** Gọi nhiều lần cho cùng kết quả như gọi 1 lần. GET, PUT, DELETE là idempotent. POST không phải.

**Thực tế:** `DELETE /cards/123` — gọi 1 lần hay 5 lần, card 123 vẫn bị xóa (kết quả giống nhau). `POST /cards` — gọi 5 lần tạo ra 5 cards khác nhau.

**Ví dụ:**
- ✅ Idempotent: `PUT /cards/123 {title: "New"}` — gọi 10 lần, title vẫn là "New"
- ❌ Không idempotent: `POST /cards {title: "New"}` — gọi 10 lần, tạo 10 cards

**Liên quan:** HTTP Methods, REST, Safety

---

### Endpoint (Điểm cuối API)

**Định nghĩa:** Một URL cụ thể mà client gọi để thực hiện 1 action. Mỗi endpoint = 1 method + 1 URL.

**Thực tế:** `GET /api/v1/templates` là 1 endpoint. `POST /api/v1/auth/login` là 1 endpoint khác.

**Ví dụ:** Love Cards có ~50 endpoints: login, register, get templates, create order, publish card...

**Liên quan:** REST, URL, Route

---

### HTTP Status Codes (Mã trạng thái HTTP)

**Định nghĩa:** Số 3 chữ số server trả về cho biết kết quả request: thành công, lỗi client, hay lỗi server.

**Thực tế:**
- **2xx** — Thành công: 200 (OK), 201 (Created), 204 (No Content)
- **4xx** — Lỗi do client: 400 (Bad Request), 401 (Unauthorized), 404 (Not Found)
- **5xx** — Lỗi do server: 500 (Internal Error), 503 (Service Unavailable)

**Ví dụ:**
- Tạo card thành công → 201 Created
- Gửi data thiếu field → 400 Bad Request
- Chưa đăng nhập → 401 Unauthorized
- Card không tồn tại → 404 Not Found

**Liên quan:** REST, Error Handling, Response

---

### Pagination (Phân trang)

**Định nghĩa:** Chia danh sách lớn thành nhiều "trang" nhỏ — mỗi request chỉ trả 1 trang (ví dụ 12 items).

**Thực tế:** Có 1000 templates nhưng không trả hết 1 lần (chậm, tốn bandwidth). Trả 12 items/trang, client muốn trang tiếp theo thì gọi `?page=1`.

**Ví dụ:**
```
GET /templates?page=0&size=12  → items 1-12
GET /templates?page=1&size=12  → items 13-24
GET /templates?page=2&size=12  → items 25-36
```

**Liên quan:** Query Parameters, Performance, Infinite Scroll

---

### Rate Limiting (Giới hạn tốc độ)

**Định nghĩa:** Giới hạn số request client được gửi trong 1 khoảng thời gian — bảo vệ server khỏi bị quá tải hoặc abuse.

**Thực tế:** Login endpoint cho phép max 5 requests/phút. Nếu vượt quá → trả 429 Too Many Requests. Ngăn brute force attack.

**Ví dụ:**
```
Request 1-5: 200 OK
Request 6:   429 Too Many Requests
             Header: Retry-After: 60 (thử lại sau 60 giây)
```

**Liên quan:** 429 Status Code, Security, DDoS Protection

---

### Query Parameters (Tham số truy vấn)

**Định nghĩa:** Phần sau dấu `?` trong URL — dùng để truyền thêm thông tin cho request (filter, sort, page).

**Thực tế:** Không thay đổi resource, chỉ thay đổi cách lấy/hiển thị data.

**Ví dụ:**
```
GET /templates?event_type=wedding&sort=popular&page=0&size=12
              ─────────────────── ──────────── ────── ───────
              filter               sort         page   size
```

**Liên quan:** URL, Filter, Pagination, REST

---

### Request Body (Thân request)

**Định nghĩa:** Dữ liệu gửi kèm trong POST/PUT/PATCH request — thường là JSON chứa thông tin cần tạo/cập nhật.

**Thực tế:** Khi tạo card mới, client gửi JSON trong body chứa title, content, templateId.

**Ví dụ:**
```json
POST /api/v1/cards
Content-Type: application/json

{
  "title": "Đám cưới Minh & Lan",
  "content": "Trân trọng kính mời...",
  "templateId": "uuid-123"
}
```

**Liên quan:** JSON, Content-Type, POST, PUT

---

### JSON (JavaScript Object Notation)

**Định nghĩa:** Format dữ liệu text-based, dễ đọc, dùng phổ biến nhất để truyền data giữa client và server.

**Thực tế:** API gửi/nhận data dưới dạng JSON. Cả frontend (JavaScript) và backend (Java) đều parse được.

**Ví dụ:**
```json
{
  "id": "123",
  "title": "Rose Garden",
  "price": 99000,
  "colors": ["pink", "white"],
  "isActive": true
}
```

**Liên quan:** API, Request Body, Response, Content-Type

---

### Backward-compatible (Tương thích ngược)

**Định nghĩa:** Thay đổi API mà không làm hỏng client đang dùng version cũ.

**Thực tế:** Thêm field mới vào response = OK (client cũ ignore field mới). Xóa field khỏi response = BREAKING (client cũ đang dùng field đó sẽ lỗi).

**Ví dụ:**
- ✅ Backward-compatible: Thêm `"createdBy": "admin"` vào response
- ❌ Breaking: Đổi `"price": 99000` thành `"pricing": {"amount": 99000, "currency": "VND"}`

**Liên quan:** API Versioning, Breaking Change, Deprecation

---

### API Versioning (Phiên bản API)

**Định nghĩa:** Đánh số version cho API (`/v1/`, `/v2/`) để có thể thay đổi mà không ảnh hưởng client đang dùng version cũ.

**Thực tế:** Khi cần breaking change, tạo `/v2/` mới. Client cũ vẫn dùng `/v1/` bình thường. Dần dần migrate sang v2.

**Ví dụ:**
```
/v1/templates  → response format cũ (vẫn hoạt động)
/v2/templates  → response format mới (thêm fields, đổi structure)
```

**Liên quan:** Backward-compatible, Breaking Change, Deprecation

---

### Webhook

**Định nghĩa:** Cơ chế server A gọi ngược lại server B khi có sự kiện xảy ra — "đừng hỏi tôi, tôi sẽ gọi bạn khi có tin".

**Thực tế:** Khi user thanh toán xong trên VNPay, VNPay gọi webhook đến Love Cards server: "Đơn hàng LC-123 đã thanh toán thành công". Love Cards nhận và cập nhật trạng thái.

**Ví dụ:**
```
User thanh toán trên VNPay
    → VNPay gọi POST https://api.lovecards.vn/v1/webhooks/vnpay
    → Love Cards nhận, verify signature, update order status = PAID
```

**Liên quan:** Callback, IPN, Payment Gateway, Event

---

### CORS (Cross-Origin Resource Sharing)

**Định nghĩa:** Cơ chế bảo mật browser — chỉ cho phép frontend gọi API từ domain được phép.

**Thực tế:** Frontend ở `lovecards.vn` gọi API ở `api.lovecards.vn`. Browser kiểm tra: "API có cho phép domain lovecards.vn gọi không?" Nếu không → block request.

**Ví dụ:** Server config: "Cho phép requests từ `https://lovecards.vn`". Browser thấy response header `Access-Control-Allow-Origin: https://lovecards.vn` → cho phép.

**Liên quan:** Browser Security, API Gateway, Headers

---

### camelCase, snake_case, kebab-case

**Định nghĩa:** Các quy ước đặt tên biến/fields:
- **camelCase:** viết liền, chữ đầu mỗi từ (trừ từ đầu) viết hoa: `firstName`, `templateId`
- **snake_case:** dùng dấu gạch dưới: `first_name`, `template_id`
- **kebab-case:** dùng dấu gạch ngang: `first-name`, `template-id`

**Thực tế trong Love Cards:**
- JSON fields (request/response): **camelCase** (`templateId`, `eventType`)
- URL paths: **kebab-case** (`/hosting-plans`, `/verify-otp`)
- Query params: **snake_case** (`event_type`, `price_min`)
- Database columns: **snake_case** (`user_id`, `created_at`)

**Liên quan:** Naming Convention, API Design

---

## Phần 5 — Database & Infrastructure


### PostgreSQL

**Định nghĩa:** Hệ quản trị cơ sở dữ liệu quan hệ (RDBMS) mã nguồn mở, mạnh mẽ, hỗ trợ JSON, full-text search, và nhiều tính năng nâng cao.

**Thực tế:** Love Cards dùng PostgreSQL làm database chính — lưu users, templates, orders, cards. Hỗ trợ JSONB cho data linh hoạt (color_tags, metadata).

**Ví dụ:** `SELECT * FROM templates WHERE color_tags ?| array['pink', 'gold']` — query JSONB array.

**Liên quan:** SQL, Database, JSONB, AWS RDS

---

### Redis

**Định nghĩa:** Database in-memory (lưu trong RAM) — cực nhanh, dùng cho cache, session, rate limiting, message queue đơn giản.

**Thực tế:** Love Cards dùng Redis cho: cache template lists (5 phút), lưu OTP codes (5 phút TTL), rate limit counters, JWT blacklist.

**Ví dụ:**
```
SET otp:0901234567 "123456" EX 300    → Lưu OTP, tự xóa sau 5 phút
GET otp:0901234567                     → Lấy OTP để verify
```

**Liên quan:** Cache, TTL, In-memory, Session

---

### Cache (Bộ nhớ đệm)

**Định nghĩa:** Lưu trữ tạm thời data thường xuyên truy cập — lần sau lấy từ cache (nhanh) thay vì query DB (chậm).

**Thực tế:** Danh sách featured templates được query từ DB 1 lần, lưu vào Redis 15 phút. 1000 requests tiếp theo lấy từ Redis — không cần query DB.

**Ví dụ:**
```
Request 1: DB query (150ms) → lưu vào Redis
Request 2-1000: Lấy từ Redis (2ms)
Sau 15 phút: Cache hết hạn → query DB lại
```

**Liên quan:** Redis, TTL, Cache Invalidation, Performance

---

### TTL (Time To Live)

**Định nghĩa:** Thời gian sống của data trong cache — hết TTL thì data tự bị xóa.

**Thực tế:** OTP code có TTL 5 phút (hết hạn thì không dùng được). Template cache có TTL 15 phút (sau 15 phút query DB lại để có data mới).

**Ví dụ:** `SET key value EX 300` → data tự xóa sau 300 giây (5 phút).

**Liên quan:** Cache, Redis, Expiration

---

### Docker

**Định nghĩa:** Platform đóng gói ứng dụng + dependencies vào "container" — chạy giống nhau trên mọi máy (dev, staging, production).

**Thực tế:** "Trên máy tôi chạy được" → Docker giải quyết vấn đề này. Đóng gói app + Java + config vào 1 container, chạy ở đâu cũng giống nhau.

**Ví dụ:**
```dockerfile
FROM eclipse-temurin:21-jre-alpine
COPY target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
```
Build: `docker build -t card-service .` → Chạy: `docker run card-service`

**Liên quan:** Container, Docker Compose, Dockerfile, Image

---

### Docker Compose

**Định nghĩa:** Tool chạy nhiều Docker containers cùng lúc — định nghĩa trong 1 file `docker-compose.yml`.

**Thực tế:** Love Cards cần: PostgreSQL + Redis + RabbitMQ + API Gateway + Card Service + Auth Service. Docker Compose khởi động tất cả bằng 1 lệnh.

**Ví dụ:** `docker-compose up` → khởi động 6 containers, tự kết nối network với nhau.

**Liên quan:** Docker, Container, Development Environment

---

### Container (Thùng chứa)

**Định nghĩa:** Môi trường cô lập chạy 1 ứng dụng — nhẹ hơn máy ảo (VM), khởi động trong vài giây.

**Thực tế:** Mỗi microservice chạy trong 1 container riêng. Container có OS riêng, dependencies riêng, không ảnh hưởng nhau.

**Ví dụ:** Card Service container chứa: Alpine Linux + Java 21 + app.jar. PostgreSQL container chứa: Debian + PostgreSQL 16.

**Liên quan:** Docker, Image, Isolation

---

### CI/CD (Continuous Integration / Continuous Deployment)

**Định nghĩa:**
- **CI (Continuous Integration):** Tự động build + test code mỗi khi push lên Git.
- **CD (Continuous Deployment):** Tự động deploy lên server sau khi CI pass.

**Thực tế:** Push code lên GitHub → GitHub Actions tự chạy: build → test → nếu pass → deploy lên AWS. Không cần deploy thủ công.

**Ví dụ:**
```
Developer push code → GitHub Actions:
  1. Build Java project ✅
  2. Run unit tests ✅
  3. Run integration tests ✅
  4. Build Docker image ✅
  5. Deploy to AWS ECS ✅
```

**Liên quan:** GitHub Actions, Pipeline, Automated Testing, DevOps

---

### AWS (Amazon Web Services)

**Định nghĩa:** Nền tảng cloud computing của Amazon — cung cấp hàng trăm dịch vụ: server, database, storage, CDN...

**Thực tế:** Love Cards dùng AWS: EC2/ECS (chạy backend), RDS (PostgreSQL), S3 (lưu ảnh/nhạc), CloudFront (CDN), SES (gửi email).

**Ví dụ:**
- AWS RDS = PostgreSQL database managed (AWS lo backup, scaling)
- AWS S3 = Lưu file ảnh thiệp, nhạc nền
- AWS CloudFront = CDN phân phối ảnh nhanh toàn cầu

**Liên quan:** Cloud, EC2, S3, RDS, CloudFront

---

### CDN (Content Delivery Network)

**Định nghĩa:** Mạng lưới servers phân tán toàn cầu — cache và phân phối static files (ảnh, CSS, JS) từ server gần user nhất.

**Thực tế:** User ở Hà Nội load ảnh thiệp → lấy từ CDN server ở Singapore (gần) thay vì server ở US (xa). Nhanh hơn nhiều.

**Ví dụ:** CloudFront cache ảnh thiệp. User đầu tiên load → CloudFront lấy từ S3 (origin). User thứ 2-1000 → lấy từ CloudFront edge (đã cache).

**Liên quan:** AWS CloudFront, Static Assets, Performance, Caching

---

### Environment Variables (Biến môi trường)

**Định nghĩa:** Biến cấu hình được set ở cấp hệ điều hành/container — code đọc giá trị từ đây thay vì hardcode.

**Thực tế:** Database password, API keys, secret tokens không được viết trong code. Lưu trong environment variables, mỗi môi trường (dev/staging/prod) có giá trị khác nhau.

**Ví dụ:**
```
# .env (không commit lên Git)
DB_PASSWORD=super_secret_123
VITE_API_URL=https://api.lovecards.vn/v1

# Code đọc
String dbPass = System.getenv("DB_PASSWORD");           // Java
const apiUrl = import.meta.env.VITE_API_URL;            // Frontend
```

**Liên quan:** Config, Security, .env file, Secrets

---

### Health Check (Kiểm tra sức khỏe)

**Định nghĩa:** Endpoint đặc biệt (`/health`) cho biết service có đang hoạt động bình thường không.

**Thực tế:** Kubernetes/Load Balancer gọi health check mỗi vài giây. Nếu service trả "unhealthy" → tự restart hoặc ngừng gửi traffic đến.

**Ví dụ:**
```
GET /actuator/health
Response: { "status": "UP", "components": { "db": "UP", "redis": "UP" } }
```

**Liên quan:** Kubernetes, Load Balancer, Monitoring, Liveness/Readiness

---

## Phần 6 — Security & Authentication


### JWT (JSON Web Token)

**Định nghĩa:** Token (chuỗi ký tự) chứa thông tin user đã được mã hóa — server tạo ra sau khi đăng nhập, client gửi kèm mỗi request để chứng minh "tôi đã đăng nhập".

**Thực tế:** User đăng nhập → server trả JWT. Mỗi request sau đó, client gửi JWT trong header `Authorization: Bearer {token}`. Server verify token → biết user là ai.

**Ví dụ:**
```
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMjMiLCJyb2xlIjoiYWRtaW4ifQ.abc123
│─── Header ───│──────── Payload ────────│── Signature ──│

Payload chứa: { "userId": "123", "role": "admin", "exp": 1621500000 }
```

**Liên quan:** Access Token, Refresh Token, Authentication, Bearer

---

### Access Token

**Định nghĩa:** JWT ngắn hạn (15 phút) dùng để xác thực mỗi API request. Hết hạn nhanh để giảm rủi ro nếu bị lộ.

**Thực tế:** Lưu trong memory (Zustand), không lưu localStorage (dễ bị XSS attack). Hết hạn → dùng Refresh Token để lấy cái mới.

**Ví dụ:** Header: `Authorization: Bearer eyJhbGci...` → Server verify → biết userId, role.

**Liên quan:** JWT, Refresh Token, Bearer, Authorization Header

---

### Refresh Token

**Định nghĩa:** Token dài hạn (7 ngày) dùng để lấy Access Token mới khi Access Token hết hạn — không cần user đăng nhập lại.

**Thực tế:** Lưu trong HttpOnly cookie (JavaScript không đọc được → an toàn hơn). Khi Access Token hết hạn (401) → gọi `/auth/refresh` → nhận Access Token mới.

**Ví dụ:**
```
1. Access Token hết hạn → API trả 401
2. Frontend gọi POST /auth/refresh (cookie tự gửi Refresh Token)
3. Server verify Refresh Token → trả Access Token mới
4. Frontend retry request ban đầu với token mới
```

**Liên quan:** Access Token, JWT, HttpOnly Cookie, Token Rotation

---

### OAuth2

**Định nghĩa:** Giao thức cho phép user đăng nhập bằng tài khoản bên thứ 3 (Google, Facebook) mà không cần chia sẻ mật khẩu.

**Thực tế:** User click "Đăng nhập bằng Google" → redirect đến Google → user cho phép → Google trả `code` → backend đổi code lấy user info → tạo JWT.

**Ví dụ:**
```
1. User click "Login with Google"
2. Redirect → Google consent screen
3. User click "Allow"
4. Google redirect về lovecards.vn?code=abc123
5. Backend gọi Google API: exchange code → get email, name, avatar
6. Tạo/tìm user → trả JWT
```

**Liên quan:** Google OAuth, Facebook OAuth, Authorization Code, Provider

---

### HTTPS

**Định nghĩa:** HTTP + SSL/TLS encryption — mã hóa toàn bộ data truyền giữa client và server, ngăn bị đọc trộm.

**Thực tế:** Bắt buộc cho mọi website có form đăng nhập, thanh toán. Không có HTTPS → password, token truyền dạng plain text → ai cũng đọc được.

**Ví dụ:** `https://api.lovecards.vn` — ổ khóa xanh trên browser = HTTPS đang hoạt động.

**Liên quan:** SSL/TLS, Certificate, Security, Encryption

---

### BCrypt

**Định nghĩa:** Thuật toán hash password — biến password thành chuỗi không thể đảo ngược. Chậm có chủ đích để chống brute force.

**Thực tế:** Không bao giờ lưu password dạng plain text. Lưu BCrypt hash. Khi user đăng nhập, hash password nhập vào rồi so sánh với hash trong DB.

**Ví dụ:**
```
Password: "mypassword123"
BCrypt hash: "$2a$12$LJ3m4sMKfRzb5rGKfR3xQOzJ8QhYp5..."

// Verify
BCrypt.matches("mypassword123", storedHash) → true
BCrypt.matches("wrongpassword", storedHash) → false
```

**Liên quan:** Hashing, Password Security, Salt

---

### Rate Limiting (trong context Security)

**Định nghĩa:** Giới hạn số lần thực hiện action trong thời gian nhất định — ngăn brute force, spam, DDoS.

**Thực tế:**
- Login: max 5 lần/phút (ngăn brute force password)
- OTP: max 5 lần/giờ (ngăn spam SMS)
- Upload: max 20 lần/phút (ngăn abuse storage)

**Ví dụ:** User nhập sai password 5 lần → block 15 phút. Gửi OTP 5 lần trong 1 giờ → "Vượt quá số lần gửi OTP".

**Liên quan:** Security, Redis, 429 Status Code, Brute Force

---

### CORS (trong context Security)

**Định nghĩa:** Cross-Origin Resource Sharing — cơ chế browser chỉ cho phép frontend gọi API từ domain được server cho phép.

**Thực tế:** `lovecards.vn` (frontend) gọi `api.lovecards.vn` (backend) = cross-origin. Server phải config cho phép origin `lovecards.vn`. Nếu không → browser block request.

**Ví dụ:**
```
// Server response header
Access-Control-Allow-Origin: https://lovecards.vn
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Authorization, Content-Type
```

**Liên quan:** Browser Security, API Gateway, Headers, Preflight

---

### XSS (Cross-Site Scripting)

**Định nghĩa:** Tấn công inject mã JavaScript độc hại vào website — đánh cắp token, cookie, data của user.

**Thực tế:** Nếu lưu JWT trong localStorage → XSS attack có thể đọc được. Vì vậy lưu Access Token trong memory (Zustand), Refresh Token trong HttpOnly cookie.

**Ví dụ:** Attacker gửi lời chúc chứa `<script>steal(document.cookie)</script>`. Nếu không sanitize → script chạy trên browser user khác.

**Liên quan:** Security, HttpOnly Cookie, Input Sanitization, Token Storage

---

### HttpOnly Cookie

**Định nghĩa:** Cookie có flag `HttpOnly` — JavaScript không thể đọc/ghi cookie này. Chỉ browser tự gửi kèm request.

**Thực tế:** Refresh Token lưu trong HttpOnly cookie → XSS attack không đọc được (vì JavaScript bị chặn). Browser tự gửi cookie khi gọi `/auth/refresh`.

**Ví dụ:**
```
Set-Cookie: refresh_token=abc123; HttpOnly; Secure; SameSite=Lax; Path=/auth
// JavaScript: document.cookie → KHÔNG thấy refresh_token
```

**Liên quan:** Cookie, XSS, Refresh Token, Security

---

### Swagger / OpenAPI

**Định nghĩa:** Specification (đặc tả) + UI tool để document REST API — mô tả endpoints, request/response format, cho phép test API trực tiếp trên browser.

**Thực tế:** Swagger UI tự generate trang web liệt kê tất cả endpoints, cho phép gửi request thử. Frontend dev đọc Swagger để biết API format.

**Ví dụ:** Truy cập `http://localhost:8080/swagger-ui.html` → thấy danh sách tất cả endpoints, có thể click "Try it out" để test.

**Liên quan:** API Documentation, OpenAPI Spec, SpringDoc

---

### @Schema, @Operation, @ApiResponse (Swagger Annotations)

**Định nghĩa:** Annotations Java để mô tả API cho Swagger UI:
- `@Operation(summary = "...")` — mô tả endpoint làm gì
- `@ApiResponse(responseCode = "200")` — mô tả response codes
- `@Schema(description = "...", example = "...")` — mô tả fields trong DTO

**Thực tế:** Thêm annotations → Swagger UI tự hiển thị documentation đẹp, có examples, có description.

**Ví dụ:**
```java
@Operation(summary = "Tạo thiệp mới")
@ApiResponse(responseCode = "201", description = "Tạo thành công")
@PostMapping
public ApiResponse<CardResponse> createCard(...) { ... }
```

**Liên quan:** Swagger, OpenAPI, API Documentation

---

### Structured Logging (Log có cấu trúc)

**Định nghĩa:** Viết log theo format có cấu trúc (key=value hoặc JSON) thay vì text tự do — dễ search, filter, phân tích.

**Thực tế:** Thay vì `log.info("User 123 created card 456")`, viết `log.info("Card created, userId={}, cardId={}", userId, cardId)`. Tools như ELK có thể filter theo userId.

**Ví dụ:**
```java
// ✅ Structured — dễ search
log.info("Card created, cardId={}, userId={}", card.getId(), userId);

// ❌ Unstructured — khó search
log.info("Card " + card.getId() + " was created by user " + userId);
```

**Liên quan:** Logging, ELK Stack, Monitoring, Observability

---

### Prometheus / Metrics

**Định nghĩa:** Hệ thống thu thập metrics (số liệu) từ ứng dụng: request count, response time, error rate, memory usage.

**Thực tế:** Spring Boot expose endpoint `/actuator/prometheus` → Prometheus scrape mỗi 15 giây → Grafana hiển thị dashboard.

**Ví dụ:** Metrics: "Card Service xử lý 500 requests/phút, response time trung bình 120ms, error rate 0.5%".

**Liên quan:** Monitoring, Grafana, Health Check, Observability

---

### Event-Driven (Hướng sự kiện)

**Định nghĩa:** Kiến trúc mà các services giao tiếp bằng cách publish/subscribe events — không gọi trực tiếp nhau.

**Thực tế:** Order Service publish event "OrderPaid" → Notification Service subscribe → gửi email. Card Service subscribe → tạo card records. Các services không biết nhau tồn tại.

**Ví dụ:**
```
Order Service: publish("order.paid", { orderId, userId })
    ↓ (qua RabbitMQ)
Notification Service: consume → gửi email xác nhận
Card Service: consume → tạo card records
```

**Liên quan:** Message Broker, Producer, Consumer, Async, Decoupling

---

### Producer / Consumer

**Định nghĩa:**
- **Producer:** Service gửi (publish) message lên message broker.
- **Consumer:** Service nhận (subscribe/consume) message từ broker để xử lý.

**Thực tế:** Card Service (producer) publish "card.created" → RabbitMQ → Notification Service (consumer) nhận và gửi email.

**Ví dụ:**
```java
// Producer
rabbitTemplate.convertAndSend("card.exchange", "card.created", event);

// Consumer
@RabbitListener(queues = "card.created.notification.queue")
public void handle(CardCreatedEvent event) { ... }
```

**Liên quan:** Message Broker, Event-Driven, RabbitMQ, Kafka

---

### Synchronous vs Asynchronous (Đồng bộ vs Bất đồng bộ)

**Định nghĩa:**
- **Synchronous:** Gọi và chờ response ngay. Blocking — phải đợi xong mới tiếp tục.
- **Asynchronous:** Gửi đi rồi tiếp tục làm việc khác. Không chờ — kết quả xử lý sau.

**Thực tế:**
- Sync: Card Service gọi User Service lấy tên user → chờ response → tiếp tục render card.
- Async: Order Service publish "OrderPaid" → tiếp tục trả response cho client → Notification Service xử lý email sau.

**Ví dụ:**
```
Sync:  A ──request──> B ──response──> A tiếp tục (phải chờ B)
Async: A ──publish──> Broker ──> A tiếp tục ngay (B xử lý sau)
```

**Liên quan:** Feign Client (sync), Message Broker (async), Event-Driven

---

### Immutable (Bất biến)

**Định nghĩa:** Object không thể thay đổi sau khi tạo. Muốn "thay đổi" → tạo object mới.

**Thực tế:** Java Record, TypeScript `readonly`, `as const` — đảm bảo data không bị modify bất ngờ, dễ debug, thread-safe.

**Ví dụ:**
```java
// Java Record — immutable
public record CardResponse(Long id, String title) {}
// cardResponse.id = 5; → COMPILE ERROR, không thể gán lại

// TypeScript
type Config = { readonly apiUrl: string };
```

**Liên quan:** Record, DTO, Functional Programming, Thread Safety

---

### Boilerplate (Code lặp lại)

**Định nghĩa:** Code bắt buộc phải viết nhưng không chứa logic thực sự — getter, setter, constructor, toString...

**Thực tế:** Java class với 10 fields cần ~100 dòng boilerplate (getter/setter/constructor). Lombok hoặc Record giảm xuống còn ~10 dòng.

**Ví dụ:**
```java
// Boilerplate (50 dòng)
public class Card {
    private String title;
    public String getTitle() { return title; }
    public void setTitle(String t) { this.title = t; }
    // ... 10 fields x 5 dòng = 50 dòng code nhàm chán
}

// Lombok (3 dòng)
@Data
public class Card {
    private String title;
}
```

**Liên quan:** Lombok, Record, DRY (Don't Repeat Yourself)

---

### Convention over Configuration (Quy ước hơn cấu hình)

**Định nghĩa:** Triết lý: framework cung cấp default hợp lý, developer chỉ cần config khi muốn khác default.

**Thực tế:** Spring Boot tự config DataSource nếu thấy PostgreSQL driver trong classpath. Bạn chỉ cần cung cấp URL + password, không cần config bean thủ công.

**Ví dụ:** Đặt file `application.yml` trong `src/main/resources/` → Spring Boot tự đọc. Không cần chỉ định đường dẫn.

**Liên quan:** Spring Boot, Framework, Configuration

---

### Annotation (Chú thích)

**Định nghĩa:** Metadata gắn vào code (class, method, field) bằng `@` — framework đọc annotations để biết phải xử lý code đó như thế nào.

**Thực tế:** `@RestController` → Spring biết class này là API controller. `@NotBlank` → validation framework biết field này không được rỗng.

**Ví dụ:**
```java
@RestController          // "Đây là REST controller"
@RequestMapping("/api")  // "URL bắt đầu bằng /api"
public class CardController {
    
    @GetMapping("/{id}") // "GET request đến /api/{id}"
    public Card get(@PathVariable Long id) { ... }
}
```

**Liên quan:** Java, Spring, Metadata, Decorator (TypeScript tương tự)

---

### Middleware / Interceptor / Filter

**Định nghĩa:** Code chạy trước/sau mỗi request — xử lý cross-cutting concerns (logging, auth check, CORS) mà không cần viết trong mỗi endpoint.

**Thực tế:**
- **Filter (Java):** Chạy trước controller — check JWT token, add headers
- **Interceptor (Frontend):** Chạy trước/sau mỗi API call — add token, handle 401

**Ví dụ:**
```
Request → [Auth Filter: check JWT] → [Rate Limit Filter] → Controller → Response
                                                                    ↓
                                                          [Logging Filter: log response]
```

**Liên quan:** AOP, Cross-cutting Concerns, Pipeline

---

*Tài liệu này được tạo dựa trên 4 bộ skills: BE_skills.md, FE_skills.md, Testing_skills.md, API_Design_skills.md.*
*Cập nhật: Tháng 5, 2026*