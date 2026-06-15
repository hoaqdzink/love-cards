# Kiểm thử Frontend — Love Cards

## Cấu trúc thư mục (bắt buộc)

Mỗi feature có **`test/unit/`** và **`test/e2e/`** — hai folder tách biệt:

```
src/features/cart/test/
├── unit/                              # Vitest — component / logic độc lập
│   ├── CartPage.test.tsx
│   └── CheckoutPage.test.tsx
└── e2e/                               # Playwright — browser thật
    ├── CartPage.responsive.e2e.spec.ts
    ├── CheckoutPage.responsive.e2e.spec.ts
    ├── OrderDetailPage.responsive.e2e.spec.ts
    └── fixtures/                      # mock/seed chỉ cho E2E feature này
        ├── cart-seed.ts
        └── commerce-api-mocks.ts

src/features/catalog/test/
├── unit/
│   ├── TemplateCard.test.tsx
│   ├── FilterPanel.test.tsx
│   └── CatalogPagination.test.tsx
└── e2e/                               # thêm spec khi cần E2E catalog
```

Helper Playwright dùng chung nhiều feature → `src/test/e2e/`.

| Folder | Runner | Lệnh | File |
|--------|--------|------|------|
| `test/unit/` | Vitest | `npm test` | `*.test.tsx` |
| `test/e2e/` | Playwright | `npm run test:e2e` | `*.e2e.spec.ts` |

---

## Vitest — `test/unit/`

- Render component trong **jsdom**, mock hook/API/store
- Nhanh, chạy mỗi lần sửa code
- **Dùng cho:** hiển thị, click, callback, component nhỏ

## Playwright — `test/e2e/`

- **Chromium** + URL thật, app đầy đủ
- **Dùng cho:** responsive, overflow, luồng nhiều trang
- Fixture/mock để trong `test/e2e/fixtures/`

### Xem browser khi chạy

`npm run test:e2e` mặc định **headless** (Chromium chạy nền, không hiện cửa sổ) — nhanh, phù hợp CI.

| Lệnh | Hiện màn hình? | Khi nào dùng |
|------|----------------|--------------|
| `npm run test:e2e` | Không | Responsive overflow — CI |
| `npm run test:e2e:flow` | Có — click luồng thật | **Xem workflow:** catalog → giỏ → checkout → đơn |
| `npm run test:e2e:headed` | Có (alias flow) | Giống `test:e2e:flow` |
| `npm run test:e2e:ui` | Có — giao diện Playwright | Debug timeline |

Luồng demo: `src/features/cart/test/e2e/cart-checkout-flow.e2e.spec.ts` — 7 bước với `test.step`, pause giữa các bước khi `PW_DEMO=1`.

---

## Checklist thêm tính năng

1. Tạo `features/<tên>/test/unit/` và `features/<tên>/test/e2e/`
2. Vitest trước → `unit/ComponentName.test.tsx`
3. E2E khi cần → `e2e/PageName.*.e2e.spec.ts`
4. **Không** đặt file test lẫn lộn ngoài hai folder trên
