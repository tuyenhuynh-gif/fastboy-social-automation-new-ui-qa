# [v1.0] Test case Login và Hệ thống — Social Automation Tool (SAT)

## 4. Test cases

| Nhóm | Prefix | Số test case |
|---|---|---|
| A — Đăng nhập · Đăng xuất · Session | TC-CMN-AUTH | 39 |
| B — Tìm salon (ô tìm kiếm dùng chung trên header) | TC-CMN-SRCH | 58 |
| C — Ngôn ngữ Tiếng Việt / English | TC-CMN-LANG | 29 |
| D — Giao diện Sáng / Tối / Theo hệ thống | TC-CMN-THEME | 23 |
| E — Phân quyền 4 vai trò trên phần dùng chung | TC-CMN-PERM | 18 |
| **Tổng** | | **167** |


### NHÓM A — Đăng nhập · Đăng xuất · Session

#### TC-CMN-AUTH-001 — Vào URL gốc khi chưa đăng nhập bị đưa về màn đăng nhập

**Precondition:**

- CHƯA đăng nhập: đã xoá cookie, localStorage và sessionStorage của domain dev.fastboysocial.dev.

**Test data:**

URL: https://dev.fastboysocial.dev/work-queue

**Steps:**

1. Dán URL `https://dev.fastboysocial.dev/work-queue` vào thanh địa chỉ, nhấn Enter.
2. Đọc URL cuối cùng trên thanh địa chỉ.
3. Quan sát nội dung trang.

**Expected Result:**

**Bước 1:**
- Trang chuyển hướng nhanh, không xuất hiện bất thường
**Bước 2:**
- URL cuối cùng đúng là `/login?redirect=/work-queue` — giữ nguyên tham số `redirect`.
- KHÔNG mất tham số `redirect`, KHÔNG chuyển về `/login` trống.
**Bước 3:**
- Hiển thị màn đăng nhập với tiêu đề `Đăng nhập Social Automation Tool`.
- KHÔNG hiển thị bất kỳ dữ liệu nghiệp vụ nào (tên salon, số việc, danh sách bài đăng).

> Test Designed: Tuyền Huỳnh · Final Result: FAIL · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: Bước 3: tiêu đề hiển thị English "Sign in to Social Automation Tool" do precondition xoá localStorage → mặc định English (Q3). Cần BA xác nhận Expected. Bước 1–2 PASS

#### TC-CMN-AUTH-002 — Vào deep link chi tiết request khi chưa đăng nhập giữ được đường dẫn gốc

**Precondition:**

- CHƯA đăng nhập: đã xoá cookie, localStorage và sessionStorage của domain dev.fastboysocial.dev.

**Test data:**

URL: https://dev.fastboysocial.dev/requests/92

**Steps:**

1. Dán URL `https://dev.fastboysocial.dev/requests/92`, nhấn Enter.
2. Đọc URL cuối cùng.
3. Thử lặp lại với `/salon-profile/whmcs-3427` và `/packages`.

**Expected Result:**

1. Chuyển về màn đăng nhập.
2. URL đúng `/login?redirect=/requests/92`.
**Bước 3:**
- Lần lượt ra `/login?redirect=/salon-profile/whmcs-3427` và `/login?redirect=/packages`.
- KHÔNG có đường dẫn nào bị rút gọn, mã hoá sai hoặc mất phần sau dấu `/`.

> Test Designed: Tuyền Huỳnh · Final Result: PASS · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: —

#### TC-CMN-AUTH-003 — Màn đăng nhập hiển thị đủ thành phần ở ngôn ngữ Tiếng Việt

**Precondition:**

- Đang mở trang login ở trạng thái chưa đăng nhập, ngôn ngữ đang là `Tiếng Việt`.

**Test data:**

_Cần bổ sung_

**Steps:**

1. Quan sát toàn bộ màn đăng nhập từ trên xuống.
2. Đọc nguyên văn từng chuỗi hiển thị.
3. Kiểm tra 2 nút ở góc phải trên.

**Expected Result:**

**Bước 1:**
- Thứ tự từ trên xuống: logo `Fastboy Marketing` → tiêu đề → phụ đề → ô Email → ô Mật khẩu → nút `Đăng nhập` → dòng `Hoặc tiếp tục với` → nút `Đăng nhập bằng Google` → dòng điều khoản.
**Bước 2:**
- Tiêu đề: `Đăng nhập Social Automation Tool`.
- Phụ đề: `Workspace nội bộ cho team social của salon.`
- Nhãn `Email`, placeholder `Nhập email`.
- Nhãn `Mật khẩu`, placeholder `Nhập mật khẩu`, có nút `Hiện mật khẩu`.
- Dòng cuối: `Khi đăng nhập, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.` với 2 từ gạch chân là link.
**Bước 3:**
- Có nút `Ngôn ngữ: Tiếng Việt` và nút `Giao diện: Theo hệ thống`.

> Test Designed: Tuyền Huỳnh · Final Result: PASS · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: —

#### TC-CMN-AUTH-004 — Màn đăng nhập hiển thị đủ thành phần ở ngôn ngữ English

**Precondition:**

- CHƯA đăng nhập: đã xoá cookie, localStorage và sessionStorage của domain dev.fastboysocial.dev.

**Test data:**

_Cần bổ sung_

**Steps:**

1. Mở `/login`, bấm nút ngôn ngữ, chọn `English`.
2. Đọc nguyên văn từng chuỗi.
3. So số lượng thành phần với bản Tiếng Việt.

**Expected Result:**

**Bước 1:**
- Giao diện chuyển sang tiếng Anh ngay, KHÔNG cần tải lại trang.
**Bước 2:**
- Tiêu đề: `Sign in to Social Automation Tool`.
- Phụ đề: `Internal workspace for the salon social team.`
- Nhãn `Email` / placeholder `Enter email`; nhãn `Password` / placeholder `Enter your password`; nút `Show password`; nút submit `Sign in`.
- Dòng phân cách `Or continue with`, nút `Sign in with Google`.
- Dòng điều khoản có link `Terms of Service` và `Privacy Policy`.
**Bước 3:**
- Số thành phần bằng đúng bản Tiếng Việt, KHÔNG thừa hoặc thiếu thành phần nào.
- KHÔNG còn chuỗi tiếng Việt nào sót lại trên màn hình.

> Test Designed: Tuyền Huỳnh · Final Result: PASS · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: —

#### TC-CMN-AUTH-005 — Bấm Đăng nhập khi cả 2 ô đều để trống

**Precondition:**

- Đang mở trang login ở trạng thái chưa đăng nhập, ngôn ngữ đang là `Tiếng Việt`.

**Test data:**

Email: (trống) · Mật khẩu: (trống)

**Steps:**

1. Không nhập gì, bấm nút `Đăng nhập`.
2. Quan sát thông báo hiển thị.

**Expected Result:**

**Bước 1:**
- KHÔNG gửi request đăng nhập lên server (kiểm bằng tab Network — không có request `login`).
- KHÔNG chuyển trang.
**Bước 2:**
- Hiển thị thông báo bắt buộc cho CẢ HAI ô, đặt ngay dưới từng ô.
- Thông báo viết bằng tiếng Việt (vì đang ở ngôn ngữ Tiếng Việt), KHÔNG phải chuỗi tiếng Anh mặc định của trình duyệt.

> Test Designed: Tuyền Huỳnh · Final Result: PASS · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: —

#### TC-CMN-AUTH-006 — Nhập email hợp lệ nhưng bỏ trống mật khẩu

**Precondition:**

- Đang mở trang login ở trạng thái chưa đăng nhập, ngôn ngữ đang là `Tiếng Việt`.

**Test data:**

Email: tuyen_huynh@fastboy.net · Mật khẩu: (trống)

**Steps:**

1. Nhập email hợp lệ vào ô Email.
2. Để trống ô Mật khẩu.
3. Bấm `Đăng nhập`.

**Expected Result:**

**Bước 1:**
- Ô Email nhận đúng giá trị, KHÔNG bị cắt ký tự.
**Bước 3:**
- Chỉ ô `Mật khẩu` báo lỗi bắt buộc; ô `Email` KHÔNG báo lỗi.
- KHÔNG gửi request lên server.
- KHÔNG xoá giá trị email đã nhập.

> Test Designed: Tuyền Huỳnh · Final Result: PASS · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: —

#### TC-CMN-AUTH-007 — Nhập mật khẩu nhưng bỏ trống email

**Precondition:**

- Đang mở trang login ở trạng thái chưa đăng nhập, ngôn ngữ đang là `Tiếng Việt`.

**Test data:**

Email: (trống) · Mật khẩu: 1 chuỗi bất kỳ

**Steps:**

1. Để trống ô Email.
2. Nhập chuỗi bất kỳ vào ô Mật khẩu.
3. Bấm `Đăng nhập`.

**Expected Result:**

**Bước 3:**
- Chỉ ô `Email` báo lỗi bắt buộc.
- KHÔNG gửi request lên server.
- Kỳ vọng chính: giữ nguyên giá trị mật khẩu đã nhập.

> Test Designed: Tuyền Huỳnh · Final Result: PASS · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: —

#### TC-CMN-AUTH-008 — Email sai định dạng — thiếu ký tự @

**Precondition:**

- Đang mở trang login ở trạng thái chưa đăng nhập, ngôn ngữ đang là `Tiếng Việt`.

**Test data:**

Email: huongdangfastboy.net · Mật khẩu: chuỗi bất kỳ

**Steps:**

1. Nhập `huongdangfastboy.net` vào ô Email.
2. Nhập mật khẩu bất kỳ.
3. Bấm `Đăng nhập`.

**Expected Result:**

**Bước 3:**
- Hiển thị lỗi sai định dạng email ngay dưới ô Email.
- KHÔNG gửi request đăng nhập lên server.
- KHÔNG chuyển trang, KHÔNG hiện lỗi chung chung kiểu `Có lỗi xảy ra`.

> Test Designed: Tuyền Huỳnh · Final Result: PASS · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: —

#### TC-CMN-AUTH-009 — Email sai định dạng — thiếu phần domain sau @

**Precondition:**

- Đang mở trang login ở trạng thái chưa đăng nhập, ngôn ngữ đang là `Tiếng Việt`.

**Test data:**

Email: huong_dang@ · Mật khẩu: chuỗi bất kỳ

**Steps:**

1. Nhập `huong_dang@`.
2. Nhập mật khẩu bất kỳ.
3. Bấm `Đăng nhập`.
4. Lặp lại với `huong_dang@fastboy` (thiếu phần mở rộng).

**Expected Result:**

**Bước 3:**
- Báo lỗi sai định dạng, KHÔNG gửi request.
**Bước 4:**
- Nếu hệ thống chấp nhận `@fastboy` (domain nội bộ không có TLD) thì phải đăng nhập được bình thường; nếu chặn thì message phải nói rõ lý do.
- KHÔNG báo cùng một message chung chung cho cả 2 trường hợp khác bản chất.

> Test Designed: Tuyền Huỳnh · Final Result: FAIL · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: Bước 4: "huong_dang@fastboy" bị chặn với cùng message "Email không hợp lệ." như bước 3

#### TC-CMN-AUTH-010 — Email có khoảng trắng ở đầu và cuối

**Precondition:**

- Đang mở trang login ở trạng thái chưa đăng nhập, ngôn ngữ đang là `Tiếng Việt`.

**Test data:**

Email: ` huong_dang@fastboy.net ` · Mật khẩu: mật khẩu đúng

**Steps:**

1. Dán email kèm 2 khoảng trắng ở đầu và 2 khoảng trắng ở cuối.
2. Nhập mật khẩu đúng.
3. Bấm `Đăng nhập`.

**Expected Result:**

**Bước 3:**
- Hệ thống tự cắt khoảng trắng thừa và đăng nhập THÀNH CÔNG.
- KHÔNG lưu khoảng trắng vào phiên đăng nhập.

> Test Designed: Tuyền Huỳnh · Final Result: PASS · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: —

#### TC-CMN-AUTH-011 — Email nhập bằng chữ HOA

**Precondition:**

- Đang mở trang login ở trạng thái chưa đăng nhập, ngôn ngữ đang là `Tiếng Việt`.

**Test data:**

Email: HUONG_DANG@FASTBOY.NET · Mật khẩu: mật khẩu đúng

**Steps:**

1. Nhập email toàn chữ HOA.
2. Nhập mật khẩu đúng.
3. Bấm `Đăng nhập`.

**Expected Result:**

**Bước 3:**
- Đăng nhập THÀNH CÔNG — email không phân biệt hoa thường theo chuẩn RFC.
- Tên hiển thị trên menu tài khoản vẫn đúng `chi Hương`, KHÔNG hiển thị email viết HOA.

> Test Designed: Tuyền Huỳnh · Final Result: PASS · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: Dùng tài khoản test trong .env (quyết định 19/11/2026) thay cho "chi Hương"

#### TC-CMN-AUTH-012 — Email đúng định dạng nhưng không tồn tại trong hệ thống

**Precondition:**

- Đang mở trang login ở trạng thái chưa đăng nhập, ngôn ngữ đang là `Tiếng Việt`.

**Test data:**

Email: khong_ton_tai_qc@fastboy.net · Mật khẩu: chuỗi bất kỳ

**Steps:**

1. Nhập email không tồn tại.
2. Nhập mật khẩu bất kỳ.
3. Bấm `Đăng nhập`.
4. Đọc nguyên văn message lỗi.

**Expected Result:**

**Bước 3:**
- KHÔNG đăng nhập được, ở lại màn đăng nhập.
**Bước 4:**
- Message lỗi KHÔNG được tiết lộ email có tồn tại hay không (tránh dò tài khoản) — phải dùng cùng một message với trường hợp sai mật khẩu.
- KHÔNG hiển thị thông tin kỹ thuật (tên bảng, câu truy vấn, mã lỗi backend).

> Test Designed: Tuyền Huỳnh · Final Result: FAIL · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: Bảo mật: email không tồn tại báo "Incorrect account", sai mật khẩu báo "Incorrect password" → dò được email tồn tại. Message tiếng Anh khi đang ở Tiếng Việt (Q9)

#### TC-CMN-AUTH-013 — Email đúng nhưng mật khẩu sai

**Precondition:**

- Đang mở trang login ở trạng thái chưa đăng nhập, ngôn ngữ đang là `Tiếng Việt`.

**Test data:**

Email: huong_dang@fastboy.net · Mật khẩu: mật khẩu sai

**Steps:**

1. Nhập email đúng, mật khẩu sai.
2. Bấm `Đăng nhập`.
3. Đọc nguyên văn message lỗi và so với TC-CMN-AUTH-012.
4. Kiểm tra ô mật khẩu sau khi báo lỗi.

**Expected Result:**

**Bước 2:**
- KHÔNG đăng nhập được, KHÔNG chuyển trang.
**Bước 3:**
- Hiển thị message thông báo lỗi sai password
**Bước 4:**
- Ô mật khẩu được xoá trắng hoặc giữ nguyên nhất quán theo một quy tắc; KHÔNG lúc xoá lúc không.
- Email KHÔNG bị xoá.

> Test Designed: Tuyền Huỳnh · Final Result: PASS · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: Message "Incorrect password"; ô mật khẩu giữ nguyên sau lỗi (nhất quán)

#### TC-CMN-AUTH-014 — Đăng nhập thành công bằng email và mật khẩu đúng

**Precondition:**

- Đang mở trang login ở trạng thái chưa đăng nhập, ngôn ngữ đang là `Tiếng Việt`.

**Test data:**

Email: huong_dang@fastboy.net · Mật khẩu: mật khẩu đúng

**Steps:**

1. Nhập email và mật khẩu đúng.
2. Bấm `Đăng nhập`.
3. Quan sát màn hình sau khi vào.
4. Mở menu tài khoản ở góc trái dưới.

**Expected Result:**

**Bước 2:**
- Đăng nhập thành công trong vòng 5 giây.
- KHÔNG hiện lỗi 403/500, KHÔNG màn trắng quá 1 giây.
**Bước 3:**
- Vào thẳng `/work-queue`, tiêu đề lớn dạng `Chào buổi chiều, <tên>. <N> việc cần bạn, <M> gấp.`
- Sidebar có đủ: `Việc cần làm` (nhóm Cần làm) · `Hồ sơ salon` · `Yêu cầu` · `Gói dịch vụ` (nhóm Tra cứu) · `Cài đặt`.
**Bước 4:**
- Menu hiện đúng `chi Hương` · `Director • Admin` · `huong_dang@fastboy.net`, có dấu tick ở hồ sơ đang dùng.
- Có nút `Đăng xuất`.

> Test Designed: Tuyền Huỳnh · Final Result: FAIL · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: Bước 3: tiêu đề thực tế "… <N> việc cần bạn, <M> quá hạn." (TC: "… <M> gấp.") → cần BA xác nhận. Các bước khác PASS (dùng tài khoản .env)

#### TC-CMN-AUTH-015 — Đăng nhập từ deep link đưa về đúng trang gốc chứ không về trang mặc định

**Precondition:**

- CHƯA đăng nhập: đã xoá cookie, localStorage và sessionStorage của domain dev.fastboysocial.dev.

**Test data:**

URL gốc: /requests/92 · tài khoản đúng

**Steps:**

1. Vào `/requests/92` khi chưa đăng nhập, để hệ thống chuyển về `/login?redirect=/requests/92`.
2. Nhập email và mật khẩu đúng, bấm `Đăng nhập`.
3. Đọc URL và nội dung trang sau khi vào.

**Expected Result:**

**Bước 2:**
- Đăng nhập thành công.
**Bước 3:**
- Kỳ vọng chính: về đúng `/requests/92`, KHÔNG về `/work-queue`.
- Nội dung trang là chi tiết request 92, breadcrumb trỏ đúng.
- Tham số `redirect` KHÔNG còn nằm lại trên URL sau khi đã dùng xong.

> Test Designed: Tuyền Huỳnh · Final Result: PASS · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: —

#### TC-CMN-AUTH-016 — Nút Hiện mật khẩu và Ẩn mật khẩu hoạt động đúng chiều

**Precondition:**

- Đang mở trang login ở trạng thái chưa đăng nhập, ngôn ngữ đang là `Tiếng Việt`

**Test data:**

Mật khẩu: chuỗi 8 ký tự bất kỳ

**Steps:**

1. Nhập chuỗi 8 ký tự vào ô Mật khẩu.
2. Bấm nút `Hiện mật khẩu`.
3. Bấm lại nút đó.
4. Rê chuột lên nút để đọc tooltip/nhãn trợ năng.

**Expected Result:**

**Bước 2:**
- Ký tự hiện ra dạng chữ thường (`type` đổi từ `password` sang `text`).
- Nhãn nút đổi thành `Ẩn mật khẩu`, icon đổi theo.
**Bước 3:**
- Ký tự che lại thành chấm tròn, nhãn quay về `Hiện mật khẩu`.
**Bước 4:**
- Nhãn trợ năng khớp trạng thái hiện tại; KHÔNG để nhãn `Hiện mật khẩu` trong khi mật khẩu đang hiện.

> Test Designed: Tuyền Huỳnh · Final Result: PASS · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: —

#### TC-CMN-AUTH-017 — Mật khẩu không bị ghi ra log hay hiển thị ở nơi khác

**Precondition:**

- Đang mở trang login ở trạng thái chưa đăng nhập, ngôn ngữ đang là `Tiếng Việt`.

**Test data:**

Mật khẩu: chuỗi dễ nhận biết, ví dụ `QcTest#2026`

**Steps:**

1. Mở DevTools, tab Console và tab Network.
2. Nhập email và mật khẩu, bấm `Đăng nhập`.
3. Rà toàn bộ log ở Console.
4. Rà request đăng nhập ở Network: URL, query string, response.

**Expected Result:**

