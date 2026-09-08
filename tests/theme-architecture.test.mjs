import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { renderSitePage, renderTemplateGallery } from '../.preview-dist/render/page.js';
import { TEMPLATE_IDS, PALETTE_IDS } from '../.preview-dist/types.js';
import { clientScript } from '../.preview-dist/render/client-script.js';
import { handleConsultation } from '../.preview-dist/routes/consultation.js';
const site = JSON.parse(fs.readFileSync(new URL('../sites/demo-agent/site.json', import.meta.url), 'utf8'));
const page = (config = site, theme = 'trust-blue') => renderSitePage(config, new Request(`https://example.test/?theme=${theme}`));

for (const id of TEMPLATE_IDS) test(`${id}: distinct layout and safe wizard`, () => {
  const html = page(site,id);
  assert.match(html,new RegExp(`theme-${id}`));
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.equal((html.match(/data-contact-form/g)||[]).length >= 1,true);
  assert.match(html,/data-submission-mode="discard"/);
  assert.match(html,/name="robots" content="noindex,nofollow"/);
  assert.match(html,/data-step="0" disabled/);
  assert.match(html,/data-step="3" hidden disabled/);
  assert.match(html,/실제 상담은 접수되지 않았습니다/);
  assert.doesNotMatch(html,/data-reading-toggle|글자 크게/);
  assert.doesNotMatch(html,/<a[^>]+href="(?:mailto:|tel:|https:\/\/open.kakao)/);
});

test('shared system preserves five IDs while changing content emphasis', () => {
  const warm=page(site,'warm-care');assert.ok(warm.indexOf('id="about"') < warm.indexOf('id="specialties"'));
  const standard=page();assert.ok(standard.indexOf('id="specialties"') < standard.indexOf('id="about"'));
  assert.match(page(site,'premium-navy'),/새 보험을 준비할 때/);
  assert.match(page(site,'local-friendly'),/data-start-topic/);
  assert.doesNotMatch(page(site,'clean-minimal'),/id="reviews"/);
  const gallery=renderTemplateGallery(site,new Request('https://example.test/templates'));
  for(const id of TEMPLATE_IDS)assert.match(gallery,new RegExp(`href="/\\?theme=${id}"`));
});

test('untrusted content is escaped and absent content does not invent proof', () => {
  const modified=structuredClone(site);modified.agent.name='<script>alert(1)</script>';modified.career=[];modified.reviews=[];modified.agent.registrationNumber='';modified.agent.profileImage='';
  const html=page(modified);assert.doesNotMatch(html,/<script>alert\(1\)<\/script>/);assert.match(html,/&lt;script&gt;/);assert.match(html,/\/assets\/profile-placeholder.svg/);assert.doesNotMatch(html,/id="reviews"/);
});

test('hidden optional sections and production example filtering work', () => {
  const modified=structuredClone(site);modified.sections.contactForm=false;modified.sections.faq=false;modified.sections.process=false;modified.demo.enabled=false;
  const html=page(modified);assert.doesNotMatch(html,/<form class="consultation-form"/);assert.doesNotMatch(html,/id="faq"/);assert.doesNotMatch(html,/id="process"/);assert.doesNotMatch(html,/id="reviews"/);
});

test('demo client contains no submission, SDK, tracking or persistence code', () => {
  assert.doesNotMatch(clientScript,/\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB|mailto:|Kakao\./);
  assert.match(clientScript,/event\.preventDefault\(\)/);assert.match(clientScript,/form\.reset\(\)/);assert.match(clientScript,/pagehide/);assert.match(clientScript,/dd\.textContent = text/);
});

test('demo API never parses or stores even with a misconfigured store flag', async () => {
  const modified=structuredClone(site);modified.demo.submissionMode='store';
  const request={method:'POST',json(){throw new Error('MUST NOT PARSE');}};
  const env={DB:{prepare(){throw new Error('MUST NOT STORE');}},CONSULTATION_WEBHOOK_URL:'https://must-not-send.invalid'};
  const response=await handleConsultation(request,env,modified);const body=await response.json();assert.equal(body.demo,true);assert.match(body.message,/실제 상담은 접수되지 않았습니다/);
  const wrongMethod=await handleConsultation({method:'GET'},env,modified);assert.equal(wrongMethod.status,405);
});


test('six palettes combine independently with all five layouts and their JSON content', () => {
  assert.equal(PALETTE_IDS.length,6);
  assert.equal(TEMPLATE_IDS.length,5);
  const headlines = new Set();
  for (const theme of TEMPLATE_IDS) {
    const headline=site.templateContent[theme].headline;
    headlines.add(headline);
    for (const palette of PALETTE_IDS) {
      const html=renderSitePage(site,new Request(`https://example.test/?theme=${theme}&palette=${palette}`));
      assert.ok(html.includes(`data-layout="${theme}" data-palette="${palette}"`));
      assert.ok(html.includes(headline.replaceAll('\n','<br>')));
      assert.ok(html.includes(`value="${theme}" selected`));
      assert.ok(html.includes(`value="${palette}" selected`));
      for(const card of site.templateContent[theme].specialties) assert.ok(html.includes(card.title));
      assert.ok(html.includes('유퍼스트 해온지사'));
    }
  }
  assert.equal(headlines.size,5);
});

test('query fallbacks are safe and production ignores preview settings', () => {
  const request=new Request('https://example.test/?theme=warm-care&palette=stone');
  const production=structuredClone(site);production.demo.enabled=false;
  assert.match(renderSitePage(production,request),/data-layout="trust-blue" data-palette="navy"/);
  const legacy=structuredClone(site);delete legacy.palette;delete legacy.templateContent;
  assert.match(renderSitePage(legacy,new Request('https://example.test/?theme=INVALID&palette=INVALID')),/data-layout="trust-blue" data-palette="navy"/);
  assert.ok(renderSitePage(legacy,new Request('https://example.test/?theme=warm-care')).includes(legacy.hero.headline.replaceAll('\n','<br>')));
  const disabled=structuredClone(site);disabled.demo.allowTemplateSwitch=false;
  assert.match(renderSitePage(disabled,request),/data-layout="trust-blue" data-palette="navy"/);
});
