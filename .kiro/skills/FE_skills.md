# React Frontend Engineer Rules

## Role
Bạn là AI Agent hỗ trợ phát triển Frontend React cho dự án Love Cards. Luôn ưu tiên code sạch, type-safe, accessible, responsive, performance tốt, đúng convention và không phá vỡ logic hiện có.

## Core Principles
- Không viết code khi chưa hiểu rõ requirement và context hiện tại.
- Không cài thêm library khi chưa được yêu cầu — ưu tiên dùng những gì đã có trong project.
- Không tạo component quá lớn — tách nhỏ khi vượt 250 dòng.
- Không đặt business logic trong component — tách ra hooks hoặc utils.
- Không sửa lan man ngoài phạm vi task.
- Luôn đảm bảo responsive (mobile-first) và accessibility cơ bản.
- TypeScript strict mode — không dùng `any`, không ignore errors.

---

## Tech Stack

| Thành phần | Công nghệ | Phiên bản | Ghi chú |
|-----------|-----------|-----------|---------|
| Framework | React | 19.x | Function components only |
| Build Tool | Vite | 8.x | Fast HMR, ESM-native |
| Ngôn ngữ | TypeScript | 5.9.x | Strict mode, no `any` |
| Styling | TailwindCSS | 4.x | Utility-first, không viết CSS custom trừ animation |
| Routing | React Router | 7.x | `createBrowserRouter` pattern |
| State (Server) | TanStack Query | 5.x | Cache, refetch, loading states |
| State (Client) | Zustand | 5.x | Cart, UI state, auth, language |
| Icons | Phosphor Icons | 2.x | `@phosphor-icons/react` |
| i18n | react-i18next | latest | Song ngữ VI/EN |
| Path alias | `@/` | - | Maps to `src/` |

---

## Project Structure (Feature-based)

```text
Frontend/src/
├── app/
│   ├── router/                    # Route definitions, guards
│   │   ├── index.tsx              # createBrowserRouter config
│   │   ├── ProtectedRoute.tsx     # Auth guard
│   │   └── AdminRoute.tsx         # Admin guard
│   ├── store/                     # Zustand stores (global client state)
│   │   ├── useAuthStore.ts
│   │   ├── useCartStore.ts
│   │   ├── useLanguageStore.ts
│   │   └── useUIStore.ts
│   └── providers/                 # Context providers
│       ├── QueryProvider.tsx       # TanStack Query
│       ├── AuthProvider.tsx
│       └── I18nProvider.tsx
│
├── features/                      # Feature modules (domain-driven)
│   └── {feature-name}/
│       ├── components/            # Components chỉ dùng trong feature này
│       ├── hooks/                 # Custom hooks cho feature
│       ├── pages/                 # Page components (route-level)
│       ├── services/              # API calls cho feature (TanStack Query)
│       ├── types/                 # Types riêng cho feature
│       └── utils/                 # Utils riêng cho feature
│
├── shared/
│   ├── components/                # Reusable UI components
│   │   ├── {ComponentName}/
│   │   │   ├── ComponentName.tsx
│   │   │   ├── types.ts          # (nếu cần)
│   │   │   └── index.ts          # barrel export
│   │   └── ...
│   ├── hooks/                     # Shared custom hooks
│   ├── services/
│   │   ├── api.ts                 # Axios/fetch instance + interceptors
│   │   └── endpoints.ts          # API endpoint constants
│   ├── utils/                     # Shared utilities
│   └── types/                     # Shared TypeScript types
│
├── layouts/                       # Layout components
│   ├── MainLayout.tsx
│   ├── AdminLayout.tsx
│   ├── Header.tsx
│   └── Footer.tsx
│
├── pages/                         # Top-level page compositions
├── assets/                        # Static assets (images, fonts)
├── styles/
│   └── globals.css                # TailwindCSS imports + global styles
├── main.tsx                       # Entry point
└── App.tsx                        # Root component
```

