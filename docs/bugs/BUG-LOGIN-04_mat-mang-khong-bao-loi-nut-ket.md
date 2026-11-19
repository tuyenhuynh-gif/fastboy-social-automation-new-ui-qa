# BUG-LOGIN-04 — Mất mạng khi đăng nhập: không báo lỗi, nút Đăng nhập kẹt trạng thái xử lý

| Trường | Giá trị |
|---|---|
| Bug ID | — (điền sau khi tạo) |
| Module | Login |
| Môi trường | DEV — https://dev.fastboysocial.dev · Chromium (Playwright 1.65.0, giả lập Offline) |
| Test case | TC-CMN-AUTH-028 |
| Loại | Chức năng |
| Mức độ (đề xuất) | Medium |
| Tần suất | Tái hiện ở mọi lần chạy ngày 19/11/2026 |

## Tiền điều kiện
- Chưa đăng nhập, đang ở `/login`, ngôn ngữ `Tiếng Việt`.

## Các bước tái hiện
1. Nhập email và mật khẩu đúng.
2. Bật chế độ `Offline` (DevTools → Network → Offline).
3. Bấm `Đăng nhập`, chờ 15 giây.
4. Tắt `Offline`, bấm `Đăng nhập` lại.

## Kết quả mong đợi (trích TC-CMN-AUTH-028)
- Bước 3: hiển thị message về lỗi kết nối (nói rõ là vấn đề mạng, không phải sai tài khoản); nút `Đăng nhập` trở lại bấm được, KHÔNG kẹt spinner; KHÔNG xoá email/mật khẩu đã nhập.
- Bước 4: đăng nhập thành công ngay, KHÔNG cần tải lại trang.

## Kết quả thực tế
- Bước 3: sau 15 giây **không có message nào**; nút `Đăng nhập` **vẫn quay spinner và bị khoá**. Email/mật khẩu vẫn giữ nguyên (đạt).
- Bước 4: nút vẫn bị khoá nên không bấm lại được; khi có mạng lại, ứng dụng **tự gửi lại** request và vào `/work-queue` (không tải lại trang).
- → Người dùng không biết đang có vấn đề mạng, không có cách huỷ/thử lại.

## Bằng chứng
- `evidence/TC-CMN-AUTH-028-sau-15s-offline.png` (nút đang quay spinner, không có thông báo)
