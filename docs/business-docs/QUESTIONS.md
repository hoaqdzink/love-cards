# Questions for Clarification

## Tóm tắt phân tích dự án (theo tài liệu và mã nguồn hiện có)

### Module chính (hiện trạng / kế hoạch trong repo & README)

| Nhóm | Ghi chú |
| ---- | ------- |
| **Marketing & khám phá** | Trang chủ (`HomePage`) với các section: Hero, phong cách (category), mẫu thiệp (grid + iframe preview), trending, quy trình, gallery, testimonial, CTA (thu thập email), footer. |
| **Thư viện mẫu (catalog)** | Component `CardProduct` / grid — hiển thị mẫu từ dữ liệu (hiện: file tĩnh + HTML trong `public/card-previews/`). |
| **Auth / User / Product (theo cấu trúc dự kiến)** | Được mô tả trong `project-structure.md` nhưng **chưa có implementation** trong `src/features/` (chỉ có `home`). |
| **Hạ tầng ứng dụng** | SPA React, routing mới có `/`; chưa thấy tích hợp backend/API trong code. |

### Luồng nghiệp vụ (đã mô tả ở README; chưa đủ chi tiết để BRD)

1. Người dùng **khám phá** mẫu thiệp (trang chủ / catalog).
2. Người dùng **tùy chỉnh** nội dung (thông tin, hình ảnh, âm nhạc) — *chi tiết nghiệp vụ chưa có trong repo*.
3. Người dùng **chia sẻ** thiệp qua link (Zalo, Messenger, SMS) — *cơ chế kỹ thuật & quyền truy cập chưa được đặc tả*.

### Entity chính (suy ra từ mô tả sản phẩm; chưa có schema/API)

| Entity | Vai trò dự kiến |
| ------ | ---------------- |
| **Người dùng / Cặp đôi** | Tạo và quản lý thiệp; có thể cần tài khoản (chưa rõ). |
| **Mẫu thiệp (template)** | Sản phẩm trong catalog; có metadata (tiêu đề, mô tả, preview HTML…). |
| **Thiệp đã tùy chỉnh (invitation / project)** | Bản thiệp sau khi chỉnh sửa; trạng thái publish, URL chia sẻ. |
| **Nội dung & media** | Ảnh, chữ, nhạc gắn với thiệp — giới hạn và bản quyền chưa đặc tả. |
| **Lead / đăng ký** | Form email trên CTA — mục đích xử lý dữ liệu chưa rõ. |

---