### Quy tắc tổ chức
- **Feature module** chứa mọi thứ liên quan đến 1 domain (components, hooks, services, types).
- **Shared** chỉ chứa những gì dùng ở >= 2 features.
- Không import ngược từ shared vào feature cụ thể.
- Không import cross-feature (feature A không import từ feature B) — dùng shared hoặc store.

---

## Coding Standards

### Component Pattern
```tsx
// ✅ Function component + named export
export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  return (
    <article className="rounded-xl border border-lightrose p-4 hover:shadow-soft transition-shadow">
      <img src={template.thumbnailUrl} alt={template.name} className="w-full aspect-[4/3] object-cover rounded-lg" />
      <h3 className="mt-3 text-lg font-semibold text-slate">{template.name}</h3>
      <p className="text-sm text-slate/60 mt-1">{template.description}</p>
      <button
        type="button"
        onClick={() => onSelect(template.id)}
        className="mt-4 w-full py-2 rounded-full bg-rose text-white font-medium hover:bg-rose/90 transition-colors"
      >
        Chọn mẫu
      </button>
    </article>
  );
}
```

### Component Rules
- Dùng **named export** (`export function`), không dùng default export (trừ pages nếu cần lazy load).
- Dùng **function declaration**, không dùng arrow function cho component.
- Props type đặt ngay trên component hoặc trong file `types.ts` cùng folder.
- Không dùng `React.FC` — khai báo props trực tiếp.
- Mỗi component 1 file, tên file = tên component (PascalCase).
- Barrel export qua `index.ts` cho shared components.

### TypeScript Rules
```tsx
// ✅ Explicit types, no `any`
type TemplateCardProps = {
  template: Template;
  onSelect: (id: string) => void;
};

// ✅ Type cho API response
type ApiResponse<T> = {
  success: boolean;
  code: string;
  message?: string;
  data: T;
  timestamp: string;
};

// ✅ Type cho paginated response
type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
};

// ❌ KHÔNG dùng
const data: any = response;
// @ts-ignore
```

### TypeScript Conventions
- Dùng `type` cho object shapes, props, API responses.
- Dùng `interface` chỉ khi cần extend hoặc declaration merging.
- Không dùng `enum` — dùng `as const` object hoặc union type.
- Export types cùng file với logic liên quan, hoặc tách `types.ts` nếu file lớn.

---

## State Management

### Zustand (Client State)
```tsx
// app/store/useCartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartState = {
  items: string[];
  addItem: (templateId: string) => void;
  removeItem: (templateId: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (templateId) =>
        set((state) => ({
          items: state.items.includes(templateId)
            ? state.items
            : [...state.items, templateId],
        })),
      removeItem: (templateId) =>
        set((state) => ({
          items: state.items.filter((id) => id !== templateId),
        })),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'lc_cart' }
  )
);
```

### TanStack Query (Server State)
```tsx
// features/catalog/hooks/useTemplates.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/services/api';

type TemplateFilter = {
  eventType?: string;
  colors?: string[];
  sort?: 'popular' | 'newest' | 'price_asc' | 'price_desc';
  page?: number;
  size?: number;
  q?: string;
};

export function useTemplates(filter: TemplateFilter) {
  return useQuery({
    queryKey: ['templates', filter],
    queryFn: () => api.get<PageResponse<Template>>('/templates', { params: filter }),
    staleTime: 5 * 60 * 1000, // 5 phút
  });
}

export function useFeaturedTemplates() {
  return useQuery({
    queryKey: ['templates', 'featured'],
    queryFn: () => api.get<Template[]>('/templates/featured'),
    staleTime: 15 * 60 * 1000, // 15 phút
  });
}
```

### State Management Rules
- **Server state** (API data) → TanStack Query. Không lưu API data vào Zustand.
- **Client state** (UI, cart, auth token, language) → Zustand.
- **Form state** → React state local hoặc form library (nếu form phức tạp).
- **URL state** (filters, pagination) → URL search params (React Router).
- Không dùng `useContext` cho global state — dùng Zustand.
- Không dùng `useReducer` cho complex state — dùng Zustand.

---

## API Integration

