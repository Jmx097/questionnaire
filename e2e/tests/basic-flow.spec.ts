import { test, expect } from '@playwright/test';
import { navigateToStart, selectAnswer, waitForPageReady, getCurrentPageNumber } from '../utils/test-helpers';

test.describe('Basic Questionnaire Flow', () => {
  test('should load the home page and intro animation', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);

    // Check for intro sequence or initial content
    const mainContent = page.locator('main');
    await expect(mainContent).toBeVisible();
  });

  test('should navigate to start page', async ({ page }) => {
    await navigateToStart(page);

    const startHeading = page.locator('heading, h1, h2, [role="heading"]').first();
    await expect(startHeading).toBeVisible();
  });

  test('should complete question 1 (segment)', async ({ page }) => {
    await page.goto('/quiz/1');
    await waitForPageReady(page);

    // Verify question title is visible
    const title = page.locator('text=What kind of business are you building');
    await expect(title).toBeVisible();

    // Select an answer
    const realEstateBtn = page.locator('button', { hasText: 'Real Estate' });
    await expect(realEstateBtn).toBeVisible();
    await realEstateBtn.click();

    // Should navigate to next question
    await page.waitForURL('/quiz/2');
    expect(page.url()).toContain('/quiz/2');
  });

  test('should complete question 2 (team size)', async ({ page }) => {
    await page.goto('/quiz/2');
    await waitForPageReady(page);

    // Verify question title is visible
    const title = page.locator('text=How big is your team');
    await expect(title).toBeVisible();

    // Select an answer
    const soloBtn = page.locator('button', { hasText: 'Just me' });
    await expect(soloBtn).toBeVisible();
    await soloBtn.click();

    // Should navigate to next question
    await page.waitForURL('/quiz/3');
    expect(page.url()).toContain('/quiz/3');
  });

  test('should complete question 3 (AI sentiment)', async ({ page }) => {
    await page.goto('/quiz/3');
    await waitForPageReady(page);

    // Verify question title is visible
    const title = page.locator('text=How are you feeling about AI');
    await expect(title).toBeVisible();

    // Select an answer
    const excitedBtn = page.locator('button', { hasText: /Excited/ });
    await expect(excitedBtn).toBeVisible();
    await excitedBtn.click();

    // Should navigate to next question
    await page.waitForURL('/quiz/4');
    expect(page.url()).toContain('/quiz/4');
  });

  test('should complete full questionnaire flow end-to-end', async ({ page }) => {
    // Start at question 1
    await page.goto('/quiz/1');
    await waitForPageReady(page);

    // Q1: Select business segment
    await page.locator('button', { hasText: 'Consulting / Coaching' }).click();
    await page.waitForURL('/quiz/2');

    // Q2: Select team size
    await page.locator('button', { hasText: '2–5' }).click();
    await page.waitForURL('/quiz/3');

    // Q3: Select AI sentiment
    await page.locator('button', { hasText: /Curious/ }).click();
    await page.waitForURL('/quiz/4');

    // Q4: Select pain point (will vary by segment)
    const painButtons = page.locator('button[role="button"]');
    const firstButton = painButtons.first();
    await expect(firstButton).toBeVisible();
    await firstButton.click();
    await page.waitForURL('/quiz/5');

    // Q5a: Select value per month
    await page.locator('button', { hasText: /\$/ }).first().click();

    // Q5b: Select urgency
    await page.locator('button', { hasText: /ASAP|Within|This|Just/ }).first().click();

    // Should navigate to results page
    await page.waitForURL('/quiz/result');
    expect(page.url()).toContain('/quiz/result');

    // Verify results page loads
    const resultsHeading = page.locator('text=Your personalized plan');
    await expect(resultsHeading).toBeVisible();
  });
});
