# Spring Boot Microservices Backend Engineer Rules

## Role
Bạn là AI Agent hỗ trợ phát triển Backend Java Spring Boot theo kiến trúc Microservices. Luôn ưu tiên code sạch, bảo mật, dễ bảo trì, có test, đúng convention, không phá vỡ logic hiện có và đảm bảo tính độc lập giữa các service.

## Core Principles
- Không viết code khi chưa hiểu rõ requirement.
- Không hardcode config, secret, token, password — dùng environment variables hoặc config server.
- Không bỏ qua validation, exception handling và logging.
- Không tạo logic phức tạp trong Controller — Controller chỉ nhận request, gọi service, trả response.
- Không sửa lan man ngoài phạm vi task.
- Luôn đảm bảo code có thể test và maintain.
- Mỗi microservice phải có bounded context rõ ràng, không chia sẻ database.
- Giao tiếp giữa services qua REST (synchronous) hoặc Message Broker (asynchronous).
- Luôn thiết kế API theo nguyên tắc backward-compatible.

---

## Microservices Architecture Overview

```text
┌─────────────────────────────────────────────────────────┐
│                    API Gateway                           │
│              (Spring Cloud Gateway)                      │
└──────────┬──────────┬──────────┬───────────┬────────────┘
           │          │          │           │
     ┌─────▼───┐ ┌───▼────┐ ┌──▼────┐ ┌────▼─────┐
     │ Auth    │ │ Card   │ │ User  │ │ Payment  │  ...
     │ Service │ │ Service│ │Service│ │ Service  │
     └────┬────┘ └───┬────┘ └──┬────┘ └────┬─────┘
          │          │          │           │
     ┌────▼────┐ ┌───▼────┐ ┌──▼────┐ ┌────▼─────┐
     │  DB     │ │  DB    │ │  DB   │ │   DB     │
     └─────────┘ └────────┘ └───────┘ └──────────┘
           │          │          │           │
           └──────────┴──────────┴───────────┘
                          │
                 ┌────────▼────────┐
                 │  Message Broker  │
                 │ (RabbitMQ/Kafka) │
                 └─────────────────┘
```

### Thành phần hạ tầng chung
| Component | Technology | Mục đích |
|-----------|-----------|----------|
| API Gateway | Spring Cloud Gateway | Routing, rate limiting, authentication filter |
| Service Discovery | Eureka / Consul | Đăng ký và tìm kiếm service |
| Config Server | Spring Cloud Config | Quản lý config tập trung |
| Message Broker | RabbitMQ / Kafka | Async communication giữa services |
| Distributed Tracing | Micrometer + Zipkin/Jaeger | Trace request xuyên suốt services |
| Circuit Breaker | Resilience4j | Fault tolerance, fallback |
| Centralized Logging | ELK Stack / Loki | Aggregated logs |

---

## Project Structure (Per Microservice)

Mỗi microservice là một module/project độc lập với cấu trúc:

```text
com.AVi.loved_card.{service_name}
├── config/                  # Bean config, Security config, Feign config
├── controller/              # REST endpoints (chỉ orchestrate, không chứa logic)
├── service/                 # Interface định nghĩa business logic
├── service/impl/            # Implementation của service
├── repository/              # Spring Data JPA repositories
├── entity/                  # JPA entities (internal, không expose ra ngoài)
├── dto/
│   ├── request/             # Request DTOs (có validation annotations)
│   ├── response/            # Response DTOs
│   └── event/               # Event DTOs cho async messaging
├── mapper/                  # MapStruct mappers (Entity <-> DTO)
├── exception/               # Custom exceptions + GlobalExceptionHandler
├── client/                  # Feign clients gọi sang service khác
├── messaging/
│   ├── producer/            # Message publishers
│   └── consumer/            # Message listeners
├── security/                # Security filters, JWT utils (nếu cần)
├── util/                    # Utility classes
├── constant/                # Constants, enums
└── aspect/                  # AOP aspects (logging, auditing)
```

### Multi-module Maven/Gradle Structure (nếu dùng monorepo)

```text
love-cards-backend/
├── pom.xml (parent)
├── common-lib/                    # Shared DTOs, utils, exceptions
│   └── src/main/java/com/AVi/loved_card/common/
├── api-gateway/
├── service-discovery/
├── config-server/
├── auth-service/
├── user-service/
├── card-service/
├── payment-service/
├── notification-service/
└── docker-compose.yml
```

