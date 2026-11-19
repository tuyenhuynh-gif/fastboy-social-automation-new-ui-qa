/**
 * Đọc thông tin tài khoản test từ biến môi trường (.env).
 * KHÔNG hardcode email/mật khẩu trong code. KHÔNG in giá trị ra log.
 */
export function getTestUser(): { email: string; password: string; displayName: string } {
  const email = process.env.TEST_USER_EMAIL ?? '';
  const password = process.env.TEST_USER_PASSWORD ?? '';
  if (!email || !password) {
    throw new Error(
      'Thiếu TEST_USER_EMAIL hoặc TEST_USER_PASSWORD trong file .env (lỗi dữ liệu/môi trường).',
    );
  }
  // Tên hiển thị trên menu tài khoản. Theo quyết định của người dùng (2026-11-19): Expected về
  // thông tin tài khoản lấy theo tài khoản trong .env thay cho "chi Hương" trong file test case.
  const displayName = process.env.TEST_USER_DISPLAY_NAME ?? '';
  return { email, password, displayName };
}

/** Dùng cho test cần kiểm tra tên hiển thị: báo lỗi dữ liệu rõ ràng nếu chưa khai báo. */
export function requireDisplayName(): string {
  const { displayName } = getTestUser();
  if (!displayName) throw new Error('Thiếu TEST_USER_DISPLAY_NAME trong file .env (lỗi dữ liệu).');
  return displayName;
}
