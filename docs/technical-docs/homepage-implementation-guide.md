# Hướng dẫn triển khai Trang chủ LoveCards

Tài liệu hướng dẫn chuyển đổi màn hình trang chủ HTML sang React, theo đúng cấu trúc dự án.

> **Nguyên tắc triển khai:** **Tạo giao diện trước, số liệu tạo sau.**  
> Ưu tiên dựng layout, component và UI trước. Dùng số liệu tĩnh/hardcode trong JSX. Không cần hooks tính toán hay fetch data lúc đầu — bổ sung sau khi giao diện đã ổn định.

---

## 0. Hướng dẫn cài đặt từng bước (chạy theo thứ tự)

### Bước 0.1: Cài đặt Tailwind CSS v4 (Vite)

> **Dự án đang dùng Tailwind v4.** Cấu hình bằng CSS (`@theme`), không cần `tailwind.config.js`.

```bash
npm install -D tailwindcss @tailwindcss/vite
```

Trong `vite.config.ts` thêm plugin:

```ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

Trong file CSS chính (`src/index.css` hoặc `src/styles/globals.css`):

```css
@import "tailwindcss";
```

Theme, colors, fonts cấu hình bằng `@theme` trong cùng file CSS (xem **mục 6.1**).

---

### Bước 0.2: Cài Phosphor Icons (React)

```bash
npm install @phosphor-icons/react
```

---

### Bước 0.3: Cài React Router (cho routing)

```bash
npm install react-router-dom
```

---

### Bước 0.4: Tạo thư mục cần thiết

```bash
mkdir -p src/features/home/components src/features/home/data src/shared/hooks
```

---

### Bước 0.5: Chuẩn bị ảnh

Copy các file ảnh vào `public/imgs/logo/`:

- `result_logoAvi.png`
- `Gemini_Generated_Image_tn5ff3tn5ff3tn5f.png` (mockup thiệp hero)

Hoặc dùng ảnh có sẵn trong `src/assets/images/logo/` và import trong component.

---

### Bước 0.6: Cập nhật index.html (fonts + favicon)

Mở `index.html`, thêm vào `<head>`:

```html
<link rel="icon" type="image/png" href="/imgs/logo/result_logoAvi.png" />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
```

Đổi `lang="en"` thành `lang="vi"` và `title` thành `LoveCards`.

---

### Bước 0.7: Kiểm tra chạy dev

```bash
npm run dev
```

Nếu chạy được, tiếp tục theo thứ tự **Bước 1 → Bước 12** trong **Mục 2** và copy code từ **Mục 6** bên dưới.

---

### Tổng hợp lệnh cài đặt (chạy một lần) — Tailwind v4 + Vite

```bash
npm install -D tailwindcss @tailwindcss/vite
npm install @phosphor-icons/react react-router-dom
mkdir -p src/features/home/components src/features/home/data src/shared/hooks
```

---

## 1. Phân tích & Phân chia

Bản HTML trang chủ được chia thành các phần sau:


| Phần             | HTML tương ứng                                | Đặt vào                         | Ghi chú                         |
| ---------------- | --------------------------------------------- | ------------------------------- | ------------------------------- |
| **Layout nền**   | `body`, scroll progress, CTA bar, back-to-top | `layouts/`                      | Header + Footer là layout chính |
| **Header**       | `<header>` nav                                | `layouts/Header.tsx`            | Logo, nav, CTA                  |
| **Hero**         | Section đầu tiên                              | `features/home/`                | Hero + CTA                      |
| **Phong cách**   | Section "Lựa Chọn Dành Cho Bạn"               | `features/home/`                | Các category card               |
| **Mẫu thiệp**    | Section `#templates`                          | `features/home/`                | Grid template cards             |
| **Trending**     | Section `#trending`                           | `features/home/`                | FOMO cards                      |
| **Quy trình**    | Section `#how-it-works`                       | `features/home/`                | Steps + thống kê                |
| **Gallery**      | Section `#gallery`                            | `features/home/`                | Masonry layout                  |
| **Testimonials** | Section `#testimonials`                       | `features/home/` hoặc `shared/` | Đánh giá khách hàng             |
| **CTA**          | Section `#cta` + Sticky bar                   | `shared/components/`            | Form đăng ký email              |
| **Footer**       | `<footer>`                                    | `layouts/Footer.tsx`            | Links, contact, social          |


Dùng `**features/home/`** cho toàn bộ section trang chủ. `**features/product/**` dành sau cho trang chi tiết mẫu thiệp khi cần.

---

## 2. Lộ trình code theo từng bước (chi tiết)

### Bước 1: Styles & Theme (Tailwind v4)

**Làm gì:** Cấu hình Tailwind v4 bằng CSS (`@theme`), không dùng `tailwind.config.js`.

1. Đảm bảo `vite.config.ts` đã thêm plugin `@tailwindcss/vite` (Bước 0.1)
2. Tạo/ sửa file `src/styles/globals.css` (hoặc `src/index.css`):
  - Thêm `@import "tailwindcss";`
  - Thêm block `@theme { ... }` với colors, fonts, boxShadow như **mục 6.1**  
  - Thêm keyframes, `.reveal`, `.masonry`, `.scroll-progress`, v.v. từ **mục 6.2**
