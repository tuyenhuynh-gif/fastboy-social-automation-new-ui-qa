import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Đọc biến môi trường từ file .env (tài khoản test, URL). File .env KHÔNG được commit.
dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true });

const BASE_URL = process.env.BASE_URL || 'https://dev.fastboysocial.dev';

// Chốt an toàn: chỉ cho phép chạy trên môi trường DEV, tránh trỏ nhầm sang Production.
if (!new URL(BASE_URL).hostname.startsWith('dev.')) {
  throw new Error(`BASE_URL không phải môi trường DEV: ${BASE_URL}. Dừng chạy test.`);
}

/**
 * Tài liệu cấu hình: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  // Ứng dụng chỉ cho 1 phiên đăng nhập/tài khoản ("Đăng nhập trên thiết bị mới sẽ đăng xuất thiết bị cũ").
  // Các test dùng chung 1 tài khoản nên PHẢI chạy tuần tự, nếu không sẽ đá phiên của nhau.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0, // không retry để không che giấu lỗi chập chờn
  // Case gắn @lockout (vd. TC-CMN-AUTH-020) có thể KHOÁ tài khoản test → mặc định không chạy.
  // Chạy riêng bằng: npm run test:lockout
  grepInvert: process.env.RUN_LOCKOUT ? undefined : /@lockout/,
  grep: process.env.RUN_LOCKOUT ? /@lockout/ : undefined,

  // Báo cáo: in kết quả ra terminal + tạo HTML report (không tự mở trình duyệt)
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: BASE_URL,

    // Bằng chứng khi test FAIL (lưu trong thư mục test-results/)
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  // Giai đoạn đầu chỉ chạy Chromium. Thêm Firefox/WebKit khi cần.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
