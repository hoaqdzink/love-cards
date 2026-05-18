# Tài Liệu Yêu Cầu

## Giới Thiệu

Love Cards là nền tảng tạo và chia sẻ thiệp mời kỹ thuật số trực tuyến, hướng đến thị trường Việt Nam. Nền tảng cho phép người dùng duyệt, tùy chỉnh, mua và chia sẻ thiệp mời cho các sự kiện cưới, sinh nhật và tiệc. Dịch vụ hoạt động theo mô hình trả phí theo mẫu, hỗ trợ song ngữ (Tiếng Việt + Tiếng Anh) và giao diện web responsive.

## Bảng Thuật Ngữ

- **Nền_Tảng**: Ứng dụng web Love Cards tại lovecards.vn
- **Người_Dùng**: Người duyệt, tùy chỉnh, mua hoặc quản lý thiệp mời
- **Khách_Mời**: Người nhận và xem thiệp mời được chia sẻ qua link
- **Mẫu_Thiệp**: Bố cục thiệp mời được thiết kế sẵn với các trường thông tin có thể cấu hình
- **Thiệp**: Thiệp mời đã được tùy chỉnh từ Mẫu_Thiệp bởi Người_Dùng
- **Giỏ_Hàng**: Tập hợp các Mẫu_Thiệp được Người_Dùng chọn để mua
- **Giỏ_Hàng_Cookie**: Giỏ hàng tạm thời lưu trong cookie trình duyệt cho Người_Dùng chưa đăng nhập
- **Giỏ_Hàng_DB**: Giỏ hàng lưu trữ lâu dài trong cơ sở dữ liệu cho Người_Dùng đã đăng nhập
- **Trình_Chỉnh_Sửa**: Giao diện nơi Người_Dùng tùy chỉnh các trường và hình ảnh của Mẫu_Thiệp
- **Trang_Xem_Thiệp**: Trang công khai nơi Khách_Mời xem Thiệp được chia sẻ
- **Trang_Quản_Trị**: Ứng dụng riêng biệt để quản lý mẫu thiệp, đơn hàng, doanh thu và người dùng
- **RSVP**: Tính năng cho phép Khách_Mời xác nhận tham dự và số người đi cùng
- **Bảng_Lời_Chúc**: Tính năng cho phép Khách_Mời gửi lời chúc hiển thị trên Thiệp
- **Gói_Hosting**: Gói thời gian xác định thời gian Thiệp đã xuất bản còn truy cập được
- **Xem_Trước_Mạng_Xã_Hội**: Metadata (ảnh, tiêu đề, mô tả) hiển thị khi link Thiệp được chia sẻ lên mạng xã hội
- **Trường_Động**: Trường nhập liệu có thể cấu hình được định nghĩa bởi Mẫu_Thiệp (ví dụ: tên, ngày, địa điểm)
- **Danh_Mục**: Bộ sưu tập Mẫu_Thiệp có thể duyệt với tính năng tìm kiếm và lọc
- **Cổng_Thanh_Toán**: Dịch vụ bên thứ ba xử lý thanh toán (chuyển khoản, ví điện tử, thẻ quốc tế)
- **Cộng_Tác_Viên**: Vai trò tương lai cho phép nhà thiết kế bên ngoài tải lên mẫu thiệp để admin duyệt

## Các Yêu Cầu

### Yêu Cầu 1: Hiển Thị Trang Chủ

**Câu Chuyện Người Dùng:** Là Người_Dùng, tôi muốn xem trang đích hấp dẫn với các mẫu thiệp nổi bật và thông tin nền tảng, để tôi có thể hiểu dịch vụ và khám phá các thiết kế có sẵn.

#### Tiêu Chí Chấp Nhận

1. NỀN_TẢNG PHẢI hiển thị trang chủ với các section theo thứ tự từ trên xuống: hero, danh mục, thư viện mẫu, trending, hướng dẫn sử dụng, testimonial và CTA
2. NỀN_TẢNG PHẢI hiển thị nội dung marketing cố định bao gồm ít nhất 3 testimonial, ít nhất 4 mẫu thiệp trong thư viện, ít nhất 3 mục trending và số liệu thống kê nền tảng
3. NỀN_TẢNG PHẢI hiển thị trang chủ theo bố cục responsive thích ứng với viewport từ 320px đến 2560px, bố cục mobile dưới 768px và bố cục desktop từ 768px trở lên
4. NỀN_TẢNG PHẢI hỗ trợ hiển thị nội dung song ngữ Tiếng Việt và Tiếng Anh, mặc định là Tiếng Việt
5. KHI Người_Dùng cuộn trang chủ, NỀN_TẢNG PHẢI hiển thị dần từng section khi chúng xuất hiện trong viewport

### Yêu Cầu 2: Duyệt Danh Mục Mẫu Thiệp

**Câu Chuyện Người Dùng:** Là Người_Dùng, tôi muốn duyệt, tìm kiếm và lọc các mẫu thiệp có sẵn, để tôi có thể tìm thiết kế phù hợp với sự kiện của mình.

#### Tiêu Chí Chấp Nhận

