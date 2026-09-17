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

test('card and split service layouts stay symmetric for three through six items', async ({ page }) => {
  test.setTimeout(120000);
  for (const width of [390, 768, 1440]) for (const theme of ['warm-care', 'premium-navy']) for (const count of [3, 4, 5, 6]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`/?theme=${theme}`);
    const rows = await page.locator('.service-grid').evaluate((grid, visibleCount) => {
      [...grid.children].slice(visibleCount).forEach(card => card.remove());
      grid.dataset.count = String(visibleCount);
      const outer = grid.getBoundingClientRect();
      const cards = [...grid.children].map(card => {
        const box = card.getBoundingClientRect();
        return { top: Math.round(box.top), left: box.left, right: box.right, width: box.width, overflow: card.scrollWidth > card.clientWidth };
      });
      return { outer: { left: outer.left, right: outer.right }, cards };
    }, count);
    expect(rows.cards).toHaveLength(count);
    expect(rows.cards.every(card => card.width > 0 && !card.overflow), `${theme}/${count} at ${width}px text fit`).toBe(true);
    const byTop = new Map();
    for (const card of rows.cards) byTop.set(card.top, [...(byTop.get(card.top) || []), card]);
    for (const cards of byTop.values()) {
      const left = Math.min(...cards.map(card => card.left)) - rows.outer.left;
      const right = rows.outer.right - Math.max(...cards.map(card => card.right));
      expect(Math.abs(left - right), `${theme}/${count} at ${width}px row symmetry`).toBeLessThanOrEqual(2);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth), `${theme}/${count} at ${width}px page fit`).toBeLessThanOrEqual(width);
  }
});
