import type { DesignSectionId, SiteConfig } from '../types.js';
import { escapeHtml as e, safeUrl } from '../utils/html.js';
import { responsiveCopy as copy } from './copy.js';
import { getDesign } from './design-system.js';
import { arrow, formatIndex, renderContactButtons, renderContactForm } from './shared.js';
import { directPhoneHref } from '../utils/contact-links.js';

const profile = (site: SiteConfig, className = '', eager = false) => `<img class="${className}" src="${e(site.agent.profileImage || '/assets/profile-placeholder.svg')}" alt="${e(site.agent.name || '담당자')} 프로필" width="600" height="800" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>`;
const identity = (site: SiteConfig) => `<div class="adviser-signature"><strong>${e(site.agent.name || '담당자 이름')}</strong><span>${e(site.agent.title)}<br>${e(site.agent.company)}</span></div>`;

/**
 * CH2/Navy/Agent Details. 이름·소속·전화·상담 시간을 한 덩어리로 보여 주는
 * Figma 컴포넌트입니다. 전화번호는 링크가 가능할 때만 `tel:`로 연결합니다.
 */
function adviserCard(site: SiteConfig): string {
  const phone = directPhoneHref(site.contact.phone);
  const number = e(site.contact.phone || '연락처 확인 필요');
  return `<div class="adviser-card"><div class="adviser-details"><p class="adviser-role">담당 설계사</p><p class="adviser-name">${e(site.agent.name || '담당자 이름')}</p><p class="adviser-org">${e(site.agent.company || '소속 확인 필요')}<br>${e(site.agent.title || '보험설계사')}</p>${phone ? `<a class="adviser-phone" data-contact-link="phone" href="${e(phone)}">${number}</a>` : `<p class="adviser-phone">${number}</p>`}<p class="adviser-hours">상담 시간 ${e(site.contact.availableHours || '담당자에게 확인')}</p></div></div>`;
}
const heading = (kicker: string, title: string, mobile?: string, description = '') => `<div class="section-heading"><p class="eyebrow">${e(kicker)}</p><h2>${copy(title, mobile)}</h2>${description ? `<p class="section-support">${e(description)}</p>` : ''}</div>`;

function hero(site: SiteConfig): string {
  const design = getDesign(site);
  const pattern = design.hero;
  const servicesTarget = design.hiddenSections.includes('services') ? '#footer' : '#specialties';
  const lead = `<div class="hero-copy"><p class="eyebrow"><span class="small-line" aria-hidden="true"></span>${e(site.hero.eyebrow || '보험 상담 안내')}</p><h1 id="hero-title">${copy(site.hero.headline || '가입한 보험,\n무엇부터 확인할까요?', site.hero.mobileHeadline)}</h1><p class="hero-description">${copy(site.hero.subheadline, site.hero.mobileSubheadline)}</p><div class="hero-actions">${renderContactButtons(site)}<a class="text-link" href="${servicesTarget}">${e(site.hero.secondaryCtaLabel || '상담 분야 보기')} <span aria-hidden="true">↓</span></a></div><p class="hero-note">상담 요청은 보험 가입 신청이 아닙니다.${site.hero.trustNote ? `<br>${e(site.hero.trustNote)}` : ''}</p>${identity(site)}</div>`;
  let visual: string;
  if (pattern === 'editorial') {
    visual = `<div class="hero-visual"><figure class="hero-scene"><img src="${e(site.hero.image || site.agent.profileImage || '/assets/profile-placeholder.svg')}" alt="${site.hero.image ? '' : e(`${site.agent.name || '담당자'} 프로필`)}" width="1536" height="1024" fetchpriority="high"><figcaption>담당자와 상담 범위를 확인한 뒤 문의하세요.</figcaption></figure>${adviserCard(site)}</div>`;
  } else if (pattern === 'portrait') {
    visual = `<div class="hero-visual"><figure class="portrait-figure">${profile(site, '', true)}</figure>${adviserCard(site)}</div>`;
  } else {
    visual = `<div class="hero-visual hero-statement-person">${profile(site, '', true)}${adviserCard(site)}</div>`;
  }
  return `<section class="hero premium-hero hero-${pattern} container" id="home" aria-labelledby="hero-title">${lead}${visual}</section><div class="container trust-strip"><p>담당자 · ${e(site.agent.name || '확인 필요')}</p><p>소속 · ${e(site.agent.company || '확인 필요')}</p><p>상담 시간 · ${e(site.contact.availableHours || '담당자에게 확인')}</p></div>`;
}