1. DANH_MỤC PHẢI hiển thị tất cả Mẫu_Thiệp có sẵn theo dạng lưới phân trang với ảnh xem trước, tiêu đề và giá, tối đa 12 mẫu mỗi trang
2. KHI Người_Dùng lọc theo loại sự kiện, DANH_MỤC PHẢI chỉ hiển thị các Mẫu_Thiệp được gắn tag loại sự kiện đã chọn (cưới, sinh nhật hoặc tiệc)
3. KHI Người_Dùng lọc theo màu sắc, DANH_MỤC PHẢI chỉ hiển thị các Mẫu_Thiệp khớp với tag màu sắc đã chọn
4. KHI Người_Dùng nhập từ khóa tìm kiếm ít nhất 1 ký tự, DANH_MỤC PHẢI hiển thị các Mẫu_Thiệp có tiêu đề hoặc tag chứa từ khóa đó (không phân biệt hoa thường)
5. KHI Người_Dùng áp dụng đồng thời bộ lọc loại sự kiện và màu sắc, DANH_MỤC PHẢI chỉ hiển thị các Mẫu_Thiệp thỏa mãn tất cả bộ lọc theo logic AND
6. KHI Người_Dùng kết hợp tìm kiếm với bộ lọc, DANH_MỤC PHẢI chỉ hiển thị các Mẫu_Thiệp khớp từ khóa VÀ thỏa mãn tất cả bộ lọc
7. NẾU không có Mẫu_Thiệp nào khớp với bộ lọc hoặc từ khóa, THÌ DANH_MỤC PHẢI hiển thị thông báo không có kết quả và gợi ý xóa bộ lọc

### Yêu Cầu 3: Xem Trước Mẫu Thiệp

**Câu Chuyện Người Dùng:** Là Người_Dùng, tôi muốn xem trước mẫu thiệp trước khi mua, để tôi có thể đánh giá thiết kế và bố cục.

#### Tiêu Chí Chấp Nhận

1. KHI Người_Dùng chọn một Mẫu_Thiệp từ Danh_Mục, NỀN_TẢNG PHẢI hiển thị Mẫu_Thiệp ở kích thước đầy đủ với nội dung mẫu điền sẵn cho tất cả Trường_Động (tên, ngày, địa điểm, hình ảnh)
2. NỀN_TẢNG PHẢI hiển thị giá, tag loại sự kiện và mô tả của Mẫu_Thiệp bên cạnh phần xem trước
3. KHI Người_Dùng xem trước Mẫu_Thiệp, NỀN_TẢNG PHẢI cung cấp tùy chọn thêm Mẫu_Thiệp vào Giỏ_Hàng
4. KHI Người_Dùng xem trước Mẫu_Thiệp, NỀN_TẢNG PHẢI cung cấp tùy chọn quay lại Danh_Mục
5. NẾU Mẫu_Thiệp không tải được khi xem trước, THÌ NỀN_TẢNG PHẢI hiển thị thông báo lỗi và cung cấp tùy chọn quay lại Danh_Mục

### Yêu Cầu 4: Quản Lý Giỏ Hàng Ẩn Danh

**Câu Chuyện Người Dùng:** Là Người_Dùng, tôi muốn thêm mẫu thiệp vào giỏ hàng mà không cần đăng nhập, để tôi có thể tiếp tục duyệt mà không bị gián đoạn.

#### Tiêu Chí Chấp Nhận

1. TRONG KHI Người_Dùng chưa đăng nhập, NỀN_TẢNG PHẢI lưu các mục Giỏ_Hàng vào Giỏ_Hàng_Cookie với dung lượng tối đa 50 mục
2. KHI Người_Dùng thêm Mẫu_Thiệp vào Giỏ_Hàng và Giỏ_Hàng_Cookie chưa đầy, GIỎ_HÀNG_COOKIE PHẢI lưu mã định danh và giá của Mẫu_Thiệp
3. NẾU Người_Dùng cố thêm Mẫu_Thiệp khi Giỏ_Hàng_Cookie đã đạt 50 mục, THÌ NỀN_TẢNG PHẢI hiển thị thông báo giỏ hàng đầy và gợi ý đăng nhập
4. NỀN_TẢNG PHẢI hiển thị thông báo không chặn khuyến khích Người_Dùng đăng nhập để bảo toàn Giỏ_Hàng sau khi thêm mục đầu tiên vào Giỏ_Hàng_Cookie
5. TRONG KHI Người_Dùng chưa đăng nhập, NỀN_TẢNG PHẢI cho phép Người_Dùng xem nội dung Giỏ_Hàng_Cookie và xóa từng mục riêng lẻ

### Yêu Cầu 5: Xác Thực Người Dùng

**Câu Chuyện Người Dùng:** Là Người_Dùng, tôi muốn đăng nhập bằng phương thức ưa thích, để tôi có thể mua mẫu thiệp và quản lý thiệp của mình.

#### Tiêu Chí Chấp Nhận

