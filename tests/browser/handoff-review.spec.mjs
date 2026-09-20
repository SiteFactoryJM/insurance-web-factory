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

test('list, card and split service layouts stay symmetric with complete and partial rows', async ({ page }) => {
  test.setTimeout(120000);
  for (const width of [390, 768, 1440]) for (const theme of ['trust-blue', 'warm-care', 'premium-navy']) for (const count of [3, 4, 5, 6, 7, 8]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`/?theme=${theme}`);
    const rows = await page.locator('.service-grid').evaluate((grid, visibleCount) => {
      while (grid.children.length < visibleCount) grid.append(grid.firstElementChild.cloneNode(true));
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

test('consumer sections group headings and copy within balanced reading widths', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const layout = await page.evaluate(() => {
    const box = selector => {
      const r = document.querySelector(selector).getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width };
    };
    return {
      headings: ['#specialties', '#process', '#faq'].map(id => box(`${id} .section-heading`)),
      supports: ['#specialties', '#process'].map(id => ({ title: box(`${id} h2`), copy: box(`${id} .section-support`) })),
      portrait: box('.portrait-figure'), card: box('.hero-visual .adviser-card'),
      sections: [box('#specialties'), box('#faq .faq-list'), box('#about .about-copy'), box('#contact .direct-contact-panel')],
      steps: [...document.querySelectorAll('.process-grid li')].map(el => ({ top: el.getBoundingClientRect().top, width: el.getBoundingClientRect().width })),
    };
  });
  for (const b of [...layout.headings, ...layout.sections]) expect(Math.abs((b.left + b.right) / 2 - 720)).toBeLessThanOrEqual(2);
  for (const item of layout.supports) expect(item.copy.top - item.title.bottom).toBeLessThanOrEqual(16);
  for (const [i, width] of [1120, 880, 800, 780].entries()) expect(layout.sections[i].width).toBeLessThanOrEqual(width);
  expect(Math.abs(layout.portrait.left - layout.card.left)).toBeLessThanOrEqual(1);
  expect(Math.abs(layout.portrait.width - layout.card.width)).toBeLessThanOrEqual(1);
  expect(new Set(layout.steps.map(step => Math.round(step.top))).size).toBe(1);
  expect(Math.max(...layout.steps.map(step => step.width)) - Math.min(...layout.steps.map(step => step.width))).toBeLessThanOrEqual(1);
});


test('adviser principles, header title and service rules stay consistent', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/?theme=warm-care');
  await page.evaluate(() => document.fonts.ready);

  const headerRole = (await page.locator('.brand-service').textContent())?.trim();
  expect(headerRole).toBeTruthy();
  expect(headerRole).not.toBe('보험상담');

  const principles = page.locator('.adviser-principles');
  await expect(principles).toBeVisible();
  await expect(principles.locator('.adviser-principles-list > li')).toHaveCount(4);
  expect(await principles.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);

  await page.goto('/?theme=clean-minimal');
  const cards = page.locator('.services-cards .service-card');
  expect(await cards.count()).toBeGreaterThanOrEqual(4);
  const defaultRule = await cards.first().evaluate(el => {
    const style = getComputedStyle(el);
    const accent = getComputedStyle(el, '::after');
    return { borderTopWidth: style.borderTopWidth, accentOpacity: accent.opacity, accentWidth: accent.borderTopWidth };
  });
  expect(defaultRule.borderTopWidth).toBe('1px');
  expect(Number(defaultRule.accentOpacity)).toBe(0);
  expect(defaultRule.accentWidth).toBe('3px');

  await cards.first().hover();
  await expect.poll(() => cards.first().evaluate(el => Number(getComputedStyle(el, '::after').opacity))).toBeGreaterThan(0.9);

  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto('/?theme=warm-care');
  const mobilePrinciples = await page.locator('.adviser-principles-list').evaluate(el => ({
    columns: getComputedStyle(el).gridTemplateColumns,
    overflow: el.scrollWidth > el.clientWidth,
  }));
  expect(mobilePrinciples.overflow).toBe(false);
  expect(mobilePrinciples.columns.split(' ').length).toBe(1);
});
