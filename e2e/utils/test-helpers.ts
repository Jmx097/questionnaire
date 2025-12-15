import { Page, expect } from '@playwright/test';

/**
 * Helper function to navigate to the start page
 */
export async function navigateToStart(page: Page) {
  await page.goto('/start');
  await page.waitForLoadState('networkidle');
}

/**
 * Helper function to navigate to quiz question
 */
export async function navigateToQuiz(page: Page, questionNumber: number) {
  await page.goto(`/quiz/${questionNumber}`);
  await page.waitForLoadState('networkidle');
}

/**
 * Helper function to navigate to results page
 */
export async function navigateToResults(page: Page) {
  await page.goto('/quiz/result');
  await page.waitForLoadState('networkidle');
}

/**
 * Helper function to select an answer option
 */
export async function selectAnswer(page: Page, optionText: string) {
  const button = page.locator('button', { hasText: optionText });
  await expect(button).toBeVisible();
  await button.click();
}

/**
 * Helper function to get all visible answer options
 */
export async function getAnswerOptions(page: Page): Promise<string[]> {
  const buttons = page.locator('button[role="button"]');
  const count = await buttons.count();
  const options = [];
  for (let i = 0; i < count; i++) {
    const text = await buttons.nth(i).textContent();
    if (text) {
      options.push(text.trim());
    }
  }
  return options;
}

/**
 * Helper function to wait for page to be fully loaded
 */
export async function waitForPageReady(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500); // Give animations time to settle
}

/**
 * Helper function to check if an element is visible with animation
 */
export async function waitForElementVisible(page: Page, selector: string, timeout = 5000) {
  const element = page.locator(selector);
  await expect(element).toBeVisible({ timeout });
  return element;
}

/**
 * Helper function to check if text appears on page
 */
export async function expectTextOnPage(page: Page, text: string) {
  const locator = page.locator(`text=${text}`);
  await expect(locator).toBeVisible();
}

/**
 * Helper function to get the current page URL
 */
export async function getCurrentPageNumber(page: Page): Promise<number> {
  const url = page.url();
  const match = url.match(/\/quiz\/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}