1. NỀN_TẢNG PHẢI hỗ trợ xác thực qua Google OAuth
2. NỀN_TẢNG PHẢI hỗ trợ xác thực qua Facebook OAuth
3. NỀN_TẢNG PHẢI hỗ trợ xác thực qua email và mật khẩu, trong đó mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất một chữ cái và một chữ số
4. NỀN_TẢNG PHẢI hỗ trợ xác thực qua số điện thoại và mật khẩu, trong đó mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất một chữ cái và một chữ số
5. KHI Người_Dùng thực hiện hành động mua hàng và chưa đăng nhập, NỀN_TẢNG PHẢI yêu cầu Người_Dùng xác thực trước khi tiến hành giao dịch
6. TRONG KHI Người_Dùng chưa đăng nhập, NỀN_TẢNG PHẢI cho phép duyệt, tìm kiếm, xem trước Mẫu_Thiệp và thêm vào giỏ hàng cookie mà không cần đăng nhập
7. NẾU xác thực thất bại do thông tin sai hoặc lỗi nhà cung cấp, THÌ NỀN_TẢNG PHẢI hiển thị thông báo lỗi nêu rõ nguyên nhân và cho phép Người_Dùng thử lại mà không mất dữ liệu đã nhập
8. KHI Người_Dùng có mục trong giỏ hàng cookie đăng nhập thành công, NỀN_TẢNG PHẢI gộp các mục giỏ hàng cookie vào giỏ hàng lâu dài, bỏ qua các mục đã tồn tại

### Yêu Cầu 6: Gộp Giỏ Hàng Khi Đăng Nhập

**Câu Chuyện Người Dùng:** Là Người_Dùng, tôi muốn các mục giỏ hàng ẩn danh được giữ lại khi đăng nhập, để tôi không mất các lựa chọn của mình.

#### Tiêu Chí Chấp Nhận

1. KHI Người_Dùng đăng nhập và Giỏ_Hàng_Cookie có ít nhất một mục, NỀN_TẢNG PHẢI thêm từng mục Giỏ_Hàng_Cookie vào Giỏ_Hàng_DB trong vòng 5 giây sau khi xác thực thành công
2. KHI một mục Giỏ_Hàng_Cookie trùng với Mẫu_Thiệp đã có trong Giỏ_Hàng_DB, NỀN_TẢNG PHẢI bỏ qua mục trùng đó khi gộp
3. NẾU tổng số mục Giỏ_Hàng_DB sau khi gộp vượt quá 50 mục, THÌ NỀN_TẢNG PHẢI gộp đến giới hạn 50 mục và hiển thị thông báo một số mục không thể thêm được
4. KHI gộp hoàn tất thành công, NỀN_TẢNG PHẢI xóa Giỏ_Hàng_Cookie
5. NẾU thao tác gộp thất bại do lỗi máy chủ hoặc cơ sở dữ liệu, THÌ NỀN_TẢNG PHẢI giữ nguyên các mục Giỏ_Hàng_Cookie và hiển thị thông báo lỗi cho biết gộp không thành công

### Yêu Cầu 7: Tùy Chỉnh Thiệp

**Câu Chuyện Người Dùng:** Là Người_Dùng, tôi muốn tùy chỉnh mẫu thiệp đã mua với thông tin cá nhân và hình ảnh, để tôi có thể tạo thiệp mời riêng.

#### Tiêu Chí Chấp Nhận

1. KHI Người_Dùng mở Trình_Chỉnh_Sửa cho Mẫu_Thiệp đã mua, TRÌNH_CHỈNH_SỬA PHẢI hiển thị tất cả Trường_Động được định nghĩa bởi Mẫu_Thiệp đó
2. TRÌNH_CHỈNH_SỬA PHẢI cho phép Người_Dùng điền các Trường_Động dạng văn bản (tên, ngày, địa điểm, lời nhắn) với tối đa 500 ký tự mỗi trường
3. TRÌNH_CHỈNH_SỬA PHẢI cho phép Người_Dùng tải lên hình ảnh định dạng JPG, PNG, WebP, GIF và HEIC với dung lượng tối đa 10 MB mỗi ảnh
4. NẾU Người_Dùng cố tải lên nhiều ảnh hơn giới hạn được cấu hình trong Mẫu_Thiệp, THÌ TRÌNH_CHỈNH_SỬA PHẢI ngăn việc tải lên và hiển thị thông báo số ảnh tối đa được phép
5. TRÌNH_CHỈNH_SỬA PHẢI cho phép Người_Dùng tự do đặt vị trí ảnh đã tải lên trong khung hiển thị
6. TRÌNH_CHỈNH_SỬA PHẢI cung cấp chức năng cắt, xoay và phóng to/thu nhỏ ảnh
7. TRÌNH_CHỈNH_SỬA PHẢI cho phép Người_Dùng chọn nhạc nền từ thư viện nhạc có sẵn và nghe thử trước khi xác nhận
8. NẾU Người_Dùng cố tải lên file không đúng định dạng hoặc vượt quá 10 MB, THÌ TRÌNH_CHỈNH_SỬA PHẢI từ chối và hiển thị thông báo các định dạng được chấp nhận và dung lượng tối đa

### Yêu Cầu 8: Xem Trước và Xuất Thiệp

**Câu Chuyện Người Dùng:** Là Người_Dùng, tôi muốn xem trước thiệp đã tùy chỉnh trước khi xuất bản, để tôi có thể kiểm tra kết quả cuối cùng.

#### Tiêu Chí Chấp Nhận