**Bước 3:**
- Console KHÔNG in ra mật khẩu dưới bất kỳ dạng nào.
**Bước 4:**
- Mật khẩu chỉ nằm trong body của request POST qua HTTPS.
- KHÔNG xuất hiện trong URL hay query string.
- Response KHÔNG trả lại mật khẩu.
- localStorage/sessionStorage KHÔNG lưu mật khẩu.

> Test Designed: Tuyền Huỳnh · Final Result: PASS · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: —

#### TC-CMN-AUTH-018 — Nhấn Enter trong ô mật khẩu gửi form đăng nhập

**Precondition:**

- Đang mở trang login ở trạng thái chưa đăng nhập, ngôn ngữ đang là `Tiếng Việt`.

**Test data:**

Email và mật khẩu đúng

**Steps:**

1. Nhập email, nhập mật khẩu.
2. Đang ở ô Mật khẩu, nhấn phím `Enter`.
3. Lặp lại thao tác nhưng nhấn `Enter` khi đang ở ô Email.

**Expected Result:**

**Bước 2:**
- Form được gửi, đăng nhập thành công — không cần bấm chuột vào nút.
**Bước 3:**
- Cũng gửi form (hoặc chuyển focus xuống ô Mật khẩu), nhưng phải nhất quán.
- KHÔNG tải lại trang về trạng thái trắng, KHÔNG mất dữ liệu đã nhập.

> Test Designed: Tuyền Huỳnh · Final Result: PASS · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: Enter ở ô Email cũng gửi form

#### TC-CMN-AUTH-019 — Nút Đăng nhập khoá lại khi đang xử lý, chống bấm nhiều lần

**Precondition:**

- Đang mở trang login ở trạng thái chưa đăng nhập, ngôn ngữ đang là `Tiếng Việt`.

**Test data:**

Email và mật khẩu đúng · DevTools giả lập mạng `Slow 3G`

**Steps:**

1. Bật DevTools, chọn Network throttling `Slow 3G`.
2. Nhập email và mật khẩu đúng.
3. Bấm `Đăng nhập` rồi bấm thêm 4 lần liên tiếp thật nhanh.
4. Đếm số request `login` ở tab Network.

**Expected Result:**

**Bước 3:**
- Ngay sau lần bấm đầu, nút chuyển trạng thái đang xử lý (spinner hoặc bị vô hiệu hoá).
**Bước 4:**
- Chỉ có ĐÚNG 1 request đăng nhập được gửi.
- KHÔNG gửi 5 request, KHÔNG tạo 5 phiên.
- Sau khi xong vẫn vào đúng màn mặc định, KHÔNG kẹt ở trạng thái loading vĩnh viễn.

> Test Designed: Tuyền Huỳnh · Final Result: PASS · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: —

#### TC-CMN-AUTH-020 — Nhập sai mật khẩu nhiều lần liên tiếp

**Precondition:**

- Đang mở trang login ở trạng thái chưa đăng nhập, ngôn ngữ đang là `Tiếng Việt`.

**Test data:**

Email đúng · mật khẩu sai, lặp 10 lần

**Steps:**

1. Nhập email đúng, mật khẩu sai, bấm `Đăng nhập`.
2. Lặp lại thao tác 10 lần liên tiếp, đếm số lần và ghi lại message mỗi lần.
3. Sau 10 lần, nhập mật khẩu ĐÚNG và bấm `Đăng nhập`.

**Expected Result:**

**Bước 2:**
- Kỳ vọng chính: đến một ngưỡng nhất định hệ thống phải chặn tạm thời (khoá theo thời gian, captcha hoặc giới hạn tần suất) và message nói rõ cần đợi bao lâu.
**Bước 3:**
- Nếu đã bị khoá: KHÔNG đăng nhập được dù mật khẩu đúng, cho tới hết thời gian khoá.
- Nếu không bị khoá: đăng nhập được bình thường.

> Test Designed: Tuyền Huỳnh · Final Result: FAIL · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: Bảo mật: 10 lần sai đều HTTP 200 "Incorrect password", không khoá/captcha/giới hạn. Bước 3 PASS (Q6)

#### TC-CMN-AUTH-021 — Nhập ký tự đặc biệt và chuỗi dạng câu lệnh vào ô Email

**Precondition:**

- Đang mở trang login ở trạng thái chưa đăng nhập, ngôn ngữ đang là `Tiếng Việt`.

**Test data:**

Email: `' OR 1=1 --` và `<script>alert(1)</script>` · mật khẩu bất kỳ

**Steps:**

1. Nhập `' OR 1=1 --` vào ô Email, nhập mật khẩu bất kỳ, bấm `Đăng nhập`.
2. Nhập `<script>alert(1)</script>` vào ô Email, bấm `Đăng nhập`.
3. Quan sát màn hình và Console.

**Expected Result:**

**Bước 1:**
- Báo lỗi sai định dạng email hoặc sai tài khoản; KHÔNG đăng nhập được.
- KHÔNG lỗi 500, KHÔNG lộ thông tin cơ sở dữ liệu.
**Bước 2:**
- Chuỗi được hiển thị lại dưới dạng văn bản thuần (nếu có hiển thị lại).
- KHÔNG xuất hiện hộp thoại alert, KHÔNG thực thi mã.
**Bước 3:**
- Console KHÔNG có lỗi chưa bắt (uncaught).

> Test Designed: Tuyền Huỳnh · Final Result: PASS · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: —

#### TC-CMN-AUTH-022 — Dán email và mật khẩu từ clipboard

**Precondition:**

- Đang mở trang login ở trạng thái chưa đăng nhập, ngôn ngữ đang là `Tiếng Việt`.

**Test data:**

Email và mật khẩu đúng, copy sẵn trong clipboard

**Steps:**

1. Copy email, bấm vào ô Email, nhấn `Ctrl+V`.
2. Copy mật khẩu, bấm vào ô Mật khẩu, nhấn `Ctrl+V`.
3. Bấm `Đăng nhập`.

**Expected Result:**

**Bước 1:**
- Email được dán đầy đủ, KHÔNG bị chặn thao tác dán.
**Bước 2:**
- Mật khẩu được dán đầy đủ, hiển thị đúng số chấm tròn tương ứng số ký tự.
- KHÔNG chặn dán vào ô mật khẩu (chặn dán làm người dùng không dùng được trình quản lý mật khẩu).
**Bước 3:**
- Đăng nhập thành công.

> Test Designed: Tuyền Huỳnh · Final Result: PASS · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: —

#### TC-CMN-AUTH-023 — Tooltip Thêm thông tin ở nhãn Email

**Precondition:**

- Đang mở trang login ở trạng thái chưa đăng nhập, ngôn ngữ đang là `Tiếng Việt`.

**Test data:**

_Cần bổ sung_

**Steps:**

1. Bấm (hoặc rê chuột) vào nút `Thêm thông tin` cạnh nhãn `Email`.
2. Đọc nội dung hiện ra.
3. Bấm ra ngoài hoặc nhấn `Esc`.

**Expected Result:**

**Bước 1:**
- Hiện tooltip/popover, KHÔNG che mất ô nhập bên dưới.
**Bước 2:**
- Nội dung bằng đúng ngôn ngữ đang chọn và nói rõ nên nhập email nào (email công ty nội bộ).
- KHÔNG hiển thị chuỗi khoá dịch thô kiểu `login.email.hint`.
**Bước 3:**
- Tooltip đóng lại; KHÔNG kẹt lại trên màn hình.

> Test Designed: Tuyền Huỳnh · Final Result: PASS · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: —

#### TC-CMN-AUTH-024 — Tooltip Thêm thông tin ở nhãn Mật khẩu

**Precondition:**

- Đang mở trang login ở trạng thái chưa đăng nhập, ngôn ngữ đang là `Tiếng Việt`.

**Test data:**

_Cần bổ sung_

**Steps:**

1. Bấm vào nút `Thêm thông tin` cạnh nhãn `Mật khẩu`.
2. Đọc nội dung hiện ra.
3. Kiểm tra nội dung ở cả ngôn ngữ Tiếng Việt và English.

**Expected Result:**

**Bước 1:**
- Hiện tooltip, KHÔNG che nút `Đăng nhập`.
**Bước 2:**
- Nội dung nói rõ quy tắc mật khẩu hoặc cách lấy lại mật khẩu.
- Nếu nội dung hướng dẫn liên hệ ai đó để lấy lại mật khẩu thì phải ghi rõ kênh liên hệ (vì màn hình không có link `Quên mật khẩu`).
**Bước 3:**
- Cả 2 ngôn ngữ đều có nội dung, KHÔNG để trống một bên.

> Test Designed: Tuyền Huỳnh · Final Result: FAIL · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: Bấm nút ⓘ không hiện tooltip (chỉ khi rê chuột); nội dung không có quy tắc/cách lấy lại mật khẩu (Q4)

#### TC-CMN-AUTH-025 — Đăng nhập bằng Google — luồng thành công

**Precondition:**

- Đang mở trang login ở trạng thái chưa đăng nhập, ngôn ngữ đang là `Tiếng Việt`.

**Test data:**

Tài khoản Google thuộc hệ thống: [Cần bổ sung]

**Steps:**

1. Bấm nút `Đăng nhập bằng Google`.
2. Chọn tài khoản Google đã có trong hệ thống.
3. Quan sát màn hình sau khi quay về.
4. Mở menu tài khoản kiểm tra thông tin hiển thị.

**Expected Result:**

**Bước 1:**
- Mở cửa sổ/tab chọn tài khoản Google.
**Bước 2:**
- Sau khi chọn, tự quay về ứng dụng trong vòng 10 giây.
**Bước 3:**
- Vào đúng màn mặc định `/work-queue` (hoặc trang trong tham số `redirect` nếu có).
- KHÔNG kẹt ở màn trắng, KHÔNG quay lại màn đăng nhập.
**Bước 4:**
- Tên, vai trò và email hiển thị đúng theo tài khoản Google vừa dùng.

> Test Designed: Tuyền Huỳnh · Final Result: BLOCKED · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: Thiếu tài khoản Google; luồng Google là case Manual

#### TC-CMN-AUTH-026 — Đăng nhập bằng Google với tài khoản chưa có trong hệ thống

**Precondition:**

- Đang mở trang login ở trạng thái chưa đăng nhập, ngôn ngữ đang là `Tiếng Việt`.

**Test data:**

Tài khoản Google cá nhân không thuộc @fastboy.net

**Steps:**

1. Bấm `Đăng nhập bằng Google`.
2. Chọn tài khoản Google không thuộc hệ thống.
3. Đọc nguyên văn thông báo.

**Expected Result:**

**Bước 2:**
- Kỳ vọng chính: KHÔNG tạo tài khoản mới, KHÔNG cho vào ứng dụng.
**Bước 3:**
- Quay về màn đăng nhập kèm message nói rõ tài khoản không có quyền truy cập workspace nội bộ.
- KHÔNG hiện lỗi kỹ thuật thô của Google/OAuth.
- KHÔNG để người dùng vào được màn hình có dữ liệu rồi mới báo lỗi.

> Test Designed: Tuyền Huỳnh · Final Result: BLOCKED · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: Cần tài khoản Google ngoài @fastboy.net; case Manual

#### TC-CMN-AUTH-027 — Huỷ giữa chừng cửa sổ đăng nhập Google

**Precondition:**

- Đang mở trang login ở trạng thái chưa đăng nhập, ngôn ngữ đang là `Tiếng Việt`.

**Test data:**

_Cần bổ sung_

**Steps:**

1. Bấm `Đăng nhập bằng Google`.
2. Đóng cửa sổ Google mà không chọn tài khoản nào.
3. Quan sát màn đăng nhập.

**Expected Result:**

**Bước 2:**
- Quay về màn đăng nhập.
**Bước 3:**
- Màn đăng nhập ở trạng thái bình thường, nút `Đăng nhập bằng Google` bấm lại được ngay.
- KHÔNG kẹt spinner, KHÔNG hiện message lỗi đỏ (người dùng chủ động huỷ, không phải lỗi).
- KHÔNG tạo phiên đăng nhập dở dang.

> Test Designed: Tuyền Huỳnh · Final Result: BLOCKED · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: Nút Google mở trang Google trong cùng tab, không có cửa sổ riêng để đóng → cần BA xác nhận cách huỷ; case Manual

#### TC-CMN-AUTH-028 — Mất mạng ngay khi bấm Đăng nhập

**Precondition:**

- Đang mở trang login ở trạng thái chưa đăng nhập, ngôn ngữ đang là `Tiếng Việt`.

**Test data:**

Email và mật khẩu đúng · DevTools chế độ `Offline`

**Steps:**

1. Nhập email và mật khẩu đúng.
2. Bật chế độ `Offline` trong DevTools.
3. Bấm `Đăng nhập`.
4. Tắt `Offline`, bấm `Đăng nhập` lại.

**Expected Result:**

**Bước 3:**
- Hiển thị message về lỗi kết nối, nói rõ là vấn đề mạng chứ KHÔNG phải sai tài khoản.
- Nút `Đăng nhập` trở lại trạng thái bấm được; KHÔNG kẹt spinner vĩnh viễn.
- KHÔNG xoá email và mật khẩu đã nhập.
**Bước 4:**
- Đăng nhập thành công ngay, KHÔNG cần tải lại trang.

> Test Designed: Tuyền Huỳnh · Final Result: FAIL · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: Offline: sau 15s không có message, nút Đăng nhập kẹt trạng thái xử lý; có mạng lại app tự gửi lại và vào /work-queue

#### TC-CMN-AUTH-029 — Backend trả lỗi 500 khi đăng nhập

**Precondition:**

- Đang mở trang login ở trạng thái chưa đăng nhập, ngôn ngữ đang là `Tiếng Việt`.

**Test data:**

Giả lập lỗi 500 cho endpoint đăng nhập (DevTools block/override hoặc nhờ dev)

**Steps:**

1. Giả lập endpoint đăng nhập trả HTTP 500.
2. Nhập email và mật khẩu đúng, bấm `Đăng nhập`.
3. Đọc message và kiểm tra Console.

**Expected Result:**

**Bước 2:**
- KHÔNG vào được ứng dụng.
**Bước 3:**
- Hiển thị message lỗi hệ thống thân thiện bằng đúng ngôn ngữ đang chọn.
- KHÔNG in nguyên stack trace, tên service hay đường dẫn nội bộ ra màn hình.
- Nút `Đăng nhập` bấm lại được.

> Test Designed: Tuyền Huỳnh · Final Result: PASS · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: Message: "Máy chủ đang gặp sự cố. Vui lòng thử lại sau."

#### TC-CMN-AUTH-030 — Mở màn đăng nhập khi đã đăng nhập sẵn

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm`

**Test data:**

URL: /login

**Steps:**

1. Đang đăng nhập, dán `https://dev.fastboysocial.dev/login` vào thanh địa chỉ.
2. Quan sát URL và nội dung trang.
3. Thử thêm `/login?redirect=/requests`.

**Expected Result:**

**Bước 1:**
- Tự chuyển về trang trong ứng dụng, KHÔNG hiển thị lại form đăng nhập.
**Bước 2:**
- URL cuối là `/work-queue` (hoặc trang mặc định theo vai trò).
**Bước 3:**
- Với tham số `redirect`, chuyển thẳng tới `/requests`.
- KHÔNG làm mất phiên đang đăng nhập, KHÔNG bắt đăng nhập lại.

> Test Designed: Tuyền Huỳnh · Final Result: FAIL · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: Bước 3: /login?redirect=/requests khi đã đăng nhập → về /work-queue, bỏ qua redirect

#### TC-CMN-AUTH-031 — Đăng xuất từ menu tài khoản

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm`

**Test data:**

_Cần bổ sung_

**Steps:**

1. Bấm khối tài khoản `chi Hương` ở góc trái dưới.
2. Bấm `Đăng xuất`.
3. Quan sát URL và nội dung trang.
4. Mở DevTools kiểm tra localStorage và cookie của domain.

**Expected Result:**

**Bước 1:**
- Mở panel có mục `ĐỔI HỒ SƠ`, hồ sơ hiện tại có dấu tick, và nút `Đăng xuất`.
**Bước 2:**
- Đăng xuất trong vòng 3 giây.
**Bước 3:**
- Về màn đăng nhập `/login`.
- KHÔNG còn hiển thị tên user, tên salon hay bất kỳ số liệu nghiệp vụ nào.
**Bước 4:**
- Token/khoá phiên bị xoá hẳn khỏi localStorage và cookie.
- KHÔNG còn sót giá trị token cũ dưới bất kỳ khoá nào.

> Test Designed: Tuyền Huỳnh · Final Result: PASS · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: —

#### TC-CMN-AUTH-032 — Dán lại URL nội bộ sau khi đã đăng xuất

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm`

**Test data:**

URL: /requests/92

**Steps:**

1. Copy URL `/requests/92` khi đang đăng nhập.
2. Đăng xuất.
3. Dán lại URL vừa copy, nhấn Enter.

**Expected Result:**

**Bước 3:**
- Bị chuyển về `/login?redirect=/requests/92`.
- KHÔNG hiển thị nội dung request dù chỉ trong tích tắc.
- KHÔNG trả về lỗi 500 hay màn trắng vĩnh viễn.

> Test Designed: Tuyền Huỳnh · Final Result: PASS · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: —

#### TC-CMN-AUTH-033 — Đăng xuất ở một tab trong khi tab khác đang mở ứng dụng

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

2 tab cùng đăng nhập: tab A `/work-queue`, tab B `/requests`

**Steps:**

1. Mở ứng dụng ở 2 tab A và B.
2. Ở tab A, đăng xuất.
3. Chuyển sang tab B, bấm vào một mục bất kỳ trên sidebar.
4. Thử tải lại tab B.

**Expected Result:**

**Bước 2:**
- Tab A về màn đăng nhập.
**Bước 3:**
- Kỳ vọng chính: tab B cũng phải nhận biết phiên đã kết thúc.
- Thao tác ở tab B bị từ chối và đưa về màn đăng nhập, kèm message phiên đã kết thúc nếu có.
- KHÔNG cho tab B tiếp tục đọc hay sửa dữ liệu.
**Bước 4:**
- Sau khi tải lại, tab B chắc chắn ở màn đăng nhập.
- Ghi nhận cho BA/PO: tab B có cần tự đăng xuất ngay (không đợi thao tác) không — xem Open Question #11.

> Test Designed: Tuyền Huỳnh · Final Result: PASS · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: Tab B tự về màn đăng nhập ngay, banner "Bạn đã đăng xuất ở một tab khác."

#### TC-CMN-AUTH-034 — Phiên hết hạn trong lúc đang thao tác

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Cần dev cung cấp cách rút ngắn thời gian hết hạn phiên trên DEV

**Steps:**

1. Đăng nhập và để yên màn hình cho tới khi phiên hết hạn (thời gian: [Cần bổ sung]).
2. Bấm vào một mục sidebar bất kỳ.
3. Quan sát phản hồi.
4. Đăng nhập lại và kiểm tra có quay về đúng trang đang dở không.

**Expected Result:**

**Bước 2:**
- Thao tác bị từ chối.
**Bước 3:**
- Hiển thị message rõ ràng là phiên đã hết hạn, cần đăng nhập lại.
- KHÔNG hiện lỗi 401/403 thô, KHÔNG màn trắng, KHÔNG vòng lặp chuyển hướng.
**Bước 4:**
- Sau khi đăng nhập lại, quay về đúng trang đang dở (nhờ tham số `redirect`).

> Test Designed: Tuyền Huỳnh · Final Result: BLOCKED · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: Cần dev cung cấp cách rút ngắn thời gian hết hạn phiên trên DEV

#### TC-CMN-AUTH-035 — Xoá thủ công token khỏi localStorage rồi thao tác tiếp

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Mở DevTools → Application → Local Storage, ghi lại tên các khoá liên quan phiên.
2. Xoá khoá chứa token.
3. Không tải lại trang, bấm vào mục `Yêu cầu` trên sidebar.
4. Tải lại trang.

**Expected Result:**

