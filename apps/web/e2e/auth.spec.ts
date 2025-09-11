
import { test, expect } from '@playwright/test';

test.describe('User Authentication Flow', () => {
  test('displays sign in button for unauthenticated user and initiates sign in', async ({ page }) => {
      await page.addInitScript(() => {
        // Mock signIn to redirect to signin page
        if (window.nextAuth) {
          const originalSignIn = window.nextAuth.signIn;
          window.nextAuth.signIn = () => {
            window.location.href = '/api/auth/signin';
            return Promise.resolve();
          };
        } else {
          const originalSignIn = require('next-auth/react').signIn;
          require('next-auth/react').signIn = () => {
            window.location.href = '/api/auth/signin';
            return Promise.resolve();
          };
        }
      });
  
      await page.goto('http://localhost:3000');
  
      // Check for sign in button
      await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  
      // Click sign in button
      await page.getByRole('button', { name: /sign in/i }).click();
  
      // Expect redirect to NextAuth signin page
      await expect(page).toHaveURL(/.*\/api\/auth\/signin/);
  });

  test('redirects to dashboard after successful authentication (mocked)', async ({ page }) => {
    // Mock the session API to return authenticated user
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

    await page.goto('http://localhost:3000/');

    // Wait for session to be fetched and UI to update
    await page.waitForLoadState('networkidle');

    // Expect on dashboard (root)
    await expect(page).toHaveURL('http://localhost:3000/');
    // Check for authenticated state, e.g., sign out button or user info
    await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible();
  });
});
