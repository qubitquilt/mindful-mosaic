import { test, expect } from '@playwright/test';

test.describe('Routine Creation Flow', () => {
  test('authenticated user can create a routine with tasks via modal', async ({ page }) => {
    // Mock session for authenticated state
    await page.route('**/api/auth/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 'mock-user-id',
            name: 'Test User',
            email: 'test@example.com',
            image: 'https://example.com/avatar.jpg',
          },
          session: {
            expires: new Date(Date.now() + 3600000).toISOString(),
          },
          expires: new Date(Date.now() + 3600000).toISOString(),
        }),
      });
    });

    // Mock POST /api/routines for save
    let postCalled = false;
    await page.route('**/api/routines', async (route) => {
      if (route.request().method() === 'POST') {
        postCalled = true;
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'new-routine-id',
            name: 'Morning Routine',
            timeSlot: '6:00 AM - 7:00 AM',
            tasks: [
              { id: 'task1', name: 'Wake up', duration: 10 },
              { id: 'task2', name: 'Exercise', duration: 30 },
            ],
          }),
        });
      } else {
        await route.fulfill({ status: 200 });
      }
    });

    // Mock GET /api/routines to return empty array
    await page.route('**/api/routines', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      }
    });

    // Navigate to dashboard
    await page.goto('http://localhost:3000');

    // Verify authenticated
    await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible();

    // Click create routine button (assume in header or timeline)
    await page.getByRole('button', { name: /create routine/i }).click();
    await page.waitForFunction(() => document.querySelector('[role="dialog"]') !== null);

    // Modal opens
    await expect(page.getByRole('dialog')).toBeVisible();

    // Fill the initial task
    await page.locator('input[placeholder="Task name"]').first().fill('Wake up');
    await page.locator('input[placeholder="Duration (min)"]').first().fill('10');

    // Fill routine name
    await page.locator('#routine-name').fill('Morning Routine');

    // Select time slot (assume dropdown or inputs)
    await page.locator('#start-time').fill('06:00');
    await page.locator('#end-time').fill('07:00');

    // Add one task
    await page.getByRole('button', { name: /add task/i }).click();
    await page.waitForSelector('input[placeholder="Task name"]:nth(1)');
    await expect(page.locator('input[placeholder="Task name"]')).toHaveCount(2);
    await page.locator('input[placeholder="Task name"]').nth(1).fill('Exercise');
    await page.locator('input[placeholder="Duration (min)"]').nth(1).fill('30');

    // Submit
    await page.getByRole('button', { name: /save/i }).click();

    // Wait for POST to complete
    await page.waitForResponse('**/api/routines', { timeout: 5000 });

    // Handle the success alert
    page.on('dialog', dialog => dialog.accept());

    // Wait for modal to close
    await page.waitForTimeout(1000);
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // Verify POST was called
    expect(postCalled).toBe(true);
  });
});