**Bước 3:**
- Thao tác gọi API bị trả về lỗi xác thực và ứng dụng đưa về màn đăng nhập.
- KHÔNG hiển thị dữ liệu mới lấy được.
- KHÔNG hiện lỗi chưa bắt ở Console.
**Bước 4:**
- Chắc chắn về `/login`.

> Test Designed: Tuyền Huỳnh · Final Result: FAIL · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: Xoá token khỏi localStorage rồi bấm Yêu cầu → vẫn vào /requests, không về màn đăng nhập. Bước 4 PASS

#### TC-CMN-AUTH-036 — Sửa token thành chuỗi sai định dạng rồi tải lại trang

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Token bị thay bằng chuỗi `abc123`

**Steps:**

1. Mở DevTools → Local Storage, sửa giá trị token thành `abc123`.
2. Tải lại trang.
3. Quan sát màn hình và Console.

**Expected Result:**

**Bước 2:**
- Bị đưa về màn đăng nhập.
**Bước 3:**
- KHÔNG hiện màn trắng, KHÔNG lỗi JavaScript chưa bắt.
- KHÔNG lặp vô hạn giữa `/login` và trang nội bộ.
- Token hỏng bị xoá khỏi localStorage sau khi phát hiện.

> Test Designed: Tuyền Huỳnh · Final Result: PASS · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: —

#### TC-CMN-AUTH-037 — Đăng nhập cùng tài khoản trên 2 trình duyệt khác nhau

**Precondition:**

- CHƯA đăng nhập: đã xoá cookie, localStorage và sessionStorage của domain dev.fastboysocial.dev.

**Test data:**

Chrome và Firefox (hoặc Chrome thường và Chrome ẩn danh)

**Steps:**

1. Đăng nhập trên Chrome.
2. Đăng nhập cùng tài khoản trên Firefox.
3. Quay lại Chrome, bấm vào một mục sidebar.
4. Đăng xuất ở Firefox, quay lại Chrome thao tác tiếp.

**Expected Result:**

**Bước 2:**
- Đăng nhập được trên trình duyệt thứ hai.
**Bước 3:**
- Phiên trên Chrome vẫn dùng bình thường (nếu hệ thống cho phép nhiều phiên song song), HOẶC bị đăng xuất kèm message rõ ràng (nếu chỉ cho 1 phiên).
**Bước 4:**
- Đăng xuất ở Firefox KHÔNG làm mất phiên Chrome, trừ khi hệ thống chủ ý dùng 1 phiên duy nhất.

> Test Designed: Tuyền Huỳnh · Final Result: PASS · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: Chỉ 1 phiên: trình duyệt 1 bị đăng xuất, banner "Phiên đăng nhập đã hết hạn…" (đề nghị BA xem lại câu chữ)

#### TC-CMN-AUTH-038 — Nhấn F5 sau khi đăng nhập vẫn giữ nguyên phiên

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Đang ở `/work-queue`, nhấn `F5`.
2. Quan sát màn hình sau khi tải lại.
3. Lặp lại ở `/salon-profile/whmcs-3427` và `/requests`.

**Expected Result:**

**Bước 1:**
- Trang tải lại và vẫn đăng nhập.
**Bước 2:**
- Về đúng trang vừa đứng, KHÔNG bị đẩy về trang mặc định, KHÔNG bắt đăng nhập lại.
- Ngôn ngữ và giao diện giữ nguyên lựa chọn trước đó.
**Bước 3:**
- Cả 3 trang đều giữ nguyên phiên và đúng vị trí.

> Test Designed: Tuyền Huỳnh · Final Result: PASS · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: —

#### TC-CMN-AUTH-039 — Đăng nhập trên màn hình nhỏ và khi phóng to trình duyệt

**Precondition:**

- CHƯA đăng nhập: đã xoá cookie, localStorage và sessionStorage của domain dev.fastboysocial.dev.

**Test data:**

Kích thước: 1366x768 · 1280x720 · zoom 150% và 200%

**Steps:**

1. Đặt cửa sổ 1366x768, mở `/login`, quan sát bố cục.
2. Đặt 1280x720, quan sát lại.
3. Phóng to trình duyệt lên 150% rồi 200%.
4. Thử đăng nhập ở mức zoom 200%.

**Expected Result:**

**Bước 1:**
- Toàn bộ form nằm gọn trong màn hình, KHÔNG phải cuộn ngang.
**Bước 2:**
- Logo, tiêu đề, 2 ô nhập và 2 nút vẫn nhìn thấy đủ.
**Bước 3:**
- Ở 150% và 200%: chữ KHÔNG chồng lên nhau, nút KHÔNG bị cắt mất chữ, dòng điều khoản KHÔNG tràn ra ngoài khung.
**Bước 4:**
- Vẫn đăng nhập được bình thường ở mức zoom 200%.

> Test Designed: Tuyền Huỳnh · Final Result: PASS · Executed by: Automation Playwright (Claude Code) 19/11/2026 · Bug ID: — · Note: —


### NHÓM B — Tìm salon (ô tìm kiếm dùng chung trên header)

#### TC-CMN-SRCH-001 — Ô tìm salon hiển thị trên mọi màn hình trong ứng dụng

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Ở `/work-queue`, quan sát header phía trên.
2. Lần lượt mở `/salon-profile`, `/requests`, `/packages`, `/salon-profile/whmcs-3427`.
3. Ở mỗi màn, kiểm tra ô tìm kiếm có mặt và ở đúng vị trí không.
4. Thu gọn sidebar bằng phím `<` rồi kiểm tra lại.

**Expected Result:**

**Bước 1:**
- Ô tìm kiếm nằm ở giữa header, bên trái 2 nút ngôn ngữ và giao diện.
**Bước 2:**
- Cả 5 màn đều có ô tìm kiếm, cùng kích thước và cùng vị trí.
- KHÔNG màn nào thiếu ô tìm kiếm.
**Bước 3:**
- Placeholder luôn là `Tìm salon theo tên, thành phố hoặc ID (vd. #1005)`.
- Gợi ý phím tắt `Ctrl K` luôn hiển thị ở mép phải trong ô.
**Bước 4:**
- Khi sidebar thu gọn, ô tìm kiếm giãn ra theo nhưng KHÔNG che logo, KHÔNG đè lên 2 nút bên phải.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-002 — Placeholder ô tìm kiếm đổi theo ngôn ngữ

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Đọc placeholder khi đang ở ngôn ngữ `Tiếng Việt`.
2. Đổi sang `English`.
3. Đọc lại placeholder.
4. Đổi về `Tiếng Việt`.

**Expected Result:**

**Bước 1:**
- Nguyên văn: `Tìm salon theo tên, thành phố hoặc ID (vd. #1005)`.
**Bước 3:**
- Nguyên văn: `Search salons by name, city or ID (e.g. #1005)`.
- Phần ví dụ ID giữ nguyên `#1005` ở cả 2 ngôn ngữ.
**Bước 4:**
- Quay lại đúng chuỗi tiếng Việt, KHÔNG còn sót chuỗi tiếng Anh.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-003 — Phím tắt Ctrl K mở ô tìm kiếm từ các màn khác nhau

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Ở `/work-queue`, bấm vào vùng trống để bỏ focus, nhấn `Ctrl K`.
2. Gõ 1 ký tự để xác nhận con trỏ đã ở trong ô tìm kiếm.
3. Lặp lại ở `/requests`, `/packages` và `/salon-profile/whmcs-3427`.

**Expected Result:**

**Bước 1:**
- Ô tìm kiếm được focus, viền ô sáng lên.
**Bước 2:**
- Ký tự vừa gõ xuất hiện TRONG ô tìm kiếm, KHÔNG rơi vào ô nào khác trên trang.
**Bước 3:**
- Cả 4 màn đều mở được bằng `Ctrl K`.
- KHÔNG màn nào bị trình duyệt nuốt phím tắt (Chrome không có mặc định cho Ctrl K nên không xung đột).

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-004 — Nhấn Ctrl K khi con trỏ đang ở một ô nhập khác

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Ô `Ghi chú nội bộ` trên màn hồ sơ salon

**Steps:**

1. Mở `/salon-profile/whmcs-3427`.
2. Bấm vào ô `Ghi chú nội bộ`, gõ vài ký tự.
3. Nhấn `Ctrl K`.
4. Gõ `DEV`.

**Expected Result:**

**Bước 3:**
- Con trỏ chuyển sang ô tìm salon trên header.
**Bước 4:**
- `DEV` xuất hiện trong ô tìm salon, KHÔNG chèn vào ô ghi chú.
- Nội dung đã gõ trong ô `Ghi chú nội bộ` KHÔNG bị mất.
- Sau khi đóng tìm kiếm, nội dung ghi chú vẫn còn nguyên.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-005 — Bấm chuột vào ô tìm kiếm khi chưa gõ gì

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Bấm chuột vào ô tìm kiếm.
2. Quan sát có dropdown nào mở ra không.
3. Bấm ra ngoài ô.

**Expected Result:**

**Bước 1:**
- Ô được focus, viền sáng lên.
**Bước 2:**
- Ghi nhận hành vi thực tế: hiện dropdown gợi ý (salon mở gần đây / salon của tôi) hay không hiện gì.
- Dù theo hướng nào cũng KHÔNG được hiện dropdown rỗng không có nội dung gì bên trong.
**Bước 3:**
- Ô mất focus, KHÔNG để lại dropdown treo trên màn hình.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-006 — Nút Xoá tìm kiếm xuất hiện và hoạt động đúng

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: DEV

**Steps:**

1. Khi ô còn trống, kiểm tra có nút `Xoá tìm kiếm` không.
2. Gõ `DEV`, kiểm tra lại.
3. Bấm nút `Xoá tìm kiếm`.
4. Quan sát ô nhập và dropdown.

**Expected Result:**

**Bước 1:**
- Khi ô trống: KHÔNG hiện nút xoá, chỉ hiện gợi ý phím tắt `Ctrl K`.
**Bước 2:**
- Khi có nội dung: hiện nút `Xoá tìm kiếm` (dấu X) ở mép phải.
**Bước 3:**
- Nội dung trong ô bị xoá sạch.
**Bước 4:**
- Dropdown kết quả đóng lại, placeholder hiện lại.
- Con trỏ vẫn ở trong ô để gõ tiếp ngay; KHÔNG bắt người dùng bấm lại vào ô.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-007 — Nhãn trợ năng của ô tìm kiếm và danh sách kết quả

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: DEV

**Steps:**

1. Gõ `DEV` vào ô tìm kiếm.
2. Dùng công cụ kiểm tra trợ năng (hoặc DevTools → Accessibility) đọc vai trò và nhãn của ô nhập.
3. Đọc vai trò của danh sách kết quả và từng dòng kết quả.

**Expected Result:**

**Bước 2:**
- Ô nhập có vai trò `combobox`, nhãn `Tìm kiếm`.
**Bước 3:**
- Danh sách kết quả có vai trò `listbox`, mỗi dòng là `option`.
- Dòng đang được chọn bằng bàn phím phải được đánh dấu trạng thái chọn để trình đọc màn hình đọc ra.
- KHÔNG có dòng kết quả nào chỉ là `div` trơ không có vai trò.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-008 — Dòng gợi ý phím tắt dưới danh sách kết quả

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: #3427

**Steps:**

1. Gõ `#3427` để ra đúng 1 kết quả.
2. Đọc dòng gợi ý ở đáy dropdown.
3. Đổi ngôn ngữ sang English và đọc lại.

**Expected Result:**

**Bước 2:**
- Nguyên văn tiếng Việt: `↑↓ để di chuyển` · `Enter để mở` · `Esc để đóng`.
- Các phím được bọc trong khung nhỏ, tách khỏi phần chữ.
**Bước 3:**
- Bản tiếng Anh có đủ 3 gợi ý tương ứng, KHÔNG sót gợi ý nào chưa dịch.
- Kỳ vọng chính: chữ gợi ý phải mô tả đúng hành vi thật. Thực tế `Esc` xoá luôn nội dung đã gõ chứ không chỉ đóng dropdown → ghi Fail nếu chữ gợi ý vẫn là `Esc để đóng`.
- KHÔNG để chữ gợi ý mô tả một hành vi, ứng dụng làm một hành vi khác.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-009 — Tìm theo tên salon đầy đủ

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Salon có thật trên DEV (khảo sát 09/11/2026):
- `ID#3 - DEV Nails Spa 123` · #3427 · Brea
- `DEV Nails Spa 123` · #3 · Houston
- `231127 Nails` · #1074 · Houston
- `DEV Auto` · #3016 (không có thành phố)
- `DEV test` · #3753 · 145

**Steps:**

1. Gõ `DEV Nails Spa 123` vào ô tìm kiếm.
2. Đợi 2 giây, đọc danh sách kết quả.
3. Đối chiếu tên, ID và thành phố của từng dòng.

**Expected Result:**

**Bước 2:**
- Có kết quả, trong đó phải có dòng `DEV Nails Spa 123` · `#3 · Houston`.
**Bước 3:**
- Mỗi dòng gồm: chữ cái viết tắt trong vòng tròn, tên salon in đậm, dòng phụ dạng `#<ID> · <Thành phố>`.
- Salon `ID#3 - DEV Nails Spa 123` · `#3427 · Brea` cũng xuất hiện vì tên chứa cụm từ khoá.
- KHÔNG hiện salon nào không chứa cụm từ khoá trong tên hoặc thành phố.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-010 — Tìm theo một phần tên salon

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `Nails`

**Steps:**

1. Gõ `Nails`.
2. Đợi 2 giây, đọc danh sách.
3. Kiểm tra mọi dòng kết quả có thực sự chứa `Nails` không.

**Expected Result:**

**Bước 2:**
- Trả về các salon có chữ `Nails` trong tên, ví dụ `231127 Nails` · `#1074 · Houston` và `DEV Nails Spa 123`.
**Bước 3:**
- MỌI dòng đều chứa `Nails` ở tên hoặc ở thành phố.
- KHÔNG có dòng nào lọt vào mà không khớp từ khoá.
- Nếu kết quả nhiều hơn số dòng hiển thị được thì phải cuộn được trong dropdown.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-011 — Tìm theo tên không phân biệt hoa thường

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `dev nails` · `DEV NAILS` · `DeV nAiLs`

**Steps:**

1. Gõ `dev nails`, ghi lại danh sách kết quả.
2. Xoá, gõ `DEV NAILS`, ghi lại.
3. Xoá, gõ `DeV nAiLs`, ghi lại.
4. So 3 danh sách.

**Expected Result:**

**Bước 4:**
- Cả 3 lần trả về CÙNG một danh sách, cùng thứ tự, cùng số dòng.
- KHÔNG lần nào trả về rỗng.
- KHÔNG có khác biệt nào giữa 3 cách viết.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-012 — Tìm tên tiếng Việt bằng từ khoá không dấu

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Salon `Cái nết đánh chết cái đẹp` · #1227 · Houston. Từ khoá: `cai net`

**Steps:**

1. Gõ `cai net` (không dấu).
2. Đợi 2 giây, đọc kết quả.
3. Xoá, gõ `Cái nết` (có dấu), đọc kết quả.
4. So 2 kết quả.

**Expected Result:**

**Bước 2:**
- Trả về đúng salon `Cái nết đánh chết cái đẹp` · `#1227 · Houston`.
**Bước 3:**
- Cũng trả về đúng salon đó.
**Bước 4:**
- Hai cách gõ cho cùng kết quả — tìm kiếm bỏ qua dấu tiếng Việt.
- KHÔNG trả rỗng khi gõ không dấu.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-013 — Tìm tên có dấu đầy đủ và gõ sai dấu

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `Cái nết` · `Cai nêt` · `cáí nết`

**Steps:**

1. Gõ `Cái nết`, ghi kết quả.
2. Gõ `Cai nêt` (sai dấu), ghi kết quả.
3. Gõ `cáí nết` (thừa dấu), ghi kết quả.

**Expected Result:**

**Bước 1:**
- Ra đúng salon `Cái nết đánh chết cái đẹp`.
**Bước 2:**
- Vì hệ thống bỏ dấu khi so khớp nên vẫn ra đúng salon đó.
**Bước 3:**
- Cũng ra đúng salon đó.
- KHÔNG trả về rỗng ở bất kỳ cách gõ dấu nào, miễn phần chữ cái gốc khớp.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-014 — Từ khoá có nhiều khoảng trắng ở giữa

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `DEV Nails` (4 khoảng trắng)

**Steps:**

1. Gõ `DEV` rồi 4 khoảng trắng rồi `Nails`.
2. Đợi 2 giây, đọc kết quả.
3. So với kết quả của `DEV Nails` (1 khoảng trắng).

**Expected Result:**

**Bước 2:**
- Kỳ vọng chính: hệ thống gộp khoảng trắng thừa và vẫn trả đúng salon `DEV Nails Spa 123`.
**Bước 3:**
- Kết quả giống hệt khi gõ 1 khoảng trắng.
- KHÔNG hiển thị thông báo `Không có salon nào khớp` chỉ vì khoảng trắng thừa; nếu trả rỗng → ghi Fail, vì người dùng gõ nhanh rất dễ thừa khoảng trắng.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-015 — Từ khoá có khoảng trắng ở đầu và cuối

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: ` DEV Nails `

**Steps:**

1. Dán từ khoá kèm 2 khoảng trắng đầu và 2 khoảng trắng cuối.
2. Đợi 2 giây, đọc kết quả.
3. So với kết quả không có khoảng trắng thừa.

**Expected Result:**

**Bước 2:**
- Trả về đúng salon như khi không có khoảng trắng thừa.
**Bước 3:**
- Hai kết quả giống hệt nhau.
- KHÔNG hiển thị thông báo `Không có salon nào khớp` chỉ vì khoảng trắng.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-016 — Tìm salon có ký tự đặc biệt trong tên

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Salon `&Bussiness&*Name2` · #386 · ho chi minh

**Steps:**

1. Gõ `&Bussiness`.
2. Đọc kết quả.
3. Gõ tiếp `&*Name2`.
4. Gõ chỉ ký tự `&`.

**Expected Result:**

**Bước 2:**
- Trả về salon `&Bussiness&*Name2` · `#386 · ho chi minh`.
**Bước 3:**
- Vẫn tìm được salon đó.
**Bước 4:**
- Trả về các salon có chứa `&` trong tên, hoặc thông báo không có kết quả.
- KHÔNG lỗi 500, KHÔNG lỗi JavaScript ở Console.
- Tên hiển thị nguyên văn, ký tự đặc biệt KHÔNG bị mã hoá thành `&amp;`.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-017 — Tìm bằng từ khoá dài 200 ký tự

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Chuỗi 200 ký tự `a` lặp lại

**Steps:**

1. Dán chuỗi 200 ký tự vào ô tìm kiếm.
2. Đợi 3 giây.
3. Quan sát ô nhập, dropdown và Console.

**Expected Result:**

**Bước 2:**
- Hiển thị thông báo không có kết quả, hoặc cắt từ khoá theo giới hạn đã định.
**Bước 3:**
- Ô nhập KHÔNG giãn làm vỡ header; chuỗi dài cuộn ngang trong ô.
- Thông báo `Không có salon nào khớp “…”` KHÔNG tràn ra khỏi khung dropdown; nếu từ khoá quá dài thì phải rút gọn bằng dấu `…`.
- KHÔNG lỗi 500, KHÔNG treo trình duyệt.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-018 — Tìm bằng 1 ký tự

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `a`

**Steps:**

1. Gõ đúng 1 ký tự `a`.
2. Đợi 2 giây, đọc kết quả.
3. Đếm số dòng hiển thị và kiểm tra có cuộn được không.

**Expected Result:**

**Bước 2:**
- Hệ thống có gọi tìm kiếm ngay từ 1 ký tự (đã xác nhận: trả về danh sách dài).
**Bước 3:**
- Danh sách có thanh cuộn, cuộn mượt trong dropdown.
- MỌI dòng phải chứa `a` ở tên hoặc thành phố.
- KHÔNG treo trình duyệt, KHÔNG để dropdown đứng im quá lâu mà không có dấu hiệu đang tải.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-019 — Tìm bằng 2 ký tự

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `de`

