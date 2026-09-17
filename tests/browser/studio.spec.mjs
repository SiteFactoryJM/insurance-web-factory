import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';

const field = (page, path) => page.locator(`[data-field="${path}"]`);
const frame = page => page.frameLocator('#site-preview');
const step = (page, index) => page.locator(`.step-tab[data-step="${index}"]`).click();
async function start(page) {
  await page.setViewportSize({width:1440,height:1000});
  // The editor is ready independently of late external font subsets. Actual
  // font loading remains asserted by the dedicated six-font test below.
  await page.goto('/studio/advanced', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#panel-0')).toBeVisible();
  page.on('dialog',dialog => dialog.accept());
}
async function example(page) {
  await page.locator('[data-action="example"]').click();
  await expect(page.locator('#preview-label')).toContainText('내 페이지 미리보기');
  await expect(frame(page).locator('body')).toHaveAttribute('data-studio-preview','true');
}
async function restore(page,project) {
  await page.locator('#project-file').setInputFiles({name:'draft.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(project))});
  await expect(page.locator('#studio-status')).toContainText('제작 파일을 불러왔습니다');
}
async function reveal(input) {
  for(const details of await input.locator('xpath=ancestor::details').all()) {
    if(!await details.evaluate(element=>element.open)) await details.locator(':scope > summary').click();
  }
}
async function save(page) {
  const current=Number(await page.locator('.step-tab[aria-selected="true"]').getAttribute('data-step'));
  await step(page,3);
  const details=page.locator('#panel-3 details.section-details');
  if(!(await details.evaluate(node=>node.open)))await details.locator('summary').click();
  const pending=page.waitForEvent('download');
  await details.locator('[data-action="export"]').click();
  const download=await pending;
  const project=JSON.parse(await fs.readFile(await download.path(),'utf8'));
  if(current!==3)await step(page,current);
  return {project,download};
}
async function choose(page,key,value) {
  const input=page.locator(`[data-design="${key}"][value="${value}"]`);
  await reveal(input);
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
  await expect(frame(page).locator('.hero-portrait')).toHaveCount(1);
  for(const value of ['portrait','statement','editorial']) { await choose(page,'hero',value); await expect(frame(page).locator(`.hero-${value}`)).toHaveCount(1); }
  for(const value of ['cards','split','list']) { await choose(page,'services',value); await expect(frame(page).locator(`[data-pattern="services-${value}"]`)).toHaveCount(1); }
  for(const value of ['profile','quote','editorial']) { await choose(page,'about',value); await expect(frame(page).locator(`[data-pattern="about-${value}"]`)).toHaveCount(1); }
  await choose(page,'faq','columns');await expect(frame(page).locator('.faq-list details:not([open])')).toHaveCount(0);
  await choose(page,'process','timeline');await expect(frame(page).locator('.process-timeline')).toHaveCount(1);
  await page.locator('[data-move="about"][data-direction="-1"]').click();
  await expect(frame(page).locator('#about + #specialties')).toHaveCount(1);
  await page.locator('[data-section="contact"]').uncheck();await page.locator('[data-section="services"]').uncheck();
  await expect(frame(page).locator('#contact')).toHaveCount(0);await expect(frame(page).locator('#specialties')).toHaveCount(0);
  await expect(frame(page).locator('.hero-actions [data-contact-link="phone"]')).toHaveAttribute('href','tel:01041877511');
  await expect(frame(page).locator('.hero-actions [data-contact-link="kakao"]')).toHaveAttribute('href','https://open.kakao.com/o/sH6OIpKi');
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
  await page.locator('.top-actions [data-action="export-zip"]').click();
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
  await expect(frame(page).getByRole('img',{name:'복원 테스트 프로필',exact:true}).first()).toHaveAttribute('src',project.site.agent.profileImage);
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
  await step(page,1);
  await field(page,'hero.headline').fill('PDF에서 확인할 PC 제목');
  await field(page,'hero.mobileHeadline').fill('모바일용 짧은 제목');
  await reveal(field(page,'intro.body'));
  await field(page,'intro.body').fill('숨긴 소개원고는 PDF에 포함하지 않습니다 84729');
  await step(page,0);await page.locator('[data-section="about"]').uncheck();
  await page.locator('[data-field="headingFont"][value="gowun-batang"]').check();
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
  await expect.poll(()=>page.evaluate(()=>window.__printCount),{timeout:15000}).toBe(1);
  const brief=page.frameLocator('#print-brief');
  await expect(brief.locator('body')).toContainText('상담 페이지 제작 의뢰서');
  await expect(brief.locator('body')).toContainText('PDF에서 확인할 PC 제목');
  await expect(brief.locator('body')).toContainText('모바일용 짧은 제목');
  await expect(brief.locator('body')).toContainText('연락처·고지');
  await expect(brief.locator('body')).toContainText('모바일');
  await expect(brief.locator('body')).toContainText('보험 고지');
  await expect(brief.locator('body')).toContainText('고운바탕');
  await expect(brief.locator('body')).not.toContainText('숨긴 소개원고는 PDF에 포함하지 않습니다 84729');
  expect(await brief.locator('h1').evaluate(element=>getComputedStyle(element).fontFamily)).toContain('Gowun Batang');
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

test('section controls remove irrelevant inputs and restore the edited copy when shown again',async({page})=>{
  await start(page);await example(page);await step(page,1);
  const introduction=field(page,'intro.body');
  await reveal(introduction);
  await introduction.fill('상황을 충분히 듣고 필요한 내용을 함께 살펴봅니다.');
  await step(page,0);
  for(const section of ['about','process','faq','services','contact']) await page.locator(`[data-section="${section}"]`).uncheck();
  await step(page,1);
  for(const path of ['intro.body','process.0.body','faqs.0.answer','specialties.0.body','consultation.topics']) await expect(field(page,path)).toHaveCount(0);
  await expect(field(page,'agent.name')).toBeVisible();
  await expect(field(page,'hero.headline')).toHaveCount(1);
  await step(page,2);
  await expect(field(page,'contact.phone')).toHaveCount(1);
  await expect(field(page,'compliance.footerDisclaimer')).toHaveCount(1);
  await expect(page.getByRole('tab',{name:'연락처·고지',exact:true})).toHaveAttribute('aria-selected','true');
  await step(page,0);await page.locator('[data-section="about"]').check();
  await step(page,1);await reveal(field(page,'intro.body'));
  await expect(field(page,'intro.body')).toHaveValue('상황을 충분히 듣고 필요한 내용을 함께 살펴봅니다.');
  await expect(frame(page).locator('#about')).toContainText('상황을 충분히 듣고 필요한 내용을 함께 살펴봅니다.');
});

test('a concise page can be saved with unfilled sections hidden and completed later',async({page})=>{
  await start(page);
  const hidden=['services','about','process','reviews','faq','contact'];
  for(const section of hidden) await page.locator(`[data-section="${section}"]`).uncheck();
  await step(page,1);
  await page.locator('[data-example="profile"]').click();
  await page.locator('[data-example="hero"]').click();
  const {project}=await save(page);
  expect(project.site.design.hiddenSections).toEqual(expect.arrayContaining(hidden));
  expect(project.site.intro.body).toBe('');
  expect(project.site.specialties.every(item=>item.body==='')).toBe(true);
  expect(project.site.compliance.footerDisclaimer.length).toBeGreaterThan(0);
  await restore(page,project);
  await step(page,0);await page.locator('[data-section="about"]').check();
  await step(page,1);await reveal(field(page,'intro.body'));
  await expect(field(page,'intro.body')).toHaveValue('');
  await page.locator('.top-actions [data-action="export-zip"]').click();
  await expect(page.locator('#studio-errors')).toContainText('소개');
});

test('all six heading fonts load, render and survive a project file round-trip',async({page})=>{
  test.setTimeout(120000);
  await start(page);await example(page);
  const families=[
    ['pretendard','Pretendard Variable'],['noto-serif-kr','Noto Serif KR'],
    ['noto-sans-kr','Noto Sans KR'],['nanum-gothic','Nanum Gothic'],
    ['nanum-myeongjo','Nanum Myeongjo'],['gowun-batang','Gowun Batang'],
  ];
  await expect(page.locator('[data-field="headingFont"]')).toHaveCount(6);
  for(const [id,family] of families) {
    await page.locator(`[data-field="headingFont"][value="${id}"]`).check();
    await expect.poll(()=>frame(page).locator('h1').evaluate(element=>getComputedStyle(element).fontFamily)).toContain(family);
    await expect.poll(()=>frame(page).locator('h1').evaluate(async(_element,family)=>{
      const faces=await document.fonts.load(`400 24px "${family}"`,'보험상담');
      return faces.length>0&&faces.every(face=>face.status==='loaded');
    },family),{message:`${id}: the actual Korean font resource must load`,timeout:15000}).toBe(true);
    const {project}=await save(page);
    expect(project.site.headingFont).toBe(id);
    await restore(page,project);
    await expect(page.locator(`[data-field="headingFont"][value="${id}"]`)).toBeChecked();
    await expect.poll(()=>frame(page).locator('h1').evaluate(element=>getComputedStyle(element).fontFamily)).toContain(family);
  }
});

test('entering a copy block locates it once and typing preserves preview position and open questions',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await start(page);await example(page);await step(page,1);
  await frame(page).locator('body').evaluate(()=>document.fonts.ready);
  const introduction=field(page,'intro.body');
  await reveal(introduction);
  await introduction.focus();
  await expect(introduction).toBeFocused();
  await expect.poll(()=>frame(page).locator('#about').evaluate(element=>Math.abs(element.getBoundingClientRect().top))).toBeLessThan(180);
  const firstQuestion=frame(page).locator('#faq details').first();
  await firstQuestion.locator('summary').click();
  await expect(firstQuestion).toHaveAttribute('open','');
  await frame(page).locator('body').evaluate(()=>window.scrollTo({top:1100,behavior:'instant'}));
  await page.evaluate(()=>{window.__originalPreviewDocument=document.querySelector('#site-preview').contentDocument;});
  const priorScroll=await frame(page).locator('body').evaluate(()=>scrollY);
  const navigations=[];
  page.on('framenavigated',navigated=>{if(navigated.parentFrame()) navigations.push(navigated.url());});
  for(const text of ['질문을 먼저 듣습니다.','질문을 먼저 듣고 상황을 정리합니다.','질문을 먼저 듣고, 충분히 이해할 수 있게 설명합니다.']) {
    await introduction.fill(text);
    await expect(frame(page).locator('#about .copy-desktop')).toContainText([text]);
    expect(await page.evaluate(()=>window.__originalPreviewDocument===document.querySelector('#site-preview').contentDocument)).toBe(true);
    expect(await frame(page).locator('body').evaluate(()=>scrollY)).toBeCloseTo(priorScroll,0);
    await expect(firstQuestion).toHaveAttribute('open','');
  }
  expect(navigations).toEqual([]);
});

test('copy block focus fades only the matching preview section and honors reduced motion',async({page})=>{
  await page.emulateMedia({reducedMotion:'no-preference'});
  await start(page);await example(page);await step(page,1);
  await frame(page).locator('body').evaluate(()=>document.fonts.ready);
  const initial=await page.evaluate(()=>{
    document.querySelector('[data-field="hero.headline"]').focus();
    const target=document.querySelector('#site-preview').contentDocument.getElementById('home');
    const animations=target.getAnimations();
    const animation=animations[0];
    if(animation) {animation.pause();animation.currentTime=Number(animation.effect.getTiming().duration)/2;}
    window.__previewFocusAnimation=animation;
    window.__previewFocusTarget=target;
    return {count:animations.length,opacity:Number(getComputedStyle(target).opacity)};
  });
  expect(initial.count).toBe(1);
  expect(initial.opacity).toBeGreaterThan(0);
  expect(initial.opacity).toBeLessThan(.95);
  await expect(page.locator('.is-active-block')).toHaveCount(0);
  const leftEffects=await page.locator('[data-editor-block]').evaluateAll(blocks=>blocks.map(block=>({
    block:block.dataset.editorBlock,animation:getComputedStyle(block).animationName,shadow:getComputedStyle(block).boxShadow,
  })).filter(block=>block.animation!=='none'||block.shadow!=='none'));
  expect(leftEffects).toEqual([]);
  await field(page,'hero.headline').fill('현재 보장을 차분히 살펴봅니다.');
  await expect(frame(page).locator('h1 .copy-desktop')).toHaveText('현재 보장을 차분히 살펴봅니다.');
  expect(await page.evaluate(()=>{
    const target=document.querySelector('#site-preview').contentDocument.getElementById('home');
    const animations=target.getAnimations();
    return target===window.__previewFocusTarget&&animations.length===1&&animations[0]===window.__previewFocusAnimation;
  })).toBe(true);
  const moved=await page.evaluate(()=>{
    const summary=document.querySelector('[data-writing-section="about"] > summary');
    if(!summary.parentElement.open) summary.click();
    document.querySelector('[data-field="intro.body"]').focus();
    const doc=document.querySelector('#site-preview').contentDocument;
    const target=doc.getElementById('about');
    const animations=target.getAnimations();
    if(animations[0]) {animations[0].pause();animations[0].currentTime=Number(animations[0].effect.getTiming().duration)/2;}
    return {count:animations.length,opacity:Number(getComputedStyle(target).opacity),oldCount:doc.getElementById('home').getAnimations().length,oldOpacity:Number(getComputedStyle(doc.getElementById('home')).opacity)};
  });
  expect(moved.count).toBe(1);
  expect(moved.opacity).toBeLessThan(.95);
  expect(moved.oldCount).toBe(0);
  expect(moved.oldOpacity).toBe(1);
  await frame(page).locator('#about').evaluate(element=>element.getAnimations().forEach(animation=>animation.finish()));
  await page.setViewportSize({width:390,height:1000});
  await expect(page.locator('#site-preview')).toBeHidden();
  expect(await page.evaluate(()=>{
    document.querySelector('[data-field="hero.headline"]').focus();
    const doc=document.querySelector('#site-preview').contentDocument;
    return ['home','about'].map(id=>doc.getElementById(id).getAnimations().length);
  })).toEqual([0,0]);
  const mobile=await page.evaluate(()=>{
    document.querySelector('button[data-view="preview"]').click();
    const target=document.querySelector('#site-preview').contentDocument.getElementById('home');
    const animations=target.getAnimations();
    if(animations[0]) {animations[0].pause();animations[0].currentTime=Number(animations[0].effect.getTiming().duration)/2;}
    return {count:animations.length,opacity:Number(getComputedStyle(target).opacity)};
  });
  await expect(page.locator('#site-preview')).toBeVisible();
  expect(mobile.count).toBe(1);
  expect(mobile.opacity).toBeGreaterThan(0);
  expect(mobile.opacity).toBeLessThan(.95);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('button[data-view="editor"]').click();
  const reduced=await page.evaluate(()=>{
    document.querySelector('[data-field="intro.body"]').focus();
    document.querySelector('button[data-view="preview"]').click();
    const doc=document.querySelector('#site-preview').contentDocument;
    return ['home','about'].map(id=>({count:doc.getElementById(id).getAnimations().length,opacity:Number(getComputedStyle(doc.getElementById(id)).opacity)}));
  });
  expect(reduced).toEqual([{count:0,opacity:1},{count:0,opacity:1}]);
});

test('the representative page gives the adviser a large loaded portrait on desktop and mobile',async({page},testInfo)=>{
  await page.goto('/');
  await expect(page.locator('.hero-editorial')).toHaveCount(0);
  const portrait=page.locator('.hero-portrait img[alt$="프로필"]');
  await expect(portrait).toHaveCount(1);
  await expect(portrait).toHaveAttribute('alt',/\S+ 프로필$/);
  await expect.poll(()=>portrait.evaluate(image=>image.complete&&image.naturalWidth>0)).toBe(true);
  for(const width of [320,390,1440]) {
    await page.setViewportSize({width,height:1000});
    const bounds=await portrait.evaluate(image=>{
      const rectangle=image.getBoundingClientRect();
      return {width:rectangle.width,height:rectangle.height};
    });
    expect(bounds.width).toBeGreaterThanOrEqual(width===1440?440:width-40);
    expect(bounds.width/bounds.height).toBeCloseTo(4/5,2);
    if(width!==320) await testInfo.attach(`default-portrait-${width}`,{body:await page.locator('#home').screenshot(),contentType:'image/png'});
  }
});

test('editing and restoring contact sections updates direct links without sending anything',async({page})=>{
  await start(page);await example(page);
  const requests=[];page.on('request',r=>{if(['xhr','fetch','ping'].includes(r.resourceType())||r.method()==='POST')requests.push(r.url());});
  await step(page,1);await field(page,'agent.name').fill('정민서');
  await step(page,2);await field(page,'contact.phone').fill('010-0000-1234');
  await field(page,'contact.kakaoUrl').fill('https://open.kakao.com/o/TestInvite');
  await field(page,'contact.availableHours').fill('평일 10:00–17:00');
  const phone=frame(page).locator('#contact [data-contact-link="phone"]');
  const chat=frame(page).locator('#contact [data-contact-link="kakao"]');
  await expect(phone).toHaveAttribute('href','tel:01000001234');
  await expect(chat).toHaveAttribute('href','https://open.kakao.com/o/TestInvite');
  await expect(frame(page).locator('#contact')).toContainText('평일 10:00–17:00');
  expect(await chat.evaluate(a=>a.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true})))).toBe(false);
  await expect(frame(page).locator('[data-contact-form]')).toHaveCount(0);
  await step(page,0);await page.locator('[data-section="contact"]').uncheck();await expect(phone).toHaveCount(0);
  await page.locator('[data-section="contact"]').check();await expect(phone).toHaveAttribute('href','tel:01000001234');
  const {project}=await save(page);expect(project.site.contact.phone).toBe('010-0000-1234');
  expect(requests).toEqual([]);expect(await page.evaluate(()=>[localStorage.length,sessionStorage.length])).toEqual([0,0]);
});
