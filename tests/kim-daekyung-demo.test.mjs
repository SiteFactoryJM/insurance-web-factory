import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { renderSitePage } from '../.preview-dist/render/page.js';

const site = JSON.parse(fs.readFileSync(new URL('../sites/20260922-kimdaekyung/site.json', import.meta.url), 'utf8'));

test('Kim Daekyung demo uses the completed intake details and forest presentation', () => {
  assert.equal(site.agent.name, '김대경');
  assert.equal(site.agent.company, '해온지사');
  assert.equal(site.contact.phone, '010-9717-9450');
  assert.equal(site.palette, 'forest');
  assert.equal(site.agent.logoImage, '/assets/haeon-logo-stacked.svg');
  assert.equal(site.hero.certificationBadgeImage, '/sites/20260922-kimdaekyung/certification-badge.png');
  assert.equal(site.agent.profileImage, '/sites/20260922-kimdaekyung/profile.jpg');
  assert.equal(site.seo.noIndex, true);
  assert.equal(site.demo.submissionMode, 'discard');
});

test('profile introduction renders career beside the three adviser promises', () => {
  const html = renderSitePage(site, new Request('https://20260922-kimdaekyung.example.test/'));
  assert.match(html, /data-palette="forest"/);
  assert.match(html, /about-profile-values-with-career/);
  assert.match(html, /about-profile-values-with-career\{\s*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(html, /<strong>경력<\/strong><span>2018년 1월 ~ 현재<\/span>/);
  assert.match(html, /\.premium-page \.brand-logo\{width:96px;height:96px/);
  assert.match(html, /해온지사 로고/);
  assert.match(html, /class="hero-certification-badge"/);
  assert.match(html, /명장 우수인증설계사 인증 마크/);
});
