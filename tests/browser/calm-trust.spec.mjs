import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const themes=['trust-blue','warm-care','premium-navy','clean-minimal','local-friendly'];
const palettes=['navy','forest','slate','charcoal','teal','stone'];
const tags=['wcag2a','wcag2aa','wcag21aa','wcag22aa'];
async function directLinks(page){
 const hero=page.locator('.hero-actions');
 await expect(hero.locator('[data-contact-link="phone"]')).toHaveAttribute('href','tel:01041877511');
 await expect(hero.locator('[data-contact-link="kakao"]')).toHaveAttribute('href','https://open.kakao.com/o/sH6OIpKi');
 await expect(hero.locator('[data-contact-link="kakao"]')).toHaveAttribute('rel',/noopener/);
 await expect(hero.locator('[data-contact-link="kakao"]')).toHaveAttribute('target','_blank');
 await expect(page.locator('[data-contact-form], input[name="phone"], textarea')).toHaveCount(0);
}
for(const theme of themes)test(`${theme}: responsive direct contact at five widths`,async({page},testInfo)=>{
 test.setTimeout(120000);await page.goto(`/?theme=${theme}`);await directLinks(page);
 for(const width of [320,360,390,768,1440]){
  await page.setViewportSize({width,height:1000});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  for(const link of await page.locator('.hero-actions [data-contact-link]').all()){
   await expect(link).toBeVisible();const b=await link.boundingBox();expect(b.height).toBeGreaterThanOrEqual(44);
  }
  if([390,1440].includes(width)){
   const result=await new AxeBuilder({page}).withTags(tags).analyze();expect(result.violations).toEqual([]);
   await testInfo.attach(`${theme}-${width}`,{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
  }
 }
});
test('all thirty layout/color combinations show complete copy and actual links',async({page})=>{
 test.setTimeout(120000);
 for(const theme of themes)for(const palette of palettes){
  await page.goto(`/?theme=${theme}&palette=${palette}`);await directLinks(page);
  await expect(page.locator('body')).toHaveAttribute('data-layout',theme);await expect(page.locator('body')).toHaveAttribute('data-palette',palette);
  await expect(page.locator('h1')).toHaveCount(1);expect(await page.locator('h1').textContent()).not.toContain('undefined');
 }
});
test('phone and open chat links also work without JavaScript',async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:1000}});
 try{const page=await context.newPage();await page.goto('/');await directLinks(page);
  // 자바스크립트 없이도 번호와 두 연락 버튼이 그대로 보인다.
  await expect(page.locator('#contact')).toContainText('010-4187-7511');
  await expect(page.locator('#contact [data-contact-link]')).toHaveCount(2);}
 finally{await context.close();}
});
test('keyboard skip, FAQ, mobile menu and floating contact links are usable',async({page})=>{
 await page.setViewportSize({width:390,height:1000});await page.goto('/');await page.keyboard.press('Tab');await expect(page.locator('.skip-link')).toBeFocused();await page.keyboard.press('Enter');await expect(page.locator('#main')).toBeFocused();
 const menu=page.locator('.mobile-menu');await menu.locator('summary').click();await page.keyboard.press('Escape');await expect(menu).not.toHaveAttribute('open','');
 const question=page.locator('#faq summary').first();await question.focus();await page.keyboard.press('Enter');await expect(page.locator('#faq details').first()).toHaveAttribute('open','');
 await page.locator('#about').scrollIntoViewIfNeeded();await expect(page.locator('[data-mobile-cta]')).toBeVisible();
 await expect(page.locator('[data-mobile-cta] [data-contact-link]')).toHaveCount(2);
 await page.locator('#contact').scrollIntoViewIfNeeded();await expect(page.locator('[data-mobile-cta]')).toBeHidden();
});
test('200 percent text enlargement does not introduce horizontal overflow',async({page})=>{
 for(const width of [390,768,1440]){await page.setViewportSize({width,height:1000});await page.goto('/');await page.addStyleTag({content:'html{font-size:200% !important}'});expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);}
});
test('consumer interactions never submit customer data or store it',async({page})=>{
 const requests=[];page.on('request',r=>{if(['xhr','fetch','ping'].includes(r.resourceType())||r.method()==='POST')requests.push(r.url());});
 await page.goto('/');await page.locator('#faq summary').first().click();await page.locator('.hero-actions .text-link').click();
 expect(requests).toEqual([]);expect(await page.evaluate(()=>[localStorage.length,sessionStorage.length])).toEqual([0,0]);
});
test('gallery, B2B proposal and privacy pages remain responsive and accessible',async({page},testInfo)=>{
 test.setTimeout(90000);for(const path of ['/templates','/proposal','/privacy'])for(const width of [390,1440]){
  await page.setViewportSize({width,height:1000});await page.goto(path);expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  expect((await new AxeBuilder({page}).withTags(tags).analyze()).violations).toEqual([]);
  await testInfo.attach(`${path.slice(1)}-${width}`,{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
 }
});
test('retired endpoint returns 410 and never claims successful receipt',async({request})=>{
 const response=await request.post('/api/consultations',{data:{}});expect(response.status()).toBe(410);expect((await response.json()).code).toBe('DIRECT_CONTACT_ONLY');
});
