import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import JSZip from 'jszip';
import {PDFDocument} from 'pdf-lib';
import {getDocument} from 'pdfjs-dist/legacy/build/pdf.mjs';
const preview=page=>page.frameLocator('#guided-preview');
async function start(page){await page.setViewportSize({width:1440,height:1000});await page.goto('/studio');await expect(page.locator('[data-purpose]')).toHaveCount(8);page.on('dialog',d=>d.accept());}
async function stage(page,n){await page.locator(`button[data-stage="${n}"]`).click();}
async function purpose(page,id){await stage(page,0);const details=page.locator('#guided-panel details');if(!(await details.evaluate(node=>node.open)))await details.locator('summary').click();await page.locator(`[data-purpose="${id}"]`).click();}
async function storageOptions(page){const details=page.locator('.g-save-options details');if(!(await details.evaluate(node=>node.open)))await details.locator('summary').click();}
async function facts(page){await stage(page,1);for(const [name,value] of [['name','검토용 담당자'],['company','검토용 소속'],['phone','010-0000-1234'],['hours','평일 09:00–18:00'],['kakao','https://open.kakao.com/o/TestInvite']])await page.locator(`input[name="${name}"]`).fill(value);}
async function confirm(page){await stage(page,2);for(const input of await page.locator('[data-confirm]').all())await input.check();}
async function archive(page){
 const pending=page.waitForEvent('download');await page.locator('[data-action="save-zip"]').click();const download=await pending;
 const bytes=new Uint8Array(await fs.readFile(await download.path()));const zip=await JSZip.loadAsync(bytes);
 const names=Object.keys(zip.files).sort();const jsonName=names.find(name=>name.endsWith('.json'));const pdfName=names.find(name=>name.endsWith('.pdf'));
 expect(jsonName).toBeTruthy();expect(pdfName).toBeTruthy();
 const project=JSON.parse(await zip.file(jsonName).async('text'));const pdfBytes=await zip.file(pdfName).async('uint8array');
 return {download,bytes,names,jsonName,pdfName,project,pdfBytes};
}
async function save(page){return (await archive(page)).project;}
test('recommended purposes provide copy without borrowing the demo identity',async({page})=>{
 await start(page);await expect(preview(page).locator('h1')).toContainText('가입한 보험');await expect(preview(page).locator('[data-contact-link]')).toHaveCount(0);
 await purpose(page,'family');await expect(preview(page).locator('h1')).toContainText('가족의 보험');
 await stage(page,0);await expect(page.locator('[name="copy-choice"]')).toHaveCount(24);
 await page.locator('[name="copy-choice"][value="hero-06"]').check();await expect(preview(page).locator('h1')).toContainText('처음 준비하는 보험');
 await page.locator('#copy-group').selectOption('faqs');await expect(page.locator('[name="copy-choice"]')).toHaveCount(30);
 await page.locator('#copy-search').fill('자동 발송');await expect(page.locator('[name="copy-choice"]')).toHaveCount(1);
});
test('the large preview opens from every step and closes with the X button or Escape',async({page})=>{
 await start(page);const area=page.locator('.g-preview');const expand=page.locator('.g-steps [data-action="expand-preview"]');
 const close=page.locator('[data-action="close-preview"]');
 for(const step of [0,1,2]){
  await stage(page,step);
  await expect(expand).toHaveText('크게 보기');await expand.click();
  await expect(area).toHaveAttribute('data-expanded','true');await expect(close).toBeVisible();await expect(close).toBeFocused();
  await expect(preview(page).locator('h1')).toContainText('가입한 보험');
  await close.click();await expect(area).toHaveAttribute('data-expanded','false');await expect(expand).toBeFocused();
 }
 await expand.click();await expect(area).toHaveAttribute('data-expanded','true');
 await page.keyboard.press('Escape');await expect(area).toHaveAttribute('data-expanded','false');await expect(expand).toBeFocused();
});
test('links inside the large preview scroll it instead of killing the frame',async({page})=>{
 await start(page);await page.locator('.g-steps [data-action="expand-preview"]').click();
 await expect(page.locator('.g-preview')).toHaveAttribute('data-expanded','true');
 const inside=page.frameLocator('#guided-preview');
 // 앵커는 미리보기 안에서 스크롤만 한다.
 await inside.locator('.desktop-nav a[href="#specialties"]').click();
 await expect.poll(()=>page.evaluate(()=>document.querySelector('#guided-preview').contentWindow.scrollY)).toBeGreaterThan(0);
 // 주소가 있는 링크도 프레임을 다른 문서로 보내지 않는다.
 for(const href of ['/','/privacy']){
  await inside.locator(`a[href="${href}"]`).first().click();
  await page.waitForTimeout(300);
 }
 expect(await page.evaluate(()=>document.querySelector('#guided-preview').contentDocument.body.dataset.studioPreview)).toBe('true');
 await expect(inside.locator('h1')).toContainText('가입한 보험');
 await expect(page.locator('.g-preview')).toHaveAttribute('data-expanded','true');
 // 프레임이 살아 있으므로 편집도 계속 반영된다.
 await page.locator('[data-action="close-preview"]').click();
 await stage(page,1);await page.locator('input[name="name"]').fill('링크 확인 담당자');
 await expect(inside.locator('.adviser-card .adviser-name')).toContainText('링크 확인 담당자');
});
test('all five layout choices change the visible page structure while keeping its palette',async({page})=>{
 await start(page);
 const layouts={
  'trust-blue':{hero:'hero-portrait',services:'services-list',about:'about-editorial',sections:['home','specialties','about','process','faq','contact']},
  'warm-care':{hero:'hero-portrait',services:'services-cards',about:'about-profile',sections:['home','about','specialties','faq','process','contact']},
  'premium-navy':{hero:'hero-statement',services:'services-split',about:'about-editorial',sections:['home','specialties','process','about','faq','contact']},
  'clean-minimal':{hero:'hero-statement',services:'services-cards',about:'about-editorial',sections:['home','specialties','process','faq','about','contact']},
  'local-friendly':{hero:'hero-editorial',services:'services-cards',about:'about-editorial',sections:['home','specialties','contact','faq','about','process']},
 };
 for(const [id,expected] of Object.entries(layouts)){
  await page.locator(`[data-template="${id}"]`).click();
  await expect(preview(page).locator('body')).toHaveAttribute('data-layout',id);
  await expect(preview(page).locator('#home')).toHaveClass(new RegExp(expected.hero));
  await expect(preview(page).locator('.service-grid')).toHaveAttribute('data-pattern',expected.services);
  await expect(preview(page).locator('.about-grid')).toHaveAttribute('data-pattern',expected.about);
  expect(await preview(page).locator('#main > section[id]').evaluateAll(nodes=>nodes.map(node=>node.id))).toEqual(expected.sections);
  await expect(preview(page).locator('body')).toHaveAttribute('data-palette','navy');
 }
 await expect(page.locator('#guided-status')).toContainText('첫 화면·순서·보여 주는 방식이 바뀌고');
});
test('invalid multi-selection leaves the prior page intact',async({page})=>{
 await start(page);await stage(page,0);await page.locator('#copy-group').selectOption('services');const before=await preview(page).locator('.service-card h3').allTextContents();
 const selected=await page.locator('[name="copy-choice"]:checked').evaluateAll(inputs=>inputs.map(input=>input.value));
 for(const id of selected)await page.locator(`[name="copy-choice"][value="${id}"]`).uncheck();
 await expect(page.locator('[name="copy-choice"]:checked')).toHaveCount(0);
 await page.locator('[data-action="apply-copies"]').click();await expect(page.locator('#guided-errors')).toContainText('3~6');expect(await preview(page).locator('.service-card h3').allTextContents()).toEqual(before);
});
test('profile, chosen copy, layout and phone/chat links survive JSON export/import',async({page})=>{
 await start(page);await purpose(page,'new');await facts(page);
 await expect(preview(page).locator('.hero-actions [data-contact-link="phone"]')).toHaveAttribute('href','tel:01000001234');
 await expect(preview(page).locator('.hero-actions [data-contact-link="kakao"]')).toHaveAttribute('href','https://open.kakao.com/o/TestInvite');
 const dispatched=await preview(page).locator('.hero-actions [data-contact-link="kakao"]').evaluate(a=>a.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true})));expect(dispatched).toBe(false);
 await confirm(page);const project=await save(page);expect(project.site.status).toBe('draft');expect(project.site.design.hero).toBe('statement');expect(project.site.contact.phone).toBe('010-0000-1234');expect(project.site.compliance.publicationConfirmed).toBe(false);
 await page.reload();await page.locator('#guided-file').setInputFiles({name:'draft.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(project))});
 await expect(page.locator('#guided-status')).toContainText('불러왔습니다');await stage(page,1);await expect(page.locator('input[name="name"]')).toHaveValue('검토용 담당자');await expect(preview(page).locator('.hero-statement')).toHaveCount(1);
});
test('published rights and unsafe URLs cannot slip through save or import',async({page})=>{
 await start(page);await stage(page,2);await page.locator('[data-action="save-zip"]').click();await expect(page.locator('#guided-errors')).toContainText('담당자 이름');await facts(page);await page.locator('input[name="kakao"]').fill('https://evil.test');await confirm(page);await page.locator('[data-action="save-zip"]').click();await expect(page.locator('#guided-errors')).toContainText('open.kakao.com');
 await page.locator('#guided-file').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{not json}')});await expect(page.locator('#guided-errors')).toBeVisible();await stage(page,1);await expect(page.locator('input[name="name"]')).toHaveValue('검토용 담당자');
});
test('draft storage is opt-in, explicitly restorable and erasable',async({page})=>{
 await start(page);expect(await page.evaluate(()=>localStorage.length)).toBe(0);await storageOptions(page);await page.locator('#remember-draft').check();await expect(page.locator('#guided-status')).toContainText('보관했습니다');await facts(page);
 await expect.poll(()=>page.evaluate(()=>localStorage.getItem('atelier-guided-draft-v1'))).toContain('검토용 담당자');
 await page.reload();await storageOptions(page);await page.locator('[data-action="restore"]').click();await stage(page,1);await expect(page.locator('input[name="name"]')).toHaveValue('검토용 담당자');
 await page.locator('[data-action="clear"]').click();expect(await page.evaluate(()=>localStorage.getItem('atelier-guided-draft-v1'))).toBeNull();
});
test('selecting a new purpose keeps verified identity but resets the review checkboxes',async({page})=>{
 await start(page);await facts(page);await confirm(page);await purpose(page,'retire');await stage(page,1);
 await expect(page.locator('input[name="company"]')).toHaveValue('검토용 소속');await expect(page.locator('input[name="phone"]')).toHaveValue('010-0000-1234');await stage(page,2);for(const c of await page.locator('[data-confirm]').all())await expect(c).not.toBeChecked();
});