**Steps:**

1. Gõ `de`.
2. Đợi 2 giây, đọc kết quả.
3. Gõ thêm thành `dev`, so sánh danh sách.

**Expected Result:**

**Bước 2:**
- Trả về danh sách salon chứa `de`.
**Bước 3:**
- Danh sách của `dev` phải là tập con của danh sách `de`, hoặc ít nhất ngắn hơn.
- KHÔNG xảy ra trường hợp `dev` ra nhiều kết quả hơn `de`.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-020 — Tìm tên salon không tồn tại

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `zzzqqq`

**Steps:**

1. Gõ `zzzqqq`.
2. Đợi 2 giây.
3. Đọc nguyên văn thông báo.
4. Đổi sang English và gõ lại.

**Expected Result:**

**Bước 2:**
- Dropdown hiện thông báo thay cho danh sách.
**Bước 3:**
- Nguyên văn: `Không có salon nào khớp “zzzqqq”` — từ khoá được đặt trong dấu nháy kép cong.
- KHÔNG hiện dropdown rỗng không chữ nào.
**Bước 4:**
- Bản tiếng Anh hiển thị thông báo tương ứng, KHÔNG còn chuỗi tiếng Việt.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-021 — Gõ từ khoá chỉ gồm khoảng trắng

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: 3 dấu cách

**Steps:**

1. Gõ 3 dấu cách vào ô tìm kiếm.
2. Đợi 2 giây.
3. Quan sát dropdown và tab Network.

**Expected Result:**

**Bước 2:**
- Kỳ vọng chính: coi như ô trống — KHÔNG gửi request tìm kiếm lên server.
**Bước 3:**
- Tab Network KHÔNG có request tìm kiếm nào.
- KHÔNG hiện thông báo `Không có salon nào khớp “ ”`.
- Nếu có gửi request → ghi Fail, Severity `Trivial`, nhưng cần báo vì tạo tải vô ích.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-022 — Tìm theo tên thành phố

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `Houston`

**Steps:**

1. Gõ `Houston`.
2. Đợi 2 giây, đọc danh sách.
3. Kiểm tra dòng phụ của từng kết quả.
4. Cuộn hết danh sách.

**Expected Result:**

**Bước 2:**
- Trả về nhiều salon, ví dụ `231127 Nails` · `#1074 · Houston`, `abc` · `#1189 · Houston`, `Barry Raborn, OP` · `#3164 · Houston`.
**Bước 3:**
- MỌI dòng đều có thành phố `Houston` trong dòng phụ.
- KHÔNG có salon thuộc thành phố khác lọt vào.
**Bước 4:**
- Cuộn được tới hết danh sách, KHÔNG kẹt ở giữa, KHÔNG mất dòng cuối.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-023 — Tìm thành phố không phân biệt hoa thường

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `houston` · `HOUSTON`

**Steps:**

1. Gõ `houston` (thường), ghi số dòng kết quả.
2. Gõ `HOUSTON` (HOA), ghi số dòng.
3. So 2 kết quả.

**Expected Result:**

**Bước 3:**
- Hai lần cho cùng số dòng và cùng thứ tự.
- KHÔNG lần nào trả rỗng.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-024 — Tìm theo viết tắt tên bang

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Salon `#123654` · #2207 · AK

**Steps:**

1. Gõ `AK`.
2. Đọc kết quả.
3. Gõ `CA` và đọc kết quả.

**Expected Result:**

**Bước 2:**
- Trả về salon `#123654` · `#2207 · AK`.
**Bước 3:**
- Trả về các salon có `CA` trong tên hoặc thành phố.
- KHÔNG trả về salon không chứa `CA` ở bất kỳ trường nào được so khớp.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-025 — Tìm thành phố tiếng Việt không dấu

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Salon `007_After Member` · #245 · HCM; `&Bussiness&*Name2` · #386 · ho chi minh

**Steps:**

1. Gõ `ho chi minh`.
2. Đọc kết quả.
3. Gõ `HCM`.
4. So 2 danh sách.

**Expected Result:**

**Bước 2:**
- Trả về salon có thành phố `ho chi minh`.
**Bước 3:**
- Trả về salon có thành phố `HCM`.
**Bước 4:**
- Hai danh sách KHÁC nhau vì dữ liệu lưu 2 cách viết khác nhau cho cùng một thành phố.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-026 — Tìm thành phố có nhiều salon và kiểm tra giới hạn số kết quả

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `Houston`

**Steps:**

1. Gõ `Houston`.
2. Cuộn xuống đáy danh sách, đếm tổng số dòng hiển thị.
3. Kiểm tra có dòng kiểu `Xem tất cả kết quả` ở cuối không.
4. Đối chiếu số salon ở Houston trong cơ sở dữ liệu (nhờ dev truy vấn).

**Expected Result:**

**Bước 2:**
- Ghi lại chính xác số dòng tối đa dropdown hiển thị.
**Bước 3:**
- Nếu số salon thực tế nhiều hơn số dòng hiển thị thì phải có dấu hiệu cho biết còn kết quả khác (dòng `Xem tất cả`, hoặc ghi tổng số).
- KHÔNG cắt im lặng khiến người dùng tưởng chỉ có bấy nhiêu salon.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-027 — Tìm thành phố không có salon nào

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `Reykjavik`

**Steps:**

1. Gõ `Reykjavik`.
2. Đợi 2 giây.
3. Đọc thông báo.

**Expected Result:**

**Bước 2:**
- Hiện thông báo `Không có salon nào khớp “Reykjavik”`.
**Bước 3:**
- KHÔNG hiện dòng kết quả nào.
- KHÔNG hiện lỗi hệ thống.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-028 — Salon không có dữ liệu thành phố hiển thị thế nào trong kết quả

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Salon `DEV Auto` · #3016 (không có thành phố); `DEV check 111` · #2946; `DEV testing` · #2953

**Steps:**

1. Gõ `DEV`.
2. Tìm các dòng `DEV Auto`, `DEV check 111`, `DEV testing` trong danh sách.
3. Đọc dòng phụ của từng dòng đó.
4. So với dòng có đủ thành phố như `DEV Nails Spa 123`.

**Expected Result:**

**Bước 3:**
- Dòng phụ chỉ hiển thị `#3016`, `#2946`, `#2953` — không có phần thành phố.
- KHÔNG hiển thị dấu `·` lủng lẳng ở cuối khi thiếu thành phố.
- KHÔNG hiển thị chữ `null`, `undefined` hay `Không có`.
**Bước 4:**
- Dòng có đủ dữ liệu hiển thị `#3 · Houston`; hai kiểu dòng căn chỉnh thẳng hàng nhau.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-029 — Tìm theo ID có dấu thăng

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `#3427`

**Steps:**

1. Gõ `#3427`.
2. Đợi 2 giây, đọc kết quả.
3. Đếm số dòng trả về.

**Expected Result:**

**Bước 2:**
- Trả về đúng salon `ID#3 - DEV Nails Spa 123` · `#3427 · Brea`.
**Bước 3:**
- Chỉ có ĐÚNG 1 dòng kết quả (ID là duy nhất).
- Dòng gợi ý phím tắt hiển thị bên dưới.
- KHÔNG trả về salon nào khác.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-030 — Tìm theo ID KHÔNG có dấu thăng

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `3427` (so với `#3427`)

**Steps:**

1. Gõ `3427` (không có dấu `#`).
2. Đợi 2 giây, đọc kết quả.
3. Xoá, gõ `#3427`, đọc kết quả.
4. So 2 kết quả.

**Expected Result:**

**Bước 2:**
- Thực tế trên build hiện tại: hiện `Không có salon nào khớp “3427”`.
**Bước 3:**
- Với `#3427`: trả về đúng salon.
**Bước 4:**
- Kỳ vọng chính: gõ số ID trần PHẢI tìm ra salon, vì người dùng chép ID từ CRM/Linear thường không kèm dấu `#` → ghi Fail.
- KHÔNG chấp nhận việc người dùng phải tự đoán ra là bắt buộc gõ `#`.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-031 — Tìm bằng ID không tồn tại

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `#999999`

**Steps:**

1. Gõ `#999999`.
2. Đợi 2 giây.
3. Đọc thông báo.

**Expected Result:**

**Bước 2:**
- Hiện `Không có salon nào khớp “#999999”`.
**Bước 3:**
- KHÔNG hiện dòng kết quả nào.
- KHÔNG lỗi 500, KHÔNG màn trắng.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-032 — Tìm bằng ID bằng 0 và số âm

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `#0` · `#-1`

**Steps:**

1. Gõ `#0`, đọc kết quả.
2. Gõ `#-1`, đọc kết quả.
3. Kiểm tra Console sau mỗi lần.

**Expected Result:**

**Bước 1:**
- Hiện thông báo không có kết quả (ID bắt đầu từ 1).
**Bước 2:**
- Hiện thông báo không có kết quả.
**Bước 3:**
- KHÔNG lỗi 500, KHÔNG lỗi JavaScript chưa bắt ở Console.
- KHÔNG gửi giá trị âm xuống API gây lỗi phía server.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-033 — Gõ chỉ mỗi dấu thăng

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `#`

**Steps:**

1. Gõ đúng 1 ký tự `#`.
2. Đợi 2 giây.
3. Quan sát dropdown và tab Network.

**Expected Result:**

**Bước 2:**
- Coi `#` là từ khoá bình thường — hoặc hiện thông báo không có kết quả, hoặc trả về salon có `#` trong tên (ví dụ `#123654`). Cả hai đều ghi Pass.
**Bước 3:**
- KHÔNG lỗi 500.
- KHÔNG trả về toàn bộ danh sách salon.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-034 — Gõ dấu thăng kèm chữ cái

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `#abc`

**Steps:**

1. Gõ `#abc`.
2. Đợi 2 giây, đọc kết quả.
3. Kiểm tra Console.

**Expected Result:**

**Bước 2:**
- Hiện `Không có salon nào khớp “#abc”`, hoặc trả về salon có `#abc` trong tên nếu có.
**Bước 3:**
- KHÔNG lỗi 500 do server cố ép chuỗi `abc` sang kiểu số.
- KHÔNG lỗi JavaScript ở Console.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-035 — ID có khoảng trắng xen giữa dấu thăng và số

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `# 3427`

**Steps:**

1. Gõ `# 3427` (có dấu cách sau `#`).
2. Đợi 2 giây, đọc kết quả.
3. So với `#3427`.

**Expected Result:**

**Bước 2:**
- Hiển thị thông tin không có salon nào khớp với dữ liệu đã nhập

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-036 — ID dài bất thường

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `#99999999999999999999`

**Steps:**

1. Gõ `#` kèm 20 chữ số 9.
2. Đợi 3 giây.
3. Quan sát dropdown, Console và tab Network.

**Expected Result:**

**Bước 2:**
- Hiện thông báo không có kết quả.
**Bước 3:**
- KHÔNG lỗi 500 do tràn kiểu số nguyên ở backend.
- Response trả về trong vòng 5 giây, KHÔNG treo.
- KHÔNG lỗi JavaScript ở Console.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-037 — Tìm ID của salon đang mở trên màn hình

**Precondition:**

- Đã đăng nhập bằng tài khoản `chi Hương` - vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang mở hồ sơ salon https://dev.fastboysocial.dev/salon-profile/whmcs-3427 (`ID#3 - DEV Nails Spa 123`, #3427 · Brea, CA).

**Test data:**

Từ khoá: `#3427` khi đang mở chính salon #3427

**Steps:**

1. Đang ở hồ sơ salon `#3427`, gõ `#3427` vào ô tìm kiếm.
2. Nhấn `Enter` để mở kết quả.
3. Quan sát màn hình và URL.

**Expected Result:**

**Bước 1:**
- Trả về đúng salon đó; có thể đánh dấu là salon đang xem.
**Bước 2:**
- Điều hướng tới chính trang đang đứng.
**Bước 3:**
- Trang KHÔNG bị tải lại thành màn trắng, KHÔNG nhân đôi breadcrumb.
- KHÔNG đẩy thêm một mục trùng lặp vào lịch sử trình duyệt khiến nút Back phải bấm 2 lần mới ra khỏi trang.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-038 — Thứ tự sắp xếp kết quả tìm kiếm

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `a` và `Houston`

**Steps:**

1. Gõ `a`, ghi lại 10 dòng đầu theo đúng thứ tự.
2. Gõ `Houston`, ghi lại 10 dòng đầu.
3. Xác định quy tắc sắp xếp đang dùng.

**Expected Result:**

**Bước 1:**
- Thực tế quan sát: sắp theo tên tăng dần, không phân biệt hoa thường, ký tự đặc biệt và số đứng trước chữ (`#123654` → `&Bussiness&*Name2` → `007_After Member` → `01/12/2022_000001`).
**Bước 2:**
- Cùng quy tắc sắp xếp như bước 1.
**Bước 3:**
- Thứ tự phải ổn định: gõ lại cùng từ khoá cho ra cùng thứ tự; KHÔNG đảo thứ tự giữa 2 lần gõ cùng từ khoá.
- Kỳ vọng chính: salon KHỚP CHÍNH XÁC từ khoá nên được xếp lên đầu thay vì xếp thuần theo bảng chữ cái.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-039 — Gõ nhanh liên tục kiểm tra cơ chế chờ trước khi gọi tìm kiếm

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `Houston` gõ liền mạch

**Steps:**

1. Mở DevTools tab Network, lọc theo request tìm kiếm.
2. Gõ liền `Houston` (7 ký tự) thật nhanh.
3. Đếm số request tìm kiếm được gửi.
4. Lặp lại nhưng gõ chậm, mỗi ký tự cách nhau 1 giây.

**Expected Result:**

**Bước 3:**
- Kỳ vọng chính: KHÔNG gửi 7 request. Hệ thống phải chờ người dùng ngừng gõ rồi mới gọi (debounce).
- Nếu gửi đủ 7 request → ghi Fail, báo rủi ro quá tải khi dữ liệu salon lớn.
**Bước 4:**
- Gõ chậm thì số request tăng theo, chấp nhận được.
- Kết quả cuối cùng luôn khớp từ khoá ĐẦY ĐỦ, KHÔNG hiển thị kết quả của từ khoá dở dang (ví dụ kết quả của `Hous` đè lên kết quả của `Houston`).

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-040 — Kết quả trả về chậm không đè lên kết quả mới hơn

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

DevTools giả lập mạng `Slow 3G` · từ khoá `Hou` rồi đổi thành `#3427`

**Steps:**

1. Bật throttling `Slow 3G`.
2. Gõ `Hou`, chờ 1 giây (chưa có kết quả).
3. Xoá hết, gõ ngay `#3427`.
4. Đợi cả 2 request xong, đọc danh sách cuối cùng.

**Expected Result:**

**Bước 4:**
- Kỳ vọng chính: danh sách hiển thị là kết quả của `#3427`, tức ĐÚNG 1 salon.
- KHÔNG được hiển thị danh sách Houston (kết quả cũ về sau đè lên kết quả mới).

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-041 — Trạng thái đang tải khi chờ kết quả

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

DevTools giả lập `Slow 3G` · từ khoá `Houston`

**Steps:**

1. Bật throttling `Slow 3G`.
2. Gõ `Houston`.
3. Quan sát dropdown trong lúc chờ.

**Expected Result:**

**Bước 3:**
- Hiển thị dấu hiệu đang tải (spinner, skeleton hoặc chữ đang tìm).
- KHÔNG hiện thông báo `Không có salon nào khớp` trong lúc còn đang chờ — đây là lỗi dễ gặp và gây hiểu nhầm nặng.
- Khi có kết quả, trạng thái tải biến mất hoàn toàn.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-042 — Xoá dần từng ký tự trong từ khoá

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá ban đầu: `Houston`

**Steps:**

1. Gõ `Houston`, đợi ra kết quả.
2. Nhấn `Backspace` từng lần cho tới khi ô trống.
3. Quan sát danh sách sau mỗi lần xoá.
4. Khi ô trống hẳn, quan sát dropdown.

**Expected Result:**

**Bước 3:**
- Danh sách cập nhật theo từ khoá còn lại mỗi lần xoá.
- KHÔNG giữ lại kết quả của từ khoá cũ.
**Bước 4:**
- Khi ô trống: dropdown đóng lại hoặc trở về trạng thái ban đầu, nhất quán với TC-CMN-SRCH-005.
- KHÔNG để lại danh sách kết quả của từ khoá đã bị xoá.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-043 — Di chuyển trong danh sách kết quả bằng phím mũi tên

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `DEV` (7 kết quả)

**Steps:**

1. Gõ `DEV`, đợi ra danh sách.
2. Nhấn `↓` 3 lần, quan sát dòng được chọn.
3. Nhấn `↑` 1 lần.
4. Nhấn `↓` liên tục quá số dòng của danh sách.

**Expected Result:**

**Bước 2:**
- Mỗi lần `↓` chuyển xuống đúng 1 dòng, dòng đang chọn được tô nền khác.
- Chỉ có ĐÚNG 1 dòng được tô tại mỗi thời điểm.
**Bước 3:**
- `↑` quay lại đúng dòng phía trên.
**Bước 4:**
- Khi tới dòng cuối: hoặc dừng lại ở dòng cuối, hoặc quay vòng về dòng đầu — phải nhất quán.
- Danh sách tự cuộn để dòng đang chọn luôn nằm trong vùng nhìn thấy.
- KHÔNG để con trỏ chạy ra khỏi danh sách mà không dòng nào được tô.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-044 — Nhấn mũi tên lên khi đang ở dòng đầu tiên

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `DEV`

**Steps:**

1. Gõ `DEV`, đợi ra danh sách.
2. Nhấn `↑` ngay khi chưa di chuyển lần nào.
3. Nhấn `↓` 1 lần rồi `↑` 2 lần.

**Expected Result:**

**Bước 2:**
- Kỳ vọng chính: hành vi ở biên trên và biên dưới phải đối xứng nhau. Nếu `↓` ở dòng cuối quay vòng về dòng đầu thì `↑` ở dòng đầu phải quay vòng xuống dòng cuối; nếu `↓` dừng lại thì `↑` cũng phải dừng lại. Lệch nhau giữa 2 biên → ghi Fail.
**Bước 3:**
- Con trỏ quay về dòng đầu hoặc rời khỏi danh sách về ô nhập.
- KHÔNG để rơi vào trạng thái không dòng nào được tô nhưng `Enter` vẫn mở một salon nào đó.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-045 — Nhấn Esc khi dropdown đang mở

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `Houston`

**Steps:**

1. Gõ `Houston`, đợi ra danh sách.
2. Nhấn `Esc`.
3. Quan sát ô nhập và dropdown.
4. Nhấn `Esc` lần nữa.

**Expected Result:**

**Bước 2:**
- Dropdown đóng lại.
**Bước 3:**
- Thực tế trên build hiện tại: nội dung `Houston` trong ô bị XOÁ luôn, ô quay về placeholder.
- Kỳ vọng chính theo gợi ý hiển thị trên UI (`Esc để đóng`): lần `Esc` thứ nhất chỉ đóng dropdown và GIỮ nguyên từ khoá; muốn xoá từ khoá thì nhấn `Esc` lần thứ hai.
- Vì hành vi thực tế xoá luôn ở lần đầu → ghi Fail.
**Bước 4:**
- Nếu đã xoá hết ở bước 2 thì `Esc` lần hai không còn tác dụng gì; KHÔNG được đóng cả trang hay thoát khỏi màn hình.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-046 — Bấm chuột ra ngoài khi dropdown đang mở

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `Houston`

**Steps:**

1. Gõ `Houston`, đợi ra danh sách.
2. Bấm chuột vào vùng trống giữa trang.
3. Quan sát ô nhập và dropdown.
4. Bấm lại vào ô tìm kiếm.

**Expected Result:**