| ID | Question | Impact | Context |
| -- | -------- | ------ | ------- |
| Q01 | Phạm vi sản phẩm theo giai đoạn (MVP vs v1 đầy đủ): những capability nào **bắt buộc** trong phát hành đầu tiên và cái nào **cố ý** để sau? | Phân chia phạm vi BRD, ưu tiên đầu tư và tiêu chí nghiệm thu. | README mô tả khám phá + tùy chỉnh + chia sẻ; code hiện mới có landing & preview mẫu. |
| Q02 | Mô hình kinh doanh dự kiến là gì (hoàn toàn miễn phí, freemium, trả phí theo mẫu/gói, quảng cáo, B2B cho nhà hàng tiệc cưới…)? | Quyết định luồng thanh toán, giới hạn tính năng, và yêu cầu pháp lý/hóa đơn. | Chưa có dấu hiệu monetization trong repo. |
| Q03 | Đối tượng người dùng chính và thị trường ưu tiên (chỉ Việt Nam, đa ngôn ngữ, đối tượng tuổi/hành vi)? | Ảnh hưởng copy, i18n, kênh chia sẻ, và tuân thủ dữ liệu cá nhân. | README tiếng Việt; chưa có spec đa ngôn ngữ. |
| Q04 | Có cần **tài khoản** để dùng dịch vụ không? Nếu có: bắt buộc từ bước nào (chỉnh sửa, lưu nháp, publish)? Hỗ trợ đăng nhập nào (email, Google, Apple, số điện thoại)? | BRD phần đăng ký/đăng nhập, quản lý phiên, khôi phục tài khoản. | Cấu trúc có `features/auth` nhưng chưa triển khai. |
| Q05 | Một người / một cặp được tạo **bao nhiêu** thiệp đồng thời? Có giới hạn theo gói hoặc theo sự kiện không? | Quy tắc nghiệp vụ, dashboard, và billing nếu có. | Chưa đặc tả. |
| Q06 | Quy trình nghiệp vụ chi tiết từ “chọn mẫu” → “chỉnh sửa” → “xem trước” → “xuất bản” → “chia sẻ” là gì? Có bước duyệt/phê duyệt nội bộ không? | Luồng end-to-end, màn hình, trạng thái thiệp trong BRD. | README chỉ liệt kê cấp cao. |
| Q07 | **Tùy chỉnh** cho phép những trường thông tin nào (tên cô dâu/chú rể, thời gian, địa điểm, story, số tài khoản nhận mừng cưới…)? Trường nào bắt buộc/tùy chọn? | Đặc tả form/editor, validation, template binding. | README nói “thông tin, hình ảnh, âm nhạc” nhưng không chi tiết. |
| Q08 | Giới hạn kỹ thuật và nghiệp vụ đối với **hình ảnh** (dung lượng, số lượng, crop, CDN) và **âm nhạc** (upload, thư viện có sẵn, bản quyền, tắt autoplay theo chính sách)? | Yêu cầu lưu trữ, xử lý media, và rủi ro pháp lý. | `card-product.md` khuyến nghị không autoplay âm thanh; chưa có policy tổng thể. |
| Q09 | Thiệp sau khi publish được **host** ở đâu (subdomain LoveCards, custom domain, chỉ file tĩnh)? Có yêu cầu HTTPS, thời gian sống của link, hoặc gỡ xuống? | Kiến trúc triển khai, SLA, và trải nghiệm khách mời. | Chưa đặc tả. |
| Q10 | Link chia sẻ cần hỗ trợ những gì: preview khi share (Open Graph), ảnh thumbnail, tiêu đề/mô tả tùy chỉnh? | Yêu cầu meta tags, backend generate preview, hoặc dịch vụ ảnh. | README nhắc Zalo/Messenger/SMS nhưng không mô tả hành vi preview. |
| Q11 | Có cần tính năng **RSVP / xác nhận tham dự / số khách**, hoặc thu thập lời chúc? Nếu có, dữ liệu ai được xem và xuất ra định dạng nào? | Phạm vi module sự kiện, quyền riêng tư, GDPR/PDPA Việt Nam. | Không thấy trong code hiện tại. |
| Q12 | Có yêu cầu **bảo vệ thiệp** (mật khẩu, chỉ danh sách khách, hết hạn sau ngày cưới)? | Thiết kế auth nhẹ cho khách xem, và lưu trữ secrets. | Chưa đặc tả. |
| Q13 | Ai là **nguồn sở hữu và vận hành** thư viện mẫu (nội bộ thiết kế, cộng tác viên, nhập từ bên thứ ba)? Quy trình **thêm/sửa/ngừng** một mẫu? | BRD phần CMS/admin, phân quyền nội dung. | `card-product.md` ghi CMS ngoài phạm vi phiên bản đầu nhưng chưa có quyết định sản phẩm. |
| Q14 | Tiêu chí **phân loại / gắn tag** mẫu thiệp (phong cách, màu, mùa, giá…) và có **tìm kiếm/lọc** trên catalog không? | Cấu trúc dữ liệu template và UX danh mục. | Trang chủ có section category; chưa có spec dữ liệu. |
| Q15 | Section **testimonial / gallery / trending / số liệu “lượt dùng”** trên landing: đây là nội dung marketing cố định, hay phải **đồng bộ số thật** từ hệ thống? | Yêu cầu CMS, analytics, và trung thực marketing. | Dữ liệu hiện mang tính minh họa trong code. |
| Q16 | Form **email ở CTA**: mục đích chính (newsletter, waitlist, liên hệ bán hàng), bên xử lý (CRM/ESP cụ thể), và chính sách **double opt-in / unsubscribe**? | Tuân thủ spam/marketing và tích hợp kỹ thuật. | `CTASection` tồn tại; luồng backend chưa rõ. |
| Q17 | Yêu cầu **phân tích & báo cáo** cho chủ thiệp (lượt xem, thiết bị, nguồn traffic, tỉ lệ mở link)? | Ưu tiên product analytics và privacy notice. | Chưa đặc tả. |
| Q18 | Có tích hợp **thanh toán** (mừng cưới online, nâng cấp gói) trong phạm vi sản phẩm không? Nếu có: cổng thanh toán và quy trình hoàn/hủy? | Phạm vi tài chính, PCI, và hỗ trợ khách hàng. | Không thấy trong codebase. |
| Q19 | Yêu cầu **tuân thủ pháp lý** cụ thể (Luật Bảo vệ dữ liệu cá nhân tại VN, cookie consent, điều khoản sử dụng, miễn trừ bản quyền nội dung người dùng)? | Phần pháp lý BRD và UX consent. | Chưa có tài liệu trong repo. |
| Q20 | **KPI / thành công** đo bằng gì (số thiệp publish, MAU, tỉ lệ chuyển đổi từ xem mẫu → hoàn thành thiệp, NPS…)? | Phạm vi đo lường và ưu tiên roadmap. | Chưa đặc tả. |
| Q21 | Ràng buộc **phi chức năng** do kinh doanh đặt ra (thời gian phản hồi trang khách mời, số khách đồng thời, backup dữ liệu, RTO/RPO)? | SLA và kiến trúc hạ tầng trong BRD. | Chỉ có NFR giao diện trong `card-product.md`. |
| Q22 | Có kế hoạch **ứng dụng di động native** hay chỉ web responsive/PWA? | Phạm vi nền tảng và thông báo đẩy. | README nhấn mạnh web/mobile-friendly. |
| Q23 | Ai là **stakeholder** phê duyệt BRD và sản phẩm (vai trò: chủ sản phẩm, marketing, pháp chế, kỹ thuật)? | Quy trình chấp nhận và governance tài liệu. | Không có trong repo. |

---

*Sau khi điền câu trả lời trực tiếp trong bảng (cột hoặc ghi chú dưới từng ID), tài liệu sẽ đủ cơ sở để soạn BRD (Phase 2) mà không suy đoán thêm.*