---

## Coding Standards

### Controller Layer
```java
@RestController
@RequestMapping("/api/v1/cards")
@RequiredArgsConstructor
@Tag(name = "Card", description = "Card management APIs")
public class CardController {

    private final CardService cardService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CardResponse> createCard(
            @Valid @RequestBody CreateCardRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(cardService.createCard(request, principal.getUserId()));
    }
}
```

### Service Layer
```java
public interface CardService {
    CardResponse createCard(CreateCardRequest request, String userId);
    Page<CardResponse> getCards(CardFilterRequest filter, Pageable pageable);
}

@Service
@RequiredArgsConstructor
@Slf4j
public class CardServiceImpl implements CardService {

    private final CardRepository cardRepository;
    private final CardMapper cardMapper;
    private final CardEventProducer eventProducer;

    @Override
    @Transactional
    public CardResponse createCard(CreateCardRequest request, String userId) {
        log.info("Creating card for user: {}", userId);
        Card card = cardMapper.toEntity(request);
        card.setUserId(userId);
        card = cardRepository.save(card);
        
        // Publish event cho các service khác
        eventProducer.publishCardCreated(new CardCreatedEvent(card.getId(), userId));
        
        return cardMapper.toResponse(card);
    }
}
```

### DTO với Validation
```java
public record CreateCardRequest(
    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must not exceed 100 characters")
    String title,

    @NotBlank(message = "Content is required")
    @Size(max = 5000)
    String content,

    @NotNull(message = "Template ID is required")
    Long templateId
) {}

public record CardResponse(
    Long id,
    String title,
    String content,
    String templateName,
    LocalDateTime createdAt
) {}
```

### Global Exception Handling
```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiResponse<Void> handleNotFound(ResourceNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());
        return ApiResponse.error("NOT_FOUND", ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = ex.getBindingResult().getFieldErrors().stream()
            .collect(Collectors.toMap(
                FieldError::getField,
                FieldError::getDefaultMessage,
                (a, b) -> a
            ));
        return ApiResponse.error("VALIDATION_FAILED", "Validation failed", errors);
    }

    @ExceptionHandler(FeignException.class)
    public ResponseEntity<ApiResponse<Void>> handleFeignException(FeignException ex) {
        log.error("Feign client error: status={}, message={}", ex.status(), ex.getMessage());
        HttpStatus status = HttpStatus.resolve(ex.status());
        return ResponseEntity.status(status != null ? status : HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.error("SERVICE_ERROR", "Downstream service error"));
    }
}
```

### Standardized API Response
```java
@Data
@Builder
public class ApiResponse<T> {
    private boolean success;
    private String code;
    private String message;
    private T data;
    private LocalDateTime timestamp;

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
            .success(true)
            .code("SUCCESS")
            .data(data)
            .timestamp(LocalDateTime.now())
            .build();
    }

    public static <T> ApiResponse<T> error(String code, String message) {
        return ApiResponse.<T>builder()
            .success(false)
            .code(code)
            .message(message)
            .timestamp(LocalDateTime.now())
            .build();
    }
}
```

---

## Inter-Service Communication

### Synchronous (Feign Client)
```java
@FeignClient(name = "user-service", fallbackFactory = UserClientFallbackFactory.class)
public interface UserClient {

    @GetMapping("/api/v1/users/{userId}")
    ApiResponse<UserResponse> getUserById(@PathVariable String userId);
}

@Component
@Slf4j
public class UserClientFallbackFactory implements FallbackFactory<UserClient> {
    @Override
    public UserClient create(Throwable cause) {
        return userId -> {
            log.error("Fallback for getUserById: {}", cause.getMessage());
            return ApiResponse.error("SERVICE_UNAVAILABLE", "User service is unavailable");
        };
    }
}
```

### Asynchronous (Event-Driven)
```java
// Producer
@Component
@RequiredArgsConstructor
public class CardEventProducer {

    private final RabbitTemplate rabbitTemplate;

    public void publishCardCreated(CardCreatedEvent event) {
        rabbitTemplate.convertAndSend(
            "card.exchange",
            "card.created",
            event
        );
    }
}

// Consumer (trong notification-service)
@Component
@Slf4j
@RequiredArgsConstructor
public class CardEventConsumer {

    private final NotificationService notificationService;

    @RabbitListener(queues = "card.created.notification.queue")
    public void handleCardCreated(CardCreatedEvent event) {
        log.info("Received card created event: cardId={}", event.cardId());
        notificationService.sendCardCreatedNotification(event);
    }
}
```

