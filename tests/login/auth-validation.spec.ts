import { test, expect, type Locator, type Page } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { getTestUser, requireDisplayName } from '../../utils/env';
import {
  STORAGE_KEYS,
  VIETNAMESE_CHARS,
  captureEvidence,
  isLoginRequest,
  openLoginVietnamese,
  trackLoginRequests,
  trackPageErrors,
} from '../../utils/helpers';

/**
 * Nguồn test case: test-cases/[v1.0] Test case Login và Hệ thống.md — NHÓM A (validation & bảo mật form).
 * Lưu ý: dữ liệu email trong các case lỗi định dạng/không tồn tại lấy nguyên văn từ test case
 * (không phải thông tin đăng nhập thật). Tài khoản thật luôn đọc từ .env.
 */

/** Chờ cố định để chứng minh KHÔNG có request nào được gửi (không thể dùng auto-wait cho "không xảy ra"). */
const NO_REQUEST_WINDOW_MS = 1500;

/** Thông báo lỗi nằm ngay dưới ô nhập (top của lỗi >= bottom của ô, cách không quá 40px). */
async function expectErrorRightBelow(error: Locator, input: Locator, name: string) {
  const e = await error.boundingBox();
  const i = await input.boundingBox();
  expect.soft(e && i ? e.y >= i.y + i.height - 1 && e.y - (i.y + i.height) <= 40 : false, `Lỗi ${name} nằm ngay dưới ô`).toBe(true);
}

/** Lấy message lỗi chung sau khi submit sai tài khoản. */
async function submitAndReadFormError(page: Page, login: LoginPage): Promise<string> {
  const resp = page.waitForResponse((r) => isLoginRequest(r.request()));
  await login.submitButton.click();
  await resp;
  await expect(login.formError).toBeVisible();
  return (await login.formError.innerText()).trim();
}

const TECHNICAL_INFO = /sql|select\s|table|exception|stack|trace|query|errno|\b(4|5)\d\d\b|mixpost|\/v1\//i;

