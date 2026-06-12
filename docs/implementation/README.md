# Implementation Tracking

Folder theo dõi triển khai theo `LoveCards-ImplementationPlan-v1.0.md`.

## Cấu trúc kế hoạch chi tiết

```text
docs/implementation/
├── README.md                              # File này
├── LoveCards-ImplementationPlan-v1.0.md   # Master plan (tổng quan phases)
├── phase-0-plan.md                        # Phase 0
├── implementation-plan-phase1.md          # Phase 1 ✅ hoàn thành
├── implementation-plan-phase2.md          # Phase 2 — Cart & Checkout (không payment)
├── implementation-plan-phase2.5-payment.md # Phase 2.5 — Payment (khi cần)
└── (phase 3–6 — chưa tạo file chi tiết)
```

## Trạng thái tổng quan

| Phase | Tên | Trạng thái | Kế hoạch chi tiết |
|-------|-----|-----------|-------------------|
| 0 | Infrastructure & Foundation | ✅ Hoàn thành | `phase-0-plan.md` |
| 1 | Catalog & Template | ✅ Hoàn thành | `implementation-plan-phase1.md` |
| 2 | Cart & Checkout | 🔄 Đang triển khai | `implementation-plan-phase2.md` |
| 2.5 | Payment & Post-Checkout | 🔲 Sau Phase 2 | `implementation-plan-phase2.5-payment.md` |
| 3 | Card Customization | 🔲 Chưa bắt đầu | Tiền đề: Phase 2.5 (card draft) |
| 4 | Publish & Share | 🔲 Chưa bắt đầu | - |
| 5 | Authentication & User | 🔲 Chưa bắt đầu | Gồm FE `POST /cart/merge` |
| 6 | RSVP, Analytics, Admin, … | 🔲 Chưa bắt đầu | - |

### Ký hiệu
- 🔲 Chưa bắt đầu
- 🔄 Đang thực hiện / chờ phê duyệt
- ✅ Hoàn thành
- ⚠️ Blocked

## Quyết định triển khai (2026-06-03)

| Chủ đề | Quyết định |
|--------|------------|
| Phase 2 scope | Chỉ cart + checkout + đơn `CREATED`; **không payment** |
| Payment | Phase **2.5** — file `implementation-plan-phase2.5-payment.md` |
| Mock user | Header `X-User-Id`; thiếu header → 401; Phase 5 JWT + Gateway overwrite |
| Giỏ hàng | Cookie (FE) Phase 2; **`/cart/merge` FE → Phase 5**; xóa giỏ sau PAID (2.5) |
| Seed dev user | `auth-service` Flyway V2 — UUID khớp `VITE_MOCK_USER_ID` |
| Route FE Phase 2 | `/cart`, `/checkout`, `/orders/:orderCode` |

## Quy tắc

1. Mỗi phase có file kế hoạch checkbox; cập nhật `[x]` khi xong từng bước.
2. Cập nhật README khi chuyển phase hoặc đổi scope.
3. Pass kiểm thử phase trước khi sang phase tiếp (Phase 3 cần 2.5 hoặc seed dev).
4. Ghi quyết định kỹ thuật phát sinh vào file plan tương ứng.
