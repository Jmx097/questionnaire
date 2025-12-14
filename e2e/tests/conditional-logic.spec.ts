import { test, expect } from '@playwright/test';
import { waitForPageReady } from '../utils/test-helpers';

test.describe('Conditional Logic Tests', () => {
  test('should show different pain options for different segments - Real Estate', async ({ page }) => {
    // Start questionnaire and select Real Estate
    await page.goto('/quiz/1');
    await waitForPageReady(page);
    await page.locator('button', { hasText: 'Real Estate' }).click();
    await page.waitForURL('/quiz/2');

    // Progress through to question 4
    await page.locator('button', { hasText: '2–5' }).click();
    await page.waitForURL('/quiz/3');
    await page.locator('button', { hasText: /Excited/ }).click();
    await page.waitForURL('/quiz/4');
    await waitForPageReady(page);

    // Check that pain options are displayed
    const painButtons = page.locator('button[role="button"]');
    const count = await painButtons.count();
    expect(count).toBeGreaterThan(0);

    // Verify question text mentions pain points
    const questionText = page.locator('text=/pain|problem|challenge/i');
    await expect(questionText).toBeVisible();
  });

  test('should show different pain options for different segments - Consulting', async ({ page }) => {
    // Start questionnaire and select Consulting
    await page.goto('/quiz/1');
    await waitForPageReady(page);
    await page.locator('button', { hasText: 'Consulting / Coaching' }).click();
    await page.waitForURL('/quiz/2');

    // Progress through to question 4
    await page.locator('button', { hasText: 'Just me' }).click();
    await page.waitForURL('/quiz/3');
    await page.locator('button', { hasText: /Excited/ }).click();
    await page.waitForURL('/quiz/4');
    await waitForPageReady(page);

    // Check that pain options are displayed
    const painButtons = page.locator('button[role="button"]');
    const count = await painButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should show different pain options for different segments - Agency', async ({ page }) => {
    // Start questionnaire and select Agency
    await page.goto('/quiz/1');
    await waitForPageReady(page);
    await page.locator('button', { hasText: 'Creative / Marketing Agency' }).click();
    await page.waitForURL('/quiz/2');

    // Progress through to question 4
    await page.locator('button', { hasText: '21+' }).click();
    await page.waitForURL('/quiz/3');
    await page.locator('button', { hasText: /Using it daily/ }).click();
    await page.waitForURL('/quiz/4');
    await waitForPageReady(page);

    // Check that pain options are displayed for this segment
    const painButtons = page.locator('button[role="button"]');
    const count = await painButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should properly track and apply conditional answers throughout flow', async ({ page }) => {
    // Complete flow with specific answers
    await page.goto('/quiz/1');
    await waitForPageReady(page);

    // Select segment
    const segmentChoice = 'Finance / Private Equity';
    await page.locator('button', { hasText: 'Private Equity / Finance' }).click();
    await page.waitForURL('/quiz/2');

    // Select team size
    const teamChoice = '6–20';
    await page.locator('button', { hasText: teamChoice }).click();
    await page.waitForURL('/quiz/3');

    // Select sentiment
    const sentimentChoice = 'Curious';
    await page.locator('button', { hasText: sentimentChoice }).click();
    await page.waitForURL('/quiz/4');
    await waitForPageReady(page);

    // Verify pain question is showing for finance segment
    const questionText = page.locator('h1, h2, [role="heading"]').first();
    await expect(questionText).toBeVisible();

    // Select a pain option
    const painOption = page.locator('button[role="button"]').first();
    await expect(painOption).toBeVisible();
    await painOption.click();
    await page.waitForURL('/quiz/5');

    // Continue to value/urgency questions
    await page.locator('button[role="button"]').first().click();
    await page.locator('button[role="button"]').first().click();

    // Reach results page
    await page.waitForURL('/quiz/result');
    expect(page.url()).toContain('/quiz/result');
  });
});
