# BUG-LOGIN-07 — Cùng một message cho 2 lỗi định dạng email khác bản chất

| Trường | Giá trị |
|---|---|
| Bug ID | — (điền sau khi tạo) |
| Module | Login |
| Môi trường | DEV — https://dev.fastboysocial.dev · Chromium (Playwright 1.65.0) |
| Test case | TC-CMN-AUTH-009 |
| Loại | UI / Nội dung |
| Mức độ (đề xuất) | Low |
| Tần suất | Tái hiện ở mọi lần chạy ngày 19/11/2026 |

## Tiền điều kiện
- Chưa đăng nhập, đang ở `/login`, ngôn ngữ `Tiếng Việt`.

## Các bước tái hiện
1. Nhập email `huong_dang@` + mật khẩu bất kỳ → bấm `Đăng nhập`. Ghi lại message.
2. Đổi email thành `huong_dang@fastboy` (thiếu phần mở rộng) → bấm `Đăng nhập`. Ghi lại message.

## Kết quả mong đợi (trích TC-CMN-AUTH-009)
- Bước 1: báo lỗi sai định dạng, KHÔNG gửi request. (Đạt)
- Bước 2: nếu hệ thống chấp nhận `@fastboy` thì phải đăng nhập được bình thường; nếu chặn thì message phải nói rõ lý do. KHÔNG báo cùng một message chung chung cho cả 2 trường hợp khác bản chất.

## Kết quả thực tế
- Bước 1: `Email không hợp lệ.` — không gửi request (đạt).
- Bước 2: hệ thống chặn, message vẫn là `Email không hợp lệ.` — **giống hệt bước 1**, không nói rõ lý do (thiếu phần mở rộng tên miền).

## Bằng chứng
- `evidence/TC-CMN-AUTH-009-buoc4-message-huong_dang@fastboy.png`