1. KHI Người_Dùng yêu cầu xem trước, TRÌNH_CHỈNH_SỬA PHẢI hiển thị Thiệp với toàn bộ nội dung đã tùy chỉnh, hình ảnh và nhạc nền đã chọn
2. KHI Người_Dùng yêu cầu xem trước, TRÌNH_CHỈNH_SỬA PHẢI hiển thị Thiệp với cùng bố cục, kiểu dáng và hành vi tương tác như Trang_Xem_Thiệp hiển thị cho Khách_Mời
3. NẾU có Trường_Động bắt buộc còn trống khi Người_Dùng yêu cầu xem trước, THÌ TRÌNH_CHỈNH_SỬA PHẢI chỉ ra các trường còn thiếu và ngăn tạo bản xem trước
4. KHI Người_Dùng đang xem bản xem trước, TRÌNH_CHỈNH_SỬA PHẢI cung cấp tùy chọn quay lại chỉnh sửa
5. KHI Người_Dùng xác nhận bản xem trước, NỀN_TẢNG PHẢI chuyển sang bước thanh toán

### Yêu Cầu 9: Xử Lý Thanh Toán

**Câu Chuyện Người Dùng:** Là Người_Dùng, tôi muốn thanh toán bằng phương thức ưa thích, để tôi có thể xuất bản và chia sẻ thiệp.

#### Tiêu Chí Chấp Nhận

1. CỔNG_THANH_TOÁN PHẢI hỗ trợ chuyển khoản ngân hàng qua mã QR
2. CỔNG_THANH_TOÁN PHẢI hỗ trợ thanh toán qua ví điện tử MoMo, ZaloPay và VNPay
3. CỔNG_THANH_TOÁN PHẢI hỗ trợ thanh toán bằng thẻ quốc tế Visa và Mastercard
4. KHI Người_Dùng tiến hành thanh toán, NỀN_TẢNG PHẢI hiển thị tổng giá dưới dạng chi tiết gồm giá Mẫu_Thiệp và giá Gói_Hosting đã chọn, và PHẢI yêu cầu Người_Dùng chọn Gói_Hosting trước khi bắt đầu thanh toán
5. KHI thanh toán được xác nhận, NỀN_TẢNG PHẢI kích hoạt Thiệp để xuất bản trong vòng 60 giây sau khi nhận xác nhận thanh toán
6. NẾU thanh toán thất bại, THÌ NỀN_TẢNG PHẢI hiển thị thông báo lỗi nêu rõ nguyên nhân và cho phép Người_Dùng thử lại tối đa 3 lần trong một phiên thanh toán
7. NẾU phiên thanh toán không hoàn tất sau 30 phút, THÌ NỀN_TẢNG PHẢI hết hạn phiên và yêu cầu Người_Dùng bắt đầu lại từ bước thanh toán
8. NẾU đã hết số lần thử lại, THÌ NỀN_TẢNG PHẢI giữ nguyên Giỏ_Hàng và lựa chọn Gói_Hosting của Người_Dùng và cho phép bắt đầu phiên thanh toán mới

### Yêu Cầu 10: Gói Hosting và Vòng Đời Thiệp

**Câu Chuyện Người Dùng:** Là Người_Dùng, tôi muốn chọn thời gian thiệp tồn tại trực tuyến, để tôi có thể quản lý chi phí theo lịch trình sự kiện.

#### Tiêu Chí Chấp Nhận

1. NỀN_TẢNG PHẢI cung cấp ít nhất 2 Gói_Hosting theo thời gian với thời hạn khác nhau có thể chọn trong luồng mua hàng
2. KHI Gói_Hosting còn 7 ngày hết hạn, NỀN_TẢNG PHẢI thông báo cho Người_Dùng qua bảng quản lý thiệp và nhắc gia hạn
3. KHI Gói_Hosting hết hạn mà không gia hạn, NỀN_TẢNG PHẢI làm Thiệp không truy cập được với Khách_Mời bằng cách hiển thị thông báo thiệp không còn khả dụng
4. NẾU Gói_Hosting đã hết hạn, THÌ NỀN_TẢNG PHẢI giữ nguyên dữ liệu Thiệp và cho phép Người_Dùng gia hạn hosting theo tháng để khôi phục quyền truy cập cho Khách_Mời
5. NỀN_TẢNG PHẢI hiển thị thời gian hosting còn lại tính bằng ngày trong bảng quản lý thiệp cho từng Thiệp đang hoạt động
6. TRONG KHI Gói_Hosting của Thiệp còn hiệu lực hoặc trong thời gian gia hạn, NỀN_TẢNG PHẢI cho phép Người_Dùng gia hạn thêm bằng cách mua thêm tháng

### Yêu Cầu 11: Xuất Bản Thiệp và Cấu Trúc URL

**Câu Chuyện Người Dùng:** Là Người_Dùng, tôi muốn thiệp đã xuất bản có URL rõ ràng và dễ chia sẻ, để tôi có thể phân phối dễ dàng cho khách mời.

#### Tiêu Chí Chấp Nhận

