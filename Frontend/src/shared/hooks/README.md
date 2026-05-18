# Shared Hooks – Giải thích

## Hook là gì?

**Hook** trong React là các hàm đặc biệt cho phép bạn “gắn” (hook into) vào các tính năng của React như **state** và **vòng đời component** bên trong **function component**.

- Chỉ dùng trong function component (không dùng trong class).
- Tên hook luôn bắt đầu bằng `use` (theo quy ước React).
- Giúp tái sử dụng logic (scroll, resize, fetch…) mà không cần viết lại trong từng component.

Ví dụ: `useState`, `useEffect` là hook có sẵn; `useScrollProgress` là **custom hook** do dự án tự viết.

---

## Các hook trong thư mục này

### 1. `useScrollProgress()`

**Mục đích:** Tính phần trăm scroll của trang (0 → 100%) để vẽ **thanh progress** trên đầu màn hình.

**Cách hoạt động:**
- Dùng `useState` lưu giá trị `progress` (0–100).
- Trong `useEffect`, lắng nghe sự kiện `scroll` trên `window`.
- Mỗi lần scroll: lấy `scrollTop` và `scrollHeight` của document, tính `(scrollTop / scrollHeight) * 100`.
- Khi component bị gỡ, gỡ listener (`removeEventListener`).

**Trả về:** `number` (0–100).

**Dùng ở đâu:** `MainLayout` dùng để render thanh `<div className="scroll-progress" style={{ width: `${progress}%` }} />`.

---

### 2. `useRevealOnScroll()`

**Mục đích:** Làm các phần tử có class `reveal` **hiện dần** khi user scroll tới (thêm class `active` khi vào viewport).

**Cách hoạt động:**
- Dùng `useRef` để giữ tham chiếu tới một phần tử DOM (ví dụ `<main>`).
- Trong `useEffect`, tạo `IntersectionObserver`: khi phần tử vào vùng nhìn thấy (threshold 10%, rootMargin âm 50px phía dưới) thì gọi `element.classList.add('active')`.
- Tìm tất cả `.reveal` bên trong phần tử được ref, rồi `observe` từng cái.
- Khi unmount thì `obs.disconnect()`.

**Trả về:** `ref` – cần gắn vào phần tử bọc nội dung (ví dụ `<main ref={revealRef}>`).

**Dùng ở đâu:** `MainLayout` gắn ref vào `<main>`; mọi section có class `reveal` (CategorySection, TemplateSection…) sẽ được observer và thêm `active` khi scroll tới.

---

### 3. `useScrollVisibility()`

**Mục đích:** Quyết định **khi nào hiện** thanh CTA dính dưới và nút “Back to top” dựa trên vị trí scroll.

**Cách hoạt động:**
- Dùng hai `useState`: `showCtaBar` và `showBackToTop`.
- Trong `useEffect`, lắng nghe `scroll`:
  - **showCtaBar = true** khi: đã scroll qua hết section `#templates` và chưa tới gần section `#cta` (còn cách > 200px).
  - **showBackToTop = true** khi: scroll xuống quá 500px.
- Khi unmount thì gỡ listener.

**Trả về:** `{ showCtaBar: boolean, showBackToTop: boolean }`.

**Dùng ở đâu:** `MainLayout` dùng để thêm class `visible` cho Sticky CTA bar và nút Back to top.

---

## Tóm tắt

| Hook                 | Trả về              | Ý nghĩa chính                          |
|----------------------|---------------------|----------------------------------------|
| `useScrollProgress`  | `number` (0–100)    | % scroll trang → vẽ thanh progress    |
| `useRevealOnScroll`  | `ref`               | Thêm `active` cho `.reveal` khi scroll tới |
| `useScrollVisibility`| `{ showCtaBar, showBackToTop }` | Hiện/ẩn CTA bar và nút Back to top theo scroll |

Cả ba đều là **custom hooks** dùng cho trải nghiệm scroll trên trang chủ (progress bar, reveal, CTA/back to top).
