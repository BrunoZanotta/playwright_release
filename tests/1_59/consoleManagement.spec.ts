import { test } from '../../src/fixtures/fixtures.js';

test.describe('Playwright 1.59 console management — messages, errors, filtering, and clearing', () => {
  test('captures, filters, and clears console messages with timestamps', async ({ loginPage }) => {
    await test.step('Step 1: Navigate and emit console messages', async () => {
      await loginPage.goto();
      await loginPage.emitConsoleMessages();
    });

    await test.step('Step 2: Retrieve all console messages', async () => {
      await loginPage.expectConsoleMessagesCount(3);
    });

    await test.step('Step 3: Filter console messages since navigation', async () => {
      await loginPage.expectConsoleMessagesFiltered(['info-message', 'warn-message', 'error-message']);
    });

    await test.step('Step 4: Verify console message has timestamp', async () => {
      await loginPage.expectLastConsoleMessageTimestamp();
    });

    await test.step('Step 5: Clear console messages', async () => {
      await loginPage.clearAndExpectConsoleCleared();
    });
  });

  test('captures and clears page errors', async ({ loginPage }) => {
    await test.step('Step 1: Navigate and trigger a page error', async () => {
      await loginPage.goto();
      await loginPage.triggerPageError();
    });

    await test.step('Step 2: Retrieve page errors', async () => {
      await loginPage.expectPageErrors(1);
    });

    await test.step('Step 3: Clear page errors', async () => {
      await loginPage.clearAndExpectPageErrorsCleared();
    });
  });
});
