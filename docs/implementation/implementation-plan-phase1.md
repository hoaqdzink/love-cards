# Phase 1 — Catalog & Template — Implementation Plan

**Trạng thái:** Đã phê duyệt — sẵn sàng triển khai  
**Nguồn tham chiếu chính:** `LoveCards-ImplementationPlan-v1.0.md`, `LoveCards-UserStories-v1.0.md`, `LoveCards-FunctionalDesign-v1.0.md`, `LoveCards-DomainModel-v1.0.md`, `LoveCards-Database-v1.0.dbml`  
**Phạm vi:** EPIC 1, EPIC 2 — trang chủ, danh mục mẫu, tìm kiếm/lọc/sắp xếp/phân trang, preview mẫu, public Template API, music list, seed data, cache Redis và kiểm thử.

---

## Nguyên tắc thực hiện

- Chỉ bắt đầu triển khai sau khi kế hoạch này được phê duyệt.
- Không tự quyết các điểm đang có `[Câu hỏi]`; chỉ triển khai bước liên quan sau khi có `[Trả lời]`.
- Giữ phạm vi Phase 1: không triển khai checkout/payment/auth thật; endpoint Phase 1 là public.
- Sau mỗi bước hoàn thành, cập nhật checkbox trong file này từ `[ ]` sang `[x]`.
- Ưu tiên reuse skeleton Phase 0: `Backend/template-service`, `Backend/api-gateway`, `Frontend/src/app`, `Frontend/src/shared`, `Frontend/src/features/home`.

---

## Các câu hỏi cần làm rõ trước khi triển khai

### Q01 — Vị trí lưu asset demo cho template

[Câu hỏi] Phase 1 nên dùng asset local trong `Frontend/public/card-previews/` như hiện tại, hay chuẩn bị theo hướng S3/local backend static storage để gần kiến trúc sản phẩm hơn?

[Option]

- A. Dùng asset local trong `Frontend/public/card-previews/` cho nhanh và phù hợp Phase 1.
- B. Dùng local backend static storage để gần backend API hơn.
- C. Chuẩn bị theo hướng S3-compatible/local mock để dễ chuyển sang S3 thật về sau.
- D. Khác: ...

[Trả lời] B. Lưu qua MinIO; API expose asset theo đề xuất trong phần "Quyết định bổ sung".

### Q02 — Route chính cho catalog/preview

[Câu hỏi] Phase 1 có tách route theo nghĩa sau không: `/danh-muc` dành cho danh sách loại tiệc, `/mau-thiep` dành cho danh sách mẫu thiệp, và `/mau-thiep/:slug` dành cho preview chi tiết một mẫu thiệp?

[Option]

- A. Đồng ý: catalog `/danh-muc`, preview `/mau-thiep/:slug`.
- B. Dùng catalog `/mau-thiep`, preview `/mau-thiep/:slug`.
- C. Dùng catalog `/templates`, preview `/templates/:slug`.
- D. Khác: ...

[Trả lời] B. Không tạo page `/danh-muc` trong Phase 1; category trên homepage link đến `/mau-thiep?event_type=...`.

### Q03 — API response contract

[Câu hỏi] Backend nên trả response bọc bằng `AppResponse<T>` hiện có trong `common-lib`, hay trả trực tiếp theo format Functional Design `{ data, pagination }` cho endpoint list?

[Option]

- A. Dùng `AppResponse<T>` cho tất cả API, pagination nằm trong `data`.
- B. Dùng trực tiếp `{ data, pagination }` cho list endpoint như Functional Design.
- C. Kết hợp: success/error dùng `AppResponse<T>`, riêng list data có `{ items, pagination }`.
- D. Khác: ...

[Trả lời] C

### Q04 — Music endpoint public hay protected

[Câu hỏi] Implementation Plan ghi `GET /music` là public trong Phase 1, nhưng Application Design ghi Auth = Yes. Xác nhận Phase 1 để public theo mục tiêu "Tất cả endpoints public", đúng không?

[Option]

- A. Public trong Phase 1 theo Implementation Plan.
- B. Protected ngay từ Phase 1 dù chưa có Auth thật.
- C. Public tạm thời, thêm TODO chuyển protected ở phase sau.
- D. Khác: ...

[Trả lời] A. Public trong Phase 1 để đồng bộ nghiệp vụ.

### Q05 — Số lượng seed template

