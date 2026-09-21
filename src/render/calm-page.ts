import type { DesignSectionId, SiteConfig } from '../types.js';
import { escapeHtml as e, safeUrl } from '../utils/html.js';
import { responsiveCopy as copy } from './copy.js';
import { getDesign } from './design-system.js';
import { formatIndex, renderContactButtons, renderContactForm } from './shared.js';
import { directPhoneHref } from '../utils/contact-links.js';

const profile = (site: SiteConfig, className = '', eager = false) => `<img class="${className}" src="${e(site.agent.profileImage || '/assets/profile-placeholder.svg')}" alt="${e(site.agent.name || '담당자')} 프로필" width="600" height="800" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>`;

/**
 * CH2/Navy/Agent Details. 이름·소속·전화·상담 시간을 한 덩어리로 보여 주는
 * Figma 컴포넌트입니다. 전화번호는 링크가 가능할 때만 `tel:`로 연결합니다.
 */
function adviserCard(site: SiteConfig): string {
  const phone = directPhoneHref(site.contact.phone);
  const number = e(site.contact.phone || '연락처 확인 필요');
  return `<div class="adviser-card"><div class="adviser-details"><p class="adviser-role">담당 설계사</p><p class="adviser-name">${e(site.agent.name || '담당자 이름')}</p><p class="adviser-org">${e(site.agent.company || '소속 확인 필요')}<br>${e(site.agent.title || '보험설계사')}</p>${phone ? `<a class="adviser-phone" data-contact-link="phone" href="${e(phone)}">${number}</a>` : `<p class="adviser-phone">${number}</p>`}<p class="adviser-hours">상담 시간 ${e(site.contact.availableHours || '담당자에게 확인')}</p></div></div>`;
}
const heading = (kicker: string, title: string, mobile?: string, description = '') => `<div class="section-heading"><p class="eyebrow">${e(kicker)}</p><h2>${copy(naturalHeading(title), naturalHeading(mobile))}</h2>${description ? `<p class="section-support">${e(description)}</p>` : ''}</div>`;

