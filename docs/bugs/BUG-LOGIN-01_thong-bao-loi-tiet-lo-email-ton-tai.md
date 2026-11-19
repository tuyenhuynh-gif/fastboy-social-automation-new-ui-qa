# BUG-LOGIN-01 — Thông báo lỗi đăng nhập tiết lộ email có tồn tại trong hệ thống

| Trường | Giá trị |
|---|---|
| Bug ID | — (điền sau khi tạo) |
| Module | Login |
| Môi trường | DEV — https://dev.fastboysocial.dev · Chromium (Playwright 1.65.0) |
| Test case | TC-CMN-AUTH-012 (đối chiếu TC-CMN-AUTH-013) |
| Loại | Bảo mật |
| Mức độ (đề xuất) | High |
| Tần suất | Tái hiện ở mọi lần chạy ngày 19/11/2026 |

## Tiền điều kiện
- Chưa đăng nhập, đang ở `/login`, ngôn ngữ `Tiếng Việt`.
- Có 1 tài khoản hợp lệ trên DEV (tài khoản test).

## Các bước tái hiện
1. Nhập email **không tồn tại** `khong_ton_tai_qc@fastboy.net` + mật khẩu bất kỳ → bấm `Đăng nhập`. Ghi lại message.
2. Nhập email **tồn tại** (tài khoản test) + mật khẩu sai → bấm `Đăng nhập`. Ghi lại message.
3. So sánh 2 message.

## Kết quả mong đợi (trích TC-CMN-AUTH-012, bước 4)
- Message lỗi KHÔNG được tiết lộ email có tồn tại hay không (tránh dò tài khoản) — phải dùng cùng một message với trường hợp sai mật khẩu.
- KHÔNG hiển thị thông tin kỹ thuật.

## Kết quả thực tế
- Bước 1: `Incorrect account`
- Bước 2: `Incorrect password`
- Hai message khác nhau → người ngoài có thể dò được email nào đang có tài khoản trong hệ thống.
- Ghi nhận thêm: message bằng tiếng Anh dù giao diện đang ở Tiếng Việt (liên quan Open Question Q9).

## Bằng chứng
- `evidence/TC-CMN-AUTH-012-message-email-khong-ton-tai.png`
- `evidence/TC-CMN-AUTH-012-message-sai-mat-khau.png`
- Request: `POST https://sys.dev.social.fastboy.dev/v1/mixpost/auth/login` trả HTTP 200 kèm message lỗi ở cả 2 trường hợp.