3. Trong `src/main.tsx`, import: `import './styles/globals.css'` (hoặc giữ `./index.css`)

**Code tham khảo:** Xem **mục 6.1** (@theme cho Tailwind v4) và **mục 6.2** (globals.css).

---

### Bước 2: Hooks UI (ScrollProgress, Reveal, Visibility)

**Làm gì:** Tạo hooks phục vụ hiệu ứng scroll, không tính số liệu.

1. Tạo `src/shared/hooks/useScrollProgress.ts` — copy từ **mục 6.13**
2. Tạo `src/shared/components/ScrollProgress.tsx` — dùng `useScrollProgress`, render `<div className="scroll-progress" style={{ width: \`${progress}% }} />`
3. Tạo `src/shared/components/BackToTop.tsx` — copy logic từ **mục 6.14**
4. Tạo `src/shared/components/StickyCTABar.tsx` — copy từ **mục 6.14**
5. Logic reveal: thêm class `reveal` cho element, dùng `useEffect` + `IntersectionObserver` như trong **mục 6.13** (có thể tạo hook `useRevealOnScroll` hoặc gắn trực tiếp trong MainLayout)

**Code tham khảo:** Xem **mục 6.13**, **mục 6.14**.

---

### Bước 3: Layouts (Header, Footer, MainLayout)

**Làm gì:** Dựng Header, Footer và MainLayout bọc tất cả.

1. Tạo `src/layouts/Header.tsx` — copy JSX từ **mục 6.3**
2. Tạo `src/layouts/Footer.tsx` — copy JSX từ **mục 6.12**
3. Tạo `src/layouts/MainLayout.tsx`:
  ```tsx
   export function MainLayout({ children }: { children: React.ReactNode }) {
     return (
       <>
         <ScrollProgress />
         <Header />
         <main>{children}</main>
         <Footer />
         <StickyCTABar />
         <BackToTop />
       </>
     );
   }
  ```

**Code tham khảo:** **mục 6.3** (Header), **mục 6.12** (Footer).

---

### Bước 4: HeroSection

**Làm gì:** Tạo section hero đầu trang.

1. Tạo `src/features/home/components/HeroSection.tsx`
2. Copy JSX từ **mục 6.4**
3. Đổi Phosphor web (`<i class="ph-fill ph-users-three">`) sang React: `import { UsersThree } from '@phosphor-icons/react'` và dùng `<UsersThree weight="fill" />`
4. Đường dẫn ảnh: `/imgs/logo/result_logoAvi.png` và `/imgs/logo/Gemini_Generated_Image_*.png` (đảm bảo file tồn tại trong `public/imgs/logo/`)

---

### Bước 5: CategorySection

**Làm gì:** Section phong cách (Lãng mạn, Sang trọng...).

1. Tạo `src/features/home/components/CategorySection.tsx`
2. Copy logic từ **mục 6.5**
3. Dùng Phosphor React: `Heart`, `Diamond`, `Sparkle`, `Circle`, `Scroll`
4. Dùng số tĩnh: 24 mẫu, 18 mẫu... hardcode trong JSX

---

### Bước 6: TemplateSection

**Làm gì:** Grid mẫu thiệp (Peony Dream, Golden Ring...).

1. Tạo `src/features/home/components/TemplateSection.tsx`
2. Copy cấu trúc từ **mục 6.6**
3. Tạo mảng tĩnh 4 mẫu với: `title`, `image`, `style`, `usage`, `badge?` (Trending/Popular)
4. Map mảng render card, không cần API

---

### Bước 7: TrendingSection

**Làm gì:** Section đang thịnh hành (FOMO cards).

1. Tạo `src/features/home/components/TrendingSection.tsx`
2. Copy từ **mục 6.7**
3. Mảng tĩnh 3 item: `title`, `image`, `count`, `badge` (live / sale)

---

### Bước 8: HowItWorksSection

**Làm gì:** 3 bước + 4 điểm mạnh.

1. Tạo `src/features/home/components/HowItWorksSection.tsx`
2. Copy từ **mục 6.8**
3. Dùng `Palette`, `CursorClick`, `PaperPlaneRight`, `Images`, `MagicWand`, `RocketLaunch`, `DeviceMobile` từ Phosphor React

---

### Bước 9: GallerySection

**Làm gì:** Masonry gallery.

1. Tạo `src/features/home/components/GallerySection.tsx`
2. Copy từ **mục 6.9**
3. Mảng tĩnh `galleryImages`: `{ src, label? }` — 6 URL ảnh Unsplash như trong HTML

---

### Bước 10: TestimonialsSection

**Làm gì:** 3 đánh giá khách hàng.

1. Tạo `src/features/home/components/TestimonialsSection.tsx`
2. Copy từ **mục 6.10**
3. Mảng tĩnh: `quote`, `name`, `role`, `date`, `avatar`