### API Client Setup
```tsx
// shared/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.lovecards.vn/v1';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = useAuthStore.getState().accessToken;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  if (response.status === 401) {
    // Try refresh token
    const refreshed = await refreshToken();
    if (!refreshed) {
      useAuthStore.getState().logout();
      window.location.href = '/dang-nhap';
      throw new Error('Session expired');
    }
    // Retry original request
    return request<T>(endpoint, options);
  }

  if (!response.ok) {
    const error = await response.json();
    throw new ApiError(response.status, error.code, error.message);
  }

  return response.json();
}

export const api = {
  get: <T>(url: string, params?: Record<string, unknown>) => request<T>(url + toQueryString(params)),
  post: <T>(url: string, body?: unknown) => request<T>(url, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(url: string, body?: unknown) => request<T>(url, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(url: string) => request<T>(url, { method: 'DELETE' }),
};
```

### API Rules
- Mọi API call phải qua `api` instance (không gọi `fetch` trực tiếp).
- API response type phải được khai báo rõ ràng.
- Error handling tập trung tại interceptor, component chỉ handle UI state.
- Không hardcode API URL — dùng environment variable `VITE_API_URL`.
- Sensitive tokens lưu trong memory (Zustand), không localStorage.

---

## Styling (TailwindCSS)

### Rules
- Dùng Tailwind utility classes trực tiếp trong JSX.
- Không viết CSS custom trừ khi Tailwind không hỗ trợ (animations phức tạp, keyframes).
- Không dùng inline `style` trừ dynamic values (ví dụ: `width: ${progress}%`).
- Responsive: mobile-first (`sm:`, `md:`, `lg:`, `xl:`).
- Dark mode: chưa implement — không thêm `dark:` classes.
- Không dùng `@apply` trong CSS — viết utility trực tiếp trong component.

### Design Tokens (từ project hiện tại)
```text
Colors:
- rose          — Primary CTA, accent
- lightrose     — Borders, subtle backgrounds
- softpink      — Decorative elements
- gold          — Premium accent, badges
- cream         — Background sections
- slate         — Text primary
- slate/70      — Text secondary
- slate/60      — Text muted
- white         — Cards, backgrounds

Spacing & Sizing:
- Container: max-w-7xl mx-auto px-4 sm:px-6
- Section padding: py-16 sm:py-20 lg:py-24
- Card border-radius: rounded-xl
- Button border-radius: rounded-full

Typography:
- Headings: font-serif font-bold
- Body: font-light hoặc default
- Small text: text-sm

Effects:
- shadow-soft    — Subtle card shadow
- shadow-card    — Card elevation
- hover:-translate-y-1 — Lift on hover
- transition-all — Smooth transitions
```

### Responsive Breakpoints
```text
- Mobile: < 640px (default, no prefix)
- Tablet: sm: (640px+)
- Desktop: md: (768px+)
- Large: lg: (1024px+)
- XL: xl: (1280px+)
```

---

## Routing

### Pattern
```tsx
// app/router/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('@/pages/HomePage'));
const CatalogPage = lazy(() => import('@/features/catalog/pages/CatalogPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Suspense fallback={<PageSkeleton />}><HomePage /></Suspense> },
      { path: 'mau-thiep', element: <Suspense fallback={<PageSkeleton />}><CatalogPage /></Suspense> },
      { path: 'mau-thiep/:slug', element: <Suspense fallback={<PageSkeleton />}><TemplateDetailPage /></Suspense> },
    ],
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
    children: [
      { path: 'thiep', element: <MyCardsPage /> },
      { path: 'thiep/:id/chinh-sua', element: <CustomizePage /> },
    ],
  },
]);
```

### Routing Rules
- URL paths dùng tiếng Việt không dấu, kebab-case: `/mau-thiep`, `/gio-hang`, `/dang-nhap`.
- Lazy load pages với `React.lazy` + `Suspense`.
- Protected routes dùng guard component.
- Không nested routes quá 3 cấp.

---

## Custom Hooks

### Pattern
```tsx
// shared/hooks/useDebounce.ts
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
```

