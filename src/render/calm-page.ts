import type { DesignSectionId, SiteConfig } from '../types.js';
import { escapeHtml as e, safeUrl } from '../utils/html.js';
import { responsiveCopy as copy } from './copy.js';
import { getDesign } from './design-system.js';
import { arrow, formatIndex, renderContactForm, renderReviewNotice, renderSocialLinks } from './shared.js';

const profile = (site: SiteConfig, className = '', eager = false) => `<img class="${className}" src="${e(site.agent.profileImage || '/assets/profile-placeholder.svg')}" alt="${e(site.agent.name || '설계사')} 프로필" width="600" height="800" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>`;
const identity = (site: SiteConfig) => `<div class="adviser-signature"><strong>${e(site.agent.name || '설계사 이름')}</strong><span>${e(site.agent.title)}<br>${e(site.agent.company)}</span></div>`;
const heading = (kicker: string, title: string, mobile?: string) => `<div class="section-heading"><div><p class="eyebrow">${e(kicker)}</p><h2>${copy(title, mobile)}</h2></div></div>`;

function hero(site: SiteConfig): string {
  const design = getDesign(site);
  const pattern = design.hero;
  const contactTarget = design.hiddenSections.includes("contact") ? "#footer" : "#contact";
  const servicesTarget = design.hiddenSections.includes("services") ? "#footer" : "#specialties";
  const lead = `<div class="hero-copy"><p class="eyebrow"><span class="small-line" aria-hidden="true"></span>${e(site.hero.eyebrow || '당신의 선택을 위한 보험 상담')}</p><h1 id="hero-title">${copy(site.hero.headline || '나에게 맞는 보험,\n이해하는 것부터.', site.hero.mobileHeadline)}</h1><p class="hero-description">${copy(site.hero.subheadline, site.hero.mobileSubheadline)}</p><div class="hero-actions"><a class="button" href="${contactTarget}">${e(site.hero.primaryCtaLabel || '상담 요청하기')} ${arrow}</a><a class="text-link" href="${servicesTarget}">${e(site.hero.secondaryCtaLabel || '상담 분야 보기')} <span aria-hidden="true">↓</span></a></div><p class="hero-note">상담 요청은 보험 가입 신청이 아닙니다.${site.hero.trustNote ? `<br>${e(site.hero.trustNote)}` : ""}</p>${identity(site)}</div>`;
  let visual: string;
  if (pattern === 'editorial') {
    visual = `<div class="hero-visual"><figure class="hero-scene"><img src="${e(site.hero.image || site.agent.profileImage || '/assets/profile-placeholder.svg')}" alt="${site.hero.image ? '' : e(`${site.agent.name || '설계사'} 프로필`)}" width="1536" height="1024" fetchpriority="high"><figcaption>차분히 살펴보고, 충분히 이해하는 시간.</figcaption></figure><div class="hero-adviser">${site.hero.image ? profile(site, '', true) : ''}<div><p>함께 상담할 사람</p><strong>${e(site.agent.name)}</strong><span>${e(site.agent.company)}</span></div></div></div>`;
  } else if (pattern === 'portrait') {
    visual = `<figure class="portrait-figure">${profile(site, '', true)}<figcaption><span>PERSONAL ADVISOR</span><strong>${e(site.agent.name)} ${e(site.agent.title)}</strong></figcaption></figure>`;
  } else {
    visual = `<div class="hero-statement-person">${profile(site, '', true)}<div><p>${e(site.agent.company)}</p><strong>${e(site.agent.name)} ${e(site.agent.title)}</strong><span>${e(site.contact.availableHours)}</span></div></div>`;
  }
  return `<section class="hero premium-hero hero-${pattern} container" id="home" aria-labelledby="hero-title">${lead}${visual}</section><div class="container trust-strip"><p>상황을 먼저 듣는 상담</p><p>쉽게 이해하는 보장 내용</p><p>충분히 비교하는 선택</p></div>`;
}

