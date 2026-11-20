import { test, expect, type Locator, type Page } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { getTestUser } from '../../utils/env';
import {
  VIETNAMESE_CHARS,
  captureEvidence,
  currentPathAndQuery,
  openLoginVietnamese,
  trackPageErrors,
} from '../../utils/helpers';

/**
 * Nguồn test case: test-cases/[v1.0] Test case Login và Hệ thống.md — NHÓM A.
 * Mỗi test chạy trong context Playwright mới = cookie/localStorage/sessionStorage trống
 * (đúng precondition "CHƯA đăng nhập: đã xoá cookie, localStorage và sessionStorage").
 */

/** 2 vùng chữ nhật có giao nhau không. */
async function overlaps(a: Locator, b: Locator): Promise<boolean> {
  const ra = await a.boundingBox();
  const rb = await b.boundingBox();
  if (!ra || !rb) return false;
  return !(
    ra.x + ra.width <= rb.x ||
    rb.x + rb.width <= ra.x ||
    ra.y + ra.height <= rb.y ||
    rb.y + rb.height <= ra.y
  );
}

/** Đếm thành phần hiển thị trên màn login (logo, tiêu đề, đoạn chữ, nhãn, ô nhập, nút, link). */
async function countLoginComponents(page: Page): Promise<Record<string, number>> {
  return page.getByTestId('auth-login-page').evaluate((root) => {
    const visible = (e: Element) => (e as HTMLElement).offsetParent !== null;
    const count = (sel: string) => [...root.querySelectorAll(sel)].filter(visible).length;
    return {
      img: count('img, [data-testid="ds-brand-mark"]'),
      heading: count('h1,h2,h3,h4'),
      paragraph: count('p'),
      label: count('label'),
      input: count('input'),
      button: count('button'),
      link: count('a'),
    };
  });
}

