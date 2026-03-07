# Cấu trúc dự án Love Cards

Tài liệu này mô tả cấu trúc thư mục và mục đích của từng phần trong dự án **love-cards**.

## Tổng quan công nghệ

- **Framework**: React 19 + Vite 8
- **Ngôn ngữ**: TypeScript
- **Kiến trúc**: Feature-based (chia theo tính năng)

---

## Cấu trúc thư mục

```
love-cards/
├── docs/                    # Tài liệu dự án
│   ├── technical-docs/      # Tài liệu kỹ thuật
│   └── business-docs/       # Tài liệu nghiệp vụ
│
├── public/                  # File tĩnh (không qua build)
│
├── src/                     # Source code chính
│   ├── app/                 # Cấu hình ứng dụng
│   │   ├── router/          # Định tuyến (routing)
│   │   ├── store/           # State management (Redux/Zustand/...)
│   │   └── providers/       # React Context providers
│   │
│   ├── features/            # Các module theo tính năng
│   │   ├── auth/            # Xác thực, đăng nhập, đăng ký
│   │   ├── user/            # Quản lý người dùng
│   │   └── product/         # Sản phẩm / thiệp
│   │
│   ├── shared/              # Code dùng chung
│   │   ├── components/      # UI components tái sử dụng
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API, dịch vụ bên ngoài
│   │   └── utils/           # Hàm tiện ích
│   │
│   ├── layouts/             # Layout wrapper (Header, Sidebar...)
│   ├── pages/               # Trang màn hình (kết nối route)
│   ├── styles/              # CSS/SCSS global, biến, theme
│   ├── types/               # Định nghĩa TypeScript
│   ├── assets/              # Hình ảnh, font, file tĩnh
│   │
│   ├── App.tsx              # Component gốc
│   └── main.tsx             # Entry point
│
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Mô tả chi tiết

### `src/app/`
Chứa cấu hình và thiết lập cốt lõi của ứng dụng.
- **router/**: Định nghĩa routes, lazy loading, guards.
- **store/**: Trạng thái global (nếu dùng Redux, Zustand...).
- **providers/**: ThemeProvider, AuthProvider, i18nProvider, v.v.

### `src/features/`
Mỗi feature là một module độc lập, chứa logic và UI của một nhóm tính năng.
- **auth/**: Đăng nhập, đăng ký, quên mật khẩu.
- **user/**: Profile, cập nhật thông tin, quản lý tài khoản.
- **product/**: Danh sách sản phẩm/thiệp, chi tiết, tạo mới.

### `src/shared/`
Code dùng chung, không phụ thuộc nghiệp vụ cụ thể.
- **components/**: Button, Input, Modal, Card, v.v.
- **hooks/**: useLocalStorage, useDebounce, useMediaQuery, v.v.
- **services/**: Gọi API, config axios/fetch.
- **utils/**: formatDate, validate, helpers.

### `src/layouts/`
Layout bao bọc các trang (header, footer, sidebar, grid...).

### `src/pages/`
Component đại diện mỗi màn hình, thường map 1:1 với route.

### `src/styles/`
CSS global, biến, theme, reset.

### `src/types/`
Interfaces, types TypeScript dùng chung.

---

## Nguyên tắc tổ chức

1. **Feature-based**: Code theo tính năng, tránh đặt mọi thứ vào `components` hay `utils` chung.
2. **Tái sử dụng**: Đặt UI/ logic dùng chung trong `shared`.
3. **Phân tách rõ ràng**: Trang (pages) → Layout → Feature → Shared components.

---

*Cập nhật: 2025*
