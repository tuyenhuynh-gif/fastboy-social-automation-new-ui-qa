# CLAUDE.md — Quy tắc làm việc cho project Automation Test Social Tool

## 1. Bối cảnh

- **Ứng dụng cần test:** Social Tool — https://dev.fastboysocial.dev/
- **Môi trường:** DEV (chỉ DEV, không bao giờ Production)
- **Công cụ:** Playwright + TypeScript, VS Code, Claude Code
- **Module theo thứ tự ưu tiên:** 1. Login → 2. Work Queue → (các module khác sẽ bổ sung sau)
- **Người dùng:** QA Manual Tester, không phải Developer → mọi giải thích viết **bằng tiếng Việt, dễ hiểu**, tránh thuật ngữ khó mà không giải thích.

## 1.1. Quyết định đã chốt về đăng nhập (2026-11-19)

Trang Login có 2 cách đăng nhập: **email/mật khẩu** và **Google**.

| Phần | Cách làm |
|---|---|
| Đăng nhập email/mật khẩu | Tự động hóa. Tài khoản test DEV đọc từ `.env` |
| Nút Google — phần thuộc Social Tool | Tự động: nút hiển thị, bấm vào chuyển sang `accounts.google.com`. **Không** đăng nhập vào Google |
| Luồng đăng nhập Google đầy đủ | **Test thủ công**, ghi kết quả vào `docs/test-cases/login.md`. Không tự động hóa (Google chặn trình duyệt tự động, dễ khóa tài khoản) |
| Phiên đăng nhập cho module khác (Work Queue…) | Dùng email/mật khẩu, lưu session vào `playwright/.auth/` |

- Requirement/Expected Result cho đăng nhập Google: **chưa xác định** → mọi Expected liên quan đánh dấu `[CẦN XÁC NHẬN]`.
- Không lưu mật khẩu tài khoản Google trong project.

## 2. Phạm vi được phép

- ✅ Chỉ tạo/sửa file trong project Automation Test này (`d:\Project\social-automation`).
- ❌ **Không** sửa source code của website Social Tool.
- ❌ **Không** dùng dữ liệu Production, không trỏ test tới domain Production.
- ❌ **Không** tạo/sửa/xóa dữ liệu thật trên DEV. Test có tác động dữ liệu phải được người dùng duyệt trước và chỉ dùng dữ liệu test riêng.

## 3. Bảo mật thông tin đăng nhập

- **Không hardcode** email, mật khẩu, token, cookie, session trong code, test, comment hay báo cáo.
- Thông tin đăng nhập đọc từ biến môi trường trong file `.env` (file này **không** được commit; phải được khai báo trong `.gitignore`).
- Chỉ commit file mẫu `.env.example` với giá trị rỗng/placeholder.
- File session đăng nhập (`playwright/.auth/`) không được commit.
- Không in mật khẩu/token ra log, screenshot ghi chú hoặc báo cáo.
- ⚠️ Khi test FAIL, Playwright tự lưu `error-context.md` và `trace.zip` trong `test-results/` — **các file này có thể chứa mật khẩu dạng chữ rõ**. Không đọc/in nội dung `error-context.md` ra màn hình; khi cần xem trạng thái trang thì xem ảnh `test-failed-1.png`. Không gửi `test-results/`, `playwright-report/` cho người ngoài; không upload chúng lên CI công khai.

## 3.1. Đặc điểm ứng dụng ảnh hưởng tới automation (đã quan sát 2026-11-19)

- **Mỗi tài khoản chỉ 1 phiên đăng nhập** ("Đăng nhập trên thiết bị mới sẽ đăng xuất thiết bị cũ") → `workers: 1`, không chạy song song; đừng đăng nhập tay bằng tài khoản test khi test đang chạy.
- Phiên lưu ở `localStorage['aisocial.session']` (JSON: `accessToken`, `user`); ngôn ngữ `aisocial.locale` (`vi`/`en`); giao diện `aisocial.theme`. Không dùng cookie.
- Khi xoá sạch storage, ngôn ngữ mặc định là **English** (Open Question Q3).
- Ứng dụng có polling API → **không dùng `waitForLoadState('networkidle')`**.
- Tài khoản test trong `.env` hiển thị `New User Test · Director • Admin`, khác tài khoản trong file test case (`chi Hương`).
  **Quyết định của người dùng (2026-11-19):** Expected về thông tin tài khoản (tên hiển thị, email) lấy theo tài khoản trong `.env` (`TEST_USER_EMAIL`, `TEST_USER_DISPLAY_NAME`), không dùng giá trị trong file test case.
