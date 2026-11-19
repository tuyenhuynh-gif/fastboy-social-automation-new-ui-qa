import { type Locator, type Page } from '@playwright/test';

/**
 * Page Object cho khung ứng dụng sau khi đăng nhập: sidebar, header, menu tài khoản.
 */
export class AppShell {
  readonly page: Page;
  readonly sidebar: Locator;
  readonly navWorkQueue: Locator;
  readonly navSalonProfile: Locator;
  readonly navRequests: Locator;
  readonly navPackages: Locator;
  readonly navSettings: Locator;
  readonly accountButton: Locator;
  readonly accountCurrent: Locator;
  readonly logoutButton: Locator;
  readonly languageSwitcher: Locator;
  readonly themeSwitcher: Locator;
  readonly workQueueHeadline: Locator;
  readonly breadcrumb: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = page.getByTestId('shell-sidebar');
    this.navWorkQueue = page.getByTestId('shell-sidebar-nav-item-work-queue');
    this.navSalonProfile = page.getByTestId('shell-sidebar-nav-item-salon-profile');
    this.navRequests = page.getByTestId('shell-sidebar-nav-item-requests');
    this.navPackages = page.getByTestId('shell-sidebar-nav-item-packages');
    this.navSettings = page.getByTestId('shell-sidebar-nav-settings');
    this.accountButton = page.getByTestId('shell-sidebar-account-button');
    this.accountCurrent = page.getByTestId('shell-sidebar-account-current');
    this.logoutButton = page.getByTestId('shell-sidebar-account-logout');
    this.languageSwitcher = page.getByTestId('shell-topbar-language-switcher');
    this.themeSwitcher = page.getByTestId('shell-topbar-theme-switcher');
    this.workQueueHeadline = page.getByTestId('work-queue-page-headline');
    this.breadcrumb = page.getByTestId('shell-breadcrumb');
  }

  async selectTheme(theme: 'light' | 'dark' | 'system') {
    await this.themeSwitcher.click();
    await this.page.getByTestId(`shell-topbar-theme-switcher-option-${theme}`).click();
    await this.page.getByRole('menu').waitFor({ state: 'hidden' }); // chờ menu đóng hẳn
  }

  async openAccountMenu() {
    await this.accountButton.click();
    await this.logoutButton.waitFor();
  }

  async logout() {
    await this.openAccountMenu();
    await this.logoutButton.click();
  }
}
