# BUG-LOGIN-05 — Đã đăng nhập mở /login?redirect=… bị bỏ qua tham số redirect

| Trường | Giá trị |
|---|---|
| Bug ID | — (điền sau khi tạo) |
| Module | Login |
| Môi trường | DEV — https://dev.fastboysocial.dev · Chromium (Playwright 1.65.0) |
| Test case | TC-CMN-AUTH-030 |
| Loại | Chức năng |
| Mức độ (đề xuất) | Low |
| Tần suất | Tái hiện ở mọi lần chạy ngày 19/11/2026 |

## Tiền điều kiện
- Đã đăng nhập bằng tài khoản vai trò `Director • Admin`, ngôn ngữ `Tiếng Việt`, giao diện `Sáng`, đang ở `/work-queue`.

## Các bước tái hiện
1. Mở `https://dev.fastboysocial.dev/login` → quan sát (đúng: tự về `/work-queue`).
2. Mở `https://dev.fastboysocial.dev/login?redirect=/requests`.

## Kết quả mong đợi (trích TC-CMN-AUTH-030, bước 3)
- Với tham số `redirect`, chuyển thẳng tới `/requests`.
- KHÔNG làm mất phiên đang đăng nhập, KHÔNG bắt đăng nhập lại.

## Kết quả thực tế
- Chuyển về `/work-queue`, **bỏ qua** `redirect=/requests`. Phiên vẫn giữ (đạt).
- Bước 1–2 của test case đạt.

## Bằng chứng
- `evidence/TC-CMN-AUTH-030-sau-khi-mo-login-redirect-requests.png`
