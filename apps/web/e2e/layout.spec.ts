import { test, expect } from '@playwright/test';

test.describe('Layout and Header', () => {
  test('header renders sign in button for unauthenticated user', async ({ page }) => {
    // No session mock, unauthenticated
    await page.goto('http://localhost:3000');

    // Verify sign in button visible, sign out not
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /sign out/i })).not.toBeVisible();

    // Check header structure
    await expect(page.getByRole('banner')).toBeVisible();
  });

  test('header shows user info and sign out for authenticated user', async ({ page }) => {
    // Mock session
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

    await page.goto('http://localhost:3000');

    // Verify sign out button and user info visible
    await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible();
    await expect(page.getByText('Test User')).toBeVisible();

    // Sign in not visible
    await expect(page.getByRole('button', { name: /sign in/i })).not.toBeVisible();
  });

  test('sign out redirects to unauthenticated state', async ({ page }) => {
    let signedOut = false;
  
    // Mock initial session
    await page.route('**/api/auth/session', async (route) => {
      if (signedOut) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(null),
        });
      } else {
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
      }
    });
  
    const signoutPromise = page.waitForResponse('**/api/auth/signout');
    const sessionPromise = page.waitForResponse('**/api/auth/session');
    await page.route('**/api/auth/signout', async (route) => {
      signedOut = true;
      await route.fulfill({
        status: 200,
      });
    });

    await page.goto('http://localhost:3000');

    // Authenticated initially
    await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible();

    // Click sign out
    await page.getByRole('button', { name: /sign out/i }).click();

    // Wait for the signout API call to complete
    await signoutPromise;

    // Reload the page to force session refetch and UI update
    await page.reload({ waitUntil: 'networkidle' });

    // Wait for UI to update to unauthenticated state after signout
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /sign out/i })).not.toBeVisible();
  });
});