**Bước 2:**
- Dropdown đóng lại.
**Bước 3:**
- Từ khoá `Houston` còn hay mất phải NHẤT QUÁN với hành vi của `Esc`.
- KHÔNG xảy ra trường hợp bấm ra ngoài thì giữ từ khoá còn `Esc` thì xoá (hoặc ngược lại) mà không có lý do.
**Bước 4:**
- Nếu từ khoá còn: dropdown mở lại với đúng kết quả cũ, KHÔNG phải gọi lại API.
- Nếu từ khoá mất: ô ở trạng thái trống, placeholder hiện lại.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-047 — Nhấn Enter khi chưa chọn dòng nào bằng bàn phím

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `DEV`

**Steps:**

1. Gõ `DEV`, đợi ra danh sách, KHÔNG nhấn phím mũi tên.
2. Nhấn `Enter`.
3. Quan sát URL và màn hình.

**Expected Result:**

**Bước 2:**
- Thực tế quan sát: dòng đầu tiên được tô sẵn nên `Enter` mở dòng đầu tiên.
**Bước 3:**
- Điều hướng tới hồ sơ salon của dòng đầu tiên.
- Kỳ vọng chính: nếu dòng đầu được tô sẵn thì phải tô rõ để người dùng biết `Enter` sẽ mở salon nào.
- KHÔNG được mở một salon mà người dùng không hề chủ ý chọn.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-048 — Nhấn Enter khi không có kết quả nào

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `zzzqqq`

**Steps:**

1. Gõ `zzzqqq`, đợi hiện thông báo không có kết quả.
2. Nhấn `Enter`.
3. Quan sát màn hình và URL.

**Expected Result:**

**Bước 2:**
- KHÔNG xảy ra điều hướng.
**Bước 3:**
- URL giữ nguyên, màn hình giữ nguyên.
- KHÔNG hiện màn trắng, KHÔNG lỗi JavaScript ở Console.
- Thông báo không có kết quả vẫn ở nguyên trên dropdown.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-049 — Nhấn Tab khi dropdown đang mở

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `DEV`

**Steps:**

1. Gõ `DEV`, đợi ra danh sách.
2. Nhấn `Tab`.
3. Quan sát phần tử được focus và trạng thái dropdown.

**Expected Result:**

**Bước 2:**
- Con trỏ chuyển sang phần tử tiếp theo trong header (nút `Xoá tìm kiếm` hoặc nút ngôn ngữ).
**Bước 3:**
- Dropdown đóng lại, hoặc giữ mở nhưng không chặn thao tác tiếp theo.
- KHÔNG để dropdown treo đè lên nội dung mà người dùng đang thao tác.
- KHÔNG mở salon nào.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-050 — Cuộn trong danh sách kết quả bằng chuột và bàn phím

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `Houston`

**Steps:**

1. Gõ `Houston`, đợi ra danh sách dài.
2. Lăn chuột trong vùng dropdown.
3. Lăn chuột khi con trỏ nằm NGOÀI dropdown.
4. Dùng `↓` để di chuyển tới dòng cuối.

**Expected Result:**

**Bước 2:**
- Danh sách cuộn bên trong dropdown, có thanh cuộn hiển thị.
**Bước 3:**
- Kỳ vọng chính: trang nền KHÔNG cuộn theo khi dropdown đang mở. Nếu trang nền có cuộn thì dropdown bắt buộc phải bám theo ô tìm kiếm; dropdown đứng yên trong khi ô tìm kiếm trôi đi → ghi Fail.
**Bước 4:**
- Danh sách tự cuộn theo dòng đang chọn, dòng đang chọn luôn nhìn thấy được.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-051 — Chọn kết quả bằng chuột mở đúng hồ sơ salon

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Salon `ID#3 - DEV Nails Spa 123` · #3427

**Steps:**

1. Gõ `#3427`.
2. Bấm chuột vào dòng kết quả.
3. Đọc URL và nội dung trang.
4. Đọc breadcrumb.

**Expected Result:**

**Bước 2:**
- Điều hướng trong vòng 3 giây.
**Bước 3:**
- URL đúng `/salon-profile/whmcs-3427`.
- Tiêu đề trang là `ID#3 - DEV Nails Spa 123`, dòng phụ `#3427 · Brea, CA · Chủ sở hữu ID#3 - DEV Nails Spa 123`.
- Mở đúng tab `Hồ sơ`, KHÔNG nhảy sang tab `Ghi chú` hay `Gói & mức dùng`.
**Bước 4:**
- Breadcrumb: `Trang chủ` › `Salon` › `ID#3 - DEV Nails Spa 123`.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-052 — Chọn kết quả bằng phím Enter mở đúng hồ sơ salon

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Salon #3427

**Steps:**

1. Nhấn `Ctrl K`, gõ `#3427`.
2. Nhấn `Enter`.
3. So màn hình kết quả với cách bấm chuột ở TC-CMN-SRCH-053.

**Expected Result:**

**Bước 2:**
- Mở đúng `/salon-profile/whmcs-3427`.
**Bước 3:**
- Kết quả giống hệt cách bấm chuột: cùng URL, cùng tab mặc định, cùng breadcrumb.
- KHÔNG có khác biệt nào giữa 2 cách chọn.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-053 — Ô tìm kiếm được dọn sau khi điều hướng

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `#3427`

**Steps:**

1. Gõ `#3427`, nhấn `Enter` để mở salon.
2. Quan sát ô tìm kiếm trên trang mới.
3. Bấm vào ô tìm kiếm.

**Expected Result:**

**Bước 2:**
- Ô tìm kiếm trở về trạng thái trống với placeholder, KHÔNG giữ lại `#3427`.
- Dropdown KHÔNG còn mở.
**Bước 3:**
- Bấm vào ô thì ở trạng thái sạch, sẵn sàng gõ từ khoá mới.
- KHÔNG hiện lại danh sách kết quả cũ.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-054 — Bấm Back sau khi mở salon từ ô tìm kiếm

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ `/work-queue` → tìm `#3427` → mở salon

**Steps:**

1. Đang ở `/work-queue`, tìm `#3427` và mở salon.
2. Bấm nút Back của trình duyệt.
3. Quan sát trang và ô tìm kiếm.

**Expected Result:**

**Bước 2:**
- Quay về `/work-queue`.
**Bước 3:**
- Màn `Việc cần làm` hiển thị đầy đủ như trước, KHÔNG mất dữ liệu, KHÔNG màn trắng.
- Ô tìm kiếm ở trạng thái trống.
- Nhấn Back một lần là đủ; KHÔNG phải bấm 2 lần vì thao tác tìm kiếm bị ghi thừa vào lịch sử.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-055 — Mở salon từ ô tìm kiếm khi đang ở các màn khác nhau

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `#3427`

**Steps:**

1. Từ `/requests`, tìm `#3427` và mở salon.
2. Bấm Back, rồi từ `/packages` làm lại.
3. Từ `/salon-profile/whmcs-3` làm lại.
4. So kết quả 3 lần.

**Expected Result:**

**Bước 4:**
- Cả 3 lần đều mở đúng `/salon-profile/whmcs-3427`.
- Breadcrumb luôn là `Trang chủ › Salon › <tên salon>`, KHÔNG phụ thuộc trang xuất phát.
- KHÔNG lần nào giữ lại bộ lọc hay trạng thái của trang cũ.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-056 — Mở salon từ kết quả bằng chuột giữa hoặc Ctrl+Click

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `#3427`

**Steps:**

1. Gõ `#3427`.
2. Nhấn `Ctrl` và bấm chuột trái vào dòng kết quả.
3. Quan sát có mở tab mới không.

**Expected Result:**

**Bước 2:**
- Nếu dòng kết quả là link thật: mở tab mới tới `/salon-profile/whmcs-3427`, tab hiện tại giữ nguyên.
- Nếu dòng chỉ là phần tử bấm được (không phải link): mở trong cùng tab.
**Bước 3:**
- Dù theo hướng nào cũng KHÔNG mở tab trắng, KHÔNG mở sai URL.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-057 — Mất mạng khi đang tìm kiếm

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

DevTools chế độ `Offline`

**Steps:**

1. Gõ `Houston`, đợi ra kết quả.
2. Bật chế độ `Offline`.
3. Xoá và gõ `Brea`.
4. Tắt `Offline`, gõ lại `Brea`.

**Expected Result:**

**Bước 3:**
- Hiển thị thông báo mất kết nối.
- KHÔNG hiện `Không có salon nào khớp “Brea”`.
- KHÔNG hiện lại danh sách Houston cũ như thể đó là kết quả của `Brea`.
**Bước 4:**
- Tìm được salon ở Brea bình thường, KHÔNG cần tải lại trang.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-SRCH-058 — Kết quả tìm kiếm chỉ chứa salon mà tài khoản được phép xem

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Tài khoản `chi Hương` · Director • Admin

**Steps:**

1. Nhờ dev cho biết số salon mà tài khoản `chi Hương` được phép xem.
2. Gõ `a`, đếm số salon trả về và đối chiếu.
3. Lấy ID của một salon KHÔNG thuộc phạm vi được xem (nếu có), gõ đúng ID đó.

**Expected Result:**

**Bước 2:**
- Số salon trả về nằm trong đúng phạm vi tài khoản được phép xem.
**Bước 3:**
- Salon ngoài phạm vi KHÔNG xuất hiện trong kết quả, kể cả khi gõ chính xác ID.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —


### NHÓM C — Ngôn ngữ Tiếng Việt / English

#### TC-CMN-LANG-001 — Menu ngôn ngữ hiển thị đúng 2 lựa chọn và đánh dấu lựa chọn hiện tại

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Bấm nút ngôn ngữ ở góc phải header (đang hiển thị `VI`).
2. Đọc tiêu đề menu và danh sách lựa chọn.
3. Quan sát dấu đánh dấu lựa chọn đang dùng.

**Expected Result:**

**Bước 1:**
- Menu mở ngay dưới nút, KHÔNG che nút giao diện bên cạnh.
**Bước 2:**
- Tiêu đề menu: `Ngôn ngữ`.
- Đúng 2 lựa chọn theo thứ tự: `English`, `Tiếng Việt`.
- KHÔNG có lựa chọn thứ ba, KHÔNG có mục trống.
**Bước 3:**
- `Tiếng Việt` có dấu chấm tròn đánh dấu đang được chọn.
- `English` KHÔNG có dấu đánh dấu.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-LANG-002 — Nhãn nút ngôn ngữ phản ánh đúng ngôn ngữ đang dùng

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Khi đang ở Tiếng Việt, đọc nhãn nút và nhãn trợ năng của nút ngôn ngữ.
2. Đổi sang English.
3. Đọc lại nhãn nút và nhãn trợ năng.

**Expected Result:**

**Bước 1:**
- Nút hiển thị `VI`, nhãn trợ năng là `Ngôn ngữ: Tiếng Việt`.
**Bước 3:**
- Nút hiển thị `EN`, nhãn trợ năng là `Language: English`.
- KHÔNG để nhãn trợ năng còn tiếng Việt khi giao diện đã sang tiếng Anh.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-LANG-003 — Đổi từ Tiếng Việt sang English

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Bấm nút ngôn ngữ, chọn `English`.
2. Quan sát toàn bộ màn hình.
3. Kiểm tra URL và vị trí cuộn trang.

**Expected Result:**

**Bước 1:**
- Giao diện chuyển sang tiếng Anh NGAY, KHÔNG cần tải lại trang (đã xác nhận).
**Bước 2:**
- Sidebar: `To do` / `Work queue` / `Look up` / `Salon profile` / `Requests` / `Packages` / `Settings`.
- Header: placeholder `Search salons by name, city or ID (e.g. #1005)`, nút `EN` và `Light`.
- Tiêu đề trang: `Afternoon, <tên>. <N> things need you, <M> urgent.`
**Bước 3:**
- URL giữ nguyên, KHÔNG thêm tham số ngôn ngữ.
- Vị trí cuộn giữ nguyên, KHÔNG nhảy về đầu trang.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-LANG-004 — Đổi từ English về Tiếng Việt

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Đổi sang `English`.
2. Bấm nút ngôn ngữ, chọn `Tiếng Việt`.
3. Quan sát toàn bộ màn hình.

**Expected Result:**

**Bước 2:**
- Giao diện quay về tiếng Việt ngay.
**Bước 3:**
- Sidebar: `Cần làm` / `Việc cần làm` / `Tra cứu` / `Hồ sơ salon` / `Yêu cầu` / `Gói dịch vụ` / `Cài đặt`.
- KHÔNG còn sót chuỗi tiếng Anh nào trong phần khung ứng dụng (sidebar, header, breadcrumb, nút).
- Dữ liệu nghiệp vụ gốc tiếng Anh do backend trả về (tên lỗi bài đăng, mã `TIMING_INVALID`, mã `R-50`) được giữ nguyên, KHÔNG tính là chuỗi chưa dịch.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-LANG-005 — Đóng menu ngôn ngữ bằng Esc và bằng cách bấm ra ngoài

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Mở menu ngôn ngữ, nhấn `Esc`.
2. Mở lại menu, bấm chuột vào vùng trống giữa trang.
3. Mở lại menu, bấm luôn vào nút giao diện bên cạnh.

**Expected Result:**

**Bước 1:**
- Menu đóng, ngôn ngữ KHÔNG bị đổi.
**Bước 2:**
- Menu đóng, ngôn ngữ KHÔNG bị đổi.
**Bước 3:**
- Menu ngôn ngữ đóng và menu giao diện mở ra.
- KHÔNG để 2 menu cùng mở chồng lên nhau.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-LANG-006 — Chọn lại đúng ngôn ngữ đang dùng

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Đang ở Tiếng Việt, mở menu, chọn `Tiếng Việt`.
2. Quan sát màn hình.
3. Mở DevTools tab Network kiểm tra có request nào được gửi không.

**Expected Result:**

**Bước 1:**
- Menu đóng lại.
**Bước 2:**
- Giao diện giữ nguyên tiếng Việt, KHÔNG nhấp nháy, KHÔNG tải lại trang.
**Bước 3:**
- KHÔNG gửi request lưu lựa chọn vô ích (nếu có lưu lên server).
- KHÔNG mất vị trí cuộn hay trạng thái bộ lọc đang áp.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-LANG-007 — Dịch đầy đủ trên màn Việc cần làm

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Ở `/work-queue`, chụp màn hình bản Tiếng Việt.
2. Đổi sang English, chụp lại.
3. Đối chiếu từng vùng: tiêu đề, 3 chip chủ sở hữu, 4 chip nhóm việc, 5 ô thống kê, khối `Salon của tôi`, chip lỗi bài, tiêu đề các mục.
4. Liệt kê chuỗi chưa dịch.

**Expected Result:**

**Bước 3:**
- Bản tiếng Anh dịch đủ: `All`/`Mine`/`Unassigned`, `Requests`/`Posts`/`Account`, `Urgent`/`Overdue`/`Due today`/`Later`/`Done today`, `MY SALONS`, `Caption`/`Photo`/`Spot check`.
- Số liệu trên các ô thống kê KHÔNG đổi khi đổi ngôn ngữ.
**Bước 4:**
- Danh sách chuỗi chưa dịch phải rỗng ở phần khung ứng dụng.
- Nếu còn chuỗi chưa dịch, ghi rõ từng chuỗi và vị trí; ghi Fail và đính ảnh.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-LANG-008 — Dịch đầy đủ trên màn Hồ sơ salon

**Precondition:**

- Đã đăng nhập bằng tài khoản `chi Hương` - vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang mở hồ sơ salon #3427 (`ID#3 - DEV Nails Spa 123`, #3427 · Brea, CA).

**Test data:**

_Cần bổ sung_

**Steps:**

1. Ở `/salon-profile/whmcs-3427`, ghi lại các nhãn bản Tiếng Việt.
2. Đổi sang English, ghi lại.
3. Đối chiếu: breadcrumb, 3 tab, 4 tiêu đề cột bảng, tên các trường, các nhãn trạng thái, khối bên phải.

**Expected Result:**

**Bước 3:**
- Tương ứng đúng cặp: `Trang chủ/Salon` ↔ `Home/Salons`; `Hồ sơ/Ghi chú/Gói & mức dùng` ↔ `Profile/Notes/Plan & usage`; `Mục/Giá trị/Nguồn · cập nhật/Ai được sửa` ↔ `Field/Value/Source · changed/Who can edit`.
- Các nhãn: `Chưa có hồ sơ` ↔ `No profile yet`; `Chưa có style` ↔ `Style not set`; `Yêu cầu đổi` ↔ `Request change`; `Đã khoá` ↔ `Locked`; `Chưa có` ↔ `Not provided`.
- Khối phải: `Cần xử lý`/`Không có việc cần xử lý`/`Ghi chú nội bộ` ↔ `Needs action`/`Nothing needs action`/`Internal note`.
- KHÔNG còn nhãn nào giữ nguyên tiếng Việt ở bản English.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-LANG-009 — Dịch đầy đủ trên màn Yêu cầu

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Mở `/requests`, ghi lại các nhãn bản Tiếng Việt: tiêu đề, bộ lọc, tiêu đề cột bảng, nhãn trạng thái, nút.
2. Đổi sang English, ghi lại.
3. Đối chiếu từng nhãn.

**Expected Result:**

**Bước 2:**
- Mọi nhãn khung ứng dụng đều có bản tiếng Anh.
**Bước 3:**
- KHÔNG còn chuỗi tiếng Việt nào ở bản English và ngược lại.
- Các nhãn trạng thái request dịch nhất quán với cách dịch ở màn `Việc cần làm` — cùng một trạng thái KHÔNG được dịch thành 2 chữ khác nhau ở 2 màn.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-LANG-010 — Dịch đầy đủ trên màn Gói dịch vụ

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Mở `/packages`, ghi lại các nhãn bản Tiếng Việt.
2. Đổi sang English, ghi lại.
3. Đối chiếu từng nhãn, đặc biệt tên gói và đơn vị tính.

**Expected Result:**

**Bước 2:**
- Mọi nhãn khung ứng dụng đều có bản tiếng Anh.
**Bước 3:**
- Tên gói dịch vụ (dữ liệu nghiệp vụ) giữ nguyên ở cả 2 ngôn ngữ — KHÔNG tự dịch tên gói.
- Đơn vị tính và nhãn mô tả được dịch.
- KHÔNG còn chuỗi chưa dịch.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-LANG-011 — Dịch đầy đủ trên trang 404

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

URL: /khong-ton-tai-abc

**Steps:**

1. Mở `/khong-ton-tai-abc` ở ngôn ngữ Tiếng Việt, đọc nội dung.
2. Đổi sang English trên chính trang đó.
3. Đọc lại nội dung.

**Expected Result:**

**Bước 1:**
- Nội dung: `404` · `Không tìm thấy trang` · `Trang bạn tìm không tồn tại hoặc đã được chuyển đi.` · link `Về trang chủ`.
2. Nút ngôn ngữ vẫn bấm được trên trang 404.
**Bước 3:**
- Nội dung chuyển sang tiếng Anh đầy đủ, link `Về trang chủ` cũng được dịch.
- Số `404` giữ nguyên.
- KHÔNG còn chuỗi tiếng Việt.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-LANG-012 — Dịch đầy đủ trong menu tài khoản và trang Cài đặt

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Mở menu tài khoản, đọc các nhãn bản Tiếng Việt.
2. Mở trang `Cài đặt`, đọc các nhãn.
3. Đổi sang English, đọc lại cả 2 nơi.

**Expected Result:**

**Bước 1:**
- Bản tiếng Việt: `ĐỔI HỒ SƠ`, `Đăng xuất`.
**Bước 3:**
- Bản tiếng Anh: `SWITCH PROFILE`, `Sign out`.
- Tên người dùng và email KHÔNG bị dịch.
- Vai trò `Director • Admin` giữ nguyên hoặc được dịch nhất quán ở cả menu tài khoản và các nơi khác.
- Trang `Cài đặt` ↔ `Settings` dịch đủ mọi nhãn.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-LANG-013 — Tiêu đề tab trình duyệt không cập nhật khi đổi ngôn ngữ

