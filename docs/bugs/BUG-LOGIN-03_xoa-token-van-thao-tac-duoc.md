# BUG-LOGIN-03 — Xoá token phiên khỏi localStorage nhưng vẫn thao tác và xem dữ liệu được

| Trường | Giá trị |
|---|---|
| Bug ID | — (điền sau khi tạo) |
| Module | Login / Session |
| Môi trường | DEV — https://dev.fastboysocial.dev · Chromium (Playwright 1.65.0) |
| Test case | TC-CMN-AUTH-035 |
| Loại | Bảo mật / Phiên đăng nhập |
| Mức độ (đề xuất) | Medium (nâng lên High nếu Dev xác nhận API vẫn trả dữ liệu khi không có token) |
| Tần suất | Tái hiện ở mọi lần chạy ngày 19/11/2026 |

## Tiền điều kiện
- Đã đăng nhập bằng tài khoản vai trò `Director • Admin`, ngôn ngữ `Tiếng Việt`, giao diện `Sáng`, đang ở `/work-queue`.

## Các bước tái hiện
1. Mở DevTools → Application → Local Storage của `dev.fastboysocial.dev`. Các khoá: `aisocial.locale`, `aisocial.session`, `aisocial.theme`.
2. Xoá khoá `aisocial.session` (chứa token).
3. KHÔNG tải lại trang, bấm mục `Yêu cầu` trên sidebar.
4. Tải lại trang.

## Kết quả mong đợi (trích TC-CMN-AUTH-035)
- Bước 3: thao tác gọi API bị trả về lỗi xác thực và ứng dụng đưa về màn đăng nhập; KHÔNG hiển thị dữ liệu mới lấy được; KHÔNG lỗi chưa bắt ở Console.
- Bước 4: chắc chắn về `/login`.

## Kết quả thực tế
- Bước 3: ứng dụng chuyển sang `/requests` và **hiển thị đầy đủ danh sách yêu cầu** (tên salon, ngày tạo, nguồn…), không đưa về màn đăng nhập.
- Bước 4: PASS — tải lại thì về `/login`.

## Bằng chứng
- `evidence/TC-CMN-AUTH-035-sau-khi-xoa-token-va-bam-yeu-cau.png`

## Ghi chú cho Dev
- Chưa xác định dữ liệu ở bước 3 là từ bộ nhớ đệm phía trình duyệt hay API vẫn trả dữ liệu khi không có token. Đề nghị Dev kiểm tra; nếu API trả dữ liệu không cần token thì đây là lỗi nghiêm trọng.
- Liên quan: khi đăng xuất, ứng dụng không gọi API nào lên server (chỉ xoá localStorage) — cần xác nhận token cũ có bị thu hồi phía server không.