function services(site: SiteConfig): string {
  const design = getDesign(site);
  const items = site.specialties.map((item, i) => `<article class="service-card"><span class="section-index" aria-hidden="true">${formatIndex(i)}</span><div class="service-copy"><h3>${e(item.title)}</h3><p>${copy(item.body, item.mobileBody)}</p></div><a class="service-link" href="${design.hiddenSections.includes('contact') ? '#footer' : '#contact'}" aria-label="${e(item.title)} 문의 방법 보기">${arrow}</a></article>`).join('');
  // 칸 수를 항목 수에 맞춰 마지막 줄에 한 칸만 남는 모양을 막습니다.
  return `<section class="section container services-section" id="specialties" aria-labelledby="services-title"><div class="section-heading"><p class="eyebrow">상담 분야</p><h2 id="services-title">어떤 내용을 확인하고 싶으신가요?</h2><p class="section-support">구체적인 취급 범위는 담당자에게 확인해 주세요.</p></div><div class="service-grid services-${design.services}" data-pattern="services-${design.services}" data-count="${site.specialties.length}">${items}</div></section>`;
}

function about(site: SiteConfig): string {
  const pattern = getDesign(site).about;
  const facts = `<dl class="agent-facts"><div><dt>소속</dt><dd>${e(site.agent.company)} ${e(site.agent.branch || '')}</dd></div><div><dt>상담 시간</dt><dd>${e(site.contact.availableHours)}</dd></div>${site.agent.registrationNumber ? `<div><dt>설계사 등록번호</dt><dd>${e(site.agent.registrationNumber)}</dd></div>` : ''}${site.agent.regions.length ? `<div><dt>상담 지역</dt><dd>${e(site.agent.regions.join(' · '))}</dd></div>` : ''}</dl>`;
  const body = `<div class="about-copy"><p>${copy(site.intro.body, site.intro.mobileBody)}</p>${site.sections.career && site.career.length ? `<ul class="career-list">${site.career.map(c => `<li>${e(c)}</li>`).join('')}</ul>` : ''}${identity(site)}${facts}</div>`;
  const intro = `<div class="about-heading"><p class="eyebrow">담당자 소개</p><h2 id="about-title">${copy(site.intro.title, site.intro.mobileTitle)}</h2>${site.intro.philosophy ? `<p class="philosophy">${e(site.intro.philosophy)}</p>` : ''}</div>`;
  const image = `<figure class="about-portrait">${profile(site)}<figcaption>${e(site.agent.name)} · ${e(site.agent.title)}</figcaption></figure>`;
  const layout = pattern === 'profile' ? `${image}<div>${intro}${body}</div>` : pattern === 'quote' ? `<div class="about-quote">${intro}<blockquote>${e(site.intro.philosophy || site.intro.title)}</blockquote>${body}</div>` : `${intro}${body}`;
  return `<section class="section about-section" id="about" aria-labelledby="about-title"><div class="container about-grid about-${pattern}" data-pattern="about-${pattern}">${layout}</div></section>`;
}

function process(site: SiteConfig): string {
  if (!site.sections.process || !site.process.length) return '';
  const pattern = getDesign(site).process;
  return `<section class="section container process-section" id="process" aria-labelledby="process-title"><div class="section-heading"><p class="eyebrow">상담 과정</p><h2 id="process-title">문의 전 준비부터 설명 확인까지.</h2><p class="section-support">구체적인 일정과 진행 방식은 담당자와 협의합니다.</p></div><ol class="process-grid process-${pattern}" data-pattern="process-${pattern}">${site.process.map((p, i) => `<li><span class="process-number">${formatIndex(i)}</span><div><h3>${e(p.title)}</h3><p>${copy(p.body, p.mobileBody)}</p></div></li>`).join('')}</ol></section>`;
}