---

## Resilience Patterns

### Circuit Breaker (Resilience4j)
```java
@Service
@RequiredArgsConstructor
public class CardServiceImpl implements CardService {

    private final UserClient userClient;

    @CircuitBreaker(name = "userService", fallbackMethod = "getUserFallback")
    @Retry(name = "userService")
    @TimeLimiter(name = "userService")
    public UserResponse getCardOwner(String userId) {
        return userClient.getUserById(userId).getData();
    }

    private UserResponse getUserFallback(String userId, Throwable t) {
        log.warn("Circuit breaker fallback for user: {}, reason: {}", userId, t.getMessage());
        return UserResponse.builder().id(userId).name("Unknown User").build();
    }
}
```

### Resilience4j Config (application.yml)
```yaml
resilience4j:
  circuitbreaker:
    instances:
      userService:
        sliding-window-size: 10
        failure-rate-threshold: 50
        wait-duration-in-open-state: 10s
        permitted-number-of-calls-in-half-open-state: 3
  retry:
    instances:
      userService:
        max-attempts: 3
        wait-duration: 500ms
  timelimiter:
    instances:
      userService:
        timeout-duration: 3s
```

---

## Security

### JWT Authentication Flow (Gateway Level)
```java
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter implements GatewayFilter {

    private final JwtTokenProvider tokenProvider;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String token = extractToken(exchange.getRequest());
        if (token != null && tokenProvider.validateToken(token)) {
            Claims claims = tokenProvider.getClaims(token);
            exchange.getRequest().mutate()
                .header("X-User-Id", claims.getSubject())
                .header("X-User-Roles", claims.get("roles", String.class))
                .build();
        }
        return chain.filter(exchange);
    }
}
```

### Security Rules
- JWT validation tại Gateway, truyền user info qua headers xuống downstream services.
- Downstream services trust headers từ Gateway (internal network only).
- Dùng HTTPS cho mọi external communication.
- Rate limiting tại Gateway level.
- CORS config tại Gateway, không config ở từng service.
- Sensitive endpoints cần thêm authorization check ở service level.

---

## Database & Migration

### Rules
- Mỗi service có database riêng (Database per Service pattern).
- Dùng Flyway hoặc Liquibase cho database migration.
- Không dùng `spring.jpa.hibernate.ddl-auto=update` ở production.
- Entity dùng `@CreatedDate`, `@LastModifiedDate` cho auditing.
- Dùng soft delete (`deletedAt` field) thay vì hard delete.
- Index cho các column thường query.

### Migration Example (Flyway)
```sql
-- V1__create_cards_table.sql
CREATE TABLE cards (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    template_id BIGINT NOT NULL,
    status VARCHAR(20) DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    CONSTRAINT idx_cards_user_id INDEX (user_id),
    CONSTRAINT idx_cards_status INDEX (status)
);
```

---

## Testing Strategy

### Unit Test
```java
@ExtendWith(MockitoExtension.class)
class CardServiceImplTest {

    @Mock private CardRepository cardRepository;
    @Mock private CardMapper cardMapper;
    @Mock private CardEventProducer eventProducer;
    @InjectMocks private CardServiceImpl cardService;

    @Test
    void createCard_shouldSaveAndPublishEvent() {
        // Given
        var request = new CreateCardRequest("Title", "Content", 1L);
        var entity = Card.builder().id(1L).title("Title").build();
        var response = new CardResponse(1L, "Title", "Content", "Template", LocalDateTime.now());

        when(cardMapper.toEntity(request)).thenReturn(entity);
        when(cardRepository.save(entity)).thenReturn(entity);
        when(cardMapper.toResponse(entity)).thenReturn(response);

        // When
        var result = cardService.createCard(request, "user-123");

        // Then
        assertThat(result.id()).isEqualTo(1L);
        verify(eventProducer).publishCardCreated(any(CardCreatedEvent.class));
    }
}
```

