/**
 * Cấu hình Playwright E2E cho Love Cards Frontend.
 * Quét file .e2e.spec.ts trong thư mục test/e2e của từng feature.
 * Tự bật Vite dev server nếu chưa có cổng 5173.
 * Biến môi trường: FE_URL, PW_SLOW_MO, PW_DEMO, CI.
 */
import { defineConfig } from '@playwright/test';

const baseURL = process.env.FE_URL ?? 'http://localhost:5173';
// slowMo > 0: chậm thao tác + bật ghi video — dùng khi chạy test:e2e:flow
const slowMo = process.env.PW_SLOW_MO ? Number(process.env.PW_SLOW_MO) : 0;

export default defineConfig({
  testDir: './src',
  testMatch: '**/test/e2e/**/*.e2e.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    browserName: 'chromium',
    trace: 'on-first-retry',
    video: slowMo > 0 ? 'on' : 'off',
    launchOptions: slowMo > 0 ? { slowMo } : undefined,
  },
  projects: [
    { name: 'mobile', use: { viewport: { width: 320, height: 640 } } },
    { name: 'tablet', use: { viewport: { width: 768, height: 1024 } } },
    { name: 'desktop', use: { viewport: { width: 1280, height: 800 } } },
  ],
  webServer: {
    command: 'npm run dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
