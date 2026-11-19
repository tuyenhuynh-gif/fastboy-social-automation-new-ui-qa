import { test } from '@playwright/test';

/**
 * Nguồn test case: test-cases/SAT_TestCase_Login_Common_v1.0.md — NHÓM A (đăng nhập Google).
 * Theo quyết định trong CLAUDE.md (mục 1.1): luồng đăng nhập Google đầy đủ được test THỦ CÔNG,
 * không tự động hoá (Google chặn trình duyệt tự động, dễ khoá tài khoản, không lưu mật khẩu Google trong project).
 */

test.describe('Login — Đăng nhập Google', () => {
  test('TC-CMN-AUTH-025 — Đăng nhập bằng Google — luồng thành công', async () => {
    test.info().annotations.push({
      type: 'BLOCKED',
      description: 'Test data "Tài khoản Google thuộc hệ thống: [Cần bổ sung]". Luồng Google đầy đủ là case Manual theo CLAUDE.md.',
    });
    test.skip(true, 'BLOCKED — thiếu tài khoản Google; case Manual');
  });

  test('TC-CMN-AUTH-026 — Đăng nhập bằng Google với tài khoản chưa có trong hệ thống', async () => {
    test.info().annotations.push({
      type: 'BLOCKED',
      description: 'Cần tài khoản Google cá nhân ngoài @fastboy.net và phải đăng nhập vào trang Google. Case Manual theo CLAUDE.md.',
    });
    test.skip(true, 'BLOCKED — cần tài khoản Google; case Manual');
  });

  test('TC-CMN-AUTH-027 — Huỷ giữa chừng cửa sổ đăng nhập Google', async () => {
    test.info().annotations.push({
      type: 'BLOCKED',
      description:
        'Bước 2 "Đóng cửa sổ Google" không thực hiện được như mô tả: quan sát thực tế, nút Google chuyển trang Google ' +
        'NGAY TRONG TAB HIỆN TẠI (không mở cửa sổ/popup riêng) → đóng cửa sổ = đóng luôn ứng dụng. Cần BA xác nhận cách huỷ (vd. nút Back). Case Manual.',
    });
    test.skip(true, 'BLOCKED — bước "đóng cửa sổ Google" không áp dụng được (Google mở trong cùng tab)');
  });
});