### Integration Test
```java
@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class CardControllerIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");

    @Autowired private MockMvc mockMvc;

    @Test
    void createCard_shouldReturn201() throws Exception {
        var request = """
            {"title": "My Card", "content": "Hello", "templateId": 1}
            """;

        mockMvc.perform(post("/api/v1/cards")
                .contentType(MediaType.APPLICATION_JSON)
                .content(request)
                .header("X-User-Id", "user-123"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.title").value("My Card"));
    }
}
```

### Contract Test (cho inter-service communication)
```java
// Provider side (user-service)
@Provider("user-service")
@PactBroker
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserServicePactProviderTest {

    @TestTemplate
    @ExtendWith(PactVerificationInvocationContextProvider.class)
    void verifyPact(PactVerificationContext context) {
        context.verifyInteraction();
    }
}
```

---

## Observability

### Logging Standards
```java
// Dùng structured logging
log.info("Card created successfully, cardId={}, userId={}", card.getId(), userId);
log.error("Failed to create card, userId={}, error={}", userId, ex.getMessage(), ex);

// KHÔNG log sensitive data
log.info("User authenticated: userId={}", userId); // OK
log.info("User authenticated: token={}", token);   // KHÔNG OK
```

### Distributed Tracing
```yaml
# application.yml
management:
  tracing:
    sampling:
      probability: 1.0
  zipkin:
    tracing:
      endpoint: http://zipkin:9411/api/v2/spans
```

### Health Check & Metrics
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health, info, metrics, prometheus
  endpoint:
    health:
      show-details: when-authorized
      probes:
        enabled: true  # Kubernetes liveness/readiness
```

---

## Docker & Deployment

### Dockerfile (per service)
```dockerfile
FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Docker Compose (development)
```yaml
services:
  api-gateway:
    build: ./api-gateway
    ports: ["8080:8080"]
    depends_on: [service-discovery, config-server]

  card-service:
    build: ./card-service
    environment:
      - SPRING_PROFILES_ACTIVE=docker
      - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://service-discovery:8761/eureka
    depends_on: [card-db, rabbitmq]

  card-db:
    image: postgres:15
    environment:
      POSTGRES_DB: card_db
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}

  rabbitmq:
    image: rabbitmq:3-management
    ports: ["5672:5672", "15672:15672"]
```

---

## API Versioning & Documentation

### Versioning Rules
- Dùng URL versioning: `/api/v1/`, `/api/v2/`.
- Breaking changes phải tạo version mới, giữ version cũ hoạt động trong ít nhất 1 release cycle.
- API deprecated phải đánh dấu rõ: `@Deprecated` + `@Operation(deprecated = true)`.

### Swagger/OpenAPI Config
```java
@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Card Service API")
                .version("1.0.0")
                .description("Card management microservice"))
            .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
            .components(new Components()
                .addSecuritySchemes("bearerAuth",
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")));
    }
}
```

---

## Swagger/OpenAPI Rules

### Nguyên tắc chung
- Chỉ dùng Swagger để document API, không dùng để chứa business logic.
- Giữ Controller ngắn gọn và dễ đọc.
- Không viết JSON example dài trực tiếp trong Controller.
- Không nhồi quá nhiều annotation Swagger trong endpoint.

### Controller Rule
Controller chỉ nên chứa:
- `@Tag` (class level)
- `@Operation(summary = "...")` 
- `@ApiResponse(responseCode = "...", description = "...")`
- `@Parameter` cho path/query param nếu cần
- `@SecurityRequirement` nếu API cần auth
- Không mô tả chi tiết request body trong Controller nếu DTO đã có schema.

```java
@RestController
@RequestMapping("/api/v1/cards")
@RequiredArgsConstructor
@Tag(name = "Card", description = "APIs quản lý thiệp")
public class CardController {

    private final CardService cardService;

    @Operation(summary = "Tạo thiệp mới")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponse(responseCode = "201", description = "Tạo thành công")
    @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CardResponse> createCard(
            @Valid @RequestBody CreateCardRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(cardService.createCard(request, principal.getUserId()));
    }

    @Operation(summary = "Lấy danh sách thiệp có phân trang")
    @ApiResponse(responseCode = "200", description = "Thành công")
    @GetMapping
    public ApiResponse<PageResponse<CardResponse>> getCards(
            @Parameter(description = "Trạng thái", example = "PUBLISHED")
            @RequestParam(required = false) String status,
            @Parameter(description = "Số trang", example = "0")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Số lượng mỗi trang", example = "10")
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(cardService.getCards(status, PageRequest.of(page, size)));
    }

    @Operation(summary = "Lấy chi tiết thiệp theo ID")
    @ApiResponse(responseCode = "200", description = "Thành công")
    @ApiResponse(responseCode = "404", description = "Không tìm thấy")
    @GetMapping("/{id}")
    public ApiResponse<CardResponse> getCardById(@PathVariable Long id) {
        return ApiResponse.success(cardService.getCardById(id));
    }
}
```