function reviews(site: SiteConfig): string {
  if (!site.sections.reviews || (!site.design && site.template === 'clean-minimal')) return '';
  const items = (site.reviews || []).filter(r => !r.isExample);
  if (!items.length) return '';
  return `<section class="section review-section" id="reviews" aria-labelledby="reviews-title"><div class="container"><div class="section-heading"><div><p class="eyebrow">고객 후기</p><h2 id="reviews-title">상담 후 남겨주신 이야기.</h2></div></div><div class="review-grid">${items.map(r => `<figure class="review-card"><blockquote>${e(r.quote)}</blockquote><figcaption>${e(r.author)}${r.context ? ` · ${e(r.context)}` : ''}</figcaption></figure>`).join('')}</div></div></section>`;
}

function faq(site: SiteConfig): string {
  if (!site.sections.faq || !site.faqs.length) return '';
  const pattern = getDesign(site).faq;
  return `<section class="section container faq-section faq-${pattern}" id="faq" aria-labelledby="faq-title"><div class="section-heading"><p class="eyebrow">자주 묻는 질문</p><h2 id="faq-title">연락하기 전에 확인해 보세요.</h2></div><div class="faq-list" data-pattern="faq-${pattern}">${site.faqs.map((f, i) => `<details${pattern === 'columns' ? ' open' : ''}><summary><span class="faq-question"><span class="faq-number" aria-hidden="true">${formatIndex(i)}</span>${e(f.question)}</span><span aria-hidden="true">+</span></summary><p>${copy(f.answer, f.mobileAnswer)}</p></details>`).join('')}</div></section>`;
}

function focus(site: SiteConfig): string {
  const content = site.templateContent?.[site.template];
  if (!content?.focus?.length) return '';
  return `<section class="section container focus-section" id="focus">${heading('상담 전 살펴보기', content.focusTitle || '선택 전에 확인할 내용')}<div class="focus-grid">${content.focus.map((c, i) => `<article><span class="section-index">${formatIndex(i)}</span><h3>${e(c.title)}</h3><p>${copy(c.body, c.mobileBody)}</p></article>`).join('')}</div></section>`;
}

function contact(site: SiteConfig): string {
  return `<section class="section contact-section" id="contact" aria-labelledby="contact-title"><div class="container contact-grid"><div class="contact-copy"><p class="eyebrow">연락 방법</p><h2 id="contact-title">궁금한 내용을 직접 문의하세요.</h2><p>보험 종류를 미리 고르거나 신청서를 작성할 필요가 없습니다. 상담 범위와 일정을 담당자에게 확인해 주세요.</p><div class="contact-person">${profile(site)}<div><strong>${e(site.agent.name)} ${e(site.agent.title)}</strong><span>${e(site.agent.company)}</span></div></div></div>${renderContactForm(site)}</div></section>`;
}

export function renderCalmPage(site: SiteConfig): string {
  const design = getDesign(site);
  const modules: Record<DesignSectionId, () => string> = { services: () => services(site), about: () => about(site), process: () => process(site), reviews: () => reviews(site), faq: () => faq(site), contact: () => contact(site) };
  const sections = design.sectionOrder.filter(key => !design.hiddenSections.includes(key)).map(key => modules[key]()).join('');
  const location = site.sections.location && site.contact.officeAddress ? `<section class="section container location-section"><p class="eyebrow">찾아오시는 길</p><h2>${e(site.contact.officeAddress)}</h2>${safeUrl(site.contact.mapUrl) ? `<a class="text-link" href="${e(safeUrl(site.contact.mapUrl))}" target="_blank" rel="noopener noreferrer">지도 확인 (새 창) ${arrow}</a>` : ''}</section>` : '';
  return `<main id="main" tabindex="-1" data-typography-version="balanced-v2" class="ornament-${design.ornament} density-${design.density}">${hero(site)}${focus(site)}${sections}${location}</main>`;
}