function services(site: SiteConfig): string {
  const pattern = getDesign(site).services;
  const items = site.specialties.map((item, i) => `<article class="service-card"><span class="section-index" aria-hidden="true">${formatIndex(i)}</span><h3>${e(item.title)}</h3><p>${copy(item.body, item.mobileBody)}</p><a class="service-link" href="${getDesign(site).hiddenSections.includes("contact") ? "#footer" : "#contact"}" aria-label="${e(item.title)} 상담 준비">${arrow}</a></article>`).join('');
  return `<section class="section container services-section" id="specialties" aria-labelledby="services-title"><div class="section-heading"><div><p class="eyebrow">상담 분야 / EXPERTISE</p><h2 id="services-title">보험을 고르기 전에,<br>내 상황을 먼저.</h2></div><p>궁금한 점 하나부터 시작해도 괜찮습니다.</p></div><div class="service-grid services-${pattern}" data-pattern="services-${pattern}">${items}</div></section>`;
}

function about(site: SiteConfig): string {
  const pattern = getDesign(site).about;
  const facts = `<dl class="agent-facts"><div><dt>소속</dt><dd>${e(site.agent.company)} ${e(site.agent.branch || '')}</dd></div><div><dt>상담 시간</dt><dd>${e(site.contact.availableHours)}</dd></div>${site.agent.registrationNumber ? `<div><dt>설계사 등록번호</dt><dd>${e(site.agent.registrationNumber)}</dd></div>` : ''}${site.agent.regions.length ? `<div><dt>상담 지역</dt><dd>${e(site.agent.regions.join(' · '))}</dd></div>` : ''}</dl>`;
  const body = `<div class="about-copy"><p>${copy(site.intro.body, site.intro.mobileBody)}</p>${site.sections.career && site.career.length ? `<ul class="career-list">${site.career.map(c => `<li>${e(c)}</li>`).join('')}</ul>` : ''}${identity(site)}${facts}</div>`;
  const intro = `<div class="about-heading"><p class="eyebrow">상담자 소개 / ABOUT</p><h2 id="about-title">${copy(site.intro.title, site.intro.mobileTitle)}</h2>${site.intro.philosophy ? `<p class="philosophy">${e(site.intro.philosophy)}</p>` : ''}</div>`;
  const image = `<figure class="about-portrait">${profile(site)}<figcaption>${e(site.agent.name)} · ${e(site.agent.title)}</figcaption></figure>`;
  const layout = pattern === 'profile' ? `${image}<div>${intro}${body}</div>` : pattern === 'quote' ? `<div class="about-quote">${intro}<blockquote>${e(site.intro.philosophy || site.intro.title)}</blockquote>${body}</div>` : `${intro}${body}`;
  return `<section class="section about-section" id="about" aria-labelledby="about-title"><div class="container about-grid about-${pattern}" data-pattern="about-${pattern}">${layout}</div></section>`;
}

function process(site: SiteConfig): string {
  if (!site.sections.process || !site.process.length) return '';
  const pattern = getDesign(site).process;
  return `<section class="section container process-section" id="process" aria-labelledby="process-title"><div class="section-heading"><div><p class="eyebrow">상담 과정 / HOW WE WORK</p><h2 id="process-title">서두르지 않고,<br>하나씩 명확하게.</h2></div><p>질문을 정리하는 순간부터 함께합니다.</p></div><ol class="process-grid process-${pattern}" data-pattern="process-${pattern}">${site.process.map((p, i) => `<li><span class="process-number">${formatIndex(i)}</span><div><h3>${e(p.title)}</h3><p>${copy(p.body, p.mobileBody)}</p></div></li>`).join('')}</ol></section>`;
}

