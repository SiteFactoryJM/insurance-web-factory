import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { validateContentLengths } from '../scripts/validate-sites.mjs';

const site = JSON.parse(fs.readFileSync(new URL('../sites/demo-agent/site.json', import.meta.url), 'utf8'));

test('demo profile uses the supplied adviser information', () => {
  assert.equal(site.agent.name, '이윤복');
  assert.equal(site.agent.title, '보험설계사');
  assert.equal(site.agent.company, '유퍼스트 해온지사');
  assert.equal(site.contact.phone, '010-4187-7511');
  assert.equal(site.contact.kakaoUrl, 'https://open.kakao.com/o/sH6OIpKi');
  assert.equal(site.contact.instagramUrl, 'https://www.instagram.com/91ybok');
  assert.equal(site.contact.availableHours, '09:00–20:00');
});

test('profile image exists and is a webp asset', () => {
  assert.match(site.agent.profileImage, /^\/sites\/demo-agent\/[^/]+\.webp$/);
  const localPath = new URL(`../public${site.agent.profileImage}`, import.meta.url);
  assert.ok(fs.existsSync(localPath), `missing profile image: ${localPath.pathname}`);
  assert.ok(fs.statSync(localPath).size > 50_000);
});

test('demo includes FAQ and clearly labelled example reviews', () => {
  assert.equal(site.sections.faq, true);
  assert.equal(site.sections.reviews, true);
  assert.ok(site.faqs.length >= 5);
  assert.ok(site.reviews.length >= 3);
  assert.ok(site.reviews.every((review) => review.isExample === true));
});

test('demo is noindex and keeps submissions disabled', () => {
  assert.equal(site.seo.noIndex, true);
  assert.equal(site.demo.enabled, true);
  assert.equal(site.demo.submissionMode, 'discard');
  assert.equal(site.contact.formEmail, '');
});

test('all demo layouts provide concise mobile copy within editing limits', () => {
  assert.deepEqual(validateContentLengths(site), []);
  assert.ok(site.hero.mobileHeadline && site.hero.mobileSubheadline);
  assert.ok(site.intro.mobileTitle && site.intro.mobileBody);
  for (const content of [site, ...Object.values(site.templateContent)]) {
    for (const key of ['specialties', 'process', 'focus']) assert.ok((content[key] ?? []).every(item => item.mobileBody));
    assert.ok((content.faqs ?? []).every(item => item.mobileAnswer));
  }
});

test('site validation rejects overlong nested mobile text and accepts legacy content', () => {
  const minimal = { hero: { headline: '가'.repeat(40), mobileHeadline: '😀'.repeat(24) }, templateContent: { 'trust-blue': { focus: [{ body: '기존 설명', mobileBody: '가'.repeat(48) }], faqs: [{ answer: '기존 답변', mobileAnswer: '가'.repeat(80) }] } } };
  assert.deepEqual(validateContentLengths(minimal), []);
  minimal.templateContent['trust-blue'].focus[0].mobileBody += '나';
  minimal.templateContent['trust-blue'].faqs[0].mobileAnswer += '나';
  minimal.hero.headline += '나';
  const issues = validateContentLengths(minimal);
  assert.equal(issues.length, 3);
  assert.match(issues.join('\n'), /hero.headline.*40자/);
  assert.match(issues.join('\n'), /focus\[0\].mobileBody.*48자/);
  assert.match(issues.join('\n'), /faqs\[0\].mobileAnswer.*80자/);
  assert.deepEqual(validateContentLengths({ hero: { headline: '기존 제목' }, intro: { body: '기존 소개' } }), []);
  assert.match(validateContentLengths({ hero: { mobileHeadline: ' ' } })[0], /비어 있지 않은 문자열/);
});
