# Danh sách bug — Module Login (từ đợt chạy Automation 19/11/2026)

Nguồn: kết quả chạy `TC-CMN-AUTH-001 → 039` (lượt chạy ngày 2026-11-19).
Chỉ gồm các case **FAIL do lỗi ứng dụng**. Case cần BA xác nhận (001, 014) và case BLOCKED không nằm ở đây.

> **Mức độ** trong các file là **đề xuất của QA**, cần Lead/PO xác nhận khi đưa lên công cụ quản lý bug.
> Sau khi tạo bug, điền **Bug ID** vào file bug và vào dòng `Bug ID:` của test case tương ứng trong `test-cases/SAT_TestCase_Login_Common_v1.0.md`.

| Mã nội bộ | Tiêu đề | Test case | Loại | Mức độ (đề xuất) | Bug ID |
|---|---|---|---|---|---|
| [BUG-LOGIN-01](BUG-LOGIN-01_thong-bao-loi-tiet-lo-email-ton-tai.md) | Thông báo lỗi đăng nhập tiết lộ email có tồn tại trong hệ thống | TC-CMN-AUTH-012 | Bảo mật | High | — |
| [BUG-LOGIN-02](BUG-LOGIN-02_khong-gioi-han-dang-nhap-sai.md) | Không giới hạn số lần đăng nhập sai mật khẩu | TC-CMN-AUTH-020 | Bảo mật | High | — |
| [BUG-LOGIN-03](BUG-LOGIN-03_xoa-token-van-thao-tac-duoc.md) | Xoá token phiên khỏi localStorage nhưng vẫn thao tác và xem dữ liệu được | TC-CMN-AUTH-035 | Bảo mật / Phiên | Medium | — |
| [BUG-LOGIN-04](BUG-LOGIN-04_mat-mang-khong-bao-loi-nut-ket.md) | Mất mạng khi đăng nhập: không báo lỗi, nút Đăng nhập kẹt trạng thái xử lý | TC-CMN-AUTH-028 | Chức năng | Medium | — |
| [BUG-LOGIN-05](BUG-LOGIN-05_bo-qua-redirect-khi-da-dang-nhap.md) | Đã đăng nhập mở /login?redirect=… bị bỏ qua tham số redirect | TC-CMN-AUTH-030 | Chức năng | Low | — |
| [BUG-LOGIN-06](BUG-LOGIN-06_tooltip-mat-khau.md) | Tooltip "Thêm thông tin" ở Mật khẩu không mở khi bấm; nội dung thiếu hướng dẫn | TC-CMN-AUTH-024 | UI / Nội dung | Low | — |
| [BUG-LOGIN-07](BUG-LOGIN-07_cung-message-cho-2-loi-email.md) | Cùng một message cho 2 lỗi định dạng email khác bản chất | TC-CMN-AUTH-009 | UI / Nội dung | Low | — |

## Lưu ý khi đính kèm bằng chứng

- Ảnh trong `evidence/` được chụp **đúng thời điểm lỗi**, ô mật khẩu đã được che (khung màu hồng). Ảnh có hiển thị **email tài khoản test**.
- **KHÔNG** đính kèm `trace.zip` hay `error-context.md` trong `test-results/` lên công cụ quản lý bug — các file này có thể chứa mật khẩu dạng chữ rõ.