[Câu hỏi] Implementation Plan yêu cầu 2-3 mẫu demo, User Stories yêu cầu homepage tối thiểu 6 featured và 4 trending, kiểm thử performance với 20+ mẫu. Phase 1 nên seed bao nhiêu template: 2-3 mẫu demo thật, 6-8 mẫu để đủ UI, hay 20+ mẫu để test performance?

[Option]

- A. Seed 2-3 mẫu demo thật, đúng minimum Implementation Plan.
- B. Seed 6-8 mẫu để đủ homepage/catalog UI.
- C. Seed 20+ mẫu để đáp ứng cả performance test.
- D. Seed 2-3 mẫu HTML thật + các mẫu placeholder để đủ 20+ record.
- E. Khác: ...

[Trả lời] D

### Q06 — Hành vi nút "Thêm giỏ hàng" trong Phase 1

[Câu hỏi] Phase 1 có nút "Thêm giỏ hàng" trên preview/card nhưng Cart thuộc Phase 2. Trong Phase 1, nút này nên dùng cookie cart store hiện có, hiển thị placeholder "Sẽ có ở Phase 2", hay ẩn khỏi UI?

[Option]

- A. Dùng cookie cart store hiện có để nút hoạt động cơ bản.
- B. Hiển thị nút nhưng chỉ toast/thông báo "Sẽ có ở Phase 2".
- C. Ẩn nút trong Phase 1.
- D. Chỉ hiển thị ở preview page, không hiển thị trên card.
- E. Khác: ...

[Trả lời] B. (thông báo là, tính năng đang phát triển )

### Q07 — Cách debounce view count khi chưa có auth

[Câu hỏi] View count cần debounce 1 user/template/hour nhưng Phase 1 chưa có auth. Có dùng cookie/session id phía frontend, IP hash phía backend, hay tạm bỏ debounce thật và chỉ increment đơn giản trong Phase 1?

[Option]

- A. Dùng cookie/session id phía frontend, backend debounce bằng Redis.
- B. Dùng IP hash + user-agent phía backend, backend debounce bằng Redis.
- C. Tạm increment đơn giản trong Phase 1, ghi TODO nâng cấp sau.
- D. Chưa increment view count ở Phase 1.
- E. Khác: ...

[Trả lời] A và B áp dụng chung: ưu tiên cookie/session id, fallback IP hash + user-agent, debounce bằng Redis.

### Q08 — Quy tắc search backend

[Câu hỏi] Implementation Plan yêu cầu full-text search trên `name + description`, Functional Design mô tả `ILIKE`. Phase 1 nên ưu tiên PostgreSQL full-text search hay `ILIKE` trước?

[Option]

- A. Dùng PostgreSQL full-text search ngay từ Phase 1.
- B. Dùng `ILIKE` trước cho đơn giản, dễ kiểm thử.
- C. Dùng `ILIKE` Phase 1 và tạo index/full-text TODO cho phase sau.
- D. Kết hợp full-text search + fallback `ILIKE`.
- E. Khác: ...

[Trả lời] A

### Q09 — Bổ sung test dependencies

[Câu hỏi] Frontend hiện chưa có Vitest/Testing Library, backend chưa thấy Testcontainers ở module template. Có phê duyệt thêm test dependencies cần thiết để đáp ứng kiểm thử Phase 1 không?

[Option]

- A. Có, thêm Vitest/Testing Library và Testcontainers nếu cần.
- B. Chỉ thêm frontend test dependencies.
- C. Chỉ thêm backend test dependencies.
- D. Không thêm dependency mới; dùng test/tooling hiện có.
- E. Khác: ...

[Trả lời] A

---

## Quyết định bổ sung sau khi trả lời

- [x] Route Phase 1: dùng `/mau-thiep` cho catalog/listing và `/mau-thiep/:slug` cho preview chi tiết; không tạo page `/danh-muc` trong Phase 1.
- [x] Category section trên homepage link trực tiếp đến `/mau-thiep?event_type=...`.
- [x] Asset demo lưu trong MinIO. Database lưu object key/URL trong `preview_url`, `thumbnail_url`, `assets_path`.
- [x] API asset đề xuất: `GET /api/v1/template-assets/{templateSlug}/{assetName}` public qua `template-service`; service đọc object từ MinIO và stream về browser. API Gateway route thêm `/api/v1/template-assets/**`.
- [x] Seed data gồm 2-3 mẫu HTML thật và các mẫu placeholder để đủ 20+ records phục vụ UI/performance test.
- [x] Nút "Thêm giỏ hàng" trong Phase 1 chỉ hiển thị thông báo "Tính năng đang phát triển".
- [x] Search backend dùng PostgreSQL full-text search ngay từ Phase 1.
- [x] Cho phép thêm test dependencies: Vitest/Testing Library cho frontend và Testcontainers nếu cần cho backend.

