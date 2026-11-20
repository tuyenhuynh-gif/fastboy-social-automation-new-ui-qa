# BUG-LOGIN-02 — Không giới hạn số lần đăng nhập sai mật khẩu

| Trường | Giá trị |
|---|---|
| Bug ID | — (điền sau khi tạo) |
| Module | Login |
| Môi trường | DEV — https://dev.fastboysocial.dev · Chromium (Playwright 1.65.0) |
| Test case | TC-CMN-AUTH-020 |
| Loại | Bảo mật |
| Mức độ (đề xuất) | High |
| Tần suất | 2/2 lần chạy ngày 19/11/2026 |

## Tiền điều kiện
- Chưa đăng nhập, đang ở `/login`, ngôn ngữ `Tiếng Việt`.
- Có 1 tài khoản hợp lệ trên DEV (tài khoản test).

## Các bước tái hiện
1. Nhập email đúng (tài khoản test) + mật khẩu sai → bấm `Đăng nhập`.
2. Lặp lại 10 lần liên tiếp, ghi lại message mỗi lần.
3. Sau 10 lần, nhập mật khẩu ĐÚNG → bấm `Đăng nhập`.

## Kết quả mong đợi (trích TC-CMN-AUTH-020)
- Bước 2: đến một ngưỡng nhất định hệ thống phải chặn tạm thời (khoá theo thời gian, captcha hoặc giới hạn tần suất) và message nói rõ cần đợi bao lâu.
- Bước 3: nếu đã bị khoá thì KHÔNG đăng nhập được cho tới hết thời gian khoá; nếu không bị khoá thì đăng nhập được bình thường.

## Kết quả thực tế
- Cả 10 lần: HTTP 200, message `Incorrect password`. Không có khoá, captcha hay giới hạn tần suất.
- Bước 3: đăng nhập thành công ngay (đúng với nhánh "không bị khoá").
- → Hệ thống không có cơ chế chống dò mật khẩu (brute force).

## Bằng chứng
- `evidence/TC-CMN-AUTH-020-lan-sai-thu-10.png` (màn hình sau lần sai thứ 10)

## Ghi chú
- Chính sách khoá (ngưỡng, thời gian khoá, cách chặn) chưa được chốt — Open Question **Q6** trong file test case. Cần BA/PO chốt để Dev triển khai.
