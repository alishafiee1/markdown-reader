'use strict';

const { test, expect } = require('@playwright/test');
const { skipWelcome, openAccountPage, registerUser, loginUser } = require('./helpers');

  test.describe('Auth — welcome flow', () => {
    test('register from welcome screen via account nav', async ({ page }) => {
      await page.addInitScript(() => localStorage.removeItem('bookshelf_welcome_done'));
      await page.goto('/');
      await page.locator('[data-page="welcome"].active').waitFor({ state: 'visible' });
      const username = `welcome_${Date.now()}`;
      await registerUser(page, username, 'secret1234');
      await expect(page.locator('#accountUsername')).toHaveText(username);
    });
  });

  test.describe('Auth — register, login, logout', () => {
  test.beforeEach(async ({ page }) => {
    await skipWelcome(page);
    await page.goto('/');
    await page.locator('[data-page="home"].active').waitFor({ state: 'visible' });
  });

  test('register new user shows logged-in state', async ({ page }) => {
    const username = `user_${Date.now()}`;
    await registerUser(page, username, 'secret1234');
    await expect(page.locator('#accountUsername')).toHaveText(username);
    await expect(page.locator('#accountRole')).toHaveText('کاربر');
  });

  test('register persists session after reload', async ({ page }) => {
    const username = `persist_${Date.now()}`;
    await registerUser(page, username, 'secret1234');
    await page.reload();
    await openAccountPage(page);
    await expect(page.locator('#accountLoggedIn')).toBeVisible();
    await expect(page.locator('#accountUsername')).toHaveText(username);
  });

  test('login with admino works', async ({ page }) => {
    await loginUser(page, 'admino', 'admino');
    await expect(page.locator('#accountRole')).toHaveText('مدیر');
    await expect(page.locator('#adminPasswordBanner')).toBeVisible();
  });

  test('logout returns to login form', async ({ page }) => {
    await loginUser(page, 'admino', 'admino');
    await page.locator('#logoutBtn').click();
    await expect(page.locator('#accountLoggedOut')).toBeVisible();
    await expect(page.locator('#loginForm')).toBeVisible();
  });

  test('duplicate username shows error', async ({ page }) => {
    const username = `dup_${Date.now()}`;
    await registerUser(page, username, 'secret1234');
    await page.locator('#logoutBtn').click();
    await openAccountPage(page);
    await page.getByRole('button', { name: 'ثبت‌نام', exact: true }).first().click();
    await page.locator('#registerPanel input[name="username"]').fill(username);
    await page.locator('#registerPanel input[name="password"]').fill('secret1234');
    await page.locator('#registerForm button[type="submit"]').click();
    await expect(page.locator('#registerError')).toContainText('قبلاً ثبت شده');
  });

  test('wrong password shows error without clearing username', async ({ page }) => {
    await openAccountPage(page);
    await page.locator('#loginPanel input[name="username"]').fill('admino');
    await page.locator('#loginPanel input[name="password"]').fill('wrongpass');
    await page.locator('#loginForm button[type="submit"]').click();
    await expect(page.locator('#loginError')).toContainText('اشتباه');
    await expect(page.locator('#loginPanel input[name="username"]')).toHaveValue('admino');
  });
});