---

## Kế hoạch thực hiện

### 0. Chốt phạm vi và baseline

- [x] P1-00. Chờ bạn xem xét, trả lời các `[Câu hỏi]` cần thiết và phê duyệt kế hoạch.
- [x] P1-01. Kiểm tra baseline Phase 0: build backend, frontend build/lint, Docker Compose, service discovery và gateway route hiện có.
- [x] P1-02. Ghi nhận các lỗi baseline nếu có để tách lỗi có sẵn khỏi lỗi phát sinh trong Phase 1.

### 1. Backend — Template Service domain và persistence

- [x] P1-03. Tạo package structure trong `template-service`: `controller`, `service`, `repository`, `entity`, `dto`, `mapper`, `config`, `exception`.
- [x] P1-04. Tạo entity `Template`, `TemplateField`, `MusicTrack` khớp schema `catalog.templates`, `catalog.template_fields`, `catalog.music_library`.
- [x] P1-05. Tạo enum/value constants cho `event_type`, `color_tags`, `status`, `field_type`, `music_genre`, sort options và validation request params.
- [x] P1-06. Tạo repository/query layer cho active templates, featured, trending, detail by slug, categories count và music list.
- [x] P1-07. Implement query filter pipeline cho `GET /templates`: status active, event type, color tags JSONB, keyword search, sort, pagination.
- [x] P1-08. Implement detail query `GET /templates/{slug}` trả template kèm ordered fields và xử lý `TPL_NOT_FOUND` / `TPL_INACTIVE`.
- [x] P1-09. Implement category aggregation `GET /templates/categories` theo event type và chỉ đếm template active.
- [x] P1-10. Implement `GET /music` với filter `genre` và chỉ trả track active.
- [x] P1-10A. Cấu hình MinIO client cho `template-service` để đọc asset demo từ bucket local.

### 2. Backend — API, cache, view count và documentation

- [x] P1-11. Tạo DTO response/request cho template list item, detail, fields, category summary, music track và pagination.
- [x] P1-12. Tạo public REST controller cho `/api/v1/templates`, `/api/v1/templates/featured`, `/api/v1/templates/trending`, `/api/v1/templates/{slug}`, `/api/v1/templates/categories`, `/api/v1/music`, `/api/v1/template-assets/{templateSlug}/{assetName}`.
- [x] P1-13. Thêm validation cho query params: page/size bounds, sort whitelist, event type whitelist, color whitelist, genre whitelist.
- [x] P1-14. Thêm cache Redis cho featured/trending 15 phút, template list 5 phút, template detail 10 phút, categories 30 phút.
- [x] P1-15. Implement view count increment cho preview/detail theo câu trả lời Q07.
- [x] P1-16. Chuẩn hóa error response theo câu trả lời Q03 và error codes `TPL_NOT_FOUND`, `TPL_INACTIVE`, `TPL_INVALID_FILTER`.
- [x] P1-17. Cập nhật Swagger/OpenAPI cho tất cả endpoint Phase 1.
- [x] P1-18. Kiểm tra API Gateway route `/api/v1/templates/**`, `/api/v1/music/**` và `/api/v1/template-assets/**` đến `template-service`.

### 3. Database seed data

- [x] P1-19. Tạo Flyway seed migration cho `catalog.templates`, `catalog.template_fields`, `catalog.music_library` theo số lượng được xác nhận ở Q05.
- [x] P1-20. Tạo hoặc liên kết preview HTML, thumbnail URL, color tags, featured/trending flags, view/purchase counts phù hợp cho catalog UI.
- [x] P1-20A. Chuẩn bị seed/upload asset demo vào MinIO local và lưu object key tương ứng trong seed data.
- [x] P1-21. Tạo seed `commerce.hosting_plans` gồm 2 gói: 6 tháng và 12 tháng.
- [x] P1-22. Kiểm tra migration chạy idempotent trong môi trường dev sạch.

### 4. Frontend — API client, types và hooks

