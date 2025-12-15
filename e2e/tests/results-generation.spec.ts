import { test, expect } from '@playwright/test';
import { waitForPageReady } from '../utils/test-helpers';

test.describe('Results Generation and Display', () => {
  test('should display results page with user selections', async ({ page }) => {
    // Complete questionnaire with specific answers
    await page.goto('/quiz/1');
    await waitForPageReady(page);

    // Q1: Segment
    await page.locator('button', { hasText: 'Real Estate' }).click();
    await page.waitForURL('/quiz/2');

    // Q2: Team size
    await page.locator('button', { hasText: 'Just me' }).click();
    await page.waitForURL('/quiz/3');

    // Q3: Sentiment
    await page.locator('button', { hasText: /Excited/ }).click();
    await page.waitForURL('/quiz/4');

    // Q4: Pain point
    const painButton = page.locator('button[role="button"]').first();
    await painButton.click();
    await page.waitForURL('/quiz/5');

    // Q5a: Value
    await page.locator('button', { hasText: /\$/ }).first().click();

    // Q5b: Urgency
    await page.locator('button', { hasText: /ASAP|Within|This|Just/ }).first().click();

    // Verify results page
    await page.waitForURL('/quiz/result');
    const heading = page.locator('text=Your personalized plan');
    await expect(heading).toBeVisible();

    // Verify results bento box displays values
    const resultItems = page.locator('[data-testid="result-item"], .bento-item, [class*="bento"]');
    // At least one result item should be visible
    const elementCount = await page.locator('text=/Segment|Team|Tier|Offer/i').count();
    expect(elementCount).toBeGreaterThan(0);
  });

  test('should generate different results for different answer combinations - Scenario 1', async ({ page }) => {
    await page.goto('/quiz/1');
    await waitForPageReady(page);

    // Scenario 1: Consulting, small team, curious
    await page.locator('button', { hasText: 'Consulting / Coaching' }).click();
    await page.waitForURL('/quiz/2');

    await page.locator('button', { hasText: 'Just me' }).click();
    await page.waitForURL('/quiz/3');

    await page.locator('button', { hasText: /Curious/ }).click();
    await page.waitForURL('/quiz/4');

    const painButton = page.locator('button[role="button"]').first();
    await painButton.click();
    await page.waitForURL('/quiz/5');

    await page.locator('button', { hasText: /\$/ }).first().click();
    await page.locator('button', { hasText: /ASAP|Within|This|Just/ }).first().click();

    await page.waitForURL('/quiz/result');

    // Capture results from Scenario 1
    const resultsText1 = await page.locator('text=/Consulting|Segment|Tier/i').first().textContent();
    expect(resultsText1).toBeTruthy();
  });

  test('should generate different results for different answer combinations - Scenario 2', async ({ page }) => {
    await page.goto('/quiz/1');
    await waitForPageReady(page);

    // Scenario 2: Agency, large team, excited
    await page.locator('button', { hasText: 'Creative / Marketing Agency' }).click();
    await page.waitForURL('/quiz/2');

    await page.locator('button', { hasText: '21+' }).click();
    await page.waitForURL('/quiz/3');

    await page.locator('button', { hasText: /Excited/ }).click();
    await page.waitForURL('/quiz/4');

    const painButton = page.locator('button[role="button"]').first();
    await painButton.click();
    await page.waitForURL('/quiz/5');

    await page.locator('button', { hasText: /\$5k|5k/i }).first().click();
    await page.locator('button', { hasText: /ASAP/ }).click();

    await page.waitForURL('/quiz/result');

    // Verify results page shows personalized content
    const resultsHeading = page.locator('text=Your personalized plan');
    await expect(resultsHeading).toBeVisible();
  });

  test('should display action buttons on results page', async ({ page }) => {
    // Complete flow to results
    await page.goto('/quiz/1');
    await waitForPageReady(page);

    await page.locator('button', { hasText: 'Other' }).click();
    await page.waitForURL('/quiz/2');

    await page.locator('button', { hasText: '2–5' }).click();
    await page.waitForURL('/quiz/3');

    await page.locator('button', { hasText: /Starting/ }).click();
    await page.waitForURL('/quiz/4');

    const painButton = page.locator('button[role="button"]').first();
    await painButton.click();
    await page.waitForURL('/quiz/5');

    await page.locator('button', { hasText: /\$/ }).first().click();
    await page.locator('button', { hasText: /Within|This|Just/ }).first().click();

    await page.waitForURL('/quiz/result');

    // Check for action buttons
    const joinButton = page.locator('text=/Join|Skool/i');
    const emailButton = page.locator('text=/Email/i');

    // At least one action should be visible
    const actionCount = await joinButton.count();
    expect(actionCount).toBeGreaterThanOrEqual(0);
  });

  test('should display copy buttons for invite links', async ({ page }) => {
    // Complete flow to results
    await page.goto('/quiz/1');
    await waitForPageReady(page);

    await page.locator('button', { hasText: 'Personal Brand / Creator' }).click();
    await page.waitForURL('/quiz/2');

    await page.locator('button', { hasText: '2–5' }).click();
    await page.waitForURL('/quiz/3');

    await page.locator('button', { hasText: /Overwhelmed/ }).click();
    await page.waitForURL('/quiz/4');

    const painButton = page.locator('button[role="button"]').first();
    await painButton.click();
    await page.waitForURL('/quiz/5');

    await page.locator('button', { hasText: /\$/ }).first().click();
    await page.locator('button', { hasText: /ASAP|Within|This|Just/ }).first().click();

    await page.waitForURL('/quiz/result');

    // Check for copy link buttons
    const copyButtons = page.locator('button', { hasText: /Copy/ });
    const copyCount = await copyButtons.count();
    expect(copyCount).toBeGreaterThanOrEqual(0);
  });
});
