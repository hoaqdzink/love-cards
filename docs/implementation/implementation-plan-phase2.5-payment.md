# Phase 2.5 — Payment & Post-Checkout — Implementation Plan

**Trạng thái:** Chờ phê duyệt (triển khai **sau** Phase 2)  
**Nguồn tham chiếu:** `LoveCards-ImplementationPlan-v1.0.md` (Phase 2.5), `LoveCards-FunctionalDesign-v1.0.md` (§4.4–4.6), `implementation-plan-phase2.md`  
**Phạm vi:** EPIC 6 — QR + VNPay + MoMo + ZaloPay + Visa, webhook, order state machine đầy đủ, post-payment (`OrderPaid` → card draft + email), order timeout.  
**Tiền đề:** Phase 2 hoàn thành (cart, checkout, đơn `CREATED`).

---

## Nguyên tắc thực hiện

- Chỉ bắt đầu sau Phase 2 done và các `[Câu hỏi]` dưới đây có `[Trả lời]`.
- Vẫn dùng `X-User-Id` mock cho đến Phase 5 (Auth JWT).
- Phase 3 (customize) phụ thuộc **card `draft`** sau PAID — Phase 2.5 là cầu nối bắt buộc trước Phase 3 (trừ seed dev).

---

## Các câu hỏi cần làm rõ (trước Phase 2.5)

### Q25-01 — Phạm vi cổng thanh toán

[Câu hỏi] Triển khai đủ 5 phương thức trong một lần hay chia đợt?

[Option]

- A. Đủ QR + VNPay + MoMo + ZaloPay + Visa (sandbox nếu chưa credential).
- B. QR + VNPay trước; MoMo, ZaloPay, Visa sau.
- C. QR + mock redirect e-wallet; SDK thật sau.
- D. Khác: ...

[Trả lời]

### Q25-02 — VietQR / QR chuyển khoản

[Câu hỏi] Tạo QR: VietQR API, QR local (EMVCo), hay mock dev?

[Option]

- A. VietQR API thật.
- B. QR local từ STK + nội dung CK + số tiền.
- C. Mock QR dev; abstraction thay sau.
- D. Khác: ...

[Trả lời]

### Q25-03 — Tạo Card sau PAID

[Câu hỏi] `OrderPaid` → tạo `cards.cards` draft: RabbitMQ, Feign sync, hay cả hai?

[Option]

- A. Chỉ RabbitMQ.
- B. Chỉ Feign sync.
- C. RabbitMQ + Feign fallback.
- D. Khác: ...

[Trả lời]

### Q25-04 — Email xác nhận đơn

[Câu hỏi] SMTP thật, Mailhog local, hay log mock?

[Option]

- A. SMTP thật (Gmail/SendGrid/SES).
- B. Mailhog/Mailpit Docker.
- C. Log mock — không gửi thật.
- D. Khác: ...

[Trả lời]

### Q25-05 — Thẻ quốc tế (Visa/MC)

[Câu hỏi] Provider `POST /orders/{code}/pay/card`?

[Option]

- A. VNPay international card.
- B. Stripe.
- C. Hoãn sau e-wallet.
- D. Khác: ...

[Trả lời]

### Q25-06 — QR VERIFYING → PAID

[Câu hỏi] Xác nhận chuyển khoản (chưa có Admin panel Phase 6)?

[Option]

- A. Endpoint dev/internal hoặc script tạm.
- B. Bank webhook/API auto-match.
- C. Mock auto-confirm sau N giây (dev).
- D. B + A kết hợp.
- E. Khác: ...

[Trả lời]

### Q25-07 — Test dependencies payment

[Câu hỏi] Thêm WireMock gateways, Testcontainers RabbitMQ cho Phase 2.5?

[Option]

- A. Có — đủ WireMock + Testcontainers RabbitMQ.
- B. Chỉ backend.
- C. Test hiện có, không dependency mới.
- D. Khác: ...

[Trả lời]

### Q25-08 — Route FE payment (bổ sung Phase 2)

[Câu hỏi] Route thanh toán (Phase 2 dùng `/cart`, `/checkout` theo Q08 Phase 2):

[Option]

- A. `/payment/qr/:orderCode`, `/payment/return`, giữ `/orders/:orderCode` confirm sau paid.
- B. `/checkout/qr/:orderCode`, `/checkout/return`.
- C. Khớp Option A Phase 2 Q08 gốc (tiếng Việt `/thanh-toan/...`).
- D. Khác: ...

[Trả lời]

---

## Kế hoạch thực hiện

### 1. Backend — State machine & payment core

- [ ] P25-01. Mở rộng `OrderStateMachine` đầy đủ §4.2–4.3.
- [ ] P25-02. Abstraction `PaymentGateway` (create, IPN, verify signature).
- [ ] P25-03. `POST /orders/{code}/pay/qr` + Redis timeout 30 phút + scheduler EXPIRED.
- [ ] P25-04. QR generation theo Q25-02.
- [ ] P25-05. `POST /orders/{code}/confirm-transfer` → VERIFYING; PAID theo Q25-06.
- [ ] P25-06. `POST .../pay/vnpay`, `momo`, `zalopay`, `card` theo Q25-01, Q25-05.
- [ ] P25-07. Webhooks `/api/v1/webhooks/{gateway}` — signature, idempotent.
- [ ] P25-08. Retry FAILED/EXPIRED → CREATED; max 5 attempts trong `payment_data`.

### 2. Backend — Post-payment

- [ ] P25-09. `completeOrderAfterPaid`: PAID → COMPLETED; xóa cart DB.
- [ ] P25-10. Publish `OrderPaid` (RabbitMQ) theo Q25-03.
- [ ] P25-11. Card Service consumer — tạo `cards` draft + `expires_at`.
- [ ] P25-12. Notification consumer — email theo Q25-04.
- [ ] P25-13. RabbitMQ topology + DLQ/log.

### 3. Backend — Config & docs

- [ ] P25-14. Gateway webhooks public; CORS return URLs.
- [ ] P25-15. Swagger pay/* + webhooks.
- [ ] P25-16. `.env.example` payment keys (không commit secret).

### 4. Frontend — Payment UI

- [ ] P25-17. CheckoutPage — chọn payment method (bật nút đã disabled Phase 2).
- [ ] P25-18. QRPaymentPage + countdown + confirm transfer + polling.
- [ ] P25-19. PaymentReturnPage (e-wallet redirect).
- [ ] P25-20. OrderConfirmPage sau PAID + link customize (Phase 3).
- [ ] P25-21. Routes theo Q25-08.

### 5. Kiểm thử

- [ ] P25-22. Unit: state transitions, webhook verify.
- [ ] P25-23. Integration: checkout → pay mock → PAID → card draft.
- [ ] P25-24. Contract: webhook signatures.
- [ ] P25-25. Manual sandbox VNPay/MoMo (ghi nhật ký, không commit credential).
- [ ] P25-26. Smoke: email/Mailhog theo Q25-04.

---

## Tiêu chí hoàn thành Phase 2.5

- [ ] Thanh toán QR: QR, countdown, confirm transfer.
- [ ] VNPay / MoMo / ZaloPay / thẻ — theo Q25-01.
- [ ] Webhook IPN cập nhật order PAID.
- [ ] Sau PAID: card `draft` + cart cleared + email (hoặc mock Q25-04).
- [ ] Order timeout QR 30 phút.
- [ ] Tests pass hoặc ghi chú blocker.

---

## Nhật ký kiểm thử

_(Ghi khi triển khai.)_

---

*Tạo: 2026-06-03 — Tách từ Phase 2 gốc khi chưa cần payment.*
