import { type Locator, type Page } from '@playwright/test';

/**
 * Page Object cho màn đăng nhập (/login).
 * Locator dùng data-testid vì ứng dụng đa ngôn ngữ (chữ hiển thị đổi theo VI/EN).
 */
export class LoginPage {
  readonly page: Page;
  readonly logo: Locator;
  readonly title: Locator;
  readonly subtitle: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;
  readonly formError: Locator;
  readonly emailHelpButton: Locator;
  readonly passwordHelpButton: Locator;
  readonly passwordToggleButton: Locator;
  readonly submitButton: Locator;
  readonly googleButton: Locator;
  readonly termsLink: Locator;
  readonly privacyLink: Locator;
  readonly languageSwitcher: Locator;
  readonly themeSwitcher: Locator;
  readonly tooltip: Locator;
  /** Banner "Phiên đăng nhập đã hết hạn" (URL có reason=expired) */
  readonly sessionExpiredBanner: Locator;
  /** Banner "Bạn đã đăng xuất ở tab khác" (URL có reason=signed-out) */
  readonly signedOutBanner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.getByTestId('auth-login-page').getByTestId('ds-brand-mark');
    this.title = page.getByTestId('auth-login-title');
    // Phụ đề không có testid: lấy đoạn văn bản ngay sau tiêu đề trong cùng thẻ card
    this.subtitle = this.title.locator('xpath=following-sibling::*[1]');
    this.emailInput = page.getByTestId('auth-login-email-input');
    this.passwordInput = page.getByTestId('auth-login-password-input');
    this.emailError = page.getByTestId('auth-login-email-error');
    this.passwordError = page.getByTestId('auth-login-password-error');
    this.formError = page.getByTestId('auth-login-form-error');
    this.emailHelpButton = page.getByTestId('auth-login-email-help');
    this.passwordHelpButton = page.getByTestId('auth-login-password-help');
    this.passwordToggleButton = page.getByTestId('auth-login-password-toggle-button');
    this.submitButton = page.getByTestId('auth-login-submit-button');
    this.googleButton = page.getByTestId('auth-login-google-button');
    this.termsLink = page.getByTestId('auth-login-terms-link');
    this.privacyLink = page.getByTestId('auth-login-privacy-link');
    this.languageSwitcher = page.getByTestId('shell-auth-language-switcher');
    this.themeSwitcher = page.getByTestId('shell-auth-theme-switcher');
    this.tooltip = page.getByRole('tooltip');
    this.sessionExpiredBanner = page.getByTestId('auth-login-session-expired-banner');
    this.signedOutBanner = page.getByTestId('auth-login-signed-out-banner');
  }

  async goto(path = '/login') {
    await this.page.goto(path);
    await this.emailInput.waitFor();
  }

  async selectLanguage(lang: 'vi' | 'en') {
    await this.languageSwitcher.click();
    await this.page.getByTestId(`shell-auth-language-switcher-option-${lang}`).click();
    await this.page.getByRole('menu').waitFor({ state: 'hidden' }); // chờ menu đóng hẳn
  }

  async fillCredentials(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async login(email: string, password: string) {
    await this.fillCredentials(email, password);
    await this.submitButton.click();
  }
}