**Precondition:**

- Đã đăng nhập bằng tài khoản `chi Hương` - vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang mở hồ sơ salon https://dev.fastboysocial.dev/salon-profile/whmcs-3427 (`ID#3 - DEV Nails Spa 123`, #3427 · Brea, CA).

**Test data:**

_Cần bổ sung_

**Steps:**

1. Mở `/salon-profile/whmcs-3427` ở ngôn ngữ Tiếng Việt, đọc tiêu đề tab trình duyệt.
2. Đổi sang `English`.
3. Đọc lại tiêu đề tab (không tải lại trang).
4. Nhấn `F5`, đọc lại tiêu đề tab.

**Expected Result:**

1. Tiêu đề tab: `Hồ sơ salon · Social Automation Tool`.
2. Toàn bộ nội dung trang chuyển sang tiếng Anh.
**Bước 3:**
- Kỳ vọng chính: tiêu đề tab phải đổi thành `Salon profile · Social Automation Tool` ngay khi đổi ngôn ngữ.
- Thực tế trên build hiện tại: tiêu đề tab VẪN là `Hồ sơ salon · Social Automation Tool` → ghi Fail.
**Bước 4:**
- Sau khi tải lại trang, tiêu đề tab mới đúng tiếng Anh — chứng tỏ chuỗi có dịch, chỉ là không cập nhật lại khi đổi ngôn ngữ.
- KHÔNG chấp nhận việc người dùng phải tải lại trang mới thấy tiêu đề tab đúng ngôn ngữ.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-LANG-014 — Tiêu đề tab đúng ngôn ngữ khi tải trang mới

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Đặt ngôn ngữ `English`, tải lại trang `/work-queue`, đọc tiêu đề tab.
2. Điều hướng sang `/salon-profile`, `/requests`, `/packages` bằng sidebar, đọc tiêu đề tab mỗi lần.
3. Đổi sang `Tiếng Việt`, tải lại trang, lặp lại bước 2.

**Expected Result:**

1. Tiêu đề tab: `Work queue · Social Automation Tool`.
2. Tiêu đề tab đổi theo từng trang và đúng tiếng Anh ở tất cả các trang.
**Bước 3:**
- Ở tiếng Việt: `Việc cần làm · ...`, `Hồ sơ salon · ...`, `Yêu cầu · ...`, `Gói dịch vụ · ...`.
- KHÔNG trang nào để tiêu đề tab trống hoặc chỉ có `Social Automation Tool`.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-LANG-015 — Thuộc tính ngôn ngữ của trang khớp ngôn ngữ đang chọn

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Mở DevTools → Elements, đọc thuộc tính `lang` của thẻ `<html>` khi đang ở Tiếng Việt.
2. Đổi sang English, đọc lại.
3. Tải lại trang, đọc lại.

**Expected Result:**

1.`lang="vi"`.
2.`lang="en"` ngay sau khi đổi.
**Bước 3:**
- Giữ đúng giá trị sau khi tải lại.
- KHÔNG để `lang` cố định một giá trị, vì trình đọc màn hình và công cụ dịch của trình duyệt dựa vào thuộc tính này.
- Nếu `lang` sai, trình duyệt sẽ gợi ý dịch trang sai ngôn ngữ — ghi Fail, Severity `Trivial`.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-LANG-016 — Thông báo dạng toast hiển thị đúng ngôn ngữ

**Precondition:**

- Đã đăng nhập bằng tài khoản `chi Hương` - vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang mở hồ sơ salon #3427 (`ID#3 - DEV Nails Spa 123`, #3427 · Brea, CA).

**Test data:**

Thao tác sinh toast: lưu `Ghi chú nội bộ`

**Steps:**

1. Ở ngôn ngữ Tiếng Việt, nhập nội dung vào `Ghi chú nội bộ` và bấm `Lưu ghi chú`.
2. Đọc nguyên văn thông báo hiện ra.
3. Đổi sang English, lặp lại thao tác.
4. Đọc lại thông báo.

**Expected Result:**

2. Thông báo bằng tiếng Việt.
**Bước 4:**
- Thông báo bằng tiếng Anh.
- KHÔNG hiển thị chuỗi khoá dịch thô, KHÔNG trộn 2 ngôn ngữ trong cùng một thông báo.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-LANG-017 — Giữ lựa chọn ngôn ngữ sau khi tải lại trang

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Đổi sang `English`.
2. Nhấn `F5`.
3. Quan sát ngôn ngữ sau khi tải lại.
4. Lặp lại với `Tiếng Việt`.

**Expected Result:**

2. Trang tải lại.
**Bước 3:**
- Vẫn là tiếng Anh, nút ngôn ngữ hiển thị `EN`.
- KHÔNG quay về ngôn ngữ mặc định.
4. Với tiếng Việt cũng giữ nguyên sau khi tải lại.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-LANG-018 — Giữ lựa chọn ngôn ngữ khi điều hướng giữa các màn

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Đổi sang `English`.
2. Lần lượt mở `/salon-profile`, `/requests`, `/packages`, `/work-queue` bằng sidebar.
3. Mở một hồ sơ salon từ ô tìm kiếm.
4. Bấm Back 2 lần.

**Expected Result:**

2. Cả 4 màn đều giữ tiếng Anh.
3. Màn hồ sơ salon cũng tiếng Anh.
**Bước 4:**
- Sau khi Back, vẫn tiếng Anh.
- KHÔNG màn nào quay về tiếng Việt giữa chừng.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-LANG-019 — Giữ lựa chọn ngôn ngữ sau khi đăng xuất và đăng nhập lại

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Đổi sang `English`.
2. Đăng xuất.
3. Quan sát ngôn ngữ ở màn đăng nhập.
4. Đăng nhập lại, quan sát ngôn ngữ trong ứng dụng.

**Expected Result:**

**Bước 2:**
- Về màn đăng nhập.
**Bước 3:**
- Ghi nhận ngôn ngữ ở màn đăng nhập: giữ `English` hay quay về mặc định.
**Bước 4:**
- Kỳ vọng chính: sau khi đăng nhập lại, ngôn ngữ vẫn là `English` theo lựa chọn trước đó.
- KHÔNG bắt người dùng chọn lại ngôn ngữ sau mỗi lần đăng nhập

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-LANG-020 — Lựa chọn ngôn ngữ trên máy khác hoặc trình duyệt khác

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Chrome (đang English) và Firefox hoặc Chrome ẩn danh

**Steps:**

1. Đặt ngôn ngữ `English` trên Chrome.
2. Mở Firefox (hoặc cửa sổ ẩn danh), đăng nhập CÙNG tài khoản.
3. Quan sát ngôn ngữ mặc định trên trình duyệt thứ hai.

**Expected Result:**

**Bước 3:**
- Nếu lựa chọn lưu theo TÀI KHOẢN trên server: trình duyệt thứ hai phải tự ở `English`.
- Nếu lưu theo MÁY (localStorage): trình duyệt thứ hai ở ngôn ngữ mặc định — chấp nhận được nhưng phải ghi rõ trong tài liệu.
- Dù theo hướng nào cũng KHÔNG được rơi vào trạng thái nửa vời: một phần giao diện tiếng Anh, một phần tiếng Việt.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-LANG-021 — Lựa chọn ngôn ngữ ở chế độ ẩn danh và khi xoá dữ liệu trình duyệt

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Đặt `English`, đóng tab.
2. Xoá localStorage của domain trong DevTools.
3. Tải lại trang, quan sát ngôn ngữ.
4. Mở cửa sổ ẩn danh, đăng nhập, quan sát ngôn ngữ.

**Expected Result:**

**Bước 3:**
- Nếu lưu ở localStorage: quay về ngôn ngữ mặc định sau khi xoá.
- Trang vẫn hoạt động bình thường, KHÔNG lỗi JavaScript do thiếu khoá lưu trữ.
**Bước 4:**
- Ở chế độ ẩn danh: hiển thị ngôn ngữ mặc định, KHÔNG lỗi.
- KHÔNG hiện màn trắng khi không đọc được localStorage.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-LANG-022 — Ngôn ngữ mặc định của màn đăng nhập

**Precondition:**

- CHƯA đăng nhập: đã xoá cookie, localStorage và sessionStorage của domain dev.fastboysocial.dev.

**Test data:**

_Cần bổ sung_

**Steps:**

1. Xoá sạch localStorage và cookie của domain.
2. Mở `/login`.
3. Đọc ngôn ngữ đang hiển thị và nhãn 2 nút góc phải.
4. Kiểm tra ngôn ngữ hệ thống của máy đang là tiếng Việt.

**Expected Result:**

**Bước 2:**
- Màn đăng nhập hiện ra.
**Bước 3:**
- Thực tế quan sát: mặc định là `English` và `Theme: System`, dù ngôn ngữ máy là tiếng Việt.
**Bước 4:**
- Kỳ vọng chính: cần BA/PO chốt — mặc định nên theo ngôn ngữ trình duyệt của người dùng, hay cố định một ngôn ngữ.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-LANG-023 — Đổi ngôn ngữ ngay trên màn đăng nhập

**Precondition:**

- Đang mở trang login ở trạng thái chưa đăng nhập, ngôn ngữ đang là `Tiếng Việt`.

**Test data:**

_Cần bổ sung_

**Steps:**

1. Ở màn đăng nhập, bấm nút ngôn ngữ, chọn `English`.
2. Đọc toàn bộ chuỗi trên màn hình.
3. Chọn lại `Tiếng Việt`.
4. Nhấn `F5`.

**Expected Result:**

1. Menu mở được trên màn đăng nhập, có đủ 2 lựa chọn.
2. Toàn bộ chuỗi chuyển sang tiếng Anh: `Sign in to Social Automation Tool`, `Enter email`, `Enter your password`, `Show password`, `Sign in`, `Or continue with`, `Sign in with Google`.
3. Quay về tiếng Việt đầy đủ.
**Bước 4:**
- Sau khi tải lại, giữ đúng `Tiếng Việt` vừa chọn.
- KHÔNG quay về `English` mặc định.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-LANG-024 — Ngôn ngữ sau khi đăng nhập lấy theo lựa chọn nào

**Precondition:**

- CHƯA đăng nhập: đã xoá cookie, localStorage và sessionStorage của domain dev.fastboysocial.dev.

**Test data:**

Màn đăng nhập đặt `Tiếng Việt`, tài khoản trước đó dùng `English`

**Steps:**

1. Ở màn đăng nhập, đổi ngôn ngữ sang `Tiếng Việt`.
2. Đăng nhập bằng tài khoản mà lần trước dùng `English`.
3. Quan sát ngôn ngữ ngay sau khi vào ứng dụng.

**Expected Result:**

**Bước 3:**
- Ghi nhận ngôn ngữ thực tế sau khi đăng nhập.
- Kỳ vọng chính: phải có một quy tắc rõ ràng — hoặc ưu tiên lựa chọn vừa chọn ở màn đăng nhập, hoặc ưu tiên lựa chọn đã lưu của tài khoản.
- KHÔNG được đổi ngôn ngữ giữa chừng sau khi trang đã hiển thị (nhấp nháy ngôn ngữ).

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-LANG-025 — Định dạng ngày tháng đổi theo ngôn ngữ

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Ngày trên màn Việc cần làm và Hồ sơ salon

**Steps:**

1. Ở Tiếng Việt, ghi lại các chuỗi ngày: dòng breadcrumb đầu trang, cột ngày của các dòng việc, cột `Nguồn · cập nhật` trên hồ sơ salon.
2. Đổi sang English, ghi lại các chuỗi ngày tương ứng.
3. Đối chiếu từng cặp.

**Expected Result:**

1. Bản tiếng Việt, ví dụ: `VIỆC CẦN LÀM · THỨ 2, 9 THG 11`, `Thứ 3, 3 thg 11`, `tháng 7 23, 2026`.
2. Bản tiếng Anh tương ứng: `WORK QUEUE · MON, NOV 9`, `Tue, Nov 3`, `Jul 23, 2026`.
**Bước 3:**
- Cùng một ngày phải trỏ về CÙNG một mốc thời gian ở 2 ngôn ngữ, KHÔNG lệch ngày.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-LANG-026 — Định dạng số và đơn vị đổi theo ngôn ngữ

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Số trên các ô thống kê và cột số lượng

**Steps:**

1. Ở Tiếng Việt, ghi lại cách hiển thị số lớn (hàng nghìn) và số thập phân nếu có.
2. Đổi sang English, ghi lại.
3. Đối chiếu dấu phân cách hàng nghìn và dấu thập phân.

**Expected Result:**

**Bước 3:**
- Cách hiển thị số phải nhất quán với quy ước đã chốt cho từng ngôn ngữ.
- Cùng một giá trị KHÔNG được hiển thị thành 2 con số khác nhau ở 2 ngôn ngữ (ví dụ `1.234` ở bản này và `1,234` ở bản kia mà lại hiểu thành 1.234 và 1234).
- Số lượng việc trên các ô thống kê giữ nguyên giá trị khi đổi ngôn ngữ.
- Ghi nhận cho BA/PO: chốt quy ước phân cách số cho từng ngôn ngữ nếu hệ thống sẽ hiển thị số tiền.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-LANG-027 — Rà soát chuỗi chưa dịch trên toàn bộ phần dùng chung

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Đặt ngôn ngữ `English`.
2. Rà lần lượt: sidebar, header, menu tài khoản, menu ngôn ngữ, menu giao diện, breadcrumb, trang 404, màn đăng nhập, tooltip `Thêm thông tin`, thông báo tìm kiếm không có kết quả, dòng gợi ý phím tắt.
3. Ghi lại mọi chuỗi còn tiếng Việt hoặc còn hiển thị khoá dịch thô.
4. Đổi sang `Tiếng Việt`, rà lại tương tự tìm chuỗi còn tiếng Anh.

**Expected Result:**

**Bước 3:**
- Danh sách chuỗi chưa dịch ở bản English PHẢI rỗng.
- KHÔNG xuất hiện chuỗi dạng khoá dịch (`common.search.placeholder`, `login.title`...).
**Bước 4:**
- Danh sách chuỗi chưa dịch ở bản Tiếng Việt cũng phải rỗng, trừ nội dung nghiệp vụ do backend trả về.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-LANG-028 — Layout không vỡ khi chuỗi tiếng Anh dài hơn tiếng Việt

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Đặt `English`, quan sát sidebar: mục `Work queue` kèm dòng phụ `50 items waiting`.
2. Quan sát các chip và nút có chữ dài: `Unassigned`, `Spot check`, `Done today`.
3. Thu gọn cửa sổ xuống 1366x768 và 1280x720.
4. Đổi sang Tiếng Việt, so lại ở cùng kích thước.

**Expected Result:**

**Bước 1:**
- Chữ KHÔNG bị cắt mất, KHÔNG tràn ra ngoài khung sidebar.
**Bước 2:**
- Các chip giãn theo độ dài chữ hoặc rút gọn có dấu `…`; KHÔNG để chữ đè lên số đếm bên cạnh.
**Bước 3:**
- Ở 1366x768 và 1280x720: KHÔNG phải cuộn ngang, KHÔNG có nút nào bị đè chồng.
**Bước 4:**
- Bản tiếng Việt cũng không vỡ layout — một số chuỗi tiếng Việt dài hơn tiếng Anh (`Việc cần làm` vs `Work queue`, `Gói dịch vụ` vs `Packages`).

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-LANG-029 — Đổi ngôn ngữ khi đang mở dropdown tìm kiếm

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `Houston`

**Steps:**

1. Gõ `Houston`, đợi ra danh sách kết quả.
2. Không đóng dropdown, bấm nút ngôn ngữ và chọn `English`.
3. Quan sát dropdown, ô nhập và dòng gợi ý phím tắt.

**Expected Result:**

2. Giao diện chuyển sang tiếng Anh.
**Bước 3:**
- Kỳ vọng chính: dropdown đóng gọn lại, hoặc giữ nguyên danh sách kết quả nhưng placeholder và dòng gợi ý phím tắt đã được dịch. Cả hai đều ghi Pass.
- KHÔNG để dropdown treo lơ lửng lệch khỏi ô tìm kiếm.
- KHÔNG mất từ khoá `Houston` đang gõ dở (hoặc nếu mất thì phải đóng dropdown luôn, không để dropdown mở với ô trống).

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —


### NHÓM D — Giao diện Sáng / Tối / Theo hệ thống

#### TC-CMN-THEME-001 — Menu giao diện hiển thị đúng 3 lựa chọn

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Bấm nút giao diện ở góc phải header (đang hiển thị `Sáng`).
2. Đọc tiêu đề menu và danh sách lựa chọn.
3. Quan sát dấu đánh dấu và icon của từng lựa chọn.

**Expected Result:**

1. Menu mở ngay dưới nút.
**Bước 2:**
- Tiêu đề menu: `Giao diện`.
- Đúng 3 lựa chọn theo thứ tự: `Sáng`, `Tối`, `Theo hệ thống`.
- KHÔNG thiếu lựa chọn `Theo hệ thống` (đây là lựa chọn dễ bị bỏ sót khi test).
**Bước 3:**
- `Sáng` có dấu chấm tròn đánh dấu đang chọn; 2 mục còn lại KHÔNG có.
- Mỗi mục có icon riêng (mặt trời / mặt trăng / màn hình).

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-THEME-002 — Nhãn nút giao diện phản ánh đúng chế độ đang dùng

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Ở chế độ `Sáng`, đọc nhãn nút và nhãn trợ năng.
2. Đổi sang `Tối`, đọc lại.
3. Đổi sang `Theo hệ thống`, đọc lại.

**Expected Result:**

1. Nút hiển thị `Sáng`, nhãn trợ năng `Giao diện: Sáng`.
2. Nút hiển thị `Tối`, nhãn trợ năng `Giao diện: Tối`.
**Bước 3:**
- Nút hiển thị `Theo hệ thống`, nhãn trợ năng `Giao diện: Theo hệ thống`.
- KHÔNG hiển thị chế độ thực tế đang áp (Sáng/Tối) thay cho chữ `Theo hệ thống` — người dùng cần biết mình đang chọn chế độ tự động.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-THEME-003 — Đổi từ Sáng sang Tối

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Bấm nút giao diện, chọn `Tối`.
2. Quan sát toàn bộ màn hình.
3. Kiểm tra URL, vị trí cuộn và dữ liệu đang hiển thị.

**Expected Result:**

1. Giao diện chuyển sang nền tối NGAY, KHÔNG cần tải lại trang (đã xác nhận).
**Bước 2:**
- Nền trang, sidebar, header, các thẻ nội dung đều chuyển sang tông tối.
- Chữ chuyển sang màu sáng, đọc được rõ.
**Bước 3:**
- URL giữ nguyên, vị trí cuộn giữ nguyên.
- Số liệu và danh sách việc KHÔNG bị tải lại, KHÔNG đổi nội dung.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-THEME-004 — Đổi từ Tối về Sáng

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Đặt chế độ `Tối`.
2. Bấm nút giao diện, chọn `Sáng`.
3. Quan sát toàn bộ màn hình.

**Expected Result:**

2. Giao diện quay về nền sáng ngay.
**Bước 3:**
- KHÔNG còn vùng nào giữ nền tối sót lại (đặc biệt: dropdown, menu, modal, toast, thanh cuộn).
- Logo quay về bản dành cho nền sáng.
- Chữ quay về màu tối, KHÔNG có chữ trắng trên nền trắng.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-THEME-005 — Chế độ Theo hệ thống khi hệ điều hành đang để Sáng

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Windows: Cài đặt → Cá nhân hoá → Màu sắc → chế độ ứng dụng `Sáng`

**Steps:**

1. Đặt hệ điều hành ở chế độ Sáng.
2. Trong ứng dụng, chọn giao diện `Theo hệ thống`.
3. Quan sát giao diện ứng dụng.

**Expected Result:**

