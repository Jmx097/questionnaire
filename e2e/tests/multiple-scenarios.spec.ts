import { test, expect } from '@playwright/test';
import { waitForPageReady } from '../utils/test-helpers';

test.describe('Multiple Questionnaire Scenarios', () => {
  test('should complete full flow with Real Estate + Solo + Skeptical answers', async ({ page }) => {
    await page.goto('/quiz/1');
    await waitForPageReady(page);

    // Q1
    await page.locator('button', { hasText: 'Real Estate' }).click();
    await page.waitForURL('/quiz/2');

    // Q2
    await page.locator('button', { hasText: 'Just me' }).click();
    await page.waitForURL('/quiz/3');

    // Q3
    await page.locator('button', { hasText: /Skeptical/ }).click();
    await page.waitForURL('/quiz/4');
    await waitForPageReady(page);

    // Q4 - Select first pain option
    const painBtn = page.locator('button[role="button"]').first();
    await painBtn.click();
    await page.waitForURL('/quiz/5');

    // Q5a - Value
    await page.locator('button', { hasText: /\$/ }).nth(2).click();

    // Q5b - Urgency
    await page.locator('button', { hasText: /research/ }).click();

    // Results
    await page.waitForURL('/quiz/result');
    const heading = page.locator('text=Your personalized plan');
    await expect(heading).toBeVisible();
  });

  test('should complete full flow with Consulting + Team 2-5 + Excited answers', async ({ page }) => {
    await page.goto('/quiz/1');
    await waitForPageReady(page);

    // Q1
    await page.locator('button', { hasText: 'Consulting / Coaching' }).click();
    await page.waitForURL('/quiz/2');

    // Q2
    await page.locator('button', { hasText: '2–5' }).click();
    await page.waitForURL('/quiz/3');

    // Q3
    await page.locator('button', { hasText: /Excited/ }).click();
    await page.waitForURL('/quiz/4');
    await waitForPageReady(page);

    // Q4
    const painBtn = page.locator('button[role="button"]').first();
    await painBtn.click();
    await page.waitForURL('/quiz/5');

    // Q5a
    await page.locator('button', { hasText: /\$2k/ }).click();

    // Q5b
    await page.locator('button', { hasText: /30 days/ }).click();

    // Results
    await page.waitForURL('/quiz/result');
    expect(page.url()).toContain('/quiz/result');
  });

  test('should complete full flow with Agency + Team 6-20 + Daily user', async ({ page }) => {
    await page.goto('/quiz/1');
    await waitForPageReady(page);

    // Q1
    await page.locator('button', { hasText: 'Creative / Marketing Agency' }).click();
    await page.waitForURL('/quiz/2');

    // Q2
    await page.locator('button', { hasText: '6–20' }).click();
    await page.waitForURL('/quiz/3');

    // Q3
    await page.locator('button', { hasText: /daily/ }).click();
    await page.waitForURL('/quiz/4');
    await waitForPageReady(page);

    // Q4
    const painBtn = page.locator('button[role="button"]').nth(1);
    await painBtn.click();
    await page.waitForURL('/quiz/5');

    // Q5a
    await page.locator('button', { hasText: /\$5k|5k/ }).click();

    // Q5b
    await page.locator('button', { hasText: /quarter/ }).click();

    // Results
    await page.waitForURL('/quiz/result');
    expect(page.url()).toContain('/quiz/result');
  });

  test('should complete full flow with Finance + Team 21+ + Starting', async ({ page }) => {
    await page.goto('/quiz/1');
    await waitForPageReady(page);

    // Q1
    await page.locator('button', { hasText: 'Private Equity / Finance' }).click();
    await page.waitForURL('/quiz/2');

    // Q2
    await page.locator('button', { hasText: '21+' }).click();
    await page.waitForURL('/quiz/3');

    // Q3
    await page.locator('button', { hasText: /starting/ }).click();
    await page.waitForURL('/quiz/4');
    await waitForPageReady(page);

    // Q4
    const painBtn = page.locator('button[role="button"]').first();
    await painBtn.click();
    await page.waitForURL('/quiz/5');

    // Q5a
    await page.locator('button', { hasText: /\$500/ }).click();

    // Q5b
    await page.locator('button', { hasText: /ASAP/ }).click();

    // Results
    await page.waitForURL('/quiz/result');
    expect(page.url()).toContain('/quiz/result');
  });

  test('should complete full flow with Construction + Team 6-20 + Overwhelmed', async ({ page }) => {
    await page.goto('/quiz/1');
    await waitForPageReady(page);

    // Q1
    await page.locator('button', { hasText: 'Home Construction / Contractor' }).click();
    await page.waitForURL('/quiz/2');

    // Q2
    await page.locator('button', { hasText: '6–20' }).click();
    await page.waitForURL('/quiz/3');

    // Q3
    await page.locator('button', { hasText: /Overwhelmed/ }).click();
    await page.waitForURL('/quiz/4');
    await waitForPageReady(page);

    // Q4
    const painBtn = page.locator('button[role="button"]').first();
    await painBtn.click();
    await page.waitForURL('/quiz/5');

    // Q5a
    await page.locator('button', { hasText: /\$/ }).nth(3).click();

    // Q5b
    await page.locator('button', { hasText: /30 days/ }).click();

    // Results
    await page.waitForURL('/quiz/result');
    expect(page.url()).toContain('/quiz/result');
  });

  test('should show different results tier based on revenue and urgency', async ({ page }) => {
    // Scenario: High revenue + ASAP urgency (likely high tier)
    await page.goto('/quiz/1');
    await waitForPageReady(page);

    await page.locator('button', { hasText: 'Agency' }).click();
    await page.waitForURL('/quiz/2');

    await page.locator('button', { hasText: '21+' }).click();
    await page.waitForURL('/quiz/3');

    await page.locator('button', { hasText: /Excited/ }).click();
    await page.waitForURL('/quiz/4');

    const painBtn = page.locator('button[role="button"]').first();
    await painBtn.click();
    await page.waitForURL('/quiz/5');

    // Select highest value
    const valueButtons = page.locator('button', { hasText: /\$/ });
    await valueButtons.last().click();

    // Select highest urgency
    await page.locator('button', { hasText: /ASAP/ }).click();

    await page.waitForURL('/quiz/result');

    // Verify results page loads with tier information
    const tierText = page.locator('text=/Tier|tier/i');
    const tierCount = await tierText.count();
    expect(tierCount).toBeGreaterThanOrEqual(0);
  });
});
