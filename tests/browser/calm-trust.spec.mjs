import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const themes=['trust-blue','warm-care','premium-navy','clean-minimal','local-friendly'];
const widths=[320,360,390,768,1440];
const noOverflow=async page => {
  const issues=await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(el=>{const r=el.getBoundingClientRect();return r.height>0&&r.width>0&&!el.classList.contains('skip-link')&&(r.right>innerWidth+1||r.left < -1);}).map(el=>({tag:el.tagName,class:el.className,parent:el.parentElement?.className,text:el.textContent.trim().slice(0,60),left:el.getBoundingClientRect().left,right:el.getBoundingClientRect().right})));
  expect(issues).toEqual([]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(()=>innerWidth));
};
for(const theme of themes) for(const width of widths) test(`${theme} / ${width}px readable layout`,async({page},testInfo)=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width,height:900});await page.goto(`/?theme=${theme}`);await page.evaluate(()=>document.fonts.ready);
  await noOverflow(page);
  const small=await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(el=>!el.children.length&&el.textContent.trim()&&el.getBoundingClientRect().height>0&&parseFloat(getComputedStyle(el).fontSize)<16).map(el=>el.textContent));expect(small).toEqual([]);
  expect(errors).toEqual([]);
  if([390,1440].includes(width))await testInfo.attach(`${theme}-${width}`,{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
});
for(const theme of themes) test(`${theme}: 200% type and increased text spacing`,async({page})=>{
  await page.setViewportSize({width:320,height:900});await page.goto(`/?theme=${theme}`);
  await page.addStyleTag({content:'html{font-size:200%!important}p{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important;margin-bottom:2em!important}'});
  await noOverflow(page);
  await page.locator('[data-next]').click();await expect(page.locator('[data-form-error]')).toContainText('상담 분야');
  await page.getByLabel('실손·건강보험',{exact:true}).check();await page.locator('[data-next]').click();await noOverflow(page);
});
for(const theme of themes) test(`${theme}: WCAG automated scan`,async({page})=>{
  await page.goto(`/?theme=${theme}`);
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  expect(result.violations).toEqual([]);
  if(theme==='trust-blue'){
    // Axe preloads cross-origin CSS with XHR. Keep its scan outside the
    // separate test that observes every request made by the demo flow.
    await page.setViewportSize({width:390,height:900});
    await page.getByLabel('실손·건강보험',{exact:true}).check();
    await page.locator('[data-next]').click();await page.locator('[data-next]').click();
    await page.locator('[name="phone"]').fill('01000000000');await page.locator('[data-next]').click();
    await page.locator('[name="privacyConsent"]').check();
    const confirmation=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
    expect(confirmation.violations).toEqual([]);
  }
});
test('four-step demo validates, preserves back edits, escapes input and sends nothing',async({page},testInfo)=>{
  await page.setViewportSize({width:390,height:900});await page.goto('/');
  const requests=[];page.on('request',r=>{if(['fetch','xhr','ping'].includes(r.resourceType())||r.method()==='POST')requests.push(r.url());});
  await page.locator('[data-next]').click();await expect(page.locator('[data-form-error]')).toContainText('상담 분야');
  await page.getByLabel('실손·건강보험',{exact:true}).check();await page.locator('[data-next]').click();
  await page.locator('[name="message"]').fill('<img src=x onerror=alert(1)> 화면 확인용');
  await page.locator('[data-next]').click();await page.locator('[data-next]').click();await expect(page.locator('[data-form-error]')).toContainText('휴대전화 번호');
  await page.locator('[name="name"]').fill('테스트');await page.locator('[name="phone"]').fill('01000000000');await page.getByLabel('카카오톡',{exact:true}).check();
  await page.locator('[data-next]').click();await expect(page.locator('[data-review-summary]')).toContainText('010-****-0000');await expect(page.locator('[data-review-summary] img')).toHaveCount(0);
  await page.locator('[data-prev]').click();await expect(page.locator('[name="name"]')).toHaveValue('테스트');await page.locator('[data-next]').click();
  await page.locator('[data-submit]').click();await expect(page.locator('[data-form-error]')).toContainText('개인정보');
  await page.locator('[name="privacyConsent"]').check();await noOverflow(page);
  await testInfo.attach('consultation-confirmation',{body:await page.locator('#contact').screenshot(),contentType:'image/png'});
  await page.locator('[data-submit]').click();await expect(page.locator('[data-demo-result]')).toBeVisible();await expect(page.locator('[name="phone"]')).toHaveValue('');expect(requests).toEqual([]);
  const storage=await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length}));expect(storage).toEqual({local:0,session:0});
  await page.locator('[data-restart]').click();await expect(page.locator('[data-step="0"]')).toBeVisible();await expect(page.locator('[name="message"]')).toHaveValue('');
});
test('mobile CTA, navigation and FAQ',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.goto('/');await expect(page.locator('[data-mobile-cta]')).toBeHidden();
  await page.locator('#specialties').scrollIntoViewIfNeeded();await expect(page.locator('[data-mobile-cta]')).toBeVisible();
  await page.locator('#contact').scrollIntoViewIfNeeded();await expect(page.locator('[data-mobile-cta]')).toBeHidden();
  await expect(page.getByRole('button',{name:'글자 크게',exact:true})).toHaveCount(0);await noOverflow(page);
  await page.locator('.mobile-menu summary').click();await expect(page.locator('.mobile-menu')).toHaveAttribute('open','');await page.keyboard.press('Escape');await expect(page.locator('.mobile-menu')).not.toHaveAttribute('open','');
  await page.locator('.faq-list summary').first().click();await expect(page.locator('.faq-list details').first()).toHaveAttribute('open','');
  await page.locator('.site-footer').scrollIntoViewIfNeeded();await expect(page.locator('[data-mobile-cta]')).toBeHidden();
});
test('gallery, privacy and no-JavaScript fail-closed behavior',async({page,browser})=>{
  for(const path of ['/templates','/privacy']){await page.setViewportSize({width:320,height:900});await page.goto(path);await noOverflow(page);const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(result.violations).toEqual([]);}
  const context=await browser.newContext({javaScriptEnabled:false});const nojs=await context.newPage();await nojs.goto('http://127.0.0.1:8787/');await expect(nojs.locator('[data-next]')).toBeDisabled();await expect(nojs.locator('[name="topic"]').first()).toBeDisabled();
  // Playwright deliberately skips NOSCRIPT itself in text matching.
  const notice=nojs.locator('noscript p');await expect(notice).toBeVisible();await expect(notice).toContainText('전송은 비활성화');await context.close();
});

