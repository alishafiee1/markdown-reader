'use strict';

const { test, expect } = require('@playwright/test');
const { skipWelcome, openLibrary } = require('./helpers');

test.describe('Library — browse and open book', () => {
  test.beforeEach(async ({ page }) => {
    await skipWelcome(page);
    await page.goto('/');
  });

  test('root browse shows folders', async ({ page }) => {
    await openLibrary(page);
    await expect(page.locator('.folder-card').first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#libraryBreadcrumbs')).toContainText('خانه');
  });

  test('navigate into subfolder updates breadcrumb', async ({ page }) => {
    await openLibrary(page);
    const folder = page.locator('.folder-card').first();
    const folderName = await folder.locator('h3').innerText();
    await folder.click();
    await expect(page.locator('#libraryBreadcrumbs')).toContainText(folderName);
  });

  test('open book loads reader', async ({ page }) => {
    await openLibrary(page);
    await page.locator('.folder-card').first().click();
    const book = page.locator('.book-card').first();
    await book.waitFor({ state: 'visible' });
    await book.click();
    await page.locator('[data-page="reader"].active').waitFor({ state: 'visible' });
    await expect(page.locator('#readerContent')).not.toContainText('در حال بارگذاری');
    await expect(page.locator('#readerContent h1, #readerContent h2, #readerContent p').first()).toBeVisible();
  });

  test('deep link opens reader directly', async ({ page }) => {
    await page.goto('/?path=write-docs-friendly/readme.md');
    await page.locator('[data-page="reader"].active').waitFor({ state: 'visible' });
    await expect(page.locator('#readerTitle')).not.toHaveText('مطالعه');
  });

  test('back from reader returns to same folder', async ({ page }) => {
    await page.goto('/?path=write-docs-friendly/readme.md');
    await page.locator('#readerContent').waitFor({ state: 'visible' });
    await page.locator('#readerBackBtn').click();
    await page.locator('[data-page="library"].active').waitFor({ state: 'visible' });
    await expect(page.locator('#libraryBreadcrumbs')).toContainText('write-docs-friendly');
  });
});
