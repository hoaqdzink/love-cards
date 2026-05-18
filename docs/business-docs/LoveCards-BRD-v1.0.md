# BRD — Tài Liệu Yêu Cầu Kinh Doanh
# Love Cards Platform

**Phiên bản:** 1.0
**Ngày:** 2025
**Trạng thái:** Đã phê duyệt
**Chủ sở hữu sản phẩm:** Founder / Product Owner
**Phê duyệt bởi:** Founder

---

## 1. Tóm Tắt Điều Hành

Love Cards là nền tảng tạo và chia sẻ thiệp mời kỹ thuật số trực tuyến, hướng đến thị trường Việt Nam. Người dùng có thể duyệt, tùy chỉnh, mua và chia sẻ thiệp mời cho các sự kiện cưới, sinh nhật và tiệc. Dịch vụ vận hành theo mô hình **trả phí theo mẫu** (pay-per-template), hỗ trợ song ngữ Tiếng Việt và Tiếng Anh, giao diện web responsive tối ưu cho thiết bị di động.

---

## 2. Bối Cảnh Kinh Doanh

### 2.1 Vấn Đề Cần Giải Quyết

- Thiệp mời truyền thống (in ấn) tốn kém, mất thời gian và khó chia sẻ rộng rãi.
- Các giải pháp thiệp kỹ thuật số hiện tại trên thị trường Việt Nam còn hạn chế về mẫu mã, trải nghiệm người dùng và tích hợp kênh chia sẻ phổ biến (Zalo, Messenger).
- Người tổ chức sự kiện cần một công cụ đơn giản, đẹp và dễ chia sẻ ngay trên điện thoại.

### 2.2 Cơ Hội Thị Trường

- Thị trường tổ chức sự kiện tại Việt Nam (cưới, sinh nhật, tiệc) tăng trưởng ổn định hàng năm.
- Tỷ lệ sử dụng smartphone và mạng xã hội tại Việt Nam cao, tạo điều kiện cho thiệp kỹ thuật số lan truyền nhanh.
- Mô hình B2B tiềm năng: nhà hàng tiệc cưới, event planner có thể mua gói thiệp số lượng lớn.

### 2.3 Mục Tiêu Kinh Doanh

| Mục tiêu | Chỉ số đo lường | Thời hạn |
|----------|----------------|----------|
| Ra mắt MVP | Trang chủ + danh mục + preview hoạt động | Q1 2025 |
| Doanh thu đầu tiên | Đơn hàng đầu tiên được thanh toán | Q2 2025 |
| Tăng trưởng người dùng | 500 MAU | Q3 2025 |
| Tỉ lệ chuyển đổi | >= 5% từ xem mẫu sang mua | Q4 2025 |

---

## 3. Phạm Vi Sản Phẩm

### 3.1 Trong Phạm Vi (MVP)

| Nhóm tính năng | Mô tả |
|----------------|-------|
| Trang chủ | Landing page với hero, danh mục, thư viện mẫu, trending, hướng dẫn, testimonial, CTA |
| Danh mục mẫu | Duyệt, tìm kiếm, lọc theo loại sự kiện và màu sắc |
| Xem trước mẫu | Preview đầy đủ với nội dung mẫu |
| Giỏ hàng | Cookie (ẩn danh) + DB (đã đăng nhập), gộp khi đăng nhập |
| Xác thực | Google, Facebook, Email/SĐT + mật khẩu |
| Tùy chỉnh thiệp | Trường động, upload ảnh, crop, nhạc nền từ thư viện |
| Xem trước và xuất bản | Preview trước khi thanh toán, kích hoạt sau thanh toán |
| Thanh toán | Chuyển khoản QR, MoMo/ZaloPay/VNPay, Visa/Mastercard |
| Gói Hosting | Ít nhất 2 gói thời gian, gia hạn theo tháng |
| URL thiệp | lovecards.vn/thiep/{ten-su-kien}/{id-nguoi-so-huu}/{id-link-khach-moi} |
| Chia sẻ | URL, QR code, Zalo, Messenger, SMS + Open Graph preview |
| RSVP | Khách mời xác nhận tham dự, chủ thiệp xem tổng hợp |
| Lời chúc | Khách mời gửi lời chúc, hiển thị trên thiệp |
| Tài khoản ngân hàng | Tùy chọn hiển thị số tài khoản nhận mừng cưới |
| Phân tích | Lượt xem, thiết bị, nguồn truy cập |
| Form CTA | Newsletter + liên hệ B2B |
| Pháp lý | Cookie consent, Điều khoản sử dụng, Chính sách bảo mật |
| Song ngữ | Tiếng Việt (mặc định) + Tiếng Anh |
| Admin Panel | Quản lý mẫu, đơn hàng, doanh thu, người dùng (ứng dụng riêng) |

