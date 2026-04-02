# Đặc tả kỹ thuật: Component thẻ sản phẩm mẫu thiệp

| Thuộc tính | Giá trị |
|------------|---------|
| Mã tài liệu | LC-SPEC-CARD-001 |
| Phiên bản | 1.1 |
| Trạng thái | Hiệu lực |
| Đối tượng sử dụng | Đội phát triển frontend, thiết kế UI/UX |
| Sản phẩm tham chiếu | LoveCards |

## 1. Tóm tắt

Tài liệu mô tả yêu cầu đối với **component hiển thị danh sách mẫu thiệp dạng thẻ**, trong đó mỗi thẻ nhúng bản xem trước HTML qua `iframe` và cung cấp hoạt ảnh xem trước nội dung theo tương tác (ưu tiên chuột). Mục tiêu là đạt trải nghiệm trình bày chuyên nghiệp, hiệu năng ổn định khi render đồng thời nhiều thẻ, và hành vi rõ ràng trên thiết bị đa dạng.

## 2. Phạm vi và giả định

**Trong phạm vi**

- Giao diện một thẻ và tập hợp thẻ (grid).
- Cơ chế xem trước và hoạt ảnh theo đặc tả mục 4–5.
- Ràng buộc hiệu năng và responsive cơ bản.

**Ngoài phạm vi (ghi nhận, không bắt buộc triển khai trong phiên bản đầu)**

- CMS quản lý mẫu, phân quyền, thanh toán.
- Tối ưu SEO cho nội dung bên trong iframe.
- Kiểm thử tự động E2E chi tiết (có thể bổ sung sau).

**Giả định**

- Nguồn HTML nhúng trong iframe là **tin cậy** (same-origin hoặc domain được kiểm soát).
- Trình duyệt mục tiêu: bản hiện đại hỗ trợ CSS `transform` và `iframe` sandboxing theo chính sách bảo mật dự án.

## 3. Thuật ngữ

| Thuật ngữ | Định nghĩa ngắn |
|-----------|------------------|
| Thẻ (card) | Khối UI chứa preview, metadata (tiêu đề, mô tả) và tùy chọn hành động. |
| Vùng xem trước | Khung cố định hiển thị một phần nội dung iframe; nội dung có thể dịch chuyển để mô phỏng “quét” trang. |
| Trạng thái mặc định | Trạng thái khi người dùng không hover và chưa kích hoạt chế độ dành cho cảm ứng. |

## 4. Yêu cầu chức năng

| ID | Mức độ | Mô tả |
|----|--------|--------|
| FR-01 | Bắt buộc | Hiển thị danh sách thẻ theo **lưới responsive**; số cột thay đổi theo breakpoint (mobile, tablet, desktop). |
| FR-02 | Bắt buộc | Mỗi thẻ tương ứng **một mẫu**; có **tiêu đề** và **mô tả ngắn** hiển thị rõ ràng. |
| FR-03 | Bắt buộc | Vùng xem trước dùng **`<iframe>`** tải trang HTML mẫu; chiều cao khung **cố định** theo thiết kế; nội dung được **cắt trong khung** (không phá layout trang chứa). |
| FR-04 | Bắt buộc | **Không** hiển thị thanh cuộn (scrollbar) bên trong iframe ở trạng thái bình thường. |
| FR-05 | Khuyến nghị | Hiển thị **badge** hướng dẫn (ví dụ: hành vi xem trước khi hover). |
| FR-06 | Khuyến nghị | Cho phép **mở xem đầy đủ** (modal hoặc tab mới) khi người dùng chọn thẻ hoặc nút kèm theo. |
| FR-07 | Khuyến nghị | Danh sách thẻ **lấy từ dữ liệu** (props, API, cấu hình), tránh hard-code danh sách cố định trong component. |

## 5. Yêu cầu tương tác và trạng thái

| ID | Mức độ | Mô tả |
|----|--------|--------|
| IX-01 | Bắt buộc | **Trạng thái nghỉ:** chỉ phần trên của nội dung iframe nằm trong vùng nhìn thấy; thẻ có phân tầng thị giác (đổ bóng / elevation nhẹ). |
| IX-02 | Bắt buộc | **Hover (chuột):** nội dung iframe **dịch chuyển dọc mượt** (mô phỏng xem toàn trang); dùng **`transform: translateY()`**, không dùng cuộn nội dung thật trong iframe làm cơ chế chính của hiệu ứng. |
| IX-03 | Bắt buộc | **Rời hover:** nội dung **trở về** vị trí ban đầu với transition mượt, không giật. |
| IX-04 | Bắt buộc | Áp dụng **`pointer-events: none`** trên nội dung iframe (hoặc lớp che phù hợp) để hover được nhận trên **toàn vùng thẻ**, tránh xung đột với tương tác bên trong iframe. |
| IX-05 | Bắt buộc | **Thiết bị cảm ứng:** cung cấp phương án thay thế hover — ví dụ **một lần chạm** để bật/tắt hoạt ảnh, hoặc **tự chạy theo chu kỳ** có thể cấu hình. |
| IX-06 | Khuyến nghị | Tham số hoạt ảnh (**thời lượng**, **easing**, **biên độ dịch**) có thể **cấu hình từ bên ngoài** component. |