---

### Bước 11: CTASection

**Làm gì:** Form email + CTA.

1. Tạo `src/features/home/components/CTASection.tsx`
2. Copy từ **mục 6.11**
3. Form `onSubmit={(e) => e.preventDefault()}` — chưa xử lý gửi email

---

### Bước 12: HomePage + Router

**Làm gì:** Ghép tất cả sections và cấu hình route.

1. Tạo `src/pages/HomePage.tsx`:
  ```tsx
   import { MainLayout } from '@/layouts/MainLayout';
   import { HeroSection } from '@/features/home/components/HeroSection';
   // ... import các section khác

   export function HomePage() {
     return (
       <MainLayout>
         <HeroSection />
         <CategorySection />
         <TemplateSection />
         <TrendingSection />
         <HowItWorksSection />
         <GallerySection />
         <TestimonialsSection />
         <CTASection />
       </MainLayout>
     );
   }
  ```
2. Tạo `src/app/router/index.tsx` (hoặc cấu hình trong `App.tsx`):
  ```tsx
   import { createBrowserRouter, RouterProvider } from 'react-router-dom';
   import { HomePage } from '@/pages/HomePage';

   const router = createBrowserRouter([
     { path: '/', element: <HomePage /> },
   ]);

   export function AppRouter() {
     return <RouterProvider router={router} />;
   }
  ```
3. Trong `App.tsx`, render `<AppRouter />`
4. Cấu hình alias `@` trong `vite.config.ts` và `tsconfig` nếu chưa có:
  ```ts
   // vite.config.ts
   resolve: { alias: { '@': '/src' } }
  ```

---

## 3. Thứ tự triển khai (tóm tắt)


| #   | Bước                | File / thư mục chính                                                 |
| --- | ------------------- | -------------------------------------------------------------------- |
| 0   | Cài đặt             | `npm install tailwindcss @phosphor-icons/react react-router-dom`     |
| 1   | Styles & Theme (v4) | `@theme` trong `globals.css`, `vite.config.ts` + `@tailwindcss/vite` |
| 2   | Hooks UI            | `useScrollProgress`, `ScrollProgress`, `BackToTop`, `StickyCTABar`   |
| 3   | Layouts             | `Header.tsx`, `Footer.tsx`, `MainLayout.tsx`                         |
| 4   | HeroSection         | `features/home/components/HeroSection.tsx`                           |
| 5   | CategorySection     | `CategorySection.tsx`                                                |
| 6   | TemplateSection     | `TemplateSection.tsx`                                                |
| 7   | TrendingSection     | `TrendingSection.tsx`                                                |
| 8   | HowItWorksSection   | `HowItWorksSection.tsx`                                              |
| 9   | GallerySection      | `GallerySection.tsx`                                                 |
| 10  | TestimonialsSection | `TestimonialsSection.tsx`                                            |
| 11  | CTASection          | `CTASection.tsx`                                                     |
| 12  | HomePage + Router   | `HomePage.tsx`, `app/router/index.tsx`, `App.tsx`                    |


---

## 4. Lưu ý khi code

- **Giao diện trước, số liệu sau**: Dựng layout và component trước. Dùng số tĩnh trong JSX, không cần hooks tính số liệu. Mock/API bổ sung sau
- **Ảnh trong code**: Dùng `import logo from '@/assets/images/logo/result_logoAvi.png'`
- **Ảnh public**: Đặt trong `public/imgs/` và dùng `/imgs/logo/result_logoAvi.png`
- **Phosphor Icons**: Dùng `<Heart />`, `<UsersThree />` thay cho `<i class="ph ph-heart">`
- **Data mock**: Tạo `features/home/data/templates.ts`, `testimonials.ts` trước khi kết nối API (khi cần)
- **Animations**: Giữ keyframes trong CSS, điều khiển class bằng `useRevealOnScroll` và state

---

## 5. Cấu trúc file cuối (tham khảo)

```
src/
├── app/
│   └── router/
│       └── index.tsx
├── features/
│   └── home/
│       ├── components/
│       │   ├── HeroSection.tsx
│       │   ├── CategorySection.tsx
│       │   ├── TemplateSection.tsx
│       │   ├── TrendingSection.tsx
│       │   ├── HowItWorksSection.tsx
│       │   ├── GallerySection.tsx
│       │   ├── TestimonialsSection.tsx
│       │   └── CTASection.tsx
│       └── data/
│           ├── templates.ts
│           └── testimonials.ts
├── layouts/
│   ├── MainLayout.tsx
│   ├── Header.tsx
│   └── Footer.tsx
├── pages/
│   └── HomePage.tsx
├── shared/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Reveal.tsx
│   │   ├── ScrollProgress.tsx
│   │   ├── BackToTop.tsx
│   │   └── StickyCTABar.tsx
│   └── hooks/
│       ├── useScrollProgress.ts
│       ├── useRevealOnScroll.ts
│       └── useScrollVisibility.ts
└── styles/
    └── globals.css
```

---

