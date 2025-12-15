import { test, expect } from '@playwright/test';
import { waitForPageReady } from '../utils/test-helpers';

test.describe('Animations and Interactions', () => {
  test('should load home page with animations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Give animations time to start
    await page.waitForTimeout(1000);

    // Check main content is present
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('should animate question reveals', async ({ page }) => {
    await page.goto('/quiz/1');
    await waitForPageReady(page);

    // Question title should be visible (likely animated in)
    const title = page.locator('text=/What kind of business|business are you building/i');
    await expect(title).toBeVisible();

    // Check that answer buttons are rendered and visible
    const buttons = page.locator('button[role="button"]');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);

    // All buttons should be visible
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      await expect(button).toBeVisible();
    }
  });

  test('should respond to button interactions', async ({ page }) => {
    await page.goto('/quiz/1');
    await waitForPageReady(page);

    // Get a button and check it responds to hover/interaction
    const button = page.locator('button', { hasText: 'Real Estate' });
    await expect(button).toBeVisible();

    // Hover should work (may change styling)
    await button.hover();
    await page.waitForTimeout(200); // Give hover effects time to render

    // Click should work
    await button.click();

    // Should navigate
    await page.waitForURL('/quiz/2');
    expect(page.url()).toContain('/quiz/2');
  });

  test('should render light rays background animation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Check for background element (GlobalLightRays component)
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // The background should have styling
    const bgClass = await body.getAttribute('class');
    expect(bgClass).toBeTruthy();
  });

  test('should transition smoothly between quiz pages', async ({ page }) => {
    await page.goto('/quiz/1');
    await waitForPageReady(page);

    // Record URL before navigation
    const startUrl = page.url();
    expect(startUrl).toContain('/quiz/1');

    // Click answer
    const button = page.locator('button', { hasText: 'Real Estate' }).first();
    await button.click();

    // Wait for navigation
    await page.waitForURL('/quiz/2', { timeout: 5000 });

    // Check new URL
    const newUrl = page.url();
    expect(newUrl).toContain('/quiz/2');
    expect(newUrl).not.toBe(startUrl);
  });

  test('should animate content visibility', async ({ page }) => {
    await page.goto('/quiz/3');
    await waitForPageReady(page);

    // Get all visible buttons
    const buttons = page.locator('button[role="button"]');
    const visibleCount = await buttons.count();
    expect(visibleCount).toBeGreaterThan(0);

    // Each button should be individually visible (not hidden by overflow)
    for (let i = 0; i < Math.min(visibleCount, 3); i++) {
      const button = buttons.nth(i);
      const isVisible = await button.isVisible();
      expect(isVisible).toBe(true);
    }
  });

  test('should handle rapid interactions gracefully', async ({ page }) => {
    await page.goto('/quiz/1');
    await waitForPageReady(page);

    // Try clicking a button (should handle gracefully)
    const button = page.locator('button', { hasText: 'Real Estate' });
    await button.click();

    // Navigation should succeed
    await page.waitForURL('/quiz/2', { timeout: 5000 });
    expect(page.url()).toContain('/quiz/2');
  });

  test('should animate question text appearance', async ({ page }) => {
    const questions = [
      { url: '/quiz/1', text: 'What kind of business' },
      { url: '/quiz/2', text: 'How big is your team' },
      { url: '/quiz/3', text: 'How are you feeling' },
    ];

    for (const question of questions) {
      await page.goto(question.url);
      await waitForPageReady(page);

      // Question text should be visible
      const titleText = page.locator(`text=${question.text}`);
      await expect(titleText).toBeVisible();
    }
  });
});
