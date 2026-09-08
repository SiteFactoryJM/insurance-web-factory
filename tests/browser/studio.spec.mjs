import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';

const field = (page, path) => page.locator(`[data-field="${path}"]`);
const frame = page => page.frameLocator('#site-preview');
const step = (page, index) => page.locator(`.step-tab[data-step="${index}"]`).click();
async function start(page) {
  await page.setViewportSize({width:1440,height:1000});
  await page.goto('/studio');
  await expect(page.locator('#panel-0')).toBeVisible();
  page.on('dialog',dialog => dialog.accept());
}
async function example(page) { await page.locator('[data-action="example"]').click(); await expect(frame(page).locator('body')).toHaveAttribute('data-studio-preview','true'); }
async function save(page) {
  const pending=page.waitForEvent('download');
  await page.locator('[data-action="export"]').first().click();
  const download=await pending;
  return {project:JSON.parse(await fs.readFile(await download.path(),'utf8')),download};
}
async function choose(page,key,value) {
  const input=page.locator(`[data-design="${key}"][value="${value}"]`);
  const details=input.locator('xpath=ancestor::details');
  if(await details.count()) await details.evaluate(el=>el.open=true);
  await input.check();
}

test('examples populate editable fields and footer changes reach the actual preview',async({page})=>{
  await start(page);await step(page,1);
  await expect(field(page,'agent.name')).toHaveValue('');
  await page.locator('[data-example="profile"]').click();
  await expect(field(page,'agent.name')).toHaveValue('이윤복');
  await example(page);await field(page,'agent.name').fill('김서연');
  await expect(frame(page).locator('.brand strong')).toContainText('김서연');
  await step(page,2);await field(page,'footer.heading').fill('김서연 보험상담');
  await field(page,'agent.businessNumber').fill('123-45-67890');
  await field(page,'contact.email').fill('advisor@example.com');
  await field(page,'contact.officeAddress').fill('서울특별시 중구 상담로 12');
  await expect(frame(page).locator('#footer')).toContainText('김서연 보험상담');
  await expect(frame(page).locator('#footer')).toContainText('123-45-67890');
  await expect(frame(page).locator('#footer')).toContainText('advisor@example.com');
  await expect(frame(page).locator('.sample-bar')).toHaveCount(0);
  const {project}=await save(page);
  expect(project.site.contact.officeAddress).toBe('서울특별시 중구 상담로 12');
  expect(project.site.footer.heading).toBe('김서연 보험상담');
});

test('patterns, order, hidden sections and real device widths work independently',async({page})=>{
  await start(page);await example(page);
  for(const value of ['portrait','statement','editorial']) { await choose(page,'hero',value); await expect(frame(page).locator(`.hero-${value}`)).toHaveCount(1); }
  for(const value of ['cards','split','list']) { await choose(page,'services',value); await expect(frame(page).locator(`[data-pattern="services-${value}"]`)).toHaveCount(1); }
  for(const value of ['profile','quote','editorial']) { await choose(page,'about',value); await expect(frame(page).locator(`[data-pattern="about-${value}"]`)).toHaveCount(1); }
  await choose(page,'faq','columns');await expect(frame(page).locator('.faq-list details:not([open])')).toHaveCount(0);
  await choose(page,'process','timeline');await expect(frame(page).locator('.process-timeline')).toHaveCount(1);
  await page.locator('[data-move="about"][data-direction="-1"]').click();
  await expect(frame(page).locator('#about + #specialties')).toHaveCount(1);
  await page.locator('[data-section="contact"]').uncheck();await page.locator('[data-section="services"]').uncheck();
  await expect(frame(page).locator('#contact')).toHaveCount(0);await expect(frame(page).locator('#specialties')).toHaveCount(0);
  await expect(frame(page).locator('.hero-actions .button')).toHaveAttribute('href','#footer');
  await expect(frame(page).locator('.hero-actions .text-link')).toHaveAttribute('href','#footer');
  await page.locator('[data-device="mobile"]').click();
  await expect.poll(()=>frame(page).locator('body').evaluate(()=>innerWidth)).toBe(390);
  await expect(frame(page).locator('h1 .copy-mobile')).toBeVisible();
  await page.locator('[data-device="desktop"]').click();
  await expect.poll(()=>frame(page).locator('body').evaluate(()=>innerWidth)).toBe(1440);
  await expect(frame(page).locator('h1 .copy-desktop')).toBeVisible();
  await step(page,2);
  for(const value of ['columns','minimal','classic']) { await choose(page,'footer',value);await expect(frame(page).locator(`[data-pattern="footer-${value}"]`)).toHaveCount(1); }
});

