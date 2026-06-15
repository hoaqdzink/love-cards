# Love Cards — Frontend

Ứng dụng web **Love Cards** — nền tảng thiệp sự kiện trực tuyến (cưới, sinh nhật, tiệc…). Người dùng khám phá mẫu thiệp, tùy chỉnh nội dung và chia sẻ qua link trên mọi thiết bị.

Repo monorepo: thư mục `Frontend/` chứa SPA; tài liệu nghiệp vụ và kỹ thuật nằm tại [`../docs`](../docs).

---

## Yêu cầu

| Công cụ | Phiên bản khuyến nghị |
|---------|------------------------|
| Node.js | 20 LTS trở lên |
| npm     | 10+ |

---

## Bắt đầu nhanh

```bash
cd Frontend
npm install
npm run dev
```

Mặc định Vite chạy tại `http://localhost:5173`.

```bash
npm run build    # Kiểm tra TypeScript + build production → dist/
npm run preview  # Xem bản build local
npm run lint     # ESLint
npm test         # Vitest (unit / component tests)
npm run test:e2e # Playwright E2E (Phase 2 responsive — cần Chromium)
```

---

## Công nghệ

| Hạng mục | Stack |
|----------|--------|
| UI | React 19 |
| Routing | React Router 7 |
| Server state | TanStack Query 5 |
| Client state | Zustand 5 (persist) |
| i18n | i18next + react-i18next |
| Build | Vite 8 |
| Ngôn ngữ | TypeScript (strict) |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Icons | Phosphor Icons |
| Test | Vitest + Testing Library (unit/component); Playwright (`test:e2e`) cho E2E responsive Phase 2 |

**Alias import:** `@/` → `src/` (cấu hình trong `vite.config.ts` và `tsconfig.app.json`).

---

## Kiến trúc

Dự án theo **feature-based**: mỗi tính năng gom component, data và logic riêng; phần dùng chung đặt trong `shared/`.

```
Frontend/
├── public/
│   └── card-previews/        # HTML preview mẫu thiệp (demo trang chủ)
├── src/
│   ├── app/
│   │   ├── providers/        # QueryProvider, I18nProvider
│   │   ├── router/           # createBrowserRouter
│   │   └── store/            # Zustand (cart, auth, UI)
│   ├── assets/               # Ảnh, font… (import qua Vite)
│   ├── features/
│   │   ├── home/             # Landing sections + mock data
│   │   ├── catalog/          # Danh mục, lọc, preview mẫu thiệp
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── pages/
│   │   │   └── test/
│   │   │       ├── unit/
│   │   │       └── e2e/
│   │   └── cart/             # Giỏ hàng, checkout, đơn hàng
│   │       ├── api/
│   │       ├── hooks/
│   │       ├── pages/
│   │       └── test/
│   │           ├── unit/         # Vitest (*.test.tsx)
│   │           └── e2e/          # Playwright (*.e2e.spec.ts) + fixtures/
│   ├── layouts/              # Header, Footer, MainLayout
│   ├── locales/              # vi/en — chuỗi i18n
│   ├── pages/                # HomePage (route-level)
│   ├── shared/
│   │   ├── components/       # CardProduct, ToastViewport…
│   │   ├── hooks/            # scroll, reveal, debounce…
│   │   ├── lib/              # mockUser, helpers
│   │   └── services/         # api client (fetch wrapper)
│   ├── styles/
│   │   └── globals.css
│   ├── test/
│   │   ├── setup.ts          # Vitest setup
│   │   ├── README.md         # Quy ước Vitest vs Playwright
│   │   └── e2e/              # Helper Playwright dùng chung
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── index.html
├── vite.config.ts
├── tsconfig.app.json
└── eslint.config.js
```

### Quy ước thư mục

