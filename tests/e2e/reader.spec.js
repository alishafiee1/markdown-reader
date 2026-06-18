'use strict';

const { test, expect } = require('@playwright/test');
const { skipWelcome } = require('./helpers');

test.describe('Reader — themes and in-doc search', () => {
  test.beforeEach(async ({ page }) => {
    await skipWelcome(page);
    await page.goto('/?path=write-docs-friendly/readme.md');
    await page.locator('#readerContent').waitFor({ state: 'visible' });
  });

  test('switch reading theme changes card dataset', async ({ page }) => {
    await page.locator('.theme-dot[data-theme="day"]').click();
    await expect(page.locator('#readerCard')).toHaveAttribute('data-theme', 'day');
    await page.locator('.theme-dot[data-theme="sepia"]').click();
    await expect(page.locator('#readerCard')).toHaveAttribute('data-theme', 'sepia');
  });

  test('font scale increases', async ({ page }) => {
    await page.locator('#fontLargerBtn').click();
    const font = await page.locator('#readerCard').getAttribute('data-font');
    expect(['large', 'xlarge']).toContain(font);
  });

  test('in-document search highlights matches', async ({ page }) => {
    await page.locator('#readerSearchToggle').click();
    await page.locator('#readerSearchPanel').waitFor({ state: 'visible' });
    await page.locator('#readerSearchInput').fill('project');
    await expect(page.locator('#readerContent mark.search-hit').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('#readerSearchCount')).not.toHaveText('یافت نشد');
  });

  test('fullscreen toggle hides bottom nav', async ({ page }) => {
    await page.locator('#readerFullscreenBtn').click();
    await expect(page.locator('.bottom-nav')).toBeHidden();
    await page.keyboard.press('Escape');
    await expect(page.locator('.bottom-nav')).toBeVisible();
  });
});