const palettes=['navy','forest','slate','charcoal','teal','stone'];
for(const theme of themes) for(const palette of palettes) test(`${theme} + ${palette}: independent combination and dark footer`,async({page})=>{
  await page.setViewportSize({width:390,height:900});await page.goto(`/?theme=${theme}&palette=${palette}`);
  await expect(page.locator('body')).toHaveAttribute('data-layout',theme);
  await expect(page.locator('body')).toHaveAttribute('data-palette',palette);
  await expect(page.locator('#sample-theme')).toHaveValue(theme);
  await expect(page.locator('#sample-palette')).toHaveValue(palette);
  await noOverflow(page);
  const sizes=await page.evaluate(()=>['body','[data-next]','#consult-message','#consult-phone'].map(s=>parseFloat(getComputedStyle(document.querySelector(s)).fontSize)));
  expect(sizes.every(size=>size>=18)).toBe(true);
  const luminance=await page.locator('.site-footer').evaluate(el=>{
    const rgb=getComputedStyle(el).backgroundColor.match(/[\d.]+/g).slice(0,3).map(n=>Number(n)/255).map(c=>c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4));
    return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];
  });expect(luminance).toBeLessThan(.05);
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();expect(result.violations).toEqual([]);
});
test('palette and layout controls round-trip independently, including the gallery',async({page})=>{
  await page.goto('/?theme=warm-care&palette=forest');
  await page.locator('#sample-palette').selectOption('stone');await page.getByRole('button',{name:'조합 보기',exact:true}).click();
  await expect(page).toHaveURL(/theme=warm-care&palette=stone/);
  await page.locator('#sample-theme').selectOption('clean-minimal');await page.getByRole('button',{name:'조합 보기',exact:true}).click();
  await expect(page).toHaveURL(/theme=clean-minimal&palette=stone/);
  await page.goto('/templates');await page.getByRole('button',{name:'포레스트 그린',exact:true}).click();
  await expect(page.locator('.template-tile')).toHaveCount(5);
  for(const theme of themes)await expect(page.locator(`.template-tile[data-layout="${theme}"] a`)).toHaveAttribute('href',`/?theme=${theme}&palette=forest`);
});