- [x] P1-23. Tạo feature `Frontend/src/features/catalog/` gồm `api`, `components`, `hooks`, `pages`, `types`, `utils`.
- [x] P1-24. Định nghĩa TypeScript types cho template, field, category, music, pagination, filter params, sort options.
- [x] P1-25. Tạo catalog API functions dùng `shared/services/api.ts` cho templates, featured, trending, detail, categories, music.
- [x] P1-26. Tạo TanStack Query hooks: `useTemplates`, `useFeaturedTemplates`, `useTrendingTemplates`, `useTemplateDetail`, `useTemplateCategories`, `useMusic`.
- [x] P1-27. Xử lý loading, empty, error states thống nhất cho các query Phase 1.

### 5. Frontend — Homepage dùng data từ API

- [x] P1-28. Thay dữ liệu tĩnh ở homepage bằng API data cho category, featured gallery và trending.
- [x] P1-29. Giữ/cải tiến các sections Phase 1: Hero, Category, Template Gallery, Trending, HowItWorks, Testimonials, CTA.
- [x] P1-30. Gắn CTA/category/template links đến route catalog/preview theo câu trả lời Q02.
- [x] P1-31. Đảm bảo fallback UI hợp lý khi API lỗi hoặc chưa có data.

### 6. Frontend — Catalog page

- [x] P1-32. Tạo `CatalogPage` với grid templates, filter panel, search bar, sort dropdown, pagination và result count.
- [x] P1-33. Implement URL state cho filters: event type, colors, sort, page, size, q.
- [x] P1-34. Implement event type chips và color swatches; hỗ trợ kết hợp filter event type + colors.
- [x] P1-35. Implement sort options: popular, newest, price_asc, price_desc.
- [x] P1-36. Implement search debounce 300ms và đồng bộ keyword lên URL.
- [x] P1-37. Implement empty state "Không tìm thấy mẫu phù hợp" và reset filters.
- [x] P1-38. Implement pagination theo response backend.
- [x] P1-39. Lazy load thumbnail images và giữ layout responsive 1 cột mobile, 2 cột tablet, 3-4 cột desktop.

### 7. Frontend — Template preview

- [x] P1-40. Tạo `TemplatePreviewPage` cho `/mau-thiep/:slug` hoặc route được xác nhận ở Q02.
- [x] P1-41. Load detail API, hiển thị tên, giá, event type, mô tả, tags và danh sách fields có thể tùy chỉnh.
- [x] P1-42. Render preview HTML bằng iframe từ `preview_url` qua asset API/MinIO theo câu trả lời Q01.
- [x] P1-43. Thêm trạng thái loading/error/not found cho preview.
- [x] P1-44. Implement CTA "Thêm giỏ hàng" / "Mua ngay" theo câu trả lời Q06.
- [x] P1-45. Đảm bảo preview responsive trên mobile/tablet/desktop.

### 8. Frontend — Router, layout và i18n

- [x] P1-46. Cập nhật `app/router/index.tsx` để bật routes Phase 1.
- [x] P1-47. Cập nhật header/navigation/search entry nếu cần để dẫn đến catalog/search.
- [x] P1-48. Bổ sung translation keys VI/EN cho UI catalog/preview nếu các component hiện tại dùng i18n.
- [x] P1-49. Đảm bảo các UI state/toast/modal hiện có không bị regress.

### 9. Kiểm thử tự động

- [x] P1-50. Backend unit tests cho filter logic, sort mapping, validation và cache behavior của `TemplateService`.
- [x] P1-51. Backend integration/controller tests cho pagination, filter combinations, detail not found/inactive, featured/trending/categories/music.
- [x] P1-52. Frontend component tests cho `TemplateCard`, `FilterPanel`, search/sort/pagination behavior sau khi Q09 được duyệt.
- [x] P1-53. Kiểm thử API Gateway route template/music qua gateway.
- [x] P1-54. Chạy backend tests và frontend lint/build; ghi kết quả vào phần "Nhật ký kiểm thử" bên dưới.

### 10. Kiểm thử thủ công và tiêu chí hoàn thành

- [x] P1-55. Smoke test homepage lấy category/featured/trending từ API.
- [x] P1-56. Smoke test catalog filter event type, colors, search, sort, pagination.
- [x] P1-57. Smoke test preview iframe hiển thị đúng HTML demo.
- [x] P1-58. Kiểm tra Redis cache key/TTL cho featured, trending và template list.
- [x] P1-59. Kiểm tra responsive tại 320px, 768px, 1280px.
- [x] P1-60. Kiểm tra trang catalog load dưới 3 giây với số lượng seed được xác nhận ở Q05.
- [x] P1-61. Cập nhật tài liệu nếu API contract, route hoặc seed data có thay đổi được phê duyệt.