test('import and guided edits preserve custom footer, hidden copy, images and arrangement',async({page})=>{
 await start(page);await facts(page);await confirm(page);const project=await save(page);
 project.site.footer={heading:'직접 작성한 하단 제목',note:'소중하게 보관할 사용자 원고'};
 project.site.seo.title='직접 작성한 검색 제목';
 project.site.intro.body='숨겨 둔 소개 원고를 그대로 보관합니다.';
 project.site.design.hiddenSections=['about'];
 project.site.design.sectionOrder=['faq','services','about','process','contact','reviews'];
 project.site.agent.profileImage='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aPioAAAAASUVORK5CYII=';
 await page.locator('#guided-file').setInputFiles({name:'custom.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(project))});
 await expect(page.locator('#guided-status')).toContainText('불러왔습니다');
 await stage(page,0);await page.locator('[name="copy-choice"][value="hero-06"]').check();
 await stage(page,1);await confirm(page);const restored=await save(page);
 for(const key of ['footer','seo','intro','design','agent'])expect(restored.site[key]).toEqual(project.site[key]);
});
test('handoff ZIP contains one valid PDF and one v2 JSON snapshot with extractable Korean text',async({page})=>{
 test.setTimeout(120000);await start(page);await facts(page);await confirm(page);const result=await archive(page);
 expect(result.names).toEqual([result.jsonName,result.pdfName].sort());expect(result.project.version).toBe(2);
 expect(result.project.handoff.designVersion).toBe('clear-human-v1');expect(result.project.handoff.draftId).toMatch(/^draft-/);
 expect(result.project.site.status).toBe('draft');expect(result.project.site.seo.noIndex).toBe(true);expect(result.project.site.sections.contactForm).toBe(false);
 const pdf=await PDFDocument.load(result.pdfBytes);expect(pdf.getPageCount()).toBeGreaterThan(3);
 if(process.env.REBUILD_PDF_OUTPUT)await fs.writeFile(process.env.REBUILD_PDF_OUTPUT,result.pdfBytes);
 const document=await getDocument({data:result.pdfBytes,disableWorker:true}).promise;let text='';
 for(let pageNumber=1;pageNumber<=document.numPages;pageNumber++){const page=await document.getPage(pageNumber);const content=await page.getTextContent();text+=content.items.map(item=>'str' in item?item.str:'').join(' ');}
 expect(text).toContain('PC 웹페이지 · 연속 보기');expect(text).toContain('모바일 웹페이지 · 연속 보기');expect(text).not.toContain('PC 디자인 · header-1');
 expect(text).toContain('검토용 담당자');expect(text).toContain('검토용 소속');expect(text).toContain('제작 담당자에게 전달');
 await expect(page.locator('.g-result')).toContainText('파일이 준비되었습니다');
});
test('the studio works from tablet width upward and blocks narrower phones',async({page},testInfo)=>{
 test.setTimeout(120000);await start(page);
 await page.setViewportSize({width:390,height:900});
 await expect(page.locator('.g-small-screen')).toBeVisible();await expect(page.locator('.g-app')).toBeHidden();
 await expect(page.locator('.g-small-screen a[href="/"]')).toBeVisible();
 for(const width of [768,1024,1440]){await page.setViewportSize({width,height:1000});for(const n of [0,1,2]){
  await stage(page,n);expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  if([768,1440].includes(width)){expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);await testInfo.attach(`guided-${n}-${width}`,{body:await page.screenshot({fullPage:true}),contentType:'image/png'});}
 }}
});