- Case có thể **khoá tài khoản** (vd. TC-CMN-AUTH-020) gắn tag `@lockout`, mặc định KHÔNG chạy. Chỉ chạy riêng, sau cùng, khi người dùng duyệt: `npm run test:lockout`.

## 4. Quy trình làm việc

1. **Phân tích trước, code sau.** Đọc yêu cầu, quan sát UI, liệt kê test case → người dùng xác nhận → mới viết script.
2. **Làm từng nhóm nhỏ.** Mỗi lần chỉ viết một nhóm test nhỏ (ví dụ 3–5 case), không tạo hàng loạt khi chưa được xác nhận.
3. **Trình bày kế hoạch để duyệt** trước khi:
   - thay đổi nhiều file cùng lúc;
   - cài thêm thư viện;
   - chạy test có tác động tới dữ liệu (tạo/sửa/xóa).
4. **Tự chạy test** khi đã được phép (test chỉ đọc/quan sát thì được chạy để kiểm chứng).
5. **Khi test FAIL:** phân tích nguyên nhân và phân loại lỗi (mục 7) **trước** khi sửa script.
6. **Không sửa Expected Result chỉ để test PASS.** Nếu Expected Result có vẻ sai, báo lại cho người dùng quyết định.

## 5. Không tự bịa requirement

- Expected Result phải lấy từ: tài liệu requirement, xác nhận của người dùng, hoặc hành vi đã được người dùng chấp nhận.
- Nếu chưa rõ (ví dụ: nội dung thông báo lỗi, chuyển hướng sang trang nào) → **hỏi người dùng**, hoặc đánh dấu `[CẦN XÁC NHẬN]` trong test case. Không tự đoán rồi viết như sự thật.
- Có thể quan sát hành vi thực tế của trang để gợi ý, nhưng phải ghi rõ "theo quan sát thực tế, chưa được xác nhận là đúng requirement".

## 6. Chuẩn viết test case

Mỗi test case phải có đủ:

| Trường | Mô tả |
|---|---|
| **ID** | Dạng `<MODULE>-<SỐ>`, ví dụ `LOGIN-001`, `WQ-001` (WQ = Work Queue) |
| **Mục tiêu** | Test kiểm tra điều gì |
| **Điều kiện tiên quyết** | Dữ liệu/trạng thái cần có trước |
| **Các bước** | Đánh số từng bước |
| **Expected Result** | Kết quả mong đợi (có nguồn hoặc `[CẦN XÁC NHẬN]`) |
| **Loại** | Positive / Negative / UI / Validation… |
| **Tác động dữ liệu** | Không / Có (mô tả) |

Trong code, ID nằm ở đầu tên test và các bước dùng `test.step()` để báo cáo dễ đọc:

```ts
test('LOGIN-001 - Đăng nhập thành công với tài khoản hợp lệ', async ({ page }) => {
  await test.step('Bước 1: Mở trang Login', async () => { /* ... */ });
  await test.step('Bước 2: Nhập email và mật khẩu hợp lệ', async () => { /* ... */ });
  await test.step('Expected: ...', async () => { /* expect(...) */ });
});
```

Danh sách test case dạng tài liệu lưu tại `docs/test-cases/<module>.md`.

## 7. Phân loại lỗi khi test FAIL

| Loại lỗi | Dấu hiệu | Hành động |
|---|---|---|
| **Lỗi ứng dụng (Bug)** | Ứng dụng hoạt động khác Expected Result đã xác nhận | Báo cáo bug kèm bằng chứng. **Không** sửa script cho PASS |
| **Lỗi script** | Locator sai/đổi, thiếu chờ đợi, logic test sai | Sửa script, chạy lại, ghi rõ đã sửa gì |
| **Lỗi môi trường** | DEV down, timeout mạng, lỗi 5xx, SSL, trình duyệt chưa cài | Ghi nhận, chạy lại sau, không sửa script/Expected |
| **Lỗi dữ liệu** | Tài khoản test bị khóa/hết hạn, thiếu dữ liệu, sai `.env` | Báo người dùng chuẩn bị lại dữ liệu |