2. Nút hiển thị `Theo hệ thống`.
**Bước 3:**
- Giao diện ứng dụng hiển thị nền SÁNG, khớp hệ điều hành.
- KHÔNG mặc định về Tối.
- Hiển thị giống hệt khi chọn `Sáng` thủ công, KHÔNG có khác biệt màu nào.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-THEME-006 — Chế độ Theo hệ thống khi hệ điều hành đang để Tối

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Windows: chế độ ứng dụng `Tối`

**Steps:**

1. Đặt hệ điều hành ở chế độ Tối.
2. Trong ứng dụng, chọn giao diện `Theo hệ thống`.
3. Quan sát giao diện ứng dụng.
4. Tải lại trang.

**Expected Result:**

2. Nút hiển thị `Theo hệ thống`.
**Bước 3:**
- Giao diện ứng dụng hiển thị nền TỐI, khớp hệ điều hành.
- Hiển thị giống hệt khi chọn `Tối` thủ công.
**Bước 4:**
- Sau khi tải lại vẫn ở nền tối và nút vẫn ghi `Theo hệ thống`.
- KHÔNG nhấp nháy nền sáng trước khi chuyển sang tối.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-THEME-007 — Đổi chế độ hệ điều hành trong lúc ứng dụng đang mở

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Ứng dụng đang chọn `Theo hệ thống`, hệ điều hành đang `Sáng`

**Steps:**

1. Chọn giao diện `Theo hệ thống`, hệ điều hành đang ở chế độ Sáng.
2. Không đóng trình duyệt, đổi hệ điều hành sang chế độ Tối.
3. Quay lại tab ứng dụng, quan sát.
4. Đổi hệ điều hành về Sáng, quan sát lại.

**Expected Result:**

2. Hệ điều hành chuyển sang tối.
**Bước 3:**
- Kỳ vọng chính: ứng dụng tự chuyển sang nền tối NGAY, KHÔNG cần tải lại trang.
- Nếu phải tải lại trang mới đổi → ghi Fail, Severity dự kiến `Minor`.
**Bước 4:**
- Quay về nền sáng ngay khi hệ điều hành đổi lại.
- KHÔNG mất dữ liệu đang hiển thị, KHÔNG mất vị trí cuộn trong cả 2 lần đổi.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-THEME-008 — Logo đổi theo nền sáng và nền tối

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Ở chế độ `Sáng`, chụp vùng logo `Fastboy Marketing` góc trái trên.
2. Đổi sang `Tối`, chụp lại cùng vùng.
3. So 2 ảnh.

**Expected Result:**

1. Logo hiển thị rõ trên nền sáng.
2. Logo đổi sang bản phù hợp nền tối (chữ sáng màu).
**Bước 3:**
- Logo KHÔNG bị chìm vào nền ở cả 2 chế độ.
- KHÔNG có viền trắng hoặc khối nền trắng thừa quanh logo khi ở chế độ tối.
- Logo KHÔNG bị mờ, vỡ hay sai tỷ lệ.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-THEME-009 — Độ tương phản chữ trên nền ở cả 2 chế độ

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Công cụ đo tương phản (DevTools → Inspect → Contrast ratio)

**Steps:**

1. Ở chế độ `Sáng`, đo tương phản của: chữ chính trong bảng, chữ phụ màu xám (`Thấp · không đếm`, `Không có hạn`), nhãn tiêu đề cột, placeholder ô tìm kiếm.
2. Đổi sang `Tối`, đo lại cùng các vị trí.
3. Đối chiếu với ngưỡng 4.5:1 cho chữ thường và 3:1 cho chữ lớn.

**Expected Result:**

1. Chữ chính đạt tối thiểu 4.5:1.
2. Ở chế độ tối cũng đạt tối thiểu 4.5:1 cho chữ thường.
**Bước 3:**
- Ghi lại từng vị trí KHÔNG đạt ngưỡng, kèm giá trị đo và ảnh chụp.
- Chữ phụ màu xám là vị trí rủi ro nhất — nếu dưới 4.5:1 thì ghi Fail, Severity `Minor`.
- KHÔNG có vị trí nào chữ gần như trùng màu nền.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-THEME-010 — Nhãn trạng thái và nhãn mức độ hiển thị đúng ở chế độ Tối

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Các nhãn trên màn Việc cần làm: `Gấp`, `Phải sửa`, `Thấp · không đếm`, `Quá hạn 21 ngày 7 giờ`

**Steps:**

1. Ở chế độ `Sáng`, chụp các dòng việc trong mục `Gấp` và `Quá hạn`.
2. Đổi sang `Tối`, chụp lại.
3. So màu nền và màu chữ của từng nhãn.

**Expected Result:**

2. Nhãn `Gấp` (đỏ) và `Phải sửa` vẫn nổi bật trên nền tối.
**Bước 3:**
- Nhãn KHÔNG giữ nguyên màu nền sáng tạo thành khối chói trên nền tối.
- Chữ trong nhãn KHÔNG bị tối màu đến mức không đọc được.
- Màu cảnh báo vẫn phân biệt được với màu thông thường (đỏ vẫn khác xám).
- Viền các thẻ dòng việc vẫn nhìn thấy, KHÔNG biến mất hoàn toàn vào nền.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-THEME-011 — Khối thống kê và thanh tiến trình ở chế độ Tối

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Khối `Salon của tôi` và 5 ô thống kê trên màn Việc cần làm

**Steps:**

1. Ở chế độ `Sáng`, chụp khối `Salon của tôi` kèm thanh tiến trình 3 màu và 5 ô thống kê.
2. Đổi sang `Tối`, chụp lại.
3. So từng phần tử.

**Expected Result:**

2. Khối giữ được cấu trúc, các con số vẫn đọc rõ.
**Bước 3:**
- Thanh tiến trình vẫn phân biệt được 3 đoạn màu (`Tự đi tiếp` / `Kiểm tra AI đọc` / `Thiếu thông tin`).
- Các chấm chú thích màu vẫn nhìn thấy được trên nền tối.
- Số lớn trên 5 ô thống kê KHÔNG bị chìm vào nền gradient.
- KHÔNG có ô nào giữ nền trắng lạc lõng giữa các ô còn lại.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-THEME-012 — Bảng dữ liệu trên màn Hồ sơ salon ở chế độ Tối

**Precondition:**

- Đã đăng nhập bằng tài khoản `chi Hương` - vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang mở hồ sơ salon #3427 (`ID#3 - DEV Nails Spa 123`, #3427 · Brea, CA).

**Test data:**

_Cần bổ sung_

**Steps:**

1. Ở chế độ `Sáng`, chụp bảng `Thông tin kinh doanh`.
2. Đổi sang `Tối`, chụp lại.
3. So: đường kẻ hàng, màu nền hàng chẵn lẻ, nhãn `Yêu cầu đổi` và `Đã khoá`, nút `Link onboarding` và `CRM`.

**Expected Result:**

**Bước 3:**
- Đường kẻ phân cách hàng vẫn nhìn thấy, KHÔNG biến mất hoàn toàn.
- Nếu có tô nền hàng xen kẽ thì mức chênh màu vẫn phân biệt được.
- Nhãn `Yêu cầu đổi` và `Đã khoá` đổi màu phù hợp nền tối.
- Nút `CRM` và `Link onboarding` vẫn nhìn rõ viền, KHÔNG tàng hình.
- Khối `Ghi chú nội bộ` giữ được viền ô nhập, placeholder vẫn đọc được.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-THEME-013 — Dropdown kết quả tìm kiếm ở chế độ Tối

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `DEV`

**Steps:**

1. Đổi sang chế độ `Tối`.
2. Gõ `DEV` vào ô tìm kiếm.
3. Quan sát dropdown: nền, chữ, dòng đang chọn, vòng tròn chữ cái, dòng gợi ý phím tắt.
4. Dùng `↓` di chuyển và quan sát dòng được tô.

**Expected Result:**

**Bước 3:**
- Dropdown có nền tối, KHÔNG giữ nền trắng chói.
- Tên salon và dòng phụ `#ID · Thành phố` đều đọc được.
- Vòng tròn chữ cái viết tắt vẫn phân biệt được với nền.
- Dòng gợi ý phím tắt (`↑↓`, `Enter`, `Esc`) vẫn nhìn rõ.
**Bước 4:**
- Dòng đang chọn có nền khác biệt rõ với các dòng còn lại.
- KHÔNG để dòng đang chọn trông giống hệt dòng thường.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-THEME-014 — Menu tài khoản và các menu thả xuống ở chế độ Tối

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Đổi sang chế độ `Tối`.
2. Mở menu tài khoản ở góc trái dưới.
3. Mở menu ngôn ngữ và menu giao diện.
4. Quan sát nền, chữ, dấu tick và đường phân cách trong từng menu.

**Expected Result:**

**Bước 2:**
- Panel `ĐỔI HỒ SƠ` có nền tối, tên và email đọc được, dấu tick nhìn rõ.
**Bước 3:**
- Menu `Ngôn ngữ` và `Giao diện` đều nền tối.
**Bước 4:**
- Dấu chấm tròn đánh dấu lựa chọn đang dùng vẫn nhìn thấy.
- Đường phân cách giữa các mục vẫn nhìn thấy.
- KHÔNG menu nào giữ nền sáng.
- KHÔNG có chữ tối trên nền tối ở bất kỳ menu nào.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-THEME-015 — Thông báo toast và hộp thoại ở chế độ Tối

**Precondition:**

- Đã đăng nhập bằng tài khoản `chi Hương` - vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang mở hồ sơ salon #3427 (`ID#3 - DEV Nails Spa 123`, #3427 · Brea, CA).

**Test data:**

Thao tác sinh toast: lưu `Ghi chú nội bộ`

**Steps:**

1. Đổi sang chế độ `Tối`.
2. Nhập nội dung vào `Ghi chú nội bộ` và bấm `Lưu ghi chú`.
3. Quan sát thông báo hiện ra.
4. Mở một hộp thoại xác nhận bất kỳ (nếu có) và quan sát.

**Expected Result:**

**Bước 3:**
- Thông báo có nền phù hợp chế độ tối, chữ đọc được.
- KHÔNG hiện khối trắng chói ở góc màn hình.
**Bước 4:**
- Hộp thoại có nền tối, nút trong hộp thoại nhìn rõ.
- Lớp phủ mờ phía sau hộp thoại vẫn phân biệt được với nền trang.
- KHÔNG có thành phần nào giữ nền sáng.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-THEME-016 — Trang 404 và màn đăng nhập ở chế độ Tối

**Precondition:**

- CHƯA đăng nhập: đã xoá cookie, localStorage và sessionStorage của domain dev.fastboysocial.dev.

**Test data:**

URL: /khong-ton-tai-abc và /login

**Steps:**

1. Mở `/khong-ton-tai-abc`, đổi giao diện sang `Tối`.
2. Quan sát trang 404.
3. Mở `/login`, quan sát màn đăng nhập ở chế độ Tối.
4. Kiểm tra 2 ô nhập và 2 nút.

**Expected Result:**

2. Trang 404 có nền tối, số `404` và chữ đọc được, link `Về trang chủ` nhìn rõ.
3. Màn đăng nhập nền tối, logo đổi bản phù hợp.
**Bước 4:**
- Viền 2 ô nhập nhìn thấy được, placeholder đọc được.
- Nút `Đăng nhập` và `Đăng nhập bằng Google` đều nhìn rõ, KHÔNG tàng hình.
- Dòng điều khoản và 2 link vẫn phân biệt được với chữ thường.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-THEME-017 — Giữ lựa chọn giao diện sau khi tải lại trang

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Đổi sang chế độ `Tối`.
2. Nhấn `F5`.
3. Quan sát giao diện và nhãn nút.
4. Lặp lại với `Theo hệ thống`.

**Expected Result:**

2. Trang tải lại.
**Bước 3:**
- Vẫn ở chế độ Tối, nút vẫn ghi `Tối`.
- KHÔNG quay về `Sáng` mặc định.
4. Với `Theo hệ thống` cũng giữ nguyên lựa chọn sau khi tải lại, nút vẫn ghi `Theo hệ thống`.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-THEME-018 — Giữ lựa chọn giao diện khi điều hướng giữa các màn

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Đổi sang chế độ `Tối`.
2. Lần lượt mở `/salon-profile`, `/requests`, `/packages`, `/work-queue`.
3. Mở một hồ sơ salon từ ô tìm kiếm.
4. Bấm Back 2 lần.

**Expected Result:**

2. Cả 4 màn giữ chế độ Tối.
3. Màn hồ sơ salon cũng ở chế độ Tối.
**Bước 4:**
- Sau khi Back vẫn ở chế độ Tối.
- KHÔNG màn nào nhấp nháy sang nền sáng khi chuyển trang.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-THEME-019 — Giữ lựa chọn giao diện sau khi đăng xuất và đăng nhập lại

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Đổi sang chế độ `Tối`.
2. Đăng xuất.
3. Quan sát chế độ giao diện ở màn đăng nhập.
4. Đăng nhập lại và quan sát.

**Expected Result:**

2. Về màn đăng nhập.
3. Ghi nhận chế độ thực tế: giữ `Tối` hay quay về `Theo hệ thống` mặc định.
**Bước 4:**
- Sau khi đăng nhập lại vẫn ở chế độ `Tối` theo lựa chọn trước đó.
- KHÔNG bắt người dùng chọn lại giao diện sau mỗi lần đăng nhập

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-THEME-020 — Giao diện mặc định của màn đăng nhập

**Precondition:**

- CHƯA đăng nhập: đã xoá cookie, localStorage và sessionStorage của domain dev.fastboysocial.dev.

**Test data:**

_Cần bổ sung_

**Steps:**

1. Xoá sạch localStorage và cookie của domain.
2. Mở `/login`.
3. Đọc nhãn nút giao diện.
4. Đối chiếu với chế độ hiện tại của hệ điều hành.

**Expected Result:**

2. Màn đăng nhập hiện ra.
3. Thực tế quan sát: nút ghi `Theme: System` / `Theo hệ thống`.
**Bước 4:**
- Giao diện thực tế hiển thị khớp chế độ của hệ điều hành.
- KHÔNG mặc định cứng về `Sáng` trong khi nút lại ghi `Theo hệ thống`.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-THEME-021 — Ảnh và avatar hiển thị đúng ở chế độ Tối

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Avatar người dùng và ảnh salon trên dropdown tìm kiếm

**Steps:**

1. Đặt chế độ `Tối`.
2. Quan sát avatar trong menu tài khoản.
3. Gõ `DEV` và quan sát ảnh đại diện của salon `DEV Nails Spa 123` trong kết quả.
4. Quan sát các icon trong sidebar và trên các dòng việc.

**Expected Result:**

2. Avatar hiển thị rõ, KHÔNG có viền trắng thừa quanh ảnh.
3. Ảnh salon hiển thị đúng, KHÔNG bị đảo màu, KHÔNG bị áp bộ lọc làm sai màu ảnh thật.
**Bước 4:**
- Icon đổi sang màu sáng phù hợp nền tối.
- KHÔNG icon nào biến mất vào nền.
- KHÔNG icon nào giữ nguyên màu tối từ chế độ Sáng.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-THEME-022 — Đổi giao diện và đổi ngôn ngữ liên tiếp

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Đổi giao diện sang `Tối`.
2. Đổi ngay ngôn ngữ sang `English`.
3. Đổi giao diện sang `Theo hệ thống`.
4. Đổi ngôn ngữ về `Tiếng Việt`.
5. Tải lại trang.

**Expected Result:**

2. Cả 2 lựa chọn cùng có hiệu lực: nền tối + chữ tiếng Anh.
3. Giao diện đổi theo hệ điều hành, ngôn ngữ vẫn là tiếng Anh.
4. Ngôn ngữ về tiếng Việt, chế độ giao diện vẫn là `Theo hệ thống`.
**Bước 5:**
- Sau khi tải lại, CẢ HAI lựa chọn đều được giữ đúng.
- KHÔNG để lựa chọn này ghi đè mất lựa chọn kia.
- KHÔNG lỗi JavaScript ở Console sau chuỗi thao tác.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-THEME-023 — Đổi giao diện khi đang mở dropdown hoặc menu

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Từ khoá: `Houston`

**Steps:**

1. Gõ `Houston`, đợi ra danh sách kết quả.
2. Không đóng dropdown, mở menu giao diện và chọn `Tối`.
3. Quan sát dropdown kết quả.
4. Mở menu tài khoản rồi đổi giao diện sang `Sáng`.

**Expected Result:**

2. Giao diện chuyển sang tối.
**Bước 3:**
- Dropdown kết quả cũng chuyển sang nền tối, HOẶC đóng gọn lại.
- KHÔNG để dropdown giữ nền trắng trên giao diện tối.
- KHÔNG mất danh sách kết quả đang hiển thị mà vẫn để dropdown mở rỗng.
4. Menu tài khoản cũng đổi theo, KHÔNG giữ nền tối trên giao diện sáng.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —


### NHÓM E — Phân quyền 4 vai trò trên phần dùng chung

#### TC-CMN-PERM-001 — Sidebar của vai trò Director/Admin

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Đăng nhập bằng `chi Hương` (Director • Admin).
2. Liệt kê toàn bộ mục sidebar theo thứ tự từ trên xuống, kèm tên nhóm.
3. Ghi lại mục nào có badge đếm.
4. Đối chiếu với ma trận quyền đã chốt.

**Expected Result:**

**Bước 2:**
- Thực tế quan sát ngày 09/11/2026: nhóm `Cần làm` có `Việc cần làm`; nhóm `Tra cứu` có `Hồ sơ salon`, `Yêu cầu`, `Gói dịch vụ`; dưới cùng có `Cài đặt` và khối tài khoản.
**Bước 3:**
- Chỉ mục `Việc cần làm` có badge đếm (`50 việc đang chờ`).
- KHÔNG mục nào khác có badge.
**Bước 4:**
- Danh sách khớp ma trận quyền của vai trò Director/Admin.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-PERM-002 — Sidebar của vai trò Manager

**Precondition:**

- Đã đăng nhập bằng tài khoản vai trò `Manager` (tài khoản test: [Cần bổ sung]).
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.

**Test data:**

_Cần bổ sung_

**Steps:**

1. Đăng nhập bằng tài khoản vai trò `Manager`.
2. Liệt kê toàn bộ mục sidebar theo thứ tự.
3. Ghi lại mục nào có badge đếm.
4. So với sidebar của Director/Admin ở TC-CMN-PERM-001.

**Expected Result:**

2. Sidebar chỉ hiện các mục mà ma trận quyền cho phép vai trò Manager.
3. Ghi lại mục có badge; so với Director/Admin.
**Bước 4:**
- KHÔNG hiện mục nào vượt quyền Manager.
- KHÔNG hiện mục rồi bấm vào mới báo 403 — mục không có quyền phải ẩn hẳn khỏi sidebar.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-PERM-003 — Sidebar của vai trò AE

**Precondition:**

- Đã đăng nhập bằng tài khoản vai trò `AE` (tài khoản test: [Cần bổ sung]).
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.

**Test data:**

_Cần bổ sung_

**Steps:**

1. Đăng nhập bằng tài khoản vai trò `AE`.
2. Liệt kê toàn bộ mục sidebar theo thứ tự.
3. Ghi lại mục nào có badge đếm.
4. So với Director/Admin và Manager.

**Expected Result:**

2. Sidebar chỉ hiện các mục mà ma trận quyền cho phép vai trò AE.
3. Badge đếm (nếu có) phải đếm đúng số việc của riêng AE, KHÔNG đếm việc của toàn hệ thống.
**Bước 4:**
- KHÔNG hiện mục vượt quyền.
- KHÔNG hiện số liệu của salon mà AE không phụ trách.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-PERM-004 — Sidebar của vai trò Social

**Precondition:**

- Đã đăng nhập bằng tài khoản vai trò `Social` (tài khoản test: [Cần bổ sung]).
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.

**Test data:**

_Cần bổ sung_

**Steps:**