test.describe('Login — Validation & bảo mật form', () => {
  test('TC-CMN-AUTH-005 — Bấm Đăng nhập khi cả 2 ô đều để trống', async ({ page }) => {
    const login = await openLoginVietnamese(page);
    const loginRequests = trackLoginRequests(page);
    const urlBefore = page.url();

    await test.step('Bước 1: Không nhập gì, bấm nút Đăng nhập', async () => {
      await login.submitButton.click();
      await page.waitForTimeout(NO_REQUEST_WINDOW_MS);
      // Expected: KHÔNG gửi request đăng nhập; KHÔNG chuyển trang
      expect.soft(loginRequests.length, 'Số request login').toBe(0);
      expect.soft(page.url(), 'Không chuyển trang').toBe(urlBefore);
    });

    await test.step('Bước 2: Quan sát thông báo hiển thị', async () => {
      // Expected: thông báo bắt buộc cho CẢ HAI ô, đặt ngay dưới từng ô
      await expect.soft(login.emailError).toBeVisible();
      await expect.soft(login.passwordError).toBeVisible();
      await expectErrorRightBelow(login.emailError, login.emailInput, 'Email');
      await expectErrorRightBelow(login.passwordError, login.passwordInput, 'Mật khẩu');
      // Expected: viết bằng tiếng Việt, KHÔNG phải chuỗi tiếng Anh mặc định của trình duyệt
      for (const [err, input] of [
        [login.emailError, login.emailInput],
        [login.passwordError, login.passwordInput],
      ] as const) {
        const text = (await err.innerText()).trim();
        const browserMsg = await input.evaluate((e) => (e as HTMLInputElement).validationMessage);
        test.info().annotations.push({ type: 'Message', description: text });
        expect.soft(text).toMatch(VIETNAMESE_CHARS);
        if (browserMsg) expect.soft(text).not.toBe(browserMsg);
      }
    });
  });

  test('TC-CMN-AUTH-006 — Nhập email hợp lệ nhưng bỏ trống mật khẩu', async ({ page }) => {
    const login = await openLoginVietnamese(page);
    const loginRequests = trackLoginRequests(page);
    const email = 'tuyen_huynh@fastboy.net'; // Test data của test case

    await test.step('Bước 1: Nhập email hợp lệ vào ô Email', async () => {
      await login.emailInput.fill(email);
      // Expected: Ô Email nhận đúng giá trị, KHÔNG bị cắt ký tự
      await expect.soft(login.emailInput).toHaveValue(email);
    });

    await test.step('Bước 2: Để trống ô Mật khẩu', async () => {
      await expect(login.passwordInput).toHaveValue('');
    });

    await test.step('Bước 3: Bấm Đăng nhập', async () => {
      await login.submitButton.click();
      await page.waitForTimeout(NO_REQUEST_WINDOW_MS);
      // Expected: Chỉ ô Mật khẩu báo lỗi; ô Email KHÔNG báo lỗi
      await expect.soft(login.passwordError).toBeVisible();
      await expect.soft(login.emailError).toBeHidden();
      // Expected: KHÔNG gửi request; KHÔNG xoá email
      expect.soft(loginRequests.length, 'Số request login').toBe(0);
      await expect.soft(login.emailInput).toHaveValue(email);
    });
  });

  test('TC-CMN-AUTH-007 — Nhập mật khẩu nhưng bỏ trống email', async ({ page }) => {
    const login = await openLoginVietnamese(page);
    const loginRequests = trackLoginRequests(page);
    const anyPassword = 'AnyPass#01';

    await test.step('Bước 1–2: Để trống Email, nhập chuỗi bất kỳ vào Mật khẩu', async () => {
      await login.passwordInput.fill(anyPassword);
    });

    await test.step('Bước 3: Bấm Đăng nhập', async () => {
      await login.submitButton.click();
      await page.waitForTimeout(NO_REQUEST_WINDOW_MS);
      // Expected: Chỉ ô Email báo lỗi bắt buộc
      await expect.soft(login.emailError).toBeVisible();
      await expect.soft(login.passwordError).toBeHidden();
      // Expected: KHÔNG gửi request; giữ nguyên giá trị mật khẩu
      expect.soft(loginRequests.length, 'Số request login').toBe(0);
      await expect.soft(login.passwordInput).toHaveValue(anyPassword);
    });
  });

  test('TC-CMN-AUTH-008 — Email sai định dạng — thiếu ký tự @', async ({ page }) => {
    const login = await openLoginVietnamese(page);
    const loginRequests = trackLoginRequests(page);
    const urlBefore = page.url();

    await test.step('Bước 1–2: Nhập huongdangfastboy.net và mật khẩu bất kỳ', async () => {
      await login.fillCredentials('huongdangfastboy.net', 'AnyPass#01');
    });

    await test.step('Bước 3: Bấm Đăng nhập', async () => {
      await login.submitButton.click();
      await page.waitForTimeout(NO_REQUEST_WINDOW_MS);
      // Expected: lỗi sai định dạng email ngay dưới ô Email
      await expect.soft(login.emailError).toBeVisible();
      await expectErrorRightBelow(login.emailError, login.emailInput, 'Email');
      test.info().annotations.push({ type: 'Message', description: await login.emailError.innerText().catch(() => '') });
      // Expected: KHÔNG gửi request; KHÔNG chuyển trang; KHÔNG lỗi chung chung
      expect.soft(loginRequests.length, 'Số request login').toBe(0);
      expect.soft(page.url()).toBe(urlBefore);
      await expect.soft(login.formError).toBeHidden();
      await expect.soft(page.getByText('Có lỗi xảy ra')).toHaveCount(0);
    });
  });

  test('TC-CMN-AUTH-009 — Email sai định dạng — thiếu phần domain sau @', async ({ page }) => {
    const login = await openLoginVietnamese(page);
    const loginRequests = trackLoginRequests(page);
    let msgStep3 = '';

    await test.step('Bước 1–3: Nhập huong_dang@ + mật khẩu bất kỳ, bấm Đăng nhập', async () => {
      await login.fillCredentials('huong_dang@', 'AnyPass#01');
      await login.submitButton.click();
      await page.waitForTimeout(NO_REQUEST_WINDOW_MS);
      // Expected: Báo lỗi sai định dạng, KHÔNG gửi request
      await expect.soft(login.emailError).toBeVisible();
      expect.soft(loginRequests.length, 'Số request login').toBe(0);
      msgStep3 = (await login.emailError.innerText().catch(() => '')).trim();
      test.info().annotations.push({ type: 'Message bước 3', description: msgStep3 });
    });

    await test.step('Bước 4: Lặp lại với huong_dang@fastboy (thiếu phần mở rộng)', async () => {
      await login.emailInput.fill('huong_dang@fastboy');
      await login.submitButton.click();
      // Expected: Hiển thị rõ ràng thông báo lỗi
      // (thông báo có thể nằm dưới ô Email hoặc là lỗi chung của form — chấp nhận cả hai)
      const anyError = login.emailError.or(login.formError);
      await expect.soft(anyError).toBeVisible({ timeout: 10_000 });
      await captureEvidence(page, 'buoc4-message-huong_dang@fastboy');
      const msgStep4 = (await anyError.first().innerText().catch(() => '')).trim();
      test.info().annotations.push({ type: 'Message bước 4', description: msgStep4 });
      expect.soft(msgStep4, 'Thông báo lỗi không được rỗng').not.toBe('');
    });
  });

  test('TC-CMN-AUTH-010 — Email có khoảng trắng ở đầu và cuối', async ({ page }) => {
    const { email, password } = getTestUser();
    const login = await openLoginVietnamese(page);

    await test.step('Bước 1–2: Dán email kèm 2 khoảng trắng đầu/cuối, nhập mật khẩu đúng', async () => {
      await login.fillCredentials(`  ${email}  `, password);
    });

    await test.step('Bước 3: Bấm Đăng nhập', async () => {
      await login.submitButton.click();
      // Expected: tự cắt khoảng trắng thừa và đăng nhập THÀNH CÔNG
      await expect(page).not.toHaveURL(/\/login/, { timeout: 15_000 });
      await expect(page.getByTestId('shell-sidebar')).toBeVisible();
      // Expected: KHÔNG lưu khoảng trắng vào phiên đăng nhập
      const session = await page.evaluate((k) => localStorage.getItem(k) ?? '', STORAGE_KEYS.session);
      expect.soft(session.includes(` ${email}`) || session.includes(`${email} `), 'Phiên chứa email có khoảng trắng').toBe(false);
    });
  });

  test('TC-CMN-AUTH-011 — Email nhập bằng chữ HOA', async ({ page }) => {
    const { email, password } = getTestUser();
    const login = await openLoginVietnamese(page);

    await test.step('Bước 1–2: Nhập email toàn chữ HOA, mật khẩu đúng', async () => {
      await login.fillCredentials(email.toUpperCase(), password);
    });

    await test.step('Bước 3: Bấm Đăng nhập', async () => {
      await login.submitButton.click();
      // Expected: Đăng nhập THÀNH CÔNG — email không phân biệt hoa thường
      await expect(page).not.toHaveURL(/\/login/, { timeout: 15_000 });
      const account = page.getByTestId('shell-sidebar-account-button');
      await expect(account).toBeVisible();
      // Expected: Tên hiển thị trên menu tài khoản vẫn đúng, KHÔNG hiển thị email viết HOA
      // (TC ghi "chi Hương"; theo quyết định người dùng 2026-11-19 dùng tên của tài khoản trong .env)
      await expect.soft(page.getByTestId('shell-sidebar-account-name')).toHaveText(requireDisplayName());
      await account.click();
      await expect.soft(page.getByTestId('shell-sidebar-account-current')).not.toContainText(email.toUpperCase());
    });
  });

  test('TC-CMN-AUTH-012 — Email đúng định dạng nhưng không tồn tại trong hệ thống', async ({ page }) => {
    const login = await openLoginVietnamese(page);
    let msgNotExist = '';

    await test.step('Bước 1–3: Nhập email không tồn tại + mật khẩu bất kỳ, bấm Đăng nhập', async () => {
      await login.fillCredentials('khong_ton_tai_qc@fastboy.net', 'AnyPass#01');
      msgNotExist = await submitAndReadFormError(page, login);
      await captureEvidence(page, 'message-email-khong-ton-tai');
      // Expected: KHÔNG đăng nhập được, ở lại màn đăng nhập
      await expect.soft(page).toHaveURL(/\/login/);
      await expect.soft(page.getByTestId('shell-sidebar')).toHaveCount(0);
    });

    await test.step('Bước 4: Đọc nguyên văn message lỗi', async () => {
      // Expected: Message KHÔNG tiết lộ email có tồn tại hay không.
      // Theo quyết định người dùng (2026-11-20): automation chỉ GHI LẠI nguyên văn message
      // (annotation + ảnh bằng chứng) để người xem tự đánh giá, không tự động kết luận phần này.
      test.info().annotations.push({
        type: 'CẦN ĐÁNH GIÁ THỦ CÔNG — message có tiết lộ email tồn tại không?',
        description: msgNotExist,
      });
      // Expected: KHÔNG hiển thị thông tin kỹ thuật
      expect.soft(msgNotExist).not.toMatch(TECHNICAL_INFO);
    });
  });

  test('TC-CMN-AUTH-013 — Email đúng nhưng mật khẩu sai', async ({ page }) => {
    const { email } = getTestUser();
    const login = await openLoginVietnamese(page);
    let msg = '';

    await test.step('Bước 1–2: Nhập email đúng, mật khẩu sai, bấm Đăng nhập', async () => {
      await login.fillCredentials(email, 'WrongPass#013');
      msg = await submitAndReadFormError(page, login);
      // Expected: KHÔNG đăng nhập được, KHÔNG chuyển trang
      await expect.soft(page).toHaveURL(/\/login/);
      await expect.soft(page.getByTestId('shell-sidebar')).toHaveCount(0);
    });

    await test.step('Bước 3: Đọc nguyên văn message lỗi, so với TC-CMN-AUTH-012', async () => {
      test.info().annotations.push({ type: 'Message', description: msg });
      // Expected: Hiển thị message thông báo lỗi sai password
      // (TC không quy định ngôn ngữ của message ở bước này → chấp nhận "mật khẩu" hoặc "password")
      expect.soft(msg, 'Message phải nói về sai mật khẩu').toMatch(/mật khẩu|password/i);
    });

    await test.step('Bước 4: Kiểm tra ô mật khẩu sau khi báo lỗi', async () => {
      // Expected: Email KHÔNG bị xoá
      await expect.soft(login.emailInput).toHaveValue(email);
      // Expected: Ô mật khẩu xoá trắng hoặc giữ nguyên NHẤT QUÁN — thử thêm 1 lần để so sánh
      const firstCleared = (await login.passwordInput.inputValue()) === '';
      await login.passwordInput.fill('WrongPass#013b');
      await submitAndReadFormError(page, login);
      const secondCleared = (await login.passwordInput.inputValue()) === '';
      test.info().annotations.push({ type: 'Ô mật khẩu sau lỗi', description: `lần 1: ${firstCleared ? 'xoá' : 'giữ'}, lần 2: ${secondCleared ? 'xoá' : 'giữ'}` });
      expect.soft(secondCleared, 'Quy tắc xoá/giữ mật khẩu nhất quán').toBe(firstCleared);
    });
  });

  test('TC-CMN-AUTH-017 — Mật khẩu không bị ghi ra log hay hiển thị ở nơi khác', async ({ page }) => {
    const password = 'QcTest#2026'; // Test data của test case (mật khẩu giả, dễ nhận biết)
    const login = await openLoginVietnamese(page);
    const consoleLines: string[] = [];

    await test.step('Bước 1: Theo dõi Console và Network', async () => {
      page.on('console', (m) => consoleLines.push(m.text()));
    });

    let request: import('@playwright/test').Request | undefined;
    let responseBody = '';
    await test.step('Bước 2: Nhập email và mật khẩu, bấm Đăng nhập', async () => {
      // Email: dùng email không tồn tại của TC-012 để không làm tăng số lần sai của tài khoản test
      await login.fillCredentials('khong_ton_tai_qc@fastboy.net', password);
      const respPromise = page.waitForResponse((r) => isLoginRequest(r.request()));
      await login.submitButton.click();
      const resp = await respPromise;
      request = resp.request();
      responseBody = await resp.text();
      await expect(login.formError).toBeVisible();
    });

    await test.step('Bước 3: Rà toàn bộ log ở Console', async () => {
      // Expected: Console KHÔNG in ra mật khẩu dưới bất kỳ dạng nào
      const leaked = consoleLines.filter((l) => l.includes(password) || l.includes(encodeURIComponent(password)));
      expect.soft(leaked, 'Dòng console chứa mật khẩu').toEqual([]);
    });

    await test.step('Bước 4: Rà request đăng nhập: URL, query string, response', async () => {
      const r = request!;
      // Expected: Mật khẩu chỉ nằm trong body của request POST qua HTTPS
      expect.soft(r.method()).toBe('POST');
      expect.soft(r.url().startsWith('https://')).toBe(true);
      expect.soft(r.postData() ?? '', 'Body chứa mật khẩu').toContain(password);
      // Expected: KHÔNG xuất hiện trong URL hay query string
      expect.soft(r.url().includes(password) || r.url().includes(encodeURIComponent(password))).toBe(false);
      // Expected: Response KHÔNG trả lại mật khẩu
      expect.soft(responseBody.includes(password), 'Response chứa mật khẩu').toBe(false);
      // Expected: localStorage/sessionStorage KHÔNG lưu mật khẩu
      const storage = await page.evaluate(() => JSON.stringify({ ...localStorage }) + JSON.stringify({ ...sessionStorage }));
      expect.soft(storage.includes(password), 'Storage chứa mật khẩu').toBe(false);
    });
  });

  test('TC-CMN-AUTH-021 — Nhập ký tự đặc biệt và chuỗi dạng câu lệnh vào ô Email', async ({ page }) => {
    const login = await openLoginVietnamese(page);
    const pageErrors = trackPageErrors(page);
    const dialogs: string[] = [];
    page.on('dialog', async (d) => {
      dialogs.push(d.message());
      await d.dismiss();
    });
    const serverErrors: string[] = [];
    page.on('response', (r) => {
      if (r.status() >= 500) serverErrors.push(`${r.status()} ${r.url()}`);
    });

    await test.step("Bước 1: Nhập ' OR 1=1 -- vào ô Email, mật khẩu bất kỳ, bấm Đăng nhập", async () => {
      await login.fillCredentials("' OR 1=1 --", 'AnyPass#01');
      await login.submitButton.click();
      // Expected: Báo lỗi sai định dạng email hoặc sai tài khoản; KHÔNG đăng nhập được
      await expect.soft(login.emailError.or(login.formError)).toBeVisible();
      await expect.soft(page).toHaveURL(/\/login/);
      // Expected: KHÔNG lỗi 500, KHÔNG lộ thông tin cơ sở dữ liệu
      expect.soft(serverErrors).toEqual([]);
      expect.soft(await page.locator('main').innerText()).not.toMatch(/sql|database|syntax|query/i);
    });

    await test.step('Bước 2: Nhập <script>alert(1)</script> vào ô Email, bấm Đăng nhập', async () => {
      await login.emailInput.fill('<script>alert(1)</script>');
      await login.submitButton.click();
      await expect.soft(login.emailError.or(login.formError)).toBeVisible();
      // Expected: KHÔNG xuất hiện hộp thoại alert, KHÔNG thực thi mã
      expect.soft(dialogs, 'Hộp thoại alert').toEqual([]);
      // Expected: nếu có hiển thị lại thì là văn bản thuần (không có thẻ <script> được chèn vào trang)
      const injected = await page.evaluate(() =>
        [...document.querySelectorAll('script')].some((s) => s.textContent?.includes('alert(1)')),
      );
      expect.soft(injected, 'Thẻ script bị chèn vào DOM').toBe(false);
    });

    await test.step('Bước 3: Quan sát màn hình và Console', async () => {
      // Expected: Console KHÔNG có lỗi chưa bắt (uncaught)
      expect.soft(pageErrors.map((e) => e.message)).toEqual([]);
    });
  });
});