Nếu chưa đủ bằng chứng để phân loại → ghi "**Chưa xác định**" và nêu cần kiểm tra thêm gì.

## 8. Báo cáo sau khi chạy test

Mỗi lần chạy, báo cáo theo mẫu:

```
Lệnh chạy: npx playwright test ...
Tổng: X | PASS: X | FAIL: X | SKIP: X

| ID | Tên | Kết quả | Loại lỗi | Nguyên nhân | Bằng chứng |
```

- **Bằng chứng:** đường dẫn screenshot / video / trace trong `test-results/`, đoạn thông báo lỗi chính, HTML report (`npx playwright show-report`).
- Nói rõ phần nào đã kiểm chứng, phần nào là phỏng đoán.

## 9. Chuẩn code (dễ bảo trì)

### Cấu trúc thư mục

```
social-automation/
├── CLAUDE.md
├── .env.example            # mẫu biến môi trường (không chứa giá trị thật)
├── .env                    # giá trị thật — KHÔNG commit
├── playwright.config.ts
├── docs/test-cases/        # tài liệu test case (login.md, work-queue.md)
├── pages/                  # Page Object: locator + thao tác của từng trang
│   ├── LoginPage.ts
│   └── WorkQueuePage.ts
├── fixtures/               # fixture dùng chung (vd: trang đã đăng nhập)
├── utils/                  # hàm tiện ích, đọc biến môi trường
├── tests/
│   ├── auth.setup.ts       # đăng nhập 1 lần, lưu session cho module khác
│   ├── login/              # login.spec.ts
│   └── work-queue/         # work-queue.spec.ts
└── playwright/.auth/       # session đã lưu — KHÔNG commit
```

### Page Object Model (POM)

- Locator và thao tác đặt trong `pages/`; file test chỉ gọi hàm và kiểm tra kết quả.
- Khi UI đổi, chỉ cần sửa 1 chỗ trong Page Object.

### Thứ tự ưu tiên locator (ổn định → kém ổn định)

Social Tool có `data-testid` trên hầu hết phần tử và **đa ngôn ngữ (VI/EN)** → chữ hiển thị thay đổi theo ngôn ngữ, nên:

1. `getByTestId()` — ưu tiên số 1 (không đổi theo ngôn ngữ)
2. `getByRole()` (kèm `name`) — khi phần tử không có testid
3. `getByLabel()` / `getByPlaceholder()`
4. `getByText()` — chỉ khi test case chính là kiểm tra nội dung chữ
5. CSS/XPath — **chỉ dùng khi không còn cách khác**, phải ghi comment lý do

Không dùng locator phụ thuộc vị trí (`nth-child`, `:nth(3)`), class sinh tự động (`css-1x2y3z`), hoặc XPath tuyệt đối.

### Chờ đợi

- Dùng auto-wait và web-first assertion (`await expect(locator).toBeVisible()`).
- **Không** dùng `page.waitForTimeout()` cố định, trừ khi có lý do và ghi comment.

### Khác

- `baseURL` đặt trong `playwright.config.ts` (đọc từ `.env`), trong test dùng `page.goto('/')`.
- `playwright.config.ts` có chốt an toàn: nếu `BASE_URL` không bắt đầu bằng `dev.` thì dừng chạy. **Không gỡ bỏ chốt này.**
- Test độc lập với nhau, không phụ thuộc thứ tự chạy.
- Đặt tên biến/hàm bằng tiếng Anh; comment và tên test có thể tiếng Việt.

## 10. Lệnh thường dùng

```bash
npx playwright test                         # chạy tất cả
npx playwright test tests/login             # chạy riêng module Login
npx playwright test -g "LOGIN-001"          # chạy 1 test theo ID
npx playwright test --headed                # chạy có hiện trình duyệt
npx playwright test --ui                    # chế độ UI để debug
npx playwright show-report                  # mở báo cáo HTML
npx playwright codegen https://dev.fastboysocial.dev/   # ghi thao tác để tham khảo locator
```