### 3.2 Ngoài Phạm Vi (Phase sau)

- Upload nhạc tùy chỉnh của người dùng
- Cộng tác viên (CTV) thiết kế mẫu thiệp, upload và nhận hoa hồng khi có người mua
- Custom domain cho thiệp
- Ứng dụng di động native
- Tích hợp thanh toán mừng cưới trực tiếp qua thiệp
- Khung thiết kế tự do (drag & drop editor)

---

## 4. Đối Tượng Người Dùng

### 4.1 Phân Khúc Chính

| Phân khúc | Mô tả | Nhu cầu chính |
|-----------|-------|---------------|
| Cặp đôi cưới | 22-35 tuổi, chuẩn bị đám cưới | Thiệp đẹp, dễ chia sẻ Zalo/Messenger, có RSVP |
| Người tổ chức sinh nhật | 18-40 tuổi | Thiệp nhanh, giá hợp lý, chia sẻ nhóm chat |
| Người tổ chức tiệc | 25-45 tuổi | Thiệp chuyên nghiệp, có thể tùy chỉnh thông tin |
| Doanh nghiệp (B2B) | Nhà hàng tiệc cưới, event planner | Mua số lượng lớn, cần hóa đơn |

### 4.2 Thị Trường Ưu Tiên

- **Chính:** Việt Nam (Tiếng Việt)
- **Phụ:** Người Việt ở nước ngoài (Tiếng Anh)

---

## 5. Mô Hình Kinh Doanh

### 5.1 Nguồn Doanh Thu

| Nguồn | Mô tả | Giai đoạn |
|-------|-------|-----------|
| Trả phí theo mẫu | Người dùng mua từng mẫu thiệp theo đơn giá | MVP |
| Gói Hosting | Trả phí theo thời gian thiệp tồn tại (gói + gia hạn tháng) | MVP |
| B2B | Gói doanh nghiệp cho nhà hàng, event planner | Phase 2 |
| Khung thiết kế | Miễn phí cho người dùng sử dụng | Phase 3 |
| CTV thiết kế mẫu | CTV làm mẫu, update mẫu và nhận tiền khi có người mua | Phase 2 |

### 5.2 Cấu Trúc Giá

- Mỗi mẫu thiệp có đơn giá riêng (10.000 - 99.999.999 VND)
- Người dùng mua bao nhiêu mẫu tùy ý, không giới hạn
- Gói Hosting: ít nhất 2 mức thời gian, gia hạn theo tháng

---

## 6. Luồng Nghiệp Vụ Chính

### 6.1 Luồng Người Dùng Mua và Tạo Thiệp

```
Khám phá trang chủ
    ↓
Duyệt danh mục / Tìm kiếm / Lọc
    ↓
Xem trước mẫu thiệp
    ↓
Thêm vào giỏ hàng (cookie nếu chưa đăng nhập)
    ↓
[Đăng nhập khi mua] → Gộp giỏ hàng cookie → DB
    ↓
Chọn Gói Hosting → Thanh toán
    ↓
Tùy chỉnh thiệp (trường động, ảnh, nhạc)
    ↓
Xem trước thiệp đã tùy chỉnh
    ↓
Xuất bản → Nhận URL thiệp
    ↓
Chia sẻ (URL / QR / Zalo / Messenger / SMS)
```

### 6.2 Luồng Khách Mời

```
Nhận link thiệp
    ↓
Xem thiệp (không cần đăng nhập)
    ↓
Gửi RSVP (xác nhận / từ chối + số người)
    ↓
Gửi lời chúc
    ↓
[Tùy chọn] Xem thông tin tài khoản ngân hàng mừng cưới
```

### 6.3 Luồng Admin