### DTO Documentation Rule
Schema phải mô tả tại DTO, không tại Controller:

```java
public record CreateCardRequest(
    @Schema(description = "Tiêu đề thiệp", example = "Happy Birthday", maxLength = 100)
    @NotBlank(message = "Title is required")
    @Size(max = 100)
    String title,

    @Schema(description = "Nội dung thiệp", example = "Chúc bạn sinh nhật vui vẻ!")
    @NotBlank(message = "Content is required")
    @Size(max = 5000)
    String content,

    @Schema(description = "ID template sử dụng", example = "1")
    @NotNull(message = "Template ID is required")
    Long templateId
) {}

public record CardResponse(
    @Schema(description = "ID thiệp", example = "1")
    Long id,

    @Schema(description = "Tiêu đề", example = "Happy Birthday")
    String title,

    @Schema(description = "Tên template", example = "Rose Garden")
    String templateName,

    @Schema(description = "Thời gian tạo", example = "2025-01-15T10:30:00")
    LocalDateTime createdAt
) {}
```

### Response Rule
- API response phải thống nhất format (dùng `ApiResponse<T>` wrapper).
- Các error response chung đã được xử lý tại `GlobalExceptionHandler` — **không cần khai báo lại** trong từng endpoint.
- Controller chỉ khai báo `@ApiResponse` cho response code **đặc thù** của endpoint đó (ví dụ: 201, 404 cho resource cụ thể).

### Global Error Responses (xử lý tập trung)

Khai báo 1 lần tại OpenAPI config, áp dụng cho toàn bộ API:

```java
@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info().title("Card Service API").version("1.0.0"))
            .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
            .components(new Components()
                .addSecuritySchemes("bearerAuth",
                    new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT"))
                .addSchemas("ErrorResponse", new Schema<>()
                    .description("Standard error response")
                    .addProperty("success", new Schema<>().type("boolean").example(false))
                    .addProperty("code", new Schema<>().type("string").example("VALIDATION_FAILED"))
                    .addProperty("message", new Schema<>().type("string").example("Validation failed"))
                    .addProperty("timestamp", new Schema<>().type("string").format("date-time"))));
    }
}
```

Bảng mô tả các error chung (đã handle trong `GlobalExceptionHandler`):

| HTTP Code | Error Code | Mô tả | Khi nào xảy ra |
|-----------|-----------|--------|-----------------|
| 400 | `VALIDATION_FAILED` | Dữ liệu request không hợp lệ | `@Valid` fail, thiếu field bắt buộc |
| 401 | `UNAUTHORIZED` | Chưa xác thực | Thiếu/sai JWT token |
| 403 | `ACCESS_DENIED` | Không có quyền truy cập | Role không đủ |
| 404 | `NOT_FOUND` | Resource không tồn tại | ID không tìm thấy |
| 409 | `CONFLICT` | Xung đột dữ liệu | Duplicate unique field |
| 422 | `BUSINESS_ERROR` | Lỗi nghiệp vụ | Vi phạm business rule |
| 429 | `RATE_LIMITED` | Quá nhiều request | Vượt rate limit |
| 500 | `INTERNAL_ERROR` | Lỗi hệ thống | Unexpected exception |
| 503 | `SERVICE_UNAVAILABLE` | Service downstream lỗi | Feign call fail, circuit open |

**Rule cho Controller:**
- ✅ Khai báo: response code thành công (200, 201, 204) và lỗi đặc thù cho endpoint.
- ❌ Không khai báo: 400, 401, 500 — đã có global handler.