1. KHI Thiệp được xuất bản, NỀN_TẢNG PHẢI tạo URL theo mẫu: `lovecards.vn/thiep/{ten-su-kien}/{id-nguoi-so-huu}/{id-link-khach-moi}`, trong đó `ten-su-kien` là slug URL-safe tối đa 60 ký tự chỉ gồm chữ thường, chữ số và dấu gạch ngang, và `id-link-khach-moi` là mã định danh duy nhất từ 8 đến 12 ký tự chữ và số
2. NỀN_TẢNG PHẢI cho phép bất kỳ ai có URL truy cập Thiệp đã xuất bản mà không cần xác thực
3. NẾU Khách_Mời truy cập URL Thiệp không tồn tại hoặc Thiệp có Gói_Hosting đã hết hạn, THÌ NỀN_TẢNG PHẢI hiển thị trang thông báo Thiệp không khả dụng
4. TRANG_XEM_THIỆP PHẢI hiển thị Thiệp với toàn bộ nội dung, hình ảnh và nhạc đã tùy chỉnh trong vòng 5 giây trên kết nối 4G tiêu chuẩn
5. NẾU ảnh hoặc file nhạc không tải được trong Trang_Xem_Thiệp, THÌ TRANG_XEM_THIỆP PHẢI hiển thị phần còn lại của Thiệp và hiển thị placeholder cho tài nguyên bị lỗi

### Yêu Cầu 12: Chia Sẻ Thiệp

**Câu Chuyện Người Dùng:** Là Người_Dùng, tôi muốn chia sẻ thiệp đã xuất bản qua nhiều kênh, để tôi có thể tiếp cận tất cả khách mời.

#### Tiêu Chí Chấp Nhận

1. NỀN_TẢNG PHẢI cung cấp link URL có thể chia sẻ cho mỗi Thiệp đã xuất bản kèm chức năng sao chép vào clipboard
2. NỀN_TẢNG PHẢI tạo mã QR liên kết đến Thiệp đã xuất bản, hiển thị ở độ phân giải tối thiểu 200×200 pixel, và cho phép Người_Dùng tải mã QR về dưới dạng file ảnh
3. NỀN_TẢNG PHẢI hỗ trợ chia sẻ link Thiệp qua Zalo, Messenger và SMS bằng cách mở cơ chế chia sẻ của ứng dụng tương ứng với URL Thiệp được điền sẵn
4. NỀN_TẢNG PHẢI cung cấp các tùy chọn chia sẻ (sao chép URL, mã QR, Zalo, Messenger, SMS) từ bảng quản lý thiệp
5. NỀN_TẢNG PHẢI phục vụ metadata Xem_Trước_Mạng_Xã_Hội trên mỗi URL Thiệp đã xuất bản, bao gồm ảnh (tối thiểu 1200×630 pixel), tiêu đề (tối đa 60 ký tự) và mô tả (tối đa 155 ký tự)
6. NỀN_TẢNG PHẢI cho phép Người_Dùng tùy chỉnh ảnh và tiêu đề Xem_Trước_Mạng_Xã_Hội từ Trình_Chỉnh_Sửa
7. NẾU Người_Dùng chưa tùy chỉnh Xem_Trước_Mạng_Xã_Hội, THÌ NỀN_TẢNG PHẢI tự động tạo metadata mặc định dùng tên sự kiện làm tiêu đề và ảnh chính của Thiệp làm ảnh xem trước

### Yêu Cầu 13: Tính Năng RSVP

**Câu Chuyện Người Dùng:** Là Người_Dùng, tôi muốn khách mời xác nhận tham dự qua thiệp của tôi, để tôi có thể lên kế hoạch sự kiện chính xác.

#### Tiêu Chí Chấp Nhận

1. TRANG_XEM_THIỆP PHẢI hiển thị form RSVP để Khách_Mời xác nhận tham dự
2. Form RSVP PHẢI thu thập tên Khách_Mời (từ 1 đến 100 ký tự), trạng thái tham dự (xác nhận hoặc từ chối) và số người đi cùng (từ 0 đến 20)
3. KHI Khách_Mời gửi RSVP, NỀN_TẢNG PHẢI lưu phản hồi và hiển thị trong bảng quản lý thiệp của chủ Thiệp
4. NẾU Khách_Mời gửi RSVP với tên trùng với phản hồi đã có cho Thiệp đó, THÌ NỀN_TẢNG PHẢI cập nhật phản hồi RSVP hiện có bằng lần gửi mới
5. NỀN_TẢNG PHẢI hiển thị dữ liệu RSVP tổng hợp (tổng xác nhận, tổng từ chối, tổng khách bao gồm người đi cùng) trong bảng quản lý thiệp
6. NẾU gửi RSVP thất bại, THÌ NỀN_TẢNG PHẢI hiển thị thông báo lỗi và giữ nguyên dữ liệu form Khách_Mời đã nhập

### Yêu Cầu 14: Lời Chúc Của Khách Mời

**Câu Chuyện Người Dùng:** Là Người_Dùng, tôi muốn khách mời để lại lời chúc mừng trên thiệp, để tôi có thể thu thập và hiển thị những lời chúc.

#### Tiêu Chí Chấp Nhận

