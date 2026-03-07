# LoveCards

Nền tảng thiệp cưới trực tuyến — giúp bạn tạo thiệp cưới điện tử đẹp mắt, dễ dàng tùy chỉnh và chia sẻ qua link.

---

## Giới thiệu

**LoveCards** là ứng dụng web cho phép cặp đôi:

- Khám phá hàng trăm mẫu thiệp cưới theo nhiều phong cách (lãng mạn, sang trọng, hiện đại, tối giản...)
- Tùy chỉnh nội dung: thông tin, hình ảnh, âm nhạc
- Chia sẻ thiệp qua Zalo, Messenger, SMS chỉ với một link

Thiệp hiển thị tối ưu trên cả điện thoại và máy tính, tiết kiệm chi phí in ấn.

---

## Công nghệ

- **Framework:** React 19
- **Build:** Vite 8
- **Ngôn ngữ:** TypeScript
- **Styling:** Tailwind CSS
- **Kiến trúc:** Feature-based

---

## Chạy dự án

```bash
# Cài đặt
npm install

# Development
npm run dev

# Build
npm run build

# Preview build
npm preview
```

---

## Cấu trúc dự án

```
src/
├── app/          # Router, store, providers
├── features/     # auth, user, product
├── shared/       # components, hooks, services, utils
├── layouts/      # Header, Footer, MainLayout
├── pages/        # Các trang màn hình
├── styles/       # CSS global
└── types/        # TypeScript types
```

Chi tiết xem tại [`docs/technical-docs/project-structure.md`](docs/technical-docs/project-structure.md).

---

## Tài liệu

- [Cấu trúc dự án](docs/technical-docs/project-structure.md)
- [Hướng dẫn triển khai trang chủ](docs/technical-docs/homepage-implementation-guide.md)

---

© 2026 LoveCards