```java
// ✅ Đúng — chỉ khai báo response đặc thù
@Operation(summary = "Lấy chi tiết thiệp")
@ApiResponse(responseCode = "200", description = "Thành công")
@ApiResponse(responseCode = "404", description = "Thiệp không tồn tại")
@GetMapping("/{id}")
public ApiResponse<CardResponse> getCardById(@PathVariable Long id) { ... }

// ❌ Sai — lặp lại error chung đã có global handler
@ApiResponse(responseCode = "400", description = "Bad request")      // KHÔNG CẦN
@ApiResponse(responseCode = "401", description = "Unauthorized")     // KHÔNG CẦN
@ApiResponse(responseCode = "500", description = "Internal error")   // KHÔNG CẦN
```

### Pagination Rule
- API phân trang không trả trực tiếp `Page<Entity>`.
- Dùng DTO wrapper cho pagination response:

```java
public record PageResponse<T>(
    @Schema(description = "Danh sách items")
    List<T> content,

    @Schema(description = "Tổng số phần tử", example = "100")
    long totalElements,

    @Schema(description = "Tổng số trang", example = "10")
    int totalPages,

    @Schema(description = "Trang hiện tại", example = "0")
    int currentPage
) {}
```

### Security Rule
- API cần xác thực phải dùng `@SecurityRequirement(name = "bearerAuth")`.
- Password/token field phải dùng `@Schema(accessMode = Schema.AccessMode.WRITE_ONLY)`.

### Enum Rule
- Enum phải có description rõ nghĩa:

```java
@Schema(description = "Trạng thái thiệp")
public enum CardStatus {
    @Schema(description = "Bản nháp, chưa công khai")
    DRAFT,

    @Schema(description = "Đã xuất bản, công khai")
    PUBLISHED,

    @Schema(description = "Đã lưu trữ, không hiển thị")
    ARCHIVED
}
```

### File Upload Rule
```java
public record UploadImageRequest(
    @Schema(type = "string", format = "binary", description = "File ảnh thiệp")
    MultipartFile file
) {}
```

### Hidden Field Rule
- Field/internal API không public phải dùng `@Hidden` hoặc `@Schema(hidden = true)`.

### DateTime Rule
- Date/time phải dùng ISO-8601 format.
- Luôn có example cho datetime field: `@Schema(example = "2025-01-15T10:30:00")`.

### Complex API Rule
- Với API/document lớn: tách sang `openapi.yaml` hoặc markdown document riêng.
- Không nhồi toàn bộ spec vào Controller.

---

### Recommended Structure (phân tách trách nhiệm)

| Layer | Chứa gì |
|-------|---------|
| Controller | endpoint, `@Operation(summary)`, response codes, `@SecurityRequirement` |
| DTO | `@Schema`, validation annotations, examples |
| Service | business logic |
| Mapper | entity ↔ dto |

### AI Agent Swagger Behavior

AI Agent phải:
- Ưu tiên DTO-level schema (document tại DTO, không tại Controller).
- Giữ Controller sạch, ngắn gọn.
- Tránh duplicate annotation.
- Tránh nested annotation dài.
- Tránh generate Swagger quá verbose.
- Ưu tiên readability và maintainability.

### Forbidden Actions

AI Agent KHÔNG được:
- Viết JSON example dài trong Controller.
- Expose Entity ra API (luôn dùng DTO).
- Duplicate Swagger config nhiều nơi.
- Thêm annotation Swagger không cần thiết.
- Biến Controller thành nơi chứa tài liệu API khổng lồ.

---

## Checklist trước khi hoàn thành task

- [ ] Code tuân thủ project structure và naming convention.
- [ ] Có validation cho mọi input (request DTOs).
- [ ] Exception handling đầy đủ, không leak stack trace ra client.
- [ ] Logging có context (userId, requestId), không log sensitive data.
- [ ] Database migration file được tạo (nếu thay đổi schema).
- [ ] Unit test cho service layer (coverage >= 80%).
- [ ] Integration test cho controller layer.
- [ ] API documentation (Swagger annotations) được cập nhật.
- [ ] Circuit breaker/fallback cho external service calls.
- [ ] Event publishing cho cross-service side effects.
- [ ] Không có circular dependency giữa services.
- [ ] Config externalized (không hardcode trong code).
- [ ] Backward-compatible nếu sửa API đang có consumer.
- [ ] Docker build thành công.
- [ ] Health check endpoint hoạt động.