1. Đăng nhập bằng tài khoản vai trò `Social`.
2. Liệt kê toàn bộ mục sidebar theo thứ tự.
3. Ghi lại mục nào có badge đếm.
4. So với 3 vai trò còn lại.

**Expected Result:**

2. Sidebar chỉ hiện các mục mà ma trận quyền cho phép vai trò Social.
3. Badge đếm (nếu có) đếm đúng phạm vi việc của Social.
4. KHÔNG hiện mục vượt quyền.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-PERM-005 — Phạm vi salon mà Director/Admin tìm được

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Cần dev cho biết tổng số salon trong hệ thống

**Steps:**

1. Nhờ dev cho biết tổng số salon đang có trên DEV.
2. Gõ `a` vào ô tìm salon, đếm số kết quả trả về.
3. Gõ ID của một vài salon ngẫu nhiên thuộc các nhóm khác nhau.
4. Mở thử 3 hồ sơ salon khác nhau.

**Expected Result:**

2. Số kết quả nằm trong giới hạn hiển thị của dropdown nhưng phải cho thấy Director/Admin truy cập được toàn bộ salon.
3. Mọi ID hợp lệ đều tìm ra salon tương ứng.
4. Mở được cả 3 hồ sơ salon, KHÔNG báo 403.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-PERM-006 — Phạm vi salon mà Manager tìm được

**Precondition:**

- Đã đăng nhập bằng tài khoản vai trò `Manager` (tài khoản test: [Cần bổ sung]).
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.

**Test data:**

Danh sách salon Manager được phép xem: [Cần bổ sung]

**Steps:**

1. Nhờ dev/PO cho biết danh sách salon mà tài khoản Manager được phép xem.
2. Gõ `a` vào ô tìm salon, ghi lại toàn bộ kết quả.
3. Gõ chính xác ID của một salon NGOÀI phạm vi được phép.

**Expected Result:**

**Bước 2:**
- Danh sách kết quả CHỈ gồm salon trong phạm vi được phép.
**Bước 3:**
- Salon ngoài phạm vi KHÔNG xuất hiện, kể cả khi gõ chính xác ID.
- Hiển thị `Không có salon nào khớp “#<ID>”` thay vì trả về salon đó.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-PERM-007 — Phạm vi salon mà AE tìm được

**Precondition:**

- Đã đăng nhập bằng tài khoản vai trò `AE` (tài khoản test: [Cần bổ sung]).
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.

**Test data:**

Danh sách salon AE phụ trách: [Cần bổ sung]

**Steps:**

1. Nhờ dev/PO cho biết danh sách salon mà tài khoản AE phụ trách.
2. Gõ `a` vào ô tìm salon, ghi lại toàn bộ kết quả.
3. Gõ ID của salon do AE khác phụ trách.

**Expected Result:**

**Bước 2:**
- Kết quả CHỈ gồm salon mà AE này phụ trách.
**Bước 3:**
- Salon của AE khác KHÔNG xuất hiện trong kết quả.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-PERM-008 — Phạm vi salon mà Social tìm được

**Precondition:**

- Đã đăng nhập bằng tài khoản vai trò `Social` (tài khoản test: [Cần bổ sung]).
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.

**Test data:**

Danh sách salon được giao cho Social: [Cần bổ sung]

**Steps:**

1. Nhờ dev/PO cho biết danh sách salon được giao cho tài khoản Social.
2. Gõ `a` vào ô tìm salon, ghi lại toàn bộ kết quả.
3. Gõ ID của salon không được giao.

**Expected Result:**

**Bước 2:**
- Kết quả CHỈ gồm salon được giao.
**Bước 3:**
- Salon không được giao KHÔNG xuất hiện.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-PERM-009 — Truy cập trực tiếp URL Hồ sơ salon bằng vai trò không có quyền

**Precondition:**

- Đã đăng nhập bằng tài khoản vai trò `Social` (tài khoản test: [Cần bổ sung]).
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.

**Test data:**

URL: /salon-profile

**Steps:**

1. Đăng nhập bằng vai trò không có mục `Hồ sơ salon` trên sidebar.
2. Dán trực tiếp `https://dev.fastboysocial.dev/salon-profile` vào thanh địa chỉ.
3. Quan sát màn hình và URL cuối cùng.

**Expected Result:**

**Bước 2:**
- Hệ thống chặn truy cập.
**Bước 3:**
- Hiển thị màn báo không có quyền, hoặc chuyển về trang mặc định của vai trò, kèm thông báo rõ ràng.
- KHÔNG hiển thị dữ liệu salon dù chỉ trong tích tắc trước khi chặn.
- KHÔNG hiện lỗi 403 thô hay màn trắng.
- KHÔNG đăng xuất người dùng ra khỏi hệ thống.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-PERM-010 — Truy cập trực tiếp URL Yêu cầu bằng vai trò không có quyền

**Precondition:**

- Đã đăng nhập bằng tài khoản vai trò `Social` (tài khoản test: [Cần bổ sung]).
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.

**Test data:**

URL: /requests và /requests/92

**Steps:**

1. Đăng nhập bằng vai trò không có quyền xem `Yêu cầu`.
2. Dán trực tiếp `/requests`, quan sát.
3. Dán trực tiếp `/requests/92` (chi tiết một request cụ thể), quan sát.

**Expected Result:**

**Bước 2:**
- Bị chặn, hiển thị thông báo không có quyền.
**Bước 3:**
- Chi tiết request cũng bị chặn.
- KHÔNG hiển thị tiêu đề, nội dung hay tên salon của request dù chỉ trong tích tắc.
- Chặn ở cả URL danh sách và URL chi tiết — KHÔNG chỉ chặn một trong hai.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-PERM-011 — Truy cập trực tiếp URL Gói dịch vụ bằng vai trò không có quyền

**Precondition:**

- Đã đăng nhập bằng tài khoản vai trò `Social` (tài khoản test: [Cần bổ sung]).
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.

**Test data:**

URL: /packages

**Steps:**

1. Đăng nhập bằng vai trò không có quyền xem `Gói dịch vụ`.
2. Dán trực tiếp `/packages`.
3. Quan sát màn hình.

**Expected Result:**

**Bước 2:**
- Bị chặn.
**Bước 3:**
- Hiển thị thông báo không có quyền hoặc chuyển về trang mặc định.
- KHÔNG hiển thị thông tin gói dịch vụ hay giá.
- Cách chặn NHẤT QUÁN với 2 màn ở TC-CMN-PERM-009 và 010 (cùng kiểu thông báo, cùng nơi chuyển hướng tới).

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-PERM-012 — Truy cập trực tiếp URL Việc cần làm bằng vai trò không có quyền

**Precondition:**

- Đã đăng nhập bằng tài khoản vai trò `Manager` (tài khoản test: [Cần bổ sung]).
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.

**Test data:**

URL: /work-queue

**Steps:**

1. Đăng nhập bằng vai trò được xác định là không có queue riêng theo spec.
2. Dán trực tiếp `/work-queue`.
3. Quan sát màn hình và dữ liệu hiển thị.

**Expected Result:**

**Bước 2:**
- Theo ma trận quyền đã chốt: hoặc bị chặn, hoặc được vào với phạm vi dữ liệu riêng của vai trò.
**Bước 3:**
- Nếu được vào: dữ liệu hiển thị PHẢI nằm trong phạm vi của vai trò, KHÔNG phải toàn bộ việc của hệ thống.
- Nếu bị chặn: thông báo rõ ràng, KHÔNG màn trắng.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-PERM-013 — Gọi thẳng API chi tiết salon ngoài phạm vi

**Precondition:**

- Đã đăng nhập bằng tài khoản vai trò `Social` (tài khoản test: [Cần bổ sung]).
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.

**Test data:**

Token vai trò hạn chế · ID salon ngoài phạm vi: [Cần bổ sung]

**Steps:**

1. Lấy token của vai trò hạn chế.
2. Gọi endpoint chi tiết salon với ID NGOÀI phạm vi được phép.
3. Đọc status code và nội dung response.

**Expected Result:**

**Bước 2:**
- API trả về HTTP 403 hoặc 404.
**Bước 3:**
- Response KHÔNG chứa bất kỳ trường dữ liệu nào của salon (tên, địa chỉ, email, điện thoại, mã bưu chính).
- KHÔNG trả 200 kèm dữ liệu.
- KHÔNG trả thông báo lỗi làm lộ việc salon đó có tồn tại hay không, nếu quy tắc bảo mật yêu cầu giấu.
- Nếu trả về dữ liệu → ghi Fail, Severity `Critical`.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-PERM-014 — Menu tài khoản hiển thị đúng tên, vai trò và email của từng vai trò

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Với từng vai trò, mở menu tài khoản ở góc trái dưới.
2. Đọc tên, dòng vai trò và email hiển thị.
3. Đối chiếu với dữ liệu tài khoản trong hệ thống.

**Expected Result:**

**Bước 2:**
- Với `chi Hương`: hiển thị `chi Hương` · `Director • Admin` · `huong_dang@fastboy.net`.
- Với các vai trò khác: hiển thị đúng tên, vai trò và email của tài khoản tương ứng.
**Bước 3:**
- Dòng vai trò khớp chính xác vai trò thật trong hệ thống.
- KHÔNG hiển thị sai vai trò (đây là lỗi dễ dẫn tới hiểu nhầm về quyền).
- KHÔNG hiển thị email của tài khoản khác.
- KHÔNG để trống phần vai trò.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-PERM-015 — Khối tài khoản ở chân sidebar hiển thị đúng khi sidebar thu gọn

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

_Cần bổ sung_

**Steps:**

1. Quan sát khối tài khoản ở chân sidebar khi sidebar mở rộng.
2. Nhấn phím `[` để thu gọn sidebar.
3. Quan sát khối tài khoản khi đã thu gọn.
4. Bấm vào khối tài khoản khi sidebar đang thu gọn.

**Expected Result:**

**Bước 1:**
- Hiển thị avatar, tên và vai trò.
**Bước 3:**
- Khi thu gọn: chỉ còn avatar, tên và vai trò bị ẩn hoặc rút gọn.
- KHÔNG để chữ tràn ra ngoài khung sidebar đã thu gọn.
**Bước 4:**
- Vẫn mở được panel `ĐỔI HỒ SƠ` và nút `Đăng xuất`.
- Panel KHÔNG bị cắt ở mép trái màn hình.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-PERM-016 — Vai trò bị đổi trong lúc người dùng đang đăng nhập

**Precondition:**

- Đã đăng nhập bằng tài khoản vai trò `AE` (tài khoản test: [Cần bổ sung]).
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.

**Test data:**

Cần dev/Admin đổi vai trò tài khoản test trong lúc đang đăng nhập

**Steps:**

1. Đăng nhập bằng tài khoản vai trò `AE`, ghi lại danh sách mục sidebar.
2. Nhờ Admin đổi vai trò tài khoản đó sang `Social` (không đăng xuất phía người dùng).
3. Không tải lại trang, bấm vào một mục sidebar.
4. Tải lại trang và quan sát sidebar.

**Expected Result:**

**Bước 3:**
- Kỳ vọng chính: thao tác bị từ chối hoặc dữ liệu trả về theo quyền MỚI, KHÔNG theo quyền cũ.
- KHÔNG cho tiếp tục đọc dữ liệu của vai trò cũ.
**Bước 4:**
- Sau khi tải lại: sidebar và menu tài khoản hiển thị theo vai trò MỚI.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-PERM-017 — Tài khoản bị vô hiệu hoá trong lúc đang đăng nhập

**Precondition:**

- Đã đăng nhập bằng tài khoản vai trò `AE` (tài khoản test: [Cần bổ sung]).
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.

**Test data:**

Cần dev/Admin vô hiệu hoá tài khoản test trong lúc đang đăng nhập

**Steps:**

1. Đăng nhập bằng tài khoản test.
2. Nhờ Admin vô hiệu hoá tài khoản đó.
3. Không tải lại trang, bấm vào một mục sidebar.
4. Thử đăng nhập lại bằng tài khoản đã bị vô hiệu hoá.

**Expected Result:**

**Bước 3:**
- Thao tác bị từ chối, người dùng bị đưa về màn đăng nhập kèm thông báo rõ ràng.
- KHÔNG cho tiếp tục đọc hay ghi dữ liệu.
**Bước 4:**
- KHÔNG đăng nhập lại được.
- Message nói rõ tài khoản không còn hoạt động, KHÔNG dùng message `sai email hoặc mật khẩu` gây hiểu nhầm.
- KHÔNG hiện lỗi kỹ thuật thô.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

#### TC-CMN-PERM-018 — Đăng nhập bằng tài khoản không thuộc team nội bộ

**Precondition:**

- Đã đăng nhập bằng tài khoản  vai trò `Director • Admin`.
- Ngôn ngữ `Tiếng Việt`, giao diện `Sáng`.
- Đang ở màn `Việc cần làm` (/work-queue)

**Test data:**

Tài khoản khách (không có vai trò nội bộ nào): [Cần bổ sung]

**Steps:**

1. Nhờ dev cung cấp một tài khoản tồn tại trong hệ thống nhưng KHÔNG có vai trò nội bộ.
2. Đăng nhập bằng tài khoản đó.
3. Quan sát màn hình sau khi đăng nhập.
4. Thử dán trực tiếp `/work-queue`.

**Expected Result:**

**Bước 2:**
- Kỳ vọng chính: KHÔNG vào được workspace nội bộ.
**Bước 3:**
- Hiển thị thông báo không có quyền truy cập, hoặc ở lại màn đăng nhập kèm message rõ ràng.
- KHÔNG hiển thị sidebar, KHÔNG hiển thị bất kỳ dữ liệu salon nào.
**Bước 4:**
- Dán URL trực tiếp cũng bị chặn.

> Test Designed: Tuyền Huỳnh · Final Result: — · Executed by: — · Bug ID: — · Note: —

## 5. References

| STT | Reference | Link | Version | Status | Purpose | Note |
|---|---|---|---|---|---|---|
| STT | Reference | Link | Version | Status | Purpose | Note |
| 1 | Link document | Document | SPEC V2.18 |  |  |  |
| 2 | Link tool mới | Social Tool |  |  |  |  |
| 3 | Link task tạo test case | Thực hiện viết test case cho tính năng Login / Lout và các common module |  |  |  |  |

## 6. Open questions

### Q#. Chủ đề

- **Hiện trạng quan sát được:** Hiện trạng quan sát được
- **Câu hỏi cần chốt:** Câu hỏi cần chốt
- **Câu trả lời:** Câu trả lời
- **Test case liên quan:** Test case liên quan
- **Câu trả lời:** _Chưa có — cần BA/PO xác nhận_
- **Test case liên quan:** —

### Q1. Tìm salon theo ID có bắt buộc dấu `#` không

- **Hiện trạng quan sát được:** Gõ `#3427` ra đúng salon. Gõ `3427` (số trần) hiện `Không có salon nào khớp “3427”`. Placeholder có ghi ví dụ `(vd. #1005)`. Đã tái hiện trực tiếp 09/11/2026.
- **Câu hỏi cần chốt:** Người dùng gõ số ID trần (chép từ CRM/Linear thường không kèm `#`) có phải tìm ra salon không? Nếu bắt buộc `#` thì có cần gợi ý ngay trong dropdown khi người dùng gõ toàn số không?
- **Câu trả lời:** _Chưa có — cần BA/PO xác nhận_
- **Test case liên quan:** TC-CMN-SRCH-030, 031, 036

### Q2. Phím Esc xoá luôn từ khoá đã gõ

- **Hiện trạng quan sát được:** Dòng gợi ý trên UI ghi `Esc để đóng`, nhưng thực tế nhấn `Esc` xoá luôn nội dung trong ô và đóng dropdown. Đã tái hiện 09/11/2026.
- **Câu hỏi cần chốt:** Hành vi đúng là gì: `Esc` lần 1 chỉ đóng dropdown và giữ từ khoá, lần 2 mới xoá? Hay giữ nguyên hành vi hiện tại và sửa lại chữ gợi ý trên UI?
- **Câu trả lời:** _Chưa có — cần BA/PO xác nhận_
- **Test case liên quan:** TC-CMN-SRCH-008, 047, 048

### Q3. Mặc định ngôn ngữ và giao diện ở màn đăng nhập

- **Hiện trạng quan sát được:** Khi xoá sạch localStorage, màn `/login` mặc định `English` + `Theo hệ thống`, dù ngôn ngữ máy là tiếng Việt. Đã quan sát 09/11/2026.
- **Câu hỏi cần chốt:** Mặc định nên là `English` cố định, hay theo ngôn ngữ trình duyệt của người dùng? Team nội bộ chủ yếu dùng tiếng Việt nên mặc định English có thể gây khó cho người mới.
- **Câu trả lời:** _Chưa có — cần BA/PO xác nhận_
- **Test case liên quan:** TC-CMN-LANG-022, TC-CMN-THEME-020

### Q4. Thiếu Quên mật khẩu và Ghi nhớ đăng nhập

- **Hiện trạng quan sát được:** Màn đăng nhập không có link `Quên mật khẩu`, không có ô `Ghi nhớ đăng nhập`. Đã quan sát 09/11/2026.
- **Câu hỏi cần chốt:** Người dùng quên mật khẩu thì xử lý thế nào — liên hệ Admin thủ công hay sẽ bổ sung luồng tự phục hồi? Nếu là thủ công thì cần ghi hướng dẫn ngay trên màn đăng nhập hoặc trong tooltip.
- **Câu trả lời:** _Chưa có — cần BA/PO xác nhận_
- **Test case liên quan:** TC-CMN-AUTH-003, 027, 046

### Q5. Nơi lưu lựa chọn ngôn ngữ và giao diện

- **Hiện trạng quan sát được:** Lựa chọn giữ được sau F5 và sau khi điều hướng. Chưa xác định lưu ở localStorage (theo máy) hay theo tài khoản trên server.
- **Câu hỏi cần chốt:** Lựa chọn lưu theo máy hay theo tài khoản? Nếu theo tài khoản thì khi đăng nhập ở máy khác có tự áp dụng không? Khi màn đăng nhập và tài khoản có lựa chọn khác nhau thì ưu tiên cái nào?
- **Câu trả lời:** _Chưa có — cần BA/PO xác nhận_
- **Test case liên quan:** TC-CMN-LANG-019, 020, 024; TC-CMN-THEME-019

### Q6. Chặn đăng nhập sai nhiều lần

- **Câu hỏi cần chốt:** Sau bao nhiêu lần nhập sai mật khẩu thì chặn? Chặn bằng cách nào (khoá theo thời gian / captcha / giới hạn theo IP) và khoá bao lâu?
- **Câu trả lời:** _Chưa có — cần BA/PO xác nhận_
- **Test case liên quan:** TC-CMN-AUTH-021

### Q7. Phạm vi tài khoản được phép đăng nhập bằng Google

- **Câu hỏi cần chốt:** Có giới hạn domain không? Tài khoản Google chưa có trong hệ thống thì bị từ chối hay được tạo tài khoản mới? (Nếu tự tạo tài khoản mới thì đây là rủi ro bảo mật nghiêm trọng.)
- **Câu trả lời:** _Chưa có — cần BA/PO xác nhận_
- **Test case liên quan:** TC-CMN-AUTH-030, 031

### Q8. Số phiên đăng nhập song song và đồng bộ đa tab

- **Câu hỏi cần chốt:** Cho phép đăng nhập đồng thời trên nhiều trình duyệt/thiết bị không? Khi đăng xuất ở một tab, các tab còn lại phải tự về màn đăng nhập ngay hay chỉ bị chặn khi thao tác tiếp?
- **Câu trả lời:** _Chưa có — cần BA/PO xác nhận_
- **Test case liên quan:** TC-CMN-AUTH-040, 044

### Q9. Nội dung nghiệp vụ do backend trả về có cần dịch không

- **Câu trả lời:** _Chưa có — cần BA/PO xác nhận_
- **Test case liên quan:** TC-CMN-LANG-027, 028