test.describe('Login — Truy cập & giao diện', () => {
  test('TC-CMN-AUTH-001 — Vào URL gốc khi chưa đăng nhập bị đưa về màn đăng nhập', async ({ page }) => {
    const pageErrors = trackPageErrors(page);
    const serverErrors: string[] = [];
    page.on('response', (r) => {
      if (r.status() >= 500) serverErrors.push(`${r.status()} ${r.url()}`);
    });
    const login = new LoginPage(page);

    await test.step('Bước 1: Mở https://dev.fastboysocial.dev/work-queue', async () => {
      await page.goto('https://dev.fastboysocial.dev/work-queue');
      await login.emailInput.waitFor();
      // Expected: Trang chuyển hướng nhanh, không xuất hiện bất thường
      expect(pageErrors, 'Không có lỗi JavaScript chưa bắt').toEqual([]);
      expect(serverErrors, 'Không có response lỗi 5xx').toEqual([]);
    });

    await test.step('Bước 2: Đọc URL cuối cùng', async () => {
      // Expected: URL cuối cùng đúng là /login?redirect=/work-queue, giữ nguyên tham số redirect
      expect(currentPathAndQuery(page)).toBe('/login?redirect=/work-queue');
    });

    await test.step('Bước 3: Quan sát nội dung trang', async () => {
      // Expected: Không hiển thị dữ liệu nghiệp vụ (tên salon, số việc, danh sách bài đăng)
      await expect.soft(page.getByTestId('shell-sidebar')).toHaveCount(0);
      await expect.soft(page.getByTestId('work-queue-page')).toHaveCount(0);
      // Expected: Hiển thị màn đăng nhập với tiêu đề "Đăng nhập Social Automation Tool"
      await expect.soft(login.title).toHaveText('Đăng nhập Social Automation Tool');
    });
  });

  test('TC-CMN-AUTH-002 — Vào deep link chi tiết request khi chưa đăng nhập giữ được đường dẫn gốc', async ({ page }) => {
    const login = new LoginPage(page);

    await test.step('Bước 1: Mở /requests/92', async () => {
      await page.goto('/requests/92');
      // Expected: Chuyển về màn đăng nhập
      await expect(login.emailInput).toBeVisible();
    });

    await test.step('Bước 2: Đọc URL cuối cùng', async () => {
      // Expected: URL đúng /login?redirect=/requests/92
      expect.soft(currentPathAndQuery(page)).toBe('/login?redirect=/requests/92');
    });

    await test.step('Bước 3: Lặp lại với /salon-profile/whmcs-3427 và /packages', async () => {
      // Expected: lần lượt ra đúng URL, không rút gọn/mã hoá sai/mất phần sau "/"
      for (const path of ['/salon-profile/whmcs-3427', '/packages']) {
        await page.goto(path);
        await expect(login.emailInput).toBeVisible();
        expect.soft(currentPathAndQuery(page), `Mở ${path}`).toBe(`/login?redirect=${path}`);
      }
    });
  });

  test('TC-CMN-AUTH-003 — Màn đăng nhập hiển thị đủ thành phần ở ngôn ngữ Tiếng Việt', async ({ page }) => {
    const login = await openLoginVietnamese(page);
    const divider = page.getByText('Hoặc tiếp tục với', { exact: true });
    const terms = login.termsLink.locator('xpath=..');

    await test.step('Bước 1: Quan sát toàn bộ màn đăng nhập từ trên xuống', async () => {
      // Expected: logo → tiêu đề → phụ đề → Email → Mật khẩu → nút Đăng nhập → "Hoặc tiếp tục với" → nút Google → điều khoản
      const ordered: [string, Locator][] = [
        ['logo Fastboy Marketing', page.getByRole('img', { name: 'Fastboy Marketing' })],
        ['tiêu đề', login.title],
        ['phụ đề', login.subtitle],
        ['ô Email', login.emailInput],
        ['ô Mật khẩu', login.passwordInput],
        ['nút Đăng nhập', login.submitButton],
        ['dòng Hoặc tiếp tục với', divider],
        ['nút Đăng nhập bằng Google', login.googleButton],
        ['dòng điều khoản', terms],
      ];
      let prevY = -1;
      let prevName = '(đầu trang)';
      for (const [name, loc] of ordered) {
        await expect.soft(loc, `${name} hiển thị`).toBeVisible();
        const box = await loc.boundingBox();
        if (box) {
          expect.soft(box.y, `${name} phải nằm dưới ${prevName}`).toBeGreaterThan(prevY);
          prevY = box.y;
          prevName = name;
        }
      }
    });

    await test.step('Bước 2: Đọc nguyên văn từng chuỗi hiển thị', async () => {
      await expect.soft(login.title).toHaveText('Đăng nhập Social Automation Tool');
      await expect.soft(login.subtitle).toHaveText('Workspace nội bộ cho team social của salon.');
      await expect.soft(page.locator('label[for="login-email"]')).toHaveText('Email');
      await expect.soft(login.emailInput).toHaveAttribute('placeholder', 'Nhập email');
      await expect.soft(page.locator('label[for="login-password"]')).toHaveText('Mật khẩu');
      await expect.soft(login.passwordInput).toHaveAttribute('placeholder', 'Nhập mật khẩu');
      await expect.soft(login.passwordToggleButton).toHaveAccessibleName('Hiện mật khẩu');
      await expect.soft(terms).toHaveText(
        'Khi đăng nhập, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.',
      );
      // "2 từ gạch chân là link"
      for (const link of [login.termsLink, login.privacyLink]) {
        await expect.soft(link).toHaveAttribute('href', /.+/);
        await expect.soft(link).toHaveCSS('text-decoration-line', 'underline');
      }
      await expect.soft(login.termsLink).toHaveText('Điều khoản dịch vụ');
      await expect.soft(login.privacyLink).toHaveText('Chính sách bảo mật');
    });

    await test.step('Bước 3: Kiểm tra 2 nút ở góc phải trên', async () => {
      await expect.soft(login.languageSwitcher).toHaveAccessibleName('Ngôn ngữ: Tiếng Việt');
      await expect.soft(login.themeSwitcher).toHaveAccessibleName('Giao diện: Theo hệ thống');
    });
  });

  test('TC-CMN-AUTH-004 — Màn đăng nhập hiển thị đủ thành phần ở ngôn ngữ English', async ({ page }) => {
    const login = new LoginPage(page);
    let enCount: Record<string, number> = {};

    await test.step('Bước 1: Mở /login, bấm nút ngôn ngữ, chọn English', async () => {
      await login.goto('/login');
      let navigations = 0;
      page.on('framenavigated', (f) => {
        if (f === page.mainFrame()) navigations++;
      });
      await login.selectLanguage('en');
      // Expected: Giao diện chuyển sang tiếng Anh ngay, KHÔNG cần tải lại trang
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      expect.soft(navigations, 'Không tải lại trang').toBe(0);
    });

    await test.step('Bước 2: Đọc nguyên văn từng chuỗi', async () => {
      await expect.soft(login.title).toHaveText('Sign in to Social Automation Tool');
      await expect.soft(login.subtitle).toHaveText('Internal workspace for the salon social team.');
      await expect.soft(page.locator('label[for="login-email"]')).toHaveText('Email');
      await expect.soft(login.emailInput).toHaveAttribute('placeholder', 'Enter email');
      await expect.soft(page.locator('label[for="login-password"]')).toHaveText('Password');
      await expect.soft(login.passwordInput).toHaveAttribute('placeholder', 'Enter your password');
      await expect.soft(login.passwordToggleButton).toHaveAccessibleName('Show password');
      await expect.soft(login.submitButton).toHaveText('Sign in');
      await expect.soft(page.getByText('Or continue with', { exact: true })).toBeVisible();
      await expect.soft(login.googleButton).toHaveAccessibleName('Sign in with Google');
      await expect.soft(login.termsLink).toHaveText('Terms of Service');
      await expect.soft(login.privacyLink).toHaveText('Privacy Policy');
    });

    await test.step('Bước 3: So số lượng thành phần với bản Tiếng Việt', async () => {
      enCount = await countLoginComponents(page);
      // Expected: KHÔNG còn chuỗi tiếng Việt nào sót lại trên màn hình
      const bodyText = await page.locator('body').innerText();
      expect.soft(bodyText.match(new RegExp(`\\S*${VIETNAMESE_CHARS.source}\\S*`, 'gi')) ?? [], 'Chuỗi tiếng Việt còn sót').toEqual([]);
      // Expected: Số thành phần bằng đúng bản Tiếng Việt
      await login.selectLanguage('vi');
      await expect(page.locator('html')).toHaveAttribute('lang', 'vi');
      const viCount = await countLoginComponents(page);
      expect.soft(enCount, 'Số thành phần EN = VI').toEqual(viCount);
    });
  });

  test('TC-CMN-AUTH-016 — Nút Hiện mật khẩu và Ẩn mật khẩu hoạt động đúng chiều', async ({ page }) => {
    const login = await openLoginVietnamese(page);
    const iconHtml = () => login.passwordToggleButton.locator('svg').evaluate((s) => s.outerHTML);
    let iconHidden = '';

    await test.step('Bước 1: Nhập chuỗi 8 ký tự vào ô Mật khẩu', async () => {
      await login.passwordInput.fill('Qc8Chars');
      iconHidden = await iconHtml();
    });

    await test.step('Bước 2: Bấm nút Hiện mật khẩu', async () => {
      await login.passwordToggleButton.click();
      // Expected: type đổi từ password sang text; nhãn đổi thành "Ẩn mật khẩu", icon đổi theo
      await expect.soft(login.passwordInput).toHaveAttribute('type', 'text');
      await expect.soft(login.passwordToggleButton).toHaveAccessibleName('Ẩn mật khẩu');
      expect.soft(await iconHtml(), 'Icon đổi theo').not.toBe(iconHidden);
    });

    await test.step('Bước 3: Bấm lại nút đó', async () => {
      await login.passwordToggleButton.click();
      // Expected: che lại (type=password), nhãn quay về "Hiện mật khẩu"
      await expect.soft(login.passwordInput).toHaveAttribute('type', 'password');
      await expect.soft(login.passwordToggleButton).toHaveAccessibleName('Hiện mật khẩu');
    });

    await test.step('Bước 4: Rê chuột lên nút để đọc tooltip/nhãn trợ năng', async () => {
      // Expected: nhãn trợ năng khớp trạng thái hiện tại ở cả 2 trạng thái
      await login.passwordToggleButton.hover();
      await expect.soft(login.passwordToggleButton).toHaveAccessibleName('Hiện mật khẩu');
      await login.passwordToggleButton.click();
      await login.passwordToggleButton.hover();
      await expect.soft(login.passwordInput).toHaveAttribute('type', 'text');
      await expect.soft(login.passwordToggleButton).toHaveAccessibleName('Ẩn mật khẩu');
      if (await login.tooltip.isVisible()) {
        await expect.soft(login.tooltip).not.toContainText('Hiện mật khẩu');
      }
    });
  });

  test('TC-CMN-AUTH-023 — Tooltip Thêm thông tin ở nhãn Email', async ({ page }) => {
    const login = await openLoginVietnamese(page);

    await test.step('Bước 1: Rê chuột vào nút Thêm thông tin cạnh nhãn Email', async () => {
      await expect(login.emailHelpButton).toHaveAccessibleName('Thêm thông tin');
      await login.emailHelpButton.hover();
      // Expected: Hiện tooltip/popover, KHÔNG che mất ô nhập bên dưới
      await expect(login.tooltip).toBeVisible();
      expect.soft(await overlaps(login.tooltip, login.emailInput), 'Tooltip che ô Email').toBe(false);
    });

    await test.step('Bước 2: Đọc nội dung hiện ra', async () => {
      const text = (await login.tooltip.innerText()).trim();
      test.info().annotations.push({ type: 'Nội dung tooltip', description: text });
      // Expected: đúng ngôn ngữ đang chọn (Tiếng Việt)
      expect.soft(text, 'Nội dung bằng Tiếng Việt').toMatch(VIETNAMESE_CHARS);
      // Expected: nói rõ nên nhập email nào (email công ty nội bộ)
      expect.soft(text, 'Nói rõ loại email cần nhập').toMatch(/email (công ty|công việc|nội bộ)/i);
      // Expected: KHÔNG hiển thị chuỗi khoá dịch thô kiểu login.email.hint
      expect.soft(text).not.toMatch(/^[a-z0-9_]+(\.[a-z0-9_]+)+$/i);
    });

    await test.step('Bước 3: Nhấn Esc', async () => {
      await page.keyboard.press('Escape');
      // Expected: Tooltip đóng lại, KHÔNG kẹt trên màn hình
      await expect.soft(login.tooltip).toBeHidden();
    });
  });

  test('TC-CMN-AUTH-024 — Tooltip Thêm thông tin ở nhãn Mật khẩu', async ({ page }) => {
    const login = await openLoginVietnamese(page);
    const texts: Record<string, string> = {};

    await test.step('Bước 1: Bấm vào nút Thêm thông tin cạnh nhãn Mật khẩu', async () => {
      await login.passwordHelpButton.click();
      // Expected: Hiện tooltip, KHÔNG che nút Đăng nhập
      await expect.soft(login.tooltip, 'Bấm vào nút Thêm thông tin phải hiện tooltip').toBeVisible();
      await captureEvidence(page, 'sau-khi-bam-nut-thong-tin-mat-khau');
      if (!(await login.tooltip.isVisible())) {
        // Chỉ để thu thập nội dung cho bước 2–3: rê chuột ra rồi rê lại vào nút (bước 1 vẫn ghi nhận FAIL ở trên)
        test.info().annotations.push({ type: 'Ghi chú', description: 'Bấm không hiện tooltip; dùng rê chuột để đọc nội dung cho bước 2–3' });
        await page.mouse.move(0, 0);
        await login.passwordHelpButton.hover();
        await expect(login.tooltip).toBeVisible();
      }
      expect.soft(await overlaps(login.tooltip, login.submitButton), 'Tooltip che nút Đăng nhập').toBe(false);
    });

    await test.step('Bước 2: Đọc nội dung hiện ra', async () => {
      await captureEvidence(page, 'noi-dung-tooltip-mat-khau');
      texts.vi = (await login.tooltip.innerText()).trim();
      test.info().annotations.push({ type: 'Tooltip VI', description: texts.vi });
      // Expected: nói rõ quy tắc mật khẩu hoặc cách lấy lại mật khẩu
      expect
        .soft(texts.vi, 'Có quy tắc mật khẩu hoặc cách lấy lại mật khẩu')
        .toMatch(/quy tắc|ký tự|tối thiểu|lấy lại|quên|khôi phục|đặt lại|liên hệ/i);
    });

    await test.step('Bước 3: Kiểm tra nội dung ở cả Tiếng Việt và English', async () => {
      await page.keyboard.press('Escape');
      await login.selectLanguage('en');
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      await page.mouse.move(0, 0);
      await login.passwordHelpButton.hover();
      await expect(login.tooltip).toBeVisible();
      texts.en =(await login.tooltip.innerText()).trim();
      test.info().annotations.push({ type: 'Tooltip EN', description: texts.en });
      // Expected: cả 2 ngôn ngữ đều có nội dung, KHÔNG để trống một bên
      expect.soft(texts.vi.length, 'Tooltip VI có nội dung').toBeGreaterThan(0);
      expect.soft(texts.en.length, 'Tooltip EN có nội dung').toBeGreaterThan(0);
    });
  });

  test('TC-CMN-AUTH-039 — Đăng nhập trên màn hình nhỏ và khi phóng to trình duyệt', async ({ page }) => {
    const login = new LoginPage(page);
    const keyParts = () => [
      ['logo', login.logo],
      ['tiêu đề', login.title],
      ['ô Email', login.emailInput],
      ['ô Mật khẩu', login.passwordInput],
      ['nút Đăng nhập', login.submitButton],
      ['nút Google', login.googleButton],
    ] as [string, Locator][];
    const noHorizontalScroll = () =>
      page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth);

    await test.step('Bước 1: Đặt cửa sổ 1366x768, mở /login', async () => {
      await page.setViewportSize({ width: 1366, height: 768 });
      await login.goto('/login');
      // Expected: Toàn bộ form nằm gọn trong màn hình, KHÔNG phải cuộn ngang
      expect.soft(await noHorizontalScroll(), 'Không cuộn ngang @1366x768').toBe(true);
      await expect.soft(page.getByTestId('auth-login-form')).toBeInViewport({ ratio: 1 });
    });

    await test.step('Bước 2: Đặt 1280x720', async () => {
      await page.setViewportSize({ width: 1280, height: 720 });
      // Expected: Logo, tiêu đề, 2 ô nhập và 2 nút vẫn nhìn thấy đủ
      for (const [name, loc] of keyParts()) {
        await expect.soft(loc, `${name} nhìn thấy đủ @1280x720`).toBeInViewport({ ratio: 1 });
      }
    });

    for (const zoom of [1.5, 2]) {
      await test.step(`Bước 3: Phóng to ${zoom * 100}%`, async () => {
        // Playwright không có nút zoom của trình duyệt. Mô phỏng tương đương: vùng hiển thị CSS = 1280x720 / zoom,
        // mật độ điểm ảnh = zoom (đây là cách trình duyệt thực hiện zoom).
        await page.setViewportSize({ width: Math.round(1280 / zoom), height: Math.round(720 / zoom) });
        await page.evaluate(() => window.dispatchEvent(new Event('resize')));
        // Expected: chữ KHÔNG chồng lên nhau
        const parts = keyParts();
        for (let i = 0; i < parts.length; i++) {
          for (let j = i + 1; j < parts.length; j++) {
            expect
              .soft(await overlaps(parts[i][1], parts[j][1]), `${parts[i][0]} chồng lên ${parts[j][0]} @${zoom * 100}%`)
              .toBe(false);
          }
        }
        // Expected: nút KHÔNG bị cắt mất chữ
        const clipped = await login.submitButton.evaluate((e) => e.scrollWidth > e.clientWidth);
        expect.soft(clipped, `Nút Đăng nhập bị cắt chữ @${zoom * 100}%`).toBe(false);
        // Expected: dòng điều khoản KHÔNG tràn ra ngoài khung
        const termsInside = await page.evaluate(() => {
          const p = document.querySelector('[data-testid="auth-login-terms-link"]')!.parentElement!.getBoundingClientRect();
          return p.left >= 0 && p.right <= document.documentElement.clientWidth;
        });
        expect.soft(termsInside, `Dòng điều khoản nằm trong khung @${zoom * 100}%`).toBe(true);
      });
    }

    await test.step('Bước 4: Thử đăng nhập ở mức zoom 200%', async () => {
      const { email, password } = getTestUser();
      await login.login(email, password);
      // Expected: Vẫn đăng nhập được bình thường
      await expect(page).toHaveURL(/\/work-queue/, { timeout: 15_000 });
    });
  });
});
