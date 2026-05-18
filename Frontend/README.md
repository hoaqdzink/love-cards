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
```

---

## Công nghệ

| Hạng mục | Stack |
|----------|--------|
| UI | React 19 |
| Routing | React Router 7 |
| Build | Vite 8 |
| Ngôn ngữ | TypeScript (strict) |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Icons | Phosphor Icons |

**Alias import:** `@/` → `src/` (cấu hình trong `vite.config.ts` và `tsconfig.app.json`).

---

## Kiến trúc

Dự án theo **feature-based**: mỗi tính năng gom component, data và logic riêng; phần dùng chung đặt trong `shared/`.

```
Frontend/
├── public/
│   └── card-previews/     # HTML preview mẫu thiệp (phục vụ iframe / demo)
├── src/
│   ├── assets/            # Ảnh, font… (import qua Vite)
│   ├── features/          # Module theo domain (vd. home/)
│   │   └── home/
│   │       ├── components/  # Section trang chủ
│   │       └── data/        # Mock / static data (cardProducts)
│   ├── layouts/           # Header, Footer, MainLayout
│   ├── pages/             # Trang gắn với route (HomePage, …)
│   ├── shared/
│   │   ├── components/    # UI tái sử dụng (CardProduct, …)
│   │   └── hooks/         # Custom hooks (scroll, reveal, …)
│   ├── styles/
│   │   └── globals.css    # Tailwind + CSS toàn cục
│   ├── App.tsx            # Định nghĩa router
│   └── main.tsx           # Entry point
├── index.html
├── vite.config.ts
├── tsconfig.app.json
└── eslint.config.js
```

### Quy ước thư mục

| Thư mục | Trách nhiệm |
|---------|-------------|
| `features/<tên>/` | UI và logic theo tính năng (home, auth, catalog… khi mở rộng) |
| `pages/` | Component cấp route, ghép layout + sections |
| `layouts/` | Khung trang (header, footer, scroll progress, CTA sticky) |
| `shared/components/` | Component dùng ≥ 2 feature |
| `shared/hooks/` | Hook tái sử dụng — xem [src/shared/hooks/README.md](src/shared/hooks/README.md) |

### Routing hiện tại

| Path | Trang | Mô tả |
|------|--------|--------|
| `/` | `HomePage` | Landing: hero, danh mục, mẫu thiệp, trending, CTA… |

Router: `createBrowserRouter` trong `src/App.tsx`.

---

## Tính năng đã triển khai (MVP)

- **Trang chủ** với các section: Hero, Category, Template, Trending, How it works, Gallery, Testimonials, CTA.
- **Card product grid** (`shared/components/card-product`): lưới mẫu thiệp, xem full preview (dialog + iframe HTML trong `public/card-previews/`).
- **Scroll UX** qua `MainLayout`: thanh progress, reveal on scroll, sticky CTA, nút back to top (`shared/hooks`).

Dữ liệu mẫu thiệp tạm thời: `src/features/home/data/cardProducts.ts` (sẽ thay bằng API khi có backend).

---

## Static assets

- `public/card-previews/*.html` — file preview từng mẫu (golden-hour, minimal-blush, peony-dream, rose-garden). Truy cập qua URL `/card-previews/<tên>.html`.
- `src/assets/images/` — logo và hình import trong bundle.

---

## Môi trường (sắp tới)

Chưa có biến môi trường bắt buộc. Khi tích hợp API, thêm file `.env.local` (không commit):

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Prefix `VITE_` để Vite expose biến ra client.

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
- Thêm feature mới: tạo `src/features/<tên>/`, page tại `src/pages/`, đăng ký route trong `App.tsx`.
- Component chỉ dùng trong một feature → để trong feature đó; dùng chung → `shared/components/`.

---

© Love Cards
