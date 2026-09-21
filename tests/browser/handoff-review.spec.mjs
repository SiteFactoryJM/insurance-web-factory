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

test('header contact boxes are removed and floating icon contacts stay fixed across all themes', async ({ page }) => {
  const themes = ['trust-blue', 'warm-care', 'premium-navy', 'clean-minimal', 'local-friendly'];
  for (const width of [390, 1440]) for (const theme of themes) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/?theme=${theme}`);
    await expect(page.locator('.site-header .direct-contact-actions')).toHaveCount(0);
    const dock = page.locator('[data-floating-contact]');
    await expect(dock).toBeVisible();
    await expect(dock.locator('[data-contact-link="phone"]')).toHaveCount(1);
    await expect(dock.locator('[data-contact-link="kakao"]')).toHaveCount(1);
    await expect(dock.locator('[data-contact-link="instagram"]')).toHaveCount(1);
    const before = await dock.boundingBox();
    await page.evaluate(() => window.scrollTo(0, Math.max(500, document.body.scrollHeight * 0.45)));
    await page.waitForTimeout(50);
    const after = await dock.boundingBox();
    expect(before && after).toBeTruthy();
    expect(Math.abs(after.y - before.y), `${theme} floating dock y at ${width}`).toBeLessThanOrEqual(2);
    expect(Math.abs(after.x - before.x), `${theme} floating dock x at ${width}`).toBeLessThanOrEqual(2);
  }
});

test('desktop portrait heroes keep the brand feature near the photo top and centered in the copy column', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const theme of ['trust-blue', 'warm-care', 'local-friendly']) {
    await page.goto(`/?theme=${theme}`);
    const geometry = await page.locator('.premium-hero').evaluate(hero => {
      const visual = hero.querySelector('.hero-visual').getBoundingClientRect();
      const copy = hero.querySelector('.hero-copy').getBoundingClientRect();
      const logo = hero.querySelector('.hero-brand-feature').getBoundingClientRect();
      return {
        topDelta: Math.abs(logo.top - visual.top),
        centerDelta: Math.abs((logo.left + logo.width / 2) - (copy.left + copy.width / 2)),
        bottomGap: visual.bottom - copy.bottom,
      };
    });
    expect(geometry.topDelta, `${theme} brand top offset`).toBeLessThanOrEqual(16);
    expect(geometry.centerDelta, `${theme} logo center alignment`).toBeLessThanOrEqual(3);
    expect(geometry.bottomGap, `${theme} copy stays inside adviser card bottom`).toBeGreaterThanOrEqual(-2);
  }
});

test('all five hero layouts show Instagram instead of the service shortcut and keep the photo first', async ({ page }) => {
  const themes = ['trust-blue', 'warm-care', 'premium-navy', 'clean-minimal', 'local-friendly'];
  for (const width of [390, 768, 1440]) for (const theme of themes) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`/?theme=${theme}`);
    const instagram = page.locator('.hero-actions [data-contact-link="instagram"]');
    await expect(instagram).toHaveText(/인스타그램/);
    await expect(instagram).toHaveClass(/direct-instagram/);
    await expect(page.locator('.hero-brand-feature img')).toBeVisible();
    await expect(page.locator('.hero-topics')).toContainText('청구서비스');
    await expect(page.locator('.hero-topics')).toContainText('청구 금액 확인');
    await expect(page.locator('.hero-topics')).toContainText('부지급된 보험금 확인');
    await expect(page.locator('.hero-topics')).toContainText('자동차사고');
    await expect(page.locator('.hero-topics')).toContainText('배상책임사고');
    await expect(page.locator('.hero-actions')).not.toContainText('상담 분야 보기');
    const layout = await page.locator('.premium-hero').evaluate(hero => {
      const visual = hero.querySelector('.hero-visual');
      const copy = hero.querySelector('.hero-copy');
      const visualBox = visual.getBoundingClientRect();
      const copyBox = copy.getBoundingClientRect();
      return {
        visualFirst: hero.firstElementChild === visual && visual.nextElementSibling === copy,
        statement: hero.classList.contains('hero-statement'),
        visual: { left: visualBox.left, top: visualBox.top, bottom: visualBox.bottom },
        copy: { left: copyBox.left, top: copyBox.top },
      };
    });
    expect(layout.visualFirst, `${theme} at ${width}px DOM order`).toBe(true);
    if (width <= 900 || layout.statement) expect(layout.visual.top, `${theme} at ${width}px vertical order`).toBeLessThan(layout.copy.top);
    else expect(layout.visual.left, `${theme} at ${width}px horizontal order`).toBeLessThan(layout.copy.left);
    expect(await page.evaluate(() => document.documentElement.scrollWidth), `${theme} at ${width}px page fit`).toBeLessThanOrEqual(width);
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


test('insurance scope uses the approved split directory and compact mobile items', async ({ page }) => {
  const popular = ['실손의료비', '암보험', '뇌심장보험', '치아보험', '자동차보험'];
  const other = ['수술보험', '태아보험', '운전자보험', '상해보험', '배상책임', '화재보험', '치매보험', '간병보험', '펫보험', '여행자보험'];
  const expectedTopics = [...popular, ...other];

  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);

    const section = page.locator('#insurance-scope');
    await expect(section).toBeVisible();
    expect(await page.locator('#specialties + #insurance-scope').count(), `scope order at ${width}px`).toBe(1);
    await expect(section.locator('.insurance-scope-heading .eyebrow')).toHaveText('대표 15가지 상담 분야');
    await expect(section.locator('.insurance-scope-heading .section-support')).toContainText('이 외 모든 보험 종류도 상담 가능합니다.');
    await expect(section.locator('.insurance-scope-popular h3')).toHaveText('많이 찾는 상담');
    await expect(section.locator('.insurance-scope-other h3')).toHaveText('그 외 상담 가능한 보험');
    await expect(section.locator('.insurance-scope-all-note')).toContainText('목록에 없어도 상담 가능합니다.');
    await expect(section.locator('.insurance-scope-arrow')).toHaveCount(0);

    const topics = await section.locator('.insurance-scope-item h4').allTextContents();
    expect(topics.map(label => label.trim())).toEqual(expectedTopics);

    const layout = await section.evaluate(el => {
      const directory = el.querySelector('.insurance-scope-directory');
      const popularList = el.querySelector('.insurance-scope-popular-list');
      const otherList = el.querySelector('.insurance-scope-other-list');
      const directoryBox = directory.getBoundingClientRect();
      const descriptions = [...el.querySelectorAll('.insurance-scope-item p')];
      const items = [...el.querySelectorAll('.insurance-scope-item')];
      const popularSupport = el.querySelector('.insurance-scope-popular .insurance-scope-group-support');
      const popularSupportStyle = getComputedStyle(popularSupport);
      const popularSupportBox = popularSupport.getBoundingClientRect();
      const cardHeights = items.map(node => node.getBoundingClientRect().height);
      return {
        directoryColumns: getComputedStyle(directory).gridTemplateColumns.split(' ').filter(Boolean).length,
        popularColumns: getComputedStyle(popularList).gridTemplateColumns.split(' ').filter(Boolean).length,
        otherColumns: getComputedStyle(otherList).gridTemplateColumns.split(' ').filter(Boolean).length,
        directoryWidth: directoryBox.width,
        descriptionsVisible: descriptions.every(node => getComputedStyle(node).display !== 'none'),
        itemsFit: items.every(node => node.scrollWidth <= node.clientWidth),
        popularSupportFits: popularSupport.scrollWidth <= popularSupport.clientWidth,
        popularSupportLines: popularSupportBox.height / parseFloat(popularSupportStyle.lineHeight),
        cardHeightDelta: Math.max(...cardHeights) - Math.min(...cardHeights),
        overflow: el.scrollWidth > el.clientWidth,
      };
    });

    expect(layout.directoryColumns, `directory columns at ${width}px`).toBe(width <= 900 ? 1 : 2);
    expect(layout.popularColumns, `popular columns at ${width}px`).toBe(width <= 900 ? 2 : 1);
    expect(layout.otherColumns, `other columns at ${width}px`).toBe(2);
    expect(layout.descriptionsVisible, `description visibility at ${width}px`).toBe(width > 650);
    expect(layout.itemsFit, `scope item fit at ${width}px`).toBe(true);
    expect(layout.overflow, `scope overflow at ${width}px`).toBe(false);
    if (width === 1440) {
      expect(layout.directoryWidth, 'desktop scope width').toBeLessThanOrEqual(994);
      expect(layout.popularSupportFits, 'popular support fits one line').toBe(true);
      expect(layout.popularSupportLines, 'popular support line count').toBeLessThanOrEqual(1.15);
      expect(layout.cardHeightDelta, 'desktop insurance card height delta').toBeLessThanOrEqual(1);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth), `page overflow at ${width}px`).toBeLessThanOrEqual(width);
  }

  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const palette of ['navy', 'forest', 'teal', 'charcoal', 'stone', 'slate']) {
    await page.goto(`/?palette=${palette}`);
    const appearance = await page.locator('#insurance-scope').evaluate(section => {
      const directory = section.querySelector('.insurance-scope-directory');
      const note = section.querySelector('.insurance-scope-all-note');
      const icon = section.querySelector('.insurance-scope-icon');
      const directoryBox = directory.getBoundingClientRect();
      const noteBox = note.getBoundingClientRect();
      const probe = document.createElement('span');
      probe.style.color = 'var(--accent)';
      section.append(probe);
      const expectedAccent = getComputedStyle(probe).color;
      probe.remove();
      return {
        directoryCenter: directoryBox.left + directoryBox.width / 2,
        noteCenter: noteBox.left + noteBox.width / 2,
        iconUsesAccent: getComputedStyle(icon).color === expectedAccent,
        overflow: section.scrollWidth > section.clientWidth,
      };
    });
    expect(Math.abs(appearance.directoryCenter - 720), `${palette} directory centering`).toBeLessThanOrEqual(2);
    expect(Math.abs(appearance.noteCenter - appearance.directoryCenter), `${palette} note centering`).toBeLessThanOrEqual(2);
    expect(appearance.iconUsesAccent, `${palette} icon accent token`).toBe(true);
    expect(appearance.overflow, `${palette} scope overflow`).toBe(false);
  }
});

test('intro principle stays concise and service rules are consistent across all five themes', async ({ page }) => {
  test.setTimeout(120000);
  const themes = ['trust-blue', 'warm-care', 'premium-navy', 'clean-minimal', 'local-friendly'];

  for (const theme of themes) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`/?theme=${theme}`);
    await page.evaluate(() => document.fonts.ready);

    const cards = page.locator('.service-grid .service-card');
    expect(await cards.count(), `${theme} service card count`).toBeGreaterThanOrEqual(3);
    const rules = await cards.evaluateAll(items => items.map(el => {
      const style = getComputedStyle(el);
      const accent = getComputedStyle(el, '::after');
      return {
        top: style.borderTopWidth,
        left: style.borderLeftWidth,
        right: style.borderRightWidth,
        bottom: style.borderBottomWidth,
        accent: accent.borderTopWidth,
        opacity: Number(accent.opacity),
        overflow: el.scrollWidth > el.clientWidth,
      };
    }));
    expect(rules.every(rule => rule.top === '1px' && rule.left === '0px' && rule.right === '0px' && rule.bottom === '0px'), `${theme} baseline rules`).toBe(true);
    expect(rules.every(rule => rule.accent === '3px' && rule.opacity === 0 && !rule.overflow), `${theme} accent rules`).toBe(true);

    await cards.first().hover();
    await expect.poll(() => cards.first().evaluate(el => Number(getComputedStyle(el, '::after').opacity))).toBeGreaterThan(0.9);

    if (theme === 'premium-navy') {
      const surfaces = await cards.evaluateAll(items => items.slice(0,2).map(el => getComputedStyle(el).backgroundColor));
      expect(new Set(surfaces).size, 'premium-navy first card should not become a boxed exception').toBe(1);
    }
  }

  await page.goto('/?theme=warm-care');
  const headerRole = (await page.locator('.brand-service').textContent())?.trim();
  expect(headerRole).toBeTruthy();
  expect(headerRole).not.toBe('보험상담');

  const principle = page.locator('.adviser-principle');
  await expect(principle).toBeVisible();
  await expect(principle.locator('h3')).toHaveCount(1);
  await expect(principle.locator('.adviser-principle-body')).toHaveCount(1);
  expect(await principle.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);

  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto('/?theme=warm-care');
  const mobile = await page.locator('.adviser-principle').evaluate(el => ({
    overflow: el.scrollWidth > el.clientWidth,
    copyDisplay: getComputedStyle(el.querySelector('.adviser-principle-copy')).display,
  }));
  expect(mobile.overflow).toBe(false);
  expect(mobile.copyDisplay).toBe('block');
});