---

## 6. Code tham khảo theo từng phần

### 6.1. Tailwind v4 — @theme (trong globals.css)

Tailwind v4 không dùng `tailwind.config.js`. Cấu hình theme trong CSS bằng `@theme`:

```css
@import "tailwindcss";

@theme {
  /* Fonts */
  --font-sans: 'Inter', sans-serif;
  --font-serif: 'Playfair Display', serif;

  /* Colors */
  --color-cream: #FFF8F8;
  --color-rose: #E11D48;
  --color-softpink: #F9A8D4;
  --color-lightrose: #FDE2E4;
  --color-gold: #C9A227;
  --color-slate: #334155;

  /* Box shadow */
  --shadow-soft: 0 20px 40px -15px rgba(225, 29, 72, 0.08);
  --shadow-card: 0 10px 30px -10px rgba(51, 65, 85, 0.05);
}
```

Sau khi khai báo, dùng các class như: `bg-cream`, `text-rose`, `font-serif`, `shadow-soft`, `shadow-card`.

---

### 6.2. globals.css (keyframes & utilities)

```css
body {
  background-color: #FFF8F8;
  color: #334155;
  scroll-behavior: smooth;
}

@keyframes fadeInLoad {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-load {
  animation: fadeInLoad 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes floating {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}
.animate-floating {
  animation: floating 6s ease-in-out infinite;
}

.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out;
}
.reveal.active {
  opacity: 1;
  transform: translateY(0);
}

.masonry {
  column-count: 2;
  column-gap: 1.5rem;
}
@media (min-width: 768px) {
  .masonry { column-count: 3; }
}
@media (min-width: 1024px) {
  .masonry { column-count: 4; }
}
.masonry > div {
  break-inside: avoid;
  margin-bottom: 1.5rem;
}

.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #E11D48, #C9A227);
  z-index: 9999;
  transform-origin: left;
}

.cta-bar {
  position: fixed;
  bottom: -100px;
  left: 0;
  right: 0;
  z-index: 999;
  transition: bottom 0.4s ease;
  box-shadow: 0 -10px 40px rgba(0,0,0,0.08);
}
.cta-bar.visible {
  bottom: 0;
}

.back-to-top {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 998;
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
  transition: all 0.3s ease;
}
.back-to-top.visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.pulse-dot {
  animation: pulse-dot 2s ease-in-out infinite;
}
```

---

### 6.3. Header (JSX)

```tsx
<header className="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-lightrose transition-all">
  <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
    <a href="#" className="flex items-center gap-2">
      <img src="/imgs/logo/result_logoAvi.png" alt="LoveCards - Logo" className="w-10 h-10 rounded-full object-cover flex-shrink-0 aspect-square" width={40} height={40} />
      <span className="font-serif font-bold text-2xl text-slate">LoveCards</span>
    </a>
    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate">
      <a href="#" className="hover:text-rose transition-colors">Trang chủ</a>
      <a href="#templates" className="hover:text-rose transition-colors">Mẫu thiệp</a>
      <a href="#trending" className="hover:text-rose transition-colors">Đang hot</a>
      <a href="#gallery" className="hover:text-rose transition-colors">Bộ sưu tập</a>
      <a href="#how-it-works" className="hover:text-rose transition-colors">Giới thiệu</a>
      <a href="#testimonials" className="hover:text-rose transition-colors">Đánh giá</a>
      <a href="#footer" className="hover:text-rose transition-colors">Liên hệ</a>
    </nav>
    <a href="#templates" className="hidden md:inline-flex px-6 py-2.5 rounded-full bg-rose text-white text-sm font-medium hover:bg-rose/90 shadow-md hover:shadow-soft transition-all duration-300">
      Xem mẫu thiệp
    </a>
  </div>
</header>
```

---

### 6.4. HeroSection (JSX)

