import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const site = JSON.parse(fs.readFileSync(new URL('../sites/demo-agent/site.json', import.meta.url), 'utf8'));

test('demo profile uses the supplied adviser information', () => {
  assert.equal(site.agent.name, '이윤복');
  assert.equal(site.agent.title, '보험설계사');
  assert.equal(site.agent.company, '유퍼스트 해온지');
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