function reviews(site: SiteConfig): string {
  if (!site.sections.reviews || (!site.design && site.template === 'clean-minimal')) return '';
  const items = (site.reviews || []).filter(r => site.demo?.enabled || !r.isExample);
  if (!items.length) return '';
  return `<section class="section review-section" id="reviews" aria-labelledby="reviews-title"><div class="container"><div class="section-heading"><div><p class="eyebrow">${items.some(r => r.isExample) ? '상담 후기 · 디자인 예시' : '고객 후기'}</p><h2 id="reviews-title">좋은 상담의 기준은,<br>고객이 이해하는 순간.</h2></div></div>${items.some(r => r.isExample) ? renderReviewNotice() : ''}<div class="review-grid">${items.map(r => `<figure class="review-card">${r.isExample ? '<span class="badge">디자인 예시 · 실제 후기 아님</span>' : ''}<blockquote>${e(r.quote)}</blockquote><figcaption>${e(r.author)}${r.context ? ` · ${e(r.context)}` : ''}</figcaption></figure>`).join('')}</div></div></section>`;
}

function faq(site: SiteConfig): string {
  if (!site.sections.faq || !site.faqs.length) return '';
  const pattern = getDesign(site).faq;
  return `<section class="section container faq-section faq-${pattern}" id="faq" aria-labelledby="faq-title"><div><p class="eyebrow">자주 묻는 질문 / FAQ</p><h2 id="faq-title">마음 편히,<br>물어보세요.</h2></div><div class="faq-list" data-pattern="faq-${pattern}">${site.faqs.map((f, i) => `<details${pattern === "columns" ? " open" : ""}><summary><span class="faq-question"><span class="faq-number" aria-hidden="true">${formatIndex(i)}</span>${e(f.question)}</span><span aria-hidden="true">+</span></summary><p>${copy(f.answer, f.mobileAnswer)}</p></details>`).join('')}</div></section>`;
}

function focus(site: SiteConfig): string {
  const content = site.templateContent?.[site.template];
  if (!content?.focus?.length) return '';
  return `<section class="section container focus-section" id="focus">${heading('상담 전 살펴보기', content.focusTitle || '선택 전에 확인할 내용')}<div class="focus-grid">${content.focus.map((c, i) => `<article><span class="section-index">${formatIndex(i)}</span><h3>${e(c.title)}</h3><p>${copy(c.body, c.mobileBody)}</p></article>`).join('')}</div></section>`;
}

function contact(site: SiteConfig): string {
  return `<section class="section contact-section" id="contact" aria-labelledby="contact-title"><div class="container contact-grid"><div class="contact-copy"><p class="eyebrow">상담 준비 / LET'S TALK</p><h2 id="contact-title">당신의 이야기를<br>들려주세요.</h2><p>${copy('가입을 결정하기 전에, 지금의 상황부터 함께 살펴보겠습니다.', '지금의 상황부터 함께 살펴봅니다.')}</p><div class="contact-person">${profile(site)}<div><strong>${e(site.agent.name)} ${e(site.agent.title)}</strong><span>${e(site.agent.company)}</span></div></div><p class="support-note">현재 신청 화면은 디자인 확인용입니다.<br>실제 상담은 접수되지 않습니다.</p>${renderSocialLinks(site)}</div>${site.sections.contactForm ? renderContactForm(site) : '<div class="notice-card"><h3>상담 방법을 확인해 주세요.</h3><p>현재 페이지에서는 상담을 접수하지 않습니다.</p></div>'}</div></section>`;
}

export function renderCalmPage(site: SiteConfig): string {
  const design = getDesign(site);
  const modules: Record<DesignSectionId, () => string> = { services: () => services(site), about: () => about(site), process: () => process(site), reviews: () => reviews(site), faq: () => faq(site), contact: () => contact(site) };
  const sections = design.sectionOrder.filter(key => !design.hiddenSections.includes(key)).map(key => modules[key]()).join('');
  const location = site.sections.location && site.contact.officeAddress ? `<section class="section container location-section"><p class="eyebrow">찾아오시는 길</p><h2>${e(site.contact.officeAddress)}</h2>${safeUrl(site.contact.mapUrl) ? `<a class="text-link" href="${e(safeUrl(site.contact.mapUrl))}" target="_blank" rel="noopener noreferrer">지도 확인 (새 창) ${arrow}</a>` : ''}</section>` : '';
  return `<main id="main" tabindex="-1" class="ornament-${design.ornament} density-${design.density}">${hero(site)}${focus(site)}${sections}${location}</main>`;
}