```tsx
<section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-lightrose via-cream to-white">
  <div className="absolute top-20 left-10 w-72 h-72 bg-softpink rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
  <div className="absolute top-40 right-20 w-72 h-72 bg-gold rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }} />

  <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center">
    <div className="space-y-8 z-10 animate-load">
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-lightrose text-gold text-xs font-semibold uppercase tracking-widest shadow-sm">
          ✨ Mùa cưới 2026
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm text-slate/60">
          <i className="ph-fill ph-users-three text-rose" />
          <strong className="text-slate">10.000+</strong> cặp đôi tin dùng
        </span>
      </div>
      <h1 className="text-5xl lg:text-6xl font-serif font-bold leading-tight text-slate">
        Khám phá những mẫu thiệp cưới <br />
        <span className="italic font-normal text-rose">đẹp và tinh tế</span>
      </h1>
      <p className="text-lg text-slate/70 max-w-md leading-relaxed font-light">
        Tạo dấu ấn riêng cho ngày trọng đại với những thiết kế sang trọng, dễ dàng tùy chỉnh và chia sẻ niềm vui đến người thân chỉ trong vài thao tác.
      </p>
      <div className="flex flex-wrap gap-4 pt-2">
        <a href="#templates" className="px-8 py-4 rounded-full bg-rose text-white font-medium hover:bg-rose/90 hover:shadow-soft hover:-translate-y-1 transition-all">
          Xem các mẫu thiệp
        </a>
        <a href="#gallery" className="px-8 py-4 rounded-full bg-white text-slate font-medium border border-lightrose hover:border-gold hover:text-gold transition-all shadow-sm">
          Khám phá bộ sưu tập
        </a>
      </div>
      <div className="pt-6 border-t border-lightrose mt-8">
        <p className="text-sm text-slate/60 leading-relaxed">
          Thiệp cưới điện tử giúp bạn tiết kiệm chi phí in ấn, gửi tới mọi người chỉ với một link. Khách mời mở thiệp trên điện thoại, máy tính đều đẹp mắt, chuyên nghiệp.
        </p>
      </div>
    </div>

    <div className="relative z-10 hidden md:flex justify-center items-center animate-load" style={{ animationDelay: '0.2s' }}>
      <div className="relative">
        <div className="absolute -inset-4 bg-gradient-to-br from-white/60 via-gold/20 to-rose/10 rounded-2xl blur-2xl" />
        <div className="absolute -inset-px bg-gradient-to-br from-white/80 via-transparent to-white/40 rounded-xl" />
        <img
          src="/imgs/logo/Gemini_Generated_Image_tn5ff3tn5ff3tn5f.png"
          className="relative max-w-[560px] w-full h-auto rounded-xl animate-floating drop-shadow-2xl"
          style={{ boxShadow: '0 0 60px rgba(255,255,255,0.3), 0 0 100px rgba(201,162,39,0.15)' }}
          alt="Thiệp cưới mẫu"
        />
      </div>
    </div>
  </div>
</section>
```

---

### 6.5. CategorySection (JSX)

```tsx
<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-12 reveal">
      <span className="text-gold text-sm font-bold uppercase tracking-widest block mb-2">Phong cách</span>
      <h2 className="font-serif text-3xl font-bold text-slate mb-2">Lựa Chọn Dành Cho Bạn</h2>
      <p className="text-slate/60 max-w-xl mx-auto">Chọn phong cách phù hợp với câu chuyện tình yêu của bạn</p>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-6 reveal">
      {[
        { icon: 'ph-light ph-heart', label: 'Lãng mạn', count: '24 mẫu', color: 'group-hover:text-rose' },
        { icon: 'ph-light ph-diamond', label: 'Sang trọng', count: '18 mẫu', color: 'group-hover:text-gold' },
        { icon: 'ph-light ph-sparkle', label: 'Hiện đại', count: '32 mẫu', color: 'group-hover:text-softpink' },
        { icon: 'ph-light ph-circle', label: 'Tối giản', count: '20 mẫu', color: '' },
        { icon: 'ph-light ph-scroll', label: 'Cổ điển', count: '15 mẫu', color: 'group-hover:text-gold', hidden: true },
      ].map((cat) => (
        <a
          key={cat.label}
          href={`#templates?cat=${cat.label.toLowerCase()}`}
          className={`group flex flex-col items-center justify-center p-8 bg-cream rounded-3xl hover:bg-lightrose/50 hover:-translate-y-2 hover:shadow-card transition-all duration-300 border border-transparent hover:border-lightrose ${cat.hidden ? 'hidden md:flex' : ''}`}
        >
          <i className={`${cat.icon} text-4xl text-rose mb-4 group-hover:scale-110 transition-transform`} />
          <span className={`font-medium text-slate transition-colors ${cat.color}`}>{cat.label}</span>
          <span className="text-xs text-slate/50 mt-1">{cat.count}</span>
        </a>
      ))}
    </div>
  </div>
</section>
```

---

### 6.6. TemplateSection (JSX)

```tsx
<section id="templates" className="py-24 bg-cream">
  <div className="max-w-7xl mx-auto px-6">
    <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-12 reveal">
      <div>
        <h2 className="font-serif text-4xl font-bold text-slate">Mẫu Thiệp Nổi Bật</h2>
        <p className="text-slate/60 mt-2">Khám phá các thiết kế được yêu thích nhất mùa cưới này.</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <select className="px-4 py-2 rounded-full border border-lightrose bg-white text-sm text-slate focus:outline-none focus:ring-2 focus:ring-rose/20">
          <option>Tất cả phong cách</option>
        </select>
        <a href="#" className="text-rose font-medium hover:text-rose/80 transition-colors flex items-center gap-1">
          Xem tất cả <i className="ph ph-arrow-right" />
        </a>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 reveal">
      {/* Lặp qua data templates */}
      <div className="group bg-white rounded-3xl p-3 shadow-card hover:shadow-soft hover:-translate-y-2 transition-all duration-500 border border-lightrose relative">
        <div className="absolute top-6 left-6 z-10 bg-rose text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-md">🔥 Trending</div>
        <div className="relative h-72 rounded-2xl overflow-hidden mb-4">
          <img src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Peony Dream" loading="lazy" />
          <div className="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm flex items-center justify-center">
            <button className="px-6 py-2.5 bg-rose text-white rounded-full text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-md">Xem mẫu</button>
          </div>
        </div>
        <div className="px-3 pb-3">
          <h3 className="font-serif text-xl font-bold text-slate mb-1 group-hover:text-rose transition-colors">Peony Dream</h3>
          <p className="text-sm text-slate/50">Lãng mạn • 2.4k lượt dùng</p>
        </div>
      </div>
      {/* ... các card khác tương tự */}
    </div>
  </div>
