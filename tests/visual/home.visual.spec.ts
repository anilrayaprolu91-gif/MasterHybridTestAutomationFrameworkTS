import { test, expect } from '../../src/fixtures/test-fixtures';

test('@visual home page should remain visually stable', async ({ homePage, page }) => {
  await homePage.open();
  await expect(page).toHaveScreenshot('home-page.png', { fullPage: true });
});
