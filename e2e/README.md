# End-to-End Testing with Playwright

This directory contains end-to-end tests for the questionnaire app using [Playwright](https://playwright.dev/).

## Overview

The E2E test suite covers the following key workflows:

- **Basic Flow**: Loading the app, navigating through questions, and completing the questionnaire
- **Conditional Logic**: Testing that pain options are correctly shown based on business segment selection
- **Results Generation**: Verifying that personalized results are generated correctly for different answer combinations
- **Animations & Interactions**: Testing that animations, transitions, and interactive elements work as expected
- **Multiple Scenarios**: Testing various real-world user scenarios with different answer combinations

## Setup

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Installation

Playwright is already installed as a dev dependency. If you need to reinstall or update it:

```bash
npm install --save-dev @playwright/test
```

## Running Tests

### Run all tests

```bash
npm run test:e2e
```

### Run tests in UI mode (interactive)

```bash
npm run test:e2e:ui
```

This opens an interactive test runner where you can:
- Run individual tests
- Step through tests
- View traces and screenshots
- Debug test failures

### Run tests in headed mode (see browser)

```bash
npm run test:e2e:headed
```

### Run tests in debug mode

```bash
npm run test:e2e:debug
```

### Run specific test file

```bash
npx playwright test e2e/tests/basic-flow.spec.ts
```

### Run specific test

```bash
npx playwright test -g "should complete full questionnaire flow"
```

### Run in specific browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Organization

### `e2e/tests/`

Contains test spec files organized by feature:

- **`basic-flow.spec.ts`**: Core questionnaire flow tests
  - Loading the app
  - Answering individual questions
  - Full questionnaire completion

- **`conditional-logic.spec.ts`**: Conditional rendering tests
  - Different pain options for different business segments
  - Segment-specific question rendering

- **`results-generation.spec.ts`**: Results display and personalization
  - Results page rendering
  - Different results for different answer combinations
  - Action buttons and invite links

- **`animations-interactions.spec.ts`**: UI/UX tests
  - Animation rendering
  - Page transitions
  - Interactive elements
  - Light rays background

- **`multiple-scenarios.spec.ts`**: Comprehensive scenario testing
  - Multiple real-world user journeys
  - Different segment/team size/sentiment combinations
  - Tier differentiation based on responses

### `e2e/utils/`

- **`test-helpers.ts`**: Reusable helper functions for common test operations
  - Navigation helpers
  - Element interaction utilities
  - Wait/assertion helpers

### `e2e/fixtures/`

- **`test-data.ts`**: Test data constants and scenarios
  - Answer options
  - Test user personas
  - Expected outcomes

## Configuration

The Playwright configuration is in `playwright.config.ts` at the root of the project:

### Key Settings

- **Base URL**: `http://localhost:3000`
- **Test Directory**: `e2e/tests`
- **Browsers**: Chromium, Firefox, WebKit
- **Web Server**: Automatically starts Next.js dev server on port 3000
- **Retries**: 2 on CI, 0 locally
- **Screenshots**: Only captured on test failures
- **Traces**: Recorded on first retry

### Running Tests in CI/CD

The Playwright configuration automatically detects CI environments and:
- Runs tests with retries
- Uses a single worker (no parallelization)
- Sets up the dev server appropriately

## Test Writing Guidelines

### Basic Test Structure

```typescript
test.describe('Feature Name', () => {
  test('should do something specific', async ({ page }) => {
    // Arrange
    await page.goto('/quiz/1');
    
    // Act
    await page.locator('button', { hasText: 'Option' }).click();
    
    // Assert
    await expect(page).toHaveURL('/quiz/2');
  });
});
```

### Using Helper Functions

```typescript
import { navigateToQuiz, selectAnswer, waitForPageReady } from '../utils/test-helpers';

test('example test', async ({ page }) => {
  await navigateToQuiz(page, 1);
  await waitForPageReady(page);
  await selectAnswer(page, 'Real Estate');
  // ... continue test
});
```

### Waiting Strategies

- Use `page.waitForURL()` for navigation
- Use `page.waitForLoadState('networkidle')` for network requests
- Use `expect(...).toBeVisible()` for elements
- Use `waitForPageReady()` helper for combined waits

## Debugging Tests

### View Test Traces

After running tests, view detailed traces:

```bash
npx playwright show-trace trace.zip
```

### Debug a Single Test

```bash
npx playwright test e2e/tests/basic-flow.spec.ts --debug
```

### Take Screenshots During Tests

Screenshots are automatically taken on failure. To add custom screenshots:

```typescript
await page.screenshot({ path: 'screenshot.png' });
```

### Check Test Report

After running tests, open the HTML report:

```bash
npx playwright show-report
```

## Expected Test Coverage

The test suite includes:

- ✅ 5+ core workflow tests
- ✅ Tests for conditional logic based on segment selection
- ✅ Results generation with multiple scenarios
- ✅ Animation and interaction tests
- ✅ 5+ end-to-end user journey tests
- ✅ Coverage of both vanilla JS and Next.js components

## Continuous Integration

Tests are designed to run in CI environments with:
- Automatic dev server startup
- Browser compatibility testing (3 browsers)
- Test retries for flakiness
- Detailed failure reporting with screenshots and traces

To run in CI, simply execute:

```bash
npm run test:e2e
```

## Troubleshooting

### Tests timeout

- Increase timeout in `playwright.config.ts`
- Check if dev server is running on port 3000
- Verify network connectivity

### Dev server doesn't start

- Ensure port 3000 is available
- Check Next.js build output for errors
- Try manually running `npm run dev` first

### Flaky tests

- Add explicit waits with `waitForPageReady()`
- Increase timeout for animations
- Use `waitForLoadState('networkidle')`

### Selector not found

- Use the Playwright Inspector to find correct selectors
- Verify the page URL is correct
- Check if element visibility issues (use `isVisible()`)

## Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Test Guide](https://playwright.dev/docs/intro)
- [Selectors Guide](https://playwright.dev/docs/selectors)
- [Debugging Guide](https://playwright.dev/docs/debug)

## Contributing

When adding new tests:

1. Follow the existing test structure
2. Use meaningful test names
3. Add helper functions for repeated patterns
4. Include comments for complex logic
5. Test both happy path and edge cases
6. Ensure tests are deterministic and don't depend on timing