</section>
```

---

### 6.7. TrendingSection (JSX)

```tsx
<section id="trending" className="py-24 bg-white">
  <div className="max-w-7xl mx-auto px-6">
    <div className="flex items-center gap-3 mb-12 reveal">
      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lightrose/60 text-rose text-sm font-bold">
        <i className="ph-fill ph-trend-up pulse-dot" /> Đang thịnh hành
      </span>
      <span className="text-sm text-slate/50">Cập nhật mỗi ngày</span>
    </div>
    <div className="grid md:grid-cols-3 gap-8 reveal">
      {[
        { img: '...', title: 'Blush Dream', count: '12.5k', badge: { type: 'live', text: '12 đang xem' } },
        { img: '...', title: 'Soft Ivory', count: '9.2k', badge: { type: 'live', text: '8 đang xem' } },
        { img: '...', title: 'Botanical Love', count: '8.7k', badge: { type: 'sale', text: 'Giảm 20% tuần này' } },
      ].map((item) => (
        <article key={item.title} className="group bg-cream rounded-3xl p-4 border border-lightrose relative overflow-hidden hover:shadow-soft hover:-translate-y-2 transition-all">
          <div className="absolute top-4 right-4 z-10 ...">
            {item.badge.type === 'live' && (
              <span className="flex items-center gap-1.5 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs">
                <span className="w-2 h-2 rounded-full bg-green-500 pulse-dot" /> {item.badge.text}
              </span>
            )}
            {item.badge.type === 'sale' && (
              <span className="bg-gold text-white text-[10px] font-bold px-2 py-1 rounded-full">{item.badge.text}</span>
            )}
          </div>
          <div className="relative h-80 rounded-2xl overflow-hidden mb-4">
            <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} loading="lazy" />
            <span className="absolute bottom-3 left-3 bg-slate/80 text-white text-xs px-3 py-1 rounded-full">{item.count} lượt dùng</span>
          </div>
          <h3 className="font-serif text-xl font-bold text-slate mb-1">{item.title}</h3>
          <a href="#templates" className="inline-flex items-center gap-2 text-rose text-sm font-medium hover:gap-3 transition-all">Xem mẫu <i className="ph ph-arrow-right" /></a>
        </article>
      ))}
    </div>
  </div>
