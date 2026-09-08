import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { renderSitePage, renderTemplateGallery } from '../.preview-dist/render/page.js';
import { TEMPLATE_IDS } from '../.preview-dist/types.js';
import { clientScript } from '../.preview-dist/render/client-script.js';
import { handleConsultation } from '../.preview-dist/routes/consultation.js';
const site = JSON.parse(fs.readFileSync(new URL('../sites/demo-agent/site.json', import.meta.url), 'utf8'));
const page = (config = site, theme = 'trust-blue') => renderSitePage(config, new Request(`https://example.test/?theme=${theme}`));

for (const id of TEMPLATE_IDS) test(`${id}: one accessible master with a distinct variant and safe wizard`, () => {
  const html = page(site,id);
  assert.match(html,new RegExp(`theme-${id}`));
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.equal((html.match(/data-contact-form/g)||[]).length >= 1,true);
  assert.match(html,/data-submission-mode="discard"/);
  assert.match(html,/name="robots" content="noindex,nofollow"/);
  assert.match(html,/data-step="0" disabled/);
  assert.match(html,/data-step="3" hidden disabled/);
  assert.match(html,/실제 상담은 접수되지 않았습니다/);
  assert.match(html,/data-reading-toggle aria-pressed="false"/);
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
