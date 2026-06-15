/// <reference types="vitest" />

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Khai báo các package và plugin sẽ sử dụng cho cấu hình Vite:
// - 'path' và 'fileURLToPath' dùng để xác định đường dẫn tuyệt đối dựa trên module URL, giúp đặt alias dễ dàng khi import các module khác trong src.
// - 'defineConfig' là API của Vite giúp hỗ trợ type và intellisense cho file cấu hình khi dùng TypeScript.
// - 'react' là plugin để chạy và tối ưu hóa dự án React trên Vite.
// - 'tailwindcss' là plugin để tích hợp TailwindCSS với Vite, cho phép sử dụng utility-classes Tailwind trong dự án.
// - '__dirname' là biến để lưu đường dẫn tuyệt đối của thư mục hiện tại, được sử dụng để đặt alias '@' cho các module trong src.
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: false,
    include: ['src/**/test/unit/**/*.test.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/test/e2e/**'],
  },
})