</section>
```

---

### 6.8. HowItWorksSection (JSX)

```tsx
<section id="how-it-works" className="py-24 bg-cream">
  <div className="max-w-7xl mx-auto px-6">
    <div className="mb-24 reveal">
      <div className="text-center mb-16">
        <h2 className="font-serif text-4xl font-bold text-slate mb-4">Quy Trình Tạo Thiệp</h2>
        <p className="text-slate/60 max-w-xl mx-auto">Chỉ với 3 bước đơn giản, bạn đã có ngay một tấm thiệp cưới điện tử mang đậm dấu ấn cá nhân.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 relative">
        <div className="hidden md:block absolute top-12 left-[16%] w-[68%] h-[2px] border-t-2 border-dashed border-lightrose z-0" />
        {[
          { icon: 'ph-palette', title: '1. Chọn phong cách', desc: 'Lựa chọn từ hàng trăm mẫu thiệp đa dạng phù hợp với concept lễ cưới.' },
          { icon: 'ph-cursor-click', title: '2. Xem và tùy chỉnh', desc: 'Thay đổi thông tin, hình ảnh, âm nhạc để tạo ra lời mời của riêng bạn.', mt: true },
          { icon: 'ph-paper-plane-right', title: '3. Chia sẻ nhanh chóng', desc: 'Gửi link thiệp qua Zalo, Messenger, SMS cho bạn bè và gia đình tức thì.' },
        ].map((step) => (
          <div key={step.title} className={`relative z-10 bg-white p-8 rounded-3xl text-center shadow-card border border-lightrose hover:border-rose/30 transition-colors group ${step.mt ? 'mt-0 md:mt-8' : ''}`}>
            <div className="w-16 h-16 mx-auto rounded-full bg-white text-rose flex items-center justify-center text-2xl mb-6 shadow-md border border-lightrose group-hover:scale-110 transition-transform">
              <i className={`ph ${step.icon}`} />
            </div>
            <h3 className="text-lg font-bold text-slate mb-2">{step.title}</h3>
            <p className="text-sm text-slate/60 mb-6">{step.desc}</p>
            <a href="#templates" className="text-rose text-sm font-medium hover:underline">Bắt đầu chọn →</a>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-white rounded-[3rem] p-12 lg:p-16 border border-lightrose reveal">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { icon: 'ph-light ph-images', label: '200+ Mẫu Đẹp', desc: 'Cập nhật xu hướng liên tục', color: 'text-gold' },
          { icon: 'ph-light ph-magic-wand', label: 'Tạo Trong 5 Phút', desc: 'Kéo thả tùy chỉnh trực quan', color: 'text-rose' },
          { icon: 'ph-light ph-rocket-launch', label: 'Chia Sẻ Tức Thì', desc: 'Zalo, Messenger chỉ 1 giây', color: 'text-gold' },
          { icon: 'ph-light ph-device-mobile', label: '100% Mobile', desc: 'Hiển thị hoàn hảo mọi thiết bị', color: 'text-rose' },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center text-center gap-4 group">
            <div className={`w-14 h-14 rounded-2xl bg-cream ${item.color} flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform`}>
              <i className={item.icon} />
            </div>
            <div>
              <h4 className="font-bold text-slate">{item.label}</h4>
              <p className="text-xs text-slate/50 mt-1">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
```

---

### 6.9. GallerySection (JSX)

```tsx
<section id="gallery" className="py-24 bg-cream reveal">
  <div className="max-w-7xl mx-auto px-6">
    <h2 className="font-serif text-4xl font-bold text-slate mb-12 text-center">Thư Viện Cảm Hứng</h2>
    <div className="masonry">
      {galleryImages.map((img) => (
        <div key={img.src} className="rounded-3xl overflow-hidden hover:opacity-90 hover:shadow-lg transition-all group relative">
          <img src={img.src} className="w-full h-auto" alt="Gallery" loading="lazy" />
          {img.label && (
            <div className="absolute inset-0 bg-slate/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl">
              <span className="bg-white px-4 py-2 rounded-full text-sm font-medium text-slate shadow-md">{img.label}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
</section>
```

---

### 6.10. TestimonialsSection (JSX)

```tsx
<section id="testimonials" className="py-24 bg-cream reveal">
  <div className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-16">
      <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate mb-2">Trải Nghiệm Từ Khách Hàng</h2>
      <p className="text-slate/60">4.9/5 từ <strong className="text-slate">2.341</strong> đánh giá</p>
    </div>
    <div className="grid md:grid-cols-3 gap-8">
      {[
        { quote: 'Giao diện web rất đẹp...', name: 'Minh Anh', role: 'Cô dâu', date: 'Cưới 15.10.2025', avatar: '...' },
        // ...
      ].map((t) => (
        <div key={t.name} className="bg-white p-8 rounded-[2rem] border border-lightrose shadow-card hover:shadow-soft hover:-translate-y-1 transition-all">
          <div className="flex text-gold mb-4 text-sm">
            {[...Array(5)].map((_, i) => <i key={i} className="ph-fill ph-star" />)}
          </div>
          <p className="text-slate/70 text-sm mb-8 font-light leading-relaxed">"{t.quote}"</p>
          <div className="flex items-center gap-3">
            <img src={t.avatar} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" alt={t.name} loading="lazy" />
            <div>
              <h4 className="font-bold text-sm text-slate">{t.name}</h4>
              <p className="text-xs text-slate/50">{t.role} • {t.date}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

---

### 6.11. CTASection (JSX)

```tsx
<section id="cta" className="py-12 px-6 reveal">
  <div className="max-w-5xl mx-auto bg-gradient-to-br from-lightrose via-rose/10 to-gold/20 rounded-[3rem] p-1 shadow-soft border border-lightrose">
    <div className="bg-white/95 backdrop-blur-sm rounded-[2.9rem] p-12 md:p-20 text-center">
      <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate mb-6">Tìm mẫu thiệp cưới hoàn hảo cho ngày trọng đại của bạn</h2>
      <p className="text-slate/60 text-lg mb-2 max-w-xl mx-auto font-light">Tạo trải nghiệm • Không cần thẻ tín dụng</p>
      <p className="text-sm text-slate/50 mb-10">Nhận 10 mẫu thiệp hot mỗi tuần qua email</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <a href="#templates" className="inline-block px-10 py-4 bg-rose text-white text-base font-medium rounded-full hover:bg-rose/90 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto">Khám phá các mẫu thiệp</a>
        <form className="flex gap-2 w-full sm:w-auto max-w-md sm:max-w-none" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Email của bạn" className="flex-1 px-5 py-3 rounded-full border border-lightrose focus:outline-none focus:ring-2 focus:ring-rose/30 text-sm" />
          <button type="submit" className="px-6 py-3 bg-gold text-white rounded-full font-medium text-sm hover:bg-gold/90 transition-colors whitespace-nowrap">Nhận mẫu</button>
        </form>
      </div>
    </div>
  </div>
</section>
```

---

### 6.12. Footer (JSX)

```tsx
<footer id="footer" className="bg-slate text-white pt-16 pb-8">
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <img src="/imgs/logo/result_logoAvi.png" alt="LoveCards" className="w-10 h-10 rounded-full object-cover" width={40} height={40} />
        <span className="font-serif font-bold text-xl">LoveCards</span>
      </div>
      <p className="text-white/70 text-sm font-light leading-relaxed">Nền tảng thiệp cưới trực tuyến chuyên nghiệp...</p>
      <div className="flex gap-2 pt-2">
        <span className="text-xs px-2 py-1 bg-white/10 rounded text-white/80">🔒 Bảo mật</span>
        <span className="text-xs px-2 py-1 bg-white/10 rounded text-white/80">✓ Hỗ trợ 24/7</span>
      </div>
    </div>
    <div>
      <h4 className="font-bold text-softpink mb-6 text-sm uppercase tracking-wider">Khám Phá</h4>
      <ul className="space-y-3 text-sm text-white/70 font-light">
        <li><a href="#templates" className="hover:text-softpink transition-colors">Mẫu thiệp cưới</a></li>
        <li><a href="#trending" className="hover:text-softpink transition-colors">Đang thịnh hành</a></li>
        <li><a href="#gallery" className="hover:text-softpink transition-colors">Bộ sưu tập</a></li>
      </ul>
    </div>
    <div>
      <h4 className="font-bold text-softpink mb-6 text-sm uppercase tracking-wider">Liên Hệ</h4>
      <ul className="space-y-3 text-sm text-white/70 font-light">
        <li>📧 hello@lovecards.vn</li>
        <li>📞 1900 xxxx</li>
      </ul>
    </div>
    <div>
      <h4 className="font-bold text-softpink mb-6 text-sm uppercase tracking-wider">Kết Nối</h4>
      <div className="flex gap-4 text-white/50 text-2xl">
        <a href="#" className="hover:text-softpink transition-colors"><i className="ph-fill ph-instagram-logo" /></a>
        <a href="#" className="hover:text-softpink transition-colors"><i className="ph-fill ph-facebook-logo" /></a>
        <a href="#" className="hover:text-softpink transition-colors"><i className="ph-fill ph-pinterest-logo" /></a>
      </div>
    </div>
  </div>
  <div className="text-center text-white/50 text-sm border-t border-white/20 pt-8 font-light">
    © 2026 LoveCards. Thiết kế dành cho tình yêu.
  </div>
</footer>
```

---

### 6.13. Hooks: useScrollProgress, useRevealOnScroll & useScrollVisibility

```tsx
// useScrollProgress.ts
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handler = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return progress;
}

// useRevealOnScroll.ts - dùng IntersectionObserver add class .active cho .reveal
export function useRevealOnScroll() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && e.target.classList.add('active'));
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    el.querySelectorAll('.reveal').forEach((r) => obs.observe(r));
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ScrollProgress component
function ScrollProgress() {
  const progress = useScrollProgress();
  return <div className="scroll-progress" style={{ width: `${progress}%` }} />;
}
```

---

### 6.14. Sticky CTA & BackToTop logic

```tsx
// useScrollVisibility.ts - để hiện CTA bar và BackToTop
const [showCtaBar, setShowCtaBar] = useState(false);
const [showBackToTop, setShowBackToTop] = useState(false);

useEffect(() => {
  const templatesEl = document.getElementById('templates');
  const ctaEl = document.getElementById('cta');
  const handler = () => {
    const scrollY = window.scrollY;
    const templatesBottom = (templatesEl?.offsetTop ?? 0) + (templatesEl?.offsetHeight ?? 0);
    const ctaTop = ctaEl?.offsetTop ?? 0;
    setShowCtaBar(scrollY > templatesBottom && scrollY < ctaTop - 200);
    setShowBackToTop(scrollY > 500);
  };
  window.addEventListener('scroll', handler);
  return () => window.removeEventListener('scroll', handler);
}, []);

// StickyCTABar
<div className={`cta-bar bg-white/95 backdrop-blur-xl border-t border-lightrose py-4 ${showCtaBar ? 'visible' : ''}`}>
  <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
    <p className="text-slate font-medium">Sẵn sàng tạo thiệp cưới? <span className="text-rose font-semibold">Tạo trải nghiệm</span></p>
    <a href="#templates" className="px-8 py-3 bg-rose text-white rounded-full font-medium hover:bg-rose/90 shadow-soft transition-all whitespace-nowrap">Xem mẫu ngay</a>
  </div>
</div>

// BackToTop
<button
  className={`back-to-top w-12 h-12 rounded-full bg-white shadow-card border border-lightrose flex items-center justify-center text-rose hover:bg-rose hover:text-white transition-all ${showBackToTop ? 'visible' : ''}`}
  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
  aria-label="Lên đầu trang"
>
  <i className="ph ph-caret-up text-xl" />
</button>
```

---

### 6.15. index.html – Fonts & Phosphor

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<script src="https://unpkg.com/@phosphor-icons/web"></script>
```

Hoặc dùng Phosphor React: `npm install @phosphor-icons/react` và import `Heart`, `UsersThree`, `CaretUp`...

---

*Cập nhật: 2025*