```
Đăng nhập Admin Panel
    ↓
Upload mẫu thiệp (HTML + assets)
    ↓
Cấu hình trường động + giá + tag
    ↓
Bật mẫu lên danh mục công khai
    ↓
Theo dõi đơn hàng + doanh thu + KPI
    ↓
Quản lý người dùng (khóa/mở khóa)
```

---

## 7. Yêu Cầu Chức Năng Tóm Tắt

| ID | Tính năng | Ưu tiên |
|----|-----------|---------|
| F01 | Trang chủ (hero, danh mục, thư viện, trending, CTA) | Cao |
| F02 | Danh mục mẫu với tìm kiếm và lọc | Cao |
| F03 | Xem trước mẫu thiệp | Cao |
| F04 | Giỏ hàng ẩn danh (cookie) | Cao |
| F05 | Xác thực (Google, Facebook, Email, SĐT) | Cao |
| F06 | Gộp giỏ hàng khi đăng nhập | Cao |
| F07 | Tùy chỉnh thiệp (trường động, ảnh, nhạc) | Cao |
| F08 | Xem trước và xác nhận trước khi thanh toán | Cao |
| F09 | Thanh toán (QR, ví điện tử, thẻ quốc tế) | Cao |
| F10 | Gói Hosting và vòng đời thiệp | Cao |
| F11 | Xuất bản thiệp và cấu trúc URL | Cao |
| F12 | Chia sẻ (URL, QR, Zalo, Messenger, SMS, Open Graph) | Cao |
| F13 | RSVP | Trung bình |
| F14 | Lời chúc của khách mời | Trung bình |
| F15 | Hiển thị tài khoản ngân hàng nhận mừng cưới | Trung bình |
| F16 | Phân tích thiệp (lượt xem, thiết bị, nguồn) | Trung bình |
| F17 | Form CTA (newsletter + B2B) | Thấp |
| F18 | Tuân thủ pháp lý (cookie consent, ToS, Privacy) | Cao |
| F19 | Hỗ trợ song ngữ VI/EN | Trung bình |
| F20 | Thiết kế web responsive | Cao |
| F21 | Admin: Quản lý mẫu thiệp | Cao |
| F22 | Admin: Quản lý đơn hàng và doanh thu | Cao |
| F23 | Admin: Quản lý người dùng | Trung bình |

---

## 8. Yêu Cầu Phi Chức Năng

| Danh mục | Yêu cầu |
|----------|---------|
| Hiệu năng | Trang thiệp tải trong vòng 5 giây trên kết nối 4G tiêu chuẩn |
| Responsive | Hỗ trợ viewport 320px - 2560px, 3 breakpoint (mobile/tablet/desktop) |
| Bảo mật | HTTPS bắt buộc, mật khẩu tối thiểu 8 ký tự (chữ + số) |
| Khả dụng | Tối ưu hợp lý theo ngân sách, không đặt SLA cụ thể giai đoạn đầu |
| Khả năng mở rộng | Kiến trúc hỗ trợ thêm CTV, custom domain, app native trong tương lai |
| Pháp lý | Tuân thủ Luật Bảo vệ dữ liệu cá nhân Việt Nam, cookie consent |
| Ngôn ngữ | Tiếng Việt mặc định, hỗ trợ Tiếng Anh |
| Nền tảng | Web responsive (mobile-friendly), không có app native trong MVP |

---

## 9. Các Bên Liên Quan (Stakeholders)

| Vai trò | Trách nhiệm |
|---------|-------------|
| Product Owner (Founder) | Phê duyệt BRD, quyết định ưu tiên tính năng, nghiệm thu sản phẩm |
| Developer / AI Agent | Thiết kế kỹ thuật và triển khai |
| Admin | Vận hành nền tảng, upload mẫu thiệp, quản lý đơn hàng |
| Người dùng cuối | Mua và tạo thiệp mời |
| Khách mời | Xem thiệp, RSVP, gửi lời chúc |
| Đối tác B2B | Nhà hàng tiệc cưới, event planner (Phase 2) |

---

## 10. Rủi Ro và Kế Hoạch Giảm Thiểu

