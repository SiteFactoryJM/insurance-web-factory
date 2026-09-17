import { test, expect } from '@playwright/test';

test('handoff pages fit five widths and retain full text at 200 percent', async ({ page }, testInfo) => {
  test.setTimeout(180000);
  for (const path of ['/', '/templates', '/proposal', '/privacy', '/studio']) {
    await page.goto(path);
    await page.evaluate(() => document.fonts.ready);
    for (const width of [320, 360, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth), `${path} at ${width}`).toBeLessThanOrEqual(width);
      const name = `${path.replaceAll('/', '-') || 'home'}-${width}`;
      await page.screenshot({ path: testInfo.outputPath(`${name}.png`), fullPage: false });
      if ([390, 1440].includes(width)) await page.screenshot({ path: testInfo.outputPath(`${name}-full.png`), fullPage: true });
      const zoom = await page.addStyleTag({ content: 'html{font-size:200% !important}' });
      expect(await page.evaluate(() => document.documentElement.scrollWidth), `${path} enlarged at ${width}`).toBeLessThanOrEqual(width);
      await zoom.evaluate(style => style.remove());
    }
  }
});

test('normal contact links permit navigation while automated checks never follow them', async ({ page }) => {
  await page.goto('/');
  // Observe whether the application cancels the click, then cancel the default
  // ourselves. This never opens a telephone app or contacts a real chat room.
  for (const kind of ['phone', 'kakao']) {
    const allowed = await page.locator(`.hero-actions [data-contact-link="${kind}"]`).evaluate(link => {
      let allowed = false;
      window.addEventListener('click', event => {
        allowed = !event.defaultPrevented;
        event.preventDefault();
      }, { once: true });
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      return allowed;
    });
    expect(allowed).toBe(true);
  }
});