| Thư mục | Trách nhiệm |
|---------|-------------|
| `features/<tên>/` | UI và logic theo domain (home, catalog, cart…) |
| `features/<tên>/test/unit/` | Vitest — component/logic độc lập (`*.test.tsx`) |
| `features/<tên>/test/e2e/` | Playwright — browser E2E (`*.e2e.spec.ts`, `fixtures/`) |
| `pages/` | Trang route đơn giản (vd. HomePage ghép sections) |
| `app/` | Router, providers, global store |
| `layouts/` | Khung trang (header, footer, scroll progress, CTA sticky) |
| `shared/components/` | Component dùng ≥ 2 feature |
| `shared/hooks/` | Hook tái sử dụng — xem [src/shared/hooks/README.md](src/shared/hooks/README.md) |

### Routing hiện tại

| Path | Component | Mô tả |
|------|-----------|--------|
| `/` | `HomePage` | Landing: hero, danh mục, mẫu thiệp, trending, CTA… |
| `/mau-thiep` | `CatalogPage` | Danh mục mẫu thiệp — lọc, tìm kiếm, phân trang |
| `/mau-thiep/:slug` | `TemplatePreviewPage` | Xem trước mẫu (iframe) + thêm giỏ hàng |
| `/cart` | `CartPage` | Giỏ hàng — xem, xóa mẫu đã chọn |
| `/checkout` | `CheckoutPage` | Chọn gói hosting và đặt hàng |
| `/orders/:orderCode` | `OrderDetailPage` | Chi tiết đơn sau khi tạo |

Router: `createBrowserRouter` trong `src/app/router/index.tsx`.

---

## Tính năng đã triển khai

### Trang chủ (`features/home`) — Phase 1

- Các section: Hero, Category, Template, Trending, How it works, Gallery, Testimonials, CTA.
- **Card product grid** (`shared/components/card-product`): lưới mẫu thiệp, xem full preview (dialog + iframe HTML trong `public/card-previews/`).
- Dữ liệu tĩnh tạm thời: `src/features/home/data/cardProducts.ts`.

### Danh mục mẫu thiệp (`features/catalog`) — Phase 2

- Gọi **Template Service** qua API Gateway (`catalogApi`, TanStack Query).
- Lọc theo loại sự kiện, màu sắc, sắp xếp; tìm kiếm có debounce.
- Đồng bộ bộ lọc / trang với URL query params (chia sẻ link, back/forward).
- `TemplateCard`, `FilterPanel`, `CatalogPagination`, trạng thái loading/error/empty.
- Trang preview `/mau-thiep/:slug`: iframe preview HTML từ backend, metadata mẫu, CTA thêm giỏ.

### Giỏ hàng & đặt hàng (`features/cart`) — Phase 2

- **Giỏ hàng persistent** (Zustand + `localStorage`), badge số lượng trên Header.
- `useEnrichedCart`: hydrate thông tin mẫu từ API theo ID trong giỏ.
- Trang giỏ: danh sách mẫu, tạm tính, xóa item, link checkout.
- Trang checkout: chọn gói hosting từng mẫu, tổng cộng, tạo đơn qua **Order Service**.
- Trang đơn hàng: hiển thị mã đơn, trạng thái, chi tiết line items.
- Toast phản hồi khi thêm giỏ (trùng, đạt giới hạn 20 mẫu).

### Hạ tầng & UX chung

- **i18n** vi/en (`locales/`, `I18nProvider`) — chuỗi UI catalog/cart/checkout.
- **API client** (`shared/services/api.ts`): fetch wrapper, `ApiError`, base URL từ env.
- **Scroll UX** qua `MainLayout`: thanh progress, reveal on scroll, sticky CTA, back to top.
- **Responsive**: layout mobile-first cho cart, checkout, order detail.
- **Tests:** `features/*/test/unit/` (Vitest), `features/*/test/e2e/` (Playwright). Xem [src/test/README.md](src/test/README.md).

### Sắp tới

- Đăng nhập / đăng ký (Phase 5 — route đã comment sẵn trong router).
- Thanh toán trực tuyến (hiện hiển thị placeholder "Thanh toán sắp có").

