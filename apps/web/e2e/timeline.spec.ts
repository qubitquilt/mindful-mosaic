import { test, expect } from '@playwright/test';

test.describe('Daily Timeline View', () => {
  test('loads dashboard and renders empty timeline', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Check for empty message
    await expect(page.locator('text=No routines scheduled for today.')).toBeVisible();

    // Check for timeline container
    await expect(page.locator('.flex.flex-col.space-y-2')).toBeVisible();
  });

  test('renders time slots in the timeline', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Check for first and last time slots
    await expect(page.locator('text=6:00 AM - 7:00 AM')).toBeVisible();
    await expect(page.locator('text=9:00 PM - 10:00 PM')).toBeVisible();

    // Check for empty slot indicators
    await expect(page.locator('text=Empty slot').first()).toBeVisible();
  });

  test('timeline is responsive on mobile and desktop', async ({ page }) => {
    // Test desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('http://localhost:3000');
    await expect(page.locator('.max-w-4xl.mx-auto')).toBeVisible(); // Centered

    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000');
    await expect(page.locator('.flex-col')).toBeVisible(); // Vertical on mobile
    // Check slots still render
    await expect(page.locator('text=6:00 AM - 7:00 AM')).toBeVisible();
  });
});