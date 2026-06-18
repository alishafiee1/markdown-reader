'use strict';

/**
 * کمک‌کنندهٔ تست E2E --- shared Playwright helpers for BookShelf ---
 */

/**
 * Skips welcome screen and opens home.
 * @param {import('@playwright/test').Page} page
 */
async function skipWelcome(page) {
  await page.addInitScript(() => {
    localStorage.setItem('bookshelf_welcome_done', '1');
  });
}

/**
 * Opens account page from bottom navigation.
 * @param {import('@playwright/test').Page} page
 */
async function openAccountPage(page) {
  await page.getByRole('navigation', { name: 'ناوبری اصلی' }).getByText('حساب').click();
  await page.locator('[data-page="account"].active').waitFor({ state: 'visible' });
}

/**
 * Registers a new user through the UI.
 * @param {import('@playwright/test').Page} page
 * @param {string} username
 * @param {string} password
 */
async function registerUser(page, username, password) {
  await openAccountPage(page);
  await page.getByRole('button', { name: 'ثبت‌نام', exact: true }).first().click();
  const registerPanel = page.locator('#registerPanel');
  await registerPanel.waitFor({ state: 'visible' });
  await registerPanel.locator('input[name="username"]').fill(username);
  await registerPanel.locator('input[name="password"]').fill(password);
  await registerPanel.locator('button[type="submit"]').click();
  await page.locator('#accountLoggedIn').waitFor({ state: 'visible' });
}

/**
 * Logs in through the UI.
 * @param {import('@playwright/test').Page} page
 * @param {string} username
 * @param {string} password
 */
async function loginUser(page, username, password) {
  await openAccountPage(page);
  await page.locator('#loginPanel input[name="username"]').fill(username);
  await page.locator('#loginPanel input[name="password"]').fill(password);
  await page.locator('#loginForm button[type="submit"]').click();
  await page.locator('#accountLoggedIn').waitFor({ state: 'visible' });
}

/**
 * Opens library from bottom nav.
 * @param {import('@playwright/test').Page} page
 */
async function openLibrary(page) {
  await page.getByRole('navigation', { name: 'ناوبری اصلی' }).getByText('کتابخانه').click();
  await page.locator('[data-page="library"].active').waitFor({ state: 'visible' });
}

module.exports = {
  skipWelcome,
  openAccountPage,
  registerUser,
  loginUser,
  openLibrary,
};
