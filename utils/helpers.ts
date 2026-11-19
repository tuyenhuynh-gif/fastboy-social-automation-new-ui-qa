import { expect, test, type BrowserContext, type Page, type Request } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AppShell } from '../pages/AppShell';
import { getTestUser } from './env';

/** Khoá localStorage ứng dụng đang dùng (quan sát thực tế trên DEV). */
export const STORAGE_KEYS = {
  locale: 'aisocial.locale',
  theme: 'aisocial.theme',
  session: 'aisocial.session',
} as const;

/** Có ký tự tiếng Việt có dấu hay không. */
export const VIETNAMESE_CHARS =
  /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;

/** Request gọi API đăng nhập bằng email/mật khẩu. */
export const isLoginRequest = (r: Request) =>
  r.method() === 'POST' && /\/auth\/login(\?|$)/.test(r.url());

/** Ghi lại các request đăng nhập phát sinh trên page. */
export function trackLoginRequests(page: Page): Request[] {
  const list: Request[] = [];
  page.on('request', (r) => {
    if (isLoginRequest(r)) list.push(r);
  });
  return list;
}

/** Ghi lại lỗi JavaScript chưa bắt (uncaught) trên page. */
export function trackPageErrors(page: Page): Error[] {
  const errors: Error[] = [];
  page.on('pageerror', (e) => errors.push(e));
  return errors;
}

/** Precondition: ngôn ngữ Tiếng Việt (đặt trước khi trang tải, giống người dùng đã chọn trước đó). */
export async function presetVietnamese(context: BrowserContext) {
  await context.addInitScript((key) => {
    if (!window.localStorage.getItem(key)) window.localStorage.setItem(key, 'vi');
  }, STORAGE_KEYS.locale);
}

/** Precondition: "Đang mở trang login ở trạng thái chưa đăng nhập, ngôn ngữ đang là Tiếng Việt". */
export async function openLoginVietnamese(page: Page, path = '/login'): Promise<LoginPage> {
  await presetVietnamese(page.context());
  const login = new LoginPage(page);
  await login.goto(path);
  await expect(login.languageSwitcher).toHaveAccessibleName('Ngôn ngữ: Tiếng Việt');
  return login;
}

/**
 * Precondition: "Đã đăng nhập bằng tài khoản vai trò Director • Admin, ngôn ngữ Tiếng Việt,
 * giao diện Sáng, đang ở màn Việc cần làm (/work-queue)".
 */
export async function loginAsTestUser(page: Page): Promise<AppShell> {
  const { email, password } = getTestUser();
  const login = await openLoginVietnamese(page, '/work-queue');
  await login.login(email, password);
  await page.waitForURL('**/work-queue');
  const shell = new AppShell(page);
  await expect(shell.sidebar).toBeVisible();
  await shell.selectTheme('light');
  await expect(shell.themeSwitcher).toHaveAccessibleName('Giao diện: Sáng');
  return shell;
}

/**
 * Chụp màn hình làm bằng chứng NGAY tại thời điểm cần ghi nhận (ảnh mặc định của Playwright chỉ chụp lúc test kết thúc).
 * Ô mật khẩu luôn được che (mask) để không lộ mật khẩu. Ảnh lưu trong thư mục kết quả của test và đính kèm vào báo cáo HTML.
 */
export async function captureEvidence(page: Page, name: string) {
  const file = test.info().outputPath(`evidence-${name}.png`);
  await page.screenshot({ path: file, mask: [page.getByTestId('auth-login-password-input')] });
  await test.info().attach(`Bằng chứng: ${name}`, { path: file, contentType: 'image/png' });
}

/** Đọc path + query string hiện tại (nguyên văn, không giải mã), ví dụ "/login?redirect=/work-queue". */
export function currentPathAndQuery(page: Page): string {
  const u = new URL(page.url());
  return u.pathname + u.search;
}