function naturalHeading(value?: string): string {
  return (value || '').replace(/\s*\n\s*/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

function hero(site: SiteConfig): string {
  const design = getDesign(site);
  const pattern = design.hero;
  const coreTopics = site.specialties.slice(0, 3).map(item => ({ label: item.title, tone: 'base' }));
  const extraTopics = [
    { label: '청구서비스', tone: 'claim' },
    { label: '청구 금액 확인', tone: 'amount' },
    { label: '부지급된 보험금 확인', tone: 'unpaid' },
    { label: '자동차사고', tone: 'auto' },
    { label: '배상책임사고', tone: 'liability' },
  ];
  const topicChips = [...coreTopics, ...extraTopics].map(item => `<span class="topic-chip topic-${item.tone}">${e(item.label)}</span>`).join('');
  const heroLogo = site.agent.logoImage ? `<div class="hero-brand-logo"><img src="${e(site.agent.logoImage)}" alt="${e(site.agent.company || '소속')} 로고" width="600" height="225"></div>` : '';
  const lead = `<div class="hero-copy">${heroLogo}<p class="eyebrow"><span class="small-line" aria-hidden="true"></span>${e(site.hero.eyebrow || '보험 상담 안내')}</p><h1 id="hero-title">${copy(naturalHeading(site.hero.headline || '가입한 보험, 무엇부터 확인할까요?'), naturalHeading(site.hero.mobileHeadline))}</h1><p class="hero-description">${copy(site.hero.subheadline, site.hero.mobileSubheadline)}</p>${topicChips ? `<div class="hero-topics" aria-label="주요 상담 분야">${topicChips}</div>` : ''}<div class="hero-actions">${renderContactButtons(site)}</div><p class="hero-note">상담은 가입 신청과 별개입니다.${site.hero.trustNote ? `<br>${e(site.hero.trustNote)}` : ''}</p></div>`;
  let visual: string;
  if (pattern === 'editorial') {
    visual = `<div class="hero-visual"><figure class="hero-scene"><img src="${e(site.hero.image || site.agent.profileImage || '/assets/profile-placeholder.svg')}" alt="${site.hero.image ? '' : e(`${site.agent.name || '담당자'} 프로필`)}" width="1536" height="1024" fetchpriority="high"></figure>${adviserCard(site)}</div>`;
  } else if (pattern === 'portrait') {
    visual = `<div class="hero-visual"><figure class="portrait-figure">${profile(site, '', true)}</figure>${adviserCard(site)}</div>`;
  } else {
    visual = `<div class="hero-visual hero-statement-person">${profile(site, '', true)}${adviserCard(site)}</div>`;
  }
  return `<section class="hero premium-hero hero-${pattern} container" id="home" aria-labelledby="hero-title">${visual}${lead}</section>`;
}

function services(site: SiteConfig): string {
  const design = getDesign(site);
  const items = site.specialties.map((item, i) => `<article class="service-card"><span class="section-index" aria-hidden="true">${formatIndex(i)}</span><div class="service-copy"><h3>${e(item.title)}</h3><p>${copy(item.body, item.mobileBody)}</p></div></article>`).join('');
  // 칸 수를 항목 수에 맞춰 마지막 줄에 한 칸만 남는 모양을 막습니다.
  return `<section class="section container services-section" id="specialties" aria-labelledby="services-title"><div class="section-heading"><p class="eyebrow">상담 분야</p><h2 id="services-title">어떤 상담이 필요하신가요?</h2><p class="section-support">지금 필요한 항목부터 골라 보세요.</p></div><div class="service-grid services-${design.services}" data-pattern="services-${design.services}" data-count="${site.specialties.length}">${items}</div></section>`;
}

function consultationPrinciple(site: SiteConfig): string {
  const title = site.intro.principleTitle?.trim() || '설명보다 먼저, 이해할 내용을 정리합니다.';
  const body = site.intro.principleBody?.trim() || '계약 조건을 확인하고 이해되지 않은 내용은 다시 질문한 뒤 결정할 수 있도록 안내합니다.';
  const layout = site.intro.principleLayout || '01';
  return `<aside class="adviser-principle principle-layout-${e(layout)}" aria-labelledby="adviser-principle-title"><div class="adviser-principle-copy"><p class="eyebrow">상담 원칙</p><h3 id="adviser-principle-title">${e(title)}</h3><p class="adviser-principle-body">${e(body)}</p></div></aside>`;
}
function about(site: SiteConfig): string {
  const pattern = getDesign(site).about;
  const extraFacts = `${site.agent.registrationNumber ? `<p><strong>설계사 등록번호</strong> ${e(site.agent.registrationNumber)}</p>` : ''}${site.agent.regions.length ? `<p><strong>상담 지역</strong> ${e(site.agent.regions.join(' · '))}</p>` : ''}`;
  const body = `<div class="about-copy"><p>${copy(site.intro.body, site.intro.mobileBody)}</p>${site.sections.career && site.career.length ? `<ul class="career-list">${site.career.map(c => `<li>${e(c)}</li>`).join('')}</ul>` : ''}${extraFacts ? `<div class="agent-meta">${extraFacts}</div>` : ''}${consultationPrinciple(site)}</div>`;
  const intro = `<div class="about-heading"><p class="eyebrow">담당자 소개</p><h2 id="about-title">${copy(naturalHeading(site.intro.title), naturalHeading(site.intro.mobileTitle))}</h2>${site.intro.philosophy && !site.intro.principleTitle ? `<p class="philosophy">${e(site.intro.philosophy)}</p>` : ''}</div>`;
  const image = `<figure class="about-portrait">${profile(site)}<figcaption>${e(site.agent.name)} · ${e(site.agent.title)}</figcaption></figure>`;
  const layout = pattern === 'profile' ? `${image}<div>${intro}${body}</div>` : pattern === 'quote' ? `<div class="about-quote">${intro}<blockquote>${e(site.intro.philosophy || site.intro.title)}</blockquote>${body}</div>` : `${intro}${body}`;
  return `<section class="section about-section" id="about" aria-labelledby="about-title"><div class="container about-grid about-${pattern}" data-pattern="about-${pattern}">${layout}</div></section>`;
}
function process(site: SiteConfig): string {
  if (!site.sections.process || !site.process.length) return '';
  const pattern = getDesign(site).process;
  return `<section class="section container process-section" id="process" aria-labelledby="process-title"><div class="section-heading"><p class="eyebrow">상담 과정</p><h2 id="process-title">상담은 이렇게 진행됩니다.</h2><p class="section-support">연락 후 필요한 범위와 일정을 함께 정합니다.</p></div><ol class="process-grid process-${pattern}" data-pattern="process-${pattern}">${site.process.map((p, i) => `<li><span class="process-number">${formatIndex(i)}</span><div><h3>${e(p.title)}</h3><p>${copy(p.body, p.mobileBody)}</p></div></li>`).join('')}</ol></section>`;
}

function reviews(site: SiteConfig): string {
  if (!site.sections.reviews || (!site.design && site.template === 'clean-minimal')) return '';
  const items = (site.reviews || []).filter(r => !r.isExample);
  if (!items.length) return '';
  return `<section class="section review-section" id="reviews" aria-labelledby="reviews-title"><div class="container"><div class="section-heading"><div><p class="eyebrow">고객 후기</p><h2 id="reviews-title">상담 후 남겨주신 이야기.</h2></div></div><div class="review-grid">${items.map(r => `<figure class="review-card"><blockquote>${e(r.quote)}</blockquote><figcaption>${e(r.author)}${r.context ? ` · ${e(r.context)}` : ''}</figcaption></figure>`).join('')}</div></div></section>`;
}

const SITE_HELP_FAQS = new Set([
  '상담 요청이 곧 보험 가입인가요?',
  '어떻게 연락하면 되나요?',
  '이 페이지에 신청서를 작성하나요?',
  '버튼을 누르면 메시지가 자동 발송되나요?',
  '전화 버튼이 PC에서 동작하지 않아요.',
  '오픈채팅을 열 수 없으면 어떻게 하나요?',
  '점검 결과가 자동으로 나오나요?',
  '입력한 정보가 이 사이트에 저장되나요?',
]);

function faq(site: SiteConfig): string {
  if (!site.sections.faq || !site.faqs.length) return '';
  const pattern = getDesign(site).faq;
  const items = site.faqs.filter(item => !SITE_HELP_FAQS.has(item.question)).slice(0, 4);
  if (!items.length) return '';
  return `<section class="section container faq-section faq-${pattern}" id="faq" aria-labelledby="faq-title"><div class="section-heading"><p class="eyebrow">자주 묻는 질문</p><h2 id="faq-title">많이 물어보시는 내용을 모았습니다.</h2></div><div class="faq-list" data-pattern="faq-${pattern}">${items.map((f, i) => `<details${pattern === 'columns' ? ' open' : ''}><summary><span class="faq-question"><span class="faq-number" aria-hidden="true">${formatIndex(i)}</span>${e(f.question)}</span><span aria-hidden="true">+</span></summary><p>${copy(f.answer, f.mobileAnswer)}</p></details>`).join('')}</div></section>`;
}

function focus(site: SiteConfig): string {
  const content = site.templateContent?.[site.template];
  if (!content?.focus?.length) return '';
  return `<section class="section container focus-section" id="focus">${heading('상담 전 살펴보기', content.focusTitle || '선택 전에 살펴볼 내용')}<div class="focus-grid">${content.focus.map((c, i) => `<article><span class="section-index">${formatIndex(i)}</span><h3>${e(c.title)}</h3><p>${copy(c.body, c.mobileBody)}</p></article>`).join('')}</div></section>`;
}

function casesTicker(site: SiteConfig): string {
  const items = [
    { title: '가족별 가입 내용', body: '가족마다 다른 계약과 보장 기간을 구분해 봅니다.' },
    { title: '자녀 보험 질문', body: '자녀 계약에서 다시 확인할 조건을 추립니다.' },
    { title: '부모님 보험 질문', body: '동의를 확인한 뒤 계약 관련 질문을 준비합니다.' },
    { title: '가족 보험료 확인', body: '가족별 납입액과 유지 기간을 비교합니다.' },
    { title: '배우자 계약 확인', body: '배우자 계약 조건을 함께 살펴봅니다.' },
    { title: '가족 계약 한눈에 정리', body: '흩어진 계약을 한 장으로 모아 정리합니다.' },
  ];
  const repeated = [...items, ...items];
  return `<section class="section cases-section" id="cases" aria-labelledby="cases-title"><div class="container">${heading('상담 포인트', '많이 확인하는 내용을 먼저 훑어보세요.', undefined, '자주 고르는 질문을 카드로 정리해 어떤 내용을 확인하는지 한눈에 볼 수 있습니다.')}<div class="cases-marquee" aria-label="상담 포인트가 흐르는 안내 영역"><ul class="cases-track">${repeated.map((item, i) => `<li class="cases-item"${i >= items.length ? ' aria-hidden="true"' : ''}><span class="cases-badge">${String((i % items.length) + 1).padStart(2, '0')}</span><div class="cases-copy"><h3>${e(item.title)}</h3><p>${e(item.body)}</p></div></li>`).join('')}</ul></div></div></section>`;
}
function contact(site: SiteConfig): string {
  return `<section class="section contact-section" id="contact" aria-labelledby="contact-title"><div class="container contact-grid"><div class="contact-copy"><p class="eyebrow">연락 방법</p><h2 id="contact-title">편한 방법으로 바로 문의하세요.</h2><p>전화·카카오톡·인스타그램 중 편한 방법을 선택하세요.</p></div>${renderContactForm(site)}</div></section>`;
}

export function renderCalmPage(site: SiteConfig): string {
  const design = getDesign(site);
  const modules: Record<DesignSectionId, () => string> = { services: () => services(site), about: () => about(site), process: () => process(site), reviews: () => reviews(site), faq: () => faq(site), contact: () => contact(site) };
  const sections = design.sectionOrder.filter(key => !design.hiddenSections.includes(key)).map(key => modules[key]()).join('');
  return `<main id="main" tabindex="-1" data-typography-version="balanced-v3" class="ornament-${design.ornament} density-${design.density}">${hero(site)}${focus(site)}${casesTicker(site)}${sections}</main>`;
}
