'use strict';

const { test, expect } = require('@playwright/test');
const { skipWelcome, loginUser, registerUser } = require('./helpers');

test.describe('Home — search and continue reading', () => {
  test.beforeEach(async ({ page }) => {
    await skipWelcome(page);
    await page.goto('/');
    await page.locator('[data-page="home"].active').waitFor({ state: 'visible' });
  });

  test('search returns results', async ({ page }) => {
    await page.locator('#homeSearchInput').fill('readme');
    await page.locator('.search-result-item').first().waitFor({ state: 'visible', timeout: 10000 });
    await expect(page.locator('.search-result-item').first()).toBeVisible();
  });

  test('search result opens reader', async ({ page }) => {
    await page.locator('#homeSearchInput').fill('readme');
    await page.locator('.search-result-item').first().click();
    await page.locator('[data-page="reader"].active').waitFor({ state: 'visible' });
    await expect(page.locator('#readerContent')).toBeVisible();
  });

  test('logged-in user sees continue reading after opening a book', async ({ page }) => {
    const username = `cont_${Date.now()}`;
    await registerUser(page, username, 'pass1234');
    await page.getByRole('navigation', { name: 'ناوبری اصلی' }).getByText('کتابخانه').click();
    await page.locator('.folder-card').first().click();
    await page.locator('.book-card').first().click();
    await page.locator('#readerContent').waitFor({ state: 'visible' });
    await page.evaluate(() => {
      const content = document.getElementById('readerContent');
      content.scrollTop = content.scrollHeight / 2;
      content.dispatchEvent(new Event('scroll'));
    });
    await page.waitForTimeout(2500);
    await page.getByRole('navigation', { name: 'ناوبری اصلی' }).getByRole('button', { name: 'خانه', exact: true }).click();
    await page.locator('[data-page="home"].active').waitFor({ state: 'visible' });
    await expect(page.locator('#continueRow .continue-card, #continueRow .book-card').first()).toBeVisible({
      timeout: 10000,
    });
  });
});