---

## Static assets

- `public/card-previews/*.html` — file preview từng mẫu (golden-hour, minimal-blush, peony-dream, rose-garden). Truy cập qua URL `/card-previews/<tên>.html`.
- `src/assets/images/` — logo và hình import trong bundle.

---

## Môi trường

Sao chép `.env.example` thành `.env.local` (không commit):

```env
# Khớp với API_GATEWAY_URL trong Backend/.env (+ /api/v1)
VITE_API_URL=http://localhost:8090/api/v1
VITE_MOCK_USER_ID=10000000-0000-4000-8000-000000000001
```

| Biến | Mô tả |
|------|--------|
| `VITE_API_URL` | Base URL API Gateway (mặc định `http://localhost:8080/api/v1` nếu không set) |
| `VITE_MOCK_USER_ID` | User ID tạm cho header `X-User-Id` khi chưa có auth |

Prefix `VITE_` để Vite expose biến ra client. Backend cần chạy trước khi test catalog/cart/checkout thủ công; **Playwright E2E Phase 2** mock API nên không bắt buộc backend.

### Playwright E2E (Phase 2 responsive)

Lần đầu sau `npm install`:

```bash
npx playwright install chromium
```

Chạy test (tự bật `npm run dev` nếu chưa có server trên `:5173`):

```bash
npm run test:e2e          # responsive — headless, nhanh (CI)
npm run test:e2e:flow     # luồng khách đầy đủ — mở Chromium, click từng bước (~25s)
npm run test:e2e:headed   # alias của test:e2e:flow
npm run test:e2e:ui       # Playwright UI — debug timeline
```

Muốn chậm lại để dễ theo dõi: `npx playwright test --headed --workers=1 --slow-mo=500`

Spec: `src/features/cart/test/e2e/*.responsive.e2e.spec.ts`

Quy ước đầy đủ: [src/test/README.md](src/test/README.md).

---

## Tài liệu liên quan

| Tài liệu | Đường dẫn |
|----------|-----------|
| BRD | [../docs/business-docs/LoveCards-BRD-v1.0.md](../docs/business-docs/LoveCards-BRD-v1.0.md) |
| User Stories | [../docs/business-docs/LoveCards-UserStories-v1.0.md](../docs/business-docs/LoveCards-UserStories-v1.0.md) |
| Application Design | [../docs/business-docs/LoveCards-ApplicationDesign-v1.0.md](../docs/business-docs/LoveCards-ApplicationDesign-v1.0.md) |
| Domain Model | [../docs/technical-docs/LoveCards-DomainModel-v1.0.md](../docs/technical-docs/LoveCards-DomainModel-v1.0.md) |
| Functional Design | [../docs/technical-docs/LoveCards-FunctionalDesign-v1.0.md](../docs/technical-docs/LoveCards-FunctionalDesign-v1.0.md) |
| Database (DBML) | [../docs/technical-docs/LoveCards-Database-v1.0.dbml](../docs/technical-docs/LoveCards-Database-v1.0.dbml) |
| Database decisions | [../docs/technical-docs/LoveCards-DatabaseDecisions-v1.0.md](../docs/technical-docs/LoveCards-DatabaseDecisions-v1.0.md) |

---

## Ghi chú phát triển

- Chạy lệnh npm **trong thư mục `Frontend/`**, không phải root repo.
- `npm run build` chạy `tsc -b` trước `vite build` — sửa lỗi type trước khi deploy.
- Thêm feature mới: tạo `src/features/<tên>/`, đăng ký route trong `src/app/router/index.tsx`.
- Mỗi feature: `test/unit/` (Vitest) và `test/e2e/` (Playwright) — không trộn file.
- **Comment code:** mọi file/hàm mới phải có mô tả nhiệm vụ — xem `.cursor/skills/FE_skills.md` (mục Code Comments).
- Component chỉ dùng trong một feature → để trong feature đó; dùng chung → `shared/components/`.

---

© Love Cards