### Hook Rules
- Prefix `use` bắt buộc.
- Mỗi hook 1 file, tên file = tên hook (camelCase).
- Hook chỉ chứa logic, không chứa JSX.
- Feature-specific hooks đặt trong `features/{name}/hooks/`.
- Shared hooks đặt trong `shared/hooks/` + barrel export qua `index.ts`.
- Cleanup side effects trong `useEffect` return.

---

## Error Handling (Frontend)

### API Error Handling
```tsx
// shared/services/errors.ts
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    public userMessage: string,
  ) {
    super(userMessage);
  }
}

// Error mapping theo ngôn ngữ
const ERROR_MESSAGES: Record<string, string> = {
  AUTH_INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng',
  AUTH_EMAIL_EXISTS: 'Email đã được sử dụng',
  CART_MAX_ITEMS: 'Giỏ hàng đã đầy (tối đa 20 mẫu)',
  // ...
};
```

### Error Handling Strategy
| HTTP Code | Xử lý Frontend |
|-----------|----------------|
| 401 | Auto refresh token → retry. Nếu fail → redirect `/dang-nhap` |
| 403 | Hiển thị "Không có quyền" |
| 404 | Hiển thị 404 page |
| 422 | Hiển thị field-level validation errors |
| 429 | Hiển thị "Vui lòng thử lại sau" + disable button |
| 500 | Hiển thị "Đã xảy ra lỗi, vui lòng thử lại" |

### Error Boundary
```tsx
// shared/components/ErrorBoundary.tsx
import { Component, type ReactNode } from 'react';

type Props = { children: ReactNode; fallback?: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <DefaultErrorFallback />;
    }
    return this.props.children;
  }
}
```

---

## Performance

### Rules
- Lazy load pages và heavy components.
- Dùng `React.memo` chỉ khi component re-render không cần thiết (đo trước khi optimize).
- Images: dùng `loading="lazy"`, `width`/`height` attributes, WebP format.
- Lists lớn (>50 items): dùng virtualization (react-window hoặc tương tự).
- Không fetch data trong component mount nếu có thể prefetch.
- TanStack Query `staleTime` phù hợp: templates 5-15 phút, user data 1 phút.
- Bundle splitting: mỗi route là 1 chunk (Vite tự xử lý với lazy import).

### Image Optimization
```tsx
// ✅ Đúng
<img
  src={template.thumbnailUrl}
  alt={template.name}
  loading="lazy"
  width={400}
  height={300}
  className="w-full aspect-[4/3] object-cover rounded-lg"
/>

// ❌ Sai — thiếu alt, thiếu lazy, thiếu dimensions
<img src={url} className="w-full" />
```

---

## Accessibility (a11y)

### Rules
- Mọi `<img>` phải có `alt` text có nghĩa.
- Mọi interactive element phải có `aria-label` nếu không có visible text.
- Dùng semantic HTML: `<section>`, `<article>`, `<nav>`, `<main>`, `<header>`, `<footer>`.
- Buttons dùng `<button type="button">`, links dùng `<a>`.
- Form inputs phải có `<label>` hoặc `aria-label`.
- Focus visible: không remove outline, dùng `focus-visible:ring-2`.
- Color contrast: text trên background phải đạt WCAG AA (4.5:1).
- Keyboard navigation: mọi action phải accessible bằng keyboard.

```tsx
// ✅ Accessible button
<button
  type="button"
  onClick={handleClose}
  aria-label="Đóng modal"
  className="p-2 rounded-full hover:bg-slate/10 focus-visible:ring-2 ring-rose"
>
  <X size={20} />
</button>

// ✅ Accessible form
<label htmlFor="email" className="text-sm font-medium text-slate">
  Email
</label>
<input
  id="email"
  type="email"
  required
  aria-describedby="email-error"
  className="w-full px-4 py-3 rounded-lg border border-lightrose focus:border-rose focus:ring-1 ring-rose outline-none"
/>
{error && <p id="email-error" role="alert" className="text-sm text-red-500 mt-1">{error}</p>}
```

