# BUG-LOGIN-06 — Tooltip "Thêm thông tin" ở Mật khẩu không mở khi bấm; nội dung thiếu hướng dẫn

| Trường | Giá trị |
|---|---|
| Bug ID | — (điền sau khi tạo) |
| Module | Login |
| Môi trường | DEV — https://dev.fastboysocial.dev · Chromium (Playwright 1.65.0) |
| Test case | TC-CMN-AUTH-024 |
| Loại | UI / Nội dung |
| Mức độ (đề xuất) | Low |
| Tần suất | Tái hiện ở mọi lần chạy ngày 19/11/2026 |

## Tiền điều kiện
- Chưa đăng nhập, đang ở `/login`, ngôn ngữ `Tiếng Việt`.

## Các bước tái hiện
1. Bấm vào nút `Thêm thông tin` (ⓘ) cạnh nhãn `Mật khẩu`.
2. Đọc nội dung hiện ra (rê chuột lên nút nếu bước 1 không hiện).
3. Đổi sang English, kiểm tra lại nội dung.

## Kết quả mong đợi (trích TC-CMN-AUTH-024)
- Bước 1: hiện tooltip, KHÔNG che nút `Đăng nhập`.
- Bước 2: nội dung nói rõ quy tắc mật khẩu hoặc cách lấy lại mật khẩu; nếu hướng dẫn liên hệ ai đó thì phải ghi rõ kênh liên hệ (vì màn hình không có link `Quên mật khẩu`).
- Bước 3: cả 2 ngôn ngữ đều có nội dung.

## Kết quả thực tế
- Bước 1: **bấm vào nút không hiện tooltip**; tooltip chỉ hiện khi rê chuột (người dùng bàn phím/màn hình cảm ứng không xem được).
- Bước 2: nội dung VI: `Mật khẩu Social Automation Tool. Đăng nhập trên thiết bị mới sẽ đăng xuất thiết bị cũ.` — **không có** quy tắc mật khẩu hay cách lấy lại mật khẩu.
- Bước 3: đạt — EN: `Your Social Automation Tool password. Signing in on a new device signs you out elsewhere.`

## Bằng chứng
- `evidence/TC-CMN-AUTH-024-sau-khi-bam-nut-thong-tin-mat-khau.png` (sau khi bấm — không có tooltip)
- `evidence/TC-CMN-AUTH-024-noi-dung-tooltip-mat-khau.png` (nội dung khi rê chuột)

## Ghi chú
- Phần nội dung phụ thuộc Open Question **Q4** (người dùng quên mật khẩu xử lý thế nào) — cần BA/PO chốt nội dung hướng dẫn.
