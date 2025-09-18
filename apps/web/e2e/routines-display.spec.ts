import { test, expect } from '@playwright/test';

test.describe('Routines Display Flow', () => {
  test('displays saved routines on timeline with expandable tasks', async ({ page }) => {
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

    // Mock GET /api/routines to return sample data
    await page.route('/api/routines*', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 'routine1',
              name: 'Morning Routine',
              timeSlot: '6:00 AM - 7:00 AM',
              scheduledDate: new Date().toISOString().split('T')[0],
              tasks: [
                { id: 'task1', name: 'Wake up', duration: 10 },
                { id: 'task2', name: 'Exercise', duration: 30 },
              ],
            },
            {
              id: 'routine2',
              name: 'Evening Routine',
              timeSlot: '8:00 PM - 9:00 PM',
              scheduledDate: new Date().toISOString().split('T')[0],
              tasks: [{ id: 'task3', name: 'Read book', duration: 60 }],
            },
          ]),
        });
      }
    });

    // Navigate to dashboard
    await page.goto('http://localhost:3000');

    // Wait for fetch to complete
    await page.waitForResponse(/\/api\/routines\?date=/, { timeout: 5000 });

    // Wait for UI to re-render with routines (React state update)
    await expect(page.getByText('No routines scheduled for today.')).not.toBeVisible({ timeout: 5000 });

    // Verify routines render in time slots
    await expect(page.getByText('Morning Routine (40 min)')).toBeVisible();
    await expect(page.getByText('6:00 AM - 7:00 AM')).toBeVisible();
    await expect(page.getByText('Evening Routine (60 min)')).toBeVisible();
    await expect(page.getByText('8:00 PM - 9:00 PM')).toBeVisible();

    // Initially tasks collapsed
    await expect(page.getByText('Wake up')).not.toBeVisible();

    // Click to expand Morning Routine
    await page.getByText('Morning Routine (40 min)').click();

    // Verify tasks visible
    await expect(page.getByText('- Wake up (10 min)')).toBeVisible();
    await expect(page.getByText('- Exercise (30 min)')).toBeVisible();

    // Click to collapse
    await page.getByText('Morning Routine (40 min)').click();
    await expect(page.getByText('- Wake up (10 min)')).not.toBeVisible();

    // Refresh page, verify still fetches and renders
    await page.reload();
    await expect(page.getByText('Morning Routine (40 min)')).toBeVisible();
  });
});