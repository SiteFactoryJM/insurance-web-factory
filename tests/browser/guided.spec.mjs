import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';

const preview = page => page.frameLocator('#studio-frame');

async function start(page){
  await page.setViewportSize({width:1440,height:1000});
  await page.goto('/studio?site=agent-kim');
  await expect(page.locator('[data-field="agent.name"]')).toHaveValue('김경현');
  await expect(preview(page).locator('body')).toHaveAttribute('data-layout','warm-care');
}

test('studio exposes only fixed-layout settings and keeps the current page structure',async({page})=>{
  await start(page);
  await expect(page.locator('[data-template]')).toHaveCount(0);
  await expect(page.locator('[data-purpose]')).toHaveCount(0);
  await expect(page.locator('[name="copy-choice"]')).toHaveCount(0);
  await expect(page.getByText('레이아웃: warm-care')).toBeVisible();
  await expect(preview(page).locator('body')).toHaveAttribute('data-heading-font','noto-sans-kr');
  await expect(preview(page).locator('.hero-brand-watermark')).toBeVisible();
  await expect(preview(page).locator('#recruit')).toBeVisible();
});

test('information settings update the fixed preview immediately',async({page})=>{
  await start(page);
  await page.locator('[data-field="agent.name"]').fill('설정 확인 담당자');
  await page.locator('[data-field="agent.title"]').fill('지점장');
  await page.locator('[data-field="agent.company"]').fill('설정용 지사');
  await page.locator('[data-field="contact.phone"]').fill('010-1111-2222');
  await page.locator('[data-field="contact.kakaoUrl"]').fill('https://open.kakao.com/o/TestInvite');
  await page.locator('[data-field="contact.instagramUrl"]').fill('https://instagram.com/test.agent');
  await expect(preview(page).locator('.brand')).toContainText('설정 확인 담당자');
  await expect(preview(page).locator('#recruit')).toContainText('설정 확인 담당자');
  await expect(preview(page).locator('[data-contact-link="phone"]').first()).toHaveAttribute('href','tel:01011112222');
  await expect(preview(page).locator('[data-contact-link="kakao"]').first()).toHaveAttribute('href','https://open.kakao.com/o/TestInvite');
});

test('palette changes while layout, font and watermark stay fixed',async({page})=>{
  await start(page);
  await page.locator('[data-field="palette"]').selectOption('teal');
  await expect(preview(page).locator('body')).toHaveAttribute('data-palette','teal');
  await expect(preview(page).locator('body')).toHaveAttribute('data-layout','warm-care');
  await expect(preview(page).locator('body')).toHaveAttribute('data-heading-font','noto-sans-kr');
  await expect(preview(page).locator('.hero-brand-watermark')).toBeVisible();
});

test('header and footer logo uploads are independent and Haeon watermark remains fixed',async({page})=>{
  await start(page);
  const headerPng=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aPioAAAAASUVORK5CYII=','base64');
  const footerPng=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aPioAAAAASUVORK5CYII=','base64');
  await page.locator('[data-image="headerLogo"]').setInputFiles({name:'header.png',mimeType:'image/png',buffer:headerPng});
  await page.locator('[data-image="footerLogo"]').setInputFiles({name:'footer.png',mimeType:'image/png',buffer:footerPng});
  await expect(preview(page).locator('.brand-logo')).toHaveAttribute('src',/^data:image\/png;base64,/);
  await expect(preview(page).locator('.footer-brand-logo')).toHaveAttribute('src',/^data:image\/png;base64,/);
  const watermark=await preview(page).locator('.recruit-watermark').getAttribute('src');
  expect(watermark).toBe('/assets/haeon-watermark-wave.png');
});

test('site.json download contains edited values and fixed design contract',async({page})=>{
  await start(page);
  await page.locator('[data-field="agent.name"]').fill('내보내기 담당자');
  await page.locator('[data-field="palette"]').selectOption('stone');
  const pending=page.waitForEvent('download');
  await page.locator('[data-action="download"]').click();
  const download=await pending;
  const json=JSON.parse(await fs.readFile(await download.path(),'utf8'));
  expect(json.agent.name).toBe('내보내기 담당자');
  expect(json.palette).toBe('stone');
  expect(json.template).toBe('warm-care');
  expect(json.headingFont).toBe('noto-sans-kr');
  expect(json.hero.brandLayout).toBe('watermark');
  expect(json.sections.recruitment).toBe(true);
  expect(json.design).toBeUndefined();
});

test('preview can expand and studio remains accessible at desktop and tablet widths',async({page})=>{
  await start(page);
  await page.locator('[data-action="expand"]').click();
  await expect(page.locator('#studio-preview')).toHaveAttribute('data-expanded','true');
  await page.locator('[data-action="close"]').click();
  await expect(page.locator('#studio-preview')).toHaveAttribute('data-expanded','false');
  for(const width of [768,1024,1440]){
    await page.setViewportSize({width,height:900});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze();
  expect(result.violations).toEqual([]);
});