1. TRANG_XEM_THIỆP PHẢI hiển thị form gửi lời chúc thu thập tên Khách_Mời (tối đa 100 ký tự) và nội dung lời chúc (tối đa 500 ký tự)
2. KHI Khách_Mời gửi lời chúc hợp lệ, BẢNG_LỜI_CHÚC PHẢI hiển thị lời chúc đó trên Trang_Xem_Thiệp
3. NẾU Khách_Mời gửi lời chúc với tên hoặc nội dung trống, THÌ TRANG_XEM_THIỆP PHẢI hiển thị lỗi xác thực chỉ rõ trường còn thiếu và KHÔNG gửi lời chúc
4. NỀN_TẢNG PHẢI hiển thị tất cả lời chúc đã gửi cho chủ Thiệp trong bảng quản lý thiệp
5. BẢNG_LỜI_CHÚC PHẢI hiển thị lời chúc theo thứ tự thời gian ngược (mới nhất trước)
6. NẾU gửi lời chúc thất bại do lỗi hệ thống, THÌ TRANG_XEM_THIỆP PHẢI hiển thị thông báo lỗi và GIỮ NGUYÊN nội dung đã nhập trong form

### Yêu Cầu 15: Hiển Thị Tài Khoản Ngân Hàng Nhận Mừng Cưới

**Câu Chuyện Người Dùng:** Là Người_Dùng tạo thiệp cưới, tôi muốn tùy chọn hiển thị thông tin tài khoản ngân hàng, để khách mời có thể gửi tiền mừng.

#### Tiêu Chí Chấp Nhận

1. TRÌNH_CHỈNH_SỬA PHẢI cung cấp nút bật/tắt để Người_Dùng bật hoặc tắt hiển thị tài khoản ngân hàng trên Thiệp
2. TRÌNH_CHỈNH_SỬA PHẢI cho phép Người_Dùng cấu hình tối đa 2 tài khoản ngân hàng, mỗi tài khoản gồm tên ngân hàng, số tài khoản và tên chủ tài khoản
3. TRONG KHI nút tài khoản ngân hàng được bật, TRANG_XEM_THIỆP PHẢI hiển thị tất cả thông tin tài khoản đã cấu hình (tên ngân hàng, số tài khoản và tên chủ tài khoản) cho Khách_Mời
4. TRONG KHI nút tài khoản ngân hàng bị tắt, TRANG_XEM_THIỆP PHẢI ẩn thông tin tài khoản ngân hàng khỏi Khách_Mời
5. NẾU Người_Dùng bật nút tài khoản ngân hàng mà chưa cấu hình ít nhất một tài khoản đầy đủ, THÌ TRÌNH_CHỈNH_SỬA PHẢI hiển thị thông báo xác thực yêu cầu điền tên ngân hàng, số tài khoản và tên chủ tài khoản
6. TRÌNH_CHỈNH_SỬA PHẢI giới hạn tối đa 50 ký tự cho tên ngân hàng, 20 ký tự cho số tài khoản và 100 ký tự cho tên chủ tài khoản

### Yêu Cầu 16: Phân Tích Thiệp

**Câu Chuyện Người Dùng:** Là Người_Dùng, tôi muốn xem có bao nhiêu người đã xem thiệp và từ đâu, để tôi có thể theo dõi mức độ tương tác.

#### Tiêu Chí Chấp Nhận

1. NỀN_TẢNG PHẢI theo dõi tổng số lần tải trang (tổng lượt xem) và số lượng khách truy cập duy nhất (lượt xem duy nhất, loại trùng theo địa chỉ IP trong cửa sổ 24 giờ) cho mỗi Thiệp đã xuất bản
2. NỀN_TẢNG PHẢI theo dõi loại thiết bị (di động, máy tính, máy tính bảng) của mỗi lượt xem Thiệp
3. NỀN_TẢNG PHẢI phân loại nguồn truy cập của mỗi lượt xem Thiệp vào một trong các danh mục: link trực tiếp, mạng xã hội (Facebook, Zalo, Instagram), ứng dụng nhắn tin (Messenger, Zalo Chat, link SMS) hoặc "khác" cho các nguồn không xác định
4. NỀN_TẢNG PHẢI hiển thị dữ liệu phân tích (tổng lượt xem, lượt xem duy nhất, phân tích loại thiết bị và phân tích nguồn truy cập) trong bảng quản lý thiệp với khoảng thời gian có thể chọn (hôm nay, 7 ngày qua, 30 ngày qua hoặc tất cả)
5. KHI ghi nhận lượt xem Thiệp mới, NỀN_TẢNG PHẢI cập nhật dữ liệu phân tích trong bảng quản lý trong vòng 5 phút

### Yêu Cầu 17: Form CTA

**Câu Chuyện Người Dùng:** Là khách truy cập, tôi muốn đăng ký nhận thông tin hoặc hỏi về dịch vụ B2B, để tôi có thể cập nhật tin tức hoặc khám phá hợp tác kinh doanh.

#### Tiêu Chí Chấp Nhận

1. NỀN_TẢNG PHẢI hiển thị form đăng ký email newsletter/waitlist trên section CTA trang chủ với trường nhập email (tối đa 254 ký tự) và nút gửi
2. NỀN_TẢNG PHẢI hiển thị form liên hệ B2B cho yêu cầu hợp tác kinh doanh với các trường bắt buộc: tên công ty (tối đa 100 ký tự), email liên hệ (tối đa 254 ký tự) và nội dung (tối đa 1000 ký tự)
3. KHI khách truy cập gửi form CTA với thông tin hợp lệ, NỀN_TẢNG PHẢI lưu thông tin gửi và hiển thị thông báo thành công ngay trong khu vực form
4. NẾU khách truy cập gửi form CTA với địa chỉ email không hợp lệ hoặc để trống, THÌ NỀN_TẢNG PHẢI hiển thị thông báo lỗi xác thực và KHÔNG lưu thông tin gửi

