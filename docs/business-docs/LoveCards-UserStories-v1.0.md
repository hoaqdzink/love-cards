# Love Cards — User Stories (MVP / Phase 1)

**Phiên bản:** 1.0  
**Ngày:** 2025  
**Trạng thái:** Đã duyệt  
**Tài liệu tham chiếu:** LoveCards-BRD-v1.0.md  

---

## Mục Lục

1. [Personas](#personas)
2. [EPIC 1 — Trang chủ & Khám phá (F01)](#epic-1--trang-chủ--khám-phá-f01)
3. [EPIC 2 — Danh mục & Tìm kiếm mẫu (F02, F03)](#epic-2--danh-mục--tìm-kiếm-mẫu-f02-f03)
4. [EPIC 3 — Giỏ hàng (F04, F06)](#epic-3--giỏ-hàng-f04-f06)
5. [EPIC 4 — Xác thực người dùng (F05)](#epic-4--xác-thực-người-dùng-f05)
6. [EPIC 5 — Tùy chỉnh thiệp (F07)](#epic-5--tùy-chỉnh-thiệp-f07)
7. [EPIC 6 — Xem trước & Thanh toán (F08, F09, F10)](#epic-6--xem-trước--thanh-toán-f08-f09-f10)
8. [EPIC 7 — Xuất bản & Chia sẻ (F11, F12)](#epic-7--xuất-bản--chia-sẻ-f11-f12)
9. [EPIC 8 — RSVP, Lời chúc & Tài khoản ngân hàng (F13, F14, F15)](#epic-8--rsvp-lời-chúc--tài-khoản-ngân-hàng-f13-f14-f15)
10. [EPIC 9 — Phân tích thiệp (F16)](#epic-9--phân-tích-thiệp-f16)
11. [EPIC 10 — Form CTA & Pháp lý (F17, F18)](#epic-10--form-cta--pháp-lý-f17-f18)
12. [EPIC 11 — Song ngữ & Responsive (F19, F20)](#epic-11--song-ngữ--responsive-f19-f20)
13. [EPIC 12 — Admin Panel (F21, F22, F23)](#epic-12--admin-panel-f21-f22-f23)

---

## Personas

| Ký hiệu | Persona | Mô tả |
|---------|---------|-------|
| **KVL** | Khách vãng lai | Người dùng chưa đăng nhập, truy cập trang web lần đầu hoặc duyệt mà không có tài khoản |
| **NDL** | Người dùng đã đăng nhập | Người dùng đã có tài khoản và đang đăng nhập |
| **NTT** | Người tạo thiệp | Người dùng đã mua mẫu và đang tùy chỉnh / quản lý thiệp của mình |
| **KM** | Khách mời | Người nhận link thiệp, xem thiệp và tương tác (RSVP, lời chúc) |
| **ADM** | Admin | Nhân viên vận hành nền tảng, quản lý mẫu, đơn hàng, người dùng |

---

## EPIC 1 — Trang chủ & Khám phá (F01)

### Story EPIC 1.0 (Tổng quát)

> **Là** Khách vãng lai (KVL),  
> **Tôi muốn** xem một trang chủ hấp dẫn và đầy đủ thông tin về nền tảng Love Cards,  
> **Để** hiểu được dịch vụ, khám phá các mẫu thiệp và bắt đầu hành trình tạo thiệp mời kỹ thuật số.

---

### Story 1.1 — Hero Section

> **Là** Khách vãng lai (KVL),  
> **Tôi muốn** thấy một hero section ấn tượng khi vào trang chủ,  
> **Để** hiểu ngay Love Cards là gì và được khuyến khích khám phá thêm.

**Acceptance Criteria:**

- [ ] Hero section hiển thị headline chính rõ ràng (ví dụ: "Thiệp mời kỹ thuật số đẹp cho mọi dịp")
- [ ] Có subheadline mô tả ngắn gọn giá trị cốt lõi của nền tảng
- [ ] Có ít nhất 1 CTA button nổi bật dẫn đến trang danh mục mẫu (ví dụ: "Khám phá mẫu thiệp")
- [ ] Có CTA phụ dẫn đến phần hướng dẫn hoặc xem demo
- [ ] Hero section hiển thị hình ảnh / animation minh họa thiệp mời đẹp
- [ ] Hero section responsive: hiển thị đúng trên mobile (320px), tablet (768px) và desktop (1280px+)
- [ ] Thời gian tải hero section không vượt quá 3 giây trên kết nối 4G

---

### Story 1.2 — Category Section (Danh mục nổi bật)

> **Là** Khách vãng lai (KVL),  
> **Tôi muốn** thấy các danh mục sự kiện nổi bật trên trang chủ,  
> **Để** nhanh chóng điều hướng đến loại thiệp phù hợp với nhu cầu của mình.

**Acceptance Criteria:**

- [ ] Hiển thị ít nhất 3 danh mục sự kiện (ví dụ: Đám cưới, Sinh nhật, Tiệc)
- [ ] Mỗi danh mục có icon/hình ảnh đại diện và tên danh mục
- [ ] Click vào danh mục dẫn đến trang danh mục mẫu đã được lọc theo loại sự kiện tương ứng
- [ ] Danh mục hiển thị số lượng mẫu có sẵn (ví dụ: "24 mẫu")
- [ ] Section responsive: hiển thị dạng grid trên desktop, scroll ngang hoặc grid 2 cột trên mobile

---

### Story 1.3 — Template Gallery Section (Thư viện mẫu)

> **Là** Khách vãng lai (KVL),  
> **Tôi muốn** xem một bộ sưu tập mẫu thiệp nổi bật ngay trên trang chủ,  
> **Để** có cái nhìn tổng quan về chất lượng và đa dạng của các mẫu thiệp trên nền tảng.

**Acceptance Criteria:**

- [ ] Hiển thị tối thiểu 6 mẫu thiệp nổi bật (featured templates)
- [ ] Mỗi card mẫu hiển thị: thumbnail, tên mẫu, loại sự kiện, giá
- [ ] Hover/tap vào card mẫu hiển thị nút "Xem trước" và "Thêm vào giỏ"
- [ ] Click "Xem trước" mở modal preview hoặc dẫn đến trang preview mẫu
- [ ] Có nút "Xem tất cả mẫu" dẫn đến trang danh mục đầy đủ
- [ ] Mẫu thiệp được đánh dấu "Mới" hoặc "Phổ biến" nếu có tag tương ứng

---

### Story 1.4 — Trending Section (Mẫu đang thịnh hành)

> **Là** Khách vãng lai (KVL),  
> **Tôi muốn** xem các mẫu thiệp đang được nhiều người chọn nhất,  
> **Để** tham khảo xu hướng và tìm được mẫu phù hợp nhanh hơn.

**Acceptance Criteria:**

- [ ] Hiển thị tối thiểu 4 mẫu thiệp trending (sắp xếp theo lượt mua hoặc lượt xem)
- [ ] Mỗi mẫu có badge "Trending" hoặc hiển thị số lượt mua/xem
- [ ] Section có tiêu đề rõ ràng (ví dụ: "Đang được yêu thích")
- [ ] Có thể scroll ngang trên mobile để xem thêm mẫu
- [ ] Click vào mẫu dẫn đến trang preview mẫu đó

---

### Story 1.5 — How It Works Section (Hướng dẫn sử dụng)

> **Là** Khách vãng lai (KVL),  
> **Tôi muốn** hiểu quy trình tạo và chia sẻ thiệp trên Love Cards,  
> **Để** tự tin bắt đầu mà không cần hỗ trợ thêm.

**Acceptance Criteria:**

- [ ] Hiển thị ít nhất 4 bước rõ ràng: Chọn mẫu → Tùy chỉnh → Thanh toán → Chia sẻ
- [ ] Mỗi bước có icon minh họa, tiêu đề và mô tả ngắn (tối đa 2 câu)
- [ ] Thứ tự các bước được đánh số hoặc có mũi tên chỉ hướng
- [ ] Section có CTA cuối dẫn đến trang danh mục (ví dụ: "Bắt đầu ngay")
- [ ] Responsive: hiển thị dạng stepper ngang trên desktop, dọc trên mobile

---

### Story 1.6 — Testimonials Section (Đánh giá người dùng)

> **Là** Khách vãng lai (KVL),  
> **Tôi muốn** đọc đánh giá từ những người đã sử dụng Love Cards,  
> **Để** tăng sự tin tưởng trước khi quyết định mua.

**Acceptance Criteria:**

- [ ] Hiển thị tối thiểu 3 testimonial từ người dùng thực
- [ ] Mỗi testimonial có: avatar (hoặc chữ cái đầu), tên người dùng, nội dung đánh giá, rating (sao)
- [ ] Có thể slide/carousel qua các testimonial trên mobile
- [ ] Nội dung testimonial không quá 150 từ mỗi cái
- [ ] Section có tiêu đề (ví dụ: "Khách hàng nói gì về chúng tôi")

---

### Story 1.7 — CTA Section (Kêu gọi hành động cuối trang)

> **Là** Khách vãng lai (KVL),  
> **Tôi muốn** thấy một lời kêu gọi hành động rõ ràng ở cuối trang chủ,  
> **Để** được nhắc nhở và dễ dàng bắt đầu tạo thiệp ngay.

**Acceptance Criteria:**

- [ ] CTA section có headline hấp dẫn (ví dụ: "Tạo thiệp mời đẹp chỉ trong 5 phút")
- [ ] Có ít nhất 1 CTA button chính dẫn đến trang danh mục
- [ ] Background section nổi bật, khác biệt với các section khác
- [ ] Section hiển thị đúng trên mọi kích thước màn hình

---

---

## EPIC 2 — Danh mục & Tìm kiếm mẫu (F02, F03)

### Story EPIC 2.0 (Tổng quát)

> **Là** Khách vãng lai (KVL),  
> **Tôi muốn** duyệt, tìm kiếm và lọc các mẫu thiệp một cách dễ dàng,  
> **Để** nhanh chóng tìm được mẫu phù hợp với sự kiện và sở thích của mình.

---

### Story 2.1 — Duyệt danh mục mẫu

> **Là** Khách vãng lai (KVL),  
> **Tôi muốn** xem toàn bộ danh sách mẫu thiệp có sẵn,  
> **Để** khám phá và so sánh các lựa chọn trước khi quyết định.

**Acceptance Criteria:**

- [ ] Trang danh mục hiển thị tất cả mẫu thiệp đang active dưới dạng grid
- [ ] Mỗi card mẫu hiển thị: thumbnail, tên mẫu, loại sự kiện, giá, badge (Mới/Phổ biến nếu có)
- [ ] Trang hỗ trợ phân trang (pagination) hoặc infinite scroll
- [ ] Số lượng mẫu hiển thị trên trang được ghi rõ (ví dụ: "Hiển thị 1-12 / 48 mẫu")
- [ ] Grid responsive: 1 cột (mobile), 2 cột (tablet), 3-4 cột (desktop)
- [ ] Trang tải trong vòng 3 giây với 20+ mẫu

---

### Story 2.2 — Lọc mẫu theo loại sự kiện

> **Là** Khách vãng lai (KVL),  
> **Tôi muốn** lọc mẫu thiệp theo loại sự kiện (cưới, sinh nhật, tiệc...),  
> **Để** chỉ xem các mẫu phù hợp với nhu cầu của mình.

**Acceptance Criteria:**

- [ ] Có bộ lọc theo loại sự kiện với các option: Tất cả, Đám cưới, Sinh nhật, Tiệc, Khác
- [ ] Khi chọn filter, danh sách mẫu cập nhật ngay lập tức (không reload trang)
- [ ] Filter đang active được highlight rõ ràng
- [ ] URL cập nhật để phản ánh filter đang chọn (ví dụ: `/danh-muc?loai=dam-cuoi`)
- [ ] Có thể chọn nhiều loại sự kiện cùng lúc
- [ ] Khi không có mẫu nào khớp, hiển thị thông báo "Không tìm thấy mẫu phù hợp"

---

### Story 2.3 — Lọc mẫu theo màu sắc / phong cách

> **Là** Khách vãng lai (KVL),  
> **Tôi muốn** lọc mẫu thiệp theo màu sắc hoặc phong cách thiết kế,  
> **Để** tìm mẫu phù hợp với chủ đề màu sắc của sự kiện.

**Acceptance Criteria:**

- [ ] Có bộ lọc màu sắc với các option phổ biến (ví dụ: Hồng, Trắng, Vàng, Xanh, Tím...)
- [ ] Màu sắc được hiển thị dưới dạng color swatch (ô màu) thay vì chỉ text
- [ ] Có thể kết hợp filter màu sắc với filter loại sự kiện
- [ ] Kết quả lọc cập nhật ngay lập tức
- [ ] Có nút "Xóa bộ lọc" để reset về trạng thái ban đầu

---

### Story 2.4 — Sắp xếp mẫu thiệp

> **Là** Khách vãng lai (KVL),  
> **Tôi muốn** sắp xếp danh sách mẫu theo các tiêu chí khác nhau,  
> **Để** dễ dàng tìm mẫu mới nhất, phổ biến nhất hoặc giá phù hợp nhất.

**Acceptance Criteria:**

- [ ] Có dropdown sắp xếp với các option: Mới nhất, Phổ biến nhất, Giá tăng dần, Giá giảm dần
- [ ] Mặc định sắp xếp theo "Phổ biến nhất"
- [ ] Khi thay đổi sắp xếp, danh sách cập nhật ngay lập tức
- [ ] Tùy chọn sắp xếp được lưu trong URL

---

### Story 2.5 — Tìm kiếm mẫu thiệp

> **Là** Khách vãng lai (KVL),  
> **Tôi muốn** tìm kiếm mẫu thiệp bằng từ khóa,  
> **Để** nhanh chóng tìm mẫu theo tên hoặc mô tả mà không cần duyệt toàn bộ danh mục.

**Acceptance Criteria:**

- [ ] Có thanh tìm kiếm (search bar) trên trang danh mục và trong header
- [ ] Tìm kiếm theo tên mẫu, tag, loại sự kiện
- [ ] Kết quả tìm kiếm hiển thị ngay khi gõ (debounce 300ms) hoặc khi nhấn Enter
- [ ] Khi không có kết quả, hiển thị thông báo gợi ý (ví dụ: "Thử tìm 'cưới' hoặc 'sinh nhật'")
- [ ] Từ khóa tìm kiếm được highlight trong kết quả
- [ ] Lịch sử tìm kiếm gần đây được lưu local (tối đa 5 từ khóa)

---

### Story 2.6 — Xem trước mẫu thiệp (Preview)

> **Là** Khách vãng lai (KVL),  
> **Tôi muốn** xem trước mẫu thiệp đầy đủ trước khi mua,  
> **Để** đánh giá chất lượng và sự phù hợp trước khi quyết định chi tiền.

**Acceptance Criteria:**

- [ ] Click vào mẫu thiệp mở trang preview hoặc modal preview đầy đủ
- [ ] Preview hiển thị thiệp với nội dung mẫu (placeholder data)
- [ ] Preview hiển thị đúng animation, nhạc nền (nếu có) của mẫu
- [ ] Trang preview có nút "Thêm vào giỏ hàng" và "Mua ngay"
- [ ] Trang preview hiển thị: tên mẫu, giá, loại sự kiện, mô tả, danh sách trường có thể tùy chỉnh
- [ ] Có nút điều hướng sang mẫu tiếp theo / trước đó trong cùng danh mục
- [ ] URL trang preview có thể chia sẻ được (ví dụ: `/mau-thiep/rose-garden`)
- [ ] Preview responsive: hiển thị đúng trên mobile

---

---

## EPIC 3 — Giỏ hàng (F04, F06)

### Story EPIC 3.0 (Tổng quát)

> **Là** Khách vãng lai (KVL) hoặc Người dùng đã đăng nhập (NDL),  
> **Tôi muốn** thêm mẫu thiệp vào giỏ hàng và quản lý giỏ hàng của mình,  
> **Để** có thể mua nhiều mẫu trong một lần thanh toán và không mất lựa chọn khi chưa sẵn sàng mua.

---

### Story 3.1 — Thêm mẫu vào giỏ hàng (chưa đăng nhập)

> **Là** Khách vãng lai (KVL),  
> **Tôi muốn** thêm mẫu thiệp vào giỏ hàng mà không cần đăng nhập,  
> **Để** lưu lại lựa chọn và tiếp tục mua sau khi đăng nhập.

**Acceptance Criteria:**

- [ ] Nút "Thêm vào giỏ hàng" có sẵn trên card mẫu và trang preview
- [ ] Khi click, mẫu được thêm vào giỏ hàng lưu trong cookie (không cần đăng nhập)
- [ ] Icon giỏ hàng trên header cập nhật số lượng item ngay lập tức
- [ ] Hiển thị toast notification xác nhận "Đã thêm vào giỏ hàng"
- [ ] Nếu mẫu đã có trong giỏ, hiển thị thông báo "Mẫu này đã có trong giỏ hàng của bạn"
- [ ] Giỏ hàng cookie tồn tại ít nhất 7 ngày (không bị xóa khi đóng trình duyệt)
- [ ] Giỏ hàng cookie hoạt động trên cùng thiết bị và trình duyệt

---

### Story 3.2 — Xem và quản lý giỏ hàng

> **Là** Khách vãng lai (KVL) hoặc Người dùng đã đăng nhập (NDL),  
> **Tôi muốn** xem và quản lý các mẫu trong giỏ hàng của mình,  
> **Để** kiểm tra lại lựa chọn trước khi thanh toán.

**Acceptance Criteria:**

- [ ] Trang giỏ hàng hiển thị danh sách tất cả mẫu đã thêm
- [ ] Mỗi item hiển thị: thumbnail, tên mẫu, loại sự kiện, giá
- [ ] Có nút xóa từng item khỏi giỏ hàng
- [ ] Hiển thị tổng tiền của tất cả mẫu trong giỏ
- [ ] Có nút "Tiếp tục mua sắm" dẫn về trang danh mục
- [ ] Có nút "Thanh toán" — nếu chưa đăng nhập, chuyển đến trang đăng nhập trước
- [ ] Giỏ hàng trống hiển thị thông báo và CTA dẫn đến danh mục

---

### Story 3.3 — Gộp giỏ hàng cookie vào tài khoản khi đăng nhập

> **Là** Khách vãng lai (KVL) đã thêm mẫu vào giỏ hàng,  
> **Tôi muốn** giỏ hàng của mình được giữ nguyên sau khi đăng nhập,  
> **Để** không mất các mẫu đã chọn trước khi đăng nhập.

**Acceptance Criteria:**

- [ ] Khi người dùng đăng nhập, hệ thống tự động gộp giỏ hàng cookie vào giỏ hàng DB của tài khoản
- [ ] Nếu mẫu đã có trong cả cookie và DB, chỉ giữ 1 bản (không duplicate)
- [ ] Sau khi gộp, giỏ hàng cookie được xóa
- [ ] Người dùng thấy giỏ hàng đầy đủ ngay sau khi đăng nhập (không cần reload)
- [ ] Hiển thị thông báo nếu có mẫu được gộp (ví dụ: "Đã thêm 2 mẫu từ phiên trước vào giỏ hàng")
- [ ] Nếu giỏ hàng cookie rỗng, không có thay đổi gì sau khi đăng nhập

---

### Story 3.4 — Giỏ hàng đồng bộ trên nhiều thiết bị (đã đăng nhập)

> **Là** Người dùng đã đăng nhập (NDL),  
> **Tôi muốn** giỏ hàng của mình đồng bộ trên mọi thiết bị,  
> **Để** có thể thêm mẫu trên điện thoại và thanh toán trên máy tính.

**Acceptance Criteria:**

- [ ] Giỏ hàng của người dùng đã đăng nhập được lưu trên server (DB)
- [ ] Khi đăng nhập trên thiết bị mới, giỏ hàng hiển thị đúng các mẫu đã thêm trước đó
- [ ] Thêm/xóa mẫu trên một thiết bị phản ánh ngay trên thiết bị khác (sau khi reload)

---

---

## EPIC 4 — Xác thực người dùng (F05)

### Story EPIC 4.0 (Tổng quát)

> **Là** Khách vãng lai (KVL),  
> **Tôi muốn** đăng ký và đăng nhập vào Love Cards bằng nhiều phương thức khác nhau,  
> **Để** có tài khoản cá nhân để mua, tùy chỉnh và quản lý thiệp của mình.

---

### Story 4.1 — Đăng nhập bằng Google

> **Là** Khách vãng lai (KVL),  
> **Tôi muốn** đăng nhập bằng tài khoản Google của mình,  
> **Để** không cần tạo mật khẩu mới và đăng nhập nhanh hơn.

**Acceptance Criteria:**

- [ ] Có nút "Đăng nhập với Google" trên trang đăng nhập / đăng ký
- [ ] Click nút mở popup OAuth của Google
- [ ] Sau khi xác thực thành công, người dùng được đăng nhập và chuyển về trang trước đó
- [ ] Nếu email Google chưa có tài khoản, tự động tạo tài khoản mới
- [ ] Nếu email Google đã liên kết với tài khoản email/SĐT, đăng nhập vào tài khoản đó
- [ ] Hiển thị thông báo lỗi rõ ràng nếu xác thực Google thất bại
- [ ] Sau đăng nhập, giỏ hàng cookie được gộp vào tài khoản (theo Story 3.3)

---

### Story 4.2 — Đăng nhập bằng Facebook

> **Là** Khách vãng lai (KVL),  
> **Tôi muốn** đăng nhập bằng tài khoản Facebook của mình,  
> **Để** đăng nhập nhanh chóng mà không cần nhớ thêm mật khẩu.

**Acceptance Criteria:**

- [ ] Có nút "Đăng nhập với Facebook" trên trang đăng nhập / đăng ký
- [ ] Click nút mở popup OAuth của Facebook
- [ ] Sau khi xác thực thành công, người dùng được đăng nhập và chuyển về trang trước đó
- [ ] Nếu email Facebook chưa có tài khoản, tự động tạo tài khoản mới
- [ ] Xử lý trường hợp Facebook không cung cấp email (yêu cầu người dùng nhập email thủ công)
- [ ] Hiển thị thông báo lỗi rõ ràng nếu xác thực Facebook thất bại

---

### Story 4.3 — Đăng ký / Đăng nhập bằng Email và mật khẩu

> **Là** Khách vãng lai (KVL),  
> **Tôi muốn** tạo tài khoản và đăng nhập bằng email và mật khẩu,  
> **Để** có tài khoản độc lập không phụ thuộc vào mạng xã hội.

**Acceptance Criteria:**

- [ ] Form đăng ký có các trường: Họ tên, Email, Mật khẩu, Xác nhận mật khẩu
- [ ] Mật khẩu tối thiểu 8 ký tự, bao gồm chữ và số
- [ ] Hiển thị chỉ báo độ mạnh mật khẩu (yếu/trung bình/mạnh)
- [ ] Sau đăng ký, gửi email xác thực đến địa chỉ email đã nhập
- [ ] Tài khoản chỉ được kích hoạt sau khi xác thực email
- [ ] Form đăng nhập có trường Email và Mật khẩu
- [ ] Có tùy chọn "Ghi nhớ đăng nhập" (Remember me)
- [ ] Hiển thị thông báo lỗi cụ thể: "Email không tồn tại", "Mật khẩu không đúng"
- [ ] Có link "Quên mật khẩu?" dẫn đến luồng reset mật khẩu

---

### Story 4.4 — Đăng ký / Đăng nhập bằng Số điện thoại

> **Là** Khách vãng lai (KVL),  
> **Tôi muốn** đăng ký và đăng nhập bằng số điện thoại Việt Nam,  
> **Để** sử dụng số điện thoại quen thuộc thay vì email.

**Acceptance Criteria:**

- [ ] Form đăng ký/đăng nhập hỗ trợ nhập số điện thoại Việt Nam (10 số, bắt đầu bằng 0)
- [ ] Sau khi nhập SĐT, hệ thống gửi OTP (6 chữ số) qua SMS
- [ ] OTP có hiệu lực trong 5 phút
- [ ] Người dùng nhập OTP để xác thực và hoàn tất đăng nhập/đăng ký
- [ ] Có nút "Gửi lại OTP" sau 60 giây
- [ ] Hiển thị thông báo lỗi nếu OTP sai hoặc hết hạn
- [ ] Giới hạn 5 lần gửi OTP trong 1 giờ để chống spam

---

### Story 4.5 — Quên mật khẩu và đặt lại mật khẩu

> **Là** Người dùng đã đăng ký bằng email,  
> **Tôi muốn** đặt lại mật khẩu khi quên,  
> **Để** lấy lại quyền truy cập vào tài khoản của mình.

**Acceptance Criteria:**

- [ ] Trang "Quên mật khẩu" có form nhập email
- [ ] Sau khi nhập email hợp lệ, hệ thống gửi link đặt lại mật khẩu qua email
- [ ] Link đặt lại mật khẩu có hiệu lực trong 1 giờ
- [ ] Trang đặt lại mật khẩu có form nhập mật khẩu mới và xác nhận
- [ ] Sau khi đặt lại thành công, người dùng được chuyển đến trang đăng nhập
- [ ] Link đặt lại mật khẩu chỉ dùng được 1 lần

---

### Story 4.6 — Đăng xuất

> **Là** Người dùng đã đăng nhập (NDL),  
> **Tôi muốn** đăng xuất khỏi tài khoản,  
> **Để** bảo vệ tài khoản khi dùng thiết bị chung.

**Acceptance Criteria:**

- [ ] Có tùy chọn "Đăng xuất" trong menu tài khoản (header)
- [ ] Sau khi đăng xuất, session bị hủy và người dùng được chuyển về trang chủ
- [ ] Giỏ hàng DB không bị xóa sau khi đăng xuất (vẫn còn khi đăng nhập lại)
- [ ] Sau đăng xuất, các trang yêu cầu đăng nhập chuyển hướng về trang đăng nhập

---

---

## EPIC 5 — Tùy chỉnh thiệp (F07)

### Story EPIC 5.0 (Tổng quát)

> **Là** Người tạo thiệp (NTT) đã mua mẫu,  
> **Tôi muốn** tùy chỉnh nội dung thiệp theo thông tin sự kiện của mình,  
> **Để** tạo ra một thiệp mời cá nhân hóa và sẵn sàng chia sẻ.

---

### Story 5.1 — Điền thông tin vào các trường động (Dynamic Fields)

> **Là** Người tạo thiệp (NTT),  
> **Tôi muốn** điền thông tin sự kiện vào các trường được định nghĩa sẵn của mẫu,  
> **Để** thiệp hiển thị đúng tên, ngày giờ, địa điểm và các thông tin cá nhân của sự kiện.

**Acceptance Criteria:**

- [ ] Giao diện tùy chỉnh hiển thị danh sách các trường động của mẫu (ví dụ: Tên cô dâu, Tên chú rể, Ngày cưới, Địa điểm...)
- [ ] Mỗi trường có label rõ ràng, placeholder gợi ý và loại input phù hợp (text, date, time, textarea)
- [ ] Trường bắt buộc được đánh dấu (*) và validate trước khi cho phép tiếp tục
- [ ] Thiệp preview cập nhật real-time khi người dùng nhập thông tin
- [ ] Hỗ trợ nhập tiếng Việt có dấu đầy đủ
- [ ] Giới hạn ký tự cho từng trường được hiển thị (ví dụ: "45/100 ký tự")
- [ ] Dữ liệu đã nhập được tự động lưu (auto-save) mỗi 30 giây hoặc khi chuyển trường

---

### Story 5.2 — Upload và crop ảnh

> **Là** Người tạo thiệp (NTT),  
> **Tôi muốn** upload ảnh của mình vào thiệp và điều chỉnh vùng hiển thị,  
> **Để** thiệp có ảnh cá nhân hóa đẹp và đúng tỷ lệ.

**Acceptance Criteria:**

- [ ] Có nút upload ảnh cho các trường ảnh trong mẫu
- [ ] Hỗ trợ định dạng: JPG, PNG, WebP
- [ ] Kích thước file tối đa: 10MB
- [ ] Sau khi upload, hiển thị công cụ crop với tỷ lệ khung hình cố định theo yêu cầu của mẫu
- [ ] Công cụ crop hỗ trợ: kéo để di chuyển, pinch/scroll để zoom
- [ ] Có nút "Xác nhận" và "Hủy" trong giao diện crop
- [ ] Ảnh sau khi crop được hiển thị ngay trong preview thiệp
- [ ] Có thể thay ảnh bằng cách upload lại
- [ ] Hiển thị thông báo lỗi nếu file không đúng định dạng hoặc quá kích thước

---

### Story 5.3 — Chọn nhạc nền từ thư viện

> **Là** Người tạo thiệp (NTT),  
> **Tôi muốn** chọn nhạc nền cho thiệp từ thư viện nhạc có sẵn,  
> **Để** thiệp có âm thanh phù hợp với không khí sự kiện.

**Acceptance Criteria:**

- [ ] Có section "Nhạc nền" trong giao diện tùy chỉnh
- [ ] Hiển thị danh sách nhạc từ thư viện với: tên bài, thể loại, thời lượng
- [ ] Có nút play/pause để nghe thử từng bài nhạc
- [ ] Người dùng chọn 1 bài nhạc cho thiệp
- [ ] Có tùy chọn "Không có nhạc" (mặc định)
- [ ] Nhạc được chọn hiển thị trong preview thiệp
- [ ] Thư viện nhạc chỉ bao gồm nhạc royalty-free
- [ ] Có thể lọc nhạc theo thể loại (lãng mạn, vui tươi, cổ điển...)

---

### Story 5.4 — Xem trước thiệp trong khi tùy chỉnh

> **Là** Người tạo thiệp (NTT),  
> **Tôi muốn** xem trước thiệp real-time trong khi tùy chỉnh,  
> **Để** biết thiệp trông như thế nào trước khi xuất bản.

**Acceptance Criteria:**

- [ ] Giao diện tùy chỉnh có panel preview thiệp ở bên cạnh (desktop) hoặc tab riêng (mobile)
- [ ] Preview cập nhật ngay khi thay đổi bất kỳ trường nào
- [ ] Có nút "Xem toàn màn hình" để preview thiệp ở chế độ full-screen
- [ ] Preview hiển thị đúng animation và nhạc nền đã chọn
- [ ] Có thể toggle giữa chế độ xem mobile và desktop trong preview

---

### Story 5.5 — Lưu bản nháp thiệp

> **Là** Người tạo thiệp (NTT),  
> **Tôi muốn** lưu bản nháp thiệp đang tùy chỉnh,  
> **Để** có thể tiếp tục chỉnh sửa sau mà không mất dữ liệu đã nhập.

**Acceptance Criteria:**

- [ ] Có nút "Lưu nháp" trong giao diện tùy chỉnh
- [ ] Dữ liệu được auto-save mỗi 30 giây
- [ ] Khi thoát trang, hiển thị dialog xác nhận nếu có thay đổi chưa lưu
- [ ] Bản nháp được lưu trong tài khoản người dùng
- [ ] Người dùng có thể tiếp tục chỉnh sửa bản nháp từ trang "Thiệp của tôi"
- [ ] Hiển thị thời gian lưu lần cuối (ví dụ: "Đã lưu lúc 14:32")

---

---

## EPIC 6 — Xem trước & Thanh toán (F08, F09, F10)

### Story EPIC 6.0 (Tổng quát)

> **Là** Người dùng đã đăng nhập (NDL),  
> **Tôi muốn** xem trước thiệp đã tùy chỉnh, chọn gói hosting và thanh toán,  
> **Để** hoàn tất mua hàng và kích hoạt thiệp của mình.

---

### Story 6.1 — Xem trước thiệp trước khi thanh toán

> **Là** Người dùng đã đăng nhập (NDL),  
> **Tôi muốn** xem trước thiệp đầy đủ trước khi thanh toán,  
> **Để** đảm bảo thiệp đúng như mong muốn trước khi chi tiền.

**Acceptance Criteria:**

- [ ] Trang xem trước hiển thị thiệp với đầy đủ nội dung đã tùy chỉnh
- [ ] Thiệp hiển thị đúng animation, nhạc nền, ảnh đã upload
- [ ] Có nút "Quay lại chỉnh sửa" để tiếp tục tùy chỉnh
- [ ] Có nút "Tiếp tục thanh toán" để chuyển sang bước chọn gói hosting
- [ ] Trang xem trước hiển thị tóm tắt: tên mẫu, giá mẫu

---

### Story 6.2 — Chọn gói Hosting

> **Là** Người dùng đã đăng nhập (NDL),  
> **Tôi muốn** chọn gói hosting phù hợp cho thiệp của mình,  
> **Để** thiệp tồn tại trực tuyến trong thời gian cần thiết.

**Acceptance Criteria:**

- [ ] Hiển thị ít nhất 2 gói hosting với: tên gói, thời hạn, giá, tính năng đi kèm
- [ ] Mỗi gói có mô tả rõ ràng về thời hạn (ví dụ: 3 tháng, 12 tháng)
- [ ] Gói được đề xuất (recommended) được highlight
- [ ] Người dùng chọn 1 gói trước khi tiếp tục
- [ ] Tổng tiền thanh toán = giá mẫu + giá gói hosting được hiển thị rõ ràng
- [ ] Có thông tin về gia hạn: "Có thể gia hạn theo tháng sau khi hết hạn"

---

### Story 6.3 — Thanh toán bằng QR chuyển khoản ngân hàng

> **Là** Người dùng đã đăng nhập (NDL),  
> **Tôi muốn** thanh toán bằng cách quét mã QR chuyển khoản ngân hàng,  
> **Để** sử dụng phương thức thanh toán phổ biến và quen thuộc tại Việt Nam.

**Acceptance Criteria:**

- [ ] Có tùy chọn "Chuyển khoản ngân hàng (QR)" trong trang thanh toán
- [ ] Khi chọn, hiển thị mã QR VietQR với thông tin: số tài khoản, tên ngân hàng, số tiền, nội dung chuyển khoản
- [ ] Nội dung chuyển khoản có mã đơn hàng duy nhất để đối soát
- [ ] Hiển thị hướng dẫn từng bước cách quét QR
- [ ] Sau khi chuyển khoản, người dùng click "Tôi đã thanh toán" để hệ thống kiểm tra
- [ ] Hệ thống tự động xác nhận thanh toán trong vòng 5 phút sau khi nhận tiền
- [ ] Nếu chưa nhận được tiền sau 30 phút, hiển thị hướng dẫn liên hệ hỗ trợ
- [ ] Sau khi xác nhận thanh toán, thiệp được kích hoạt và người dùng nhận thông báo

---

### Story 6.4 — Thanh toán bằng ví điện tử (MoMo / ZaloPay / VNPay)

> **Là** Người dùng đã đăng nhập (NDL),  
> **Tôi muốn** thanh toán bằng ví điện tử MoMo, ZaloPay hoặc VNPay,  
> **Để** thanh toán nhanh chóng và tiện lợi qua ứng dụng đã có sẵn trên điện thoại.

**Acceptance Criteria:**

- [ ] Có các tùy chọn thanh toán: MoMo, ZaloPay, VNPay trong trang thanh toán
- [ ] Khi chọn, chuyển hướng đến cổng thanh toán tương ứng
- [ ] Sau khi thanh toán thành công, chuyển về trang xác nhận đơn hàng trên Love Cards
- [ ] Sau khi thanh toán thất bại, hiển thị thông báo lỗi và cho phép thử lại
- [ ] Thiệp được kích hoạt ngay sau khi thanh toán thành công
- [ ] Người dùng nhận email xác nhận đơn hàng sau khi thanh toán thành công

---

### Story 6.5 — Thanh toán bằng thẻ quốc tế (Visa / Mastercard)

> **Là** Người dùng đã đăng nhập (NDL),  
> **Tôi muốn** thanh toán bằng thẻ Visa hoặc Mastercard,  
> **Để** sử dụng thẻ quốc tế khi không có ví điện tử Việt Nam.

**Acceptance Criteria:**

- [ ] Có tùy chọn "Thẻ quốc tế (Visa/Mastercard)" trong trang thanh toán
- [ ] Form nhập thông tin thẻ: số thẻ, tên chủ thẻ, ngày hết hạn, CVV
- [ ] Thông tin thẻ được xử lý qua cổng thanh toán bảo mật (PCI DSS compliant)
- [ ] Số thẻ được mask (chỉ hiển thị 4 số cuối) sau khi nhập
- [ ] Sau khi thanh toán thành công, thiệp được kích hoạt và người dùng nhận email xác nhận
- [ ] Hiển thị thông báo lỗi cụ thể nếu thẻ bị từ chối

---

### Story 6.6 — Trang xác nhận đơn hàng

> **Là** Người dùng đã đăng nhập (NDL),  
> **Tôi muốn** thấy trang xác nhận sau khi thanh toán thành công,  
> **Để** biết đơn hàng đã được xử lý và biết bước tiếp theo.

**Acceptance Criteria:**

- [ ] Trang xác nhận hiển thị: mã đơn hàng, tên mẫu, gói hosting, tổng tiền đã thanh toán
- [ ] Hiển thị thông báo thành công rõ ràng
- [ ] Có nút "Tùy chỉnh thiệp ngay" dẫn đến giao diện tùy chỉnh (nếu chưa tùy chỉnh)
- [ ] Có nút "Xem thiệp của tôi" dẫn đến trang quản lý thiệp
- [ ] Email xác nhận đơn hàng được gửi đến email đăng ký trong vòng 5 phút

---

### Story 6.7 — Gia hạn gói Hosting

> **Là** Người tạo thiệp (NTT),  
> **Tôi muốn** gia hạn gói hosting khi thiệp sắp hết hạn,  
> **Để** thiệp tiếp tục hoạt động sau ngày hết hạn.

**Acceptance Criteria:**

- [ ] Hệ thống gửi email thông báo trước 7 ngày và 1 ngày khi thiệp sắp hết hạn
- [ ] Trang quản lý thiệp hiển thị ngày hết hạn và trạng thái của từng thiệp
- [ ] Có nút "Gia hạn" trên trang quản lý thiệp
- [ ] Giao diện gia hạn hiển thị các gói gia hạn theo tháng với giá rõ ràng
- [ ] Hỗ trợ các phương thức thanh toán tương tự khi mua lần đầu
- [ ] Sau khi gia hạn thành công, ngày hết hạn được cập nhật ngay lập tức

---

---

## EPIC 7 — Xuất bản & Chia sẻ (F11, F12)

### Story EPIC 7.0 (Tổng quát)

> **Là** Người tạo thiệp (NTT),  
> **Tôi muốn** xuất bản thiệp và chia sẻ đến khách mời qua nhiều kênh,  
> **Để** khách mời có thể xem thiệp dễ dàng trên mọi nền tảng.

---

### Story 7.1 — Xuất bản thiệp và nhận URL

> **Là** Người tạo thiệp (NTT),  
> **Tôi muốn** xuất bản thiệp sau khi hoàn tất tùy chỉnh,  
> **Để** thiệp có URL riêng và khách mời có thể truy cập.

**Acceptance Criteria:**

- [ ] Có nút "Xuất bản thiệp" trong giao diện tùy chỉnh sau khi đã điền đủ thông tin bắt buộc
- [ ] Sau khi xuất bản, thiệp được gán URL theo cấu trúc: `lovecards.vn/thiep/{ten-su-kien}/{owner-id}/{guest-link-id}`
- [ ] `{ten-su-kien}` được tạo tự động từ tên sự kiện (slug hóa, tiếng Việt không dấu)
- [ ] URL được hiển thị rõ ràng sau khi xuất bản
- [ ] Có nút copy URL vào clipboard
- [ ] Thiệp chỉ có thể xuất bản khi đã thanh toán thành công
- [ ] Sau khi xuất bản, trạng thái thiệp chuyển từ "Nháp" sang "Đã xuất bản"
- [ ] Thiệp đã xuất bản vẫn có thể chỉnh sửa nội dung (URL không thay đổi)

---

### Story 7.2 — Chia sẻ thiệp qua URL và QR Code

> **Là** Người tạo thiệp (NTT),  
> **Tôi muốn** chia sẻ thiệp bằng URL trực tiếp hoặc mã QR,  
> **Để** khách mời có thể truy cập thiệp bằng cách click link hoặc quét QR.

**Acceptance Criteria:**

- [ ] Trang chia sẻ hiển thị URL thiệp đầy đủ với nút copy
- [ ] Tự động tạo mã QR từ URL thiệp
- [ ] Mã QR có thể tải xuống dưới dạng PNG
- [ ] Mã QR có thể in trực tiếp từ trình duyệt
- [ ] QR code có logo Love Cards ở giữa (branded QR)
- [ ] Khi quét QR, mở đúng trang thiệp

---

### Story 7.3 — Chia sẻ thiệp qua Zalo

> **Là** Người tạo thiệp (NTT),  
> **Tôi muốn** chia sẻ thiệp trực tiếp qua Zalo,  
> **Để** gửi thiệp đến khách mời qua kênh nhắn tin phổ biến nhất tại Việt Nam.

**Acceptance Criteria:**

- [ ] Có nút "Chia sẻ qua Zalo" trên trang chia sẻ thiệp
- [ ] Click nút mở Zalo (app hoặc web) với link thiệp được điền sẵn
- [ ] Khi chia sẻ qua Zalo, link hiển thị Open Graph preview (ảnh thumbnail, tiêu đề, mô tả)
- [ ] Hoạt động trên cả mobile (mở app Zalo) và desktop (mở Zalo web)

---

### Story 7.4 — Chia sẻ thiệp qua Messenger và SMS

> **Là** Người tạo thiệp (NTT),  
> **Tôi muốn** chia sẻ thiệp qua Facebook Messenger và SMS,  
> **Để** gửi thiệp đến khách mời qua các kênh liên lạc khác nhau.

**Acceptance Criteria:**

- [ ] Có nút "Chia sẻ qua Messenger" — click mở Messenger với link thiệp
- [ ] Có nút "Chia sẻ qua SMS" — click mở ứng dụng nhắn tin với nội dung có link thiệp
- [ ] Nút SMS hoạt động trên mobile (mở app nhắn tin mặc định)
- [ ] Nội dung SMS mặc định: "Bạn được mời đến [tên sự kiện]. Xem thiệp tại: [URL]"

---

### Story 7.5 — Open Graph Preview khi chia sẻ link

> **Là** Người tạo thiệp (NTT),  
> **Tôi muốn** link thiệp hiển thị preview đẹp khi chia sẻ lên mạng xã hội,  
> **Để** khách mời thấy được hình ảnh và thông tin thiệp ngay trong tin nhắn.

**Acceptance Criteria:**

- [ ] Mỗi thiệp có Open Graph meta tags: `og:title`, `og:description`, `og:image`, `og:url`
- [ ] `og:image` là thumbnail của thiệp (tự động tạo khi xuất bản)
- [ ] `og:title` là tên sự kiện (ví dụ: "Thiệp cưới Minh & Lan")
- [ ] `og:description` là thông tin ngắn về sự kiện
- [ ] Preview hiển thị đúng trên: Facebook, Zalo, Messenger, iMessage, Telegram
- [ ] Ảnh thumbnail có kích thước tối thiểu 1200x630px

---

---

## EPIC 8 — RSVP, Lời chúc & Tài khoản ngân hàng (F13, F14, F15)

### Story EPIC 8.0 (Tổng quát)

> **Là** Khách mời (KM),  
> **Tôi muốn** xem thiệp, xác nhận tham dự và gửi lời chúc,  
> **Để** tương tác với người tổ chức sự kiện một cách thuận tiện.

---

### Story 8.1 — Xem thiệp (không cần đăng nhập)

> **Là** Khách mời (KM),  
> **Tôi muốn** xem thiệp mời chỉ bằng cách click vào link,  
> **Để** không cần tạo tài khoản hay đăng nhập để xem thiệp.

**Acceptance Criteria:**

- [ ] Trang thiệp có thể truy cập bằng URL mà không cần đăng nhập
- [ ] Thiệp hiển thị đầy đủ: animation, nhạc nền, nội dung đã tùy chỉnh
- [ ] Nhạc nền tự động phát khi mở thiệp (với nút tắt/bật âm thanh)
- [ ] Trang thiệp tải trong vòng 5 giây trên kết nối 4G
- [ ] Thiệp hiển thị đúng trên mobile (320px+) và desktop
- [ ] Nếu thiệp hết hạn hosting, hiển thị thông báo "Thiệp này đã hết hạn"
- [ ] Nếu URL không tồn tại, hiển thị trang 404 thân thiện

---

### Story 8.2 — Gửi RSVP (xác nhận tham dự)

> **Là** Khách mời (KM),  
> **Tôi muốn** xác nhận tham dự hoặc từ chối lời mời trực tiếp trên thiệp,  
> **Để** thông báo cho người tổ chức biết tôi có tham dự hay không.

**Acceptance Criteria:**

- [ ] Thiệp có section RSVP với 2 lựa chọn: "Tôi sẽ tham dự" và "Tôi không thể tham dự"
- [ ] Form RSVP có các trường: Tên khách mời (bắt buộc), Số người tham dự (nếu chọn tham dự), Ghi chú (tùy chọn)
- [ ] Sau khi gửi RSVP, hiển thị thông báo xác nhận (ví dụ: "Cảm ơn bạn đã xác nhận!")
- [ ] Khách mời có thể cập nhật RSVP (gửi lại form) — hệ thống ghi đè phản hồi cũ
- [ ] Không yêu cầu đăng nhập để gửi RSVP
- [ ] Người tổ chức nhận thông báo (email hoặc in-app) khi có RSVP mới
- [ ] RSVP section chỉ hiển thị nếu người tạo thiệp đã bật tính năng này

---

### Story 8.3 — Xem tổng hợp RSVP (dành cho người tạo thiệp)

> **Là** Người tạo thiệp (NTT),  
> **Tôi muốn** xem tổng hợp danh sách RSVP từ khách mời,  
> **Để** biết có bao nhiêu người xác nhận tham dự và lên kế hoạch cho sự kiện.

**Acceptance Criteria:**

- [ ] Trang quản lý thiệp có tab/section "RSVP"
- [ ] Hiển thị tổng số: Đã xác nhận tham dự / Không tham dự / Chưa phản hồi
- [ ] Danh sách chi tiết từng RSVP: tên khách, số người, trạng thái, thời gian gửi, ghi chú
- [ ] Có thể xuất danh sách RSVP ra file CSV
- [ ] Danh sách có thể lọc theo trạng thái (tham dự / không tham dự)
- [ ] Hiển thị tổng số người tham dự (tổng cộng từ tất cả RSVP xác nhận)

---

### Story 8.4 — Gửi lời chúc

> **Là** Khách mời (KM),  
> **Tôi muốn** gửi lời chúc đến người tổ chức sự kiện qua thiệp,  
> **Để** chia sẻ tình cảm và chúc mừng cho dịp đặc biệt.

**Acceptance Criteria:**

- [ ] Thiệp có section "Lời chúc" với form gửi lời chúc
- [ ] Form có các trường: Tên người gửi (bắt buộc), Nội dung lời chúc (bắt buộc, tối đa 500 ký tự)
- [ ] Không yêu cầu đăng nhập để gửi lời chúc
- [ ] Sau khi gửi, lời chúc hiển thị ngay trong section lời chúc trên thiệp
- [ ] Lời chúc hiển thị theo thứ tự mới nhất lên trên
- [ ] Có thể xem tất cả lời chúc (scroll hoặc "Xem thêm")
- [ ] Người tạo thiệp nhận thông báo khi có lời chúc mới
- [ ] Section lời chúc chỉ hiển thị nếu người tạo thiệp đã bật tính năng này

---

### Story 8.5 — Quản lý lời chúc (dành cho người tạo thiệp)

> **Là** Người tạo thiệp (NTT),  
> **Tôi muốn** quản lý các lời chúc trên thiệp của mình,  
> **Để** kiểm soát nội dung hiển thị và ẩn các lời chúc không phù hợp.

**Acceptance Criteria:**

- [ ] Trang quản lý thiệp có tab/section "Lời chúc"
- [ ] Hiển thị danh sách tất cả lời chúc với: tên người gửi, nội dung, thời gian
- [ ] Có thể ẩn/hiện từng lời chúc (lời chúc bị ẩn không hiển thị trên thiệp)
- [ ] Có thể xóa lời chúc
- [ ] Có thể bật/tắt tính năng nhận lời chúc cho thiệp

---

### Story 8.6 — Hiển thị tài khoản ngân hàng nhận mừng cưới

> **Là** Người tạo thiệp (NTT),  
> **Tôi muốn** thêm thông tin tài khoản ngân hàng vào thiệp,  
> **Để** khách mời có thể chuyển tiền mừng cưới một cách thuận tiện.

**Acceptance Criteria:**

- [ ] Trong giao diện tùy chỉnh, có section "Tài khoản ngân hàng" với toggle bật/tắt
- [ ] Khi bật, có form nhập: Tên ngân hàng, Số tài khoản, Tên chủ tài khoản
- [ ] Hỗ trợ thêm nhiều tài khoản (ví dụ: tài khoản cô dâu và chú rể)
- [ ] Khi hiển thị trên thiệp, thông tin tài khoản được trình bày rõ ràng
- [ ] Có nút copy số tài khoản cho khách mời
- [ ] Khi tắt toggle, thông tin tài khoản không hiển thị trên thiệp (nhưng vẫn được lưu)
- [ ] Tính năng này chỉ hiển thị cho mẫu thiệp loại "Đám cưới" hoặc theo cấu hình mẫu

---

---

## EPIC 9 — Phân tích thiệp (F16)

### Story EPIC 9.0 (Tổng quát)

> **Là** Người tạo thiệp (NTT),  
> **Tôi muốn** xem số liệu phân tích về thiệp của mình,  
> **Để** biết thiệp được xem nhiều không, từ đâu và trên thiết bị nào.

---

### Story 9.1 — Xem tổng lượt xem thiệp

> **Là** Người tạo thiệp (NTT),  
> **Tôi muốn** xem tổng số lượt xem thiệp của mình,  
> **Để** biết có bao nhiêu người đã mở thiệp.

**Acceptance Criteria:**

- [ ] Trang phân tích hiển thị tổng lượt xem (page views) của thiệp
- [ ] Hiển thị lượt xem theo ngày dưới dạng biểu đồ đường (line chart)
- [ ] Có thể lọc theo khoảng thời gian: 7 ngày, 30 ngày, toàn bộ
- [ ] Phân biệt lượt xem duy nhất (unique views) và tổng lượt xem
- [ ] Dữ liệu cập nhật theo thời gian thực hoặc tối đa delay 1 giờ

---

### Story 9.2 — Xem phân tích theo thiết bị

> **Là** Người tạo thiệp (NTT),  
> **Tôi muốn** biết khách mời xem thiệp trên thiết bị nào,  
> **Để** hiểu hành vi người dùng và tối ưu trải nghiệm.

**Acceptance Criteria:**

- [ ] Hiển thị phân bổ lượt xem theo loại thiết bị: Mobile, Tablet, Desktop
- [ ] Hiển thị dưới dạng biểu đồ tròn (pie chart) hoặc thanh (bar chart) với phần trăm
- [ ] Hiển thị hệ điều hành phổ biến (iOS, Android, Windows, macOS)

---

### Story 9.3 — Xem nguồn truy cập

> **Là** Người tạo thiệp (NTT),  
> **Tôi muốn** biết khách mời đến từ kênh nào,  
> **Để** biết kênh chia sẻ nào hiệu quả nhất.

**Acceptance Criteria:**

- [ ] Hiển thị phân bổ lượt xem theo nguồn: Zalo, Facebook/Messenger, SMS, Direct (link trực tiếp), Khác
- [ ] Hiển thị dưới dạng bảng hoặc biểu đồ với số lượt và phần trăm
- [ ] Nguồn được xác định qua UTM parameters hoặc referrer header

---

### Story 9.4 — Dashboard tổng quan thiệp

> **Là** Người tạo thiệp (NTT),  
> **Tôi muốn** xem dashboard tổng quan cho từng thiệp,  
> **Để** có cái nhìn nhanh về hiệu suất thiệp mà không cần xem từng báo cáo riêng.

**Acceptance Criteria:**

- [ ] Dashboard hiển thị các KPI chính: Tổng lượt xem, Lượt xem hôm nay, Số RSVP, Số lời chúc
- [ ] Có biểu đồ lượt xem 7 ngày gần nhất
- [ ] Hiển thị trạng thái thiệp: Đang hoạt động / Hết hạn, ngày hết hạn
- [ ] Dashboard responsive trên mobile

---

---

## EPIC 10 — Form CTA & Pháp lý (F17, F18)

### Story EPIC 10.0 (Tổng quát)

> **Là** Khách vãng lai (KVL),  
> **Tôi muốn** đăng ký nhận tin tức, liên hệ hợp tác và được thông báo về chính sách bảo mật,  
> **Để** cập nhật thông tin mới nhất và tin tưởng sử dụng nền tảng.

---

### Story 10.1 — Đăng ký nhận bản tin (Newsletter)

> **Là** Khách vãng lai (KVL),  
> **Tôi muốn** đăng ký nhận bản tin từ Love Cards,  
> **Để** cập nhật các mẫu thiệp mới, khuyến mãi và tin tức từ nền tảng.

**Acceptance Criteria:**

- [ ] Có form đăng ký newsletter trên trang chủ (footer hoặc section riêng)
- [ ] Form chỉ yêu cầu nhập email
- [ ] Validate email hợp lệ trước khi submit
- [ ] Sau khi submit, hiển thị thông báo xác nhận (ví dụ: "Cảm ơn! Kiểm tra email để xác nhận đăng ký")
- [ ] Gửi email xác nhận double opt-in đến địa chỉ đã nhập
- [ ] Có link hủy đăng ký (unsubscribe) trong mỗi email bản tin
- [ ] Không gửi email marketing nếu chưa xác nhận double opt-in

---

### Story 10.2 — Form liên hệ B2B

> **Là** Khách vãng lai (KVL) đại diện doanh nghiệp,  
> **Tôi muốn** liên hệ với Love Cards để tìm hiểu về gói doanh nghiệp,  
> **Để** thảo luận về hợp tác mua thiệp số lượng lớn cho nhà hàng / event planner.

**Acceptance Criteria:**

- [ ] Có form liên hệ B2B trên trang chủ hoặc trang riêng
- [ ] Form có các trường: Tên công ty, Tên liên hệ, Email, Số điện thoại, Nhu cầu (textarea)
- [ ] Tất cả trường bắt buộc được validate trước khi submit
- [ ] Sau khi submit, hiển thị thông báo "Chúng tôi sẽ liên hệ lại trong vòng 24 giờ"
- [ ] Thông tin form được gửi đến email nội bộ của Love Cards
- [ ] Có CAPTCHA hoặc honeypot để chống spam

---

### Story 10.3 — Cookie Consent Banner

> **Là** Khách vãng lai (KVL),  
> **Tôi muốn** được thông báo về việc sử dụng cookie và có thể chấp nhận hoặc từ chối,  
> **Để** kiểm soát dữ liệu cá nhân của mình theo quy định pháp luật.

**Acceptance Criteria:**

- [ ] Banner cookie consent hiển thị lần đầu khi người dùng truy cập trang web
- [ ] Banner có nút "Chấp nhận tất cả" và "Chỉ cookie cần thiết"
- [ ] Có link đến trang Chính sách Cookie / Chính sách Bảo mật
- [ ] Sau khi người dùng chọn, banner không hiển thị lại (lưu trong cookie/localStorage)
- [ ] Lựa chọn của người dùng được tôn trọng: không load analytics cookie nếu từ chối
- [ ] Banner responsive trên mobile

---

### Story 10.4 — Trang Điều khoản sử dụng (Terms of Service)

> **Là** Khách vãng lai (KVL),  
> **Tôi muốn** đọc điều khoản sử dụng của Love Cards,  
> **Để** hiểu quyền và nghĩa vụ của mình khi sử dụng dịch vụ.

**Acceptance Criteria:**

- [ ] Có trang Điều khoản sử dụng tại URL `/dieu-khoan-su-dung`
- [ ] Nội dung bao gồm: phạm vi dịch vụ, quyền sở hữu trí tuệ, chính sách hoàn tiền, giới hạn trách nhiệm
- [ ] Trang có ngày cập nhật lần cuối
- [ ] Link đến trang này có trong footer và trong form đăng ký
- [ ] Trang responsive và dễ đọc trên mobile

---

### Story 10.5 — Trang Chính sách Bảo mật (Privacy Policy)

> **Là** Khách vãng lai (KVL),  
> **Tôi muốn** đọc chính sách bảo mật của Love Cards,  
> **Để** biết dữ liệu cá nhân của mình được thu thập và sử dụng như thế nào.

**Acceptance Criteria:**

- [ ] Có trang Chính sách Bảo mật tại URL `/chinh-sach-bao-mat`
- [ ] Nội dung tuân thủ Luật Bảo vệ dữ liệu cá nhân Việt Nam (PDPA)
- [ ] Bao gồm: loại dữ liệu thu thập, mục đích sử dụng, thời gian lưu trữ, quyền của người dùng
- [ ] Trang có ngày cập nhật lần cuối
- [ ] Link đến trang này có trong footer, cookie banner và form đăng ký

---

---

## EPIC 11 — Song ngữ & Responsive (F19, F20)

### Story EPIC 11.0 (Tổng quát)

> **Là** Khách vãng lai (KVL),  
> **Tôi muốn** sử dụng Love Cards bằng ngôn ngữ mình chọn và trên mọi thiết bị,  
> **Để** có trải nghiệm tốt nhất dù dùng điện thoại hay máy tính, dù là người Việt hay Việt kiều.

---

### Story 11.1 — Chuyển đổi ngôn ngữ Tiếng Việt / Tiếng Anh

> **Là** Khách vãng lai (KVL),  
> **Tôi muốn** chuyển đổi giao diện giữa Tiếng Việt và Tiếng Anh,  
> **Để** sử dụng nền tảng bằng ngôn ngữ mình thành thạo hơn.

**Acceptance Criteria:**

- [ ] Có nút chuyển đổi ngôn ngữ (VI / EN) trên header, hiển thị trên mọi trang
- [ ] Mặc định là Tiếng Việt
- [ ] Khi chuyển ngôn ngữ, toàn bộ giao diện (menu, nút, thông báo, placeholder) chuyển sang ngôn ngữ tương ứng
- [ ] Lựa chọn ngôn ngữ được lưu trong localStorage và áp dụng cho các lần truy cập sau
- [ ] URL không thay đổi khi chuyển ngôn ngữ (không dùng `/vi/` hay `/en/` prefix)
- [ ] Nội dung do người dùng nhập (tên sự kiện, lời chúc...) không bị dịch tự động
- [ ] Tất cả thông báo lỗi và validation message cũng được dịch

---

### Story 11.2 — Giao diện responsive trên Mobile (320px - 767px)

> **Là** Khách vãng lai (KVL) dùng điện thoại,  
> **Tôi muốn** sử dụng Love Cards trên điện thoại một cách mượt mà,  
> **Để** duyệt mẫu, mua và chia sẻ thiệp ngay trên điện thoại mà không gặp khó khăn.

**Acceptance Criteria:**

- [ ] Tất cả trang hiển thị đúng trên viewport 320px - 767px
- [ ] Navigation chuyển sang hamburger menu trên mobile
- [ ] Các nút và link có kích thước tối thiểu 44x44px (touch target)
- [ ] Font size tối thiểu 14px trên mobile
- [ ] Không có horizontal scroll trên bất kỳ trang nào
- [ ] Form input không bị zoom khi focus trên iOS (font-size >= 16px)
- [ ] Trang thiệp (card view) tối ưu cho mobile: chiếm toàn màn hình, dễ scroll

---

### Story 11.3 — Giao diện responsive trên Tablet (768px - 1279px)

> **Là** Khách vãng lai (KVL) dùng tablet,  
> **Tôi muốn** sử dụng Love Cards trên tablet với layout phù hợp,  
> **Để** có trải nghiệm tốt hơn mobile nhưng không bị layout bị vỡ.

**Acceptance Criteria:**

- [ ] Tất cả trang hiển thị đúng trên viewport 768px - 1279px
- [ ] Grid danh mục mẫu hiển thị 2-3 cột trên tablet
- [ ] Navigation hiển thị đầy đủ hoặc dạng compact (không hamburger)
- [ ] Giao diện tùy chỉnh thiệp có layout 2 cột (form + preview) trên tablet

---

### Story 11.4 — Giao diện responsive trên Desktop (1280px - 2560px)

> **Là** Khách vãng lai (KVL) dùng máy tính,  
> **Tôi muốn** sử dụng Love Cards trên màn hình lớn với layout tối ưu,  
> **Để** tận dụng không gian màn hình để xem nhiều mẫu hơn và tùy chỉnh dễ hơn.

**Acceptance Criteria:**

- [ ] Tất cả trang hiển thị đúng trên viewport 1280px - 2560px
- [ ] Content có max-width hợp lý (ví dụ: 1440px) và căn giữa trên màn hình rất rộng
- [ ] Grid danh mục mẫu hiển thị 3-4 cột trên desktop
- [ ] Giao diện tùy chỉnh thiệp có layout 2 cột rõ ràng: panel chỉnh sửa bên trái, preview bên phải
- [ ] Không có layout bị vỡ hay overflow trên màn hình 2560px

---

---

## EPIC 12 — Admin Panel (F21, F22, F23)

### Story EPIC 12.0 (Tổng quát)

> **Là** Admin (ADM),  
> **Tôi muốn** có một panel quản trị riêng biệt để vận hành nền tảng Love Cards,  
> **Để** quản lý mẫu thiệp, theo dõi đơn hàng và doanh thu, và quản lý người dùng một cách hiệu quả.

---

### Story 12.1 — Đăng nhập Admin Panel

> **Là** Admin (ADM),  
> **Tôi muốn** đăng nhập vào Admin Panel bằng tài khoản riêng,  
> **Để** truy cập các chức năng quản trị mà người dùng thường không thể truy cập.

**Acceptance Criteria:**

- [ ] Admin Panel là ứng dụng riêng biệt (subdomain hoặc path riêng, ví dụ: `admin.lovecards.vn`)
- [ ] Trang đăng nhập Admin chỉ chấp nhận tài khoản có role Admin
- [ ] Đăng nhập bằng email và mật khẩu (không có OAuth social login)
- [ ] Sau 5 lần đăng nhập sai, tài khoản bị khóa tạm thời 15 phút
- [ ] Session Admin hết hạn sau 8 giờ không hoạt động
- [ ] Mọi hành động quan trọng trong Admin được ghi log (audit trail)

---

### Story 12.2 — Quản lý mẫu thiệp (Upload và cấu hình)

> **Là** Admin (ADM),  
> **Tôi muốn** upload và cấu hình mẫu thiệp mới lên nền tảng,  
> **Để** bổ sung mẫu mới cho người dùng lựa chọn.

**Acceptance Criteria:**

- [ ] Có trang danh sách mẫu thiệp với: tên, loại sự kiện, giá, trạng thái (active/inactive), ngày tạo
- [ ] Có form upload mẫu mới với các trường: Tên mẫu, Loại sự kiện, Mô tả, Giá, Tags
- [ ] Upload file HTML mẫu thiệp và các assets đi kèm (CSS, JS, hình ảnh)
- [ ] Cấu hình danh sách trường động (dynamic fields) cho mẫu: tên trường, loại input, bắt buộc/không
- [ ] Preview mẫu trước khi publish
- [ ] Bật/tắt mẫu (active/inactive) — mẫu inactive không hiển thị trong danh mục công khai
- [ ] Chỉnh sửa thông tin mẫu đã upload (tên, giá, mô tả, tags)
- [ ] Xóa mẫu (chỉ xóa được mẫu chưa có đơn hàng nào)
- [ ] Upload thumbnail cho mẫu (JPG/PNG, tỷ lệ 4:3 hoặc theo chuẩn)

---

### Story 12.3 — Quản lý mẫu thiệp (Danh sách và tìm kiếm)

> **Là** Admin (ADM),  
> **Tôi muốn** tìm kiếm và lọc danh sách mẫu thiệp,  
> **Để** nhanh chóng tìm và quản lý mẫu cụ thể trong số nhiều mẫu.

**Acceptance Criteria:**

- [ ] Có thanh tìm kiếm theo tên mẫu
- [ ] Có bộ lọc theo: loại sự kiện, trạng thái (active/inactive), khoảng giá
- [ ] Có thể sắp xếp theo: ngày tạo, tên, giá, số lượt mua
- [ ] Phân trang danh sách (20 mẫu/trang)
- [ ] Hiển thị tổng số mẫu và số mẫu đang active

---

### Story 12.4 — Xem danh sách đơn hàng

> **Là** Admin (ADM),  
> **Tôi muốn** xem danh sách tất cả đơn hàng trên nền tảng,  
> **Để** theo dõi tình trạng thanh toán và xử lý các vấn đề phát sinh.

**Acceptance Criteria:**

- [ ] Trang đơn hàng hiển thị danh sách với: mã đơn, tên người dùng, mẫu thiệp, gói hosting, tổng tiền, phương thức thanh toán, trạng thái, ngày tạo
- [ ] Trạng thái đơn hàng: Chờ thanh toán, Đã thanh toán, Đã hủy
- [ ] Có thể lọc theo: trạng thái, phương thức thanh toán, khoảng thời gian
- [ ] Có thể tìm kiếm theo mã đơn hoặc email người dùng
- [ ] Click vào đơn hàng xem chi tiết đầy đủ
- [ ] Có thể thủ công xác nhận thanh toán cho đơn chuyển khoản (nếu hệ thống tự động không nhận diện được)
- [ ] Có thể hủy đơn hàng với lý do

---

### Story 12.5 — Xem báo cáo doanh thu

> **Là** Admin (ADM),  
> **Tôi muốn** xem báo cáo doanh thu theo thời gian,  
> **Để** theo dõi hiệu suất kinh doanh và đưa ra quyết định.

**Acceptance Criteria:**

- [ ] Dashboard doanh thu hiển thị: Tổng doanh thu, Doanh thu tháng này, Số đơn hàng, Giá trị đơn trung bình
- [ ] Biểu đồ doanh thu theo ngày/tuần/tháng
- [ ] Phân tích doanh thu theo: mẫu thiệp (top mẫu bán chạy), phương thức thanh toán, gói hosting
- [ ] Có thể lọc báo cáo theo khoảng thời gian tùy chọn
- [ ] Có thể xuất báo cáo ra file CSV hoặc Excel

---

### Story 12.6 — Quản lý người dùng

> **Là** Admin (ADM),  
> **Tôi muốn** xem và quản lý danh sách người dùng trên nền tảng,  
> **Để** hỗ trợ người dùng và xử lý các trường hợp vi phạm.

**Acceptance Criteria:**

- [ ] Trang người dùng hiển thị danh sách với: tên, email, SĐT, phương thức đăng ký, ngày tạo, trạng thái (active/blocked), số đơn hàng
- [ ] Có thể tìm kiếm theo email, tên, SĐT
- [ ] Có thể lọc theo: trạng thái, phương thức đăng ký, khoảng thời gian
- [ ] Click vào người dùng xem chi tiết: thông tin cá nhân, lịch sử đơn hàng, danh sách thiệp
- [ ] Có thể khóa tài khoản người dùng (blocked) với lý do
- [ ] Có thể mở khóa tài khoản đã bị khóa
- [ ] Tài khoản bị khóa không thể đăng nhập và nhận thông báo khi cố đăng nhập

---

### Story 12.7 — Xem thống kê tổng quan (Admin Dashboard)

> **Là** Admin (ADM),  
> **Tôi muốn** xem dashboard tổng quan về tình trạng nền tảng,  
> **Để** nắm bắt nhanh các chỉ số quan trọng mà không cần vào từng báo cáo riêng.

**Acceptance Criteria:**

- [ ] Dashboard hiển thị các KPI chính: Tổng người dùng, Người dùng mới hôm nay, Tổng đơn hàng, Doanh thu hôm nay, Số mẫu đang active
- [ ] Biểu đồ đơn hàng và doanh thu 30 ngày gần nhất
- [ ] Danh sách 5 đơn hàng mới nhất
- [ ] Cảnh báo nếu có đơn hàng chờ xác nhận thanh toán thủ công quá 1 giờ
- [ ] Dashboard tự động refresh mỗi 5 phút hoặc có nút refresh thủ công

---

---

## Phụ lục A — Tổng hợp User Stories theo Persona

| Persona | Số lượng Stories | Epics liên quan |
|---------|-----------------|-----------------|
| Khách vãng lai (KVL) | 18 | EPIC 1, 2, 3, 4, 10, 11 |
| Người dùng đã đăng nhập (NDL) | 10 | EPIC 3, 4, 6 |
| Người tạo thiệp (NTT) | 14 | EPIC 5, 6, 7, 8, 9 |
| Khách mời (KM) | 4 | EPIC 8 |
| Admin (ADM) | 7 | EPIC 12 |

---

## Phụ lục B — Ma trận Story vs Tính năng BRD

| Story | Tính năng BRD | Ưu tiên |
|-------|--------------|---------|
| 1.1 - 1.7 | F01 | Cao |
| 2.1 - 2.6 | F02, F03 | Cao |
| 3.1 - 3.4 | F04, F06 | Cao |
| 4.1 - 4.6 | F05 | Cao |
| 5.1 - 5.5 | F07 | Cao |
| 6.1 - 6.7 | F08, F09, F10 | Cao |
| 7.1 - 7.5 | F11, F12 | Cao |
| 8.1 - 8.6 | F13, F14, F15 | Trung bình |
| 9.1 - 9.4 | F16 | Trung bình |
| 10.1 - 10.5 | F17, F18 | Thấp - Cao |
| 11.1 - 11.4 | F19, F20 | Trung bình - Cao |
| 12.1 - 12.7 | F21, F22, F23 | Cao - Trung bình |

---

## Phụ lục C — Yêu cầu phi chức năng (Non-Functional Requirements)

Các yêu cầu phi chức năng sau đây áp dụng xuyên suốt tất cả stories:

### Hiệu năng
- Trang chủ và trang danh mục tải trong vòng 3 giây trên kết nối 4G
- Trang thiệp (card view) tải trong vòng 5 giây trên kết nối 4G
- API response time < 500ms cho 95% requests

### Bảo mật
- Toàn bộ traffic qua HTTPS (TLS 1.2+)
- Mật khẩu được hash bằng bcrypt (cost factor >= 12)
- Mật khẩu tối thiểu 8 ký tự, bao gồm chữ và số
- Input validation và sanitization trên cả client và server
- Rate limiting cho các API nhạy cảm (đăng nhập, OTP, thanh toán)
- Thông tin thẻ thanh toán không được lưu trên server Love Cards

### Khả dụng
- Không đặt SLA cụ thể trong giai đoạn MVP
- Có trang thông báo bảo trì khi hệ thống downtime có kế hoạch

### Khả năng mở rộng
- Kiến trúc hỗ trợ thêm CTV, custom domain, app native trong tương lai
- Database schema hỗ trợ multi-language content

### Pháp lý
- Tuân thủ Luật Bảo vệ dữ liệu cá nhân Việt Nam (PDPA)
- Cookie consent theo tiêu chuẩn GDPR-inspired
- Có chính sách bảo mật và điều khoản sử dụng rõ ràng

---

## Phụ lục D — Định nghĩa "Done" (Definition of Done)

Một User Story được coi là **Done** khi:

1. **Code hoàn chỉnh:** Tất cả Acceptance Criteria đã được implement
2. **Unit tests:** Các logic nghiệp vụ quan trọng có unit test
3. **Responsive:** Đã kiểm tra trên mobile (375px), tablet (768px) và desktop (1280px)
4. **Cross-browser:** Hoạt động đúng trên Chrome, Safari, Firefox (phiên bản mới nhất)
5. **Accessibility:** Các element tương tác có aria-label, keyboard navigable
6. **Song ngữ:** Tất cả text UI đã có bản dịch Tiếng Anh
7. **Performance:** Không làm giảm Lighthouse score dưới 70 (Performance)
8. **Review:** Đã được Product Owner review và chấp nhận

---

*Tài liệu này được tạo dựa trên LoveCards-BRD-v1.0.md. Mọi thay đổi yêu cầu cần được cập nhật đồng bộ với BRD và được Product Owner phê duyệt.*

*Phiên bản: 1.0 | Ngày tạo: 2025 | Tổng số stories: 53*
