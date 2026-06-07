import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'frontend-refactored.png', fullPage: true });
  await browser.close();
  console.log("Screenshot saved.");
})();