### Yêu Cầu 18: Tuân Thủ Pháp Lý

**Câu Chuyện Người Dùng:** Là người vận hành nền tảng, tôi muốn tuân thủ các yêu cầu pháp lý, để nền tảng hoạt động trong khuôn khổ quy định.

#### Tiêu Chí Chấp Nhận

1. KHI Người_Dùng truy cập Nền_Tảng lần đầu và chưa có lựa chọn đồng ý cookie, NỀN_TẢNG PHẢI hiển thị banner đồng ý cookie với các tùy chọn: chấp nhận tất cả, từ chối cookie không cần thiết hoặc tùy chỉnh tùy chọn cookie
2. NỀN_TẢNG PHẢI cung cấp trang Điều Khoản Sử Dụng có thể truy cập qua link cố định ở footer trên mọi trang
3. NỀN_TẢNG PHẢI cung cấp trang Chính Sách Bảo Mật có thể truy cập qua link cố định ở footer trên mọi trang
4. NẾU Người_Dùng chưa chấp nhận cookie không cần thiết, THÌ NỀN_TẢNG PHẢI không lưu cookie phân tích, quảng cáo hoặc theo dõi bên thứ ba trên trình duyệt Người_Dùng
5. KHI Người_Dùng thực hiện lựa chọn đồng ý cookie, NỀN_TẢNG PHẢI lưu lựa chọn đó ít nhất 6 tháng trước khi hỏi lại
6. NỀN_TẢNG PHẢI cung cấp cơ chế có thể truy cập từ mọi trang để Người_Dùng thay đổi tùy chọn đồng ý cookie sau lựa chọn ban đầu

### Yêu Cầu 19: Hỗ Trợ Song Ngữ

**Câu Chuyện Người Dùng:** Là Người_Dùng, tôi muốn sử dụng nền tảng bằng Tiếng Việt hoặc Tiếng Anh, để tôi có thể tương tác bằng ngôn ngữ ưa thích.

#### Tiêu Chí Chấp Nhận

1. NỀN_TẢNG PHẢI mặc định Tiếng Việt cho tất cả các thành phần giao diện
2. NỀN_TẢNG PHẢI cung cấp nút chuyển ngôn ngữ có thể truy cập từ thanh điều hướng header để chuyển đổi giữa Tiếng Việt và Tiếng Anh
3. KHI Người_Dùng chuyển ngôn ngữ, NỀN_TẢNG PHẢI hiển thị tất cả nhãn giao diện, điều hướng và thông báo hệ thống bằng ngôn ngữ đã chọn mà không cần tải lại trang
4. NỀN_TẢNG PHẢI lưu tùy chọn ngôn ngữ của Người_Dùng qua các phiên bằng local storage hoặc cài đặt tài khoản

### Yêu Cầu 20: Thiết Kế Web Responsive

**Câu Chuyện Người Dùng:** Là Người_Dùng, tôi muốn truy cập nền tảng từ bất kỳ thiết bị nào, để tôi có thể duyệt và quản lý thiệp trên di động hoặc máy tính.

#### Tiêu Chí Chấp Nhận

1. NỀN_TẢNG PHẢI hiển thị tất cả trang theo bố cục responsive thích ứng với chiều rộng màn hình từ 320px đến 2560px với ít nhất ba breakpoint (di động: 320px–767px, máy tính bảng: 768px–1023px, máy tính: 1024px–2560px) và không xuất hiện thanh cuộn ngang ở bất kỳ chiều rộng nào được hỗ trợ
2. TRANG_XEM_THIỆP PHẢI hiển thị Thiệp đã xuất bản theo bố cục một cột trên viewport dưới 768px, với tất cả thành phần tương tác (form RSVP, Bảng_Lời_Chúc, điều khiển nhạc) có kích thước vùng chạm tối thiểu 44×44px
3. TRÌNH_CHỈNH_SỬA PHẢI hiển thị tất cả Trường_Động, điều khiển tải ảnh và nút hành động mà không cần cuộn ngang trên viewport từ 320px trở lên, với tất cả điều khiển tương tác có kích thước vùng chạm tối thiểu 44×44px
4. KHI chiều rộng viewport thay đổi (do xoay thiết bị hoặc thay đổi kích thước trình duyệt), NỀN_TẢNG PHẢI điều chỉnh lại nội dung phù hợp với chiều rộng mới trong vòng 1 giây mà không cần tải lại trang

### Yêu Cầu 21: Quản Lý Mẫu Thiệp (Admin)

**Câu Chuyện Người Dùng:** Là Admin, tôi muốn tải lên và quản lý mẫu thiệp, để Người_Dùng có bộ sưu tập thiết kế được tuyển chọn.

#### Tiêu Chí Chấp Nhận

