import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { renderSitePage } from '../.preview-dist/render/page.js';

const site = JSON.parse(fs.readFileSync(new URL('../sites/20260922-kimdaekyung/site.json', import.meta.url), 'utf8'));
const kimGyeonghyeon = JSON.parse(fs.readFileSync(new URL('../sites/agent-kim/site.json', import.meta.url), 'utf8'));

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
  assert.equal(site.template, kimGyeonghyeon.template);
  assert.equal(site.headingFont, kimGyeonghyeon.headingFont);
  assert.equal(site.hero.brandLayout, kimGyeonghyeon.hero.brandLayout);
  assert.equal(site.sections.recruitment, true);
  assert.equal(site.footer.note, '');
  assert.equal(site.footer.hideInstagram, true);
  assert.deepEqual(site.specialties, [
    { title: '가족별 가입 내용', body: '가족마다 다른 계약과 보장 기간을 구분합니다.', mobileBody: '가족마다 다른 계약과 보장 기간을 구분합니다.' },
    { title: '자녀 보험 질문', body: '자녀의 가입 내역에서 궁금한 조건을 정리합니다.', mobileBody: '자녀의 가입 내역에서 궁금한 조건을 정리합니다.' },
    { title: '부모님 보험 질문', body: '부모님의 동의를 확인한 뒤 계약 관련 질문을 준비합니다.', mobileBody: '부모님의 동의를 확인한 뒤 계약 관련 질문을 준비합니다.' },
    { title: '가족 보험료 확인', body: '가족별 납입액과 유지 기간을 나누어 살펴봅니다.', mobileBody: '가족별 납입액과 유지 기간을 나누어 살펴봅니다.' },
    { title: '배우자 계약 확인', body: '배우자의 동의를 확인한 뒤 계약 조건을 함께 살펴봅니다.', mobileBody: '배우자의 동의를 확인한 뒤 계약 조건을 함께 살펴봅니다.' },
    { title: '가족 계약 한눈에 정리', body: '흩어져 있는 가족 계약을 한 장으로 모아 봅니다.', mobileBody: '흩어져 있는 가족 계약을 한 장으로 모아 봅니다.' },
  ]);
  assert.deepEqual(site.faqs.map(({ question }) => question), [
    '상담하면 꼭 가입해야 하나요?',
    '다른회사에서 가입 및 제안받은 보험도 봐주시나요?',
    '멀리 살아도 상담이 가능한가요?',
    '보험금 청구도 정말 도와주시나요?',
  ]);
});

test('profile introduction renders career beside the three adviser promises', () => {
  const html = renderSitePage(site, new Request('https://20260922-kimdaekyung.example.test/'));
  assert.match(html, /data-palette="forest"/);
  assert.match(html, /about-profile-values-with-career/);
  assert.match(html, /about-profile-values-with-career\{\s*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(html, /<strong>경력<\/strong><span>2018년 1월 ~ 현재<\/span>/);
  assert.match(html, /\.premium-page \.brand-logo\{width:96px;height:96px/);
  assert.match(html, /해온지사 로고/);
  assert.match(html, /class="hero-certification-badge-row"><img class="hero-certification-badge"/);
  assert.match(html, /명장 우수인증설계사 인증 마크/);
  assert.doesNotMatch(html, /data-instagram-link/);
  assert.doesNotMatch(html, /보험의 선택은 충분한 이해에서 시작합니다/);
  assert.match(html, /© \d{4}-\d{2} 김대경/);
});
