import { test, expect } from '@playwright/test';
import { AppShell } from '../../pages/AppShell';
import { getTestUser, requireDisplayName } from '../../utils/env';
import {
  VIETNAMESE_CHARS,
  captureEvidence,
  isLoginRequest,
  openLoginVietnamese,
  presetVietnamese,
  trackLoginRequests,
  trackPageErrors,
} from '../../utils/helpers';
import { LoginPage } from '../../pages/LoginPage';

/**
 * Nguồn test case: test-cases/SAT_TestCase_Login_Common_v1.0.md — NHÓM A (luồng đăng nhập).
 */

test.describe('Login — Luồng đăng nhập', () => {
  test('TC-CMN-AUTH-014 — Đăng nhập thành công bằng email và mật khẩu đúng', async ({ page }) => {
    const { email, password } = getTestUser();
    const login = await openLoginVietnamese(page);
    const shell = new AppShell(page);
    const badResponses: string[] = [];
    page.on('response', (r) => {
      if (r.status() === 403 || r.status() >= 500) badResponses.push(`${r.status()} ${r.url()}`);
    });

    await test.step('Bước 1: Nhập email và mật khẩu đúng', async () => {
      await login.fillCredentials(email, password);
    });

    await test.step('Bước 2: Bấm Đăng nhập', async () => {
      const start = Date.now();
      await login.submitButton.click();
      await page.waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 15_000 });
      const urlChangedAt = Date.now();
      await expect(shell.sidebar).toBeVisible();
      const contentAt = Date.now();
      test.info().annotations.push({ type: 'Thời gian', description: `Đăng nhập: ${urlChangedAt - start}ms; từ đổi URL tới khi có nội dung: ${contentAt - urlChangedAt}ms` });
      // Expected: Đăng nhập thành công trong vòng 5 giây
      expect.soft(contentAt - start, 'Thời gian đăng nhập (ms)').toBeLessThanOrEqual(5000);
      // Expected: KHÔNG màn trắng quá 1 giây (đo từ lúc đổi URL tới lúc khung ứng dụng hiển thị)
      expect.soft(contentAt - urlChangedAt, 'Thời gian màn trắng (ms)').toBeLessThanOrEqual(1000);
      // Expected: KHÔNG hiện lỗi 403/500
      expect.soft(badResponses).toEqual([]);
    });

    await test.step('Bước 3: Quan sát màn hình sau khi vào', async () => {
      // Expected: Vào thẳng /work-queue
      expect.soft(new URL(page.url()).pathname).toBe('/work-queue');
      // Expected: tiêu đề lớn dạng "Chào buổi chiều, <tên>. <N> việc cần bạn, <M> gấp."
      // (buổi sáng/chiều/tối tuỳ thời điểm chạy — coi là phần biến đổi của "dạng")
      await expect(shell.workQueueHeadline).toBeVisible();
      const headline = (await shell.workQueueHeadline.innerText()).trim();
      test.info().annotations.push({ type: 'Tiêu đề thực tế', description: headline });
      expect.soft(headline).toMatch(/^Chào buổi (sáng|chiều|tối), .+\. \d+ việc cần bạn, \d+ gấp\.$/);
      // Expected: Sidebar có đủ: Việc cần làm (nhóm Cần làm) · Hồ sơ salon · Yêu cầu · Gói dịch vụ (nhóm Tra cứu) · Cài đặt
      const groupTodo = page.getByRole('list', { name: 'Cần làm' });
      const groupLookup = page.getByRole('list', { name: 'Tra cứu' });
      await expect.soft(groupTodo.getByRole('link', { name: /^Việc cần làm/ })).toBeVisible();
      for (const name of ['Hồ sơ salon', 'Yêu cầu', 'Gói dịch vụ']) {
        await expect.soft(groupLookup.getByRole('link', { name }), `Mục ${name}`).toBeVisible();
      }
      await expect.soft(shell.navSettings).toHaveText(/Cài đặt/);
    });

    await test.step('Bước 4: Mở menu tài khoản ở góc trái dưới', async () => {
      await shell.openAccountMenu();
      // Expected: Menu hiện đúng <tên> · "Director • Admin" · <email>; có dấu tick ở hồ sơ đang dùng
      // (TC ghi "chi Hương"/huong_dang@fastboy.net; theo quyết định người dùng 2026-11-19 dùng tài khoản trong .env)
      await expect.soft(shell.accountCurrent).toContainText(requireDisplayName());
      await expect.soft(shell.accountCurrent).toContainText('Director • Admin');
      await expect.soft(shell.accountCurrent).toContainText(email);
      await expect.soft(shell.accountCurrent.locator('svg.lucide-check')).toBeVisible();
      // Expected: Có nút Đăng xuất
      await expect.soft(shell.logoutButton).toHaveText('Đăng xuất');
    });
  });

  test('TC-CMN-AUTH-015 — Đăng nhập từ deep link đưa về đúng trang gốc chứ không về trang mặc định', async ({ page }) => {
    const { email, password } = getTestUser();
    await presetVietnamese(page.context());
    const login = new LoginPage(page);
    const shell = new AppShell(page);

    await test.step('Bước 1: Vào /requests/92 khi chưa đăng nhập', async () => {
      await page.goto('/requests/92');
      await expect(page).toHaveURL(/\/login\?redirect=\/requests\/92$/);
    });

    await test.step('Bước 2: Nhập email và mật khẩu đúng, bấm Đăng nhập', async () => {
      await login.login(email, password);
      // Expected: Đăng nhập thành công
      await expect(shell.sidebar).toBeVisible({ timeout: 15_000 });
    });

    await test.step('Bước 3: Đọc URL và nội dung trang sau khi vào', async () => {
      const u = new URL(page.url());
      // Expected: về đúng /requests/92, KHÔNG về /work-queue
      expect.soft(u.pathname).toBe('/requests/92');
      // Expected: tham số redirect KHÔNG còn trên URL
      expect.soft(u.search, 'Còn tham số trên URL').not.toContain('redirect');
      // Expected: nội dung là chi tiết request 92, breadcrumb trỏ đúng
      const detail = page.getByTestId('requests-detail-page');
      await expect.soft(detail).toBeVisible();
      await expect.soft(detail).toContainText('92');
      await expect.soft(page.getByTestId('shell-breadcrumb-requests')).toHaveAttribute('href', '/requests');
      await expect.soft(shell.breadcrumb).toContainText('Chi tiết yêu cầu');
    });
  });

  test('TC-CMN-AUTH-018 — Nhấn Enter trong ô mật khẩu gửi form đăng nhập', async ({ page, browser }) => {
    const { email, password } = getTestUser();
    const login = await openLoginVietnamese(page);

    await test.step('Bước 1: Nhập email, nhập mật khẩu', async () => {
      await login.fillCredentials(email, password);
    });

    await test.step('Bước 2: Đang ở ô Mật khẩu, nhấn Enter', async () => {
      await login.passwordInput.focus();
      await page.keyboard.press('Enter');
      // Expected: Form được gửi, đăng nhập thành công
      await expect(page).toHaveURL(/\/work-queue/, { timeout: 15_000 });
    });

    await test.step('Bước 3: Lặp lại nhưng nhấn Enter khi đang ở ô Email', async () => {
      // Lặp lại thao tác từ đầu trong một trình duyệt sạch (chưa đăng nhập)
      const ctx2 = await browser.newContext();
      const page2 = await ctx2.newPage();
      const login2 = await openLoginVietnamese(page2);
      await login2.fillCredentials(email, password);
      await page2.evaluate(() => ((window as any).__qaNoReload = true));
      await login2.emailInput.focus();
      await page2.keyboard.press('Enter');
      await page2.waitForURL(/\/work-queue/, { timeout: 5000 }).catch(() => {});
      const submitted = /\/work-queue/.test(page2.url());
      // Chỉ kiểm tra focus khi vẫn ở màn đăng nhập (nếu đã vào app thì ô Mật khẩu không còn tồn tại)
      const focusOnPassword = submitted
        ? false
        : await page2.evaluate(() => document.activeElement?.getAttribute('data-testid') === 'auth-login-password-input');
      test.info().annotations.push({
        type: 'Bước 3',
        description: submitted ? 'Enter ở ô Email → gửi form' : focusOnPassword ? 'Enter ở ô Email → chuyển focus sang Mật khẩu' : 'Enter ở ô Email → không gửi, không chuyển focus',
      });
      // Expected: gửi form (hoặc chuyển focus xuống ô Mật khẩu)
      expect.soft(submitted || focusOnPassword, 'Gửi form hoặc chuyển focus').toBe(true);
      if (!submitted) {
        // Expected: KHÔNG tải lại trang về trạng thái trắng, KHÔNG mất dữ liệu đã nhập
        expect.soft(await page2.evaluate(() => (window as any).__qaNoReload === true), 'Không tải lại trang').toBe(true);
        await expect.soft(login2.emailInput).toHaveValue(email);
        expect.soft((await login2.passwordInput.inputValue()) === password, 'Mật khẩu còn nguyên').toBe(true);
      }
      await ctx2.close();
    });
  });

  test('TC-CMN-AUTH-019 — Nút Đăng nhập khoá lại khi đang xử lý, chống bấm nhiều lần', async ({ page }) => {
    test.setTimeout(120_000);
    const { email, password } = getTestUser();
    const login = await openLoginVietnamese(page);
    const loginRequests = trackLoginRequests(page);

    await test.step('Bước 1: Giả lập mạng Slow 3G', async () => {
      const cdp = await page.context().newCDPSession(page);
      await cdp.send('Network.enable');
      // Thông số preset "Slow 3G" của Chrome DevTools
      await cdp.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: 2000,
        downloadThroughput: (500 * 1024) / 8 * 0.8,
        uploadThroughput: (500 * 1024) / 8 * 0.8,
      });
    });

    await test.step('Bước 2: Nhập email và mật khẩu đúng', async () => {
      await login.fillCredentials(email, password);
    });

    await test.step('Bước 3: Bấm Đăng nhập rồi bấm thêm 4 lần liên tiếp thật nhanh', async () => {
      const box = (await login.submitButton.boundingBox())!;
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      await page.mouse.click(cx, cy);
      // Expected: Ngay sau lần bấm đầu, nút chuyển trạng thái đang xử lý (spinner hoặc bị vô hiệu hoá)
      // Lấy mẫu trạng thái nút liên tục trong 1 giây đầu (để không phụ thuộc thời điểm đọc của script)
      const samples = await login.submitButton.evaluate(async (b) => {
        const out: string[] = [];
        const t0 = performance.now();
        while (performance.now() - t0 < 1000) {
          const s = {
            disabled: (b as HTMLButtonElement).disabled,
            busy: b.getAttribute('aria-busy') === 'true',
            spinner: !!b.querySelector('.animate-spin, [role=status], [data-slot=spinner]'),
          };
          out.push(`${Math.round(performance.now() - t0)}ms:${JSON.stringify(s)}`);
          if (s.disabled || s.busy || s.spinner) return { processing: true, out };
          await new Promise((r) => setTimeout(r, 50));
        }
        return { processing: false, out: out.slice(-1) };
      });
      test.info().annotations.push({ type: 'Trạng thái nút sau lần bấm 1', description: samples.out.slice(-1)[0] });
      expect.soft(samples.processing, 'Nút ở trạng thái đang xử lý trong 1 giây đầu').toBe(true);
      for (let i = 0; i < 4; i++) await page.mouse.click(cx, cy);
    });

    await test.step('Bước 4: Đếm số request login', async () => {
      // Expected: Sau khi xong vẫn vào đúng màn mặc định, KHÔNG kẹt loading
      await expect(page).toHaveURL(/\/work-queue/, { timeout: 90_000 });
      // Expected: Chỉ có ĐÚNG 1 request đăng nhập được gửi
      expect.soft(loginRequests.length, 'Số request login').toBe(1);
    });
  });

  /**
   * ⚠️ Case có thể KHOÁ tài khoản test → gắn tag @lockout, KHÔNG chạy trong lượt thường.
   * Chạy riêng (sau cùng) bằng: npm run test:lockout   — người dùng đã duyệt chạy ngày 2026-11-19.
   */
  test('TC-CMN-AUTH-020 — Nhập sai mật khẩu nhiều lần liên tiếp', { tag: '@lockout' }, async ({ page }) => {
    test.setTimeout(180_000);
    const { email, password } = getTestUser();
    const login = await openLoginVietnamese(page);
    const attempts: { n: number; status: number; message: string }[] = [];

    await test.step('Bước 1–2: Nhập email đúng + mật khẩu sai, bấm Đăng nhập; lặp 10 lần, ghi lại message mỗi lần', async () => {
      for (let n = 1; n <= 10; n++) {
        await login.fillCredentials(email, `WrongPass#020-${n}`);
        const respPromise = page.waitForResponse((r) => isLoginRequest(r.request()), { timeout: 15_000 }).catch(() => null);
        await login.submitButton.click();
        const resp = await respPromise;
        // Chờ message của lần bấm này hiện ra (hoặc cập nhật)
        await expect(login.formError).toBeVisible({ timeout: 10_000 }).catch(() => {});
        const message = (await login.formError.innerText({ timeout: 1000 }).catch(() => '')).trim();
        attempts.push({ n, status: resp?.status() ?? 0, message });
        if (n === 10) await captureEvidence(page, 'lan-sai-thu-10');
        await expect(login.submitButton).toBeEnabled({ timeout: 15_000 }).catch(() => {});
      }
      test.info().annotations.push({
        type: 'Kết quả 10 lần sai',
        description: attempts.map((a) => `#${a.n}: HTTP ${a.status} "${a.message}"`).join(' | '),
      });
      // Expected: đến một ngưỡng nhất định hệ thống phải chặn tạm thời (khoá theo thời gian, captcha hoặc
      // giới hạn tần suất) và message nói rõ cần đợi bao lâu.
      const firstMessage = attempts[0].message;
      const blocked = attempts.find(
        (a) => a.status === 429 || a.status === 423 || (a.message && a.message !== firstMessage),
      );
      const captcha = await page.locator('iframe[src*="captcha"], [data-testid*="captcha"]').count();
      test.info().annotations.push({
        type: 'Phát hiện chặn',
        description: blocked ? `Bị chặn từ lần #${blocked.n}: HTTP ${blocked.status} "${blocked.message}"` : captcha ? 'Có captcha' : 'KHÔNG thấy cơ chế chặn sau 10 lần',
      });
      expect.soft(!!blocked || captcha > 0, 'Hệ thống chặn tạm thời sau một ngưỡng').toBe(true);
      if (blocked) {
        expect.soft(blocked.message, 'Message nói rõ cần đợi bao lâu').toMatch(/\d+\s*(giây|phút|giờ|second|minute|hour|s\b|m\b)/i);
      }
    });

    await test.step('Bước 3: Sau 10 lần, nhập mật khẩu ĐÚNG và bấm Đăng nhập', async () => {
      const wasBlocked = attempts.some((a) => a.status === 429 || a.status === 423 || a.message !== attempts[0].message);
      await login.fillCredentials(email, password);
      const respPromise = page.waitForResponse((r) => isLoginRequest(r.request()), { timeout: 15_000 }).catch(() => null);
      await login.submitButton.click();
      const resp = await respPromise;
      await page.waitForURL(/\/work-queue/, { timeout: 10_000 }).catch(() => {});
      const loggedIn = /\/work-queue/.test(page.url());
      const message = loggedIn ? '' : (await login.formError.innerText({ timeout: 1000 }).catch(() => '')).trim();
      test.info().annotations.push({
        type: 'Bước 3 — mật khẩu đúng',
        description: `HTTP ${resp?.status() ?? 0}; ${loggedIn ? 'ĐĂNG NHẬP ĐƯỢC' : `KHÔNG đăng nhập được, message "${message}"`}`,
      });
      if (wasBlocked) {
        // Expected: Nếu đã bị khoá: KHÔNG đăng nhập được dù mật khẩu đúng, cho tới hết thời gian khoá
        expect.soft(loggedIn, 'Đang bị khoá thì không được đăng nhập').toBe(false);
      } else {
        // Expected: Nếu không bị khoá: đăng nhập được bình thường
        expect.soft(loggedIn, 'Không bị khoá thì đăng nhập bình thường').toBe(true);
      }
    });
  });

  test('TC-CMN-AUTH-022 — Dán email và mật khẩu từ clipboard', async ({ browser }) => {
    const { email, password } = getTestUser();
    const ctx = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
    const page = await ctx.newPage();
    const login = await openLoginVietnamese(page);
    const paste = async (value: string, target: typeof login.emailInput) => {
      await page.evaluate((v) => navigator.clipboard.writeText(v), value); // "Copy"
      await target.click();
      await page.keyboard.press('Control+V');
    };

    await test.step('Bước 1: Copy email, bấm vào ô Email, nhấn Ctrl+V', async () => {
      await paste(email, login.emailInput);
      // Expected: Email được dán đầy đủ, KHÔNG bị chặn dán
      await expect.soft(login.emailInput).toHaveValue(email);
    });

    await test.step('Bước 2: Copy mật khẩu, bấm vào ô Mật khẩu, nhấn Ctrl+V', async () => {
      await paste(password, login.passwordInput);
      // Expected: Mật khẩu được dán đầy đủ, hiển thị đúng số chấm tròn tương ứng số ký tự
      expect.soft((await login.passwordInput.inputValue()) === password, 'Mật khẩu dán đầy đủ').toBe(true);
      await expect.soft(login.passwordInput).toHaveAttribute('type', 'password');
    });

    await test.step('Bước 3: Bấm Đăng nhập', async () => {
      await login.submitButton.click();
      // Expected: Đăng nhập thành công
      await expect(page).toHaveURL(/\/work-queue/, { timeout: 15_000 });
    });
    await ctx.close();
  });

  test('TC-CMN-AUTH-028 — Mất mạng ngay khi bấm Đăng nhập', async ({ page }) => {
    test.setTimeout(90_000);
    const { email, password } = getTestUser();
    const login = await openLoginVietnamese(page);

    await test.step('Bước 1: Nhập email và mật khẩu đúng', async () => {
      await login.fillCredentials(email, password);
    });

    await test.step('Bước 2: Bật chế độ Offline', async () => {
      await page.context().setOffline(true);
    });

    // Đọc trạng thái màn hình trực tiếp trong trang (không in giá trị mật khẩu, chỉ so sánh true/false)
    const readState = () =>
      page.evaluate((pw) => {
        const q = (id: string) => document.querySelector<HTMLElement>(`[data-testid="${id}"]`);
        const btn = q('auth-login-submit-button') as HTMLButtonElement | null;
        const toast = q('shell-toaster')?.innerText.trim() ?? '';
        return {
          message: (q('auth-login-form-error')?.innerText.trim() || toast) ?? '',
          buttonReady: !!btn && !btn.disabled && btn.getAttribute('aria-busy') !== 'true',
          emailValue: (q('auth-login-email-input') as HTMLInputElement | null)?.value ?? null,
          passwordKept: (q('auth-login-password-input') as HTMLInputElement | null)?.value === pw,
        };
      }, password);

    await test.step('Bước 3: Bấm Đăng nhập', async () => {
      await login.submitButton.click();
      // Chờ nút vào trạng thái đang xử lý (hoặc có message) — tối đa 2 giây — để không đọc trạng thái quá sớm
      await expect
        .poll(async () => {
          const st = await readState();
          return !st.buttonReady || !!st.message;
        }, { timeout: 2000 })
        .toBe(true);
      // Sau đó chờ tối đa 15 giây để ứng dụng phản hồi (hiện message hoặc mở lại nút), đo thời gian thực
      const start = Date.now();
      let s = await readState();
      while (!s.message && !s.buttonReady && Date.now() - start < 15_000) {
        await page.waitForTimeout(500); // lấy mẫu trạng thái mỗi 0,5 giây
        s = await readState();
      }
      await captureEvidence(page, 'sau-15s-offline');
      test.info().annotations.push({
        type: `Trạng thái sau ${Math.round((Date.now() - start) / 1000)}s offline`,
        description: `message: "${s.message || '(không có)'}", nút bấm được: ${s.buttonReady}`,
      });
      // Expected: message về lỗi kết nối, nói rõ là vấn đề mạng chứ KHÔNG phải sai tài khoản
      expect.soft(s.message, 'Có message lỗi kết nối').toMatch(/mạng|kết nối|internet|offline|network|connection/i);
      expect.soft(s.message).not.toMatch(/incorrect|sai (tài khoản|mật khẩu)/i);
      // Expected: Nút Đăng nhập trở lại trạng thái bấm được; KHÔNG kẹt spinner
      expect.soft(s.buttonReady, 'Nút Đăng nhập bấm được lại').toBe(true);
      // Expected: KHÔNG xoá email và mật khẩu đã nhập
      expect.soft(s.emailValue === email, 'Email còn nguyên').toBe(true);
      expect.soft(s.passwordKept, 'Mật khẩu còn nguyên').toBe(true);
    });

    await test.step('Bước 4: Tắt Offline, bấm Đăng nhập lại', async () => {
      await page.context().setOffline(false);
      await page.evaluate(() => ((window as any).__qaNoReload = true)).catch(() => {});
      const s = await readState().catch(() => null);
      if (s?.buttonReady) {
        await login.submitButton.click();
      } else {
        test.info().annotations.push({ type: 'Bước 4', description: 'Nút vẫn bị khoá khi có mạng lại → không bấm lại được; chờ xem ứng dụng có tự gửi lại không' });
      }
      // Expected: Đăng nhập thành công ngay, KHÔNG cần tải lại trang
      await expect.soft(page).toHaveURL(/\/work-queue/, { timeout: 15_000 });
      expect.soft(await page.evaluate(() => (window as any).__qaNoReload === true).catch(() => false), 'Không tải lại trang').toBe(true);
      test.info().annotations.push({ type: 'Kết quả bước 4', description: `URL cuối: ${new URL(page.url()).pathname}` });
    });
  });

  test('TC-CMN-AUTH-029 — Backend trả lỗi 500 khi đăng nhập', async ({ page }) => {
    const { email, password } = getTestUser();
    const login = await openLoginVietnamese(page);
    const pageErrors = trackPageErrors(page);

    await test.step('Bước 1: Giả lập endpoint đăng nhập trả HTTP 500', async () => {
      // Body mô phỏng lỗi 500 có lộ chi tiết kỹ thuật (kiểu Laravel debug) để kiểm tra UI không in ra
      await page.route((url) => /\/auth\/login(\?|$)/.test(url.pathname), (route) =>
        route.request().method() === 'POST'
          ? route.fulfill({
              status: 500,
              contentType: 'application/json',
              body: JSON.stringify({
                message: 'SQLSTATE[HY000] [2002] Connection refused (SQL: select * from users)',
                exception: 'Illuminate\\Database\\QueryException',
                file: '/var/www/mixpost/vendor/laravel/framework/src/Illuminate/Database/Connection.php',
                trace: [{ file: '/var/www/mixpost/app/Http/Controllers/AuthController.php', line: 42 }],
              }),
            })
          : route.continue(),
      );
    });

    await test.step('Bước 2: Nhập email và mật khẩu đúng, bấm Đăng nhập', async () => {
      await login.login(email, password);
      // Expected: KHÔNG vào được ứng dụng
      await expect.soft(page.getByTestId('shell-sidebar')).toHaveCount(0);
      await expect.soft(page).toHaveURL(/\/login/);
    });

    await test.step('Bước 3: Đọc message và kiểm tra Console', async () => {
      const anyMessage = login.formError.or(page.getByTestId('shell-toaster').locator('li'));
      await expect.soft(anyMessage.first()).toBeVisible();
      const msg = (await anyMessage.first().innerText().catch(() => '')).trim();
      test.info().annotations.push({ type: 'Message khi 500', description: msg || '(không có message)' });
      // Expected: message lỗi hệ thống thân thiện bằng đúng ngôn ngữ đang chọn (Tiếng Việt)
      expect.soft(msg, 'Message bằng Tiếng Việt').toMatch(VIETNAMESE_CHARS);
      // Expected: KHÔNG in stack trace, tên service hay đường dẫn nội bộ
      const screen = await page.locator('body').innerText();
      expect.soft(screen).not.toMatch(/SQLSTATE|QueryException|Illuminate|\/var\/www|mixpost|AuthController/);
      // Expected: Nút Đăng nhập bấm lại được
      await expect.soft(login.submitButton).toBeEnabled();
      test.info().annotations.push({ type: 'Lỗi JS chưa bắt', description: pageErrors.map((e) => e.message).join(' | ') || 'không có' });
    });
  });
});