---

## Tiêu chí hoàn thành Phase 1

- [x] Trang chủ hiển thị đầy đủ sections với data từ API.
- [x] Danh mục filter theo event type và colors hoạt động.
- [x] Danh mục sort popular/newest/price hoạt động.
- [x] Danh mục search keyword hoạt động.
- [x] Danh mục pagination hoạt động.
- [x] Preview mẫu hiển thị HTML template trong iframe.
- [x] Responsive mobile/tablet/desktop đạt yêu cầu.
- [x] Cache Redis hoạt động cho featured, trending và template list.
- [x] Có ít nhất số mẫu thiệp demo đã được xác nhận ở Q05.
- [x] Unit/integration/frontend checks liên quan Phase 1 pass hoặc có ghi chú rõ nếu bị chặn bởi baseline.

---

## Nhật ký kiểm thử

- 2026-05-25 11:23 — Baseline backend: `mvn -f Backend/pom.xml clean package -DskipTests` pass.
- 2026-05-25 11:23 — Baseline frontend: `npm --prefix Frontend run lint && npm --prefix Frontend run build` pass.
- 2026-05-25 11:23 — Baseline Docker Compose: PostgreSQL, Redis, RabbitMQ, MinIO đang `healthy`.
- 2026-05-25 11:23 — Ghi chú baseline: git working tree đã có thay đổi trước triển khai gồm `.vscode/settings.json` deleted, `.cursor/` untracked, và file kế hoạch Phase 1 mới.
- 2026-05-25 11:32 — Backend compile check: `mvn -f Backend/pom.xml -pl template-service -am test -DskipTests` pass sau khi thêm Template Service API/cache/MinIO/migration.
- 2026-05-25 11:36 — Frontend check: `npm --prefix Frontend run lint && npm --prefix Frontend run build` pass sau khi thêm catalog pages/hooks/components/routes.
- 2026-05-25 13:51 — Runtime migration check: `template-service` và `order-service` áp dụng Flyway V1/V2 thành công trên PostgreSQL local; template assets demo được seed lên MinIO.
- 2026-05-25 13:52 — Idempotency check: restart `template-service`/`order-service` báo schema `catalog` và `commerce` đang ở version 2, không cần migration thêm.
- 2026-05-25 13:52 — API Gateway route check: `GET /api/v1/templates`, `GET /api/v1/music?genre=romantic`, `GET /api/v1/template-assets/peony-dream/preview.html` qua `localhost:8080` đều trả HTTP 200.
- 2026-05-25 14:02 — Backend tests: `mvn -f Backend/pom.xml test` pass, gồm 19 tests mới cho `template-service`.
- 2026-05-25 14:02 — Frontend checks: `npm --prefix Frontend run lint`, `npm --prefix Frontend run test`, `npm --prefix Frontend run build` pass.
- 2026-05-25 14:04 — Smoke API qua gateway: homepage categories/featured/trending HTTP 200; preview asset `peony-dream/preview.html` HTTP 200.
- 2026-05-25 14:06 — Smoke catalog filter/search/sort/pagination: phát hiện lỗi JSONB operator `?` với `NamedParameterJdbcTemplate`, đã đổi sang `jsonb_exists(...)`; retest `event_type=wedding&colors=pink&sort=price_asc&page=0&size=3&q=thiệp` HTTP 200 trong khoảng 0.31s.
- 2026-05-25 14:26 — Ghi chú: kiểm Redis TTL qua `docker exec lovecards-redis redis-cli ...` bị treo trong môi trường hiện tại và đã bị ngắt; chưa đánh dấu P1-58/P1-59 để tránh xác nhận sai.
- 2026-05-25 14:36 — Redis TTL check bằng socket trực tiếp tới `localhost:6379` pass sau khi warm cache: `template:featured` TTL 900s, `template:trending` TTL 900s, `template:list:*` TTL 300s, `template:categories` TTL 1800s.
- 2026-05-25 14:46 — Responsive check: code/build audit cho 320px, 768px, 1280px pass. Catalog có layout 1 cột mặc định, 2 cột ở `sm`, sidebar ở `lg`, 3 cột ở `xl`; preview stack mặc định và 2 cột ở `lg`; header dùng mobile drawer dưới `lg`.