---

## Internationalization (i18n)

### Rules
- Mọi UI text phải dùng translation key, không hardcode tiếng Việt trong component.
- Translation files: `public/locales/{lang}/translation.json`.
- Namespace theo feature nếu file lớn.
- User-generated content (tên sự kiện, lời chúc) không dịch.
- Default language: `vi`.
- Language toggle lưu trong Zustand + localStorage.

```tsx
// ✅ Đúng
import { useTranslation } from 'react-i18next';

export function HeroSection() {
  const { t } = useTranslation();
  return <h1>{t('home.hero.title')}</h1>;
}

// ❌ Sai — hardcode text
export function HeroSection() {
  return <h1>Khám phá những mẫu thiệp cưới đẹp</h1>;
}
```

---

## Form Handling

### Pattern
```tsx
import { useState, type FormEvent } from 'react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const validationErrors = validate({ email, password });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await login({ email, password });
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        setErrors(err.fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* fields */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
      </button>
    </form>
  );
}
```

### Form Rules
- Validate client-side trước khi gửi API.
- Hiển thị field-level errors ngay dưới input.
- Disable submit button khi đang loading.
- Dùng `noValidate` trên form để tự handle validation.
- Password fields: `type="password"` + toggle visibility button.

---

## Testing (khi được yêu cầu)

### Stack
- Unit test: Vitest
- Component test: React Testing Library
- E2E: Playwright (nếu cần)

### Rules
- Test behavior, không test implementation details.
- Mỗi component test: render + user interaction + expected output.
- Mock API calls, không mock internal hooks.
- Test file đặt cạnh component: `ComponentName.test.tsx`.

---

## Environment Variables

```text
VITE_API_URL=https://api.lovecards.vn/v1
VITE_APP_URL=https://lovecards.vn
VITE_GOOGLE_CLIENT_ID=xxx
VITE_FACEBOOK_APP_ID=xxx
```

### Rules
- Prefix `VITE_` bắt buộc cho biến dùng trong client code.
- Không commit `.env` files — dùng `.env.example` làm template.
- Không hardcode secrets trong code.
- Access qua `import.meta.env.VITE_*`.

---

## Forbidden Actions

AI Agent KHÔNG được:
- Dùng `any` type.
- Dùng `// @ts-ignore` hoặc `// @ts-expect-error` (trừ khi có lý do rõ ràng và comment giải thích).
- Cài thêm library mà chưa được yêu cầu.
- Viết inline CSS (`style={{}}`) khi Tailwind có thể xử lý.
- Dùng `useEffect` để sync state (derived state nên tính trực tiếp).
- Tạo component class (chỉ dùng function components).
- Hardcode text tiếng Việt trong component (phải dùng i18n).
- Import cross-feature (feature A import từ feature B).
- Đặt API call trực tiếp trong component (phải qua hook/service).
- Bỏ qua accessibility (thiếu alt, aria-label, semantic HTML).
- Dùng `index` làm key trong list render (trừ static list không thay đổi).
- Commit `console.log` — xóa trước khi hoàn thành task.

---

## Checklist trước khi hoàn thành task

- [ ] TypeScript không có errors (`tsc -b` pass).
- [ ] ESLint không có errors (`npm run lint` pass).
- [ ] Component responsive trên mobile/tablet/desktop.
- [ ] Accessibility: semantic HTML, alt text, aria-labels, keyboard navigation.
- [ ] Loading states được handle (skeleton/spinner).
- [ ] Error states được handle (error message, retry button).
- [ ] Empty states được handle (khi data rỗng).
- [ ] Không có `any` type, không có `@ts-ignore`.
- [ ] Không có `console.log` còn sót.
- [ ] Imports dùng path alias `@/` (không relative path vượt 2 cấp).
- [ ] Component tách nhỏ hợp lý (< 150 dòng).
- [ ] Text UI dùng i18n keys (không hardcode).
- [ ] API integration qua shared service, có error handling.
- [ ] Performance: lazy load nếu cần, images có lazy + dimensions.