| Rủi ro | Mức độ | Kế hoạch giảm thiểu |
|--------|--------|---------------------|
| Tích hợp cổng thanh toán phức tạp | Cao | Ưu tiên VNPay/MoMo trước, thêm Visa/MC sau |
| Bản quyền nhạc trong thư viện | Trung bình | Chỉ dùng nhạc royalty-free hoặc tự sản xuất |
| Người dùng không chuyển đổi từ xem sang mua | Trung bình | A/B test CTA, tối ưu UX luồng mua hàng |
| Thiếu mẫu thiệp hấp dẫn khi ra mắt | Cao | Chuẩn bị ít nhất 10 mẫu chất lượng trước launch |
| Cạnh tranh từ các nền tảng quốc tế | Thấp | Tập trung vào trải nghiệm Việt Nam (Zalo, VNPay, tiếng Việt) |
| Dữ liệu cá nhân người dùng | Trung bình | Tuân thủ PDPA Việt Nam, có chính sách bảo mật rõ ràng |

---

## 11. Lộ Trình Sản Phẩm

### Phase 1 — MVP (Ưu tiên hiện tại)
- Trang chủ + Danh mục + Preview mẫu
- Giỏ hàng + Xác thực + Thanh toán
- Tùy chỉnh thiệp + Xuất bản + Chia sẻ
- RSVP + Lời chúc + Phân tích cơ bản
- Admin Panel (quản lý mẫu, đơn hàng, người dùng)
- Pháp lý + Song ngữ

### Phase 2 — Mở rộng
- CTV upload mẫu thiệp (có admin duyệt)
- Gói B2B cho doanh nghiệp
- Upload nhạc tùy chỉnh
- Tích hợp thanh toán mừng cưới trực tiếp

### Phase 3 — Nâng cao
- Khung thiết kế tự do (drag & drop editor)
- Custom domain
- PWA / App native
- Phân tích nâng cao và báo cáo

---

## 12. Tiêu Chí Nghiệm Thu MVP

- [ ] Trang chủ hiển thị đầy đủ các section, responsive trên mobile và desktop
- [ ] Danh mục mẫu có tìm kiếm và lọc hoạt động đúng
- [ ] Người dùng có thể xem trước, thêm vào giỏ hàng và mua mẫu thiệp
- [ ] Đăng nhập bằng Google, Facebook, Email, SĐT hoạt động
- [ ] Giỏ hàng cookie được gộp vào DB sau khi đăng nhập
- [ ] Thanh toán qua ít nhất một cổng (VNPay hoặc MoMo) hoạt động
- [ ] Thiệp được xuất bản với URL đúng cấu trúc
- [ ] Khách mời xem được thiệp không cần đăng nhập
- [ ] RSVP và lời chúc hoạt động
- [ ] Admin có thể upload và quản lý mẫu thiệp
- [ ] Cookie consent và trang pháp lý có sẵn

---

## 13. Phụ Lục

### 13.1 Thuật Ngữ

| Thuật ngữ | Định nghĩa |
|-----------|-----------|
| MVP | Minimum Viable Product — phiên bản tối thiểu có thể ra mắt |
| MAU | Monthly Active Users — người dùng hoạt động hàng tháng |
| B2B | Business-to-Business — mô hình kinh doanh giữa doanh nghiệp |
| RSVP | Xác nhận tham dự sự kiện |
| Open Graph | Giao thức metadata cho preview khi chia sẻ link lên mạng xã hội |
| Gói Hosting | Gói thời gian xác định thiệp tồn tại trực tuyến |
| Trường Động | Trường thông tin được cấu hình riêng theo từng mẫu thiệp |
| CTV | Cộng tác viên — nhà thiết kế bên ngoài upload mẫu (Phase 2) |

### 13.2 Tài Liệu Liên Quan

- `requirements.md` — Tài liệu yêu cầu phần mềm chi tiết (SRS)
- `QUESTIONS.md` — Câu hỏi và trả lời làm rõ yêu cầu kinh doanh
- `design.md` — Thiết kế kỹ thuật (sẽ bổ sung)
- `tasks.md` — Danh sách công việc triển khai (sẽ bổ sung)

---

*Tài liệu này được soạn thảo dựa trên các câu trả lời của Product Owner và tài liệu yêu cầu phần mềm. Mọi thay đổi cần được Product Owner phê duyệt trước khi cập nhật.*
