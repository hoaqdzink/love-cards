# Testing Strategy & Convention Rules

## Role
Bạn là AI Agent hỗ trợ viết test cho dự án Love Cards. Đảm bảo test có giá trị thực tế, dễ maintain, chạy nhanh, và cover đúng logic quan trọng — không viết test cho có.

## Core Principles
- Test behavior, không test implementation details.
- Mỗi test phải trả lời được: "Nếu test này fail, nghĩa là cái gì bị hỏng?"
- Không viết test cho getter/setter, constructor, hoặc code trivial.
- Test phải độc lập — không phụ thuộc thứ tự chạy, không share state.
- Test phải deterministic — chạy 100 lần cho cùng kết quả.
- Ưu tiên readability: người đọc hiểu test đang kiểm tra gì trong 5 giây.
- **Test mới** phải có comment mô tả hành vi / luồng — xem [Comment trong test](#comment-trong-test).

---

## Comment trong test

| Loại | Comment ở đâu | Nội dung |
|------|---------------|----------|
| **Unit (Vitest/JUnit)** | Trên `describe` / `@DisplayName` | Feature + điều kiện setup |
| **Unit** | Trên `it` / `@Test` | Hành vi mong đợi khi pass |
| **E2E (Playwright)** | `test.step('…')` | Bước luồng người dùng (tiếng Việt OK) |
| **Fixture/mock** | Đầu file helper | API nào được mock, vì sao không dùng backend thật |

Không comment dòng assert hiển nhiên (`expect(x).toBe(1)`).

---

## Test Pyramid

```text
         
        ╱        ╲
       ╱     E2E  ╲          ← Ít nhất, chạy chậm nhất, cover critical flows
      ╱────────────╲
     ╱  Integration ╲      ← Vừa phải, test API + DB thật
    ╱────────────────╲
   ╱   Unit Tests     ╲   ← Nhiều nhất, chạy nhanh nhất
  ╱════════════════════╲
```

| Level       | Scope                          | Speed   | Khi nào viết                        |
|-------------|--------------------------------|---------|-------------------------------------|
| Unit        | 1 function/class, mock deps    | < 50ms  | Mọi service method, util, hook      |
| Integration | API endpoint + DB + cache      | < 2s    | Mọi controller endpoint             |
| E2E         | Full user flow qua UI          | < 30s   | Critical paths (mua thiệp, auth)    |

---

## Backend Testing (Java/Spring Boot)

### Unit Test Convention

```java
@ExtendWith(MockitoExtension.class)
class CardServiceImplTest {

    @Mock private CardRepository cardRepository;
    @Mock private CardMapper cardMapper;
    @InjectMocks private CardServiceImpl cardService;

    @Test
    void createCard_withValidRequest_shouldSaveAndReturnResponse() {
        // Given
        var request = new CreateCardRequest("Title", "Content", 1L);
        var entity = Card.builder().id(1L).title("Title").build();
        var expected = new CardResponse(1L, "Title", "Content", "Template", LocalDateTime.now());

        when(cardMapper.toEntity(request)).thenReturn(entity);
        when(cardRepository.save(entity)).thenReturn(entity);
        when(cardMapper.toResponse(entity)).thenReturn(expected);

        // When
        var result = cardService.createCard(request, "user-123");

        // Then
        assertThat(result.id()).isEqualTo(1L);
        assertThat(result.title()).isEqualTo("Title");
        verify(cardRepository).save(entity);
    }

    @Test
    void createCard_withDuplicateTitle_shouldThrowConflictException() {
        // Given
        var request = new CreateCardRequest("Existing", "Content", 1L);
        when(cardRepository.existsByTitle("Existing")).thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> cardService.createCard(request, "user-123"))
            .isInstanceOf(ConflictException.class)
            .hasMessageContaining("already exists");
    }
}
```

### Integration Test Convention

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Testcontainers
@ActiveProfiles("test")
class CardControllerIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");

    @Container
    static GenericContainer<?> redis = new GenericContainer<>("redis:7").withExposedPorts(6379);

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.data.redis.host", redis::getHost);
        registry.add("spring.data.redis.port", () -> redis.getMappedPort(6379));
    }

    @Autowired private MockMvc mockMvc;
    @Autowired private CardRepository cardRepository;

    @BeforeEach
    void setUp() {
        cardRepository.deleteAll();
    }

    @Test
    void getCards_shouldReturnPaginatedList() throws Exception {
        // Given
        cardRepository.saveAll(List.of(
            Card.builder().title("Card 1").userId("user-1").build(),
            Card.builder().title("Card 2").userId("user-1").build()
        ));

        // When & Then
        mockMvc.perform(get("/api/v1/cards")
                .header("X-User-Id", "user-1")
                .param("page", "0")
                .param("size", "10"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.content").isArray())
            .andExpect(jsonPath("$.data.content.length()").value(2))
            .andExpect(jsonPath("$.data.totalElements").value(2));
    }

    @Test
    void createCard_withoutAuth_shouldReturn401() throws Exception {
        mockMvc.perform(post("/api/v1/cards")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"title": "Test", "content": "Hello", "templateId": 1}
                    """))
            .andExpect(status().isUnauthorized());
    }
}
```

### Backend Test Rules

| Rule                                    | Giải thích                                              |
|-----------------------------------------|---------------------------------------------------------|
| Tên test: `method_condition_expected`   | Rõ ràng, đọc tên biết test gì                          |
| Dùng Given/When/Then structure          | Dễ đọc, tách biệt setup/action/assertion               |
| Mock external dependencies              | DB, API bên ngoài, message broker                       |
| Integration test dùng Testcontainers    | DB thật, không H2 (behavior khác PostgreSQL)            |
| Mỗi test class cho 1 service/controller | Không gộp nhiều class vào 1 test file                   |
| `@ActiveProfiles("test")`              | Dùng config riêng cho test                              |
| `@BeforeEach` cleanup                  | Đảm bảo test độc lập                                   |
| Không test private methods              | Test qua public interface                               |
| AssertJ over JUnit assertions           | Fluent API, readable hơn                                |

### Coverage Target

| Layer      | Target | Ghi chú                                |
|------------|--------|----------------------------------------|
| Service    | >= 80% | Business logic quan trọng nhất         |
| Controller | >= 70% | Integration test cover                 |
| Repository | Không cần unit test | Spring Data tự generate, test qua integration |
| Mapper     | >= 90% | Logic mapping phải chính xác           |
| Utils      | >= 90% | Pure functions, dễ test                |

---

## Frontend Testing (React/TypeScript)

### Stack

| Tool                  | Mục đích                    |
|-----------------------|-----------------------------|
| Vitest                | Test runner (fast, Vite-native) |
| React Testing Library | Component testing           |
| MSW (Mock Service Worker) | Mock API calls          |
| Playwright            | E2E testing (nếu cần)      |

### Component Test Convention

```tsx
// features/catalog/components/TemplateCard.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TemplateCard } from './TemplateCard';

const mockTemplate = {
  id: '1',
  name: 'Rose Garden',
  description: 'Mẫu thiệp hoa hồng',
  thumbnailUrl: '/images/rose.jpg',
  price: 99000,
};

describe('TemplateCard', () => {
  it('renders template name and description', () => {
    render(<TemplateCard template={mockTemplate} onSelect={vi.fn()} />);

    expect(screen.getByText('Rose Garden')).toBeInTheDocument();
    expect(screen.getByText('Mẫu thiệp hoa hồng')).toBeInTheDocument();
  });

  it('calls onSelect with template id when button clicked', async () => {
    const onSelect = vi.fn();
    render(<TemplateCard template={mockTemplate} onSelect={onSelect} />);

    await userEvent.click(screen.getByRole('button', { name: /chọn mẫu/i }));

    expect(onSelect).toHaveBeenCalledWith('1');
  });

  it('displays formatted price', () => {
    render(<TemplateCard template={mockTemplate} onSelect={vi.fn()} />);

    expect(screen.getByText('99.000₫')).toBeInTheDocument();
  });
});
```

### Hook Test Convention

```tsx
// shared/hooks/useDebounce.test.ts
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 500));
    expect(result.current).toBe('hello');
  });

  it('updates value after delay', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: 'hello' } }
    );

    rerender({ value: 'world' });
    expect(result.current).toBe('hello'); // chưa update

    act(() => { vi.advanceTimersByTime(500); });
    expect(result.current).toBe('world'); // đã update
  });
});
```

### API Integration Test (MSW)

```tsx
// features/catalog/hooks/useTemplates.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { useTemplates } from './useTemplates';

const server = setupServer(
  http.get('*/templates', () => {
    return HttpResponse.json({
      success: true,
      data: {
        content: [{ id: '1', name: 'Rose Garden' }],
        totalElements: 1,
        totalPages: 1,
        currentPage: 0,
      },
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe('useTemplates', () => {
  it('fetches templates successfully', async () => {
    const { result } = renderHook(() => useTemplates({ page: 0, size: 12 }), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.content).toHaveLength(1);
    expect(result.current.data?.content[0].name).toBe('Rose Garden');
  });
});
```

### Frontend Test Rules

| Rule                                    | Giải thích                                              |
|-----------------------------------------|---------------------------------------------------------|
| Query by role/label, không by class/id  | Accessible queries = test giống user thật               |
| `userEvent` over `fireEvent`            | Simulate thực tế hơn (typing, clicking)                |
| Test file cạnh component                | `Component.test.tsx` cùng folder                       |
| Mock API bằng MSW, không mock fetch     | Test gần thực tế hơn                                   |
| Không test styling/CSS classes          | Brittle, thay đổi liên tục                             |
| Không test third-party library          | Test behavior của code mình viết                       |
| `describe` group by component/feature   | Tổ chức rõ ràng                                        |
| Mỗi `it` test 1 behavior               | Không gộp nhiều assertions không liên quan             |

---

## Test Naming Convention

### Backend (Java)
```text
methodName_condition_expectedResult

Ví dụ:
- createCard_withValidRequest_shouldSaveAndReturnResponse
- createCard_withDuplicateTitle_shouldThrowConflictException
- getCards_withNoAuth_shouldReturn401
- publishCard_withMissingFields_shouldReturn422
```

### Frontend (TypeScript)
```text
Dùng ngôn ngữ tự nhiên, mô tả behavior:

Ví dụ:
- "renders template name and description"
- "calls onSelect with template id when button clicked"
- "shows loading spinner while fetching"
- "displays error message on API failure"
- "disables submit button when form is invalid"
```

---

## What to Test / What NOT to Test

### ✅ Nên test

| Backend                          | Frontend                              |
|----------------------------------|---------------------------------------|
| Service business logic           | User interactions (click, type, submit) |
| Validation rules                 | Conditional rendering                 |
| Error handling paths             | Loading/error/empty states            |
| State transitions                | Form validation feedback              |
| Event publishing                 | Navigation/routing                    |
| Authorization checks             | API integration (via MSW)             |
| Edge cases (null, empty, max)    | Custom hooks logic                    |

### ❌ Không test

| Backend                          | Frontend                              |
|----------------------------------|---------------------------------------|
| Getter/setter                    | CSS classes/styling                   |
| Spring framework internals       | Third-party library behavior          |
| Private methods                  | Implementation details (state shape)  |
| Config classes (trừ khi có logic)| Static content không thay đổi         |
| Generated code (MapStruct output)| Console.log, debug code               |

---

## Test Data

### Factory Pattern (Backend)
```java
public class TestDataFactory {
    public static CreateCardRequest validCardRequest() {
        return new CreateCardRequest("Wedding Card", "Beautiful content", 1L);
    }

    public static Card cardEntity(String userId) {
        return Card.builder()
            .id(UUID.randomUUID())
            .userId(userId)
            .title("Test Card")
            .status("DRAFT")
            .createdAt(LocalDateTime.now())
            .build();
    }
}
```

### Factory Pattern (Frontend)
```tsx
// test/factories.ts
export function createMockTemplate(overrides?: Partial<Template>): Template {
  return {
    id: '1',
    name: 'Rose Garden',
    slug: 'rose-garden',
    description: 'Beautiful rose template',
    eventType: 'wedding',
    price: 99000,
    thumbnailUrl: '/images/rose.jpg',
    previewUrl: '/previews/rose.html',
    ...overrides,
  };
}
```

---

## CI Integration

```yaml
# GitHub Actions
test:
  runs-on: ubuntu-latest
  steps:
    - name: Backend tests
      run: ./mvnw test -pl card-service
      
    - name: Frontend tests
      run: npm run test -- --run --coverage
      working-directory: Frontend

    - name: Check coverage
      run: |
        # Fail if coverage < threshold
        npm run test -- --run --coverage --coverageReporters=text-summary
```

---

## Forbidden Actions

AI Agent KHÔNG được:
- Viết test không có assertion (test chạy pass nhưng không kiểm tra gì).
- Test implementation details (internal state, private methods).
- Dùng `Thread.sleep()` trong test — dùng `await`/`waitFor`/`Awaitility`.
- Hardcode dates/times — dùng clock injection hoặc relative time.
- Viết test phụ thuộc network/external service thật.
- Skip test bằng `@Disabled`/`it.skip` mà không có comment giải thích.
- Viết test quá 30 dòng — tách helper hoặc factory.
- Copy-paste test chỉ đổi 1 param — dùng parameterized test.
