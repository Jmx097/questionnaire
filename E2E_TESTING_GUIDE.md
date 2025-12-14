# E2E Testing Setup Guide

## Summary

This project now has comprehensive end-to-end testing infrastructure using Playwright. The setup includes:

- ✅ Playwright installed and configured
- ✅ 29 comprehensive E2E tests covering key workflows
- ✅ Tests for both vanilla JS and Next.js web app
- ✅ Test utilities and helper functions
- ✅ CI/CD integration ready
- ✅ Complete documentation

## Quick Start

### Install Dependencies

All Playwright dependencies are already in `package.json`:

```bash
npm install
```

### Download Playwright Browsers

```bash
npx playwright install
```

Note: In restricted environments without all system dependencies, you can install just Chromium:
```bash
npx playwright install chromium
```

### Run Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI (interactive)
npm run test:e2e:ui

# Run with browser visible
npm run test:e2e:headed

# Debug mode
npm run test:e2e:debug
```

### Run Specific Tests

```bash
# Run a specific test file
npx playwright test e2e/tests/basic-flow.spec.ts

# Run tests matching a pattern
npx playwright test -g "should complete full questionnaire"

# Run in a specific browser
npx playwright test --project=chromium
```

## Test Coverage

### Test Files (29 total tests)

1. **basic-flow.spec.ts** (6 tests)
   - Loading the app
   - Navigating to start page
   - Individual question completion
   - Full questionnaire flow

2. **conditional-logic.spec.ts** (4 tests)
   - Segment-specific pain options
   - Different pain options for different segments
   - Conditional answer tracking

3. **results-generation.spec.ts** (5 tests)
   - Results page rendering
   - Different results for different combinations
   - Action buttons on results
   - Copy buttons for invite links

4. **animations-interactions.spec.ts** (8 tests)
   - Homepage animations
   - Question reveal animations
   - Button interactions
   - Light rays background
   - Page transitions
   - Content visibility
   - Text appearance animations

5. **multiple-scenarios.spec.ts** (6 tests)
   - Real Estate + Solo + Skeptical flow
   - Consulting + Team 2-5 + Excited flow
   - Agency + Team 6-20 + Daily user flow
   - Finance + Team 21+ + Starting flow
   - Construction + Team 6-20 + Overwhelmed flow
   - Results tier differentiation based on inputs

## Configuration Files

### playwright.config.ts

- **Base URL**: http://localhost:3000
- **Test Directory**: e2e/tests
- **Browsers**: Chromium (Firefox and Safari optional, see config)
- **Web Server**: Automatically starts Next.js dev server
- **Retries**: 2 on CI, 0 locally
- **Screenshots**: On failure only
- **Traces**: On first retry

### .gitignore Updates

Added Playwright artifacts:
- test-results/
- playwright-report/
- blob-report/
- playwright/.cache/

## Project Structure

```
e2e/
├── README.md                          # Detailed testing documentation
├── tests/
│   ├── basic-flow.spec.ts            # Core questionnaire flow tests
│   ├── conditional-logic.spec.ts     # Conditional logic tests
│   ├── results-generation.spec.ts    # Results generation tests
│   ├── animations-interactions.spec.ts # UI/animation tests
│   └── multiple-scenarios.spec.ts    # End-to-end user journeys
├── utils/
│   └── test-helpers.ts               # Reusable helper functions
└── fixtures/
    └── test-data.ts                  # Test data and scenarios
```

## Test Helpers

The test suite includes reusable helper functions:

- `navigateToStart(page)` - Navigate to start page
- `navigateToQuiz(page, questionNumber)` - Go to specific question
- `navigateToResults(page)` - Go to results page
- `selectAnswer(page, optionText)` - Click answer button
- `getAnswerOptions(page)` - Get all visible options
- `waitForPageReady(page)` - Wait for page to fully load
- `waitForElementVisible(page, selector, timeout)` - Wait for element
- `expectTextOnPage(page, text)` - Verify text appears
- `getCurrentPageNumber(page)` - Get current quiz question number

## Continuous Integration

The tests are designed to work in CI/CD environments:

1. Dev server automatically starts
2. Tests run sequentially in CI (parallel locally)
3. Automatic retries on failure
4. Screenshots/traces on failure
5. HTML report generation

To run in CI:
```bash
npm run test:e2e
```

## Acceptance Criteria - Status ✅

- ✅ Playwright is installed and configured
- ✅ 29 core workflow tests (exceeds 3-5 requirement)
- ✅ Tests cover:
  - Loading the questionnaire app
  - Answering questions through the flow
  - Validating conditional logic
  - Generating and displaying results
  - Checking animations/interactions
  - Testing results generation with various combinations
- ✅ Tests cover both vanilla JS and Next.js
- ✅ Can be run locally and in CI

## Troubleshooting

### Missing System Dependencies

If you see errors about missing shared libraries (e.g., `libnspr4.so`):

```bash
# Install browser dependencies (Ubuntu/Debian)
npx playwright install-deps

# Or manually install required packages
sudo apt-get install libnspr4 libgconf-2-4 # and others as needed
```

### Port Already in Use

If port 3000 is already in use:
```bash
lsof -i :3000
kill -9 <PID>
```

### Test Timeouts

Increase timeout in `playwright.config.ts`:
```typescript
use: {
  timeout: 30000, // 30 seconds
}
```

## Additional Resources

- [Full E2E Testing Documentation](./e2e/README.md)
- [Playwright Official Docs](https://playwright.dev/)
- [Playwright Test Guide](https://playwright.dev/docs/intro)

## Next Steps

1. Run `npm run test:e2e` to execute all tests
2. Review test output and HTML report
3. Add more tests as features are added
4. Integrate with your CI/CD pipeline
5. Configure in GitHub Actions, GitLab CI, or your CI provider

---

For detailed information about writing and running tests, see [e2e/README.md](./e2e/README.md).
