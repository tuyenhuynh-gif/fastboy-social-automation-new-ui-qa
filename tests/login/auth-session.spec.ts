import { test, expect, type Page } from '@playwright/test';
import { AppShell } from '../../pages/AppShell';
import { LoginPage } from '../../pages/LoginPage';
import { getTestUser } from '../../utils/env';
import {
  STORAGE_KEYS,
  captureEvidence,
  currentPathAndQuery,
  loginAsTestUser,
  presetVietnamese,
  trackPageErrors,
} from '../../utils/helpers';

/**
 * Nguồn test case: test-cases/[v1.0] Test case Login và Hệ thống.md — NHÓM A (đăng xuất & session).
 * Precondition chung: "Đã đăng nhập bằng tài khoản vai trò Director • Admin, ngôn ngữ Tiếng Việt,
 * giao diện Sáng, đang ở màn Việc cần làm" → helper loginAsTestUser().
 */

/** Đọc accessToken trong phiên (chỉ dùng để so sánh trong test, KHÔNG in ra). */
const readToken = (page: Page) =>
  page.evaluate((k) => {
    try {
      return JSON.parse(localStorage.getItem(k) ?? 'null')?.accessToken ?? null;
    } catch {
      return null;
    }
  }, STORAGE_KEYS.session);

test.describe('Login — Đăng xuất & Session', () => {
  test('TC-CMN-AUTH-030 — Mở màn đăng nhập khi đã đăng nhập sẵn', async ({ page }) => {
    await loginAsTestUser(page);
    const login = new LoginPage(page);
    const shell = new AppShell(page);

    await test.step('Bước 1: Đang đăng nhập, mở https://dev.fastboysocial.dev/login', async () => {
      await page.goto('/login');
      // Expected: Tự chuyển về trang trong ứng dụng, KHÔNG hiển thị lại form đăng nhập
      await expect.soft(shell.sidebar).toBeVisible();
      await expect.soft(login.emailInput).toHaveCount(0);
    });

    await test.step('Bước 2: Quan sát URL và nội dung trang', async () => {
      // Expected: URL cuối là /work-queue (hoặc trang mặc định theo vai trò)
      await expect.soft(page).toHaveURL(/\/work-queue$/);
    });

    await test.step('Bước 3: Thử /login?redirect=/requests', async () => {
      await page.goto('/login?redirect=/requests');
      await expect(shell.sidebar).toBeVisible();
      await captureEvidence(page, 'sau-khi-mo-login-redirect-requests');
      // Expected: chuyển thẳng tới /requests; KHÔNG mất phiên, KHÔNG bắt đăng nhập lại
      await expect.soft(page).toHaveURL(/\/requests$/);
      await expect.soft(shell.sidebar).toBeVisible();
      await expect.soft(login.emailInput).toHaveCount(0);
      expect.soft(await readToken(page), 'Phiên vẫn còn').not.toBeNull();
    });
  });

  test('TC-CMN-AUTH-031 — Đăng xuất từ menu tài khoản', async ({ page }) => {
    const shell = await loginAsTestUser(page);
    const login = new LoginPage(page);
    const token = await readToken(page);
    const displayName = (await page.getByTestId('shell-sidebar-account-name').innerText()).trim();

    await test.step('Bước 1: Bấm khối tài khoản ở góc trái dưới', async () => {
      await shell.openAccountMenu();
      const menu = page.getByRole('menu', { name: 'Menu tài khoản' });
      // Expected: panel có mục "ĐỔI HỒ SƠ", hồ sơ hiện tại có dấu tick, và nút Đăng xuất
      // Đọc chữ đúng như hiển thị trên màn hình (innerText áp dụng CSS text-transform, vd. IN HOA)
      const label = menu.locator('[data-slot="dropdown-menu-label"]');
      const shown = await label.evaluate((e) => (e as HTMLElement).innerText);
      test.info().annotations.push({ type: 'Nhãn hiển thị', description: shown.split('\n')[0] });
      expect.soft(shown, 'Panel có mục ĐỔI HỒ SƠ').toContain('ĐỔI HỒ SƠ');
      await expect.soft(shell.accountCurrent.locator('svg.lucide-check')).toBeVisible();
      await expect.soft(shell.logoutButton).toHaveText('Đăng xuất');
    });

    await test.step('Bước 2: Bấm Đăng xuất', async () => {
      const start = Date.now();
      await shell.logoutButton.click();
      await page.waitForURL(/\/login/, { timeout: 10_000 });
      const ms = Date.now() - start;
      test.info().annotations.push({ type: 'Thời gian đăng xuất', description: `${ms}ms` });
      // Expected: Đăng xuất trong vòng 3 giây
      expect.soft(ms).toBeLessThanOrEqual(3000);
    });

    await test.step('Bước 3: Quan sát URL và nội dung trang', async () => {
      // Expected: Về màn đăng nhập /login
      expect.soft(new URL(page.url()).pathname).toBe('/login');
      await expect.soft(login.emailInput).toBeVisible();
      // Expected: KHÔNG còn hiển thị tên user, tên salon hay số liệu nghiệp vụ
      await expect.soft(page.getByText(displayName)).toHaveCount(0);
      await expect.soft(shell.sidebar).toHaveCount(0);
      await expect.soft(page.getByTestId('work-queue-page')).toHaveCount(0);
    });

    await test.step('Bước 4: Kiểm tra localStorage và cookie của domain', async () => {
      const storage = await page.evaluate(() => ({
        keys: Object.keys(localStorage),
        all: JSON.stringify({ ...localStorage }) + JSON.stringify({ ...sessionStorage }) + document.cookie,
      }));
      const cookies = JSON.stringify(await page.context().cookies());
      test.info().annotations.push({ type: 'Khoá localStorage sau đăng xuất', description: storage.keys.join(', ') });
      // Expected: Token/khoá phiên bị xoá hẳn khỏi localStorage và cookie
      expect.soft(storage.keys, 'Khoá phiên còn trong localStorage').not.toContain(STORAGE_KEYS.session);
      // Expected: KHÔNG còn sót giá trị token cũ dưới bất kỳ khoá nào
      expect.soft(!!token && (storage.all.includes(token) || cookies.includes(token)), 'Token cũ còn sót').toBe(false);
    });
  });

  test('TC-CMN-AUTH-032 — Dán lại URL nội bộ sau khi đã đăng xuất', async ({ page }) => {
    const shell = await loginAsTestUser(page);
    const login = new LoginPage(page);
    const serverErrors: string[] = [];
    page.on('response', (r) => {
      if (r.status() >= 500) serverErrors.push(`${r.status()} ${r.url()}`);
    });

    await test.step('Bước 1: Copy URL /requests/92 khi đang đăng nhập', async () => {
      await page.goto('/requests/92');
      await expect(page.getByTestId('requests-detail-page')).toBeVisible();
    });

    await test.step('Bước 2: Đăng xuất', async () => {
      await shell.logout();
      await page.waitForURL(/\/login/);
    });

    await test.step('Bước 3: Dán lại URL vừa copy, nhấn Enter', async () => {
      // Theo dõi: trang chi tiết request có xuất hiện dù chỉ trong tích tắc không
      await page.addInitScript(() => {
        (window as any).__qaDetailSeen = false;
        new MutationObserver(() => {
          if (document.querySelector('[data-testid="requests-detail-page"]')) (window as any).__qaDetailSeen = true;
        }).observe(document, { childList: true, subtree: true });
      });
      await page.goto('/requests/92');
      await expect(login.emailInput).toBeVisible();
      // Expected: Bị chuyển về /login?redirect=/requests/92
      expect.soft(currentPathAndQuery(page)).toBe('/login?redirect=/requests/92');
      // Expected: KHÔNG hiển thị nội dung request dù chỉ trong tích tắc
      expect.soft(await page.evaluate(() => (window as any).__qaDetailSeen), 'Nội dung request đã hiện ra').toBe(false);
      // Expected: KHÔNG lỗi 500 hay màn trắng
      expect.soft(serverErrors).toEqual([]);
    });
  });

  test('TC-CMN-AUTH-033 — Đăng xuất ở một tab trong khi tab khác đang mở ứng dụng', async ({ page, context }) => {
    const shellA = await loginAsTestUser(page);
    const tabB = await context.newPage();
    const shellB = new AppShell(tabB);
    const loginB = new LoginPage(tabB);

    await test.step('Bước 1: Mở ứng dụng ở 2 tab: A /work-queue, B /requests', async () => {
      await tabB.goto('/requests');
      await expect(shellB.sidebar).toBeVisible();
      await expect(page).toHaveURL(/\/work-queue/);
    });

    await test.step('Bước 2: Ở tab A, đăng xuất', async () => {
      await shellA.logout();
      // Expected: Tab A về màn đăng nhập
      await expect.soft(page).toHaveURL(/\/login/);
    });

    await test.step('Bước 3: Sang tab B, bấm một mục bất kỳ trên sidebar', async () => {
      await tabB.bringToFront();
      if (await shellB.navSalonProfile.isVisible()) {
        await shellB.navSalonProfile.click();
        test.info().annotations.push({ type: 'Tab B', description: 'Vẫn còn sidebar → đã bấm "Hồ sơ salon"' });
      } else {
        // Tab B đã tự về màn đăng nhập ngay khi tab A đăng xuất → không còn sidebar để bấm
        test.info().annotations.push({ type: 'Tab B', description: `Đã TỰ về màn đăng nhập ngay sau khi tab A đăng xuất (${currentPathAndQuery(tabB)})` });
      }
      // Expected: tab B nhận biết phiên đã kết thúc, đưa về màn đăng nhập; KHÔNG cho đọc dữ liệu
      await expect.soft(loginB.emailInput, 'Tab B phải về màn đăng nhập').toBeVisible({ timeout: 10_000 });
      test.info().annotations.push({ type: 'URL tab B sau bước 3', description: currentPathAndQuery(tabB) });
      // "kèm message phiên đã kết thúc nếu có" → ghi nhận nội dung banner (không bắt buộc)
      const banner = await loginB.signedOutBanner.or(loginB.sessionExpiredBanner).innerText({ timeout: 1000 }).catch(() => '');
      test.info().annotations.push({ type: 'Message tab B', description: banner.trim() || '(không có)' });
      await expect.soft(tabB.getByTestId('shell-sidebar'), 'Tab B vẫn hiển thị app').toHaveCount(0);
    });

    await test.step('Bước 4: Tải lại tab B', async () => {
      await tabB.reload();
      // Expected: Sau khi tải lại, tab B chắc chắn ở màn đăng nhập
      await expect.soft(loginB.emailInput).toBeVisible();
      await expect.soft(tabB).toHaveURL(/\/login/);
    });
  });

  test('TC-CMN-AUTH-034 — Phiên hết hạn trong lúc đang thao tác', async () => {
    test.info().annotations.push({
      type: 'BLOCKED',
      description: 'Test data yêu cầu dev cung cấp cách rút ngắn thời gian hết hạn phiên trên DEV; thời gian hết hạn đang "[Cần bổ sung]".',
    });
    test.skip(true, 'BLOCKED — thiếu cách rút ngắn thời gian hết hạn phiên trên DEV');
  });

  test('TC-CMN-AUTH-035 — Xoá thủ công token khỏi localStorage rồi thao tác tiếp', async ({ page }) => {
    const shell = await loginAsTestUser(page);
    const login = new LoginPage(page);
    const pageErrors = trackPageErrors(page);
    // Khoá giao diện (ngôn ngữ, theme) là tuỳ chọn người dùng, KHÔNG phải khoá phiên
    const preferenceKeys: string[] = [STORAGE_KEYS.locale, STORAGE_KEYS.theme];
    let sessionKeys: string[] = [];
    let redirected = false;
    let elapsedMs = 0;

    await test.step('Bước 1: Ghi lại tên toàn bộ khoá liên quan phiên đăng nhập trong Local Storage', async () => {
      const keys = await page.evaluate(() => Object.keys(localStorage));
      sessionKeys = keys.filter((k) => !preferenceKeys.includes(k));
      test.info().annotations.push({ type: 'Khoá localStorage (tất cả)', description: keys.join(', ') });
      test.info().annotations.push({ type: 'Khoá liên quan phiên', description: sessionKeys.join(', ') });
      expect(sessionKeys, 'Phải có khoá chứa token').toContain(STORAGE_KEYS.session);
    });

    await test.step('Bước 2: Xoá đúng 1 khoá chứa token, KHÔNG tải lại trang, KHÔNG bấm gì', async () => {
      await page.evaluate((k) => localStorage.removeItem(k), STORAGE_KEYS.session);
      const start = Date.now();
      // Expected: ứng dụng TỰ phát hiện và chuyển về màn đăng nhập NGAY, không cần thao tác thêm.
      // Chờ tối đa 10s (dài hơn mức 2s của Expected) chỉ để đo được thời gian thực tế nếu chậm.
      redirected = await login.emailInput
        .waitFor({ state: 'visible', timeout: 10_000 })
        .then(() => true)
        .catch(() => false);
      elapsedMs = Date.now() - start;
      await captureEvidence(page, 'sau-khi-xoa-token');
      expect.soft(redirected, 'Tự chuyển về màn đăng nhập mà không cần thao tác').toBe(true);
    });

    await test.step('Bước 3: Đo thời gian từ lúc xoá tới lúc về màn đăng nhập', async () => {
      test.info().annotations.push({
        type: 'Thời gian đo thực tế',
        description: redirected ? `${elapsedMs} ms` : `Không về màn đăng nhập sau ${elapsedMs} ms`,
      });
      // Expected: dưới 2 giây
      expect.soft(redirected && elapsedMs < 2000, `Về màn đăng nhập dưới 2 giây (đo được ${elapsedMs} ms)`).toBe(true);
    });

    await test.step('Bước 4: Đọc URL cuối cùng và quan sát màn hình', async () => {
      test.info().annotations.push({ type: 'URL bước 4', description: currentPathAndQuery(page) });
      // Expected: URL là /login (có thể kèm redirect=<trang đang đứng>)
      await expect.soft(page).toHaveURL(/\/login(\?|$)/);
      // Expected: KHÔNG còn dữ liệu nghiệp vụ (tên salon, số việc, danh sách request)
      await expect.soft(shell.sidebar, 'Vẫn hiển thị khung app').toHaveCount(0);
      await expect.soft(shell.workQueueHeadline, 'Vẫn hiển thị số việc').toHaveCount(0);
      // Expected: KHÔNG hiện lỗi 401/403 thô, KHÔNG màn trắng
      await expect.soft(page.locator('body')).not.toContainText(/\b(401|403)\b|unauthorized|forbidden/i);
      await expect.soft(login.emailInput.or(shell.sidebar), 'Màn trắng').toBeVisible();
      // Expected: KHÔNG lỗi JavaScript chưa bắt ở Console
      expect.soft(pageErrors.map((e) => e.message)).toEqual([]);
    });

    await test.step('Bước 5: Mở lại Local Storage kiểm tra các khoá còn lại', async () => {
      const remaining = await page.evaluate(() => Object.keys(localStorage));
      test.info().annotations.push({ type: 'Khoá còn lại sau bước 5', description: remaining.join(', ') });
      // Expected: các khoá phiên còn lại cũng được dọn sạch
      expect.soft(remaining.filter((k) => sessionKeys.includes(k)), 'Khoá phiên cũ còn sót').toEqual([]);
    });
  });

  test('TC-CMN-AUTH-036 — Sửa token thành chuỗi sai định dạng rồi tải lại trang', async ({ page }) => {
    await loginAsTestUser(page);
    const login = new LoginPage(page);
    const pageErrors = trackPageErrors(page);
    let navigations = 0;

    await test.step('Bước 1: Sửa giá trị token thành abc123', async () => {
      await page.evaluate((k) => {
        const s = JSON.parse(localStorage.getItem(k)!);
        s.accessToken = 'abc123';
        localStorage.setItem(k, JSON.stringify(s));
      }, STORAGE_KEYS.session);
    });

    await test.step('Bước 2: Tải lại trang', async () => {
      page.on('framenavigated', (f) => {
        if (f === page.mainFrame()) navigations++;
      });
      await page.reload();
      // Expected: Bị đưa về màn đăng nhập
      await expect.soft(login.emailInput).toBeVisible({ timeout: 10_000 });
    });

    await test.step('Bước 3: Quan sát màn hình và Console', async () => {
      // Theo dõi thêm 3 giây để phát hiện vòng lặp chuyển hướng
      const before = navigations;
      await page.waitForTimeout(3000);
      test.info().annotations.push({ type: 'Số lần điều hướng', description: `sau reload: ${before}, thêm trong 3s: ${navigations - before}` });
      // Expected: KHÔNG lặp vô hạn giữa /login và trang nội bộ
      expect.soft(navigations - before, 'Điều hướng thêm sau khi ổn định').toBe(0);
      // Expected: KHÔNG màn trắng, KHÔNG lỗi JavaScript chưa bắt
      await expect.soft(login.emailInput.or(page.getByTestId('shell-sidebar'))).toBeVisible();
      expect.soft(pageErrors.map((e) => e.message)).toEqual([]);
      // Expected: Token hỏng bị xoá khỏi localStorage sau khi phát hiện
      expect.soft(await readToken(page), 'Token hỏng còn trong localStorage').not.toBe('abc123');
    });
  });

  test('TC-CMN-AUTH-037 — Đăng nhập cùng tài khoản trên 2 trình duyệt khác nhau', async ({ page, browser }) => {
    test.setTimeout(60_000);
    const { email, password } = getTestUser();
    // Trình duyệt 1 = context mặc định; trình duyệt 2 = context riêng (tương đương Chrome ẩn danh theo test data)
    const ctxB = await browser.newContext();
    const pageB = await ctxB.newPage();
    const shellA = new AppShell(page);
    let aStillActive = false;

    await test.step('Bước 1: Đăng nhập trên trình duyệt 1', async () => {
      await loginAsTestUser(page);
    });

    await test.step('Bước 2: Đăng nhập cùng tài khoản trên trình duyệt 2', async () => {
      await presetVietnamese(ctxB);
      const loginB = new LoginPage(pageB);
      await loginB.goto('/login');
      await loginB.login(email, password);
      // Expected: Đăng nhập được trên trình duyệt thứ hai
      await expect(pageB).toHaveURL(/\/work-queue/, { timeout: 15_000 });
    });

    await test.step('Bước 3: Quay lại trình duyệt 1, bấm một mục sidebar', async () => {
      await page.bringToFront();
      if (await shellA.navRequests.isVisible()) {
        await shellA.navRequests.click();
        // Chờ 3 giây để ứng dụng kịp gọi API và phản ứng nếu phiên đã bị thu hồi (app có polling nên không dùng networkidle)
        await page.waitForTimeout(3000);
      } else {
        test.info().annotations.push({ type: 'Trình duyệt 1', description: 'Không còn sidebar để bấm (đã bị đưa ra khỏi app)' });
      }
      const onLogin = await new LoginPage(page).emailInput.isVisible();
      // Đọc message nếu có (giới hạn 1 giây, vì message có thể không tồn tại)
      const readText = (loc: import('@playwright/test').Locator) =>
        loc.innerText({ timeout: 1000 }).then((t) => t.trim()).catch(() => '');
      const loginA = new LoginPage(page);
      const message =
        (await readText(loginA.sessionExpiredBanner)) ||
        (await readText(loginA.signedOutBanner)) ||
        (await readText(page.getByTestId('shell-toaster'))) ||
        (await readText(loginA.formError));
      aStillActive = !onLogin && (await shellA.sidebar.isVisible());
      test.info().annotations.push({
        type: 'Trình duyệt 1 sau khi B đăng nhập',
        description:
          (aStillActive ? 'Vẫn dùng bình thường (nhiều phiên song song)' : `Bị đăng xuất. Message: "${message || '(không có)'}"`) +
          ` | URL: ${currentPathAndQuery(page)}`,
      });
      // Expected: vẫn dùng bình thường (nếu cho phép nhiều phiên) HOẶC bị đăng xuất kèm message rõ ràng (nếu chỉ 1 phiên)
      expect.soft(aStillActive || (onLogin && message.length > 0), 'Dùng bình thường, hoặc đăng xuất kèm message').toBe(true);
    });

    await test.step('Bước 4: Đăng xuất ở trình duyệt 2, quay lại trình duyệt 1 thao tác tiếp', async () => {
      await new AppShell(pageB).logout();
      await expect(pageB).toHaveURL(/\/login/);
      if (aStillActive) {
        await page.bringToFront();
        await shellA.navSalonProfile.click();
        await page.waitForTimeout(3000); // chờ app gọi API với phiên hiện tại
        // Expected: Đăng xuất ở trình duyệt 2 KHÔNG làm mất phiên trình duyệt 1
        await expect.soft(shellA.sidebar).toBeVisible();
        await expect.soft(new LoginPage(page).emailInput).toHaveCount(0);
      } else {
        test.info().annotations.push({ type: 'Bước 4', description: 'Trình duyệt 1 đã bị đăng xuất ở bước 3 (1 phiên duy nhất) → bước 4 không còn áp dụng' });
      }
    });
    await ctxB.close();
  });

  test('TC-CMN-AUTH-038 — Nhấn F5 sau khi đăng nhập vẫn giữ nguyên phiên', async ({ page }) => {
    const shell = await loginAsTestUser(page);
    const login = new LoginPage(page);

    const reloadAndCheck = async (path: string) => {
      await page.goto(path);
      await expect(shell.sidebar).toBeVisible();
      await page.reload();
      // Expected: vẫn đăng nhập, về đúng trang vừa đứng
      await expect.soft(shell.sidebar, `${path}: vẫn đăng nhập`).toBeVisible();
      await expect.soft(login.emailInput).toHaveCount(0);
      expect.soft(new URL(page.url()).pathname, `${path}: đúng trang`).toBe(path);
      // Expected: Ngôn ngữ và giao diện giữ nguyên lựa chọn trước đó
      await expect.soft(shell.languageSwitcher).toHaveAccessibleName('Ngôn ngữ: Tiếng Việt');
      await expect.soft(shell.themeSwitcher).toHaveAccessibleName('Giao diện: Sáng');
    };

    await test.step('Bước 1–2: Đang ở /work-queue, nhấn F5 và quan sát', async () => {
      await reloadAndCheck('/work-queue');
    });

    await test.step('Bước 3: Lặp lại ở /salon-profile/whmcs-3427 và /requests', async () => {
      await reloadAndCheck('/salon-profile/whmcs-3427');
      await reloadAndCheck('/requests');
    });
  });
});