1. TRANG_QUẢN_TRỊ PHẢI cho phép tải lên Mẫu_Thiệp gồm một file HTML và các file tài nguyên đi kèm (ảnh, font, CSS) với tổng dung lượng tối đa 50 MB mỗi Mẫu_Thiệp
2. TRANG_QUẢN_TRỊ PHẢI cho phép cấu hình Trường_Động cho mỗi Mẫu_Thiệp bằng cách chỉ định nhãn trường, loại trường (văn bản, ngày, ảnh hoặc lựa chọn), thứ tự hiển thị và trường bắt buộc hay tùy chọn
3. TRANG_QUẢN_TRỊ PHẢI cho phép đặt giá cho mỗi Mẫu_Thiệp là giá trị số bằng VNĐ trong khoảng từ 10.000 đến 99.999.999
4. TRANG_QUẢN_TRỊ PHẢI cho phép gán một hoặc nhiều tag loại sự kiện (cưới, sinh nhật hoặc tiệc) và một hoặc nhiều tag màu sắc cho mỗi Mẫu_Thiệp
5. TRANG_QUẢN_TRỊ PHẢI cho phép bật hoặc tắt Mẫu_Thiệp khỏi Danh_Mục công khai
6. KHI Mẫu_Thiệp bị tắt, DANH_MỤC PHẢI ngừng hiển thị Mẫu_Thiệp đó với Người_Dùng, trong khi Người_Dùng đã mua Mẫu_Thiệp vẫn giữ quyền truy cập vào Thiệp hiện có
7. NẾU tải lên Mẫu_Thiệp thất bại do thiếu file HTML hoặc vượt quá giới hạn dung lượng, THÌ TRANG_QUẢN_TRỊ PHẢI hiển thị thông báo lỗi nêu rõ nguyên nhân và hủy bỏ việc tải lên
8. TRANG_QUẢN_TRỊ PHẢI yêu cầu ít nhất một Trường_Động, một tag loại sự kiện và một mức giá được cấu hình trước khi Mẫu_Thiệp có thể được bật trong Danh_Mục

### Yêu Cầu 22: Quản Lý Đơn Hàng và Doanh Thu (Admin)

**Câu Chuyện Người Dùng:** Là Admin, tôi muốn xem đơn hàng và thống kê doanh thu, để tôi có thể theo dõi hiệu quả kinh doanh.

#### Tiêu Chí Chấp Nhận

1. TRANG_QUẢN_TRỊ PHẢI hiển thị danh sách phân trang tất cả đơn hàng gồm: mã đơn hàng, trạng thái đơn hàng (chờ xử lý, đã thanh toán, thất bại, hoàn tiền), tên Người_Dùng, email Người_Dùng, tên Mẫu_Thiệp, phương thức thanh toán, số tiền đã thanh toán và ngày tạo đơn hàng
2. TRANG_QUẢN_TRỊ PHẢI cho phép lọc danh sách đơn hàng theo trạng thái đơn hàng và theo khoảng thời gian
3. TRANG_QUẢN_TRỊ PHẢI hiển thị thống kê doanh thu bao gồm tổng doanh thu, doanh thu theo kỳ có thể chọn (ngày, tuần, tháng) và doanh thu phân tích theo Mẫu_Thiệp
4. TRANG_QUẢN_TRỊ PHẢI hiển thị các chỉ số KPI: số Thiệp đã xuất bản, doanh thu tháng, MAU (số Người_Dùng duy nhất đã đăng nhập trong tháng hiện tại) và tỉ lệ chuyển đổi (phần trăm Người_Dùng đã hoàn thành ít nhất một giao dịch mua trên tổng số Người_Dùng đã đăng ký)
5. NẾU không có đơn hàng nào khớp với tiêu chí lọc đã chọn, THÌ TRANG_QUẢN_TRỊ PHẢI hiển thị thông báo trạng thái trống cho biết không tìm thấy đơn hàng phù hợp

### Yêu Cầu 23: Quản Lý Người Dùng (Admin)

**Câu Chuyện Người Dùng:** Là Admin, tôi muốn quản lý tài khoản người dùng, để tôi có thể hỗ trợ người dùng và duy trì tính toàn vẹn của nền tảng.

#### Tiêu Chí Chấp Nhận

1. TRANG_QUẢN_TRỊ PHẢI hiển thị danh sách phân trang tất cả Người_Dùng đã đăng ký gồm tên, email hoặc số điện thoại, phương thức xác thực, ngày đăng ký và trạng thái tài khoản
2. TRANG_QUẢN_TRỊ PHẢI cung cấp tìm kiếm theo tên hoặc email và lọc theo trạng thái tài khoản để tìm Người_Dùng cụ thể
3. KHI Admin chọn một Người_Dùng, TRANG_QUẢN_TRỊ PHẢI hiển thị lịch sử mua hàng của Người_Dùng đó (ngày đặt hàng, tên Mẫu_Thiệp, giá, trạng thái thanh toán) và các Thiệp có Gói_Hosting chưa hết hạn
4. TRANG_QUẢN_TRỊ PHẢI cho phép Admin tạm khóa hoặc kích hoạt lại tài khoản Người_Dùng
5. NẾU tài khoản Người_Dùng bị tạm khóa, THÌ NỀN_TẢNG PHẢI ngăn Người_Dùng đó mua Mẫu_Thiệp hoặc xuất bản Thiệp mới
6. KHI tính năng quản lý vai trò Cộng_Tác_Viên được bật, TRANG_QUẢN_TRỊ PHẢI cho phép gán hoặc thu hồi vai trò Cộng_Tác_Viên cho Người_Dùng để quản lý việc gửi mẫu thiệp