**Tham số gợi ý (mặc định có thể điều chỉnh)**

| Tham số | Gợi ý | Ghi chú |
|---------|--------|---------|
| Thời lượng một chiều hover | 3–8 giây | Tùy chiều cao nội dung và nhịp thương hiệu. |
| Easing | `ease-in-out` hoặc `cubic-bezier` tùy chỉnh | Ưu tiên cảm giác “mượt, có nhịp”. |

## 6. Yêu cầu phi chức năng

| ID | Mức độ | Mô tả |
|----|--------|--------|
| NFR-01 | Bắt buộc | Hoạt ảnh ưu tiên thuộc tính **`transform`**, **`opacity`**; hạn chế thuộc tính gây **reflow** lặp trong khung hình. |
| NFR-02 | Bắt buộc | Khi nhiều thẻ cùng hiển thị, không gây **giật layout** rõ rệt trên thiết bị tầm trung (đo bằng quan sát UX; có thể bổ sung chỉ số FPS nếu dự án yêu cầu). |
| NFR-03 | Khuyến nghị | Nội dung iframe: hạn chế script nặng; **không** autoplay âm thanh; tắt loader không cần thiết nếu kiểm soát được. |
| NFR-04 | Khuyến nghị | Mã **module hóa**, dễ bảo trì; phụ thuộc bên thứ ba **tối thiểu**. |

## 7. Hướng dẫn UI/UX

- **Hình học thẻ:** bo góc tối thiểu **16px** (hoặc token thiết kế tương đương); đổ bóng mềm; có thể nâng nhẹ (lift) khi hover.
- **Typography:** phân cấp rõ giữa tiêu đề và mô tả; đảm bảo độ tương phản đọc được (WCAG theo khả năng dự án).
- **Lớp phủ (tùy chọn):** gradient hoặc nền kính mờ trên vùng metadata để chữ không chồng lên chi tiết phức tạp của preview.
- **Vi tương tác:** scale hoặc lift **dưới ngưỡng gây khó chịu**; thời gian transition **thống nhất** trong cùng một màn hình.

## 8. Ràng buộc kỹ thuật

- **Ngăn xếp:** có thể triển khai bằng HTML/CSS/JS thuần hoặc **component React** tương đương (phù hợp codebase LoveCards hiện tại).
- **Bảo mật iframe:** tuân thủ `sandbox` / CSP theo chính sách dự án khi nhúng nội dung ngoài.
- **Truy cập:** nút và vùng chạm đủ kích thước tối thiểu khuyến nghị cho mobile; nhãn trợ năng (`aria-*`) cho các trạng thái mở/đóng nếu có panel hoặc modal.

## 9. Tiêu chí nghiệm thu (Acceptance)

- [ ] Grid hiển thị đúng trên ít nhất ba nhóm breakpoint đã thống nhất trong dự án.
- [ ] Mỗi thẻ có iframe, tiêu đề, mô tả; không có scrollbar lộ trong iframe ở trạng thái chuẩn.
- [ ] Hover: chuyển động dọc mượt bằng `translateY`; rời hover: khôi phục vị trí ban đầu.
- [ ] Touch: có hành vi thay thế hover, đã ghi rõ trong release note hoặc storybook.
- [ ] Không có reflow nặng khi hover nhiều thẻ tuần tự (kiểm tra thủ công hoặc Performance panel).
- [ ] (Nếu có FR-06) Đường dẫn mở xem đầy đủ hoạt động và không gãy focus trap nghiêm trọng.

## 10. Đầu ra bàn giao

1. Mã nguồn component (và style kèm theo) tích hợp được vào ứng dụng.
2. Props / API component được mô tả ngắn (JSDoc, Storybook, hoặc mục trong README kỹ thuật).
3. Danh sách tham số hoạt ảnh có thể cấu hình (nếu triển khai IX-06).

---

**Phê duyệt:** theo quy trình nội bộ dự án. **Cập nhật:** ghi chú phiên bản và ngày khi thay đổi yêu cầu bắt buộc (FR/IX/NFR).