test('copy limits count Unicode and block saving without truncating the draft',async({page})=>{
  await start(page);await example(page);await step(page,1);
  await field(page,'hero.mobileHeadline').fill('가😀');
  await expect(page.locator('[data-count="hero.mobileHeadline"]')).toHaveText('2 / 24');
  await field(page,'hero.mobileHeadline').fill('가'.repeat(25));
  await page.locator('[data-action="export"]').first().click();
  await expect(page.locator('#studio-errors')).toContainText('24');
  await step(page,1);await expect(field(page,'hero.mobileHeadline')).toHaveValue('가'.repeat(25));
  await field(page,'hero.mobileHeadline').fill('내일을 위한 상담');
  const {project}=await save(page);expect(project.site.hero.mobileHeadline).toBe('내일을 위한 상담');
});

test('uploaded photos and editable content survive download, reload and import without storage or submission',async({page})=>{
  await start(page);await example(page);await step(page,1);
  const requests=[];page.on('request',request=>{if(['xhr','fetch','ping'].includes(request.resourceType())||request.method()==='POST')requests.push(request.url());});
  await field(page,'agent.name').fill('복원 테스트');
  const photo=await fs.readFile('public/assets/atelier-interior.webp');
  await page.locator('#profile-upload').setInputFiles({name:'profile.webp',mimeType:'image/webp',buffer:photo});
  await expect(page.locator('.upload-thumb')).toHaveAttribute('src',/^data:image\/webp;base64,/);
  const {project}=await save(page);
  expect(project.site.agent.profileImage).toMatch(/^data:image\/webp;base64,/);
  expect(project.site.seo.ogImage).toBe(project.site.agent.profileImage);
  expect(project.site.status).toBe('draft');expect(project.site.seo.noIndex).toBe(true);
  expect(project.site.domains).toEqual([]);expect(project.site.demo.submissionMode).toBe('discard');
  await page.reload();await step(page,1);await expect(field(page,'agent.name')).toHaveValue('');
  await page.locator('#project-file').setInputFiles({name:'draft.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(project))});
  await expect(field(page,'agent.name')).toHaveValue('복원 테스트');
  await expect(frame(page).locator('.hero-adviser img')).toHaveAttribute('src',project.site.agent.profileImage);
  expect(requests).toEqual([]);
  expect(await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length}))).toEqual({local:0,session:0});
});

test('malformed and executable project files preserve the current edits',async({page})=>{
  await start(page);await example(page);await step(page,1);await field(page,'agent.name').fill('유지할 이름');
  const {project}=await save(page);project.site.hero.image='javascript:alert(1)';
  for(const content of ['{not json}',JSON.stringify(project)]) {
    await page.locator('#project-file').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from(content)});
    await expect(page.locator('#studio-errors')).toBeVisible();
    await step(page,1);await expect(field(page,'agent.name')).toHaveValue('유지할 이름');
  }
});

test('PDF action prints a complete production brief with both versions of copy',async({page})=>{
  await start(page);await example(page);
  await page.evaluate(()=>{
    window.__printCount=0;
    const append=Element.prototype.append;
    Element.prototype.append=function(...nodes){
      for(const node of nodes) if(node instanceof HTMLIFrameElement && node.id==='print-brief') {
        const onload=node.onload;
        node.onload=event=>{node.contentWindow.print=()=>window.__printCount++;onload.call(node,event);};
      }
      return append.apply(this,nodes);
    };
  });
  await page.locator('[data-action="print"]').first().click();
  await expect.poll(()=>page.evaluate(()=>window.__printCount)).toBe(1);
  const brief=page.frameLocator('#print-brief');
  await expect(brief.locator('body')).toContainText('상담 페이지 제작 의뢰서');
  await expect(brief.locator('body')).toContainText('보험을 넘어,');
  await expect(brief.locator('body')).toContainText('당신의 내일을');
  await expect(brief.locator('body')).toContainText('푸터와 연락처');
  await expect(brief.locator('body')).toContainText('모바일');
  await expect(brief.locator('body')).toContainText('보험 고지');
  await expect(page.locator('#studio-status')).toContainText('PDF로 저장');
});

test('editor stays accessible across all five widths and supports keyboard step navigation',async({page})=>{
  test.setTimeout(90000);
  await start(page);
  for(const width of [320,360,390,768,1440]) {
    await page.setViewportSize({width,height:1000});
    for(const index of [0,1,2,3]) {
      await step(page,index);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      if([390,1440].includes(width)) {
        const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
        expect(result.violations).toEqual([]);
      }
    }
    if(width<901) {
      await page.locator('button[data-view="preview"]').click();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await expect.poll(()=>frame(page).locator('body').evaluate(()=>innerWidth)).toBe(1440);
      await page.locator('button[data-view="editor"]').click();
    }
  }
  await page.locator('.step-tab[data-step="3"]').focus();await page.keyboard.press('Home');
  await expect(page.locator('.step-tab[data-step="0"]')).toBeFocused();
  await page.keyboard.press('ArrowRight');await expect(page.locator('#panel-1')).toBeVisible();
});
